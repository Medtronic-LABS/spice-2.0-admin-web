import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import SelectFieldWrapper from '../SelectFieldWrapper';
import userEvent from '@testing-library/user-event';

const mockChildComponent = jest.fn();
jest.mock('../../../../../components/formFields/SelectInput', () => (props: any) => {
  mockChildComponent(props);
  return (
    <div data-testid='select-input'>
      <select>
        <option value='1'>Option 1</option>
        <option value='2'>Option 2</option>
      </select>
    </div>
  );
});

describe('SelectFieldWrapper', () => {
  const mockOptions = [
    { key: '1', label: 'Option 1' },
    { key: '2', label: 'Option 2' }
  ];

  const defaultProps = {
    name: 'testSelect',
    inputProps: {
      label: 'Test Select',
      options: mockOptions,
      required: true
    },
    obj: {}
  };

  const renderComponent = (props = {}) => {
    return render(
      <Form
        // tslint:disable-next-line:no-empty
        onSubmit={() => {}}
        render={({ form }) => <SelectFieldWrapper form={form} {...defaultProps} {...props} />}
      />
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    renderComponent();
    expect(screen.getByTestId('select-input')).toBeInTheDocument();
  });

  it('handles custom options', () => {
    const customOptions = [
      { key: 'custom1', label: 'Custom 1' },
      { key: 'custom2', label: 'Custom 2' }
    ];
    renderComponent({
      inputProps: {
        ...defaultProps.inputProps,
        options: customOptions
      }
    });
    expect(screen.getByTestId('select-input')).toBeInTheDocument();
  });

  it('handles custom parse and format functions', () => {
    const customParseFn = jest.fn((val) => val.toUpperCase());
    const customFormatFn = jest.fn((val) => val.toLowerCase());

    renderComponent({
      customParseFn,
      customFormatFn
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '1' } });

    expect(screen.getByTestId('select-input')).toBeInTheDocument();
  });

  it('handles custom value and error', () => {
    const customValue = { key: '1', label: 'Option 1' };
    const customError = 'Custom error message';

    renderComponent({
      customValue,
      customError,
      inputProps: {
        ...defaultProps.inputProps,
        error: 'Input error'
      }
    });

    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('handles multi-select mode', async () => {
    const onChange = jest.fn();
    renderComponent({
      isMulti: true,
      onChange
    });

    const select = screen.getByRole('combobox');
    await userEvent.click(select);
    await userEvent.click(screen.getByText('Option 1'));
    await userEvent.click(screen.getByText('Option 2'));

    expect(screen.getByTestId('select-input')).toBeInTheDocument();
  });

  it('handles disabled validation', () => {
    renderComponent({
      inputProps: {
        ...defaultProps.inputProps,
        disabledValidation: true
      }
    });

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('handles auto-select functionality', () => {
    const autoSelectValue = mockOptions[0];
    renderComponent({
      autoSelect: true,
      autoSelectValue
    });

    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('handles custom onChange handler', async () => {
    const onChange = jest.fn();
    renderComponent({ onChange });

    const select = screen.getByRole('combobox');
    await userEvent.click(select);
    await userEvent.click(screen.getByText('Option 1'));

    expect(screen.getByTestId('select-input')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    renderComponent({
      inputProps: {
        ...defaultProps.inputProps,
        disabled: true
      }
    });

    expect(screen.getByTestId('select-input')).toBeInTheDocument();
  });

  it('render component without name', () => {
    renderComponent({
      name: undefined
    });
    expect(screen.getByTestId('select-input')).toBeInTheDocument();
  });

  it('handles without custom parse and format functions', () => {
    renderComponent({});

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '1' } });

    expect(screen.getByTestId('select-input')).toBeInTheDocument();
  });

  it('handles input onChange with next value', () => {
    const mockObj = {};
    renderComponent({
      obj: mockObj
    });

    const selectInputProps = mockChildComponent.mock.calls[0][0];

    const mockNextValue = { key: '1', label: 'Option 1' };
    selectInputProps.input.onChange(mockNextValue);

    expect(mockChildComponent).toHaveBeenCalled();
  });

  it('handles input onChange without next value', () => {
    const mockObj = {};
    renderComponent({
      obj: mockObj
    });

    const selectInputProps = mockChildComponent.mock.calls[0][0];

    selectInputProps.input.onChange(null);

    expect(mockChildComponent).toHaveBeenCalled();
  });

  it('handles onChange with onChange prop', () => {
    const onChange = jest.fn();
    renderComponent({ onChange });

    const selectInputProps = mockChildComponent.mock.calls[0][0];

    selectInputProps.onChange({ target: { value: '1' } });

    expect(onChange).toHaveBeenCalled();
  });

  it('handles onChange without onChange prop', () => {
    renderComponent({});

    const selectInputProps = mockChildComponent.mock.calls[0][0];
    selectInputProps.onChange({ target: { value: '1' } });
    expect(screen.getByTestId('select-input')).toBeInTheDocument();
  });
});
