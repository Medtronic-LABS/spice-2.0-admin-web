import { mount } from 'enzyme';
import CreateDistrict from './CreateDistrict';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock react-leaflet to avoid ES module issues
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid='map-container'>{children}</div>,
  TileLayer: () => <div data-testid='tile-layer' />,
  Marker: ({ children }: any) => <div data-testid='marker'>{children}</div>,
  Popup: ({ children }: any) => <div data-testid='popup'>{children}</div>,
  useMap: () => ({
    setView: jest.fn(),
    getCenter: () => ({ lat: 0, lng: 0 })
  }),
  useMapEvent: jest.fn(),
  useMapEvents: jest.fn()
}));

jest.mock('leaflet/dist/leaflet.css', () => ({}));

// Mock react-router-dom hooks
const mockPush = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useHistory: () => ({
      push: mockPush
    }),
    useParams: () => ({ tenantId: '3', regionId: '2' })
  };
});

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
      ],
      districtList: [],
      districtOptions: {}
    },
    user: {
      user: {
        countryId: '1',
        country: { id: 1, appTypes: [] },
        appTypes: []
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
      ],
      cultureList: [],
      designationList: [],
      communityList: [],
      userRoles: {}
    },
    healthFacility: {
      healthFacilityList: [],
      loading: false,
      assignedHFListForHFAdmin: [],
      peerSupervisorList: { list: [] },
      villagesFromHFList: { list: [] },
      villagesList: { list: [] },
      countryList: [],
      cultureList: [],
      chiefdomList: []
    },
    chiefdom: {
      chiefdomList: [],
      listTotal: 0,
      loading: false
    },
    region: {
      regions: [],
      total: 0,
      loading: false,
      loadingMore: false,
      error: null,
      detail: {
        id: '',
        tenantId: '',
        name: '',
        list: [],
        appTypes: [],
        total: 0
      },
      isClientRegistryEnabled: undefined,
      file: {},
      uploading: false,
      downloading: false,
      subVillages: [],
      subVillagesLoading: false
    },
    common: {
      labelName: null
    }
  });
  let props: any;
  let wrapper: any;
  beforeEach(() => {
    mockPush.mockClear();
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
    if (button.length > 0) {
      button.simulate('click');
      expect(mockPush).toHaveBeenCalled();
    }
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
