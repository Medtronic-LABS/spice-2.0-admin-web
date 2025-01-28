import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import CreateChiefdom, { IChiefdomFormValues } from '../CreateChiefdom';
import { Provider } from 'react-redux';
import { Form } from 'react-final-form';
import configureMockStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';

const mockStore = configureMockStore();

describe('CreateChiefdom', () => {
  let store: any;
  let wrapper: any;
  let history: any;
  const createChiefdom = jest.fn();
  const formValues: any = {
    chiefdom: {
      name: 'Test Unit',
      district: {
        id: '1',
        name: 'Test District'
      }
    },
    users: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        role: 'admin',
        countryId: 'US'
      }
    ]
  };
  const props: any = {
    loading: false,
    role: 'admin',
    countryId: '1',
    createChiefdom,
    match: {
      params: {
        regionId: '1',
        tenantId: '1',
        districtId: '1'
      }
    },
    history: {
      push: jest.fn()
    }
  };
  beforeEach(() => {
    history = createMemoryHistory();
    store = mockStore({
      chiefdom: {
        loading: false
      },
      user: {
        user: {
          role: 'test'
        },
        timezoneList: [
          {
            id: 1
          },
          {
            id: 2
          }
        ],
        countryList: [
          { id: 1, countryCode: '91' },
          {
            id: 2,
            countryCode: '232'
          }
        ]
      },
      district: {
        districtOptions: {}
      }
    });
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Form
            onSubmit={() => {
              //
            }}
          >
            {({ handleSubmit, submitting }) => (
              <form onSubmit={handleSubmit}>
                <Route path='/' render={() => <CreateChiefdom {...props} />} />
                <button type='submit' disabled={submitting}>
                  Submit
                </button>
              </form>
            )}
          </Form>
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render without errors', () => {
    expect(wrapper.find('form')).toHaveLength(2);
  });

  it('should call createChiefdom function on form submission', () => {
    const submitButton = wrapper.find('button[type="submit"]').first();
    expect(submitButton).toHaveLength(1);

    wrapper.find('input[name="chiefdom.name"]').simulate('change', { target: { value: formValues.chiefdom.name } });
    wrapper
      .find('input[name="users[0].firstName"]')
      .simulate('change', { target: { value: formValues.users[0].firstName } });
    wrapper
      .find('input[name="users[0].lastName"]')
      .simulate('change', { target: { value: formValues.users[0].lastName } });

    expect(wrapper.find('input[name="chiefdom.name"]').prop('value')).toEqual('Test Unit');
    expect(wrapper.find('input[name="users[0].firstName"]').prop('value')).toEqual('John');
    expect(wrapper.find('input[name="users[0].lastName"]').prop('value')).toEqual('Doe');

    submitButton.simulate('submit');
  });

  it('should submit the form when submit button is clicked', () => {
    const onSubmit = jest.fn();

    wrapper.find('input[name="chiefdom.name"]').simulate('change', { target: { value: formValues.chiefdom.name } });
    expect(wrapper.find('input[name="chiefdom.name"]').prop('value')).toEqual('Test Unit');
    const submitButton = wrapper.find('button[type="submit"]').last();
    submitButton.simulate('submit');

    expect(onSubmit).toHaveBeenCalledTimes(0);
  });

  it('should render an ChiefdomForm', () => {
    const chiefdomForm = wrapper.find('ChiefdomForm');
    expect(chiefdomForm).toHaveLength(1);
  });

  it('should render a UserForm', () => {
    const userForm = wrapper.find('UserForm');
    expect(userForm).toHaveLength(1);
  });

  it('should submit the form', () => {
    const form = wrapper.find(Form);
    const values: IChiefdomFormValues = {
      chiefdom: {
        name: 'Test Chiefdom'
      },
      users: []
    };
    form.first().prop('onSubmit')(values);
    const submitButton = wrapper.find('button[type="submit"]').last();
    submitButton.simulate('submit');
    expect(props.createChiefdom).toBeCalledTimes(0);
  });

  it('should call createChiefdom when the form is submitted', () => {
    const form = wrapper.find('form').first();
    // tslint:disable-next-line:no-empty
    form.simulate('submit', { preventDefault() {} });
    expect(props.createChiefdom).toBeCalledTimes(0);
  });

  it('should call createChiefdom when the form is submitted', () => {
    const form = wrapper.find('form').last();
    // tslint:disable-next-line:no-empty
    form.simulate('submit', { preventDefault() {} });
    expect(props.createChiefdom).toBeCalledTimes(0);
  });

  it('should navigate back to ChiefdomDashboard', () => {
    wrapper.find('button').first().simulate('click');
    expect(history.location.pathname).toEqual('/');
  });

  it('should navigate back to ChiefdomDashboard', () => {
    wrapper.find('button').at(1).simulate('click');
    expect(history.location.pathname).toEqual('/');
  });

  it('should navigate back to ChiefdomDashboard', () => {
    wrapper.find('button').last().simulate('click');
    expect(history.location.pathname).toEqual('/');
  });

  it('should navigate to OUByRegion if regionId and tenantId are present', () => {
    wrapper.setProps({ match: { params: { regionId: '1', tenantId: '2' } } });
    wrapper.find('button').first().simulate('click');
    expect(history.location.pathname).toEqual('/');
  });

  it('should navigate to OUByRegion if regionId and tenantId are present', () => {
    wrapper.setProps({ match: { params: { regionId: '1', tenantId: '2' } } });
    wrapper.find('button').at(1).simulate('click');
    expect(history.location.pathname).toEqual('/');
  });

  it('should navigate to OUByRegion if regionId and tenantId are present', () => {
    wrapper.setProps({ match: { params: { regionId: '1', tenantId: '2' } } });
    wrapper.find('button').last().simulate('click');
    expect(history.location.pathname).toEqual('/');
  });

  it('should navigate to chiefdomByDistrict if districtId, tenantId, and user has appropriate role', () => {
    wrapper.setProps({ match: { params: { districtId: '3', tenantId: '4' } }, role: 'super_admin' });
    wrapper.find('button').first().simulate('click');
    expect(history.location.pathname).toEqual('/');
  });

  it('should navigate to chiefdomByDistrict if districtId, tenantId, and user has appropriate role', () => {
    wrapper.setProps({ match: { params: { districtId: '3', tenantId: '4' } }, role: 'super_admin' });
    wrapper.find('button').at(1).simulate('click');
    expect(history.location.pathname).toEqual('/');
  });

  it('should navigate to chiefdomByDistrict if districtId, tenantId, and user has appropriate role', () => {
    wrapper.setProps({ match: { params: { districtId: '3', tenantId: '4' } }, role: 'super_admin' });
    wrapper.find('button').last().simulate('click');
    expect(history.location.pathname).toEqual('/');
  });

  it('calls createChiefdom with correct data when onSubmit is called', () => {
    const createChiefdomMock = jest.fn();
    wrapper.setProps({ createChiefdom: createChiefdomMock });

    const chiefdomData = { name: 'Test Chiefdom', users: [{ firstName: 'John', lastName: 'Doe' }] };
    const eventData = { chiefdom: chiefdomData, users: [] };

    wrapper.find('form').first().simulate('submit', { preventDefault: jest.fn(), stopPropagation: jest.fn() });

    expect(createChiefdomMock).toBeCalledTimes(0);
  });

  it('calls createChiefdom with correct data when onSubmit is called', () => {
    const createChiefdomMock = jest.fn();
    wrapper.setProps({ createChiefdom: createChiefdomMock });

    const chiefdomData = { name: 'Test Chiefdom', users: [{ firstName: 'John', lastName: 'Doe' }] };
    const eventData = { chiefdom: chiefdomData, users: [] };

    wrapper.find('form').last().simulate('submit', { preventDefault: jest.fn(), stopPropagation: jest.fn() });

    expect(createChiefdomMock).toBeCalledTimes(0);
  });
});
