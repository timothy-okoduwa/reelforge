// components/create/VideoProgress.tsx
"use client";

import { Progress } from "@/components/ui/progress";
import { useJobStatus } from "@/hooks/useJobStatus";
import { cn } from "@/lib/utils";
import { Film, Image, Mic, Loader2, CheckCircle2, XCircle } from "lucide-react";
import type { JobStatus } from "@/types";

interface VideoProgressProps {
  jobId: string | null;
}

const stepConfig: { status: JobStatus; label: string; icon: typeof Film }[] = [
  { status: "queued", label: "Waiting in queue", icon: Loader2 },
  { status: "generating_images", label: "Generating images", icon: Image },
  { status: "generating_voice", label: "Generating voiceover", icon: Mic },
  { status: "rendering", label: "Rendering video", icon: Film },
];

function getStepIndex(status: JobStatus): number {
  return stepConfig.findIndex((s) => s.status === status);
}

export default function VideoProgress({ jobId }: VideoProgressProps) {
  const { status, progress, statusText, isLoading } = useJobStatus(jobId);

  if (!jobId) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Video generation will begin shortly...</p>
      </div>
    );
  }

  const currentStep = getStepIndex(status);

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">{statusText}</span>
          <span className="text-gray-400">{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Step indicators */}
      <div className="space-y-3">
        {stepConfig.map((step, i) => {
          const isCompleted = currentStep > i || status === "complete";
          const isCurrent = currentStep === i && status !== "complete" && status !== "failed";
          const isPending = currentStep < i && status !== "failed";

          return (
            <div
              key={step.status}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg border transition-all",
                isCurrent
                  ? "bg-purple-500/10 border-purple-500/30"
                  : isCompleted
                  ? "bg-green-500/5 border-green-500/20"
                  : "bg-[#12121a] border-[#2a2a3e]"
              )}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
              ) : status === "failed" && isCurrent ? (
                <XCircle className="h-5 w-5 text-red-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="h-5 w-5 text-purple-400 animate-spin shrink-0" />
              ) : (
                <step.icon className="h-5 w-5 text-gray-600 shrink-0" />
              )}

              <span
                className={cn(
                  "text-sm font-medium",
                  isCompleted
                    ? "text-green-400"
                    : isCurrent
                    ? "text-white"
                    : "text-gray-500"
                )}
              >
                {step.label}
              </span>

              {isCompleted && (
                <span className="ml-auto text-xs text-green-400">Done</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
