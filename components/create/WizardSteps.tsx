// components/create/WizardSteps.tsx
"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  label: string;
}

interface WizardStepsProps {
  steps: Step[];
  currentStep: number;
}

export default function WizardSteps({ steps, currentStep }: WizardStepsProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-2xl mx-auto">
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;

        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border-2 transition-all duration-300",
                  isCompleted
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 border-transparent text-white"
                    : isActive
                    ? "border-purple-500 text-purple-400 bg-purple-500/10"
                    : "border-[#2a2a3e] text-gray-500 bg-[#12121a]"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs text-center whitespace-nowrap",
                  isActive
                    ? "text-purple-400 font-medium"
                    : isCompleted
                    ? "text-gray-300"
                    : "text-gray-500"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting line */}
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-3 mt-[-20px] transition-colors duration-300",
                  isCompleted
                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                    : "bg-[#2a2a3e]"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
