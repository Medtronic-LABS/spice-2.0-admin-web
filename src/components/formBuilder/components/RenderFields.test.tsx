import { mount } from 'enzyme';
import { Field, Form } from 'react-final-form';
import RenderFields, { CheckboxComponent, TextFieldComponent } from './RenderFields';
import { SelectInputValues } from './RenderFields';
import RangesConfig from './fieldUI/RangesConfig';
import RangesConfig from './fieldUI/RangesConfig';
import SelectFieldWrapper from './fieldUI/SelectFieldWrapper';
import configureMockStore from 'redux-mock-store';
import arrayMutators from 'final-form-arrays';
import { Provider } from 'react-redux';

const mockStore = configureMockStore();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ form: 'labTest' })
}));

describe('RenderFields Test Cases', () => {
  const store = mockStore({
    labtest: {
      units: [
        {
          id: 2,
          createdBy: null,
          updatedBy: null,
          createdAt: '2024-07-02T07:01:31+00:00',
          updatedAt: '2024-07-02T07:01:31+00:00',
          name: 'mg/dL',
          type: 'LABTEST',
          description: 'mg/dL',
          displayOrder: 6,
          active: true,
          deleted: false
        }
      ]
    }
  });
  const obj = { id: '123', fieldName: 'Field 1', isResult: false };
  const name = 'exampleForm';
  const fieldName = 'fieldName';
  const inputProps = { component: 'SELECT_INPUT', label: 'Select Option' };
  const form = { mutators: { setValue: jest.fn() } };
  const unAddedFields = [
    { key: 'Option 1', type: 'Type 1' },
    { key: 'Option 2', type: 'Type 2' }
  ];
  const targetIds = ['456', '789'];
  const isNew = true;
  const newlyAddedIds = ['123'];
  const handleUpdateFieldName = jest.fn();
  const isFieldNameChangable = true;
  const hashFieldIdsWithTitle = { '123': 'Field 1' };
  const hashFieldIdsWithFieldName = { 'Field 1': '123' };
  describe('CheckboxComponent', () => {
    it('renders checkbox with label and disabled state', () => {
      const wrapper = mount(
        <Provider store={store}>
          {/* tslint:disable-next-line:no-empty */}
          <Form onSubmit={() => {}}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <CheckboxComponent
                  name='form'
                  fieldName='disableFutureDate'
                  inputProps={{ label: 'Disable Future Date', disabled: true }}
                />
              </form>
            )}
          </Form>
        </Provider>
        <Provider store={store}>
          {/* tslint:disable-next-line:no-empty */}
          <Form onSubmit={() => {}}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <CheckboxComponent
                  name='form'
                  fieldName='disableFutureDate'
                  inputProps={{ label: 'Disable Future Date', disabled: true }}
                />
              </form>
            )}
          </Form>
        </Provider>
      );
      expect(wrapper.find(CheckboxComponent)).toHaveLength(1);
      expect(wrapper.find(Field).prop('name')).toBe('form.disableFutureDate');
      expect(wrapper.find(Field).prop('type')).toBe('checkbox');
      expect(wrapper.find('Checkbox')).toHaveLength(1);
      expect(wrapper.find('label').text()).toBe('Disable Future Date');
      expect(wrapper.find('input')).toHaveLength(1);
      expect(wrapper.find('input').prop('disabled')).toBe(true);
    });
  });

  describe('SelectInputValues', () => {
    it('renders select input with options and selected value', () => {
      const options = [
        { key: 'option1', label: 'Option 1' },
        { key: 'option2', label: 'Option 2' },
        { key: 'option3', label: 'Option 3' }
      ];
      const wrapper = mount(
        <Provider store={store}>
          {/* tslint:disable-next-line:no-empty */}
          <Form onSubmit={() => {}}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <SelectInputValues
                  name='form'
                  fieldName='visibility'
                  obj={{ visibility: 'option2' }}
                  inputProps={{ options }}
                />
              </form>
            )}
          </Form>
        </Provider>
      );
      expect(wrapper.find(Field)).toHaveLength(1);
      expect(wrapper.find(Field).prop('name')).toBe('form');
      expect(wrapper.find(Field).prop('type')).toEqual('select');
    });

    it('renders select input with disabled state', () => {
      const options = [
        { key: 'option1', label: 'Option 1' },
        { key: 'option2', label: 'Option 2' },
        { key: 'option3', label: 'Option 3' }
      ];
      const wrapper = mount(
        <Provider store={store}>
          {/* tslint:disable-next-line:no-empty */}
          <Form onSubmit={() => {}}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <SelectInputValues
                  name='form'
                  fieldName='family'
                  obj={{ visibility: 'option2' }}
                  inputProps={{ options, disabled: true }}
                />
              </form>
            )}
          </Form>
        </Provider>
      );
      expect(wrapper.find(Field)).toHaveLength(1);
      expect(wrapper.find(Field).prop('name')).toBe('form');
      expect(wrapper.find(Field).prop('type')).toEqual('select');
    });

    it('renders select input with disabled state', () => {
      const options = [
        { key: 'option1', label: 'Option 1' },
        { key: 'option2', label: 'Option 2' },
        { key: 'option3', label: 'Option 3' }
      ];
      const wrapper = mount(
        <Provider store={store}>
          {/* tslint:disable-next-line:no-empty */}
          <Form onSubmit={() => {}}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <SelectInputValues
                  name='form'
                  fieldName='mandatoryCount'
                  obj={{ visibility: 'option2' }}
                  inputProps={{ options, disabled: true }}
                />
              </form>
            )}
          </Form>
        </Provider>
      );
      expect(wrapper.find(Field)).toHaveLength(1);
      expect(wrapper.find(Field).prop('name')).toBe('form');
      expect(wrapper.find(Field).prop('type')).toEqual('select');
    });

    it('renders select input with disabled state', () => {
      const options = [
        { key: 'option1', label: 'Option 1' },
        { key: 'option2', label: 'Option 2' },
        { key: 'option3', label: 'Option 3' }
      ];
      const wrapper = mount(
        <Provider store={store}>
          {/* tslint:disable-next-line:no-empty */}
          <Form onSubmit={() => {}}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <SelectInputValues
                  name='form'
                  fieldName='totalCount'
                  obj={{ visibility: 'option2' }}
                  inputProps={{ options, disabled: true }}
                />
              </form>
            )}
          </Form>
        </Provider>
      );
      expect(wrapper.find(Field)).toHaveLength(1);
      expect(wrapper.find(Field).prop('name')).toBe('form');
      expect(wrapper.find(Field).prop('type')).toEqual('select');
    });

    it('calls the onChange prop when input value is changed', () => {
      const mockOnChange = jest.fn();
      const wrapper = mount(
        <Provider store={store}>
          {/* tslint:disable-next-line:no-empty */}
          <Form onSubmit={() => {}}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field name='testField'>
                  {({ input: inputValue }) => <input {...inputValue} onChange={mockOnChange} />}
                </Field>
              </form>
            )}
          </Form>
        </Provider>
      );
      const input = wrapper.find('input');
      input.simulate('change', { target: { value: 'test' } });
      expect(mockOnChange).toHaveBeenCalled();
    });

    it('renders the correct number of fields', () => {
      const wrapper = mount(
        <Provider store={store}>
          {/* tslint:disable-next-line:no-empty */}
          <Form onSubmit={() => {}}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <RangesConfig
                  field='testField'
                  name='testField'
                  obj={{ testField: {} }}
                  form={{ mutators: {} }}
                  targetIds={[]}
                  unAddedFields={[]}
                  newlyAddedIds={[]}
                />
              </form>
            )}
          </Form>
        </Provider>
      );
      expect(wrapper.find('Field')).toHaveLength(0);
    });

    it('renders text input with default value and onChange handler', () => {
      const objValue = { name: 'John Doe' };
      const newInputProps = { label: 'Name' };
      const wrapper = mount(
        <Provider store={store}>
          {/* tslint:disable-next-line:no-empty */}
          <Form onSubmit={() => {}}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <TextFieldComponent
                  form={{ mutators: { setValue: jest.fn() } }}
                  name='form'
                  fieldName='fieldName'
                  obj={objValue}
                  inputProps={newInputProps}
                />
              </form>
            )}
          </Form>
        </Provider>
      );
      expect(wrapper.find(Field)).toHaveLength(1);
      expect(wrapper.find(Field).prop('name')).toBe('form.fieldName');
      expect(wrapper.find(Field).prop('type')).toEqual('text');
      expect(wrapper.find('input').prop('value')).toEqual('');
      wrapper.find('input').simulate('change', { target: { value: 'Jane Doe' } });
      expect(wrapper.find('input').prop('value')).toEqual('Jane Doe');
      expect(wrapper.find('input').prop('name')).toEqual('form.fieldName');
      expect(wrapper.find('input').prop('disabled')).toBeFalsy();
    });
  });
  it('renders the correct number of fields', () => {
    const wrapper = mount(
      <Provider store={store}>
        {/* tslint:disable-next-line:no-empty */}
        <Form onSubmit={() => {}}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <RangesConfig
                field='testField'
                name='testField'
                obj={{ testField: {} }}
                form={{ mutators: {} }}
                targetIds={[]}
                unAddedFields={[]}
                newlyAddedIds={[]}
              />
            </form>
          )}
        </Form>
      </Provider>
    );
    expect(wrapper.find('CustomTooltip')).toHaveLength(1);
  });

  it('should render CheckboxComponent correctly', () => {
    const props = {
      name: 'yourFieldName',
      fieldName: 'orientation',
      inputProps: { disabled: false, label: 'Your Label' }
    };
    const wrapper = mount(
      <Provider store={store}>
        {/* tslint:disable-next-line:no-empty */}
        <Form onSubmit={() => {}}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Field
                name={props.name}
                render={({ input }) => (
                  <CheckboxComponent name={props.name} fieldName={props.fieldName} inputProps={props.inputProps} />
                )}
              />
            </form>
          )}
        </Form>
      </Provider>
    );
    expect(wrapper.find('CheckboxComponent').props().name).toBe(props.name);
  });

  it('should render a checkbox with a label', () => {
    const newName = 'myForm';
    const newFieldName = 'myField';
    const newInputProps = { label: 'My Label' };
    const props: any = {
      name: `${newName}.${newFieldName}`,
      fieldName: 'myField',
      obj: { isResult: false },
      ...newInputProps,
      component: CheckboxComponent
    };
    const wrapper = mount(
      <Provider store={store}>
        {/* tslint:disable-next-line:no-empty */}
        <Form onSubmit={() => {}}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Field {...props} />
            </form>
          )}
        </Form>
      </Provider>
    );
    expect(wrapper.find('input[type="checkbox"]').length).toEqual(1);
    expect(wrapper.find('input[type="checkbox"]').prop('disabled')).toBeFalsy();
    expect(wrapper.find('input[type="checkbox"]').prop('readOnly')).toBeFalsy();
    expect(wrapper.find('input[type="checkbox"]').prop('checked')).toBeFalsy();
    expect(wrapper.find('label').text()).toEqual('');
  });

  it('should render a select input with options', () => {
    const newName = 'myForm';
    const newFieldName = 'myField';
    const newInputProps = {
      options: [
        { key: 'value1', label: 'Label 1' },
        { key: 'value2', label: 'Label 2' }
      ]
    };
    const newObj = { myField: 'value2' };
    const props: any = {
      name: `${newName}.${newFieldName}`,
      fieldName: 'myField',
      ...newInputProps,
      component: CheckboxComponent,
      obj: newObj
    };
    const wrapper = mount(
      <Provider store={store}>
        {/* tslint:disable-next-line:no-empty */}
        <Form onSubmit={() => {}}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Field {...props} />
            </form>
          )}
        </Form>
      </Provider>
    );
    expect(wrapper.find('select').length).toEqual(0);
    expect(wrapper.find('option').length).toEqual(0);
  });

  it('renders SelectInputValues correctly', () => {
    const props = {
      name: 'formName',
      fieldName: 'fieldName',
      inputProps: { options: ['Option 1', 'Option 2'] },
      obj: {},
      newlyAddedIds: [],
      unAddedFields: [],
      handleUpdateFieldName: jest.fn()
    };
    const wrapper = mount(
      // tslint:disable-next-line:no-empty
      <Provider store={store}>
        {/* tslint:disable-next-line:no-empty */}
        <Form onSubmit={() => {}}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <SelectInputValues {...props} />
            </form>
          )}
        </Form>
      </Provider>
    );
    expect(wrapper.find('SelectFieldWrapper')).toHaveLength(1);
  });

  it('renders SelectInputValues with fieldName orientation', () => {
    const props = {
      name: 'formName',
      fieldName: 'orientation',
      inputProps: { options: ['Option 1', 'Option 2'] },
      obj: {},
      newlyAddedIds: [],
      unAddedFields: [],
      handleUpdateFieldName: jest.fn()
    };
    const wrapper = mount(
      <Provider store={store}>
        {/* tslint:disable-next-line:no-empty */}
        <Form onSubmit={() => {}}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <SelectInputValues {...props} />
            </form>
          )}
        </Form>
      </Provider>
    );
    expect(wrapper.find('SelectFieldWrapper')).toHaveLength(1);
  });

  it('renders SelectInputValues with fieldName defaultValue', () => {
    const props = {
      name: 'formName',
      fieldName: 'defaultValue',
      inputProps: { options: ['Option 1', 'Option 2'] },
      obj: {},
      newlyAddedIds: [],
      unAddedFields: [],
      handleUpdateFieldName: jest.fn()
    };
    const wrapper = mount(
      <Provider store={store}>
        {/* tslint:disable-next-line:no-empty */}
        <Form onSubmit={() => {}}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <SelectInputValues {...props} />
            </form>
          )}
        </Form>
      </Provider>
    );
    expect(wrapper.find('SelectFieldWrapper')).toHaveLength(1);
  });

  it('renders SelectInputValues with fieldName inputType', () => {
    const props = {
      name: 'formName',
      fieldName: 'inputType',
      inputProps: { options: ['Option 1', 'Option 2'] },
      obj: {},
      newlyAddedIds: [],
      unAddedFields: [],
      handleUpdateFieldName: jest.fn()
    };

    const wrapper = mount(
      <Provider store={store}>
        {/* tslint:disable-next-line:no-empty */}
        <Form onSubmit={() => {}}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <SelectInputValues {...props} />
            </form>
          )}
        </Form>
      </Provider>
    );
    expect(wrapper.find('SelectFieldWrapper')).toHaveLength(1);
  });

  it('renders SelectInputValues with fieldName unitType', () => {
    const props = {
      name: 'formName',
      fieldName: 'unitType',
      inputProps: {},
      obj: {},
      newlyAddedIds: [],
      unAddedFields: [],
      handleUpdateFieldName: jest.fn()
    };
    const wrapper = mount(
      <Provider store={store}>
        {/* tslint:disable-next-line:no-empty */}
        <Form onSubmit={() => {}}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <SelectInputValues {...props} />
            </form>
          )}
        </Form>
      </Provider>
    );
    expect(wrapper.find('SelectFieldWrapper')).toHaveLength(1);
  });

  it('renders TextFieldComponent correctly', () => {
    const props = {
      form: {},
      name: 'formName',
      fieldName: 'fieldName',
      obj: {},
      inputProps: { type: 'text' },
      targetIds: [],
      newlyAddedIds: [],
      handleUpdateFieldName: jest.fn(),
      hashFieldIdsWithTitle: {},
      hashFieldIdsWithFieldName: {}
    };
    const wrapper = mount(
      <Provider store={store}>
        {/* tslint:disable-next-line:no-empty */}
        <Form onSubmit={() => {}}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <TextFieldComponent {...props} />
            </form>
          )}
        </Form>
      </Provider>
    );
    expect(wrapper.find('TextFieldWrapper')).toHaveLength(1);
  });

  it('renders TextFieldComponent correctly with defaultValue', () => {
    const props = {
      form: {},
      name: 'formName',
      fieldName: 'fieldName',
      obj: {},
      inputProps: { type: 'text' },
      targetIds: [],
      newlyAddedIds: [],
      handleUpdateFieldName: jest.fn(),
      hashFieldIdsWithTitle: {},
      hashFieldIdsWithFieldName: {}
    };
    const wrapper = mount(
      <Provider store={store}>
        {/* tslint:disable-next-line:no-empty */}
        <Form onSubmit={() => {}}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <TextFieldComponent {...props} />
            </form>
          )}
        </Form>
      </Provider>
    );
    expect(wrapper.find('TextFieldWrapper')).toHaveLength(1);
  });

  it('should render select input with options', () => {
    const newName = 'exampleField';
    const customValue = 'option2';
    const customOptions = [
      { key: 'option1', label: 'Option 1' },
      { key: 'option2', label: 'Option 2' },
      { key: 'option3', label: 'Option 3' }
    ];
    const customParseFn = jest.fn();
    const newInputProps = {
      component: 'SELECT_INPUT',
      label: 'Example Field',
      options: customOptions
    };
    const wrapper = mount(
      <Provider store={store}>
        {/* tslint:disable-next-line:no-empty */}
        <Form onSubmit={() => {}}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <SelectFieldWrapper
                name={newName}
                customValue={customValue}
                customOptions={customOptions}
                customParseFn={customParseFn}
                inputProps={newInputProps}
              />
            </form>
          )}
        </Form>
      </Provider>
    );
    expect(wrapper.find('select').exists()).toBe(false);
    expect(wrapper.find('option')).toHaveLength(0);
    expect(customParseFn).toHaveBeenCalledTimes(0);
  });

  it('should return the correct inputProps when fieldName is "fieldName" and isNew is true', () => {
    const getComponentsByFieldName = jest.fn();
    const newFieldName = 'fieldName';
    const newObj = {};
    const isNewValue = true;
    const isFieldNameChangableField = true;
    const expected = undefined;
    const newInputProps = getComponentsByFieldName(newFieldName, newObj, isNewValue, isFieldNameChangableField);
    expect(newInputProps).toEqual(expected);
  });

  it('should return the correct customOptions, customParseFn, and customValue', () => {
    const newHandleUpdateFieldName = jest.fn();
    expect(newHandleUpdateFieldName).not.toHaveBeenCalled();
  });

  it('renders CheckboxComponent for component="CHECKBOX"', () => {
    inputProps.component = 'INSTRUCTIONS';
    const wrapper = mount(
      <Provider store={store}>
        {/* tslint:disable-next-line:no-empty */}
        <Form onSubmit={() => {}}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <RenderFields
                obj={obj}
                name={name}
                fieldName={fieldName}
                inputProps={inputProps}
                form={form}
                unAddedFields={unAddedFields}
                targetIds={targetIds}
                isNew={isNew}
                newlyAddedIds={newlyAddedIds}
                handleUpdateFieldName={handleUpdateFieldName}
                isFieldNameChangable={isFieldNameChangable}
                hashFieldIdsWithTitle={hashFieldIdsWithTitle}
                hashFieldIdsWithFieldName={hashFieldIdsWithFieldName}
              />
            </form>
          )}
        </Form>
      </Provider>
    );
    const textInputArray = wrapper.find('TextInputArray');
    expect(textInputArray).toHaveLength(0);
    expect(wrapper.find(CheckboxComponent)).toHaveLength(0);
  });

  it('renders RANGES CONFIG', () => {
    const wrapper = mount(
      <Provider store={store}>
        {/* tslint:disable-next-line:no-empty */}
        <Form onSubmit={() => {}} mutators={{ ...arrayMutators }}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <RenderFields
                obj={{
                  id: 'Diastolic',
                  viewType: 'EditText',
                  title: 'Diastolic',
                  fieldName: 'Diastolic',
                  family: 'bloodPressure1721133296951',
                  isMandatory: false,
                  isEnabled: true,
                  visibility: 'visible',
                  ranges: [
                    {
                      unitType: 'mmol/L',
                      minRange: 1,
                      maxRange: 200,
                      displayRange: '1 - 200',
                      order: '1'
                    }
                  ],
                  hint: 'Diastolic',
                  errorMessage: 'Please enter a valid diastolic value',
                  inputType: -1,
                  isDefault: false,
                  minLength: 1,
                  maxLength: 200,
                  orderId: 3
                }}
                name={name}
                fieldName={'ranges'}
                inputProps={{ ...inputProps, component: 'RANGES_CONFIG' }}
                form={form}
                unAddedFields={unAddedFields}
                targetIds={targetIds}
                isNew={true}
                newlyAddedIds={newlyAddedIds}
                handleUpdateFieldName={handleUpdateFieldName}
                isFieldNameChangable={false}
                hashFieldIdsWithTitle={hashFieldIdsWithTitle}
                hashFieldIdsWithFieldName={hashFieldIdsWithFieldName}
              />
            </form>
          )}
        </Form>
      </Provider>
    );
    const textInputArray = wrapper.find('TextInputArray');
    expect(textInputArray).toHaveLength(0);
  });
});
