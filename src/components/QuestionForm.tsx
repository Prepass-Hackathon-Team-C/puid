import React from "react";
import { Plus, Trash2, ChevronRight } from "lucide-react";
import { SecurityQuestion } from "../types";
import { availableQuestions } from "../constants";

interface QuestionFormProps {
  questions: SecurityQuestion[];
  onQuestionChange: (id: string, value: string) => void;
  onAnswerChange: (id: string, value: string) => void;
  onAddQuestion: () => void;
  onRemoveQuestion: (id: string) => void;
  getAvailableQuestionsForId: (id: string) => string[];
  isStepComplete: boolean;
  onStepChange: (step: "review") => void;
  onStartOver: () => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  questions,
  onQuestionChange,
  onAnswerChange,
  onAddQuestion,
  onRemoveQuestion,
  getAvailableQuestionsForId,
  isStepComplete,
  onStepChange,
  onStartOver,
}) => {
  return (
    <div className="h-full flex">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-shrink-0 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
        </div>

        <div className="flex-1 min-h-0">
          <div className="h-full overflow-y-auto">
            <div className="space-y-4 pr-4 pb-4">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="border border-gray-200 rounded-lg p-4 space-y-4"
                >
                  <div className="flex gap-2">
                    <select
                      value={q.question}
                      onChange={(e) => onQuestionChange(q.id, e.target.value)}
                      className="w-full mr-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {getAvailableQuestionsForId(q.id).map((question) => (
                        <option key={question} value={question}>
                          {question}
                        </option>
                      ))}
                      {/* Always include the currently selected question */}
                      {!getAvailableQuestionsForId(q.id).includes(
                        q.question
                      ) && (
                        <option key={q.question} value={q.question}>
                          {q.question}
                        </option>
                      )}
                    </select>
                    <button
                      onClick={() => onRemoveQuestion(q.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove question"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={q.answer}
                    onChange={(e) => onAnswerChange(q.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your answer"
                    required
                  />
                </div>
              ))}
            </div>

            {questions.length < 10 && (
              <button
                onClick={onAddQuestion}
                className="flex items-center text-indigo-600 hover:text-indigo-800"
              >
                <Plus size={18} className="mr-1" />
                Add Another Question
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="ml-6 flex flex-col justify-end gap-4">
        <button
          onClick={onStartOver}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
        >
          Clear Profile
        </button>
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
    </div>
  );
};
