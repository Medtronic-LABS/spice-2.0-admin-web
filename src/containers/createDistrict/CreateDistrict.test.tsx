import { mount } from 'enzyme';
import CreateDistrict from './CreateDistrict';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';

const mockStore = configureMockStore();
describe('CreateDistrict', () => {
  const store = mockStore({
    district: {
      loading: true,
      district: {
        id: '1',
        clinicalWorkflow: [1],
        users: [
          {
            id: '1',
            firstName: 'acc',
            lastName: 'admin',
            email: 'accadmin@spice.mdt',
            phoneNumber: '1234567890',
            username: 'accadmin@spice.mdt',
            gender: 'Male',
            countryCode: '233',
            timezone: '1',
            country: { countryCode: '232', id: '1' }
          }
        ],
        name: 'DistrictOne',
        maxNoOfUsers: '22',
        tenantId: '1'
      },
      clinicalWorkflows: [
        {
          id: '1',
          name: 'workflow One',
          moduleType: 'clinical'
        },
        {
          id: '2',
          name: 'workflow Two',
          moduleType: 'clinical'
        }
      ]
    },
    user: {
      user: {
        countryId: '1'
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
    }
  });
  let props: any;
  let wrapper: any;
  jest.mock('react-router-dom', () => ({
    useParams: jest.fn().mockReturnValue({ tenantId: '3', regionId: '2' })
  }));

  jest.mock('react-router-dom', () => ({
    useParams: jest.fn().mockReturnValue({ tenantId: '3', regionId: '2' })
  }));
  jest.mock('react-router-dom', () => ({
    useHistory: () => ({
      push: jest.fn()
    })
  }));
  beforeEach(() => {
    props = {
      loading: false,
      countryId: '1',
      createDistrictRequest: jest.fn(),
      history: { push: jest.fn() },
      match: { params: { regionId: '2', tenantId: '3' } }
    };
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <CreateDistrict {...props} />
        </Router>
      </Provider>
    );
  });

  it('renders FormContainer components', () => {
    expect(wrapper.find('FormContainer').length);
  });

  it('renders UserForm component', () => {
    expect(wrapper.find('UserForm')).toBeTruthy();
    expect(wrapper.find('UserForm').length).toBe(1);
  });

  it('renders DistrictForm component', () => {
    expect(wrapper.find('DistrictForm').length).toBe(1);
  });

  it('calls handleNavigation function when cancel button is clicked', () => {
    const button = wrapper.find('button[type="button"]');
    button.simulate('click');
    expect(props.history.push).toHaveBeenCalled();
  });

  it('should render DistrictForm and UserForm inside FormContainer components', () => {
    const componentWrapper = mount(
      <Provider store={store}>
        <Router>
          <CreateDistrict {...props} />
        </Router>
      </Provider>
    );
    const districtFormContainer = componentWrapper.find('FormContainer[label="District Details"]');

    const userFormContainer = componentWrapper.find('FormContainer[label="District Admin"]');
    expect(districtFormContainer).toHaveLength(1);
    expect(userFormContainer).toHaveLength(1);
    expect(districtFormContainer.find('DistrictForm')).toHaveLength(1);
    expect(userFormContainer.find('UserForm')).toHaveLength(1);
  });
});
