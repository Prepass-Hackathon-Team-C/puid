import { render, screen, fireEvent } from '@testing-library/react';
import { ReviewPage } from './ReviewPage';

describe('ReviewPage', () => {
  const defaultProps = {
    puid: 'test-puid-123',
    prefixCode: 'TEST',
    prefixError: null,
    copied: false,
    minLength: 8,
    onMinLengthChange: jest.fn(),
    onPrefixChange: jest.fn(),
    onGeneratePUID: jest.fn(),
    onCopyPUID: jest.fn(),
    onAcceptPUID: jest.fn(),
    onStartOver: jest.fn(),
    allowedSpecialChars: ['-', '_'],
    onSpecialCharsChange: jest.fn(),
    availableSpecialChars: ['-', '_', '.', '~'],
  };

  it('renders password generator form', () => {
    render(<ReviewPage {...defaultProps} />);
    expect(screen.getByText('Password Generator')).toBeInTheDocument();
  });

  it('shows prefix code error when provided', () => {
    render(<ReviewPage {...defaultProps} prefixError="This prefix is already used" />);
    expect(screen.getByText('This prefix is already used')).toBeInTheDocument();
  });

  it('handles prefix code changes', () => {
    render(<ReviewPage {...defaultProps} />);
    const prefixInput = screen.getByPlaceholderText('Enter prefix code');
    fireEvent.change(prefixInput, { target: { value: 'NEW' } });
    expect(defaultProps.onPrefixChange).toHaveBeenCalledWith('NEW');
  });

  it('shows success message after accepting PUID', () => {
    render(<ReviewPage {...defaultProps} />);
    const acceptButton = screen.getByLabelText('Accept PUID');
    fireEvent.click(acceptButton);
    expect(screen.getByText('Create New Password')).toBeInTheDocument();
  });
}); 