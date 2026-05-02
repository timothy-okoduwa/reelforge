// worker/src/music.ts

const MUSIC_TRACKS: Record<string, string> = {
  epic: "https://cdn.pixabay.com/audio/2023/10/10/audio_c0b92d0ad2.mp3",
  chill: "https://cdn.pixabay.com/audio/2023/11/03/audio_8dc7e4ded9.mp3",
  mysterious: "https://cdn.pixabay.com/audio/2023/10/07/audio_52ee32e3ba.mp3",
  motivational: "https://cdn.pixabay.com/audio/2023/09/04/audio_58a6e715b1.mp3",
  sad: "https://cdn.pixabay.com/audio/2023/10/10/audio_b3ac20d113.mp3",
  none: "",
};

export function getMusicUrl(mood: string): string {
  return MUSIC_TRACKS[mood] || "";
}
