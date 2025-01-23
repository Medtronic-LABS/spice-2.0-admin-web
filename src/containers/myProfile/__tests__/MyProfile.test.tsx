import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import createSagaMiddleware from 'redux-saga';
import MyProfile from '../MyProfile';
import APPCONSTANTS from '../../../constants/appConstants';
import {
  FETCH_CULTURE_LIST_REQUEST,
  FETCH_USER_BY_ID_REQUEST,
  UPDATE_USER_REQUEST
} from '../../../store/user/actionTypes';
import toastCenter from '../../../utils/toastCenter';
import { HF_SUMMARY } from '../../../tests/mockData/healthFacilityConstants';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/chiefdomDataConstants';
import '@testing-library/jest-dom/extend-expect';
import { getAdminPayload } from '../../../utils/formatObjectUtils';
const { ROLES } = APPCONSTANTS;

const MockUserForm = jest.fn(() => <div data-testid='user-form'>User Form</div>);

jest.mock('../../../components/modal/ModalForm', () =>
  jest.fn(({ show, handleCancel, handleFormSubmit }) =>
    show ? (
      <div data-testid='modal-form'>
        <button onClick={handleCancel}>Cancel</button>
        <button onClick={handleFormSubmit}>Submit</button>
        <MockUserForm />
      </div>
    ) : null
  )
);

jest.mock('../../../components/userForm/UserForm', () => jest.fn(() => <div data-testid='user-form'>User Form</div>));

jest.mock('../../../components/loader/Loader', () => () => <div data-testid='loader' />);

jest.mock('../../../utils/toastCenter', () => ({
  success: jest.fn(),
  error: jest.fn()
}));

jest.mock('../../../utils/commonUtils', () => ({
  getAdminPayload: jest.fn()
}));

const sagaMiddleware = createSagaMiddleware();

const mockStore = configureStore([sagaMiddleware]);

const { FETCH_CHIEFDOM_LIST_RESPONSE_PAYLOAD } = MOCK_DATA_CONSTANTS;

const initialState = {
  user: {
    user: {
      role: ROLES.SUPER_ADMIN,
      userId: '123',
      cultureList: [
        {
          id: 1,
          createdBy: 1,
          updatedBy: 1,
          createdAt: '2024-07-30T11:01:22+05:30',
          updatedAt: '2024-07-30T11:01:22+05:30',
          name: 'English - India',
          code: 'en_IN',
          active: true
        }
      ]
    }
  },
  healthFacility: {
    healthFacility: [HF_SUMMARY]
  },
  chiefdom: {
    chiefdomList: [FETCH_CHIEFDOM_LIST_RESPONSE_PAYLOAD]
  },
  common: {
    labelName: {
      region: {
        s: 'Region',
        p: 'Regions'
      },
      healthFacility: {
        s: 'Health Facility',
        p: 'Health Facilities'
      },
      district: {
        s: 'County',
        p: 'Counties'
      },
      chiefdom: { s: 'Sub County', p: 'Sub Counties' }
    }
  }
};

jest.mock('../../../components/button/IconButton.svg', () => ({
  ReactComponent: 'IconButton'
}));

jest.mock('../../../utils/formatObjectUtils', () => ({
  __esModule: true,
  getAdminPayload: jest.fn()
}));

describe('MyProfile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render MyProfile component', () => {
    const store = mockStore(initialState);
    const { getByText, unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MyProfile />
        </BrowserRouter>
      </Provider>
    );
    expect(getByText('My Profile')).toBeInTheDocument();
    unmount();
  });

  it('should dispatch FETCH_USER_BY_ID_REQUEST action on mount', () => {
    const store = mockStore(initialState);

    const { unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MyProfile />
        </BrowserRouter>
      </Provider>
    );
    const actions = store.getActions();
    const fetchUserAction = actions.find((action) => action.type === FETCH_USER_BY_ID_REQUEST);
    expect(fetchUserAction).toBeTruthy();
    unmount();
  });

  it('should dispatch FETCH_CULTURE_LIST_REQUEST action on mount for HF admin', () => {
    const store = mockStore({
      ...initialState,
      user: {
        ...initialState.user,
        user: { ...initialState.user.user, role: ROLES.HEALTH_FACILITY_ADMIN },
        cultureList: []
      }
    });
    const { unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MyProfile />
        </BrowserRouter>
      </Provider>
    );
    const actions = store.getActions();
    const fetchCultureAction = actions.find((action) => action.type === FETCH_CULTURE_LIST_REQUEST);
    expect(fetchCultureAction).toBeTruthy();
    unmount();
  });

  it('should open edit modal when "Edit My Profile" button is clicked', async () => {
    const store = mockStore(initialState);

    const { getByText, unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MyProfile />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.click(getByText('Edit My Profile'));

    expect(getByText('Cancel')).toBeInTheDocument();
    expect(getByText('Submit')).toBeInTheDocument();
    unmount();
  });

  it('should close modal when cancel is clicked', async () => {
    const store = mockStore(initialState);

    const { getByText, queryByText, unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MyProfile />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.click(getByText('Edit My Profile'));

    fireEvent.click(getByText('Cancel'));

    await waitFor(() => {
      expect(queryByText('Submit')).not.toBeInTheDocument();
    });
    unmount();
  });

  it('should show error toast when fetchUserByIdReq fails', async () => {
    const store = mockStore(initialState);

    const { unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MyProfile />
        </BrowserRouter>
      </Provider>
    );

    const actions = store.getActions();
    const fetchUserAction = actions.find((action) => action.type === FETCH_USER_BY_ID_REQUEST);
    fetchUserAction.failureCb();

    await waitFor(() => {
      expect(toastCenter.error).toHaveBeenCalledWith(APPCONSTANTS.OOPS, APPCONSTANTS.PROFILE_DETAIL_ERROR);
    });
    unmount();
  });
  it('should set user details when fetchUserByIdReq is successful', async () => {
    const store = mockStore(initialState);

    const mockUserDetails = {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      roles: [{ name: ROLES.SUPER_ADMIN, displayName: 'Super Admin' }]
    };

    const useStateSpy = jest.spyOn(React, 'useState');
    const setUserDetailsMock = jest.fn();
    useStateSpy.mockImplementation(() => [undefined, setUserDetailsMock]);

    const { unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MyProfile />
        </BrowserRouter>
      </Provider>
    );

    const actions = store.getActions();
    const fetchUserAction = actions.find((action) => action.type === FETCH_USER_BY_ID_REQUEST);

    fetchUserAction.successCb(mockUserDetails);

    await waitFor(() => {
      expect(setUserDetailsMock).toHaveBeenCalledWith(mockUserDetails);
    });

    useStateSpy.mockRestore();
    unmount();
  });

  it('should set user details when fetchUserByIdReq is successful with multiple roles', async () => {
    const store = mockStore(initialState);

    const mockUserDetails = {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      roles: [
        { name: ROLES.HEALTH_FACILITY_ADMIN, displayName: 'Health Facility Admin' },
        { name: 'CHW', displayName: 'CHW' }
      ],
      countryCode: '91',
      phoneNumber: '1234567890'
    };

    const useStateSpy = jest.spyOn(React, 'useState');
    const setUserDetailsMock = jest.fn();
    useStateSpy.mockImplementation(() => [useStateSpy, setUserDetailsMock]);

    const { unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MyProfile />
        </BrowserRouter>
      </Provider>
    );

    const actions = store.getActions();
    const fetchUserAction = actions.find((action) => action.type === FETCH_USER_BY_ID_REQUEST);

    fetchUserAction.successCb(mockUserDetails);

    await waitFor(() => {
      expect(setUserDetailsMock).toHaveBeenCalledWith(mockUserDetails);
    });

    useStateSpy.mockRestore();
    unmount();
  });

  it('should dispatch updateUserRequest when handleEdit is called', async () => {
    const store = mockStore(initialState);

    const mockPayload = [{ id: '123', firstName: 'John', lastName: 'Doe' }];

    (getAdminPayload as jest.Mock).mockReturnValue([mockPayload]);

    const { getByText, unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MyProfile />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.click(getByText('Edit My Profile'));

    fireEvent.click(getByText('Submit'));

    expect(getAdminPayload).toHaveBeenCalled();

    await waitFor(() => {
      const action = store.getActions();
      const updateUserAct = action.find((act) => act.type === UPDATE_USER_REQUEST);
      expect(updateUserAct).toBeTruthy();
      expect(updateUserAct.payload).toEqual(mockPayload);
      expect(updateUserAct.successCb).toBeDefined();
      expect(updateUserAct.failureCb).toBeDefined();
    });

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    const actions = store.getActions();
    const updateUserAction = actions.find((action) => action.type === UPDATE_USER_REQUEST);
    updateUserAction.successCb();

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      expect(screen.queryByText('Submit')).not.toBeInTheDocument();
      expect(toastCenter.success).toHaveBeenCalledWith(APPCONSTANTS.SUCCESS, APPCONSTANTS.USER_DETAILS_UPDATE_SUCCESS);
    });

    const fetchUserAction = actions.find((action) => action.type === FETCH_USER_BY_ID_REQUEST);
    expect(fetchUserAction).toBeTruthy();

    updateUserAction.failureCb();

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      expect(toastCenter.error).toHaveBeenCalledWith(APPCONSTANTS.ERROR, APPCONSTANTS.USER_DETAILS_UPDATE_ERROR);
    });
    unmount();
  });

  test('should set user details on success', async () => {
    const store = mockStore(initialState);
    const { getByText, unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MyProfile />
        </BrowserRouter>
      </Provider>
    );

    const mockUserDetails = {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      roles: [
        { id: 9, groupName: 'SPICE', name: 'SUPER_ADMIN', suiteAccessName: 'web', displayName: 'Super Admin' },
        {
          id: 17,
          groupName: 'SPICE INSIGHTS',
          displayName: 'Quicksight Spice Admin',
          name: 'CFR_QUICKSIGHT_SPICE_ADMIN',
          suiteAccessName: 'cfr_quicksight_admin'
        },
        { id: 3, groupName: 'SPICE', suiteAccessName: 'mob', name: 'CHW', displayName: 'CHW' }
      ],
      countryCode: {
        phoneNumberCode: '+11'
      }
    };
    const actions = store.getActions();
    const mockGetUserType = actions.find((action) => action.type === FETCH_USER_BY_ID_REQUEST);
    mockGetUserType.successCb(mockUserDetails);
    mockGetUserType.failureCb({ message: 'error' });

    const successCbSpy = jest.spyOn(mockGetUserType, 'successCb');
    const failureCbSpy = jest.spyOn(mockGetUserType, 'failureCb');
    waitFor(() => {
      expect(successCbSpy).toHaveBeenCalled();
      expect(failureCbSpy).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(getByText('John Doe')).toBeInTheDocument();
    });
    unmount();
  });

  test('should set user details on success for CHW', async () => {
    const store = mockStore(initialState);
    const { getByText, unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MyProfile />
        </BrowserRouter>
      </Provider>
    );

    const mockUserDetails = {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      roles: [{ id: 3, groupName: 'SPICE', suiteAccessName: 'mob', name: 'CHW', displayName: 'CHW' }],
      villages: [{ id: 1, name: 'Village 1' }],
      supervisor: {
        firstName: 'Jane',
        lastName: 'Smith'
      },
      countryCode: {
        phoneNumberCode: '+11'
      }
    };
    const actions = store.getActions();
    const mockGetUserType = actions.find((action) => action.type === FETCH_USER_BY_ID_REQUEST);
    mockGetUserType.successCb(mockUserDetails);
    mockGetUserType.failureCb({ message: 'error' });

    const successCbSpy = jest.spyOn(mockGetUserType, 'successCb');
    const failureCbSpy = jest.spyOn(mockGetUserType, 'failureCb');
    waitFor(() => {
      expect(successCbSpy).toHaveBeenCalled();
      expect(failureCbSpy).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(getByText('John Doe')).toBeInTheDocument();
      expect(getByText('Village 1')).toBeInTheDocument();
    });
    unmount();
  });

  test('should Handle empty roles', async () => {
    const store = mockStore(initialState);
    const { getByText, unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MyProfile />
        </BrowserRouter>
      </Provider>
    );

    const mockUserDetails = {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      villages: [{ id: 1, name: 'Village 1' }],
      supervisor: {
        firstName: 'Jane',
        lastName: 'Smith'
      },
      countryCode: {
        phoneNumberCode: '+11'
      },
      phoneNumber: '1234567890'
    };
    const actions = store.getActions();
    const mockGetUserType = actions.find((action) => action.type === FETCH_USER_BY_ID_REQUEST);
    mockGetUserType.successCb(mockUserDetails);
    mockGetUserType.failureCb({ message: 'error' });

    const successCbSpy = jest.spyOn(mockGetUserType, 'successCb');
    const failureCbSpy = jest.spyOn(mockGetUserType, 'failureCb');
    waitFor(() => {
      expect(successCbSpy).toHaveBeenCalled();
      expect(failureCbSpy).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(getByText('John Doe')).toBeInTheDocument();
    });
    unmount();
  });
});
