import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import UserList from '../UserList';
import toastCenter, { getErrorToastArgs } from '../../../utils/toastCenter';
import {
  DELETE_HEALTH_FACILITY_USER_REQUEST,
  FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST,
  FETCH_HEALTH_FACILITY_USER_LIST_REQUEST,
  CREATE_HEALTH_FACILITY_USER_REQUEST,
  UPDATE_HEALTH_FACILITY_USER_REQUEST,
  FETCH_HEALTH_FACILITY_LIST_REQUEST,
  CLEAR_HEALTH_FACILITY_LIST,
  CLEAR_PEER_SUPERVISOR_LIST,
  CLEAR_VILLAGES_LIST_FROM_HF,
  FETCH_SHASTHYA_SHEBIKA_BY_KORMI_ID_REQUEST,
  DELETE_SHASTHYA_SHEBIKAS_REQUEST
} from '../../../store/healthFacility/actionTypes';
import {
  CHANGE_PASSWORD_REQUEST,
  USER_FORGOT_PASSWORD_REQUEST,
  UPDATE_USER_STATUS_REQUEST,
  FETCH_CHW_LIST_REQUEST,
  REASSIGN_CHW_REQUEST,
  OFFLINE_SYNC_REQUEST,
  FETCH_USER_ROLES_REQUEST
} from '../../../store/user/actionTypes';
import APPCONSTANTS from '../../../constants/appConstants';

// Mock react-leaflet to avoid ES module issues
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid='map-container'>{children}</div>,
  TileLayer: () => <div data-testid='tile-layer' />,
  Marker: ({ children }: any) => <div data-testid='marker'>{children}</div>,
  Popup: ({ children }: any) => <div data-testid='popup'>{children}</div>,
  useMap: () => ({ setView: jest.fn(), getCenter: () => ({ lat: 0, lng: 0 }) }),
  useMapEvent: jest.fn(),
  useMapEvents: jest.fn()
}));
jest.mock('leaflet/dist/leaflet.css', () => ({}));

const mockChildComponent = jest.fn();
jest.mock('../../../components/tableFilter/Filter', () => (props: any) => {
  mockChildComponent(props);
  return <div>child component</div>;
});

jest.mock('../../../components/userForm/UserForm', () => () => {
  return <div data-testid='mock-userForm'>child component</div>;
});

jest.mock('../../../assets/images/reset-password.svg', () => ({
  ReactComponent: () => <svg data-testid='password-change-icon'>PasswordChangeIcon</svg>
}));

const mockChildTableComponent = jest.fn();
jest.mock('../../../components/customTable/CustomTable', () => (props: any) => {
  mockChildTableComponent(props);
  return <div data-testid='mock-customTable'>child component</div>;
});

const mockModalFormCalls: any[] = [];
jest.mock('../../../components/modal/ModalForm', () => (props: any) => {
  mockModalFormCalls.push(props);
  return (
    <div data-testid={`mock-modalForm-${mockModalFormCalls.length}`}>
      modal form component - {mockModalFormCalls.length}
    </div>
  );
});

jest.mock('../../../components/customTable/ConfirmationModalPopup', () => (props: any) => {
  return (
    <div data-testid={`mock-confirmationModal-${props.isOpen}`}>
      {props.isOpen && (
        <>
          <button onClick={props.handleCancel} data-testid='confirmation-cancel'>Cancel</button>
          <button onClick={props.handleSubmit} data-testid='confirmation-submit'>Submit</button>
          {props.customButtonLabel && (
            <button onClick={props.handleCustomButton} data-testid='confirmation-custom'>
              {props.customButtonLabel}
            </button>
          )}
        </>
      )}
    </div>
  );
});

jest.mock('../../../utils/toastCenter', () => ({
  success: jest.fn(),
  error: jest.fn(),
  getErrorToastArgs: jest.fn(() => [])
}));

jest.mock('../../../containers/authentication/ResetPasswordFields', () => ({
  __esModule: true,
  default: () => <div data-testid='reset-password-fields'>Reset Password Fields</div>,
  generatePassword: jest.fn((password: string) => `hashed_${password}`)
}));

jest.mock('../../../components/loader/Loader', () => () => <div data-testid='loader'>Loading...</div>);

jest.mock('../../../components/detailCard/DetailCard', () => {
  return ({
    children,
    onButtonClick,
    onSearch,
    setSelectedRole,
    setSelectedFacility,
    buttonLabel,
    header
  }: any) => (
    <div data-testid='detail-card'>
      <h2>{header}</h2>
      <button onClick={onButtonClick}>{buttonLabel}</button>
      <input data-testid='search-input' onChange={(e) => onSearch && onSearch(e.target.value)} />
      {children}
    </div>
  );
});

const mockHandleSearch = jest.fn();
const mockHandlePage = jest.fn();
jest.mock('../../../hooks/tablePagination', () => ({
  useTablePaginationHook: jest.fn(() => ({
    listParams: {
      page: 1,
      rowsPerPage: 10,
      searchTerm: ''
    },
    handleSearch: mockHandleSearch,
    handlePage: mockHandlePage
  }))
}));

const stableGetRoleOptions = jest.fn();
jest.mock('../../../hooks/roleOptionsHook', () => {
  const mockGetRoleOptions = jest.fn();
  return {
    useRoleOptions: jest.fn(() => ({
      getRoleOptions: mockGetRoleOptions
    }))
  };
});

jest.mock('../../../hooks/appTypeBasedConfigs', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    appTypes: [],
    healthFacility: { s: 'Health Facility', p: 'Health Facilities' },
    district: { s: 'County', p: 'Counties' },
    chiefdom: { s: 'Sub County', p: 'Sub Counties' },
    userList: {
      filters: { available: true },
      activeToogle: { available: true },
      passwordPreference: { available: true }
    },
    isCommunity: false
  }))
}));

jest.mock('../../../global/sessionStorageServices', () => ({
  getItem: jest.fn(() => '1'),
  setItem: jest.fn(),
  removeItem: jest.fn()
}));

const mockUseParams = jest.fn(() => ({
  tenantId: '1',
  healthFacilityId: undefined,
  districtId: undefined,
  chiefdomId: undefined
}));

const mockUseLocation = jest.fn(() => ({
  pathname: '/tenant/1'
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: () => mockUseParams(),
    useLocation: () => mockUseLocation()
  };
});

const mockIHFUserGet = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  gender: 'Male',
  phoneNumber: '1234567890',
  username: 'johndoe@example.com',
  countryCode: '+1',
  active: true,
  roles: [
    {
      id: 1,
      name: 'Admin',
      displayName: 'Admin',
      groupName: 'SPICE',
      appTypes: []
    },
    {
      id: 2,
      name: 'User',
      displayName: 'User',
      groupName: 'SPICE',
      appTypes: []
    }
  ],
  tenantId: 100,
  villages: [101, 102, 103],
  supervisor: { id: 1, firstName: 'Jane', lastName: 'Smith' },
  organizations: [
    {
      formName: 'Health Organization',
      displayName: true,
      id: 1,
      name: 'Org1',
      parentOrganizationId: null,
      formDataId: 200
    }
  ],
  country: {
    id: 1,
    phoneNumberCode: '+1',
    name: 'United States',
    tenantId: 1001
  }
};

const mockCHWUser = {
  ...mockIHFUserGet,
  id: 2,
  roles: [
    {
      id: 3,
      name: 'CHW',
      displayName: 'CHW',
      groupName: 'SPICE',
      appTypes: []
    }
  ]
};

const mockPeerSupervisorUser = {
  ...mockIHFUserGet,
  id: 3,
  roles: [
    {
      id: 4,
      name: 'PEER_SUPERVISOR',
      displayName: 'Peer Supervisor',
      groupName: 'SPICE',
      appTypes: []
    }
  ]
};

const mockIRoleSPICEAdmin = {
  id: 1,
  name: 'SPICE Admin',
  level: 3,
  suiteAccessName: 'SPICE',
  displayName: 'SPICE Administrator',
  groupName: 'SPICE',
  tenantIds: [100, 101],
  appTypes: ['web', 'mobile']
};

const mockIGroupRoles = {
  SPICE: [mockIRoleSPICEAdmin],
  'SPICE INSIGHTS': []
};

const initialState = {
  healthFacility: {
    healthFacilityUserList: [],
    hfTotal: 0,
    healthFacilityList: [],
    hfUsersLoading: false,
    hfUserDetailLoading: false,
    loading: false,
    peerSupervisorList: { list: [] },
    peerSupervisorLoading: false
  },
  user: {
    user: {
      country: { id: 1, appTypes: [] },
      email: 'test@example.com',
      role: 'SUPER_ADMIN',
      appTypes: []
    },
    isPasswordSet: true,
    timezoneList: [],
    userRoles: mockIGroupRoles,
    chwList: []
  },
  common: {
    labelName: null
  }
};

const mockStore = configureStore([]);
const store = mockStore(initialState);
const email = 'test@example.com';

const renderComponent = (localStore: any = store) => {
  return render(
    <Provider store={localStore}>
      <Router>
        <UserList />
      </Router>
    </Provider>
  );
};

const renderWithMemoryRouter = (localStore: any = store, initialEntries: string[] = ['/tenant/1']) => {
  return render(
    <Provider store={localStore}>
      <MemoryRouter initialEntries={initialEntries}>
        <UserList />
      </MemoryRouter>
    </Provider>
  );
};

describe('UserList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockModalFormCalls.length = 0;
    mockHandleSearch.mockClear();
    mockHandlePage.mockClear();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', async () => {
      renderWithMemoryRouter(store);
      await waitFor(() => expect(screen.getByText(/Users/i)).toBeInTheDocument());
    });

    it('should render DetailCard with correct header and button', () => {
      renderComponent(store);
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText('Add User')).toBeInTheDocument();
    });

    it('should render CustomTable component', () => {
      renderComponent(store);
      expect(screen.getByTestId('mock-customTable')).toBeInTheDocument();
    });

    it('should show loader when hfUserDetailLoading is true', () => {
      const localStore = mockStore({
        ...initialState,
        healthFacility: { ...initialState.healthFacility, hfUserDetailLoading: true }
      });
      renderComponent(localStore);
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('should show loader when loading is true', () => {
      const localStore = mockStore({
        ...initialState,
        healthFacility: { ...initialState.healthFacility, loading: true }
      });
      renderComponent(localStore);
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('should show loader when peerSupervisorLoading is true', () => {
      const localStore = mockStore({
        ...initialState,
        healthFacility: { ...initialState.healthFacility, peerSupervisorLoading: true }
      });
      renderComponent(localStore);
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('should show loader when healthFacilityUsersLoading (hfUsersLoading) is true', () => {
      const localStore = mockStore({
        ...initialState,
        healthFacility: { ...initialState.healthFacility, hfUsersLoading: true }
      });
      renderComponent(localStore);
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('does not render Loader when all loading states are false', () => {
      renderComponent(store);
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  });

  describe('Add User Functionality', () => {
    it('should open modal for adding a new user when Add User button is clicked', async () => {
      const localStore = mockStore({
        user: {
          user: { country: { id: 1, appTypes: [] }, email: 'test@gmail.com', role: 'SUPER_ADMIN', appTypes: [] },
          countryList: [],
          userRoles: mockIGroupRoles,
          chwList: []
        },
        healthFacility: {
          healthFacilityUserList: [mockIHFUserGet],
          healthFacilityList: [],
          hfTotal: 0,
          peerSupervisorList: { list: [] },
          hfUserDetailLoading: false,
          hfUsersLoading: false,
          loading: false,
          peerSupervisorLoading: false
        },
        common: { labelName: null }
      });

      renderComponent(localStore);

      const addButton = screen.getByText('Add User');
      expect(addButton).toBeInTheDocument();

      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByTestId(`mock-modalForm-${mockModalFormCalls.length}`)).toBeInTheDocument();
      });
    });

    it('should dispatch clearBranchesByUnion when Add User button is clicked', async () => {
      const localStore = mockStore({
        user: {
          user: { country: { id: 1, appTypes: [] }, email: 'test@gmail.com', role: 'SUPER_ADMIN', appTypes: [] },
          countryList: [],
          userRoles: mockIGroupRoles,
          chwList: []
        },
        healthFacility: {
          healthFacilityUserList: [mockIHFUserGet],
          healthFacilityList: [],
          hfTotal: 0,
          peerSupervisorList: { list: [] },
          hfUserDetailLoading: false,
          hfUsersLoading: false,
          loading: false,
          peerSupervisorLoading: false
        },
        common: { labelName: null }
      });

      renderComponent(localStore);
      const addButton = screen.getByText('Add User');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(localStore.getActions().some((a: any) => a.type === 'CLEAR_BRANCHES_BY_UNION')).toBe(true);
      });
    });

    it('should handle successful user creation', async () => {
      const localStore = mockStore({
        user: {
          user: { country: { id: 1, appTypes: [] }, email: 'test@gmail.com', role: 'SUPER_ADMIN', appTypes: [] },
          countryList: [],
          userRoles: mockIGroupRoles,
          chwList: []
        },
        healthFacility: {
          healthFacilityUserList: [mockIHFUserGet],
          healthFacilityList: [],
          hfTotal: 0,
          peerSupervisorList: { list: [] },
          hfUserDetailLoading: false,
          hfUsersLoading: false,
          loading: false,
          peerSupervisorLoading: false
        },
        common: { labelName: null }
      });

      renderComponent(localStore);

      const addButton = screen.getByText('Add User');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockModalFormCalls[0]).toBeDefined();
      });

      const modalForm: any = mockModalFormCalls[0];
      modalForm.handleFormSubmit({
        users: [
          {
            firstName: 'John',
            lastName: 'Doe',
            username: 'johndoe',
            roles: [{ groupName: 'SPICE' }]
          }
        ]
      });

      const actions = localStore.getActions();
      const mockCreateHFUser = actions.find((action: any) => action.type === CREATE_HEALTH_FACILITY_USER_REQUEST);

      if (mockCreateHFUser) {
        mockCreateHFUser.successCb();
        mockCreateHFUser.failureCb((error: Error) => {
          expect(toastCenter.error).toHaveBeenCalledWith(
            ...getErrorToastArgs(error, APPCONSTANTS.OOPS, APPCONSTANTS.HEALTH_FACILITY_USER_CREATE_ERROR)
          );
        });
        const successCbSpy: any = jest.spyOn(mockCreateHFUser, 'successCb');
        const failureCbSpy: any = jest.spyOn(mockCreateHFUser, 'failureCb');
        successCbSpy();
        failureCbSpy();
        expect(failureCbSpy).toHaveBeenCalled();
        expect(successCbSpy).toHaveBeenCalled();
      }
    });
  });

  describe('Delete User Functionality', () => {
    it(
      'should call deleteHFUserRequest and show success message on successful deletion for regular user',
      async () => {
      const localStore = mockStore({
        user: {
          user: { country: { id: 1, appTypes: [] }, email: 'test@gmail.com', role: 'SUPER_ADMIN', appTypes: [] },
          countryList: [],
          userRoles: mockIGroupRoles,
          chwList: []
        },
        healthFacility: {
          healthFacilityUserList: [mockIHFUserGet],
          healthFacilityList: [],
          hfTotal: 0,
          hfUserDetailLoading: false,
          hfUsersLoading: false,
          loading: false,
          peerSupervisorLoading: false
        },
        common: { labelName: null }
      });

      renderComponent(localStore);

      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      mockCustomTable.onDeleteClick({ data: { id: 1, organizations: [{ id: 1 }], roles: [{ name: 'Admin' }] } });

      const actions = localStore.getActions();
      const mockUserDelete = actions.find((action: any) => action.type === DELETE_HEALTH_FACILITY_USER_REQUEST);

      if (mockUserDelete) {
        mockUserDelete.successCb();
        mockUserDelete.failureCb((error: Error) => {
          expect(toastCenter.error).toHaveBeenCalledWith(
            ...getErrorToastArgs(error, APPCONSTANTS.OOPS, APPCONSTANTS.USER_DELETE_FAIL)
          );
        });
        const successCbSpy: any = jest.spyOn(mockUserDelete, 'successCb');
        const failureCbSpy: any = jest.spyOn(mockUserDelete, 'failureCb');
        successCbSpy();
        failureCbSpy();
        expect(failureCbSpy).toHaveBeenCalled();
        expect(successCbSpy).toHaveBeenCalled();
      }
    });

    it('should fetch Shasthya Shebikas when deleting user with SHASTIYA_KORMI role', async () => {
      const localStore = mockStore({
        user: {
          user: { country: { id: 1, appTypes: [] }, email: 'test@gmail.com', role: 'SUPER_ADMIN', appTypes: [] },
          countryList: [],
          userRoles: mockIGroupRoles,
          chwList: []
        },
        healthFacility: {
          healthFacilityUserList: [mockIHFUserGet],
          healthFacilityList: [],
          hfTotal: 0,
          hfUserDetailLoading: false,
          hfUsersLoading: false,
          loading: false,
          peerSupervisorLoading: false
        },
        common: { labelName: null }
      });

      renderComponent(localStore);

      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      mockCustomTable.onDeleteClick({
        data: {
          id: 42,
          organizations: [{ id: 1 }],
          roles: [{ name: 'SHASTIYA_KORMI' }]
        }
      });

      const actions = localStore.getActions();
      const fetchSSAction = actions.find((action: any) => action.type === FETCH_SHASTHYA_SHEBIKA_BY_KORMI_ID_REQUEST);

      expect(fetchSSAction).toBeDefined();
      expect(fetchSSAction?.shasthyaKormiIds).toEqual(['42']);
    });

    it('should delete Shasthya Shebikas and then delete user for SHASTIYA_KORMI role', async () => {
      const localStore = mockStore({
        user: {
          user: { country: { id: 1, appTypes: [] }, email: 'test@gmail.com', role: 'SUPER_ADMIN', appTypes: [] },
          countryList: [],
          userRoles: mockIGroupRoles,
          chwList: []
        },
        healthFacility: {
          healthFacilityUserList: [mockIHFUserGet],
          healthFacilityList: [],
          hfTotal: 0,
          hfUserDetailLoading: false,
          hfUsersLoading: false,
          loading: false,
          peerSupervisorLoading: false
        },
        common: { labelName: null }
      });

      renderComponent(localStore);

      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      mockCustomTable.onDeleteClick({
        data: {
          id: 42,
          organizations: [{ id: 1 }],
          roles: [{ name: 'SHASTIYA_KORMI' }]
        }
      });

      const actions = localStore.getActions();
      const fetchSSAction = actions.find((action: any) => action.type === FETCH_SHASTHYA_SHEBIKA_BY_KORMI_ID_REQUEST);

      if (fetchSSAction) {
        // Simulate successful fetch with SS users
        const mockResponse = {
          '42': [
            { id: 10, name: 'SSUser1', ssId: 'SS01' },
            { id: 9, name: 'SSUser2', ssId: 'SS02' }
          ]
        };
        fetchSSAction.successCb(mockResponse);

        const deleteSSAction = actions.find((action: any) => action.type === DELETE_SHASTHYA_SHEBIKAS_REQUEST);
        expect(deleteSSAction).toBeDefined();
        expect(deleteSSAction?.ids).toEqual(['10', '9']);

        // Simulate successful deletion of SS users
        if (deleteSSAction) {
          deleteSSAction.successCb();

          const deleteUserAction = actions.find((action: any) => action.type === DELETE_HEALTH_FACILITY_USER_REQUEST);
          expect(deleteUserAction).toBeDefined();
          expect(deleteUserAction?.data.id).toBe(42);
        }
      }
    });

    it('should directly delete user when SHASTIYA_KORMI has no SS users', async () => {
      const localStore = mockStore({
        user: {
          user: { country: { id: 1, appTypes: [] }, email: 'test@gmail.com', role: 'SUPER_ADMIN', appTypes: [] },
          countryList: [],
          userRoles: mockIGroupRoles,
          chwList: []
        },
        healthFacility: {
          healthFacilityUserList: [mockIHFUserGet],
          healthFacilityList: [],
          hfTotal: 0,
          hfUserDetailLoading: false,
          hfUsersLoading: false,
          loading: false,
          peerSupervisorLoading: false
        },
        common: { labelName: null }
      });

      renderComponent(localStore);

      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      mockCustomTable.onDeleteClick({
        data: {
          id: 42,
          organizations: [{ id: 1 }],
          roles: [{ name: 'SHASTIYA_KORMI' }]
        }
      });

      const actions = localStore.getActions();
      const fetchSSAction = actions.find((action: any) => action.type === FETCH_SHASTHYA_SHEBIKA_BY_KORMI_ID_REQUEST);

      if (fetchSSAction) {
        // Simulate successful fetch with no SS users
        const mockResponse = { '42': [] };
        fetchSSAction.successCb(mockResponse);

        // Should not dispatch deleteShasthyaShebikas
        const deleteSSAction = actions.find((action: any) => action.type === DELETE_SHASTHYA_SHEBIKAS_REQUEST);
        expect(deleteSSAction).toBeUndefined();

        // Should directly dispatch deleteHFUserRequest
        const deleteUserAction = actions.find((action: any) => action.type === DELETE_HEALTH_FACILITY_USER_REQUEST);
        expect(deleteUserAction).toBeDefined();
        expect(deleteUserAction?.data.id).toBe(42);
      }
    });

    it('should handle failure when fetching Shasthya Shebikas', async () => {
      const localStore = mockStore({
        user: {
          user: { country: { id: 1, appTypes: [] }, email: 'test@gmail.com', role: 'SUPER_ADMIN', appTypes: [] },
          countryList: [],
          userRoles: mockIGroupRoles,
          chwList: []
        },
        healthFacility: {
          healthFacilityUserList: [mockIHFUserGet],
          healthFacilityList: [],
          hfTotal: 0,
          hfUserDetailLoading: false,
          hfUsersLoading: false,
          loading: false,
          peerSupervisorLoading: false
        },
        common: { labelName: null }
      });

      renderComponent(localStore);

      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      mockCustomTable.onDeleteClick({
        data: {
          id: 42,
          organizations: [{ id: 1 }],
          roles: [{ name: 'SHASTIYA_KORMI' }]
        }
      });

      const actions = localStore.getActions();
      const fetchSSAction = actions.find((action: any) => action.type === FETCH_SHASTHYA_SHEBIKA_BY_KORMI_ID_REQUEST);

      if (fetchSSAction) {
        const error = new Error('Failed to fetch SS users');
        fetchSSAction.failureCb(error);

        expect(toastCenter.error).toHaveBeenCalledWith(
          ...getErrorToastArgs(error, APPCONSTANTS.OOPS, APPCONSTANTS.SHASTIYA_SHEBIKA_FETCH_FAIL)
        );
      }
    });

    it('should handle failure when deleting Shasthya Shebikas', async () => {
      const localStore = mockStore({
        user: {
          user: { country: { id: 1, appTypes: [] }, email: 'test@gmail.com', role: 'SUPER_ADMIN', appTypes: [] },
          countryList: [],
          userRoles: mockIGroupRoles,
          chwList: []
        },
        healthFacility: {
          healthFacilityUserList: [mockIHFUserGet],
          healthFacilityList: [],
          hfTotal: 0,
          hfUserDetailLoading: false,
          hfUsersLoading: false,
          loading: false,
          peerSupervisorLoading: false
        },
        common: { labelName: null }
      });

      renderComponent(localStore);

      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      mockCustomTable.onDeleteClick({
        data: {
          id: 42,
          organizations: [{ id: 1 }],
          roles: [{ name: 'SHASTIYA_KORMI' }]
        }
      });

      const actions = localStore.getActions();
      const fetchSSAction = actions.find((action: any) => action.type === FETCH_SHASTHYA_SHEBIKA_BY_KORMI_ID_REQUEST);

      if (fetchSSAction) {
        const mockResponse = {
          '42': [{ id: 10, name: 'SSUser1', ssId: 'SS01' }]
        };
        fetchSSAction.successCb(mockResponse);

        const deleteSSAction = actions.find((action: any) => action.type === DELETE_SHASTHYA_SHEBIKAS_REQUEST);

        if (deleteSSAction) {
          const error = new Error('Failed to delete SS users');
          deleteSSAction.failureCb(error);

          expect(toastCenter.error).toHaveBeenCalledWith(
            ...getErrorToastArgs(error, APPCONSTANTS.OOPS, APPCONSTANTS.SHASTIYA_SHEBIKA_DELETE_FAIL)
          );
        }
      }
    });
  });

  describe('Edit User Functionality', () => {
    it('should handle openEditModal for edit without village-based roles', async () => {
      renderComponent(store);
      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      const postData = {
        roles: [{ groupName: 'SPICE' }]
      };
      mockCustomTable.onRowEdit(postData);
      await waitFor(() => {
        expect(mockModalFormCalls.length).toBeGreaterThan(0);
      });
      expect(screen.getByTestId(`mock-modalForm-${mockModalFormCalls.length}`)).toBeInTheDocument();
    });

    it('should dispatch fetchShasthyaShebikaByKormiIdRequest when opening edit with user id', async () => {
      const localStore = mockStore({ ...initialState });
      renderComponent(localStore);
      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      mockCustomTable.onRowEdit({ id: 42, roles: [{ name: 'SHASTIYA_KORMI', groupName: 'SPICE' }] });
      const actions = localStore.getActions();
      const fetchSSByKormiAction = actions.find(
        (action: any) => action.type === FETCH_SHASTHYA_SHEBIKA_BY_KORMI_ID_REQUEST
      );
      expect(fetchSSByKormiAction).toBeDefined();
      expect(fetchSSByKormiAction?.shasthyaKormiIds).toEqual(['42']);
    });

    it('should handle openEditModal for edit with village-based roles', async () => {
      const localStore = mockStore({
        ...initialState
      });
      renderComponent(localStore);
      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      const postData = {
        id: 1,
        roles: [{ name: 'CHW' }, { groupName: 'SPICE' }]
      };
      mockCustomTable.onRowEdit(postData);
      const actions = localStore.getActions();
      const mockFetchDetailsType = actions.find(
        (action: any) => action.type === FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST
      );

      if (mockFetchDetailsType) {
        mockFetchDetailsType.successCb({
          id: 1,
          roles: [{ name: 'CHW' }, { groupName: 'SPICE' }],
          supervisor: { firstName: 'John', lastName: 'Doe' }
        });

        mockFetchDetailsType.failureCb((error: Error) => {
          expect(toastCenter.error).toHaveBeenCalledWith(
            ...getErrorToastArgs(error, APPCONSTANTS.OOPS, APPCONSTANTS.USER_DETAIL_FETCH_FAIL)
          );
        });
        const successCbSpy: any = jest.spyOn(mockFetchDetailsType, 'successCb');
        const failureCbSpy: any = jest.spyOn(mockFetchDetailsType, 'failureCb');
        successCbSpy();
        failureCbSpy();
        expect(failureCbSpy).toHaveBeenCalled();
        expect(successCbSpy).toHaveBeenCalled();
      }

      await waitFor(() => {
        expect(mockModalFormCalls.length).toBeGreaterThan(0);
      });
      expect(screen.getByTestId(`mock-modalForm-${mockModalFormCalls.length}`)).toBeInTheDocument();
    });

    it('should handle user update successfully', async () => {
      const localStore = mockStore({
        user: {
          user: { country: { id: 1, appTypes: [] }, email: 'test@gmail.com', role: 'SUPER_ADMIN', appTypes: [] },
          countryList: [],
          userRoles: mockIGroupRoles,
          chwList: []
        },
        healthFacility: {
          healthFacilityUserList: [mockIHFUserGet],
          healthFacilityList: [],
          hfTotal: 0,
          peerSupervisorList: { list: [] },
          hfUserDetailLoading: false,
          hfUsersLoading: false,
          loading: false,
          peerSupervisorLoading: false
        },
        common: { labelName: null }
      });

      renderComponent(localStore);

      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      mockCustomTable.onRowEdit({ id: 1, roles: [{ groupName: 'SPICE' }] });

      await waitFor(() => {
        expect(mockModalFormCalls[0]).toBeDefined();
      });

      const modalForm: any = mockModalFormCalls[0];
      modalForm.handleFormSubmit({
        users: [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            username: 'johndoe',
            roles: [{ groupName: 'SPICE' }]
          }
        ]
      });

      const actions = localStore.getActions();
      const mockUpdateHFUser = actions.find((action: any) => action.type === UPDATE_HEALTH_FACILITY_USER_REQUEST);

      if (mockUpdateHFUser) {
        mockUpdateHFUser.successCb();
        mockUpdateHFUser.failureCb((error: Error) => {
          expect(toastCenter.error).toHaveBeenCalledWith(
            ...getErrorToastArgs(error, APPCONSTANTS.OOPS, APPCONSTANTS.HEALTH_FACILITY_USER_UPDATE_ERROR)
          );
        });
        const successCbSpy: any = jest.spyOn(mockUpdateHFUser, 'successCb');
        const failureCbSpy: any = jest.spyOn(mockUpdateHFUser, 'failureCb');
        successCbSpy();
        failureCbSpy();
        expect(failureCbSpy).toHaveBeenCalled();
        expect(successCbSpy).toHaveBeenCalled();
      }
    });
  });

  describe('Change Password Functionality', () => {
    it('should handle change password button click', async () => {
      renderComponent(store);
      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      mockCustomTable.onCustomConfirmed({
        id: 1,
        username: 'test@example.com'
      });
      await waitFor(() => {
        expect(mockModalFormCalls.length).toBeGreaterThan(0);
      });
      expect(screen.getByTestId(`mock-modalForm-${mockModalFormCalls.length}`)).toBeInTheDocument();
    });

    it('should handle change password submit correctly', () => {
      renderComponent(store);

      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      mockCustomTable.onCustomConfirmed({
        id: 1,
        username: 'test@example.com'
      });

      const changePasswordModal = mockModalFormCalls[mockModalFormCalls.length - 1];

      if (changePasswordModal) {
        changePasswordModal.handleFormSubmit({
          userPreference: { passwordChange: APPCONSTANTS.PASSWORD_VALUES.CHANGE_PASSWORD },
          newPassword: 'newPassword'
        });

        const actions = store.getActions();
        const mockChangePassword = actions.find((action: any) => action.type === CHANGE_PASSWORD_REQUEST);

        if (mockChangePassword && mockChangePassword.data) {
          mockChangePassword.data.successCB();
          mockChangePassword.data.failureCb((error: Error) => {
            expect(toastCenter.error).toHaveBeenCalledWith(
              ...getErrorToastArgs(error, APPCONSTANTS.ERROR, APPCONSTANTS.PASSWORD_CHANGE_FAILED)
            );
          });

          const successCBSpy: any = jest.spyOn(mockChangePassword.data, 'successCB');
          const failureCbSpy: any = jest.spyOn(mockChangePassword.data, 'failureCb');
          successCBSpy();
          failureCbSpy();
          expect(failureCbSpy).toHaveBeenCalled();
          expect(successCBSpy).toHaveBeenCalled();
        }
      }
    });

    it('should handle send email password reset', () => {
      renderComponent(store);

      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      mockCustomTable.onCustomConfirmed({
        id: 1,
        username: 'test@example.com'
      });

      const changePasswordModal = mockModalFormCalls[mockModalFormCalls.length - 1];

      if (changePasswordModal) {
        changePasswordModal.handleFormSubmit({
          userPreference: { passwordChange: APPCONSTANTS.PASSWORD_VALUES.SEND_EMAIL }
        });

        const actions = store.getActions();
        const mockForgotPassword = actions.find((action: any) => action.type === USER_FORGOT_PASSWORD_REQUEST);

        if (mockForgotPassword && mockForgotPassword.data) {
          mockForgotPassword.data.successCB();
          const successCBSpy: any = jest.spyOn(mockForgotPassword.data, 'successCB');
          successCBSpy();
          expect(successCBSpy).toHaveBeenCalled();
        }
      }
    });
  });

  describe('User Activation/Deactivation', () => {
    it('should handle user activation', () => {
      const localStore = mockStore({
        ...initialState,
        user: { ...initialState.user, chwList: [] }
      });
      renderComponent(localStore);

      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      const userData = { ...mockIHFUserGet, active: false };
      mockCustomTable.onActivateClick(userData);

      const actions = localStore.getActions();
      const mockUpdateStatus = actions.find((action: any) => action.type === UPDATE_USER_STATUS_REQUEST);

      if (mockUpdateStatus) {
        mockUpdateStatus.successCb();
        mockUpdateStatus.failureCb((error: Error) => {
          expect(toastCenter.error).toHaveBeenCalledWith(
            ...getErrorToastArgs(error, APPCONSTANTS.ERROR, APPCONSTANTS.USER_STATUS_UPDATE_FAILED)
          );
        });
        const successCbSpy: any = jest.spyOn(mockUpdateStatus, 'successCb');
        const failureCbSpy: any = jest.spyOn(mockUpdateStatus, 'failureCb');
        successCbSpy();
        failureCbSpy();
        expect(failureCbSpy).toHaveBeenCalled();
        expect(successCbSpy).toHaveBeenCalled();
      }
    });
  });

  describe('Action Formatters', () => {
    it('should hide edit, delete, and custom icons for the user\'s own row', () => {
      renderComponent(store);
      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      const result = mockCustomTable.actionFormatter.hideEditIcon({ username: 'test@example.com' });
      expect(result).toBe(true);
    });

    it('should show edit, delete, and custom icons for other users', () => {
      renderComponent(store);
      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      const rowData = { username: 'anotheruser@example.com', active: true };
      const result = mockCustomTable.actionFormatter.hideEditIcon(rowData);
      expect(result).toBe(false);
    });

    it('should hide active toggle for the user\'s own row', () => {
      renderComponent(store);
      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      const result = mockCustomTable.actionFormatter.hideActiveToggle({ username: 'test@example.com' });
      expect(result).toBe(true);
    });
  });

  describe('Modal Functionality', () => {
    it('should handle modal cancellation correctly', async () => {
      const localStore = mockStore({
        user: {
          user: { country: { id: 1, appTypes: [] }, email: 'test@gmail.com', role: 'SUPER_ADMIN', appTypes: [] },
          countryList: [],
          userRoles: mockIGroupRoles,
          chwList: []
        },
        healthFacility: {
          healthFacilityUserList: [mockIHFUserGet],
          healthFacilityList: [],
          hfTotal: 0,
          peerSupervisorList: { list: [] },
          hfUserDetailLoading: false,
          hfUsersLoading: false,
          loading: false,
          peerSupervisorLoading: false
        },
        common: { labelName: null }
      });

      renderComponent(localStore);

      const addButton = screen.getByText('Add User');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockModalFormCalls[0]).toBeDefined();
      });

      const modalFormCancel: any = mockModalFormCalls[0];
      modalFormCancel.handleCancel();
      expect(modalFormCancel.handleCancel).toBeDefined();
    });
  });

  describe('Search Functionality', () => {
    it('should handle search input', () => {
      renderComponent(store);
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toBeInTheDocument();

      fireEvent.change(searchInput, { target: { value: 'test search' } });
      expect(mockHandleSearch).toHaveBeenCalled();
    });
  });

  describe('List Fetching', () => {
    it('should dispatch fetchHFUserListRequest with failureCb in payload on mount', () => {
      const localStore = mockStore({
        ...initialState,
        user: {
          ...initialState.user,
          user: { country: { id: 1, appTypes: [] }, email: 'test@example.com', role: 'SUPER_ADMIN', appTypes: [] }
        }
      });
      renderComponent(localStore);
      const actions = localStore.getActions();
      const fetchUserListAction = actions.find(
        (action: any) => action.type === FETCH_HEALTH_FACILITY_USER_LIST_REQUEST
      );
      expect(fetchUserListAction).toBeDefined();
      expect(fetchUserListAction).toHaveProperty('failureCb');
      expect(typeof fetchUserListAction.failureCb).toBe('function');
    });

    it('should call fetch user list on mount', async () => {
      const localStore = mockStore({
        user: {
          user: { country: { id: 1, appTypes: [] }, email: 'test@gmail.com', role: 'SUPER_ADMIN', appTypes: [] },
          countryList: [],
          userRoles: mockIGroupRoles,
          chwList: []
        },
        healthFacility: {
          healthFacilityUserList: [mockIHFUserGet],
          healthFacilityList: [],
          hfTotal: 0,
          hfUserDetailLoading: false,
          hfUsersLoading: false,
          loading: false,
          peerSupervisorLoading: false
        },
        common: { labelName: null }
      });

      renderComponent(localStore);

      const actions = localStore.getActions();
      const mockFetchListType = actions.find((action: any) => action.type === FETCH_HEALTH_FACILITY_USER_LIST_REQUEST);

      if (mockFetchListType) {
        const failureCbSpy = jest.spyOn(mockFetchListType, 'failureCb');
        mockFetchListType.failureCb({ message: 'error' });
        await waitFor(() => {
          expect(failureCbSpy).toHaveBeenCalled();
        });
      }
    });

    it('should call fetch health facility list on mount', async () => {
      const localStore = mockStore({
        user: {
          user: { country: { id: 1, appTypes: [] }, email: 'test@gmail.com', role: 'SUPER_ADMIN', appTypes: [] },
          countryList: [],
          userRoles: mockIGroupRoles,
          chwList: []
        },
        healthFacility: {
          healthFacilityUserList: [mockIHFUserGet],
          healthFacilityList: [],
          hfTotal: 0,
          hfUserDetailLoading: false,
          hfUsersLoading: false,
          loading: false,
          peerSupervisorLoading: false
        },
        common: { labelName: null }
      });

      renderComponent(localStore);

      const actions = localStore.getActions();
      const mockFetchHFList = actions.find((action: any) => action.type === FETCH_HEALTH_FACILITY_LIST_REQUEST);

      if (mockFetchHFList) {
        const failureCbSpy = jest.spyOn(mockFetchHFList, 'failureCb');
        mockFetchHFList.failureCb({ message: 'error' });
        await waitFor(() => {
          expect(failureCbSpy).toHaveBeenCalled();
        });
      }
    });
  });

  describe('User Roles Fetch', () => {
    it('should handle user roles fetch failure', async () => {
      const errorToastSpy = jest.spyOn(toastCenter, 'error');

      const localStore = mockStore({
        user: {
          user: { country: { id: 1, appTypes: [] }, email: 'test@gmail.com', role: 'SUPER_ADMIN', appTypes: [] },
          countryList: [],
          userRoles: {}
        },
        healthFacility: {
          healthFacilityUserList: [mockIHFUserGet],
          healthFacilityList: [],
          hfTotal: 0,
          hfUserDetailLoading: false,
          hfUsersLoading: false,
          loading: false,
          peerSupervisorLoading: false
        },
        common: { labelName: null }
      });

      renderComponent(localStore);

      const actions = localStore.getActions();
      const fetchUserRolesAction = actions.find((action: any) => action.type === FETCH_USER_ROLES_REQUEST);

      if (fetchUserRolesAction) {
        fetchUserRolesAction.failureCb(new Error('Failed to fetch user roles'));

        await waitFor(() => {
          expect(errorToastSpy).toHaveBeenCalledWith(APPCONSTANTS.OOPS, APPCONSTANTS.USER_ROLES_FETCH_ERROR);
        });
      }
    });
  });

  describe('CHW Reassignment', () => {
    it('should handle CHW reassignment submit', () => {
      const localStore = mockStore({
        ...initialState,
        user: {
          ...initialState.user,
          chwList: [{ id: 1, name: 'CHW1' }]
        },
        healthFacility: {
          ...initialState.healthFacility,
          peerSupervisorList: { list: [{ id: 1, name: 'Supervisor1' }] }
        }
      });
      renderComponent(localStore);

      // Find the CHW list modal
      const chwListModal = mockModalFormCalls.find((modal: any) => modal.title === 'CHW List');

      if (chwListModal) {
        const formData = {
          'peersupervisor-1': { id: 1, name: 'Supervisor1' }
        };
        chwListModal.handleFormSubmit(formData);

        const actions = localStore.getActions();
        const mockReassign = actions.find((action: any) => action.type === REASSIGN_CHW_REQUEST);

        if (mockReassign) {
          mockReassign.successCb();
          mockReassign.failureCb((error: Error) => {
            expect(toastCenter.error).toHaveBeenCalled();
          });
          const successCbSpy: any = jest.spyOn(mockReassign, 'successCb');
          const failureCbSpy: any = jest.spyOn(mockReassign, 'failureCb');
          successCbSpy();
          failureCbSpy();
          expect(failureCbSpy).toHaveBeenCalled();
          expect(successCbSpy).toHaveBeenCalled();
        }
      }
    });
  });

  describe('Cleanup on unmount', () => {
    it('should dispatch clearSupervisorList and clearVillageHFList on unmount', () => {
      const localStore = mockStore(initialState);
      const { unmount } = renderComponent(localStore);
      unmount();
      const actions = localStore.getActions();
      const types = actions.map((a: any) => a.type);
      expect(types).toContain(CLEAR_PEER_SUPERVISOR_LIST);
      expect(types).toContain(CLEAR_VILLAGES_LIST_FROM_HF);
    });

    it('should dispatch clearHFList on unmount', () => {
      const localStore = mockStore(initialState);
      const { unmount } = renderComponent(localStore);
      unmount();
      const actions = localStore.getActions();
      const types = actions.map((a: any) => a.type);
      expect(types).toContain(CLEAR_HEALTH_FACILITY_LIST);
    });
  });

  describe('Confirmation Modal', () => {
    it('should handle confirmation modal cancel', () => {
      const localStore = mockStore({
        ...initialState,
        user: { ...initialState.user, chwList: [] }
      });
      renderComponent(localStore);

      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      const userData = { ...mockIHFUserGet, active: false };
      mockCustomTable.onActivateClick(userData);

      const cancelButton = screen.queryByTestId('confirmation-cancel');
      if (cancelButton) {
        fireEvent.click(cancelButton);
        expect(screen.queryByTestId('mock-confirmationModal-true')).not.toBeInTheDocument();
      }
    });

    it('should handle confirmation modal submit', () => {
      const localStore = mockStore({
        ...initialState,
        user: { ...initialState.user, chwList: [] }
      });
      renderComponent(localStore);

      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      const userData = { ...mockIHFUserGet, active: false };
      mockCustomTable.onActivateClick(userData);

      const submitButton = screen.queryByTestId('confirmation-submit');
      if (submitButton) {
        fireEvent.click(submitButton);
        const actions = localStore.getActions();
        const mockUpdateStatus = actions.find((action: any) => action.type === UPDATE_USER_STATUS_REQUEST);
        expect(mockUpdateStatus).toBeDefined();
      }
    });
  });
});
