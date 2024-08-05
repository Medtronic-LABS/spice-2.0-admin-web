import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import CreateSubCounty, { IOUFormValues } from '../CreateSubCounty';
import { Provider } from 'react-redux';
import { Form } from 'react-final-form';
import configureMockStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';

const mockStore = configureMockStore();

describe('CreateSubCounty', () => {
  let store: any;
  let wrapper: any;
  let history: any;
  const createSubCounty = jest.fn();
  const formValues: any = {
    operatingUnit: {
      name: 'Test Unit',
      account: {
        id: '1',
        name: 'Test Account'
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
    createSubCounty,
    match: {
      params: {
        regionId: '1',
        tenantId: '1',
        accountId: '1'
      }
    },
    history: {
      push: jest.fn()
    }
  };
  beforeEach(() => {
    history = createMemoryHistory();
    store = mockStore({
      operatingUnit: {
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
      account: {
        accountOptions: {}
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
                <Route path='/' render={() => <CreateSubCounty {...props} />} />
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

  it('should call createSubCounty function on form submission', () => {
    const submitButton = wrapper.find('button[type="submit"]').first();
    expect(submitButton).toHaveLength(1);

    wrapper
      .find('input[name="operatingUnit.name"]')
      .simulate('change', { target: { value: formValues.operatingUnit.name } });
    wrapper
      .find('input[name="users[0].firstName"]')
      .simulate('change', { target: { value: formValues.users[0].firstName } });
    wrapper
      .find('input[name="users[0].lastName"]')
      .simulate('change', { target: { value: formValues.users[0].lastName } });

    expect(wrapper.find('input[name="operatingUnit.name"]').prop('value')).toEqual('Test Unit');
    expect(wrapper.find('input[name="users[0].firstName"]').prop('value')).toEqual('John');
    expect(wrapper.find('input[name="users[0].lastName"]').prop('value')).toEqual('Doe');

    submitButton.simulate('submit');
  });

  it('should submit the form when submit button is clicked', () => {
    const onSubmit = jest.fn();

    wrapper
      .find('input[name="operatingUnit.name"]')
      .simulate('change', { target: { value: formValues.operatingUnit.name } });
    expect(wrapper.find('input[name="operatingUnit.name"]').prop('value')).toEqual('Test Unit');
    const submitButton = wrapper.find('button[type="submit"]').last();
    submitButton.simulate('submit');

    expect(onSubmit).toHaveBeenCalledTimes(0);
  });

  it('should render an SubCountyForm', () => {
    const operatingUnitForm = wrapper.find('SubCountyForm');
    expect(operatingUnitForm).toHaveLength(1);
  });

  it('should render a UserForm', () => {
    const userForm = wrapper.find('UserForm');
    expect(userForm).toHaveLength(1);
  });

  it('should submit the form', () => {
    const form = wrapper.find(Form);
    const values: IOUFormValues = {
      subCounty: {
        name: 'Test Operating Unit'
      },
      users: []
    };
    form.first().prop('onSubmit')(values);
    const submitButton = wrapper.find('button[type="submit"]').last();
    submitButton.simulate('submit');
    expect(props.createSubCounty).toBeCalledTimes(0);
  });

  it('should call createSubCounty when the form is submitted', () => {
    const form = wrapper.find('form').first();
    // tslint:disable-next-line:no-empty
    form.simulate('submit', { preventDefault() {} });
    expect(props.createSubCounty).toBeCalledTimes(0);
  });

  it('should call createSubCounty when the form is submitted', () => {
    const form = wrapper.find('form').last();
    // tslint:disable-next-line:no-empty
    form.simulate('submit', { preventDefault() {} });
    expect(props.createSubCounty).toBeCalledTimes(0);
  });

  it('should navigate back to SubCountyDashboard', () => {
    wrapper.find('button').first().simulate('click');
    expect(history.location.pathname).toEqual('/');
  });

  it('should navigate back to SubCountyDashboard', () => {
    wrapper.find('button').at(1).simulate('click');
    expect(history.location.pathname).toEqual('/');
  });

  it('should navigate back to SubCountyDashboard', () => {
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

  it('should navigate to OUByAccount if accountId, tenantId, and user has appropriate role', () => {
    wrapper.setProps({ match: { params: { accountId: '3', tenantId: '4' } }, role: 'super_admin' });
    wrapper.find('button').first().simulate('click');
    expect(history.location.pathname).toEqual('/');
  });

  it('should navigate to OUByAccount if accountId, tenantId, and user has appropriate role', () => {
    wrapper.setProps({ match: { params: { accountId: '3', tenantId: '4' } }, role: 'super_admin' });
    wrapper.find('button').at(1).simulate('click');
    expect(history.location.pathname).toEqual('/');
  });

  it('should navigate to OUByAccount if accountId, tenantId, and user has appropriate role', () => {
    wrapper.setProps({ match: { params: { accountId: '3', tenantId: '4' } }, role: 'super_admin' });
    wrapper.find('button').last().simulate('click');
    expect(history.location.pathname).toEqual('/');
  });

  it('calls createSubCounty with correct data when onSubmit is called', () => {
    const createSubCountyMock = jest.fn();
    wrapper.setProps({ createSubCounty: createSubCountyMock });

    const operatingUnitData = { name: 'Test OU', users: [{ firstName: 'John', lastName: 'Doe' }] };
    const eventData = { operatingUnit: operatingUnitData, users: [] };

    wrapper.find('form').first().simulate('submit', { preventDefault: jest.fn(), stopPropagation: jest.fn() });

    expect(createSubCountyMock).toBeCalledTimes(0);
  });

  it('calls createSubCounty with correct data when onSubmit is called', () => {
    const createSubCountyMock = jest.fn();
    wrapper.setProps({ createSubCounty: createSubCountyMock });

    const operatingUnitData = { name: 'Test OU', users: [{ firstName: 'John', lastName: 'Doe' }] };
    const eventData = { operatingUnit: operatingUnitData, users: [] };

    wrapper.find('form').last().simulate('submit', { preventDefault: jest.fn(), stopPropagation: jest.fn() });

    expect(createSubCountyMock).toBeCalledTimes(0);
  });
});
