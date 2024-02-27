import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import APPCONSTANTS from '../../../constants/appConstants';
import CreateHealthFacility from '../CreateHealthFacility';

const mockStore = configureMockStore();
describe('CreateSite', () => {
  const store = mockStore({
    site: {
      loading: false,
      unions: {
        list: [{ id: 1, name: 'Test' }],
        subCounty: '1'
      },
      unionLoading: false
    },
    user: {
      user: {
        countryId: 1,
        role: APPCONSTANTS.ROLES.SUPER_ADMIN
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
      loading: true,
      account: {
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
        name: 'AccountOne',
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
      ],
      accountOptions: [
        {
          name: 'accOne',
          id: '1',
          tenantId: '1'
        }
      ],
      loadingOptions: true
    },
    operatingUnit: {
      dropdownOUList: [
        {
          id: '1',
          tenantId: '2',
          name: 'OU One',
          email: 'ou@spice.mdt',
          county: '1',
          account: { name: 'accOne' }
        }
      ],
      dropdownOUListLoading: false,
      loading: false,
      operatingUnitDetail: {
        id: '1',
        name: 'OU One',
        tenantId: '1',
        account: { id: '1', name: 'accOne' },
        county: { id: '1', name: 'County' }
      }
    }
  });
  let props: any;
  let wrapper: any;

  jest.mock('react-router-dom', () => ({
    useParams: jest.fn().mockReturnValue({ tenantId: '1', regionId: '2', accountId: '2', OUId: '3' })
  }));
  jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useHistory: () => ({
      push: jest.fn()
    })
  }));
  beforeEach(() => {
    props = {
      loading: false,
      countryId: '1',
      createSiteRequest: jest.fn(),
      history: { push: jest.fn() },
      match: { params: { tenantId: '1', regionId: '2', accountId: '2', OUId: '3' } }
    };
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <CreateHealthFacility {...props} history={props.history} />
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

  it('renders SiteDetailsForm component', () => {
    expect(wrapper.find('SiteDetailsForm').length).toBe(1);
  });

  it('should render SiteDetailsForm and UserForm inside FormContainer components', () => {
    const componentWrapper = mount(
      <Provider store={store}>
        <Router>
          <CreateHealthFacility {...props} />
        </Router>
      </Provider>
    );
    const createSiteFormContainer = componentWrapper.find('FormContainer[label="Site Details"]');

    const userFormContainer = componentWrapper.find('FormContainer[label="Add User"]');
    expect(createSiteFormContainer).toHaveLength(1);
    expect(userFormContainer).toHaveLength(1);
    expect(createSiteFormContainer.find('SiteDetailsForm')).toHaveLength(1);
    expect(userFormContainer.find('UserForm')).toHaveLength(1);
  });
});
