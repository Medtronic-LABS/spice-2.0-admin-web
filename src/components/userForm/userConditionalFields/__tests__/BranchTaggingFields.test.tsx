import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import BranchTaggingFields from '../BranchTaggingFields';

const mockStore = configureStore([]);

const mockSelectInput = jest.fn();
jest.mock('../../../formFields/SelectInput', () => ({
  __esModule: true,
  default: (props: any) => {
    mockSelectInput(props);
    return (
      <div data-testid="select-input">
        <span>{props.label}</span>
        {props.error && <span data-testid="select-error">{props.error}</span>}
      </div>
    );
  }
}));

describe('BranchTaggingFields', () => {
  const defaultProps = {
    name: 'branchTagging',
    isError: jest.fn((meta: any) => meta?.error)
  };

  const createStore = (branchState = {}) =>
    mockStore({
      branch: {
        branchesByUnion: [],
        loading: false,
        ...branchState
      }
    });

  const renderWithForm = (
    props: Partial<React.ComponentProps<typeof BranchTaggingFields>> = {},
    store = createStore()
  ) => {
    return render(
      <Provider store={store}>
        <Form onSubmit={() => {}}>
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

  it('renders the Branch select field', () => {
    renderWithForm();
    expect(screen.getByTestId('select-input')).toBeInTheDocument();
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
    const store = createStore({ loading: true });
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
});
