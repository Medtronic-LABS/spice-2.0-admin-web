import { render, screen } from '@testing-library/react';
import TextAreaInput from '../TextAreaInput';

describe('TextAreaInput', () => {
  const defaultProps = {
    label: 'Test Label',
    name: 'test-input'
  };

  it('renders with default props', () => {
    render(<TextAreaInput {...defaultProps} />);

    expect(screen.getByTestId('text-area-input')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders without label when isShowLabel is false', () => {
    render(<TextAreaInput {...defaultProps} isShowLabel={false} />);

    expect(screen.getByTestId('text-area-input')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
  });

  it('displays error message and error label when error prop is provided', () => {
    const errorProps = {
      ...defaultProps,
      error: 'Error message',
      errorLabel: '(Please fix this)'
    };

    render(<TextAreaInput {...errorProps} />);

    expect(screen.getByText('Error message (Please fix this)')).toBeInTheDocument();
  });

  it('applies maxLength of 300 to textarea', () => {
    render(<TextAreaInput {...defaultProps} />);

    const textarea = screen.getByLabelText('Test Label');
    expect(textarea).toHaveAttribute('maxLength', '300');
  });

  it('passes through additional props to textarea', () => {
    render(<TextAreaInput {...defaultProps} placeholder='Enter text here' disabled={true} />);

    const textarea = screen.getByLabelText('Test Label');
    expect(textarea).toHaveAttribute('placeholder', 'Enter text here');
    expect(textarea).toBeDisabled();
  });
});
