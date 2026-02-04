import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter, Route } from 'react-router-dom';
import DistrictSummary from '../DistrictSummary';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/districtDataConstants';

const mockStore = configureMockStore();

// Mock react-leaflet to avoid ESM issues in Jest
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

jest.mock('../../../assets/images/edit.svg', () => ({
  ReactComponent: 'EditIcon'
}));

// Mock UserForm to avoid pulling in heavy formBuilder/labtest dependencies
jest.mock('../../../components/userForm/UserForm', () => ({
  __esModule: true,
  default: () => <div>UserFormMock</div>
}));

jest.mock('../../../constants/appConstants', () => ({
  ...jest.requireActual('../../../constants/appConstants'),
  ROLES: {
    SUPER_USER: 'SUPER_USER',
    SUPER_ADMIN: 'SUPER_ADMIN',
    REGION_ADMIN: 'REGION_ADMIN',
    DISTRICT_ADMIN: 'DISTRICT_ADMIN',
    CHIEFDOM_ADMIN: 'CHIEFDOM_ADMIN'
  },
  CHIEFDOM_DELETE_CONFIRMATION: undefined,
  DELETE_CONSENT_TITLE: 'Delete confirmation',
  DELETE_CONSENT_CONFIRMATION: 'Are you sure you want to delete the district consent form?'
}));

jest.mock('../../../hooks/tablePagination', () => ({
  useTablePaginationHook: jest.fn(() => ({
    listParams: {
      page: 2,
      rowsPerPage: 10
    },
    setListReqParams: jest.fn()
  }))
}));

describe('District Summary', () => {
  let store: any;
  let wrapper: any;
  const props: any = {
    match: {
      params: {
        districtId: '1',
        tenantId: '2'
      }
    }
  };

  beforeEach(() => {
    store = mockStore({
      district: {
        district: {
          id: '1',
          clinicalWorkflow: [1],
          users: MOCK_DATA_CONSTANTS.DISTRICT_DETAIL_RESPONSE_PAYLOAD.users,
          name: 'DistrictOne',
          maxNoOfUsers: '22',
          tenantId: '1'
        },
        loading: false,
        clinicalWorkflows: MOCK_DATA_CONSTANTS.FETCH_CLINICAL_WORKFLOWS_RESPONSE_PAYLOAD
      },
      workflow: {
        loading: false
      },
      user: {
        user: {
          role: 'SUPER_ADMIN',
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
        ]
      },
      healthFacility: {
        loading: false
      },
      common: {
        labelName: null
      }
    });

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/tenant/1']}>
          <Route path='/tenant/:tenantId'>
            <DistrictSummary {...props} />
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render CustomTable component', () => {
    expect(wrapper.find('CustomTable')).toHaveLength(1);
  });

  it('should render DetailCard component', () => {
    expect(wrapper.find('DetailCard')).toHaveLength(2);
  });

  it('should render ModalForm component', () => {
    expect(wrapper.find('Memo()')).toHaveLength(3);
  });

  it('should handle render methods in Edit District Admin ModalForm', () => {
    const ModalForm = wrapper.find('Memo()').at(1);
    const handleAdminSubmit = ModalForm.prop('handleFormSubmit');
    handleAdminSubmit({ users: [MOCK_DATA_CONSTANTS.DISTRICT_ADMIN] });
    const handleCancelClick = ModalForm.prop('handleCancel');
    handleCancelClick();
    const editModalRender = ModalForm.prop('render');
    editModalRender(jest.fn());

    expect(wrapper.find('Memo()')).toHaveLength(3);
  });

  it('should handle render methods in Deactivate District ModalForm', () => {
    const ModalForm = wrapper.find('Memo()').at(2);
    const handleAdminSubmit = ModalForm.prop('handleFormSubmit');
    handleAdminSubmit({ district: MOCK_DATA_CONSTANTS.CREATE_DISTRICT_PAYLOAD });
    const showDeactivateModal = ModalForm.prop('handleDeactivate');
    showDeactivateModal();
    const handleDeactivateSubmit = ModalForm.prop('handleFormSubmit');
    handleDeactivateSubmit({ district: MOCK_DATA_CONSTANTS.CREATE_DISTRICT_PAYLOAD });
    const editDeactivateModalRender = ModalForm.prop('render');
    editDeactivateModalRender(jest.fn());

    expect(wrapper.find('Memo()')).toHaveLength(3);
  });

  it('should handle render methods in customTable', () => {
    const CustomTable = wrapper.find('CustomTable');
    const onDeleteClick = CustomTable.prop('onDeleteClick');
    onDeleteClick({
      data: {
        id: '1',
        name: 'District Test',
        maxNoOfUsers: 100,
        tenantId: '1'
      },
      index: 0
    });
    const openEditModal = CustomTable.prop('onRowEdit');
    // Provide minimal admin data to avoid undefined errors inside openEditModal
    openEditModal({
      roles: [],
      countryCode: '',
      phoneNumber: '',
      firstName: '',
      lastName: ''
    });
    expect(wrapper.find('CustomTable')).toHaveLength(1);
  });

  it('should handle render methods in DistrictConsentForm', () => {
    const DistrictConsentForm = wrapper.find('DistrictConsentForm');
    const handleConsentFormClose = DistrictConsentForm.prop('handleConsentFormClose');
    handleConsentFormClose();
    expect(wrapper.find('CustomTable')).toHaveLength(1);
  });

  it('should handle render methods in DetailCard', () => {
    const DetailCard = wrapper.find('DetailCard').first();
    const onButtonClick = DetailCard.prop('onButtonClick');
    onButtonClick();
    expect(wrapper.find('DetailCard')).toHaveLength(2);
  });

  it('should handle render methods in DetailCard', () => {
    const DetailCard = wrapper.find('DetailCard').last();
    const handleSearch = DetailCard.prop('onSearch');
    handleSearch('Acc');
    const openAddModal = DetailCard.prop('onButtonClick');
    openAddModal({});
    expect(wrapper.find('DetailCard')).toHaveLength(2);
  });
});
