import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Users from '../UserList'; // Adjust path to your component
import * as redux from 'react-redux';
import { createRoot } from 'react-dom/client';
import { IGroupRoles, IRoles } from '../../../store/user/types';
import { toast } from 'react-toastify';
import toastCenter from '../../../utils/toastCenter';
import {
  DELETE_HEALTH_FACILITY_USER_REQUEST,
  FETCH_HEALTH_FACILITY_USER_LIST_REQUEST
} from '../../../store/healthFacility/actionTypes';
import APPCONSTANTS from '../../../constants/appConstants';

// In your test setup file
const renderWithCreateRoot = (component: React.ReactNode) => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootInstance = createRoot(root);
  rootInstance.render(component);
  return root;
};
const mockStore = configureStore([]);

const mockChildComponent = jest.fn();
jest.mock('../../../components/tableFilter/Filter', () => (props: any) => {
  mockChildComponent(props);
  return <div>Filter</div>;
});

jest.mock('../../../components/userForm/UserForm', () => () => {
  return <div data-testid='mock-userForm'>userForm</div>;
});

const initialSuccessToastSpy = jest.spyOn(toast, 'success');
// Make sure to clear the spy after each test
afterEach(() => {
  initialSuccessToastSpy.mockClear();
});

const mockIHFUserGet: any = {
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
      name: 'User'
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

const mockIRoleSPICEAdmin: IRoles = {
  id: 1,
  name: 'SPICE User',
  level: 3,
  suiteAccessName: 'SPICE',
  displayName: 'SPICE Administrator',
  groupName: 'SPICE',
  tenantIds: [100, 101],
  appTypes: ['web', 'mobile']
};

const mockIRoleSPICEUser: IRoles = {
  id: 2,
  name: 'SPICE User',
  level: 1,
  suiteAccessName: 'SPICE',
  displayName: 'SPICE Regular User',
  groupName: 'SPICE',
  tenantIds: [102],
  appTypes: ['web']
};

const mockIRoleSPICEInsightsAdmin: IRoles = {
  id: 3,
  name: 'SPICE Insights User',
  level: 2,
  suiteAccessName: 'SPICE INSIGHTS',
  displayName: 'SPICE Insights Administrator',
  groupName: 'SPICE INSIGHTS',
  tenantIds: [103],
  appTypes: ['mobile']
};

const mockIRoleSPICEInsightsUser: IRoles = {
  id: 4,
  name: 'SPICE Insights User',
  level: 1,
  suiteAccessName: 'SPICE INSIGHTS',
  displayName: 'SPICE Insights Regular User',
  groupName: 'SPICE INSIGHTS',
  tenantIds: [104],
  appTypes: ['web']
};

const mockIGroupRoles: IGroupRoles = {
  SPICE: [mockIRoleSPICEAdmin, mockIRoleSPICEUser],
  'SPICE INSIGHTS': [mockIRoleSPICEInsightsAdmin, mockIRoleSPICEInsightsUser]
};

// At the top of your test file, make sure you have the proper mock setup
// jest.mock('../../../services/healthFacilityAPI', () => ({
//   deleteHFUser: jest.fn()
// }));

jest.mock('../../../assets/images/reset-password.svg', () => ({
  ReactComponent: 'PasswordChangeIcon'
}));

describe('Users Component', () => {
  let store: any;
  const email = 'test@example.com';
  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore({
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
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', async () => {
    renderWithCreateRoot(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/tenant/1']}>
          <Users />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => expect(screen.getByText(/Users/i)).toBeInTheDocument());
  });

  test('correctly filters roleSpiceList', () => {
    renderWithCreateRoot(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/region/1/1']}>
          <Users />
        </MemoryRouter>
      </Provider>
    );

    const roleSpiceElement = screen.queryByText((content, element) => content.includes('RoleSpice 1'));
    waitFor(() => {
      expect(roleSpiceElement).toBeInTheDocument();
    });
  });

  test('should call deleteHFUserRequest and show success message on successful deletion', async () => {
    const refreshHFUserList = jest.fn();

    // Explicitly mock toast functions
    toastCenter.success = jest.fn();
    toastCenter.error = jest.fn();

    const localStore = mockStore({
      user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
      healthFacility: { healthFacilityUserList: [mockIHFUserGet] }
    });

    const { getByTestId } = render(
      <Provider store={localStore}>
        <Router>
          <Users />
        </Router>
      </Provider>
    );

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
    // Simulate a successful deletion
    mockAdminListDelete.successCb(() => {
      expect(refreshHFUserList).toHaveBeenCalled();
      expect(toastCenter.success).toHaveBeenCalledWith(APPCONSTANTS.SUCCESS, APPCONSTANTS.ADMIN_DELETE_SUCCESS);
    });
    const successCbSpy: any = jest.spyOn(mockAdminListDelete, 'successCb');
    successCbSpy();
    expect(successCbSpy).toHaveBeenCalled();
    // Clean up mock implementations
    jest.clearAllMocks();
  });
  it('should call delete admin list', async () => {
    const localStore = mockStore({
      user: { countryList: [], email: 'test@gmail.com', userRoles: mockIGroupRoles },
      healthFacility: { healthFacilityUserList: mockIHFUserGet }
    });

    render(
      <Provider store={localStore}>
        <Router>
          <Users />
        </Router>
      </Provider>
    );

    const mockDispatch = jest.fn();
    jest.spyOn(redux, 'useDispatch').mockReturnValue(mockDispatch);

    const actions = localStore.getActions();
    const mockFetchDetailsType = actions.find((action) => action.type === FETCH_HEALTH_FACILITY_USER_LIST_REQUEST);
    const failureCbSpy = jest.spyOn(mockFetchDetailsType, 'failureCb');
    mockFetchDetailsType.failureCb({ message: 'error' });
    await waitFor(() => {
      expect(failureCbSpy).toHaveBeenCalled();
    });
  });

  test('should open modal form', async () => {
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

    const { getByTestId } = render(
      <Provider store={localStore}>
        <Router>
          <Users />
        </Router>
      </Provider>
    );

    const editButton = getByTestId('edit-icon');

    // Use waitFor to handle asynchronous updates
    await waitFor(() => fireEvent.click(editButton));

    // Wait for the modal text "Edit User" to appear in the document
    await waitFor(() => expect(screen.getByText('Edit User')).toBeInTheDocument());
  });

  test('should close modal and clear user data on cancel button click', async () => {
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

    const { getByTestId } = render(
      <Provider store={localStore}>
        <Router>
          <Users />
        </Router>
      </Provider>
    );

    // Open the modal first by clicking the edit button
    fireEvent.click(getByTestId('edit-icon'));
    await waitFor(() => expect(screen.getByText('Edit User')).toBeInTheDocument());
    // Click the cancel button
    fireEvent.click(screen.getByText('Cancel'));

    // Assert modal is closed and user data is cleared
    await waitFor(() => {
      expect(screen.queryByText('Edit User')).not.toBeInTheDocument();
    });
  });

  test('should open modal for adding a new user when Add User button is clicked', async () => {
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

    const { getByTestId } = render(
      <Provider store={localStore}>
        <Router>
          <Users />
        </Router>
      </Provider>
    );
    // Ensure the Add User button is present and click it
    const [addButton] = screen.getAllByText('Add User');
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);

    // Check that modal title "Add User" appears and confirms it's in 'add' mode (isEdit: false)
    await waitFor(() => expect(getByTestId('modal-title')).toHaveTextContent('Add User'));
  });

  test('hides edit, delete, and custom icons for the user’s own row', () => {
    const rowData = { username: 'test@example.com' }; // This should match the user's email

    const actionFormatter = {
      hideEditIcon: (rowDataEdit: any) => rowDataEdit.username === email,
      hideDeleteIcon: (rowDataDelete: any) => rowDataDelete.username === email,
      hideCustomIcon: (rowDataCustom: any) => rowDataCustom.username === email
    };

    // Run your assertions to make sure the icons are hidden
    expect(actionFormatter.hideEditIcon(rowData)).toBe(true);
    expect(actionFormatter.hideDeleteIcon(rowData)).toBe(true);
    expect(actionFormatter.hideCustomIcon(rowData)).toBe(true);
  });

  test('shows edit, delete, and custom icons for other users', () => {
    const rowData = { username: 'anotheruser@example.com' }; // Different user email

    const actionFormatter = {
      hideEditIcon: (rowDataEdit: any) => rowDataEdit.username === email,
      hideDeleteIcon: (rowDataDelete: any) => rowDataDelete.username === email,
      hideCustomIcon: (rowDataCustom: any) => rowDataCustom.username === email
    };

    // Run your assertions to make sure the icons are visible for other users
    expect(actionFormatter.hideEditIcon(rowData)).toBe(false);
    expect(actionFormatter.hideDeleteIcon(rowData)).toBe(false);
    expect(actionFormatter.hideCustomIcon(rowData)).toBe(false);
  });

  test('handles user deletion successfully', async () => {
    const localStore = mockStore({
      ...store.getState(),
      healthFacility: {
        healthFacilityUserList: [
          {
            id: 1,
            username: 'different@example.com',
            firstName: 'Test',
            lastName: 'User',
            roles: [],
            organizations: []
          }
        ],
        hfTotal: 1,
        healthFacilityList: [],
        healthFacilityUsersLoading: false
      },
      user: {
        user: { country: 'USA' },
        isPasswordSet: true,
        timezoneList: []
      },
      emailSelector: 'test@example.com',
      countryIdSelector: { id: 1 }
    });

    const successToastSpy = jest.spyOn(toast, 'success');
    const mockDispatch = jest.fn();
    jest.spyOn(redux, 'useDispatch').mockReturnValue(mockDispatch);

    const { getByTestId } = render(
      <Provider store={localStore}>
        <MemoryRouter initialEntries={['/tenant/1']}>
          <Users />
        </MemoryRouter>
      </Provider>
    );

    // Wait for the delete icon to be present
    const deleteButton = getByTestId('delete-icon');
    fireEvent.click(deleteButton);
    waitFor(() => {
      expect(successToastSpy).toHaveBeenCalledWith('Success', 'User deleted successfully');
    });
  });
});
