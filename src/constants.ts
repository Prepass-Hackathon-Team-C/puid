// Available questions
export const availableQuestions = [
  "What city were you born in?",
  "What is your dream vacation destination?",
  "What is your favorite book?",
  "What is your favorite color?",
  "What is your favorite food?",
  "What is your favorite movie?",
  "What is your favorite season?",
  "What is your favorite sports team?",
  "What is your mother's maiden name?",
  "What is your spouse's name?",
  "What street did you grow up on?",
  "What was your childhood nickname?",
  "What was your first car?",
  "What was your first pet's name?",
  "What was the name of your first school?"
];

// Available separators for PUID generation
export const separators = ["-", "_", ".", "~", "+", "*", "#", "@"];

// Character replacements for PUID generation
export const numberReplacements: { [key: string]: string } = {
  b: "8",
  s: "5",
  a: "4",
  e: "3",
  i: "1",
  o: "0",
}; 