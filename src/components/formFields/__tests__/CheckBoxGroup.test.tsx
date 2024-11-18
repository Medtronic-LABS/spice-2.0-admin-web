import { render, screen, fireEvent } from '@testing-library/react';
import CheckboxGroup from '../CheckboxGroup';

describe('CheckboxGroup', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ];

  const mockFields = {
    value: ['option1'],
    push: jest.fn(),
    remove: jest.fn()
  };

  const mockMeta = {
    touched: false,
    error: ''
  };

  const defaultProps = {
    options: mockOptions,
    fields: mockFields,
    meta: mockMeta,
    fieldLabel: 'Test Label',
    errorLabel: 'is required',
    required: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    render(<CheckboxGroup {...defaultProps} />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('checks the box based on fields.value', () => {
    render(<CheckboxGroup {...defaultProps} />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('calls push when unchecked box is clicked', () => {
    render(<CheckboxGroup {...defaultProps} />);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);

    expect(mockFields.push).toHaveBeenCalledWith('option2');
  });

  it('calls remove when checked box is clicked', () => {
    render(<CheckboxGroup {...defaultProps} />);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(mockFields.remove).toHaveBeenCalledWith(0);
  });

  it('displays error message when meta has error', () => {
    const propsWithError = {
      ...defaultProps,
      meta: {
        ...mockMeta,
        touched: true,
        error: 'Field'
      },
      fields: {
        ...mockFields,
        value: []
      }
    };

    render(<CheckboxGroup {...propsWithError} />);

    expect(screen.getByText('Field is required')).toBeInTheDocument();
  });

  it('handles Enter key press', () => {
    render(<CheckboxGroup {...defaultProps} />);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.keyPress(checkboxes[0], { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(checkboxes[0]).toBeChecked();
  });

  it('handles other key press without required', () => {
    render(
      <CheckboxGroup
        options={mockOptions}
        fields={mockFields}
        meta={mockMeta}
        fieldLabel='Test Label'
        errorLabel='is required'
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.keyPress(checkboxes[0], { key: ' ', code: 'Space', charCode: 32 });
    expect(checkboxes[0]).toBeChecked();
  });
});
