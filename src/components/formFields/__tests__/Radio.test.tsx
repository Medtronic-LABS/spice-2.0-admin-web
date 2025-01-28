import { render, screen, fireEvent } from '@testing-library/react';
import Radio from '../Radio';

describe('Radio Component', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ];

  const mockInput = {
    onChange: jest.fn(),
    value: ''
  };

  const mockMeta = {
    touched: true,
    error: 'This field is required'
  };

  const defaultProps = {
    options: mockOptions,
    input: mockInput,
    onChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders radio square buttons correctly', () => {
    render(<Radio {...defaultProps} isRadioSquare={true} />);

    const buttonGroup = screen.getByTestId('radio-button-group');
    expect(buttonGroup).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('renders traditional radio buttons correctly', () => {
    render(<Radio {...defaultProps} isRadioSquare={false} />);

    expect(screen.queryByTestId('radio-button-group')).not.toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
    expect(screen.getAllByTestId('radio-label')).toHaveLength(2);
  });

  it('displays field label and required asterisk', () => {
    render(<Radio {...defaultProps} fieldLabel='Test Label' required={true} />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows error message when meta has error and is touched', () => {
    render(<Radio {...defaultProps} meta={mockMeta} errorLabel='custom error' />);

    expect(screen.getByText('This field is required custom error')).toBeInTheDocument();
  });

  it('handles square radio button click correctly', () => {
    render(<Radio {...defaultProps} isRadioSquare={true} />);

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);

    expect(mockInput.onChange).toHaveBeenCalledWith('option1');
    expect(defaultProps.onChange).toHaveBeenCalledWith('option1');
  });

  it('handles traditional radio button change correctly with onChange', () => {
    render(<Radio {...defaultProps} isRadioSquare={false} />);

    const inputs = screen.getAllByRole('radio');
    fireEvent.click(inputs[0]);

    expect(defaultProps.onChange).toHaveBeenCalledWith('option1');
  });

  it('handles traditional radio button change correctly without onChange', () => {
    render(<Radio {...defaultProps} input={undefined as any} isRadioSquare={false} onChange={undefined} />);

    const inputs = screen.getAllByRole('radio');
    fireEvent.click(inputs[0]);

    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  it('correctly sets active state for square buttons', () => {
    const inputWithValue = { ...mockInput, value: 'option1' };
    render(<Radio {...defaultProps} input={inputWithValue} isRadioSquare={true} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveClass('btn-primary');
    expect(buttons[1]).toHaveClass('btn-outline-secondary');
  });

  it('correctly sets checked state for traditional radio buttons', () => {
    const inputWithValue = { ...mockInput, value: 'option1' };
    render(<Radio {...defaultProps} input={inputWithValue} isRadioSquare={false} />);

    const radioInputs = screen.getAllByRole('radio');
    expect(radioInputs[0]).toBeChecked();
    expect(radioInputs[1]).not.toBeChecked();
  });
});
