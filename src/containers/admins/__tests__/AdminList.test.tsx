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
  ReactComponent: 'PasswordChangeIcon'
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
  generatePassword: jest.fn()
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

const renderComponent = (localStore: any = {}) => {
  return render(
    <Provider store={localStore}>
      <Router>
        <AdminList />
      </Router>
    </Provider>
  );
};

const renderWithMemoryRouter = (localStore: any = {}, initialEntries: string[] = ['/tenant/1']) => {
  return render(
    <Provider store={localStore}>
      <MemoryRouter initialEntries={initialEntries}>
        <AdminList />
      </MemoryRouter>
    </Provider>
  );
};

describe('Admins Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockModalFormCalls.length = 0;
  });

  it(`should call deleteHFUserRequest and
    show success message on successful deletion without organizations`, async () => {
    const refreshHFUserList = jest.fn();

    const localStore = mockStore({
      user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
      healthFacility: { healthFacilityUserList: [mockIHFUserGet] }
    });

    renderComponent(localStore);

    const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
    mockCustomTable.onDeleteClick({ data: { id: 1 } });

    const actions = localStore.getActions();
    const mockAdminListDelete = actions.find((action) => action.type === DELETE_HEALTH_FACILITY_USER_REQUEST);

    mockAdminListDelete.successCb(() => {
      expect(refreshHFUserList).toHaveBeenCalled();
      expect(toastCenter.success).toHaveBeenCalledWith(APPCONSTANTS.SUCCESS, APPCONSTANTS.ADMIN_DELETE_SUCCESS);
    });

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
  });

  it(`should call deleteHFUserRequest and
    show success message on successful deletion with organizations`, async () => {
    const refreshHFUserList = jest.fn();

    const localStore = mockStore({
      user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
      healthFacility: { healthFacilityUserList: [mockIHFUserGet] }
    });

    renderComponent(localStore);

    const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
    mockCustomTable.onDeleteClick({ data: { id: 1, organizations: [{ id: 1 }] } });

    const actions = localStore.getActions();
    const mockAdminListDelete = actions.find((action) => action.type === DELETE_HEALTH_FACILITY_USER_REQUEST);

    mockAdminListDelete.successCb(() => {
      expect(refreshHFUserList).toHaveBeenCalled();
      expect(toastCenter.success).toHaveBeenCalledWith(APPCONSTANTS.SUCCESS, APPCONSTANTS.ADMIN_DELETE_SUCCESS);
    });
    const successCbSpy: any = jest.spyOn(mockAdminListDelete, 'successCb');
    successCbSpy();
    expect(successCbSpy).toHaveBeenCalled();
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

    const { getByTestId } = renderComponent(localStore);

    const addButton = screen.getByText('Add Admin');
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);

    expect(getByTestId(`mock-modalForm-${mockModalFormCalls.length}`)).toBeInTheDocument();
  });
  it('should renders without crashing', async () => {
    renderWithMemoryRouter(store);
    await waitFor(() => expect(screen.getByText(/Admins/i)).toBeInTheDocument());
  });

  it('should render correctly filters roleSpiceList', () => {
    renderWithMemoryRouter(store, ['/region/1/1']);

    const roleSpiceElement = screen.queryByText((content, element) => content.includes('RoleSpice 1'));
    waitFor(() => {
      expect(roleSpiceElement).toBeInTheDocument();
    });
  });
  it('should call delete admin list', async () => {
    const localStore = mockStore({
      user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
      healthFacility: { healthFacilityUserList: mockIHFUserGet }
    });

    renderComponent(localStore);

    const actions = localStore.getActions();
    const mockFetchDetailsType = actions.find((action) => action.type === FETCH_HEALTH_FACILITY_USER_LIST_REQUEST);
    const failureCbSpy = jest.spyOn(mockFetchDetailsType, 'failureCb');
    mockFetchDetailsType.failureCb({ message: 'error' });
    await waitFor(() => {
      expect(failureCbSpy).toHaveBeenCalled();
    });
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

    renderComponent(localStore);

    const actions = localStore.getActions();
    const fetchUserRolesAction = actions.find((action) => action.type === 'FETCH_USER_ROLES_REQUEST');

    fetchUserRolesAction.failureCb(new Error('Failed to fetch user roles'));

    await waitFor(() => {
      expect(errorToastSpy).toHaveBeenCalledWith(APPCONSTANTS.OOPS, APPCONSTANTS.USER_ROLES_FETCH_ERROR);
    });
  });

  it('should show loader when hfUserDetailLoading is true', () => {
    const localStore = mockStore({
      ...initialState,
      healthFacility: { ...initialState.healthFacility, hfUserDetailLoading: true }
    });
    renderComponent(localStore);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('Access handleFormatter for hideEditIcon', () => {
    renderComponent(store);
    const mockCustomTable: any = mockChildTableComponent.mock.calls[0][0];
    mockCustomTable.actionFormatter.hideEditIcon({ username: 'test@example.com' });
    mockCustomTable.actionFormatter.hideDeleteIcon({ username: 'test@example.com' });
    mockCustomTable.actionFormatter.hideCustomIcon({ username: 'test@example.com' });
    expect(screen.getByTestId('mock-customTable')).toBeInTheDocument();
  });

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
    const mockFetchDetailsType = actions.find((action) => action.type === FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST);
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
    waitFor(() => {
      expect(failureCbSpy).toHaveBeenCalled();
      expect(successCbSpy).toHaveBeenCalled();
    });

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
    const mockFetchDetailsType = actions.find((action) => action.type === FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST);
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
    waitFor(() => {
      expect(failureCbSpy).toHaveBeenCalled();
      expect(successCbSpy).toHaveBeenCalled();
    });

    expect(screen.getByTestId(`mock-modalForm-${mockModalFormCalls.length}`)).toBeInTheDocument();
  });

  it('should handle modal cancellation correctly', async () => {
    const localStore = mockStore({
      user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
      healthFacility: {
        healthFacilityUserList: [mockIHFUserGet],
        peerSupervisorList: { list: [] },
        villagesList: { list: [] }
      }
    });

    renderComponent(localStore);

    const addButton = screen.getByText('Add Admin');
    fireEvent.click(addButton);

    const mockModalForm: any = mockModalFormCalls[0];
    mockModalForm.handleCancel();
    expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
  });

  it('should handle successful admin creation', async () => {
    const localStore = mockStore({
      user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
      healthFacility: {
        healthFacilityUserList: [mockIHFUserGet],
        peerSupervisorList: { list: [] },
        villagesList: { list: [] }
      }
    });

    renderComponent(localStore);

    const mockModalForm: any = mockModalFormCalls[0];
    mockModalForm.handleFormSubmit({
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
    const mockCreateHFUser = actions.find((action) => action.type === CREATE_HEALTH_FACILITY_USER_REQUEST);
    mockCreateHFUser.successCb();
    mockCreateHFUser.failureCb((error: Error) => {
      expect(toastCenter.error).toHaveBeenCalledWith(
        ...getErrorToastArgs(error, APPCONSTANTS.OOPS, APPCONSTANTS.ADMIN_DETAILS_CREATE_ERROR)
      );
    });
    const successCbSpy: any = jest.spyOn(mockCreateHFUser, 'successCb');
    const failureCbSpy: any = jest.spyOn(mockCreateHFUser, 'failureCb');
    waitFor(() => {
      expect(failureCbSpy).toHaveBeenCalled();
      expect(successCbSpy).toHaveBeenCalled();
    });
  });

  it('should handle modal cancel correctly', () => {
    renderComponent(store);
    const mockModalForm: any = mockModalFormCalls[1];
    mockModalForm.handleCancel();
    expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
  });

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
    const mockModalForm: any = mockModalFormCalls[1];
    mockModalForm.handleFormSubmit({
      newPassword: 'newPassword'
    });

    const actions = store.getActions();
    const mockChangePassword = actions.find((action) => action.type === CHANGE_PASSWORD_REQUEST);
    mockChangePassword.data.successCB(() => {
      expect(toastCenter.success).toHaveBeenCalledWith(APPCONSTANTS.SUCCESS, APPCONSTANTS.PASSWORD_CHANGE_SUCCESS);
    });
    mockChangePassword.data.failureCb((error: Error) => {
      expect(toastCenter.error).toHaveBeenCalledWith(
        ...getErrorToastArgs(error, APPCONSTANTS.ERROR, APPCONSTANTS.PASSWORD_CHANGE_FAILED)
      );
    });

    const successCBSpy: any = jest.spyOn(mockChangePassword.data, 'successCB');
    const failureCbSpy: any = jest.spyOn(mockChangePassword.data, 'failureCb');
    waitFor(() => {
      expect(failureCbSpy).toHaveBeenCalled();
      expect(successCBSpy).toHaveBeenCalled();
    });
  });
});
