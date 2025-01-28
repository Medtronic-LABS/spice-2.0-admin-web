import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import SelectInput, { AsyncSelectInput } from '../SelectInput';

const mockOptions = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' }
];

const mockSelectChildComponent = jest.fn();
jest.mock('react-select', () => ({
  __esModule: true,
  default: (props: any) => {
    mockSelectChildComponent(props);
    return <div data-testid='select-component'>Select Component</div>;
  }
}));

const mockAsyncChildComponent = jest.fn();
jest.mock('react-select/async', () => ({
  __esModule: true,
  default: (props: any) => {
    mockAsyncChildComponent(props);
    return <div data-testid='async-select-component'>Async Select Component</div>;
  }
}));

describe('SelectInput', () => {
  const defaultProps = {
    label: 'Test Select',
    options: mockOptions,
    input: {
      name: 'testSelect',
      onChange: jest.fn(),
      value: ''
    }
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithForm = (ui: React.ReactElement) => {
    // tslint:disable-next-line:no-empty
    return render(<Form onSubmit={() => {}}>{() => ui}</Form>);
  };

  it('renders select input component', () => {
    renderWithForm(<SelectInput {...defaultProps} />);
    expect(screen.getByTestId('select-input')).toBeInTheDocument();
  });

  it('renders select input component with isModel as true', () => {
    renderWithForm(<SelectInput {...defaultProps} isModel={true} />);
    expect(screen.getByTestId('select-input')).toBeInTheDocument();
  });

  it('shows required asterisk when required prop is true', () => {
    renderWithForm(<SelectInput {...defaultProps} required={true} />);
    const selectInput = screen.getByTestId('select-input');
    expect(selectInput.querySelector('.input-asterisk')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    renderWithForm(<SelectInput {...defaultProps} error='This field is required' errorLabel='Error Label' />);
    expect(screen.getByText('This field is required Error Label')).toBeInTheDocument();
  });

  it('auto-selects first option when only one option is available', async () => {
    const singleOption = [{ label: 'Single Option', value: 'single' }];

    renderWithForm(
      <SelectInput
        {...defaultProps}
        options={singleOption}
        name='testSelect'
        autoSelect={true}
        input={{ ...defaultProps.input }}
      />
    );
    jest.advanceTimersByTime(0);

    expect(screen.getByTestId('select-input')).toBeInTheDocument();
  });

  it('disables the select when disabled prop is true', () => {
    renderWithForm(<SelectInput {...defaultProps} disabled={true} />);
    expect(screen.getByTestId('select-input')).toBeInTheDocument();
  });

  it('shows only dropdown when showOnlyDropdown is true', () => {
    renderWithForm(<SelectInput {...defaultProps} showOnlyDropdown={true} />);
    const selectInput = screen.getByTestId('select-input');
    expect(selectInput.querySelector('label')).not.toBeInTheDocument();
    expect(selectInput.querySelector('.error')).not.toBeInTheDocument();
  });

  it('handle onChange event', () => {
    renderWithForm(<SelectInput {...defaultProps} onChange={jest.fn()} />);
    const mockOnChange = mockSelectChildComponent.mock.calls[0][0];
    mockOnChange.onChange({ value: '1' }, jest.fn());
    expect(defaultProps.input.onChange).toHaveBeenCalledWith({ value: '1' });
  });

  it('handle onChange event without input and onChange prop', () => {
    renderWithForm(<SelectInput {...defaultProps} input={undefined} />);
    const mockOnChange = mockSelectChildComponent.mock.calls[0][0];
    mockOnChange.onChange({ value: '1' }, jest.fn());
  });

  it('call getOptionLabel function with labelKey as array and nestedObject', () => {
    renderWithForm(<SelectInput {...defaultProps} labelKey={['label']} nestedObject={true} />);
    const mockGetOptionLabel = mockSelectChildComponent.mock.calls[0][0];
    mockGetOptionLabel.getOptionLabel({ label: 'Option 1', value: '1' });
    expect(mockGetOptionLabel.getOptionLabel).toBeDefined();
  });

  it('call getOptionLabel function with labelKey as string and nestedObject as false and appendPlus as true', () => {
    renderWithForm(<SelectInput {...defaultProps} labelKey='label' nestedObject={false} appendPlus={true} />);
    const mockGetOptionLabel = mockSelectChildComponent.mock.calls[0][0];
    mockGetOptionLabel.getOptionLabel({ label: 'Option 1', value: '1' });
    expect(mockGetOptionLabel.getOptionLabel).toBeDefined();
  });

  it('call getOptionLabel function with labelKey as string and nestedObject as false and appendPlus as false', () => {
    renderWithForm(<SelectInput {...defaultProps} labelKey='label' nestedObject={false} appendPlus={false} />);
    const mockGetOptionLabel = mockSelectChildComponent.mock.calls[0][0];
    mockGetOptionLabel.getOptionLabel({ label: 'Option 1', value: '1' });
    expect(mockGetOptionLabel.getOptionLabel).toBeDefined();
  });

  it('call getOptionLabel function with labelKey as null and nestedObject as false', () => {
    renderWithForm(<SelectInput {...defaultProps} labelKey={undefined} nestedObject={false} />);
    const mockGetOptionLabel = mockSelectChildComponent.mock.calls[0][0];
    mockGetOptionLabel.getOptionLabel({ label: 'Option 1', value: '1' });
    expect(mockGetOptionLabel.getOptionLabel).toBeDefined();
  });

  it('call getOptionValue function with valueKey as array and nestedObject', () => {
    renderWithForm(<SelectInput {...defaultProps} valueKey={['value1', 'value2']} nestedObject={true} />);
    const mockGetOptionValue = mockSelectChildComponent.mock.calls[0][0];
    mockGetOptionValue.getOptionValue({ label: 'Option 1', value1: { value2: '1' } });
    expect(mockGetOptionValue.getOptionValue).toBeDefined();
  });

  it('call getOptionValue function with valueKey as string and nestedObject as false', () => {
    renderWithForm(<SelectInput {...defaultProps} valueKey='value1' nestedObject={false} />);
    const mockGetOptionValue = mockSelectChildComponent.mock.calls[0][0];
    mockGetOptionValue.getOptionValue({ label: 'Option 1', value1: { value2: '1' } });
    expect(mockGetOptionValue.getOptionValue).toBeDefined();
  });

  it('call getOptionValue function with valueKey as null and nestedObject as false', () => {
    renderWithForm(<SelectInput {...defaultProps} valueKey={undefined} nestedObject={false} />);
    const mockGetOptionValue = mockSelectChildComponent.mock.calls[0][0];
    mockGetOptionValue.getOptionValue({ label: 'Option 1', value1: { value2: '1' } });
    expect(mockGetOptionValue.getOptionValue).toBeDefined();
  });

  it('access style props for SelectInput', () => {
    renderWithForm(<SelectInput {...defaultProps} options={mockOptions} isModel={true} />);
    const mockStyle = mockSelectChildComponent.mock.calls[0][0];
    mockStyle.styles.menuPortal({});
  });
});

describe('AsyncSelectInput', () => {
  const defaultAsyncProps = {
    label: 'Async Select',
    input: {
      name: 'asyncSelect',
      onChange: jest.fn(),
      value: ''
    },
    loadInputOptions: jest.fn().mockResolvedValue([
      { label: 'Async Option 1', value: '1' },
      { label: 'Async Option 2', value: '2' }
    ])
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders async select component', () => {
    render(<AsyncSelectInput {...defaultAsyncProps} options={mockOptions} />);
    expect(screen.getByTestId('async-select-input')).toBeInTheDocument();
  });

  it('displays error message for async select', () => {
    render(
      <AsyncSelectInput {...defaultAsyncProps} options={mockOptions} error='Error message' errorLabel='Error Label' />
    );
    expect(screen.getByText('Error message Error Label')).toBeInTheDocument();
  });

  it('shows required asterisk for async select when required is true', () => {
    render(<AsyncSelectInput {...defaultAsyncProps} options={mockOptions} required={true} />);
    const asyncSelect = screen.getByTestId('async-select-input');
    expect(asyncSelect.querySelector('.input-asterisk')).toBeInTheDocument();
  });

  it('renders select input component with isModel as true', () => {
    render(<AsyncSelectInput {...defaultAsyncProps} isModel={true} options={mockOptions} />);
    expect(screen.getByTestId('async-select-input')).toBeInTheDocument();
  });

  it('call getOptionLabel function with labelKey as array and nestedObject', () => {
    render(<AsyncSelectInput {...defaultAsyncProps} labelKey={['label']} nestedObject={true} options={mockOptions} />);
    const mockGetOptionLabel = mockAsyncChildComponent.mock.calls[0][0];
    mockGetOptionLabel.getOptionLabel({ label: 'Option 1', value: '1' });
    expect(mockGetOptionLabel.getOptionLabel).toBeDefined();
  });

  it('call getOptionLabel function with labelKey as string and nestedObject as false and appendPlus as true', () => {
    render(
      <AsyncSelectInput
        {...defaultAsyncProps}
        labelKey='label'
        nestedObject={false}
        appendPlus={true}
        options={mockOptions}
      />
    );
    const mockGetOptionLabel = mockAsyncChildComponent.mock.calls[0][0];
    mockGetOptionLabel.getOptionLabel({ label: 'Option 1', value: '1' });
    expect(mockGetOptionLabel.getOptionLabel).toBeDefined();
  });

  it('call getOptionLabel function with labelKey as string and nestedObject as false and appendPlus as false', () => {
    render(
      <AsyncSelectInput
        {...defaultAsyncProps}
        labelKey='label'
        nestedObject={false}
        appendPlus={false}
        options={mockOptions}
      />
    );
    const mockGetOptionLabel = mockAsyncChildComponent.mock.calls[0][0];
    mockGetOptionLabel.getOptionLabel({ label: 'Option 1', value: '1' });
    expect(mockGetOptionLabel.getOptionLabel).toBeDefined();
  });

  it('call getOptionLabel function with labelKey as null and nestedObject as false', () => {
    render(<AsyncSelectInput {...defaultAsyncProps} labelKey={undefined} nestedObject={false} options={mockOptions} />);
    const mockGetOptionLabel = mockAsyncChildComponent.mock.calls[0][0];
    mockGetOptionLabel.getOptionLabel({ label: 'Option 1', value: '1' });
    expect(mockGetOptionLabel.getOptionLabel).toBeDefined();
  });

  it('call getOptionValue function with valueKey as array and nestedObject', () => {
    render(
      <AsyncSelectInput
        {...defaultAsyncProps}
        valueKey={['value1', 'value2']}
        nestedObject={true}
        options={mockOptions}
      />
    );
    const mockGetOptionValue = mockAsyncChildComponent.mock.calls[0][0];
    mockGetOptionValue.getOptionValue({ label: 'Option 1', value1: { value2: '1' } });
    expect(mockGetOptionValue.getOptionValue).toBeDefined();
  });

  it('call getOptionValue function with valueKey as string and nestedObject as false', () => {
    render(<AsyncSelectInput {...defaultAsyncProps} valueKey='value1' nestedObject={false} options={mockOptions} />);
    const mockGetOptionValue = mockAsyncChildComponent.mock.calls[0][0];
    mockGetOptionValue.getOptionValue({ label: 'Option 1', value1: { value2: '1' } });
    expect(mockGetOptionValue.getOptionValue).toBeDefined();
  });

  it('call getOptionValue function with valueKey as null and nestedObject as false', () => {
    render(<AsyncSelectInput {...defaultAsyncProps} valueKey={undefined} nestedObject={false} options={mockOptions} />);
    const mockGetOptionValue = mockAsyncChildComponent.mock.calls[0][0];
    mockGetOptionValue.getOptionValue({ label: 'Option 1', value1: { value2: '1' } });
    expect(mockGetOptionValue.getOptionValue).toBeDefined();
  });

  it('call loadOptions function with inputValue length greater than 2', () => {
    const mockLoadInputOptions = jest.fn();
    render(<AsyncSelectInput {...defaultAsyncProps} options={mockOptions} loadInputOptions={mockLoadInputOptions} />);
    const mockLoadOptions = mockAsyncChildComponent.mock.calls[0][0];
    mockLoadOptions.loadOptions('test', jest.fn());
    jest.runAllTimers();
    expect(mockLoadOptions.loadOptions).toBeDefined();
  });

  it('call loadOptions function with inputValue length less than 2', () => {
    const mockLoadInputOptions = jest.fn();
    render(<AsyncSelectInput {...defaultAsyncProps} options={mockOptions} loadInputOptions={mockLoadInputOptions} />);
    const mockLoadOptions = mockAsyncChildComponent.mock.calls[0][0];
    mockLoadOptions.loadOptions('te', jest.fn());
    jest.runAllTimers();
    expect(mockLoadOptions.loadOptions).toBeDefined();
  });

  it('handle onChange function', () => {
    render(<AsyncSelectInput {...defaultAsyncProps} onChange={jest.fn()} options={mockOptions} />);
    const mockOnChange = mockAsyncChildComponent.mock.calls[0][0];
    mockOnChange.onChange({ value: '1' }, jest.fn());
    expect(defaultAsyncProps.input.onChange).toHaveBeenCalledWith({ value: '1' });
  });

  it('access style props for AsyncSelectInput', () => {
    render(<AsyncSelectInput {...defaultAsyncProps} options={mockOptions} isModel={true} />);
    const mockStyle = mockAsyncChildComponent.mock.calls[0][0];
    mockStyle.styles.menuPortal({});
  });
});
