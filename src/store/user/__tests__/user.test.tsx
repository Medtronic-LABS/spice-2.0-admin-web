import { fetchLoggedInUser, fetchUserRoles, login, logout, updateRememberMe } from '../sagas';
import { runSaga } from 'redux-saga';
import * as userService from '../../../services/userAPI';
import CryptoJS from 'crypto-js';
import * as ACTION_TYPES from '../actionTypes';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/userDataConstants';
import { AxiosResponse } from 'axios';
import * as loginActions from '../actions';
import { encryptData } from '../../../utils/commonUtils';
import localStorageServices from '../../../global/localStorageServices';
import APPCONSTANTS from '../../../constants/appConstants';

const loginRequestMockData = MOCK_DATA_CONSTANTS.MOCK_LOGIN_REQUEST;
const loggedInUserMockData = MOCK_DATA_CONSTANTS.LOGGED_IN_USER_DATA;
const token = MOCK_DATA_CONSTANTS.MOCK_TOKEN;
const userTenantID = MOCK_DATA_CONSTANTS.MOCK_USER_TENANT_ID;
const loginSuccessResponseMockData = MOCK_DATA_CONSTANTS.MOCK_USER;
const {
  firstName,
  lastName,
  tenantId,
  organizations,
  id,
  username: email,
  country,
  roles,
  suiteAccess
} = loggedInUserMockData.data.entity;
const userRoles = MOCK_DATA_CONSTANTS.USER_ROLES_RESPONSE_PAYLOAD;

describe('User Login', () => {
  it('Adds user tenant id and encrypted token to store and logs in successfully', async () => {
    const { username, password } = loginRequestMockData;
    const hmac = CryptoJS.HmacSHA512(password, process.env.REACT_APP_PASSWORD_HASH_KEY as string);
    const hashedPassword = hmac.toString(CryptoJS.enc.Hex);
    const loginUserSpy = jest.spyOn(userService, 'login').mockImplementation(() => {
      return Promise.resolve({
        headers: { authorization: token, Tenantid: userTenantID }
      } as AxiosResponse);
    });
    const fetchLoggedInUserSpy = jest.spyOn(userService, 'fetchLoggedInUser').mockImplementation(() => {
      return Promise.resolve(loggedInUserMockData as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      login,
      {
        ...loginRequestMockData,
        type: ACTION_TYPES.LOGIN_REQUEST
      }
    ).toPromise();

    const encryptedToken = encryptData(token);
    expect(loginUserSpy).toHaveBeenCalledWith(username, hashedPassword);
    expect(fetchLoggedInUserSpy).toHaveBeenCalled();
    expect(dispatched).toEqual([
      loginActions.addUserTenantID(userTenantID),
      loginActions.addToken(encryptedToken),
      loginActions.loginSuccess(loginSuccessResponseMockData as any)
    ]);
  });

  it('Login failure', async () => {
    const { username, password } = loginRequestMockData;
    const hmac = CryptoJS.HmacSHA512(password, process.env.REACT_APP_PASSWORD_HASH_KEY as string);
    const hashedPassword = hmac.toString(CryptoJS.enc.Hex);
    const loginUserSpy = jest.spyOn(userService, 'login').mockImplementation(() => {
      return Promise.reject(new Error('Login failed'));
    });
    const error = `Login failed`;
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      login,
      {
        ...loginRequestMockData,
        type: ACTION_TYPES.LOGIN_REQUEST
      }
    ).toPromise();
    expect(loginUserSpy).toHaveBeenCalledWith(username, hashedPassword);
    expect(dispatched).toEqual([
      loginActions.resetStore(),
      loginActions.removeToken(),
      loginActions.loginFailure({ error })
    ]);
    expect(loginUserSpy).toHaveBeenCalledTimes(2);
  });
});

// Mock encryptData function
jest.mock('../../../utils/commonUtils', () => ({
  // Mock encryption function to return the same password
  encryptData: jest.fn((password) => password)
}));

describe('updateRememberMe function', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear all mock function calls after each test
  });

  it('should set items in local storage when rememberMe is true', () => {
    const username = 'testuser';
    const password = 'testpassword';
    const rememberMe = true;

    const setItemsSpy = jest.spyOn(localStorageServices, 'setItems');
    const deleteItemsSpy = jest.spyOn(localStorageServices, 'deleteItems');

    updateRememberMe(username, password, rememberMe);

    expect(setItemsSpy).toHaveBeenCalledWith([
      { key: APPCONSTANTS.USERNAME, value: username },
      { key: APPCONSTANTS.PASSWORD, value: password },
      { key: APPCONSTANTS.REMEMBER_ME, value: rememberMe }
    ]);
    expect(deleteItemsSpy).not.toHaveBeenCalled(); // Ensure deleteItems is not called
  });

  it('should delete items from local storage when rememberMe is false', () => {
    const rememberMe = false;

    const deleteItemsSpy = jest.spyOn(localStorageServices, 'deleteItems');

    updateRememberMe('testuser', 'testpassword', rememberMe);

    expect(deleteItemsSpy).toHaveBeenCalledWith([
      APPCONSTANTS.USERNAME,
      APPCONSTANTS.PASSWORD,
      APPCONSTANTS.REMEMBER_ME
    ]);
    expect(localStorageServices.setItems).not.toHaveBeenCalled(); // Ensure setItems is not called
  });

  it('should handle errors gracefully', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');
    const error = new Error('Test error');
    jest.spyOn(localStorageServices, 'setItems').mockImplementation(() => {
      throw error;
    });

    updateRememberMe('testuser', 'testpassword', true);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error occured', error);
  });
});

describe('User Logout', () => {
  it('Fails to logout user', async () => {
    const logoutSpy = jest.spyOn(userService, 'logout').mockImplementation((): any => {
      return Promise.resolve();
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      logout
    ).toPromise();
    expect(logoutSpy).toHaveBeenCalled();
    expect(dispatched).toEqual([loginActions.resetStore(), loginActions.removeToken(), loginActions.logoutSuccess()]);
  });

  it('Fails to logout user', async () => {
    const logoutSpy = jest.spyOn(userService, 'logout').mockImplementation(() => {
      return Promise.reject();
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      logout
    ).toPromise();
    expect(logoutSpy).toHaveBeenCalled();
    expect(dispatched).toEqual([
      loginActions.removeToken(),
      loginActions.removeUserTenantID(),
      loginActions.logoutFailure()
    ]);
  });
});

describe('Fetch Logged in user', () => {
  it('Fetches details of the user who is logged in', async () => {
    const fetchLoggedInUserSpy = jest.spyOn(userService, 'fetchLoggedInUser').mockImplementation(() => {
      return Promise.resolve({
        data: {
          entity: {
            username: email,
            firstName,
            lastName,
            id,
            roles,
            suiteAccess,
            tenantId,
            country,
            organizations
          }
        }
      } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchLoggedInUser
    ).toPromise();
    expect(fetchLoggedInUserSpy).toHaveBeenCalledWith();
    const payload = {
      email,
      firstName,
      lastName,
      userId: id,
      role: roles[0].name,
      roleDetail: roles[0],
      suiteAccess,
      tenantId,
      formDataId: organizations[0]?.formDataId,
      country
    };
    expect(dispatched).toEqual([loginActions.fetchLoggedInUserSuccess(payload as any)]);
  });

  it('Fetch Logged in user failure', async () => {
    const fetchLoggedInUserSpy = jest.spyOn(userService, 'fetchLoggedInUser').mockImplementation(() => {
      return Promise.reject(new Error('Error'));
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchLoggedInUser
    ).toPromise();
    expect(fetchLoggedInUserSpy).toHaveBeenCalledWith();
    expect(dispatched).toEqual([
      loginActions.removeToken(),
      loginActions.resetStore(),
      loginActions.fetchLoggedInUserFail()
    ]);
  });
});

describe('Other User related Sagas', () => {
  it('Fetches the user roles', async () => {
    const fetchUSerRoles = jest.spyOn(userService, 'fetchUserRoles').mockImplementation(() => {
      return Promise.resolve(userRoles as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchUserRoles,
      {
        type: ACTION_TYPES.FETCH_USER_ROLES_REQUEST
      }
    ).toPromise();
    expect(fetchUSerRoles).toHaveBeenCalledWith();
    expect(dispatched).toEqual([loginActions.fetchUserRolesActionSuccess(userRoles.data.entity)]);
  });

  it('Fetch user roles failure', async () => {
    const fetchUSerRoles = jest.spyOn(userService, 'fetchUserRoles').mockImplementation(() => {
      return Promise.reject(new Error('Error'));
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchUserRoles,
      {
        ...loginRequestMockData,
        type: ACTION_TYPES.FETCH_USER_ROLES_REQUEST
      }
    ).toPromise();
    expect(fetchUSerRoles).toHaveBeenCalledWith();
    expect(dispatched).toEqual([loginActions.fetchUserRolesActionFail()]);
  });
});
