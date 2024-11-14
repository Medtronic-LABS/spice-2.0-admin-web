import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import RenderFields from '../RenderFields';

// Mock the dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    tenantId: '1',
    regionId: '1',
    form: 'custom',
    clinicalWorkflowId: '52',
    workflowId: 'workflowCustomize'
  }),
  useHistory: () => ({
    push: jest.fn()
  })
}));

jest.mock('../../assets/images/calendar-icon.svg', () => ({
  ReactComponent: () => <svg data-testid='calendar-icon' />
}));

jest.mock('react-final-form', () => ({
  Field: ({ children, render: renderForm, ...props }: any) => {
    const input = {
      name: props.name,
      value: '',
      onChange: jest.fn(),
      onBlur: jest.fn()
    };
    const meta = {
      error: null,
      touched: false,
      data: {}
    };
    return renderForm ? renderForm({ input, meta }) : children({ input, meta });
  },
  useForm: () => ({
    change: jest.fn(),
    getState: jest.fn(),
    submit: jest.fn(),
    mutators: {
      setValue: jest.fn()
    }
  })
}));

const mockStore = configureStore([]);

describe('RenderFields', () => {
  const defaultProps = {
    obj: {
      id: '1',
      fieldName: 'testField',
      title: 'Test Field',
      inputType: 1,
      isResult: false
    },
    name: 'testName',
    fieldName: 'testFieldName',
    form: {
      mutators: {
        setValue: jest.fn()
      },
      getFieldState: jest.fn()
    },
    inputProps: {
      label: 'Test Label'
    }
  };

  const store = mockStore({
    labtest: {
      units: []
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders checkbox component when component type is CHECKBOX', () => {
    const mockForm = {
      ...defaultProps.form,
      change: jest.fn()
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...defaultProps}
            inputProps={{ component: 'CHECKBOX', label: 'Test Checkbox' }}
            form={mockForm}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('checkbox-component')).toBeInTheDocument();
    expect(screen.getByText('Test Checkbox')).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(checkbox).toBeInTheDocument();
  });

  it('renders select input when component type is SELECT_INPUT', () => {
    const props = {
      ...defaultProps,
      inputProps: {
        options: [
          { key: '1', label: 'Option 1' },
          { key: '2', label: 'Option 2' }
        ]
      }
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...props} inputProps={{ component: 'SELECT_INPUT', options: [] }} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('select-field-wrapper')).toBeInTheDocument();
  });

  it('renders text field when component type is TEXT_FIELD', () => {
    const props = {
      ...defaultProps,
      fieldName: 'fieldName',
      isFieldNameChangable: true,
      hashFieldIdsWithFieldName: {},
      hashFieldIdsWithTitle: {}
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              label: 'Test Text Field',
              component: 'TEXT_FIELD'
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('text-field-wrapper')).toBeInTheDocument();
  });

  it('renders instructions when component type is INSTRUCTIONS', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...defaultProps} inputProps={{ component: 'INSTRUCTIONS' }} />
        </BrowserRouter>
      </Provider>
    );

    screen.debug();

    expect(screen.getByTestId('instructions-wrapper')).toBeInTheDocument();
  });

  it('renders option list when component type is OPTION_LIST', () => {
    const localStore = mockStore({
      labtest: {
        units: []
      },
      workflow: {
        formMeta: []
      }
    });
    render(
      <Provider store={localStore}>
        <BrowserRouter>
          <RenderFields {...defaultProps} inputProps={{ component: 'OPTION_LIST', label: 'Test Option List' }} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('option-list-wrapper')).toBeInTheDocument();
  });

  it('renders target views when component type is TARGET_VIEWS', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...defaultProps}
            inputProps={{ component: 'TARGET_VIEWS' }}
            targetIds={[{ key: '1', label: 'Option 1' }]}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('multi-select-option-list-wrapper')).toBeInTheDocument();
  });

  it('renders target views when component type is TARGET_VIEWS with isCustomizationForm as true', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...defaultProps}
            inputProps={{ component: 'TARGET_VIEWS' }}
            targetIds={[{ key: '1', label: 'Option 1' }]}
            isCustomizationForm={true}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('multi-select-option-list-wrapper')).toBeInTheDocument();
  });

  it('renders questionnaire when component type is QUESTIONNAIRE', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...defaultProps}
            inputProps={{ component: 'QUESTIONNAIRE', label: 'Test Questionnaire' }}
            fieldName='testFieldName'
            obj={{
              testFieldName: [
                {
                  name: 'testName'
                }
              ]
            }}
          />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByTestId('questionnaire-wrapper')).toBeInTheDocument();
  });

  it('renders condition config when component type is CONDITION_CONFIG', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...defaultProps}
            inputProps={{ component: 'CONDITION_CONFIG' }}
            fieldName='testFieldName'
            obj={{
              testFieldName: []
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('condition-config-wrapper')).toBeInTheDocument();
  });

  it('renders ranges config when component type is RANGES_CONFIG', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...defaultProps} inputProps={{ component: 'RANGES_CONFIG' }} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('ranges-config-wrapper')).toBeInTheDocument();
  });

  it('renders date picker when component type is DATE_PICKER', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...defaultProps} inputProps={{ component: 'DATE_PICKER', label: 'Test Date Picker' }} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('date-picker-wrapper')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('textbox'));
    const options = screen.getAllByRole('option');
    const lastOption = options[options.length - 1];
    fireEvent.click(lastOption);
  });

  it('renders date picker when component type is DATE_PICKER with isCustomizationForm as true', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...defaultProps}
            inputProps={{ component: 'DATE_PICKER', label: 'Test Date Picker' }}
            isCustomizationForm={true}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('date-picker-wrapper')).toBeInTheDocument();
  });

  it('renders text field component when default', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...defaultProps} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('text-field-wrapper')).toBeInTheDocument();
  });

  it('renders instructions component when component type is INSTRUCTIONS with onClick handler', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...defaultProps} inputProps={{ component: 'INSTRUCTIONS' }} />
        </BrowserRouter>
      </Provider>
    );

    const deleteIcon = screen.getByAltText('delete');
    fireEvent.click(deleteIcon);
    expect(screen.getByTestId('instructions-wrapper')).toBeInTheDocument();
  });

  it('renders text field when component type is TEXT_FIELD with isResult fieldName', () => {
    const props = {
      ...defaultProps,
      fieldName: 'isResult',
      isFieldNameChangable: true,
      hashFieldIdsWithFieldName: {},
      hashFieldIdsWithTitle: {}
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              label: 'Test Text Field',
              component: 'TEXT_FIELD'
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('text-field-wrapper')).toBeInTheDocument();
  });

  it('renders text field when component type is TEXT_FIELD with TestedOn fieldName and orderId 1', () => {
    const props = {
      ...defaultProps,
      isFieldNameChangable: true,
      hashFieldIdsWithFieldName: {},
      hashFieldIdsWithTitle: {},
      obj: {
        id: '1',
        fieldName: 'TestedOn',
        orderId: 1,
        title: 'Test Field',
        inputType: 1,
        isResult: false,
        disableFutureDate: true
      }
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              label: 'Test Text Field',
              component: 'TEXT_FIELD'
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('text-field-wrapper')).toBeInTheDocument();
  });

  it('renders text field when component type is TEXT_FIELD with fieldNameChangable true', () => {
    const props = {
      ...defaultProps,
      fieldName: 'fieldName',
      isFieldNameChangable: true,
      isNew: true,
      hashFieldIdsWithFieldName: {},
      hashFieldIdsWithTitle: {},
      obj: {
        id: '1',
        fieldName: 'TestedOn',
        orderId: 1,
        title: 'Test Field',
        inputType: 1,
        isResult: false
      }
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              label: 'Test Text Field',
              component: 'TEXT_FIELD'
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('text-field-wrapper')).toBeInTheDocument();
  });

  it('renders select input when component type is SELECT_INPUT with fieldName as fieldName and isNew true and isFieldNameChangable false', () => {
    const props = {
      ...defaultProps,
      fieldName: 'fieldName',
      isNew: true,
      isFieldNameChangable: false,
      inputProps: {
        options: []
      }
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...props} inputProps={{ component: 'SELECT_INPUT', options: [] }} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('select-field-wrapper')).toBeInTheDocument();
  });

  it(`renders text field when component type is TEXT_FIELD
    with isCustomizationForm true with fieldName as fieldName`, () => {
    const props = {
      ...defaultProps,
      fieldName: 'fieldName',
      isCustomizationForm: true,
      isWorkFlowCustomization: false,
      hashFieldIdsWithFieldName: {},
      hashFieldIdsWithTitle: {},
      obj: {
        id: '1',
        fieldName: 'TestedOn',
        orderId: 1,
        title: 'Test Field',
        inputType: 1,
        isResult: false,
        isNeededDefault: true
      }
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              label: 'Test Text Field',
              component: 'TEXT_FIELD'
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('text-field-wrapper')).toBeInTheDocument();
  });

  it(`renders text field when component type is TEXT_FIELD
    with isCustomizationForm true with fieldName as isMandatory`, () => {
    const props = {
      ...defaultProps,
      fieldName: 'isMandatory',
      isCustomizationForm: true,
      isWorkFlowCustomization: false,
      hashFieldIdsWithFieldName: {},
      hashFieldIdsWithTitle: {},
      obj: {
        id: '1',
        fieldName: 'TestedOn',
        orderId: 1,
        title: 'Test Field',
        inputType: 1,
        isResult: false,
        isNeededDefault: true
      }
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              label: 'Test Text Field',
              component: 'TEXT_FIELD'
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('text-field-wrapper')).toBeInTheDocument();
  });

  it(`renders text field when component type is TEXT_FIELD
    with isCustomizationForm true with fieldName as isResult`, () => {
    const props = {
      ...defaultProps,
      fieldName: 'isResult',
      isCustomizationForm: true,
      isWorkFlowCustomization: false,
      hashFieldIdsWithFieldName: {},
      hashFieldIdsWithTitle: {},
      obj: {
        id: '1',
        fieldName: 'TestedOn',
        orderId: 1,
        title: 'Test Field',
        inputType: 1,
        isResult: false,
        isNeededDefault: true
      }
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              label: 'Test Text Field',
              component: 'TEXT_FIELD'
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('text-field-wrapper')).toBeInTheDocument();
  });

  it(`renders checkbox component when component type is CHECKBOX
    with fieldName as isResult and handle onChange`, () => {
    const mockForm = {
      ...defaultProps.form,
      change: jest.fn()
    };
    const props = {
      ...defaultProps,
      fieldName: 'isResult'
    };
    const { unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...props} inputProps={{ component: 'CHECKBOX', label: 'Test Checkbox' }} form={mockForm} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('checkbox-component')).toBeInTheDocument();
    expect(screen.getByText('Test Checkbox')).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(checkbox).toBeInTheDocument();
    unmount();
  });

  it(`renders checkbox component when component type is CHECKBOX
    with minDays true`, () => {
    const mockForm = {
      ...defaultProps.form,
      change: jest.fn()
    };
    const props = {
      ...defaultProps,
      fieldName: 'isResult',
      isCustomizationForm: true,
      obj: {
        ...defaultProps.obj,
        disableFutureDate: true,
        minDays: true
      }
    };
    const { unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...props} inputProps={{ component: 'CHECKBOX', label: 'Test Checkbox' }} form={mockForm} />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByTestId('checkbox-component')).toBeInTheDocument();
    expect(screen.getByText('Test Checkbox')).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(checkbox).toBeInTheDocument();
    unmount();
  });

  it(`renders checkbox component when component type is CHECKBOX
    with fieldName as disableFutureDate and isCustomizationForm as true`, () => {
    const mockForm = {
      ...defaultProps.form,
      change: jest.fn()
    };
    const props = {
      ...defaultProps,
      fieldName: 'disableFutureDate',
      isCustomizationForm: true,
      obj: {
        ...defaultProps.obj,
        disableFutureDate: true
      }
    };
    const { unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...props} inputProps={{ component: 'CHECKBOX', label: 'Test Checkbox' }} form={mockForm} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('checkbox-component')).toBeInTheDocument();
    expect(screen.getByText('Test Checkbox')).toBeInTheDocument();
    unmount();
  });

  it(`renders checkbox component when component type is CHECKBOX
    with fieldName as disableFutureDate and isCustomizationForm as false`, () => {
    const mockForm = {
      ...defaultProps.form,
      change: jest.fn()
    };
    const props = {
      ...defaultProps,
      fieldName: 'disableFutureDate',
      isCustomizationForm: false,
      obj: {
        ...defaultProps.obj,
        disableFutureDate: true
      }
    };
    const { unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...props} inputProps={{ component: 'CHECKBOX', label: 'Test Checkbox' }} form={mockForm} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('checkbox-component')).toBeInTheDocument();
    expect(screen.getByText('Test Checkbox')).toBeInTheDocument();
    unmount();
  });

  it(`renders select input when component type is SELECT_INPUT
    with fieldName as defaultValue and no options`, () => {
    const props = {
      ...defaultProps,
      fieldName: 'defaultValue'
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...props} inputProps={{ component: 'SELECT_INPUT' }} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('select-field-wrapper')).toBeInTheDocument();
  });

  it(`renders select input when component type is SELECT_INPUT
    with fieldName as defaultValue and options with id`, () => {
    const props = {
      ...defaultProps,
      fieldName: 'defaultValue',
      obj: {
        ...defaultProps.obj,
        fieldName: 'test',
        optionsList: [
          { key: '1', label: 'Option 1', id: 'test' },
          { key: '2', label: 'Option 2', id: 'test' }
        ]
      },
      inputProps: {
        options: [
          { key: '1', label: 'Option 1', id: 'test' },
          { key: '2', label: 'Option 2', id: 'test' }
        ]
      }
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...props} inputProps={{ component: 'SELECT_INPUT', options: [] }} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('select-field-wrapper')).toBeInTheDocument();
  });

  it(`renders select input when component type is SELECT_INPUT
    with fieldName as unitList`, () => {
    const props = {
      ...defaultProps,
      fieldName: 'unitList',
      inputProps: {
        options: [
          { key: '1', label: 'Option 1' },
          { key: '2', label: 'Option 2' }
        ]
      }
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...props} inputProps={{ component: 'SELECT_INPUT', options: [] }} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('select-field-wrapper')).toBeInTheDocument();
  });

  it(`renders select input when component type is SELECT_INPUT
    with fieldName as unitList with empty unit list value from store`, () => {
    const localStore = mockStore({
      labtest: {
        units: undefined
      }
    });
    const props = {
      ...defaultProps,
      fieldName: 'unitList',
      inputProps: {
        options: [
          { key: '1', label: 'Option 1' },
          { key: '2', label: 'Option 2' }
        ]
      }
    };
    render(
      <Provider store={localStore}>
        <BrowserRouter>
          <RenderFields {...props} inputProps={{ component: 'SELECT_INPUT', options: [] }} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('select-field-wrapper')).toBeInTheDocument();
  });

  it(`renders select input when component type is SELECT_INPUT
    with fieldName as orientation and no options`, () => {
    const props = {
      ...defaultProps,
      fieldName: 'orientation'
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...props} inputProps={{ component: 'SELECT_INPUT' }} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('select-field-wrapper')).toBeInTheDocument();
  });

  it(`renders select input when component type is SELECT_INPUT
    with fieldName as orientation and multiple options`, () => {
    const props = {
      ...defaultProps,
      fieldName: 'orientation',
      obj: {
        ...defaultProps.obj,
        orientation: 1
      }
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              component: 'SELECT_INPUT',
              options: [
                { key: '1', label: 'Option 1' },
                { key: '2', label: 'Option 2' }
              ]
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('select-field-wrapper')).toBeInTheDocument();
  });

  it(`renders select input when component type is SELECT_INPUT
    with fieldName as visibility and no options`, () => {
    const props = {
      ...defaultProps,
      fieldName: 'visibility'
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...props} inputProps={{ component: 'SELECT_INPUT' }} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('select-field-wrapper')).toBeInTheDocument();
  });

  it(`renders select input when component type is SELECT_INPUT
    with fieldName as resource and no options`, () => {
    const props = {
      ...defaultProps,
      fieldName: 'resource'
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...props} inputProps={{ component: 'SELECT_INPUT', options: [] }} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('select-field-wrapper')).toBeInTheDocument();
  });

  it(`renders select input when component type is SELECT_INPUT
    with fieldName as resource with one option and spinner viewType`, () => {
    const props = {
      ...defaultProps,
      fieldName: 'resource',
      obj: {
        ...defaultProps.obj,
        viewType: 'Spinner'
      }
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              component: 'SELECT_INPUT',
              options: [{ key: '1', label: 'Option 1' }]
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('select-field-wrapper')).toBeInTheDocument();
  });

  it(`renders select input when component type is SELECT_INPUT
    with fieldName as resource with multiple options`, () => {
    const props = {
      ...defaultProps,
      fieldName: 'resource'
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              component: 'SELECT_INPUT',
              options: [[{ key: '1', label: 'Option 1' }], [{ key: '2', label: 'Option 2' }]]
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('select-field-wrapper')).toBeInTheDocument();
  });

  it(`renders select input when component type is SELECT_INPUT
    with fieldName as inputType with multiple options`, () => {
    const props = {
      ...defaultProps,
      fieldName: 'inputType',
      obj: {
        ...defaultProps.obj,
        fieldName: 1
      }
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              component: 'SELECT_INPUT',
              options: [
                { key: '1', label: 'Option 1' },
                { key: '2', label: 'Option 2' }
              ]
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('select-field-wrapper')).toBeInTheDocument();
  });

  it(`renders select input when component type is SELECT_INPUT
    with fieldName as maxDays and object disableFutureDate as true`, () => {
    const props = {
      ...defaultProps,
      fieldName: 'maxDays',
      obj: {
        ...defaultProps.obj,
        disableFutureDate: true
      }
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              component: 'SELECT_INPUT',
              options: [
                { key: '1', label: 'Option 1' },
                { key: '2', label: 'Option 2' }
              ]
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('select-field-wrapper')).toBeInTheDocument();
  });

  it(`renders select input when component type is SELECT_INPUT
    with fieldName as fieldName and isNew true and newlyAddedIds and unAddedFields`, () => {
    const props = {
      ...defaultProps,
      fieldName: 'fieldName',
      isNew: true,
      newlyAddedIds: ['2'],
      unAddedFields: [
        { key: '1', type: 'TEXT', label: 'Option 1' },
        { key: '2', type: 'NUMBER', label: 'Option 2' },
        { key: '3', type: 'DATE', label: 'Option 3' }
      ],
      obj: {
        ...defaultProps.obj,
        viewType: 'RadioGroup'
      }
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              component: 'SELECT_INPUT',
              options: [
                { key: '1', label: 'Option 1' },
                { key: '2', label: 'Option 2' },
                { key: '3', label: 'Option 3' }
              ]
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('select-field-wrapper')).toBeInTheDocument();
  });

  it(`renders select input when component type is SELECT_INPUT
    with filtered options based on default viewType`, () => {
    const props = {
      ...defaultProps,
      fieldName: 'fieldName',
      isNew: true,
      newlyAddedIds: ['2'],
      unAddedFields: [
        { key: '1', type: 'TEXT', label: 'Option 1' },
        { key: '2', type: 'NUMBER', label: 'Option 2' },
        { key: '3', type: 'DATE', label: 'Option 3' }
      ],
      obj: {
        ...defaultProps.obj,
        viewType: undefined
      }
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              component: 'SELECT_INPUT',
              options: [
                { key: '1', label: 'Option 1' },
                { key: '2', label: 'Option 2' },
                { key: '3', label: 'Option 3' }
              ]
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('select-field-wrapper')).toBeInTheDocument();
  });

  it(`renders text input when component type is TEXT_FIELD
    and handles duplicate field names`, () => {
    const props = {
      ...defaultProps,
      fieldName: 'fieldName',
      isFieldNameChangable: true,
      hashFieldIdsWithFieldName: {
        '1': 'field1',
        '2': 'field2',
        '3': 'field3'
      },
      hashFieldIdsWithTitle: {},
      obj: {
        id: '1',
        fieldName: 'field1',
        title: 'Test Field',
        inputType: 1,
        isResult: false
      }
    };

    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              label: 'Test Text Field',
              component: 'TEXT_FIELD'
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'field2' } });
    fireEvent.blur(input);

    expect(screen.getByTestId('text-field-wrapper')).toBeInTheDocument();
  });

  it(`renders text input when component type is TEXT_FIELD
    and handles duplicate titles`, () => {
    const props = {
      ...defaultProps,
      fieldName: 'title',
      isFieldNameChangable: true,
      isCustomizationForm: true,
      hashFieldIdsWithFieldName: {},
      hashFieldIdsWithTitle: {
        '1': 'Title 1',
        '2': 'Title 2',
        '3': 'Title 3'
      },
      obj: {
        id: '1',
        fieldName: 'field1',
        title: 'Title 1',
        inputType: 1,
        isResult: false
      }
    };

    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              label: 'Test Title Field',
              component: 'TEXT_FIELD'
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Title 2' } });
    fireEvent.blur(input);

    expect(screen.getByTestId('text-field-wrapper')).toBeInTheDocument();
  });

  it(`renders text input and handles validation errors for field name`, () => {
    const props = {
      ...defaultProps,
      fieldName: 'fieldName',
      isFieldNameChangable: true,
      hashFieldIdsWithFieldName: {},
      hashFieldIdsWithTitle: {},
      obj: {
        id: '1',
        fieldName: 'field1',
        title: 'Test Field',
        inputType: 1,
        isResult: false
      },
      form: {
        mutators: {
          setValue: jest.fn()
        },
        getFieldState: jest.fn()
      }
    };

    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              label: 'Test Text Field',
              component: 'TEXT_FIELD'
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'field@name' } });
    fireEvent.blur(input);

    fireEvent.change(input, { target: { value: 'field.name' } });
    fireEvent.blur(input);

    fireEvent.change(input, { target: { value: 'a'.repeat(51) } });
    fireEvent.blur(input);

    fireEvent.change(input, { target: { value: '12345' } });
    fireEvent.blur(input);

    expect(screen.getByTestId('text-field-wrapper')).toBeInTheDocument();
  });

  it(`handles asterisk error validation for code and url fields`, () => {
    const mockForm = {
      mutators: {
        setValue: jest.fn()
      },
      getFieldState: jest.fn().mockImplementation((fieldPath) => {
        if (fieldPath === 'testName.code') {
          return { value: '' };
        }
        if (fieldPath === 'testName.url') {
          return { value: 'http://example.com' };
        }
      })
    };

    const props = {
      ...defaultProps,
      fieldName: 'code',
      form: mockForm,
      name: 'testName'
    };

    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              label: 'Code Field',
              component: 'TEXT_FIELD'
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Please enter the code')).toBeInTheDocument();
  });

  it('handles asterisk error validation for invalid code format', () => {
    const mockForm = {
      mutators: {
        setValue: jest.fn()
      },
      getFieldState: jest.fn().mockImplementation((fieldPath) => {
        if (fieldPath === 'testName.code') {
          return { value: '@invalid-code' };
        }
        if (fieldPath === 'testName.url') {
          return { value: 'http://example.com' };
        }
      })
    };

    const props = {
      ...defaultProps,
      fieldName: 'code',
      form: mockForm,
      name: 'testName'
    };

    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              label: 'Code Field',
              component: 'TEXT_FIELD'
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Please enter a valid code')).toBeInTheDocument();
  });

  it('handles asterisk error validation for valid code', () => {
    const mockForm = {
      mutators: {
        setValue: jest.fn()
      },
      getFieldState: jest.fn().mockImplementation((fieldPath) => {
        if (fieldPath === 'testName.code') {
          return { value: 'validcode123' };
        }
        if (fieldPath === 'testName.url') {
          return { value: 'http://example.com' };
        }
      })
    };

    const props = {
      ...defaultProps,
      fieldName: 'code',
      form: mockForm,
      name: 'testName'
    };

    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              label: 'Code Field',
              component: 'TEXT_FIELD'
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.queryByText('Please enter the code')).not.toBeInTheDocument();
    expect(screen.queryByText('Please enter a valid code')).not.toBeInTheDocument();
  });

  it('handles asterisk error validation for missing url', () => {
    const mockForm = {
      mutators: {
        setValue: jest.fn()
      },
      getFieldState: jest.fn().mockImplementation((fieldPath) => {
        if (fieldPath === 'testName.code') {
          return { value: 'validcode123' };
        }
        if (fieldPath === 'testName.url') {
          return { value: '' };
        }
      })
    };

    const props = {
      ...defaultProps,
      fieldName: 'url',
      form: mockForm,
      name: 'testName'
    };

    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              label: 'URL Field',
              component: 'TEXT_FIELD'
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Please enter the url')).toBeInTheDocument();
  });

  it('handles asterisk error validation for valid url', () => {
    const mockForm = {
      mutators: {
        setValue: jest.fn()
      },
      getFieldState: jest.fn().mockImplementation((fieldPath) => {
        if (fieldPath === 'testName.code') {
          return { value: 'validcode123' };
        }
        if (fieldPath === 'testName.url') {
          return { value: 'http://example.com' };
        }
      })
    };

    const props = {
      ...defaultProps,
      fieldName: 'url',
      form: mockForm,
      name: 'testName'
    };

    render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields
            {...props}
            inputProps={{
              label: 'URL Field',
              component: 'TEXT_FIELD'
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.queryByText('Please enter the url')).not.toBeInTheDocument();
  });

  it('returns null for isEditable field when id not in isEditableFields', () => {
    const props = {
      ...defaultProps,
      fieldName: 'isEditable',
      isCustomizationForm: true
    };

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...props} />
        </BrowserRouter>
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('returns null for isEditable field when formType is not enrollment', () => {
    const props = {
      ...defaultProps,
      fieldName: 'isEditable',
      isCustomizationForm: true
    };

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...props} />
        </BrowserRouter>
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('returns null for isEditable field when formType is not enrollment and object id is enrollment', () => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({
        tenantId: '1',
        regionId: '1',
        form: 'custom',
        clinicalWorkflowId: '52',
        workflowId: 'workflowCustomize'
      }),
      useHistory: () => ({
        push: jest.fn()
      })
    }));
    const props = {
      ...defaultProps,
      fieldName: 'isEditable',
      isCustomizationForm: true,
      obj: {
        ...defaultProps.obj,
        id: 'firstName'
      }
    };

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...props} />
        </BrowserRouter>
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('returns null for readOnly field in customization form', () => {
    const props = {
      ...defaultProps,
      fieldName: 'readOnly',
      isCustomizationForm: true
    };

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...props} />
        </BrowserRouter>
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('returns null for unitMeasurement field when id not in unitMeasurementFields', () => {
    const props = {
      ...defaultProps,
      fieldName: 'unitMeasurement',
      isCustomizationForm: true
    };

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...props} />
        </BrowserRouter>
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('returns null and unsets isEnrollment for assessment form type', () => {
    const props = {
      ...defaultProps,
      fieldName: 'isEnrollment',
      isCustomizationForm: true,
      obj: {
        ...defaultProps.obj,
        isEnrollment: true
      }
    };

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...props} />
        </BrowserRouter>
      </Provider>
    );

    expect(container.firstChild).toBeNull();
    expect(props.obj.isEnrollment).toBeUndefined();
  });

  it('returns null for condition field with unsupported viewType', () => {
    const props = {
      ...defaultProps,
      fieldName: 'condition',
      isCustomizationForm: true,
      obj: {
        ...defaultProps.obj,
        viewType: 'UnsupportedType'
      }
    };

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...props} />
        </BrowserRouter>
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders component for condition field with supported viewType', () => {
    const supportedViewTypes = ['Spinner', 'RadioGroup', 'EditText', 'SingleSelectionView'];

    supportedViewTypes.forEach((viewType) => {
      const props = {
        ...defaultProps,
        isCustomizationForm: true,
        fieldName: 'condition',
        obj: {
          ...defaultProps.obj,
          viewType
        },
        inputProps: {
          component: 'TEXT_FIELD',
          label: 'Test Field'
        }
      };

      const { container, unmount } = render(
        <Provider store={store}>
          <BrowserRouter>
            <RenderFields {...props} />
          </BrowserRouter>
        </Provider>
      );

      expect(container.firstChild).not.toBeNull();
      unmount();
    });
  });

  it('renders component when isCustomizationForm is false', () => {
    const props = {
      ...defaultProps,
      isCustomizationForm: false,
      fieldName: 'isEditable',
      inputProps: {
        component: 'TEXT_FIELD',
        label: 'Test Field'
      }
    };

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <RenderFields {...props} />
        </BrowserRouter>
      </Provider>
    );

    expect(container.firstChild).not.toBeNull();
  });
});
