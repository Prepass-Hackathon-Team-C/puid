import React from "react";
import { Step } from "../types";

interface ProgressBarProps {
  currentStep: Step;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const progress = currentStep === "review" ? 100 : 50;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
      <div
        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};
