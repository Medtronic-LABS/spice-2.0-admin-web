import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import LockedUsers from '../LockedUsers';
import APPCONSTANTS from '../../../constants/appConstants';
import { FETCH_LOCKED_USERS_REQUEST, UNLOCK_USERS_REQUEST } from '../../../store/user/actionTypes';
const mockStore = configureStore([]);

const mockChildComponent = jest.fn();
jest.mock('../../../components/customTable/CustomTable', () => (props: any) => {
  mockChildComponent(props);
  return <div>child component</div>;
});

const { ROLES } = APPCONSTANTS;

describe('LockedUsers', () => {
  const mockLockedUsersList = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe@example.com'
    },
    {
      id: '2',
      username: 'janedoe@example.com'
    }
  ];
  const store = mockStore({
    user: {
      lockedUsers: mockLockedUsersList,
      totalLockedUsers: 1,
      user: {
        role: ROLES.REGION_ADMIN,
        tenantId: 1
      }
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the Locked Users header', () => {
    render(
      <Provider store={store}>
        <Router>
          <LockedUsers />
        </Router>
      </Provider>
    );
    expect(screen.getByText('Locked Users')).toBeInTheDocument();
  });

  it('should call fetchDetails functions for region admin', async () => {
    render(
      <Provider store={store}>
        <Router>
          <LockedUsers />
        </Router>
      </Provider>
    );
    const actions = store.getActions();
    const mockFetchDetailsType = actions.find((action) => action.type === FETCH_LOCKED_USERS_REQUEST);
    mockFetchDetailsType.failureCb({ message: 'error' });
    const failureCbSpy = jest.spyOn(mockFetchDetailsType, 'failureCb');
    waitFor(() => {
      expect(failureCbSpy).toHaveBeenCalled();
    });
  });

  it('should call fetchDetails functions for super admin', async () => {
    const mockstore = mockStore({
      user: {
        lockedUsers: mockLockedUsersList,
        totalLockedUsers: 1,
        user: { role: ROLES.SUPER_ADMIN }
      }
    });
    render(
      <Provider store={mockstore}>
        <Router>
          <LockedUsers />
        </Router>
      </Provider>
    );
    const actions = store.getActions();
    const mockFetchDetailsType = actions.find((action) => action.type === FETCH_LOCKED_USERS_REQUEST);
    mockFetchDetailsType.failureCb({ message: 'error' });
    const failureCbSpy = jest.spyOn(mockFetchDetailsType, 'failureCb');
    waitFor(() => {
      expect(failureCbSpy).toHaveBeenCalled();
    });
  });

  it('should call fetchDetails functions for super user', async () => {
    const stores = mockStore({
      user: {
        lockedUsers: mockLockedUsersList,
        totalLockedUsers: 1,
        user: { role: ROLES.SUPER_USER }
      }
    });
    render(
      <Provider store={stores}>
        <Router>
          <LockedUsers />
        </Router>
      </Provider>
    );
    const actions = store.getActions();
    const mockFetchDetailsType = actions.find((action) => action.type === FETCH_LOCKED_USERS_REQUEST);
    mockFetchDetailsType.failureCb({ message: 'error' });
    const failureCbSpy = jest.spyOn(mockFetchDetailsType, 'failureCb');
    waitFor(() => {
      expect(failureCbSpy).toHaveBeenCalled();
    });
  });

  it('Should handle onCustomConfirmed', () => {
    render(
      <Provider store={store}>
        <Router>
          <LockedUsers />
        </Router>
      </Provider>
    );
    // Access the props passed to the mock component
    const mockLockedUsers: any = mockChildComponent.mock.calls[0][0];
    mockLockedUsers.onCustomConfirmed({ id: 1 });

    waitFor(() => {
      expect(mockLockedUsers.onCustomConfirmed).toHaveBeenCalledWith({ id: 1 });
    });
    const actions = store.getActions();
    const mockUnLockUsersType = actions.find((action) => action.type === UNLOCK_USERS_REQUEST);
    mockUnLockUsersType.successCb('Success', 'User unlocked successfully');
    mockUnLockUsersType.failureCb({ message: 'error' });

    const successCbSpy = jest.spyOn(mockUnLockUsersType, 'successCb');
    const failureCbSpy = jest.spyOn(mockUnLockUsersType, 'failureCb');
    waitFor(() => {
      expect(successCbSpy).toHaveBeenCalled();
      expect(failureCbSpy).toHaveBeenCalled();
    });
  });

  it('should render cellFormatter', () => {
    render(
      <Provider store={store}>
        <Router>
          <LockedUsers />
        </Router>
      </Provider>
    );
    // Access the props passed to the mock component
    const mockLockedUsers: any = mockChildComponent.mock.calls[0][0];
    const tableUpdated = mockLockedUsers.columnsDef[0];
    tableUpdated.cellFormatter({ firstName: '', lastName: '' });
  });

  it('should unmount without errors', () => {
    const { unmount } = render(
      <Provider store={store}>
        <Router>
          <LockedUsers />
        </Router>
      </Provider>
    );
    unmount();
    expect(screen.queryByText(/locked users/i)).not.toBeInTheDocument();
  });
});
