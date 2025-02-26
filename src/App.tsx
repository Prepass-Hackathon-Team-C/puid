import React, { useState, useEffect } from "react";
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

  // Modify questions state to load from localStorage
  const [questions, setQuestions] = useState<SecurityQuestion[]>(() => {
    const savedQuestions = localStorage.getItem('puid-questions');
    return savedQuestions ? JSON.parse(savedQuestions) : [
      { id: "1", question: availableQuestions[0], answer: "" },
    ];
  });

  // Add effect to save questions whenever they change
  useEffect(() => {
    localStorage.setItem('puid-questions', JSON.stringify(questions));
  }, [questions]);

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

  // Add new download function
  const handleDownloadProfile = async () => {
    const questionsData = localStorage.getItem('puid-questions');
    if (!questionsData) return;

    try {
      // Check if the File System Access API is available
      if ('showSaveFilePicker' in window) {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: 'puid-profile.json',
          types: [{
            description: 'JSON File',
            accept: {
              'application/json': ['.json'],
            },
          }],
        });
        
        const writable = await fileHandle.createWritable();
        await writable.write(questionsData);
        await writable.close();
      } else {
        // Fallback for browsers that don't support File System Access API
        const blob = new Blob([questionsData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'puid-profile.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to save file:', err);
      // Fallback to the original method if the user cancels or there's an error
      const blob = new Blob([questionsData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'puid-profile.json';
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
      
      if (Array.isArray(importedData) && importedData.length > 0) {
        // Validate that imported data has the correct structure
        const isValidData = importedData.every((item: any) => 
          typeof item === 'object' && 
          'id' in item && 
          'question' in item && 
          'answer' in item
        );

        if (isValidData) {
          setQuestions(importedData);
          // Update nextQuestionId to be higher than any existing id
          const maxId = Math.max(...importedData.map(q => parseInt(q.id)));
          setNextQuestionId(maxId + 1);
        } else {
          alert('Invalid file format. Please use a valid PUID profile JSON file.');
        }
      }
    } catch (err) {
      console.error('Failed to import file:', err);
      alert('Failed to import file. Please make sure it is a valid JSON file.');
    }
  };

  // Modify renderStepContent to pass the new import handler
  const renderStepContent = () => {
    switch (currentStep) {
      case "questions":
        return (
          <>
            <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Import Profile</h3>
                  <p className="text-sm text-gray-500">Load your saved PUID profile</p>
                </div>
                <label className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
                  Import PUID Profile
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImportProfile(file);
                    }}
                  />
                </label>
              </div>
            </div>
            <QuestionForm
              questions={questions}
              onQuestionChange={handleQuestionChange}
              onAnswerChange={handleAnswerChange}
              onAddQuestion={addQuestion}
              onRemoveQuestion={removeQuestion}
              getAvailableQuestionsForId={getAvailableQuestionsForId}
            />
          </>
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
            onDownloadProfile={handleDownloadProfile}
          />
        );
      default:
        return null;
    }
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
            <ProgressBar currentStep={currentStep} />

            <div className="mt-6">{renderStepContent()}</div>

            <NavigationButtons
              currentStep={currentStep}
              isStepComplete={isStepComplete()}
              onStepChange={handleStepChange}
              onStartOver={handleStartOver}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;