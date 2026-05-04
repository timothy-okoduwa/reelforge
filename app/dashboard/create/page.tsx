"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useJobStatus } from "@/hooks/useJobStatus";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import NicheSelector from "@/components/create/NicheSelector";
import StylePicker from "@/components/create/StylePicker";
import ScriptEditor from "@/components/create/ScriptEditor";
import VideoProgress from "@/components/create/VideoProgress";
import type {
  Niche,
  ArtStyle,
  MusicMood,
  CaptionStyle,
  VideoLength,
  Language,
  Script,
} from "@/types";

type WizardStep = "niche" | "style" | "generate" | "done";

interface StepNiche {
  niche: Niche | "";
  length: VideoLength | "";
  language: Language | "";
}

interface StepStyle {
  artStyle: ArtStyle | "";
  musicMood: MusicMood | "";
  captionStyle: CaptionStyle | "";
}

interface StepGenerate {
  script: Script | null;
  scriptId: string | null;
  jobId: string | null;
  generating: "script" | "video" | null;
}

export default function CreateVideoPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState<WizardStep>("niche");
  const [nicheData, setNicheData] = useState<StepNiche>({
    niche: "",
    length: 60,
    language: "en",
  });
  const [styleData, setStyleData] = useState<StepStyle>({
    artStyle: "",
    musicMood: "none",
    captionStyle: "bold_white",
  });
  const [generateData, setGenerateData] = useState<StepGenerate>({
    script: null,
    scriptId: null,
    jobId: null,
    generating: null,
  });
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Poll job status and transition to "done" when complete
  const { status: jobStatus, videoUrl: jobVideoUrl, thumbnailUrl: jobThumbUrl, error: jobError } =
    useJobStatus(generateData.jobId);

  useEffect(() => {
    if (jobStatus === "complete" && jobVideoUrl) {
      setVideoUrl(jobVideoUrl);
      setThumbnailUrl(jobThumbUrl);
      setGenerateData((prev) => ({ ...prev, generating: null }));
      setStep("done");
    }
    if (jobStatus === "failed" && jobError) {
      setError(jobError);
      setGenerateData((prev) => ({ ...prev, generating: null }));
    }
  }, [jobStatus, jobVideoUrl, jobThumbUrl, jobError]);

  const handleNicheNext = () => {
    if (!nicheData.niche) return;
    setStep("style");
  };

  const handleStyleBack = () => {
    setStep("niche");
  };

  const handleStyleNext = () => {
    if (!styleData.artStyle) return;
    setStep("generate");
    generateScript();
  };

  const generateScript = async () => {
    if (!user || !nicheData.niche || !styleData.artStyle) return;

    setGenerateData((prev) => ({ ...prev, generating: "script" }));
    setError(null);

    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/generate/script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          niche: nicheData.niche,
          length: nicheData.length,
          language: nicheData.language,
          style: styleData.artStyle,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to generate script");
      }

      const data = await res.json();
      const script: Script = data.script;
      const scriptId: string = data.scriptId;

      setGenerateData((prev) => ({
        ...prev,
        script,
        scriptId,
        generating: null,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Script generation failed";
      setError(message);
      setGenerateData((prev) => ({ ...prev, generating: null }));
    }
  };

  const handleGenerateVideo = async () => {
    if (!user || !generateData.scriptId) return;

    setGenerateData((prev) => ({ ...prev, generating: "video" }));
    setError(null);

    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/generate/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          scriptId: generateData.scriptId,
          userId: user.uid,
          captionStyle: styleData.captionStyle,
          musicMood: styleData.musicMood,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to start video generation");
      }

      const data = await res.json();
      setGenerateData((prev) => ({
        ...prev,
        jobId: data.jobId,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Video generation failed";
      setError(message);
      setGenerateData((prev) => ({ ...prev, generating: null }));
    }
  };

  const handleSchedulePost = () => {
    router.push("/dashboard/series");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {(["niche", "style", "generate", "done"] as WizardStep[]).map(
          (s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  step === s
                    ? "bg-purple-600 text-white"
                    : i <
                      ["niche", "style", "generate", "done"].indexOf(step)
                    ? "bg-purple-600/40 text-white"
                    : "bg-white/10 text-gray-500"
                }`}
              >
                {i + 1}
              </div>
              {i < 3 && (
                <div
                  className={`h-px w-8 ${
                    i < ["niche", "style", "generate", "done"].indexOf(step)
                      ? "bg-purple-600"
                      : "bg-white/10"
                  }`}
                />
              )}
            </div>
          )
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Step 1: Niche */}
      {step === "niche" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">
            Choose your niche & settings
          </h2>
          <NicheSelector
            niche={nicheData.niche}
            length={nicheData.length}
            language={nicheData.language}
            onNicheChange={(n) =>
              setNicheData((prev) => ({ ...prev, niche: n }))
            }
            onLengthChange={(l) =>
              setNicheData((prev) => ({ ...prev, length: l }))
            }
            onLanguageChange={(l) =>
              setNicheData((prev) => ({ ...prev, language: l }))
            }
          />
          <button
            onClick={handleNicheNext}
            disabled={!nicheData.niche}
            className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-500 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Step 2: Style */}
      {step === "style" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">
            Pick your style
          </h2>
          <StylePicker
            artStyle={styleData.artStyle}
            musicMood={styleData.musicMood}
            captionStyle={styleData.captionStyle}
            onArtStyleChange={(a) =>
              setStyleData((prev) => ({ ...prev, artStyle: a }))
            }
            onMusicMoodChange={(m) =>
              setStyleData((prev) => ({ ...prev, musicMood: m }))
            }
            onCaptionStyleChange={(c) =>
              setStyleData((prev) => ({ ...prev, captionStyle: c }))
            }
          />
          <div className="flex gap-3">
            <button
              onClick={handleStyleBack}
              className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5"
            >
              Back
            </button>
            <button
              onClick={handleStyleNext}
              disabled={!styleData.artStyle}
              className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-500 disabled:opacity-40"
            >
              Generate Script
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Generate */}
      {step === "generate" && (
        <div className="space-y-6">
          {generateData.generating === "script" && (
            <div className="flex flex-col items-center gap-4 py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-purple-500" />
              <p className="text-gray-400">Generating your script...</p>
            </div>
          )}

          {generateData.script && !generateData.generating && !generateData.jobId && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">
                Review & Edit Script
              </h2>
              <ScriptEditor
                script={generateData.script}
                onScriptChange={(updatedScript) => {
                  setGenerateData((prev) => ({
                    ...prev,
                    script: updatedScript,
                  }));
                }}
                onRegenerate={generateScript}
                isRegenerating={generateData.generating === "script"}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("style")}
                  className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerateVideo}
                  className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-500"
                >
                  Generate Video
                </button>
              </div>
            </div>
          )}

          {generateData.generating === "video" && generateData.jobId && (
            <VideoProgress jobId={generateData.jobId} />
          )}

          {generateData.generating === "video" && !generateData.jobId && (
            <div className="flex flex-col items-center gap-4 py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-purple-500" />
              <p className="text-gray-400">Starting video generation...</p>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Done */}
      {step === "done" && videoUrl && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">
            Your video is ready!
          </h2>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121a]">
            <video
              src={videoUrl}
              controls
              className="mx-auto max-h-[60vh]"
              poster={thumbnailUrl ?? undefined}
            />
          </div>

          <div className="flex gap-3">
            <a
              href={videoUrl}
              download
              className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-500"
            >
              Download Video
            </a>
            <button
              onClick={handleSchedulePost}
              className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5"
            >
              Schedule Post
            </button>
            <button
              onClick={() => {
                setStep("niche");
                setGenerateData({
                  script: null,
                  scriptId: null,
                  jobId: null,
                  generating: null,
                });
                setVideoUrl(null);
                setThumbnailUrl(null);
                setError(null);
              }}
              className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5"
            >
              Create Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
