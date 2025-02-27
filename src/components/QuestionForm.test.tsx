import { render, screen, fireEvent } from '@testing-library/react';
import { QuestionForm } from './QuestionForm';
import { SecurityQuestion } from '../types';

describe('QuestionForm', () => {
  const mockQuestions: SecurityQuestion[] = [
    { id: '1', question: 'What city were you born in?', answer: '' }
  ];

  const defaultProps = {
    questions: mockQuestions,
    onQuestionChange: jest.fn(),
    onAnswerChange: jest.fn(),
    onAddQuestion: jest.fn(),
    onRemoveQuestion: jest.fn(),
    getAvailableQuestionsForId: jest.fn().mockReturnValue(['What city were you born in?']),
    isStepComplete: false,
    onStepChange: jest.fn(),
    onStartOver: jest.fn(),
    onImportProfile: jest.fn(),
    onDownloadProfile: jest.fn(),
  };

  it('renders question form with initial question', () => {
    render(<QuestionForm {...defaultProps} />);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Please answer 5-10 questions')).toBeInTheDocument();
  });

  it('allows adding new questions when less than 10 questions exist', () => {
    render(<QuestionForm {...defaultProps} />);
    const addButton = screen.getByText('Add Another Question');
    fireEvent.click(addButton);
    expect(defaultProps.onAddQuestion).toHaveBeenCalled();
  });

  it('enables continue button when step is complete', () => {
    render(<QuestionForm {...defaultProps} isStepComplete={true} />);
    const continueButton = screen.getByText('Continue');
    expect(continueButton).not.toBeDisabled();
  });

  it('disables continue button when step is incomplete', () => {
    render(<QuestionForm {...defaultProps} isStepComplete={false} />);
    const continueButton = screen.getByText('Continue');
    expect(continueButton).toBeDisabled();
  });
}); 