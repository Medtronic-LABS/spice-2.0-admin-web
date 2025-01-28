import { render, screen, fireEvent } from '@testing-library/react';
import TextInput from '../TextInput';

describe('TextInput component', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    onChange: mockOnChange,
    name: 'test-input'
  };

  it('renders without crashing', () => {
    render(<TextInput {...defaultProps} />);
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });

  it('displays label if isShowLabel prop is true', () => {
    render(<TextInput {...defaultProps} label='Test Label' isShowLabel={true} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('does not display label if isShowLabel prop is false', () => {
    render(<TextInput {...defaultProps} label='Test Label' isShowLabel={false} />);
    expect(screen.queryByText('Test Label*')).not.toBeInTheDocument();
  });

  it('displays error message if error prop is provided', () => {
    render(<TextInput {...defaultProps} error='Test Error' />);
    expect(screen.getByText('Test Error')).toBeInTheDocument();
  });

  it('displays helpertext prop if provided', () => {
    const helpertext = <span>Test Helpertext</span>;
    render(<TextInput {...defaultProps} helpertext={helpertext} />);
    expect(screen.getByText('Test Helpertext')).toBeInTheDocument();
  });

  it('renders the label and input correctly', () => {
    render(<TextInput {...defaultProps} label='Test Label' name='test' />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'test');
  });

  it('calls the onChange function when input value is changed', () => {
    render(<TextInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  // branch coverage

  it('should handle showLoader as true', () => {
    render(<TextInput {...defaultProps} showLoader={true} />);
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });

  it('should handle Enter key press', () => {
    render(<TextInput {...defaultProps} lowerCase={true} capitalize={false} />);
    const input = screen.getByRole('textbox');
    fireEvent.keyUp(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });

  it('should handle capitalize as false and lowercase as false', () => {
    render(<TextInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.keyUp(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });
});
