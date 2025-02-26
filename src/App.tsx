import React, { useState } from "react";
import { Shield, Copy, Check, ChevronRight, Plus, Trash2 } from "lucide-react";

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
  const [prefixCode, setPrefixCode] = useState("");
  const [nextQuestionId, setNextQuestionId] = useState(2); // Start at 2 since we have one initial question

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
  ]);

  // PUID state
  const [puid, setPuid] = useState("");
  const [copied, setCopied] = useState(false);

  // Get available questions for a specific question ID
  const getAvailableQuestionsForId = (currentId: string) => {
    const selectedQuestions = questions
      .filter((q) => q.id !== currentId)
      .map((q) => q.question);
    return availableQuestions.filter((q) => !selectedQuestions.includes(q));
  };

  // Generate PUID using answers
  const generatePUID = () => {
    // Available separators
    const separators = ["-", "_", ".", "~", "+", "*", "#", "@"];
    // Choose one random separator to use throughout
    const selectedSeparator =
      separators[Math.floor(Math.random() * separators.length)];

    // Get all answers and split them into words
    const answers = questions
      .map((q) => q.answer.trim())
      .filter((a) => a !== "");

    // Split answers into words and filter out empty strings
    const words = answers
      .flatMap((answer) => answer.split(/\s+/))
      .filter((word) => word.length > 0);

    // Shuffle the words
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);

    // Select enough words to reach target length (12-20 chars)
    const selectedWords: string[] = [];
    let totalLength = 0;
    const minLength = 12;
    const maxLength = 20;

    for (const word of shuffledWords) {
      if (totalLength + word.length <= maxLength) {
        selectedWords.push(word);
        totalLength += word.length;
        if (totalLength >= minLength) break;
      }
    }

    // If we don't have enough length and there are more words, add one more
    if (
      totalLength < minLength &&
      shuffledWords.length > selectedWords.length
    ) {
      const nextWord = shuffledWords[selectedWords.length];
      selectedWords.push(nextWord);
    }

    // Convert to lowercase
    let processedWords = selectedWords.map((word) => word.toLowerCase());

    // Replace some characters with numbers in each word
    const numberReplacements: { [key: string]: string } = {
      a: "4",
      e: "3",
      i: "1",
      o: "0",
    };

    processedWords = processedWords.map((word) => {
      return word
        .split("")
        .map((char) => {
          const replacement = numberReplacements[char];
          return replacement && Math.random() > 0.5 ? replacement : char;
        })
        .join("");
    });

    // Find the most common letter across all words and capitalize it
    const allChars = processedWords.join("");
    const letterCounts = new Map<string, number>();
    for (const char of allChars) {
      if (/[a-z]/.test(char)) {
        letterCounts.set(char, (letterCounts.get(char) || 0) + 1);
      }
    }

    let mostCommonLetter = "";
    let highestCount = 0;
    for (const [letter, count] of letterCounts.entries()) {
      if (count > highestCount) {
        highestCount = count;
        mostCommonLetter = letter;
      }
    }

    // Capitalize the most common letter if it appears at least twice
    if (highestCount >= 2) {
      processedWords = processedWords.map((word) => {
        return word
          .split("")
          .map((char) =>
            char === mostCommonLetter ? char.toUpperCase() : char
          )
          .join("");
      });
    }

    // Add prefix and join all words with the same separator
    const generatedPUID = `${prefixCode}${selectedSeparator}${processedWords.join(
      selectedSeparator
    )}`;

    // Set the generated PUID
    setPuid(generatedPUID);
  };

  // Copy PUID to clipboard
  const copyPUID = () => {
    navigator.clipboard.writeText(puid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Add new question
  const addQuestion = () => {
    if (questions.length < 10) {
      const newId = nextQuestionId.toString();
      setNextQuestionId(nextQuestionId + 1);

      // Find first available question that hasn't been used
      const availableQuestion =
        availableQuestions.find(
          (q) => !questions.map((existing) => existing.question).includes(q)
        ) || availableQuestions[0];

      setQuestions([
        ...questions,
        { id: newId, question: availableQuestion, answer: "" },
      ]);
    }
  };

  // Remove question
  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Handle question change
  const handleQuestionChange = (id: string, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          return { ...q, question: value };
        }
        // If the selected question is already used by another question,
        // swap their values to prevent duplicates
        if (q.question === value) {
          const oldQuestion =
            questions.find((oldQ) => oldQ.id === id)?.question || "";
          return { ...q, question: oldQuestion };
        }
        return q;
      })
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
    return (
      questions.length >= 5 &&
      questions.length <= 10 &&
      questions.every((q) => q.answer.trim() !== "")
    );
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
                  onChange={(e) => handleQuestionChange(q.id, e.target.value)}
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
                  onClick={() => removeQuestion(q.id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Remove question"
                >
                  <Trash2 size={18} />
                </button>
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

        {questions.length < 10 && (
          <button
            onClick={addQuestion}
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
          <div className="mb-4">
            <h3 className="text-lg font-medium text-indigo-800 mb-4">
              Your PUID
            </h3>

            <label
              htmlFor="prefixCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Enter your prefix code (1-5 characters)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="prefixCode"
                value={prefixCode}
                onChange={(e) => {
                  setPrefixCode(e.target.value);
                }}
                maxLength={5}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter prefix code"
                required
              />
              <button
                onClick={generatePUID}
                disabled={!prefixCode || prefixCode.length > 5}
                className={`px-4 py-2 rounded-md text-white ${
                  !prefixCode || prefixCode.length > 5
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {puid ? "Regenerate" : "Generate"}
              </button>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <div className="flex-1 bg-white border border-indigo-300 rounded-lg px-4 py-3 font-mono text-lg break-all">
              {puid}
            </div>
            <button
              onClick={copyPUID}
              className="text-indigo-600 hover:text-indigo-800 p-2"
              aria-label="Copy PUID"
            >
              <Copy size={18} />
            </button>
          </div>

          {copied && (
            <div className="mt-2 text-sm text-green-600 flex items-center">
              <Check size={16} className="mr-1" />
              PUID copied to clipboard!
            </div>
          )}
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
            Back to Profile
          </button>

          <button
            onClick={() => {
              setQuestions([
                { id: "1", question: availableQuestions[0], answer: "" },
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
            setCurrentStep("review");
          }}
          disabled={!isStepComplete()}
          className={`px-4 py-2 rounded-md flex items-center ${
            isStepComplete()
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-indigo-600 p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center justify-center">
              <Shield className="mr-2" />
              PUID Creator
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
