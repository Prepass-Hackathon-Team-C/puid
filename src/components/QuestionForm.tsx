import React, { useEffect, useRef } from "react";
import { Plus, Trash2, ChevronRight } from "lucide-react";
import { SecurityQuestion } from "../types";
import { availableQuestions } from "../constants";

interface QuestionFormProps {
  questions: SecurityQuestion[];
  onQuestionChange: (id: string, value: string) => void;
  onAnswerChange: (id: string, value: string) => void;
  onAddQuestion: () => string | undefined;
  onRemoveQuestion: (id: string) => void;
  getAvailableQuestionsForId: (id: string) => string[];
  isStepComplete: boolean;
  onStepChange: (step: "review") => void;
  onStartOver: () => void;
  onImportProfile: (file: File) => Promise<void>;
  onDownloadProfile: () => Promise<void>;
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
  onImportProfile,
  onDownloadProfile,
}) => {
  const lastAddedRef = useRef<string | null>(null);
  const selectRefs = useRef<{ [key: string]: HTMLSelectElement | null }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (lastAddedRef.current && selectRefs.current[lastAddedRef.current]) {
      selectRefs.current[lastAddedRef.current]?.focus();
      lastAddedRef.current = null;
    }
  }, [questions]);

  const handleAddQuestion = () => {
    const newId = onAddQuestion();
    if (newId) {
      lastAddedRef.current = newId;
    }
  };

  const handleImport = async (file: File) => {
    await onImportProfile(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-shrink-0 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
          <p className="mt-1 text-sm text-gray-600">
            Please answer 5-10 questions
          </p>
        </div>

        <div className="flex-1 min-h-0">
          <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
            <div className="space-y-4 md:pr-4 pb-4">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="border border-gray-200 rounded-lg p-4 space-y-4"
                >
                  <div className="flex gap-2">
                    <select
                      ref={(el) => (selectRefs.current[q.id] = el)}
                      value={q.question}
                      onChange={(e) => onQuestionChange(q.id, e.target.value)}
                      className="w-full mr-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {getAvailableQuestionsForId(q.id).map((question) => (
                        <option key={question} value={question}>
                          {question}
                        </option>
                      ))}
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
                onClick={handleAddQuestion}
                className="flex items-center text-indigo-600 hover:text-indigo-800 mt-4"
              >
                <Plus size={18} className="mr-1" />
                Add Another Question
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-0 md:ml-6 flex flex-row flex-wrap md:flex-col justify-end items-stretch gap-4 md:w-auto w-full">
        <label className="basis-[calc(50%-0.5rem)] md:basis-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center cursor-pointer">
          Import
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImport(file);
            }}
          />
        </label>
        <button
          onClick={onDownloadProfile}
          className="basis-[calc(50%-0.5rem)] md:basis-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center"
        >
          Export
        </button>
        <button
          onClick={onStartOver}
          className="basis-[calc(50%-0.5rem)] md:basis-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center"
        >
          Clear
        </button>
        <button
          onClick={() => onStepChange("review")}
          disabled={!isStepComplete}
          className={`basis-[calc(50%-0.5rem)] md:basis-auto px-4 py-2 rounded-md flex items-center justify-center ${
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
