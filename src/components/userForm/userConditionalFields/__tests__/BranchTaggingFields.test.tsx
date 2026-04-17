import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import BranchTaggingFields from '../BranchTaggingFields';
import { areaManagerRole, divisionalManagerRole, shastiyaKormiRole } from '../../../../constants/roleConstants';

const mockStore = configureStore([]);

const mockSelectInput = jest.fn();
const mockMultiSelect = jest.fn();
jest.mock('../../../formFields/SelectInput', () => ({
  __esModule: true,
  default: (props: any) => {
    mockSelectInput(props);
    return (
      <div data-testid='select-input'>
        <span>{props.label}</span>
        {props.error && <span data-testid='select-error'>{props.error}</span>}
      </div>
    );
  }
}));
jest.mock('../../../multiSelect/MultiSelect', () => ({
  __esModule: true,
  default: (props: any) => {
    mockMultiSelect(props);
    return (
      <div data-testid='multi-select'>
        <span>{props.label}</span>
        {props.error && <span data-testid='multi-select-error'>{props.error}</span>}
      </div>
    );
  }
}));

describe('BranchTaggingFields', () => {
  const defaultProps = {
    name: 'branchTagging',
    isError: jest.fn((meta: any) => meta?.error),
    index: 0
  };

  const createStore = (branchState = {}) =>
    mockStore({
      branch: {
        branchesByUnion: [],
        loading: false,
        loadingBranchesByUnion: false,
        ...branchState
      }
    });

  const renderWithForm = (
    props: Partial<React.ComponentProps<typeof BranchTaggingFields>> = {},
    store = createStore(),
    initialValues = { users: [{ role: [{ name: shastiyaKormiRole }] }] }
  ) => {
    return render(
      <Provider store={store}>
        <Form onSubmit={jest.fn()} initialValues={initialValues}>
          {() => (
            <BranchTaggingFields
              {...defaultProps}
              {...props}
            />
          )}
        </Form>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders single-select Branch field for SHASTIYA_KORMI role', () => {
    renderWithForm();
    expect(screen.getByTestId('select-input')).toBeInTheDocument();
    expect(screen.queryByTestId('multi-select')).not.toBeInTheDocument();
    expect(screen.getByText('Branch')).toBeInTheDocument();
  });

  it('passes correct props to SelectInput: label, labelKey, valueKey, isModel, required', () => {
    renderWithForm();
    expect(mockSelectInput).toHaveBeenCalled();
    const selectProps = mockSelectInput.mock.calls[0][0];
    expect(selectProps.label).toBe('Branch');
    expect(selectProps.labelKey).toBe('name');
    expect(selectProps.valueKey).toBe('id');
    expect(selectProps.isModel).toBe(true);
    expect(selectProps.required).toBe(false);
    expect(selectProps.errorLabel).toBe('branch');
  });

  it('uses branches from Redux store as options', () => {
    const branches = [
      { id: '1', name: 'Branch A' },
      { id: '2', name: 'Branch B' }
    ];
    const store = createStore({ branchesByUnion: branches });
    renderWithForm({}, store);
    const selectProps = mockSelectInput.mock.calls[0][0];
    expect(selectProps.options).toEqual(branches);
  });

  it('passes empty array when branches are not in store', () => {
    renderWithForm();
    const selectProps = mockSelectInput.mock.calls[0][0];
    expect(selectProps.options).toEqual([]);
  });

  it('passes loading state from Redux to SelectInput', () => {
    const store = createStore({ loadingBranchesByUnion: true });
    renderWithForm({}, store);
    const selectProps = mockSelectInput.mock.calls[0][0];
    expect(selectProps.loadingOptions).toBe(true);
  });

  it('calls isError with meta and passes result to SelectInput as error prop', () => {
    const customError = 'Branch is required';
    const isError = jest.fn(() => customError);
    renderWithForm({ isError });
    expect(isError).toHaveBeenCalled();
    const selectProps = mockSelectInput.mock.calls[0][0];
    expect(selectProps.error).toBe(customError);
  });

  it('uses field name with .branches suffix', () => {
    renderWithForm({ name: 'customName' });
    const selectProps = mockSelectInput.mock.calls[0][0];
    expect(selectProps.name).toBe('customName.branches');
  });

  it('applies col-sm-6 col-12 when isHFCreate is false or undefined', () => {
    const { container } = renderWithForm();
    const wrapper = container.querySelector('.col-sm-6.col-12');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).not.toHaveClass('col-lg-4');
  });

  it('applies col-12 col-sm-6 col-lg-4 when isHFCreate is true', () => {
    const { container } = renderWithForm({ isHFCreate: true });
    const wrapper = container.querySelector('.col-12.col-sm-6.col-lg-4');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders multiselect Branch field for AREA_MANAGER role', () => {
    const initialValues = { users: [{ role: [{ name: areaManagerRole }] }] };
    renderWithForm({}, createStore(), initialValues);
    expect(screen.getByTestId('multi-select')).toBeInTheDocument();
    expect(screen.queryByTestId('select-input')).not.toBeInTheDocument();
    const multiProps = mockMultiSelect.mock.calls[0][0];
    expect(multiProps.isMulti).toBe(true);
    expect(multiProps.label).toBe('Branches');
  });

  it('renders multiselect Branch field for DIVISIONAL_MANAGER role', () => {
    const initialValues = { users: [{ role: [{ name: divisionalManagerRole }] }] };
    renderWithForm({}, createStore(), initialValues);
    expect(screen.getByTestId('multi-select')).toBeInTheDocument();
    expect(screen.queryByTestId('select-input')).not.toBeInTheDocument();
  });

  it('renders multiselect Branch field when both manager and SK roles are selected', () => {
    const initialValues = {
      users: [{ role: [{ name: shastiyaKormiRole }, { name: areaManagerRole }] }]
    };
    renderWithForm({}, createStore(), initialValues);
    expect(screen.getByTestId('multi-select')).toBeInTheDocument();
    expect(screen.queryByTestId('select-input')).not.toBeInTheDocument();
  });

  it('does not render branch field for non-target roles', () => {
    const initialValues = { users: [{ role: [{ name: 'OTHER_ROLE' }] }] };
    renderWithForm({}, createStore(), initialValues);
    expect(screen.queryByTestId('select-input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('multi-select')).not.toBeInTheDocument();
  });
});
