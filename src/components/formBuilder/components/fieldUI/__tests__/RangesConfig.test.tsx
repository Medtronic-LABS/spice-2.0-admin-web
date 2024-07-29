import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import arrayMutators from 'final-form-arrays';
import RangesConfig from '../RangesConfig';
import { Form } from 'react-final-form';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();
describe('RangesConfig Component', () => {
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
  const rangesFieldConfigs = {
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
    }
  };

  const props = {
    name: 'myFormName',
    obj: {
      ranges: [{ unitType: 1, gender: 'Male', minRange: 1, maxRange: 2, displayRange: '1-2' }],
      id: 'myId',
      optionsList: [{ name: 'option', id: 1 }]
    },
    field: 'array',
    rangesFieldConfigs
  };

  const propsWithTextInput = {
    name: 'myFormName',
    obj: {
      ranges: [{ unitType: 1, gender: 'Male', minRange: 1, maxRange: 2, displayRange: '1-2' }],
      id: 'myId',
      optionsList: [{ name: 'option', id: 1 }]
    },
    field: 'array',
    rangesFieldConfigs,
    config: []
  };

  const propsWithMinRange = {
    name: 'myFormName',
    obj: {
      ranges: [{ unitType: 1, gender: 'Male', minRange: 1, maxRange: 2, displayRange: '1-2' }],
      id: 'myId',
      optionsList: [{ name: 'option', id: 1 }]
    },
    field: 'array',
    rangesFieldConfigs
  };

  const propsWithMaxRange = {
    name: 'myFormName',
    obj: {
      ranges: [{ unitType: 1, gender: 'Male', minRange: 1, maxRange: 2, displayRange: '1-2' }],
      id: 'myId',
      optionsList: [{ name: 'option', id: 1 }]
    },
    field: 'array',
    rangesFieldConfigs
  };

  const propsWithDisplayName = {
    name: 'myFormName',
    obj: {
      ranges: [{ unitType: 1, gender: 'Male', minRange: 1, maxRange: 2, displayRange: '1-2' }],
      id: 'myId',
      optionsList: [{ name: 'option', id: 1 }]
    },
    field: 'array',
    rangesFieldConfigs
  };

  const propsWithoutComponent = {
    name: 'myFormName',
    obj: {
      ranges: [{ unitType: 1, gender: 'Male', minRange: 1, maxRange: 2, displayRange: '1-2' }],
      id: 'myId',
      optionsList: [{ name: 'option', id: 1 }]
    },
    field: 'array',
    rangesFieldConfigs
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
            {({ handleSubmit, form }) => <RangesConfig {...props} form={form} />}
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
            {({ handleSubmit }) => <RangesConfig {...propsWithTextInput} />}
          </Form>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.exists()).toBe(true);
  });

  it('renders with fieldName as unitType', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <Form
            onSubmit={() => {
              //
            }}
            mutators={{ ...arrayMutators }}
          >
            {({ handleSubmit }) => <RangesConfig {...propsWithMinRange} />}
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
            {({ handleSubmit }) => <RangesConfig {...propsWithMaxRange} />}
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
            {({ handleSubmit }) => <RangesConfig {...propsWithDisplayName} />}
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
            {({ handleSubmit }) => <RangesConfig {...propsWithoutComponent} />}
          </Form>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.exists()).toBe(true);
  });
});
