import React, { useState } from "react";
import {
  Shield,
  User,
  Copy,
  Check,
  ChevronRight,
  RefreshCw,
  Plus,
  Trash2,
} from "lucide-react";

// Define step types
type Step = "questions" | "review";

// Define security question type
interface SecurityQuestion {
  id: string;
  question: string;
  answer: string;
}

function App() {
  // Current step state
  const [currentStep, setCurrentStep] = useState<Step>("questions");

  // Available questions
  const availableQuestions = [
    "What is your favorite color?",
    "What was your first pet's name?",
    "What is your mother's maiden name?",
    "What city were you born in?",
    "What was your childhood nickname?",
    "What is your favorite book?",
    "What is your favorite movie?",
    "What is your spouse's name?",
    "What street did you grow up on?",
    "What was the name of your first school?",
    "What is your favorite food?",
    "What is your dream vacation destination?",
    "What was your first car?",
    "What is your favorite sports team?",
    "What is your favorite season?",
  ];

  // Questions state
  const [questions, setQuestions] = useState<SecurityQuestion[]>([
    { id: "1", question: availableQuestions[0], answer: "" },
    { id: "2", question: availableQuestions[1], answer: "" },
  ]);

  // PUID state
  const [puid, setPuid] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate PUID using answers
  const generatePUID = () => {
    // Extract components from answers
    const components = questions.map((q) => {
      const answer = q.answer.trim();
      return answer.length >= 3
        ? answer.substring(0, 3)
        : answer.padEnd(3, "x");
    });

    // Shuffle and transform components
    let generatedPUID = "";
    const shuffledComponents = [...components].sort(() => Math.random() - 0.5);

    shuffledComponents.forEach((component) => {
      // Randomly transform each component
      let transformed = "";
      for (let i = 0; i < component.length; i++) {
        const char = component[i];
        if (Math.random() > 0.5) {
          transformed += char.toUpperCase();
        } else {
          transformed += char.toLowerCase();
        }
      }
      generatedPUID += transformed;
    });

    // Add some random numbers and special characters
    const numbers = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const symbols = ["!", "@", "#", "$", "%", "&", "*"];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

    // Combine all parts
    generatedPUID = `${generatedPUID}${numbers}${randomSymbol}`;

    // Set the generated PUID
    setPuid(generatedPUID);
  };

  // Regenerate PUID
  const regeneratePUID = () => {
    generatePUID();
  };

  // Copy PUID to clipboard
  const copyPUID = () => {
    navigator.clipboard.writeText(puid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Add new question
  const addQuestion = () => {
    if (questions.length < 5) {
      const newId = (questions.length + 1).toString();
      setQuestions([
        ...questions,
        { id: newId, question: availableQuestions[0], answer: "" },
      ]);
    }
  };

  // Remove question
  const removeQuestion = (id: string) => {
    if (questions.length > 2) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  // Handle question change
  const handleQuestionChange = (id: string, value: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, question: value } : q))
    );
  };

  // Handle answer change
  const handleAnswerChange = (id: string, value: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, answer: value } : q))
    );
  };

  // Check if current step is complete
  const isStepComplete = () => {
    return questions.every((q) => q.answer.trim() !== "");
  };

  // Render progress bar
  const renderProgressBar = () => {
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

  // Render questions form
  const renderQuestionsForm = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Security Questions
          </h2>
          <p className="text-gray-600 mb-6">
            Please select and answer {questions.length} security questions.
            These answers will be used to generate your unique identifier.
          </p>
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
                  onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                  className="w-full mr-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {availableQuestions.map((question) => (
                    <option key={question} value={question}>
                      {question}
                    </option>
                  ))}
                </select>
                {questions.length > 2 && (
                  <button
                    onClick={() => removeQuestion(q.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove question"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={q.answer}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your answer"
                required
              />
            </div>
          ))}
        </div>

        {questions.length < 5 && (
          <button
            onClick={addQuestion}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <Plus size={18} className="mr-1" />
            Add Another Question
          </button>
        )}
      </div>
    );
  };

  // Render review page
  const renderReview = () => {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Personal Identity
          </h2>
          <p className="text-gray-600">
            Based on your answers, we've generated your unique Personal User
            Identifier (PUID).
          </p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-indigo-800">Your PUID</h3>
            <div className="flex space-x-2">
              <button
                onClick={regeneratePUID}
                className="text-indigo-600 hover:text-indigo-800"
                aria-label="Regenerate PUID"
              >
                <RefreshCw size={18} />
              </button>
              <button
                onClick={copyPUID}
                className="text-indigo-600 hover:text-indigo-800"
                aria-label="Copy PUID"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <div className="bg-white border border-indigo-300 rounded-lg px-4 py-3 font-mono text-lg break-all">
            {puid}
          </div>

          {copied && (
            <div className="mt-2 text-sm text-green-600 flex items-center">
              <Check size={16} className="mr-1" />
              PUID copied to clipboard!
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 flex items-center">
            <User size={18} className="text-indigo-600 mr-2" />
            <h3 className="font-medium text-gray-900">Your Answers</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {questions.map((q) => (
              <div key={q.id} className="p-4">
                <p className="text-sm text-gray-500">{q.question}</p>
                <p className="mt-1 font-medium">{q.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case "questions":
        return renderQuestionsForm();
      case "review":
        return renderReview();
      default:
        return null;
    }
  };

  // Render navigation buttons
  const renderNavButtons = () => {
    if (currentStep === "review") {
      return (
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep("questions")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
          >
            Back to Questions
          </button>

          <button
            onClick={() => {
              setQuestions([
                { id: "1", question: availableQuestions[0], answer: "" },
                { id: "2", question: availableQuestions[1], answer: "" },
              ]);
              setCurrentStep("questions");
            }}
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
          onClick={() => {
            generatePUID();
            setCurrentStep("review");
          }}
          disabled={!isStepComplete()}
          className={`px-4 py-2 rounded-md flex items-center ${
            isStepComplete()
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Generate PUID
          <ChevronRight size={16} className="ml-2" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-indigo-600 p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center justify-center">
              <Shield className="mr-2" />
              Personal Identity Creator
            </h1>
          </div>

          <div className="p-6">
            {renderProgressBar()}

            <div className="mt-6">{renderStepContent()}</div>

            {renderNavButtons()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
