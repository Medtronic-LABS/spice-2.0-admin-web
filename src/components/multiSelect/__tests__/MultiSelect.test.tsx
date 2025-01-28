import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import MultiSelect from '../MultiSelect';

const mockChildComponent = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let capturedOptionProps: any;
jest.mock('react-select', () => ({
  components: {
    Option: (props: any) => {
      capturedOptionProps = props;
      return null;
    }
  },
  __esModule: true,
  default: (props: any) => {
    mockChildComponent(props);
    return <div data-testid='react-select'>React select component</div>;
  }
}));

const mockOptions = [
  { id: 1, name: 'Option 1' },
  { id: 2, name: 'Option 2' },
  { id: 3, name: 'Option 3' }
];

const defaultProps = {
  name: 'test-select',
  options: mockOptions,
  labelKey: 'name',
  valueKey: 'id',
  onChange: jest.fn(),
  isSelectAll: true,
  isShowLabel: true,
  label: 'Test Select'
};

const renderMultiSelect = (props = {}) => {
  // tslint:disable-next-line:no-empty
  return render(<Form onSubmit={() => {}}>{() => <MultiSelect {...defaultProps} {...props} />}</Form>);
};

describe('MultiSelect', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders with basic props', () => {
    renderMultiSelect();
    expect(screen.getByText('Test Select')).toBeInTheDocument();
    expect(screen.getByTestId('react-select')).toBeInTheDocument();
  });

  it('shows required asterisk when required prop is true', () => {
    renderMultiSelect({ required: true });
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('auto-selects single option when isDefaultSelected is true', () => {
    const singleOption = [{ id: 1, name: 'Single Option' }];
    renderMultiSelect({
      options: singleOption,
      required: true,
      isDefaultSelected: true
    });

    expect(screen.getByTestId('multi-select')).toBeInTheDocument();
  });

  it('render with value and single option', () => {
    renderMultiSelect({
      value: [{ id: 1, name: 'Option 1' }],
      options: [{ id: 1, name: 'Option 1' }],
      required: true,
      isDefaultSelected: true
    });

    jest.runAllTimers();

    expect(screen.getByTestId('react-select')).toBeInTheDocument();
  });

  it('renders to check multiOption function without disabledOptions', () => {
    renderMultiSelect({
      value: [{ id: 1, name: 'Option 1' }],
      options: mockOptions
    });

    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const OptionComponent = lastCall.components.Option;

    render(<OptionComponent value='*' label='Select All' isSelected={false} />);
    expect(screen.getByTestId('react-select')).toBeInTheDocument();
  });

  it('renders to check multiOption function with disabledOptions and without value props', () => {
    renderMultiSelect({
      value: [{ id: 1, name: 'Option 1' }],
      options: mockOptions,
      disabledOptions: [{ id: 1, name: 'Option 1' }]
    });
    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const OptionComponent = lastCall.components.Option;

    render(<OptionComponent label='Select All' isSelected={false} />);
    expect(screen.getByTestId('react-select')).toBeInTheDocument();
  });

  it('handles set-value action', () => {
    renderMultiSelect();
    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const onInputChange = lastCall.onInputChange;

    onInputChange('test', { action: 'set-value' });
    expect(screen.getByTestId('react-select')).toBeInTheDocument();
  });

  it('handles input-change action', () => {
    renderMultiSelect();
    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const onInputChange = lastCall.onInputChange;

    onInputChange('test', { action: 'input-change' });
    expect(screen.getByTestId('react-select')).toBeInTheDocument();
  });

  it('handles menu-close action', () => {
    renderMultiSelect();
    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const onInputChange = lastCall.onInputChange;

    onInputChange('test', { action: 'input-change' });
    onInputChange('test', { action: 'menu-close' });
    expect(screen.getByTestId('react-select')).toBeInTheDocument();
  });

  it('handles input-down action', () => {
    renderMultiSelect();
    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const onInputChange = lastCall.onInputChange;

    onInputChange('test', { action: 'input-down' });
    expect(screen.getByTestId('react-select')).toBeInTheDocument();
  });

  it('handles keydown events correctly', () => {
    renderMultiSelect();
    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const onKeyDown = lastCall.onKeyDown;

    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    const preventDefaultSpy = jest.spyOn(spaceEvent, 'preventDefault');
    onKeyDown(spaceEvent);
    expect(preventDefaultSpy).toHaveBeenCalled();

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    preventDefaultSpy.mockClear();
    onKeyDown(enterEvent);
    expect(preventDefaultSpy).not.toHaveBeenCalled();

    const capitalSpaceEvent = new KeyboardEvent('keydown', { key: 'Space' });
    preventDefaultSpy.mockClear();
    onKeyDown(capitalSpaceEvent);
    expect(preventDefaultSpy).not.toHaveBeenCalled();

    const otherEvent = new KeyboardEvent('keydown', { key: 'a' });
    preventDefaultSpy.mockClear();
    onKeyDown(otherEvent);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it('filters options correctly when disabledOptions is empty', () => {
    renderMultiSelect();
    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const onChange = lastCall.onChange;

    onChange([{ value: '*', label: 'Select All' }], {});
    expect(mockChildComponent).toHaveBeenCalled();
  });

  it('filters options correctly when disabledOptions is present', () => {
    renderMultiSelect({
      disabledOptions: [{ id: 1, name: 'Option 1' }],
      value: [{ id: 2, name: 'Option 2' }]
    });
    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const onChange = lastCall.onChange;

    onChange([{ value: '*', label: 'Select All' }], {});
    expect(mockChildComponent).toHaveBeenCalled();
  });

  it('filters options correctly when options match disabled options', () => {
    renderMultiSelect({
      disabledOptions: [{ id: 1, name: 'Option 1' }],
      options: [{ id: 1, name: 'Option 1' }],
      value: []
    });
    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const onChange = lastCall.onChange;

    onChange([{ value: '*', label: 'Select All' }], {});
    expect(mockChildComponent).toHaveBeenCalled();
  });

  it('handles "Select All" being clicked', () => {
    const onChange = jest.fn();
    renderMultiSelect({ onChange });

    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const handleChange = lastCall.onChange;

    handleChange([{ value: '*', label: 'Select All' }], { action: 'select-option' });

    expect(onChange).toHaveBeenCalled();
  });

  it('handles "Select All" being clicked without value', () => {
    const onChange = jest.fn();
    renderMultiSelect({ onChange, value: undefined });

    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const handleChange = lastCall.onChange;

    handleChange([{ value: '*', label: 'Select All' }], { action: 'select-option' });

    expect(onChange).toHaveBeenCalled();
  });

  it('handles individual option selection', () => {
    const onChange = jest.fn();
    renderMultiSelect({ onChange });

    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const handleChange = lastCall.onChange;

    const selectedOption = { value: 1, label: 'Option 1' };
    handleChange([selectedOption], { action: 'select-option' });

    expect(onChange).toHaveBeenCalledWith([selectedOption], { action: 'select-option' });
  });

  it('handles "Select All" being unclicked', () => {
    const onChange = jest.fn();
    const mandatoryOptions = [{ id: 1, name: 'Mandatory Option' }];

    renderMultiSelect({
      onChange,
      mandatoryOptions,
      value: [
        { id: 1, name: 'Option 1' },
        { id: 2, name: 'Option 2' }
      ]
    });

    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const handleChange = lastCall.onChange;

    handleChange([], { action: 'clear' });

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0]).toEqual(expect.arrayContaining(mandatoryOptions));
  });

  it('handles selecting all filtered options only with value', () => {
    const onChange = jest.fn();
    renderMultiSelect({
      onChange,
      value: [{ id: 1, name: 'Option 1' }]
    });

    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const handleChange = lastCall.onChange;

    const filteredOptions = mockOptions.map((opt) => ({
      value: opt.id,
      label: opt.name
    }));

    handleChange(filteredOptions, { action: 'select-option' });

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0].length).toBe(mockOptions.length);
  });

  it('handles selecting all filtered options with selected options as empty', () => {
    const onChange = jest.fn();
    renderMultiSelect({
      onChange,
      value: [{ id: 1, name: 'Option 1' }]
    });

    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const handleChange = lastCall.onChange;

    handleChange([], { action: 'select-option' });

    expect(onChange).toHaveBeenCalled();
  });

  it('handles selecting all filtered options with selected options as empty and value as undefined', () => {
    const onChange = jest.fn();
    renderMultiSelect({
      onChange,
      value: undefined
    });

    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const handleChange = lastCall.onChange;

    handleChange([], { action: 'select-option' });

    expect(onChange).toHaveBeenCalled();
  });

  it('filters regular options based on input', () => {
    renderMultiSelect();
    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const filterOption = lastCall.filterOption;

    expect(filterOption({ value: 1, label: 'Test Option' }, 'test')).toBe(true);
    expect(filterOption({ value: 1, label: 'Test Option' }, 'xyz')).toBe(false);
  });

  it('handles "Select All" option correctly', () => {
    renderMultiSelect({
      selectAll: true,
      options: mockOptions
    });
    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const filterOption = lastCall.filterOption;

    expect(filterOption({ value: '*', label: 'Select All' }, '')).toBe(true);
  });

  it('hides "Select All" option when selectAll is false', () => {
    renderMultiSelect({
      selectAll: false,
      options: mockOptions
    });
    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const filterOption = lastCall.filterOption;

    expect(filterOption({ value: '*', label: 'Select All' }, '')).toBe(false);
  });

  it('handles multiValueRemove styles with mandatoryOptions', () => {
    renderMultiSelect({
      mandatoryOptions: [{ id: 1, name: 'Mandatory Option' }]
    });

    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const styles = lastCall.styles;

    const resultWithMandatory = styles.multiValueRemove({}, { data: { id: 1 } });
    expect(resultWithMandatory.display).toBe('none');

    const resultWithoutMandatory = styles.multiValueRemove({}, { data: { id: 2 } });
    expect(resultWithoutMandatory.display).toBeUndefined();
  });

  it('handles multiValueRemove styles with optionsDisabled', () => {
    renderMultiSelect({
      optionsDisabled: true
    });

    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const styles = lastCall.styles;

    const result = styles.multiValueRemove({}, { data: {} });
    expect(result.display).toBe('none');
  });

  it('handles multiValueRemove styles with isFixed or isDisabled', () => {
    renderMultiSelect({
      isDisabled: true
    });

    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const styles = lastCall.styles;

    const resultWithFixed = styles.multiValueRemove({}, { data: { isFixed: true } });
    expect(resultWithFixed.display).toBe('none');

    const resultWithDisabled = styles.multiValueRemove({}, { data: {} });
    expect(resultWithDisabled.display).toBe('none');

    renderMultiSelect({
      isDisabled: false
    });
    const lastCallEnabled = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];
    const stylesEnabled = lastCallEnabled.styles;
    const resultEnabled = stylesEnabled.multiValueRemove({}, { data: { isFixed: false } });
    expect(resultEnabled.display).toBeUndefined();
  });

  it('cover branch coverage with array labelKey and valueKey', () => {
    renderMultiSelect({
      labelKey: ['name', 'id'],
      valueKey: ['name', 'id']
    });

    expect(screen.getByTestId('react-select')).toBeInTheDocument();
  });

  it('cover branch coverage with different labelKey and valueKey', () => {
    renderMultiSelect({
      labelKey: 'one',
      valueKey: 'two',
      options: mockOptions
    });

    expect(screen.getByTestId('react-select')).toBeInTheDocument();
  });

  it('cover branch coverage without labelKey and valueKey', () => {
    renderMultiSelect({
      labelKey: undefined,
      valueKey: undefined
    });

    expect(screen.getByTestId('react-select')).toBeInTheDocument();
  });

  it('cover branch coverage with error', () => {
    renderMultiSelect({
      error: 'error',
      isModel: true,
      errorLabel: 'errorLabel'
    });

    expect(screen.getByTestId('react-select')).toBeInTheDocument();
  });
  it('renders with selectAll as false', () => {
    renderMultiSelect({
      isSelectAll: false
    });
    expect(screen.getByText('Test Select')).toBeInTheDocument();
    expect(screen.getByTestId('react-select')).toBeInTheDocument();
  });

  it('renders with options as undefined', () => {
    renderMultiSelect({
      options: undefined
    });
    expect(screen.getByText('Test Select')).toBeInTheDocument();
    expect(screen.getByTestId('react-select')).toBeInTheDocument();
  });

  it('renders with isSelectAll as false', () => {
    renderMultiSelect({
      required: true,
      isSelectAll: false,
      isModel: true,
      error: true,
      errorLabel: 'errorLabel'
    });
    expect(screen.getByText('Test Select')).toBeInTheDocument();
    expect(screen.getByTestId('react-select')).toBeInTheDocument();
  });
});
