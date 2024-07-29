import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import arrayMutators from 'final-form-arrays';
import ConditionConfig from '../ConditionConfig';
import { Form } from 'react-final-form';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();
describe('ConditionConfig Component', () => {
  const item = {
    lengthGreaterThan: 5,
    targetId: 'field1'
  };

  const store = mockStore({
    labtest: {
      units: [
        {
          id: 1,
          createdBy: 1,
          updatedBy: 1,
          createdAt: '2022-04-18T20:39:27+00:00',
          updatedAt: '2022-04-18T20:39:27+00:00',
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
  const conditionFieldConfigs = {
    unitType: {
      name: '.unitType',
      label: 'Unit',
      labelKey: 'name',
      valueKey: 'id',
      options: [
        {
          id: 1,
          createdBy: 1,
          updatedBy: 1,
          createdAt: '2022-04-18T20:39:27+00:00',
          updatedAt: '2022-04-18T20:39:27+00:00',
          name: 'mg/dL',
          type: 'LABTEST',
          description: 'mg/dL',
          displayOrder: 6,
          active: true,
          deleted: false
        }
      ],
      error: 'Please select the unit',
      required: true,
      disabledValidation: true,
      order: 1,
      component: 'SELECT_INPUT',
      isLabelButton: true,
      colSize: 'col-6 col-md-4 col-lg-2'
    },
    minRange: {
      name: '.minRange',
      type: 'number',
      label: 'Min Value',
      error: 'Please enter a valid number',
      required: true,
      disabledValidation: true,
      component: 'TEXT_INPUT',
      colSize: 'col-6 col-md-4 col-lg-3'
    },
    maxRange: {
      name: '.maxRange',
      type: 'number',
      label: 'Max Value',
      error: 'Please enter a valid number',
      required: true,
      disabledValidation: true,
      component: 'TEXT_INPUT',
      colSize: 'col-6 col-md-4 col-lg-3'
    },
    displayRange: {
      name: '.displayRange',
      type: 'text',
      label: 'Display Range',
      error: 'Please enter a valid display range',
      required: true,
      disabledValidation: true,
      component: 'TEXT_INPUT',
      colSize: 'col-6 col-md-4 col-lg-3'
    },
    order: {
      name: '.order',
      type: 'text',
      label: 'Order',
      error: 'Invalid order',
      required: true,
      disabledValidation: true,
      component: 'TEXT_INPUT',
      colSize: 'col-6 col-md-4 col-lg-1'
    }
  };

  const props = {
    item,
    name: 'myFormName',
    obj: {
      id: 'myId',
      array: [
        {
          targetId: 0,
          targetOption: 'option'
        }
      ]
    },
    config: [],
    field: 'array',
    index: 0,
    conditionFieldConfigs,
    newlyAddedIds: ['field1', 'field2'],
    unAddedFields: [{ key: 'field3', label: 'Field 3' }],
    targetIds: [
      { key: 'field1', label: 'Field 1' },
      { key: 'field2', label: 'Field 2' }
    ]
  };

  const propsWithTextInput = {
    item,
    name: 'myFormName',
    obj: {
      id: 'myId',
      array: [
        {
          lengthGreaterThan: 0,
          targetOption: 'option'
        }
      ]
    },
    config: [],
    field: 'array',
    index: 0,
    conditionFieldConfigs,
    newlyAddedIds: ['field1', 'field2'],
    unAddedFields: [{ key: 'field3', label: 'Field 3' }],
    targetIds: [
      { key: 'field1', label: 'Field 1' },
      { key: 'field2', label: 'Field 2' }
    ]
  };

  const propsWithFieldNameEnabled = {
    item,
    name: 'myFormName',
    obj: {
      id: 'myId',
      array: [
        {
          enabled: false,
          targetOption: 'option'
        }
      ]
    },
    config: [],
    field: 'array',
    index: 0,
    conditionFieldConfigs,
    newlyAddedIds: ['field1', 'field2'],
    unAddedFields: [{ key: 'field3', label: 'Field 3' }],
    targetIds: [
      { key: 'field1', label: 'Field 1' },
      { key: 'field2', label: 'Field 2' }
    ]
  };

  const propsWithFieldNameVisibilty = {
    item,
    name: 'myFormName',
    obj: {
      id: 'myId',
      array: [
        {
          visibility: false,
          targetOption: 'option'
        }
      ]
    },
    config: [],
    field: 'array',
    index: 0,
    conditionFieldConfigs,
    newlyAddedIds: ['field1', 'field2'],
    unAddedFields: [{ key: 'field3', label: 'Field 3' }],
    targetIds: [
      { key: 'field1', label: 'Field 1' },
      { key: 'field2', label: 'Field 2' }
    ]
  };

  const propsWithFieldNameEq = {
    item,
    name: 'myFormName',
    obj: {
      id: 'myId',
      array: [
        {
          eq: false,
          targetOption: 'option'
        }
      ]
    },
    config: [],
    field: 'array',
    index: 0,
    conditionFieldConfigs,
    newlyAddedIds: ['field1', 'field2'],
    unAddedFields: [{ key: 'field3', label: 'Field 3' }],
    targetIds: [
      { key: 'field1', label: 'Field 1' },
      { key: 'field2', label: 'Field 2' }
    ]
  };

  const propsWithoutComponent = {
    item,
    name: 'myFormName',
    obj: {
      id: 'myId',
      array: [
        {
          targetId: 1,
          targetOption: 'option'
        }
      ]
    },
    config: [],
    field: 'array',
    index: 0,
    conditionFieldConfigs
  };

  it('renders without error', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <Form
            onSubmit={() => {
              //
            }}
            mutators={{ ...arrayMutators }}
          >
            {({ handleSubmit }) => <ConditionConfig {...props} />}
          </Form>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.exists()).toBe(true);
  });

  it('renders with Text Input component', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <Form
            onSubmit={() => {
              //
            }}
            mutators={{ ...arrayMutators }}
          >
            {({ handleSubmit }) => <ConditionConfig {...propsWithTextInput} />}
          </Form>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.exists()).toBe(true);
  });

  it('renders with fieldName as enabled', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <Form
            onSubmit={() => {
              //
            }}
            mutators={{ ...arrayMutators }}
          >
            {({ handleSubmit }) => <ConditionConfig {...propsWithFieldNameEnabled} />}
          </Form>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.exists()).toBe(true);
  });

  it('renders with fieldName as visibility', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <Form
            onSubmit={() => {
              //
            }}
            mutators={{ ...arrayMutators }}
          >
            {({ handleSubmit }) => <ConditionConfig {...propsWithFieldNameVisibilty} />}
          </Form>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.exists()).toBe(true);
  });

  it('renders with fieldName as eq', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <Form
            onSubmit={() => {
              //
            }}
            mutators={{ ...arrayMutators }}
          >
            {({ handleSubmit }) => <ConditionConfig {...propsWithFieldNameEq} />}
          </Form>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.exists()).toBe(true);
  });

  it('renders without component', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <Form
            onSubmit={() => {
              //
            }}
            mutators={{ ...arrayMutators }}
          >
            {({ handleSubmit }) => <ConditionConfig {...propsWithoutComponent} />}
          </Form>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.exists()).toBe(true);
  });
});
