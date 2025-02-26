// Define step types
export type Step = "questions" | "review";

// Define security question type
export interface SecurityQuestion {
  id: string;
  question: string;
  answer: string;
} 