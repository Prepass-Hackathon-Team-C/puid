import React from "react";
import { ChevronRight } from "lucide-react";
import { Step } from "../types";

interface NavigationButtonsProps {
  currentStep: Step;
  isStepComplete: boolean;
  onStepChange: (step: Step) => void;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  isStepComplete,
  onStepChange,
}) => {
  if (currentStep === "review") {
    return (
      <div className="flex justify-start mt-8">
        <button
          onClick={() => onStepChange("questions")}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
        >
          Back to Profile
        </button>
      </div>
    );
  }

  return null;
};
