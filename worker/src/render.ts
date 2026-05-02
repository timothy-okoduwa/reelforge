// worker/src/render.ts
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import fs from "fs";
import path from "path";
import axios from "axios";
import { uploadToCloudinary } from "./cloudinary";
import { getCaptionFilter } from "./captions";
import { getMusicUrl } from "./music";

if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

interface SceneInput {
  imageUrl: string;
  audioUrl: string | null;
  durationSeconds: number;
  narration: string;
}

export async function renderVideo(
  jobId: string,
  scenes: SceneInput[],
  captionStyle: string,
  musicTrack: string,
  callbackUrl: string
): Promise<void> {
  const tmpDir = `/tmp/${jobId}`;
  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    // Download all scene assets
    const sceneFiles: { image: string; audio: string | null; duration: number; narration: string }[] = [];

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const imgPath = path.join(tmpDir, `scene_${i}.png`);
      const audPath = scene.audioUrl ? path.join(tmpDir, `scene_${i}.mp3`) : null;

      // Download image
      const imgRes = await axios.get(scene.imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, imgRes.data);

      // Download audio if available
      if (scene.audioUrl && audPath) {
        try {
          const audRes = await axios.get(scene.audioUrl, { responseType: "arraybuffer" });
          fs.writeFileSync(audPath, audRes.data);
        } catch {
          // Audio download failed, will be silent
        }
      }

      sceneFiles.push({
        image: imgPath,
        audio: audPath && fs.existsSync(audPath) ? audPath : null,
        duration: scene.durationSeconds,
        narration: scene.narration,
      });
    }

    // Create individual scene video clips
    const clipPaths: string[] = [];
    for (let i = 0; i < sceneFiles.length; i++) {
      const scene = sceneFiles[i];
      const clipPath = path.join(tmpDir, `clip_${i}.mp4`);

      await new Promise<void>((resolve, reject) => {
        let cmd = ffmpeg()
          .input(scene.image)
          .inputOptions(["-loop 1"])
          .outputOptions([
            "-t", String(scene.duration),
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-vf", "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2",
            "-r", "30",
          ]);

        if (scene.audio) {
          cmd = cmd
            .input(scene.audio)
            .outputOptions(["-c:a", "aac", "-b:a", "128k", "-shortest"]);
        } else {
          cmd = cmd.outputOptions(["-an"]);
        }

        const captionFilter = getCaptionFilter(captionStyle, scene.narration);
        if (captionFilter) {
          cmd = cmd.outputOptions(["-vf", `scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,${captionFilter}`]);
        }

        cmd
          .output(clipPath)
          .on("end", () => resolve())
          .on("error", (err) => reject(err))
          .run();
      });

      clipPaths.push(clipPath);
    }

    // Write concat file
    const concatPath = path.join(tmpDir, "concat.txt");
    fs.writeFileSync(
      concatPath,
      clipPaths.map((p) => `file '${p}'`).join("\n")
    );

    const mergedPath = path.join(tmpDir, "merged.mp4");
    const finalPath = path.join(tmpDir, "final.mp4");

    // Concatenate clips
    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(concatPath)
        .inputOptions(["-f", "concat", "-safe", "0"])
        .outputOptions(["-c:v", "libx264", "-c:a", "aac", "-r", "30"])
        .output(mergedPath)
        .on("end", () => resolve())
        .on("error", (err) => reject(err))
        .run();
    });

    // Add background music
    const musicUrl = getMusicUrl(musicTrack);
    if (musicUrl) {
      const musicPath = path.join(tmpDir, "bg_music.mp3");
      try {
        const musicRes = await axios.get(musicUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(musicPath, musicRes.data);

        await new Promise<void>((resolve, reject) => {
          ffmpeg()
            .input(mergedPath)
            .input(musicPath)
            .outputOptions([
              "-c:v", "copy",
              "-c:a", "aac",
              "-filter:a", "[1:a]volume=0.15[bg];[0:a][bg]amix=inputs=2:duration=first:dropout_transition=3[a]",
              "-map", "0:v",
              "-map", "[a]",
            ])
            .output(finalPath)
            .on("end", () => resolve())
            .on("error", (err) => reject(err))
            .run();
        });
      } catch {
        // Music unavailable, use merged as final
        fs.copyFileSync(mergedPath, finalPath);
      }
    } else {
      fs.copyFileSync(mergedPath, finalPath);
    }

    // Upload to Cloudinary
    const videoUrl = await uploadToCloudinary(finalPath, `reelforge/videos/${jobId}`, "video");

    // Generate thumbnail
    const thumbPath = path.join(tmpDir, "thumb.jpg");
    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(finalPath)
        .screenshots({
          timestamps: ["0.5"],
          filename: "thumb.jpg",
          folder: tmpDir,
          size: "1080x1920",
        })
        .on("end", () => resolve())
        .on("error", (err) => reject(err));
    });

    const thumbnailUrl = await uploadToCloudinary(thumbPath, `reelforge/thumbnails/${jobId}`, "image");

    // Send callback
    await axios.post(callbackUrl, {
      jobId,
      videoUrl,
      thumbnailUrl,
      success: true,
    });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown render error";

    try {
      await axios.post(callbackUrl, {
        jobId,
        videoUrl: "",
        thumbnailUrl: "",
        success: false,
        error: errorMessage,
      });
    } catch {
      // Callback failed
    }
  } finally {
    // Clean up temp directory
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}
