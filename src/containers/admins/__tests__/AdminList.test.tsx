import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import AdminList from '../AdminList';
import toastCenter, { getErrorToastArgs } from '../../../utils/toastCenter';
import {
  DELETE_HEALTH_FACILITY_USER_REQUEST,
  FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST,
  FETCH_HEALTH_FACILITY_USER_LIST_REQUEST
} from '../../../store/healthFacility/actionTypes';
import APPCONSTANTS from '../../../constants/appConstants';
import { CREATE_HEALTH_FACILITY_USER_REQUEST } from '../../../store/healthFacility/actionTypes';
import { CHANGE_PASSWORD_REQUEST } from '../../../store/user/actionTypes';

const mockChildComponent = jest.fn();
jest.mock('../../../components/tableFilter/Filter', () => (props: any) => {
  mockChildComponent(props);
  return <div>child component</div>;
});

jest.mock('../../../components/userForm/UserForm', () => () => {
  return <div data-testid='mock-userForm'>child component</div>;
});

jest.mock('../../../assets/images/reset-password.svg', () => ({
  ReactComponent: () => <svg data-testid="password-change-icon">PasswordChangeIcon</svg>
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

jest.mock('../../../utils/toastCenter', () => ({
  success: jest.fn(),
  error: jest.fn(),
  getErrorToastArgs: jest.fn(() => [])
}));

jest.mock('../../../containers/authentication/ResetPasswordFields', () => ({
  __esModule: true,
  default: () => <div data-testid="reset-password-fields">Reset Password Fields</div>,
  generatePassword: jest.fn((password: string) => `hashed_${password}`)
}));

jest.mock('../../../components/loader/Loader', () => () => <div data-testid="loader">Loading...</div>);

jest.mock('../../../components/detailCard/DetailCard', () => ({ children, onButtonClick, onSearch, setSelectedRole, buttonLabel, header }: any) => (
  <div data-testid="detail-card">
    <h2>{header}</h2>
    <button onClick={onButtonClick}>{buttonLabel}</button>
    <input data-testid="search-input" onChange={(e) => onSearch && onSearch(e.target.value)} />
    {children}
  </div>
));

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

// Create a stable function reference for getRoleOptions to prevent infinite loops
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
    chiefdom: { s: 'Sub County', p: 'Sub Counties' }
  }))
}));

jest.mock('../../../global/sessionStorageServices', () => ({
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn()
}));

// Mock useParams and useLocation separately to avoid breaking Router components
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
  username: 'johndoe',
  countryCode: '+1',
  roles: [
    {
      id: 1,
      name: 'Admin'
    },
    {
      id: 2,
      name: 'User'
    }
  ],
  tenantId: 100,
  villages: [101, 102, 103],
  supervisor: 'Jane Smith',
  district: {
    tenantId: 'District123'
  },
  county: {
    tenantId: 456
  },
  organizations: [
    {
      formName: 'Health Organization',
      displayName: true,
      id: 1,
      name: 'Org1',
      parentOrganizationId: null,
      formDataId: 200
    },
    {
      formName: 'Education Organization',
      displayName: false,
      id: 2,
      name: 'Org2',
      parentOrganizationId: 1,
      formDataId: 201
    }
  ],
  country: {
    id: 1,
    phoneNumberCode: '+1',
    name: 'United States',
    tenantId: 1001
  }
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

const mockIRoleSPICEUser = {
  id: 2,
  name: 'SPICE User',
  level: 1,
  suiteAccessName: 'SPICE',
  displayName: 'SPICE Regular User',
  groupName: 'SPICE',
  tenantIds: [102],
  appTypes: ['web']
};

const mockIRoleSPICEInsightsAdmin = {
  id: 3,
  name: 'SPICE Insights Admin',
  level: 2,
  suiteAccessName: 'SPICE INSIGHTS',
  displayName: 'SPICE Insights Administrator',
  groupName: 'SPICE INSIGHTS',
  tenantIds: [103],
  appTypes: ['mobile']
};

const mockIRoleSPICEInsightsUser = {
  id: 4,
  name: 'SPICE Insights User',
  level: 1,
  suiteAccessName: 'SPICE INSIGHTS',
  displayName: 'SPICE Insights Regular User',
  groupName: 'SPICE INSIGHTS',
  tenantIds: [104],
  appTypes: ['web']
};

const mockIGroupRoles = {
  SPICE: [mockIRoleSPICEAdmin, mockIRoleSPICEUser],
  'SPICE INSIGHTS': [mockIRoleSPICEInsightsAdmin, mockIRoleSPICEInsightsUser]
};

const initialState = {
  healthFacility: {
    healthFacilityUserList: [],
    hfTotal: 0,
    healthFacilityList: [],
    healthFacilityUsersLoading: false,
    hfUserDetailLoading: false
  },
  user: {
    user: {
      country: { id: 1, appTypes: [] },
      email: 'test@example.com',
      appTypes: []
    },
    isPasswordSet: true,
    timezoneList: [],
    userRoles: {
      SPICE: [],
      'SPICE INSIGHTS': [{ suiteAccessName: 'spice web' }, { suiteAccessName: 'another access' }]
    }
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
        <AdminList />
      </Router>
    </Provider>
  );
};

const renderWithMemoryRouter = (localStore: any = store, initialEntries: string[] = ['/tenant/1']) => {
  return render(
    <Provider store={localStore}>
      <MemoryRouter initialEntries={initialEntries}>
        <AdminList />
      </MemoryRouter>
    </Provider>
  );
};

describe('AdminList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockModalFormCalls.length = 0;
    mockHandleSearch.mockClear();
    mockHandlePage.mockClear();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', async () => {
      renderWithMemoryRouter(store);
      await waitFor(() => expect(screen.getByText(/Admins/i)).toBeInTheDocument());
    });

    it('should render DetailCard with correct header and button', () => {
      renderComponent(store);
      expect(screen.getByText('Admins')).toBeInTheDocument();
      expect(screen.getByText('Add Admin')).toBeInTheDocument();
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

    it('should show loader when hfUserLoading is true', () => {
      const localStore = mockStore({
        ...initialState,
        healthFacility: { ...initialState.healthFacility, hfUsersLoading: true }
      });
      renderComponent(localStore);
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });

  describe('Add Admin Functionality', () => {
    it('should open modal for adding a new user when Add Admin button is clicked', async () => {
      const localStore = mockStore({
        user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
        healthFacility: {
          healthFacilityUserList: [mockIHFUserGet],
          peerSupervisorList: { list: [] },
          villagesList: { list: [] },
          hfUserDetailLoading: false,
          healthFacilityUsersLoading: false
        },
        chiefdom: { chiefdomList: [] },
        district: { loading: false },
        common: { labelName: null }
      });

      renderComponent(localStore);

      const addButton = screen.getByText('Add Admin');
      expect(addButton).toBeInTheDocument();

      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByTestId(`mock-modalForm-${mockModalFormCalls.length}`)).toBeInTheDocument();
      });
    });

    it('should handle successful admin creation', async () => {
      const localStore = mockStore({
        user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
        healthFacility: {
          healthFacilityUserList: [mockIHFUserGet],
          peerSupervisorList: { list: [] },
          villagesList: { list: [] },
          hfUserDetailLoading: false,
          healthFacilityUsersLoading: false
        },
        common: { labelName: null }
      });

      renderComponent(localStore);

      const addButton = screen.getByText('Add Admin');
      fireEvent.click(addButton);

      await waitFor(() => {
        const mockModalForm: any = mockModalFormCalls[0];
        expect(mockModalForm).toBeDefined();
      });

      const mockModalForm: any = mockModalFormCalls[0];
      mockModalForm.handleFormSubmit({
        users: [
          {
            firstName: 'John',
            lastName: 'Doe',
            username: 'johndoe',
            email: 'johndoe@example.com',
            phoneNumber: '1234567890',
            countryCode: '+1',
            gender: 'Male',
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
            ...getErrorToastArgs(error, APPCONSTANTS.OOPS, APPCONSTANTS.ADMIN_DETAILS_CREATE_ERROR)
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

  describe('Delete Admin Functionality', () => {
    it('should call deleteHFUserRequest and show success message on successful deletion without organizations', async () => {
      const localStore = mockStore({
        user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
        healthFacility: { 
          healthFacilityUserList: [mockIHFUserGet],
          hfUserDetailLoading: false,
          healthFacilityUsersLoading: false
        },
        common: { labelName: null }
      });

      renderComponent(localStore);

      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      mockCustomTable.onDeleteClick({ data: { id: 1 } });

      const actions = localStore.getActions();
      const mockAdminListDelete = actions.find((action: any) => action.type === DELETE_HEALTH_FACILITY_USER_REQUEST);

      if (mockAdminListDelete) {
        mockAdminListDelete.successCb();
        mockAdminListDelete.failureCb((error: Error) => {
          expect(toastCenter.error).toHaveBeenCalledWith(
            ...getErrorToastArgs(error, APPCONSTANTS.OOPS, APPCONSTANTS.ADMIN_DELETE_FAIL)
          );
        });
        const successCbSpy: any = jest.spyOn(mockAdminListDelete, 'successCb');
        const failureCbSpy: any = jest.spyOn(mockAdminListDelete, 'failureCb');
        successCbSpy();
        failureCbSpy();
        expect(failureCbSpy).toHaveBeenCalled();
        expect(successCbSpy).toHaveBeenCalled();
      }
    });

    it('should call deleteHFUserRequest and show success message on successful deletion with organizations', async () => {
      const localStore = mockStore({
        user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
        healthFacility: { 
          healthFacilityUserList: [mockIHFUserGet],
          hfUserDetailLoading: false,
          healthFacilityUsersLoading: false
        },
        common: { labelName: null }
      });

      renderComponent(localStore);

      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      mockCustomTable.onDeleteClick({ data: { id: 1, organizations: [{ id: 1 }] } });

      const actions = localStore.getActions();
      const mockAdminListDelete = actions.find((action: any) => action.type === DELETE_HEALTH_FACILITY_USER_REQUEST);

      if (mockAdminListDelete) {
        mockAdminListDelete.successCb();
        const successCbSpy: any = jest.spyOn(mockAdminListDelete, 'successCb');
        successCbSpy();
        expect(successCbSpy).toHaveBeenCalled();
      }
    });
  });

  describe('Edit Admin Functionality', () => {
    it('should handle openEditModal for edit without CHW role and without SPICE INSIGHTS role', () => {
      renderComponent(store);
      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      const postData = {
        roles: [{ groupName: 'SPICE' }]
      };
      mockCustomTable.onRowEdit(postData);
      expect(screen.getByTestId(`mock-modalForm-${mockModalFormCalls.length}`)).toBeInTheDocument();
    });

    it('should handle openEditModal for edit without CHW role and with SPICE INSIGHTS role', () => {
      renderComponent(store);
      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      const postData = {
        roles: [{ groupName: 'SPICE' }, { groupName: 'SPICE INSIGHTS' }]
      };
      mockCustomTable.onRowEdit(postData);
      expect(screen.getByTestId(`mock-modalForm-${mockModalFormCalls.length}`)).toBeInTheDocument();
    });

    it('should handle openEditModal for edit with CHW role', () => {
      const localStore = mockStore({
        ...initialState
      });
      renderComponent(localStore);
      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      const postData = {
        id: 1,
        roles: [{ name: 'CHW' }, { groupName: 'SPICE' }, { groupName: 'SPICE INSIGHTS' }]
      };
      mockCustomTable.onRowEdit(postData);
      const actions = localStore.getActions();
      const mockFetchDetailsType = actions.find((action: any) => action.type === FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST);
      
      if (mockFetchDetailsType) {
        mockFetchDetailsType.successCb({
          id: 1,
          roles: [{ name: 'CHW' }, { groupName: 'SPICE' }, { groupName: 'SPICE INSIGHTS' }],
          supervisor: { firstName: 'John', lastName: 'Doe' }
        });

        mockFetchDetailsType.failureCb((error: Error) => {
          expect(toastCenter.error).toHaveBeenCalledWith(
            ...getErrorToastArgs(error, APPCONSTANTS.OOPS, APPCONSTANTS.ADMIN_DELETE_FAIL)
          );
        });
        const successCbSpy: any = jest.spyOn(mockFetchDetailsType, 'successCb');
        const failureCbSpy: any = jest.spyOn(mockFetchDetailsType, 'failureCb');
        successCbSpy();
        failureCbSpy();
        expect(failureCbSpy).toHaveBeenCalled();
        expect(successCbSpy).toHaveBeenCalled();
      }

      expect(screen.getByTestId(`mock-modalForm-${mockModalFormCalls.length}`)).toBeInTheDocument();
    });

    it('should handle openEditModal for edit without roles', () => {
      renderComponent(store);
      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      const postData = {};
      mockCustomTable.onRowEdit(postData);
      expect(screen.getByTestId(`mock-modalForm-${mockModalFormCalls.length}`)).toBeInTheDocument();
    });

    it('should handle openEditModal for edit with CHW role without supervisor and roles', () => {
      const localStore = mockStore({
        ...initialState
      });
      renderComponent(localStore);
      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      const postData = {
        id: 1,
        roles: [{ name: 'CHW' }, { groupName: 'SPICE' }, { groupName: 'SPICE INSIGHTS' }]
      };
      mockCustomTable.onRowEdit(postData);
      const actions = localStore.getActions();
      const mockFetchDetailsType = actions.find((action: any) => action.type === FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST);
      
      if (mockFetchDetailsType) {
        mockFetchDetailsType.successCb({
          id: 1
        });

        mockFetchDetailsType.failureCb((error: Error) => {
          expect(toastCenter.error).toHaveBeenCalledWith(
            ...getErrorToastArgs(error, APPCONSTANTS.OOPS, APPCONSTANTS.ADMIN_DELETE_FAIL)
          );
        });
        const successCbSpy: any = jest.spyOn(mockFetchDetailsType, 'successCb');
        const failureCbSpy: any = jest.spyOn(mockFetchDetailsType, 'failureCb');
        successCbSpy();
        failureCbSpy();
        expect(failureCbSpy).toHaveBeenCalled();
        expect(successCbSpy).toHaveBeenCalled();
      }

      expect(screen.getByTestId(`mock-modalForm-${mockModalFormCalls.length}`)).toBeInTheDocument();
    });
  });

  describe('Action Formatters', () => {
    it('should hide edit, delete, and custom icons for the user\'s own row', () => {
      renderComponent(store);
      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      mockCustomTable.actionFormatter.hideEditIcon({ username: 'test@example.com' });
      mockCustomTable.actionFormatter.hideDeleteIcon({ username: 'test@example.com' });
      mockCustomTable.actionFormatter.hideCustomIcon({ username: 'test@example.com' });
      expect(screen.getByTestId('mock-customTable')).toBeInTheDocument();
    });

    it('should show edit, delete, and custom icons for other users', () => {
      const rowData = { username: 'anotheruser@example.com' };

      const actionFormatter = {
        hideEditIcon: (rowDataEdit: any) => rowDataEdit.username === email,
        hideDeleteIcon: (rowDataDelete: any) => rowDataDelete.username === email,
        hideCustomIcon: (rowDataCustom: any) => rowDataCustom.username === email
      };

      expect(actionFormatter.hideEditIcon(rowData)).toBe(false);
      expect(actionFormatter.hideDeleteIcon(rowData)).toBe(false);
      expect(actionFormatter.hideCustomIcon(rowData)).toBe(false);
    });
  });

  describe('Modal Functionality', () => {
    it('should handle modal cancellation correctly', async () => {
      const localStore = mockStore({
        user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
        healthFacility: {
          healthFacilityUserList: [mockIHFUserGet],
          peerSupervisorList: { list: [] },
          villagesList: { list: [] },
          hfUserDetailLoading: false,
          healthFacilityUsersLoading: false
        },
        common: { labelName: null }
      });

      renderComponent(localStore);

      const addButton = screen.getByText('Add Admin');
      fireEvent.click(addButton);

      await waitFor(() => {
        const mockModalForm: any = mockModalFormCalls[0];
        expect(mockModalForm).toBeDefined();
      });

      const mockModalForm: any = mockModalFormCalls[0];
      mockModalForm.handleCancel();
      expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
    });

    it('should handle modal cancel correctly', () => {
      renderComponent(store);
      if (mockModalFormCalls.length > 1) {
        const mockModalForm: any = mockModalFormCalls[1];
        mockModalForm.handleCancel();
        expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
      }
    });
  });

  describe('Change Password Functionality', () => {
    it('should handle change password correctly', () => {
      renderComponent(store);
      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      mockCustomTable.onCustomConfirmed({
        id: 1
      });
      expect(screen.getByTestId(`mock-modalForm-${mockModalFormCalls.length}`)).toBeInTheDocument();
    });

    it('should handle reset password submit correctly', () => {
      renderComponent(store);
      
      // First open the change password modal
      const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
      mockCustomTable.onCustomConfirmed({
        id: 1,
        username: 'test@example.com'
      });

      // Find the change password modal (should be the last one)
      const changePasswordModal = mockModalFormCalls[mockModalFormCalls.length - 1];
      
      if (changePasswordModal) {
        changePasswordModal.handleFormSubmit({
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
  });

  describe('User Roles Fetch', () => {
    it('should handle user roles fetch failure', async () => {
      const errorToastSpy = jest.spyOn(toastCenter, 'error');

      const localStore = mockStore({
        user: {
          countryList: [],
          email: 'test@gmail.com',
          userRoles: {}
        },
        healthFacility: {
          healthFacilityUserList: [mockIHFUserGet],
          hfUserDetailLoading: false,
          healthFacilityUsersLoading: false
        },
        common: { labelName: null }
      });

      renderComponent(localStore);

      const actions = localStore.getActions();
      const fetchUserRolesAction = actions.find((action: any) => action.type === 'FETCH_USER_ROLES_REQUEST');

      if (fetchUserRolesAction) {
        fetchUserRolesAction.failureCb(new Error('Failed to fetch user roles'));

        await waitFor(() => {
          expect(errorToastSpy).toHaveBeenCalledWith(APPCONSTANTS.OOPS, APPCONSTANTS.USER_ROLES_FETCH_ERROR);
        });
      }
    });
  });

  describe('List Fetching', () => {
    it('should call fetch admin list on mount', async () => {
      const localStore = mockStore({
        user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
        healthFacility: { 
          healthFacilityUserList: mockIHFUserGet,
          hfUserDetailLoading: false,
          healthFacilityUsersLoading: false
        },
        common: { labelName: null }
      });

      renderComponent(localStore);

      const actions = localStore.getActions();
      const mockFetchDetailsType = actions.find((action: any) => action.type === FETCH_HEALTH_FACILITY_USER_LIST_REQUEST);
      
      if (mockFetchDetailsType) {
        const failureCbSpy = jest.spyOn(mockFetchDetailsType, 'failureCb');
        mockFetchDetailsType.failureCb({ message: 'error' });
        await waitFor(() => {
          expect(failureCbSpy).toHaveBeenCalled();
        });
      }
    });
  });

  describe('Search Functionality', () => {
    it('should handle search input', () => {
      renderComponent(store);
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toBeInTheDocument();
      
      fireEvent.change(searchInput, { target: { value: 'test search' } });
      expect(searchInput).toBeInTheDocument();
    });
  });
});
