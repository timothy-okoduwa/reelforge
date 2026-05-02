// components/create/ScriptEditor.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Clock, Image, Mic } from "lucide-react";
import type { Script } from "@/types";

interface ScriptEditorProps {
  script: Script;
  onScriptChange: (script: Script) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export default function ScriptEditor({
  script,
  onScriptChange,
  onRegenerate,
  isRegenerating,
}: ScriptEditorProps) {
  const handleNarrationChange = (sceneIndex: number, text: string) => {
    const updated = { ...script };
    updated.scenes = updated.scenes.map((scene, i) =>
      i === sceneIndex ? { ...scene, narration: text } : scene
    );
    onScriptChange(updated);
  };

  const handleImagePromptChange = (sceneIndex: number, text: string) => {
    const updated = { ...script };
    updated.scenes = updated.scenes.map((scene, i) =>
      i === sceneIndex ? { ...scene, imagePrompt: text } : scene
    );
    onScriptChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{script.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-sm text-gray-500">
              ~{Math.round(script.totalDuration)}s estimated
            </span>
            <Badge variant="secondary" className="ml-2">
              {script.scenes.length} scenes
            </Badge>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={onRegenerate}
          disabled={isRegenerating}
        >
          <RefreshCw
            className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`}
          />
          {isRegenerating ? "Regenerating..." : "Regenerate"}
        </Button>
      </div>

      {/* Scenes */}
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {script.scenes.map((scene, i) => (
          <Card key={scene.id} className="bg-[#12121a] border-[#2a2a3e]">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold">
                  {i + 1}
                </span>
                Scene {i + 1}
                <span className="ml-auto text-xs text-gray-500">
                  {scene.durationSeconds}s
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              {/* Narration */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mb-1">
                  <Mic className="h-3 w-3" /> Narration
                </label>
                <textarea
                  value={scene.narration}
                  onChange={(e) => handleNarrationChange(i, e.target.value)}
                  rows={2}
                  className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-600"
                />
              </div>

              {/* Image Prompt */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mb-1">
                  <Image className="h-3 w-3" /> Image Prompt
                </label>
                <textarea
                  value={scene.imagePrompt}
                  onChange={(e) => handleImagePromptChange(i, e.target.value)}
                  rows={2}
                  className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-600"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
