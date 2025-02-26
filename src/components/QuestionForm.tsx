import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { SecurityQuestion } from "../types";
import { availableQuestions } from "../constants";

interface QuestionFormProps {
  questions: SecurityQuestion[];
  onQuestionChange: (id: string, value: string) => void;
  onAnswerChange: (id: string, value: string) => void;
  onAddQuestion: () => void;
  onRemoveQuestion: (id: string) => void;
  getAvailableQuestionsForId: (id: string) => string[];
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  questions,
  onQuestionChange,
  onAnswerChange,
  onAddQuestion,
  onRemoveQuestion,
  getAvailableQuestionsForId,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Profile</h2>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className="border border-gray-200 rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
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
                {!getAvailableQuestionsForId(q.id).includes(q.question) && (
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
          className={`flex items-center ${
            questions.length < 10
              ? "text-indigo-600 hover:text-indigo-800"
              : "text-gray-400 cursor-not-allowed"
          }`}
          disabled={questions.length >= 10}
        >
          <Plus size={18} className="mr-1" />
          Add Another Question
        </button>
      )}
    </div>
  );
};
