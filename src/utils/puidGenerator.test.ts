import { generatePUID } from './puidGenerator';
import { SecurityQuestion } from '../types';

describe('generatePUID', () => {
  const mockQuestions: SecurityQuestion[] = [
    { id: '1', question: 'What city were you born in?', answer: 'New York' },
    { id: '2', question: 'What is your favorite color?', answer: 'Blue' }
  ];

  it('generates PUID with minimum length', () => {
    const puid = generatePUID(mockQuestions, 'TEST', 8, ['-']);
    expect(puid.length).toBeGreaterThanOrEqual(8);
  });

  it('includes prefix code in generated PUID', () => {
    const prefixCode = 'TEST';
    const puid = generatePUID(mockQuestions, prefixCode, 8, ['-']);
    expect(puid.startsWith(prefixCode)).toBeTruthy();
  });

  it('uses allowed special characters', () => {
    const specialChars = ['#', '@'];
    const puid = generatePUID(mockQuestions, 'TEST', 8, specialChars);
    const usedSpecialChar = specialChars.some(char => puid.includes(char));
    expect(usedSpecialChar).toBeTruthy();
  });

  it('generates different PUIDs for same input', () => {
    const puid1 = generatePUID(mockQuestions, 'TEST', 8, ['-']);
    const puid2 = generatePUID(mockQuestions, 'TEST', 8, ['-']);
    expect(puid1).not.toBe(puid2);
  });
}); 