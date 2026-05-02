// worker/src/captions.ts

export function getCaptionFilter(style: string, text: string): string {
  const escaped = text
    .replace(/'/g, "'\\''")
    .replace(/:/g, "\\:")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]");

  switch (style) {
    case "bold_white":
      return `drawtext=fontcolor=white:fontsize=52:borderw=3:bordercolor=black:x=(w-text_w)/2:y=h*0.85:text='${escaped}'`;
    case "neon_green":
      return `drawtext=fontcolor=0x00ff00:fontsize=48:borderw=2:bordercolor=0x003300:x=(w-text_w)/2:y=h*0.85:text='${escaped}'`;
    case "minimal":
      return `drawtext=fontcolor=white:fontsize=36:x=w*0.05:y=h*0.88:text='${escaped}'`;
    case "none":
    default:
      return "";
  }
}
