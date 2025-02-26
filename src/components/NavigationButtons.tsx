import React from "react";
import { ChevronRight } from "lucide-react";
import { Step } from "../types";
import { availableQuestions } from "../constants";

interface NavigationButtonsProps {
  currentStep: Step;
  isStepComplete: boolean;
  onStepChange: (step: Step) => void;
  onStartOver: () => void;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  isStepComplete,
  onStepChange,
  onStartOver,
}) => {
  if (currentStep === "review") {
    return (
      <div className="flex justify-between mt-8">
        <button
          onClick={() => onStepChange("questions")}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
        >
          Back to Profile
        </button>

        <button
          onClick={onStartOver}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-end mt-8">
      <button
        onClick={() => onStepChange("review")}
        disabled={!isStepComplete}
        className={`px-4 py-2 rounded-md flex items-center ${
          isStepComplete
            ? "bg-indigo-600 text-white hover:bg-indigo-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Continue
        <ChevronRight size={16} className="ml-2" />
      </button>
    </div>
  );
};
