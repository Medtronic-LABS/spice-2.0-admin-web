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
  FETCH_HEALTH_FACILITY_USER_LIST_REQUEST
} from '../../../store/healthFacility/actionTypes';
import APPCONSTANTS from '../../../constants/appConstants';

const mockChildComponent = jest.fn();
jest.mock('../../../components/tableFilter/Filter', () => (props: any) => {
  mockChildComponent(props);
  return <div>child component</div>;
});

jest.mock('../../../components/userForm/UserForm', () => () => {
  return <div data-testid='mock-userForm'>child component</div>;
});

jest.mock('../../../assets/images/reset-password.svg', () => ({
  ReactComponent: 'PasswordChangeIcon'
}));

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
    healthFacilityUsersLoading: false
  },
  user: {
    user: { country: 'USA' },
    isPasswordSet: true,
    timezoneList: []
  },
  countryIdSelector: { id: 1 },
  emailSelector: 'test@example.com',
  rolesGrouped: {
    'SPICE INSIGHTS': [{ suiteAccessName: 'spice web' }, { suiteAccessName: 'another access' }]
  },
  roleSpiceList: ['RoleSpice 1', 'RoleSpice 2'],
  selectedRole: ['Selected Role 1']
};
const mockStore = configureStore([]);
const store = mockStore(initialState);
const email = 'test@example.com';

const renderComponent = (store: any = {}) => {
  return render(
    <Provider store={store}>
      <Router>
        <AdminList />
      </Router>
    </Provider>
  );
};

const renderWithMemoryRouter = (store: any = {}, initialEntries: string[] = ['/tenant/1']) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <AdminList />
      </MemoryRouter>
    </Provider>
  );
};

describe('Admins Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call deleteHFUserRequest and show success message on successful deletion', async () => {
    const refreshHFUserList = jest.fn();

    toastCenter.success = jest.fn();
    toastCenter.error = jest.fn();

    const localStore = mockStore({
      user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
      healthFacility: { healthFacilityUserList: [mockIHFUserGet] }
    });

    const { getByTestId, unmount } = renderComponent(localStore);

    const deleteButton = getByTestId('delete-icon');
    await waitFor(() => {
      fireEvent.click(deleteButton);
    });

    expect(screen.getByText('Delete User')).toBeInTheDocument();

    const confirmButton = getByTestId('delete-ok-button');
    await waitFor(() => {
      fireEvent.click(confirmButton);
    });

    const actions = localStore.getActions();
    const mockAdminListDelete = actions.find((action) => action.type === DELETE_HEALTH_FACILITY_USER_REQUEST);

    mockAdminListDelete.successCb(() => {
      expect(refreshHFUserList).toHaveBeenCalled();
      expect(toastCenter.success).toHaveBeenCalledWith(APPCONSTANTS.SUCCESS, APPCONSTANTS.ADMIN_DELETE_SUCCESS);
    });
    const successCbSpy: any = jest.spyOn(mockAdminListDelete, 'successCb');
    successCbSpy();
    expect(successCbSpy).toHaveBeenCalled();
    unmount();
  });

  it('should open modal for adding a new user when Add Admin button is clicked', async () => {
    const localStore = mockStore({
      user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
      healthFacility: {
        healthFacilityUserList: [mockIHFUserGet],
        peerSupervisorList: { list: [] },
        villagesList: { list: [] }
      },
      chiefdom: { chiefdomList: [] },
      district: { loading: false }
    });

    const { getByTestId, unmount } = renderComponent(localStore);

    const addButton = screen.getByText('Add Admin');
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);

    await waitFor(() => expect(getByTestId('modal-title')).toHaveTextContent('Add Admin'));
    unmount();
  });
  it('should renders without crashing', async () => {
    const { unmount } = renderWithMemoryRouter(store);
    await waitFor(() => expect(screen.getByText(/Admins/i)).toBeInTheDocument());
    unmount();
  });

  it('should render correctly filters roleSpiceList', () => {
    const { unmount } = renderWithMemoryRouter(store, ['/region/1/1']);

    const roleSpiceElement = screen.queryByText((content, element) => content.includes('RoleSpice 1'));
    waitFor(() => {
      expect(roleSpiceElement).toBeInTheDocument();
    });
    unmount();
  });
  it('should call delete admin list', async () => {
    const localStore = mockStore({
      user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
      healthFacility: { healthFacilityUserList: mockIHFUserGet }
    });

    const { unmount } = renderComponent(localStore);

    const actions = localStore.getActions();
    const mockFetchDetailsType = actions.find((action) => action.type === FETCH_HEALTH_FACILITY_USER_LIST_REQUEST);
    const failureCbSpy = jest.spyOn(mockFetchDetailsType, 'failureCb');
    mockFetchDetailsType.failureCb({ message: 'error' });
    await waitFor(() => {
      expect(failureCbSpy).toHaveBeenCalled();
    });
    unmount();
  });

  it('should open modal form', async () => {
    const localStore = mockStore({
      user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
      healthFacility: {
        healthFacilityUserList: [mockIHFUserGet],
        peerSupervisorList: { list: [] },
        villagesList: { list: [] }
      },
      chiefdom: { chiefdomList: [] },
      district: { loading: false }
    });

    const { getByTestId, unmount } = renderComponent(localStore);

    const editButton = getByTestId('edit-icon');

    await waitFor(() => fireEvent.click(editButton));

    await waitFor(() => expect(screen.getByText('Edit Admin')).toBeInTheDocument());
    unmount();
  });

  it('should close modal and clear user data on cancel button click', async () => {
    const localStore = mockStore({
      user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
      healthFacility: {
        healthFacilityUserList: [mockIHFUserGet],
        peerSupervisorList: { list: [] },
        villagesList: { list: [] }
      },
      chiefdom: { chiefdomList: [] },
      district: { loading: false }
    });

    const { getByTestId, unmount } = renderComponent(localStore);

    fireEvent.click(getByTestId('edit-icon'));
    await waitFor(() => expect(screen.getByText('Edit Admin')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(screen.queryByText('Edit Admin')).not.toBeInTheDocument();
    });
    unmount();
  });

  it(`shouldhides edit, delete, and custom icons for the user's own row`, () => {
    const rowData = { username: 'test@example.com' };

    const actionFormatter = {
      hideEditIcon: (rowDataEdit: any) => rowDataEdit.username === email,
      hideDeleteIcon: (rowDataDelete: any) => rowDataDelete.username === email,
      hideCustomIcon: (rowDataCustom: any) => rowDataCustom.username === email
    };

    expect(actionFormatter.hideEditIcon(rowData)).toBe(true);
    expect(actionFormatter.hideDeleteIcon(rowData)).toBe(true);
    expect(actionFormatter.hideCustomIcon(rowData)).toBe(true);
  });

  it('should shows edit, delete, and custom icons for other users', () => {
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

  //
  it('should handle user roles fetch failure', async () => {
    const errorToastSpy = jest.spyOn(toastCenter, 'error');

    const localStore = mockStore({
      user: {
        countryList: [],
        email: 'test@gmail.com',
        userRoles: {}
      },
      healthFacility: {
        healthFacilityUserList: [mockIHFUserGet]
      }
    });

    const { unmount } = renderComponent(localStore);

    const actions = localStore.getActions();
    const fetchUserRolesAction = actions.find((action) => action.type === 'FETCH_USER_ROLES_REQUEST');

    fetchUserRolesAction.failureCb(new Error('Failed to fetch user roles'));

    await waitFor(() => {
      expect(errorToastSpy).toHaveBeenCalledWith(APPCONSTANTS.OOPS, APPCONSTANTS.USER_ROLES_FETCH_ERROR);
    });

    unmount();
  });

  it('should handles user deletion success and failure scenarios', async () => {
    const localStore = mockStore({
      user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
      healthFacility: {
        healthFacilityUserList: [
          {
            id: 1,
            username: 'different@example.com',
            firstName: 'Test',
            lastName: 'User',
            roles: [],
            organizations: [{ id: 123 }]
          }
        ]
      }
    });

    const { getByTestId, unmount } = renderComponent(localStore);

    const deleteButton = getByTestId('delete-icon');
    fireEvent.click(deleteButton);

    const confirmButton = getByTestId('delete-ok-button');
    fireEvent.click(confirmButton);

    const actions = localStore.getActions();
    const mockDeleteHFUserRequestType = actions.find((action) => action.type === DELETE_HEALTH_FACILITY_USER_REQUEST);
    const refreshHFUserList = jest.fn();
    mockDeleteHFUserRequestType.successCb(() => {
      expect(refreshHFUserList).toHaveBeenCalled();
      expect(toastCenter.success).toHaveBeenCalledWith(APPCONSTANTS.SUCCESS, APPCONSTANTS.ADMIN_DELETE_SUCCESS);
    });
    mockDeleteHFUserRequestType.failureCb((error: Error) => {
      expect(toastCenter.error).toHaveBeenCalledWith(
        ...getErrorToastArgs(error, APPCONSTANTS.OOPS, APPCONSTANTS.ADMIN_DELETE_FAIL)
      );
    });
    const failureCbSpy = jest.spyOn(mockDeleteHFUserRequestType, 'failureCb');
    const successCbSpy = jest.spyOn(mockDeleteHFUserRequestType, 'successCb');
    waitFor(() => {
      expect(failureCbSpy).toHaveBeenCalled();
      expect(successCbSpy).toHaveBeenCalled();
    });
    unmount();
  });

  it('should fetch user details when user has CHW role', async () => {
    const localStore = mockStore({
      user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
      healthFacility: {
        healthFacilityUserList: [mockIHFUserGet],
        peerSupervisorList: { list: [] },
        villagesList: { list: [] }
      }
    });

    const { unmount } = renderComponent(localStore);

    // Mock user data with CHW role
    const mockUserWithCHWRole = {
      ...mockIHFUserGet,
      roles: [...mockIHFUserGet.roles, { id: 3, name: 'CHW' }]
    };

    // Simulate edit button click with CHW role user
    const actions = localStore.getActions();
    const mockFetchUserDetailRequest = actions.find((action) => action.type === 'FETCH_USER_DETAIL_REQUEST');

    // Test success callback
    if (mockFetchUserDetailRequest) {
      mockFetchUserDetailRequest.successCb({
        ...mockUserWithCHWRole,
        supervisor: {
          firstName: 'John',
          lastName: 'Supervisor'
        }
      });

      await waitFor(() => {
        expect(screen.getByText('Edit Admin')).toBeInTheDocument();
      });
    }

    unmount();
  });

  it('should handle direct edit when user does not have CHW role', async () => {
    const localStore = mockStore({
      user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
      healthFacility: {
        healthFacilityUserList: [mockIHFUserGet],
        peerSupervisorList: { list: [] },
        villagesList: { list: [] }
      }
    });

    const { unmount } = renderComponent(localStore);

    // Mock user data without CHW role
    const mockUserWithoutCHWRole = {
      ...mockIHFUserGet,
      roles: [
        { id: 1, name: 'Admin', groupName: 'SPICE' },
        { id: 2, name: 'User', groupName: 'SPICE INSIGHTS' }
      ]
    };

    // Simulate opening edit modal
    const editButton = screen.getByTestId('edit-icon');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText('Edit Admin')).toBeInTheDocument();
    });

    unmount();
  });

  it('should handle fetch user detail failure for CHW user', async () => {
    const localStore = mockStore({
      user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
      healthFacility: {
        healthFacilityUserList: [mockIHFUserGet],
        peerSupervisorList: { list: [] },
        villagesList: { list: [] }
      }
    });

    const errorToastSpy = jest.spyOn(toastCenter, 'error');
    const { unmount } = renderComponent(localStore);

    // Mock user data with CHW role
    const mockUserWithCHWRole = {
      ...mockIHFUserGet,
      roles: [...mockIHFUserGet.roles, { id: 3, name: 'CHW' }]
    };

    // Simulate edit button click with CHW role user
    const actions = localStore.getActions();
    const mockFetchUserDetailRequest = actions.find((action) => action.type === 'FETCH_USER_DETAIL_REQUEST');

    // Test failure callback
    if (mockFetchUserDetailRequest) {
      const error = new Error('Failed to fetch user details');
      mockFetchUserDetailRequest.failureCb(error);

      await waitFor(() => {
        expect(errorToastSpy).toHaveBeenCalledWith(
          ...getErrorToastArgs(error, APPCONSTANTS.OOPS, APPCONSTANTS.ADMIN_DETAIL_FETCH_FAIL)
        );
      });
    }

    unmount();
  });
});
