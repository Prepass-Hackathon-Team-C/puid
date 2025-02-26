// Available questions
export const availableQuestions = [
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

// Available separators for PUID generation
export const separators = ["-", "_", ".", "~", "+", "*", "#", "@"];

// Character replacements for PUID generation
export const numberReplacements: { [key: string]: string } = {
  a: "4",
  e: "3",
  i: "1",
  o: "0",
}; 