import React, { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { Step, SecurityQuestion, Profile } from "./types";
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
  const [prefixError, setPrefixError] = useState<string | null>(null);

  // Load profile from localStorage
  const [profile, setProfile] = useState<Profile>(() => {
    const savedProfile = localStorage.getItem("puid-profile");
    return savedProfile
      ? JSON.parse(savedProfile)
      : {
          questions: [{ id: "1", question: availableQuestions[0], answer: "" }],
          usedPrefixCodes: [],
        };
  });

  // Extract questions and usedPrefixCodes from profile
  const { questions, usedPrefixCodes } = profile;

  // Save profile whenever it changes
  useEffect(() => {
    localStorage.setItem("puid-profile", JSON.stringify(profile));
  }, [profile]);

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

      setProfile({
        ...profile,
        questions: [
          ...questions,
          { id: newId, question: availableQuestion, answer: "" },
        ],
      });
    }
  };

  // Remove question
  const removeQuestion = (id: string) => {
    setProfile({
      ...profile,
      questions: questions.filter((q) => q.id !== id),
    });
  };

  // Handle question change
  const handleQuestionChange = (id: string, value: string) => {
    setProfile({
      ...profile,
      questions: questions.map((q) => {
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
      }),
    });
  };

  // Handle answer change
  const handleAnswerChange = (id: string, value: string) => {
    setProfile({
      ...profile,
      questions: questions.map((q) =>
        q.id === id ? { ...q, answer: value } : q
      ),
    });
  };

  // PUID state
  const [puid, setPuid] = useState("");
  const [copied, setCopied] = useState(false);

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
    if (step === "questions") {
      // Reset password generation state when going back to profile
      setPuid("");
      setPrefixCode("");
      setCopied(false);
    }
    setCurrentStep(step);
  };

  // Handle start over
  const handleStartOver = () => {
    setProfile({
      questions: [{ id: "1", question: availableQuestions[0], answer: "" }],
      usedPrefixCodes: [],
    });
    setCurrentStep("questions");
  };

  // Handle PUID generation
  const handleGeneratePUID = () => {
    const newPuid = generatePUID(questions, prefixCode);
    setPuid(newPuid);
  };

  // Handle prefix code change with validation
  const handlePrefixChange = (value: string) => {
    setPrefixCode(value);
    if (usedPrefixCodes.includes(value)) {
      setPrefixError("This prefix code has already been used");
    } else {
      setPrefixError(null);
    }
  };

  // Handle PUID acceptance
  const handleAcceptPUID = () => {
    setProfile({
      ...profile,
      usedPrefixCodes: [...usedPrefixCodes, prefixCode],
    });
    setPrefixCode("");
  };

  // Handle resetting password generation
  const handleResetGeneration = () => {
    setPuid("");
    setPrefixCode("");
    setCopied(false);
    setPrefixError(null);
  };

  // Add new download function
  const handleDownloadProfile = async () => {
    try {
      // Check if the File System Access API is available
      if ("showSaveFilePicker" in window) {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: "puid-profile.json",
          types: [
            {
              description: "JSON File",
              accept: {
                "application/json": [".json"],
              },
            },
          ],
        });

        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(profile));
        await writable.close();
      } else {
        // Fallback for browsers that don't support File System Access API
        const blob = new Blob([JSON.stringify(profile)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "puid-profile.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Failed to save file:", err);
      // Fallback to the original method if the user cancels or there's an error
      const blob = new Blob([JSON.stringify(profile)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "puid-profile.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Add new import function
  const handleImportProfile = async (file: File) => {
    try {
      const fileContent = await file.text();
      const importedData = JSON.parse(fileContent);

      // Validate that imported data has the correct structure
      if (
        typeof importedData === "object" &&
        Array.isArray(importedData.questions) &&
        Array.isArray(importedData.usedPrefixCodes) &&
        importedData.questions.every(
          (item: any) =>
            typeof item === "object" &&
            "id" in item &&
            "question" in item &&
            "answer" in item
        )
      ) {
        setProfile(importedData);
        // Update nextQuestionId to be higher than any existing id
        const maxId = Math.max(
          ...importedData.questions.map((q: SecurityQuestion) => parseInt(q.id))
        );
        setNextQuestionId(maxId + 1);
      } else {
        alert(
          "Invalid file format. Please use a valid PUID profile JSON file."
        );
      }
    } catch (err) {
      console.error("Failed to import file:", err);
      alert("Failed to import file. Please make sure it is a valid JSON file.");
    }
  };

  // Modify renderStepContent to pass the new props
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
            onImportProfile={handleImportProfile}
            onDownloadProfile={handleDownloadProfile}
          />
        );
      case "review":
        return (
          <ReviewPage
            puid={puid}
            prefixCode={prefixCode}
            prefixError={prefixError}
            copied={copied}
            onPrefixChange={handlePrefixChange}
            onGeneratePUID={handleGeneratePUID}
            onCopyPUID={copyPUID}
            onAcceptPUID={handleAcceptPUID}
            onStartOver={handleResetGeneration}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 overflow-hidden">
      <div className="h-full max-w-4xl mx-auto">
        <div className="h-full bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
          <div className="bg-indigo-600 py-3 px-6 text-white flex-shrink-0">
            <h1 className="text-2xl font-bold flex items-center justify-center">
              <Shield className="mr-2" />
              PUID
            </h1>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 pb-0 flex-shrink-0">
              <ProgressBar currentStep={currentStep} />
            </div>

            <div className="p-6 flex-1 overflow-auto">
              {renderStepContent()}
            </div>

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
