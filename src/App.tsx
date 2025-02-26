import React, { useState } from "react";
import { Shield } from "lucide-react";
import { Step, SecurityQuestion } from "./types";
import { availableQuestions } from "./constants";
import { generatePUID } from "./utils/puidGenerator";
import { ProgressBar } from "./components/ProgressBar";
import { QuestionForm } from "./components/QuestionForm";
import { ReviewPage } from "./components/ReviewPage";
import { NavigationButtons } from "./components/NavigationButtons";

function App() {
  // Current step state
  const [currentStep, setCurrentStep] = useState<Step>("questions");
  const [prefixCode, setPrefixCode] = useState("");
  const [nextQuestionId, setNextQuestionId] = useState(2); // Start at 2 since we have one initial question

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

  // Copy PUID to clipboard
  const copyPUID = () => {
    navigator.clipboard.writeText(puid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle step change
  const handleStepChange = (step: Step) => {
    setCurrentStep(step);
  };

  // Handle start over
  const handleStartOver = () => {
    setQuestions([{ id: "1", question: availableQuestions[0], answer: "" }]);
    setCurrentStep("questions");
  };

  // Handle PUID generation
  const handleGeneratePUID = () => {
    const newPuid = generatePUID(questions, prefixCode);
    setPuid(newPuid);
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case "questions":
        return (
          <QuestionForm
            questions={questions}
            onQuestionChange={handleQuestionChange}
            onAnswerChange={handleAnswerChange}
            onAddQuestion={addQuestion}
            onRemoveQuestion={removeQuestion}
            getAvailableQuestionsForId={getAvailableQuestionsForId}
            isStepComplete={isStepComplete()}
            onStepChange={handleStepChange}
            onStartOver={handleStartOver}
          />
        );
      case "review":
        return (
          <ReviewPage
            puid={puid}
            prefixCode={prefixCode}
            copied={copied}
            onPrefixChange={setPrefixCode}
            onGeneratePUID={handleGeneratePUID}
            onCopyPUID={copyPUID}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="h-full max-w-4xl mx-auto">
        <div className="h-full bg-white rounded-xl shadow-lg flex flex-col">
          <div className="bg-indigo-600 py-3 px-6 text-white flex-shrink-0">
            <h1 className="text-2xl font-bold flex items-center justify-center">
              <Shield className="mr-2" />
              PUID
            </h1>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-6 pb-0 flex-shrink-0">
              <ProgressBar currentStep={currentStep} />
            </div>

            <div className="p-6 flex-1 min-h-0">{renderStepContent()}</div>

            {currentStep === "review" && (
              <div className="px-6 pb-6 flex-shrink-0">
                <NavigationButtons
                  currentStep={currentStep}
                  isStepComplete={isStepComplete()}
                  onStepChange={handleStepChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
