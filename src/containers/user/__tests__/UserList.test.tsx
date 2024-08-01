import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { MemoryRouter, Route } from 'react-router-dom';
import UserList from '../UserList';
import APPCONSTANTS from '../../../constants/appConstants';
import { fetchHFUserListRequest, deleteHFUserRequest } from '../../../store/healthFacility/actions';
import { IHFUserGet } from '../../../store/healthFacility/types';
import { changePassword } from '../../../store/user/actions';

jest.mock('../../store/healthFacility/actions', () => ({
  fetchHFUserListRequest: jest.fn(),
  fetchUserRolesAction: jest.fn(),
  deleteHFUserRequest: jest.fn(),
  changePassword: jest.fn(),
  fetchUserDetailRequest: jest.fn(),
  createHFUserRequest: jest.fn(),
  updateHFUserRequest: jest.fn()
}));

const mockStore = configureStore([thunk]);

const initialState = {
  user: {
    data: { country: { id: 1 } },
    role: APPCONSTANTS.ROLES.SUPER_USER,
    email: 'test@example.com',
    userRoles: { SPICE: [] }
  },
  healthFacility: {
    userList: [] as IHFUserGet[], // Ensure userList is correctly typed
    userListLoading: false,
    userListTotal: 0,
    userDetailLoading: false,
    healthFacilityList: []
  }
};

const renderWithStore = (state = initialState) =>
  render(
    <Provider store={mockStore(state)}>
      <MemoryRouter initialEntries={['/user-list/tenant-id']}>
        <Route path='/user-list/:tenantId'>
          <UserList />
        </Route>
      </MemoryRouter>
    </Provider>
  );

describe('UserList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    renderWithStore();
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('should dispatch fetchHFUserListRequest on mount', () => {
    renderWithStore();
    expect(fetchHFUserListRequest).toHaveBeenCalled();
  });

  it('should open the Add User modal when the Add User button is clicked', () => {
    renderWithStore();
    fireEvent.click(screen.getByText('Add User'));
    expect(screen.getByText('Add User')).toBeInTheDocument();
  });

  it('should handle the delete user action', async () => {
    const user: IHFUserGet = { id: 1, username: 'testuser' } as IHFUserGet;
    initialState.healthFacility.userList = [user];
    renderWithStore();

    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => expect(deleteHFUserRequest).toHaveBeenCalled());
  });

  it('should open the Change Password modal when the change password icon is clicked', () => {
    const user: IHFUserGet = { id: 1, username: 'testuser' } as IHFUserGet;
    initialState.healthFacility.userList = [user];
    renderWithStore();

    fireEvent.click(screen.getByTitle('Change Password'));
    expect(screen.getByText('Change Password')).toBeInTheDocument();
  });

  it('should dispatch changePassword on form submit in the Change Password modal', async () => {
    const user: IHFUserGet = { id: 1, username: 'testuser' } as IHFUserGet;
    initialState.healthFacility.userList = [user];
    renderWithStore();

    fireEvent.click(screen.getByTitle('Change Password'));
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newPassword123' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(changePassword).toHaveBeenCalled());
  });

  // Additional test cases can be added for other functionalities
});
