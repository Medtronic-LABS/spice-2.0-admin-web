import { act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UserList from '../UserList';
import { userDataSelector, roleSelector, emailSelector } from '../../../store/user/selectors';
import * as selectors from '../../../store/healthFacility/selectors';
import { createMemoryHistory } from 'history';
import {
  deleteHFUserRequest,
  fetchUserDetailRequest,
  
} from '../../../store/healthFacility/actions';
import { MemoryRouter, Route } from 'react-router';
import { Store, AnyAction } from 'redux';


const mockStore = configureStore([]);
jest.mock('../../../store/healthFacility/actions', () => ({
  // ...jest.requireActual('../../../store/healthFacility/actions'),
  fetchHealthFacilityUserListRequest: jest.fn(),
  fetchUserDetailRequest: jest.fn((params) => ({ type: 'FETCH_USER_DETAIL_REQUEST', ...params })),
  fetchHFUserListRequest: jest.fn(),
  clearSupervisorList: jest.fn(),
  clearVillageHFList: jest.fn(),
  createHFUserRequest: jest.fn(),
  deleteHFUserRequest: jest.fn(),
  updateHFUserRequest: jest.fn(),
  validateLinkedRestrictionsRequest: jest.fn(),
  updateHFDetailsRequest: jest.fn()
}));
const history = createMemoryHistory();
const location = {
  pathname: '/users/1',
  search: '',
  hash: '',
  state: null
};
// Mock the hooks used in the UserList component
jest.mock('../../../hooks/tablePagination', () => ({
  useTablePaginationHook: () => ({
    listParams: {},
    handleSearch: jest.fn(),
    handlePage: jest.fn()
  })
}));

// Mock the actions

jest.mock('../../../components/customTable/CustomTable', () => ({
  __esModule: true,
  default: (props: { rowData: any[]; onRowEdit: (arg0: any) => void }) => (
    <table>
      <tbody>
        {props.rowData.map((item) => (
          <tr key={item.id} data-testid={`user-row-${item.id}`}>
            <td data-testid={`user-name-${item.id}`}>{item.name}</td>
            <td>{item.role}</td>
            <td>
              <button onClick={() => props.onRowEdit(item)}>Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}));

// Mock useDispatch and useSelector
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
  useSelector: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    tenantId: '1'
  }),
  useNavigate: () => jest.fn()
}));

jest.mock('../../../components/userForm/UserForm', () => {
  return {
    __esModule: true,
    default: () => <div data-testid='mocked-user-form'>Mocked User Form</div>
  };
});

jest.mock('../../../store/healthFacility/selectors', () => ({
  ...jest.requireActual('../../../store/healthFacility/selectors'),
  peerSupervisorListSelector: jest.fn(),
  villagesListSelector: jest.fn(),
  countryListSelector: jest.fn(),
  countryLoadingSelector: jest.fn()
}));

const mockedSelectors = selectors as jest.Mocked<typeof selectors>;

describe('UserList Component', () => {
  let store: Store<any, AnyAction>;
  const mockVillagesList = { list: [] };
  const initialState = {
    user: {
      userData: {
        country: { id: 1, name: 'Test User' }
      },
      role: 'admin',
      email: 'test@example.com',
      healthFacilityUserList: [
        { id: 1, name: 'CHW User', role: 'CHW' },
        { id: 2, name: 'Other User', role: 'Admin' }
      ]
    }
  };
  store = mockStore(initialState);
  beforeEach(() => {
    // Reset all mocks before each test
    // Set up mock return values for selectors
    mockedSelectors.peerSupervisorListSelector.mockReturnValue({
      list: [],
      hfTenantIds: null
    });
    mockedSelectors.villagesListSelector.mockReturnValue(mockVillagesList.list);
    mockedSelectors.countryListSelector.mockReturnValue([]);
    mockedSelectors.countryLoadingSelector.mockReturnValue(false);
    jest.clearAllMocks();
  });

  it('renders UserList component', () => {
    // Mock the useSelector calls
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector: any) => {
      if (selector === userDataSelector) return initialState.user.userData;
      if (selector === roleSelector) return initialState.user.role;
      if (selector === emailSelector) return initialState.user.email;
      if (selector === selectors.healthFacilityUserListSelector) return initialState.user.healthFacilityUserList;
    });
    const history = createMemoryHistory();
    const location = {
      pathname: '/users/1',
      search: '',
      hash: '',
      state: null
    };

    render(
      <Provider store={store}>
        <UserList
          match={{
            params: { tenantId: '1' },
            isExact: true,
            path: '/users/:tenantId',
            url: '/users/1'
          }}
          history={history}
          location={location}
        />
      </Provider>
    );

    // Add your assertions here
    // For example:
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('Add user correctly', async () => {
    const initialState = {
      user: {
        userData: {
          country: { id: 1, name: 'Test Country' }
        },
        role: 'admin',
        email: 'test@example.com',
        healthFacilityUserList: [{ id: 1, name: 'Test User', email: 'test@example.com', organizations: [{ id: '1' }] }]
      }
    };
    const store = mockStore(initialState);

    const mockDispatch = jest.fn();
    jest.spyOn(store, 'dispatch').mockImplementation(mockDispatch);

    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector: any) => {
      if (selector === userDataSelector) return initialState.user.userData;
      if (selector === roleSelector) return initialState.user.role;
      if (selector === emailSelector) return initialState.user.email;
      if (selector === selectors.healthFacilityUserListSelector) return initialState.user.healthFacilityUserList;
    });

    render(
      <Provider store={store}>
        <UserList
          match={{
            params: { tenantId: '1' },
            isExact: true,
            path: '/users/:tenantId',
            url: '/users/1'
          }}
          history={createMemoryHistory()}
          location={{
            pathname: '/users/1',
            search: '',
            hash: '',
            state: null
          }}
        />
      </Provider>
    );

    // Wait for the component to render and check if the user is in the list
    await waitFor(() => {
      expect(screen.getByText('Users')).toBeInTheDocument();
    });

    expect(screen.getByText('Users')).toBeInTheDocument();

    // Check if the table is present
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Check if "No records found" is displayed when there are no users
    // expect(screen.getByText('No records found')).toBeInTheDocument();

    // Find the "Add User" button
    const addUserButton = screen.getByRole('button', { name: /Add User/i });
    expect(addUserButton).toBeInTheDocument();
  });

  it('h user deletion correctly', () => {
    const mockDispatch = jest.fn();

    // Override the useDispatch implementation for this test
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);

    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector: any) => {
      if (selector === userDataSelector) return initialState.user.userData;
      if (selector === roleSelector) return initialState.user.role;
      if (selector === emailSelector) return initialState.user.email;
      if (selector === selectors.healthFacilityUserListSelector) return initialState.user.healthFacilityUserList;
    });
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/users/1']}>
          <Route path='/users/:tenantId'>
            {(routeProps) => routeProps.match && <UserList {...routeProps} match={routeProps.match} />}
          </Route>
        </MemoryRouter>
      </Provider>
    );
    let handleUserDeleteFromProps: any;
    // Extract handleUserDelete from the mocked component's props
    const mockCalls = (UserList as jest.Mock).mock.calls;
    if (mockCalls.length > 0) {
      handleUserDeleteFromProps = mockCalls[0][0].handleUserDelete;
    }
    // Ensure handleUserDelete is a function before calling it
    if (typeof handleUserDeleteFromProps === 'function') {
      act(() => {
        handleUserDeleteFromProps({ data: { id: 1, organizations: [{ id: '1' }] } });
      });

      // Assert that dispatch was called with the correct action
      expect(mockDispatch).toHaveBeenCalledWith(
        deleteHFUserRequest({
          data: {
            id: 1,
            tenantIds: [1]
          },
          successCb: expect.any(Function),
          failureCb: expect.any(Function)
        })
      );
    } else {
      throw new Error('handleUserDelete is not a function in the component props');
    }
  });

  it('handles opening edit modal for CHW user correctly', async () => {
    const mockUserList = [
      { id: 1, name: 'CHW User', roles: [{ name: 'CHW' }] },
      { id: 2, name: 'Admin User', roles: [{ name: 'Admin' }] }
    ];

    const mockDispatch: any = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(mockDispatch);
      }
      return action;
    });
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);

    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector: any) => {
      if (selector === userDataSelector) return { country: { id: 1 } };
      if (selector === roleSelector) return 'admin';
      if (selector === emailSelector) return 'test@example.com';
      if (selector === selectors.healthFacilityUserListSelector) return mockUserList;
      if (selector === selectors.healthFacilityUsersLoadingSelector) return false;
      if (selector === selectors.healthFacilityListUsersTotalSelector) return mockUserList.length;
      if (selector === selectors.userDetailLoadingSelector) return false;
      return null;
    });

    const { getByTestId} = render(
      <Provider store={mockStore({})}>
        <UserList
          match={{
            params: { tenantId: '1' },
            isExact: true,
            path: '',
            url: ''
          }}
          location={location}
          history={history}
        />
      </Provider>
    );
    // Find and click the edit button for the CHW user
    const editButtonCHW = getByTestId('user-row-1').querySelector('button');
    expect(editButtonCHW).not.toBeNull();
    if (editButtonCHW) {
      fireEvent.click(editButtonCHW);
    }
    expect(fetchUserDetailRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        successCb: expect.any(Function),
        failureCb: expect.any(Function)
      })
    );
    const fetchUserDetailRequestCall = mockDispatch.mock.calls.find((call: { type: string }[]) => {
      return call[0] && call[0].type === 'FETCH_USER_DETAIL_REQUEST';
    });

    if (fetchUserDetailRequestCall) {
      expect(fetchUserDetailRequestCall[0]).toMatchObject({
        type: 'FETCH_USER_DETAIL_REQUEST',
        id: 1
      });
    }
    const mockUserData = {
      id: '123',
      name: 'John Doe',
      email: 'john.doe@example.com'
      // Add other relevant user fields here
    };
    const successCallback = mockDispatch.mock.calls[1][0].successCb;
    act(() => {
      successCallback(mockUserData);
    });
    

    // }
  });

});
