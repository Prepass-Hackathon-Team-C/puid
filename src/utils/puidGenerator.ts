import { SecurityQuestion } from '../types';
import { separators, numberReplacements } from '../constants';

export const generatePUID = (questions: SecurityQuestion[], prefixCode: string): string => {
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
  if (totalLength < minLength && shuffledWords.length > selectedWords.length) {
    const nextWord = shuffledWords[selectedWords.length];
    selectedWords.push(nextWord);
  }

  // Convert to lowercase
  let processedWords = selectedWords.map((word) => word.toLowerCase());

  // Replace some characters with numbers in each word
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
        .map((char) => (char === mostCommonLetter ? char.toUpperCase() : char))
        .join("");
    });
  }

  // Add prefix and join all words with the same separator
  return `${prefixCode}${selectedSeparator}${processedWords.join(selectedSeparator)}`;
}; 