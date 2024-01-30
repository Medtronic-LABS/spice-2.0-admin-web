import { fetchLoggedInUser, login, logout } from '../sagas';
import { runSaga } from 'redux-saga';
import * as userService from '../../../services/userAPI';
import CryptoJS from 'crypto-js';
import * as ACTION_TYPES from '../actionTypes';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/userDataConstants';
import { AxiosResponse } from 'axios';
import * as loginActions from '../actions';
import { encryptData } from '../../../utils/commonUtils';

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
// const forgotPasswordRequestMockData = { email: MOCK_DATA_CONSTANTS.MOCK_LOGIN_REQUEST.username,
// successCB: () => null };
// const resetPasswordRequestMockData = MOCK_DATA_CONSTANTS.RESET_PASSWORD_REQUEST_MOCK_DATA;
// const changePasswordRequestMockData = MOCK_DATA_CONSTANTS.CHANGE_PASSWORD_REQUEST_MOCK_DATA;
// const updatePasswordRequestMockData = MOCK_DATA_CONSTANTS.UPDATE_PASSWORD_REQUEST_MOCK_DATA;
// const getUsernameResponseMockData = MOCK_DATA_CONSTANTS.GET_USERNAME_RESPONSE_MOCK_DATA;
// const getUsernameRequestMockData = MOCK_DATA_CONSTANTS.GET_USERNAME_REQUEST_MOCK_DATA;
// const createPasswordRequestMockData = MOCK_DATA_CONSTANTS.CREATE_PASSWORD_REQUEST_MOCK_DATA;
// const fetchTimezoneListResponseMockData = [MOCK_DATA_CONSTANTS.FETCH_TIMEZONE_RESPONSE_PAYLOAD];
// const fetchUserByIdRequestMockData = MOCK_DATA_CONSTANTS.FETCH_USER_BY_ID_REQUEST;
// const fetchUserByIdResponseMockData = MOCK_DATA_CONSTANTS.FETCH_USER_RESPONSE_PAYLOAD;
// const fetchUserByIdRawResponseMockData = MOCK_DATA_CONSTANTS.FETCH_USER_BACKEND_RESPONSE;
// const fetchUserByEmailRequestMockData = MOCK_DATA_CONSTANTS.FETCH_USER_BY_EMAIL_REQUEST;
// const updateUserRequestMockData = MOCK_DATA_CONSTANTS.UPDATE_USER_REQUEST_PAYLOAD;
// const fetchCountryListResponseMockData = [MOCK_DATA_CONSTANTS.FETCH_COUNTRY_PAYLOAD];
// const fetchLockedUsersRequestMockData = MOCK_DATA_CONSTANTS.FETCH_LOCKED_USERS_REQUEST;
// const fetchLockedUsersResponseMockData = [MOCK_DATA_CONSTANTS.FETCH_LOCKED_USERS_RESPONSE_PAYLOAD];
// const unlockUserRequestMockData = MOCK_DATA_CONSTANTS.UNLOCK_USER_REQUEST_PAYLOAD;
// const fetchCultureListResponseMockData = MOCK_DATA_CONSTANTS.FETCH_CULTURE_LIST_RESPONSE_PAYLOAD;

describe('User Login', () => {
  it('Adds user tenant id and encrypted token to store and logs in successfully', async () => {
    const { username, password } = loginRequestMockData;
    const hmac = CryptoJS.HmacSHA512(password, 'spice_uat');
    const hashedPassword = hmac.toString(CryptoJS.enc.Hex);
    const loginUserSpy = jest.spyOn(userService, 'login').mockImplementation(() => {
      return Promise.resolve({
        headers: { authorization: token, tenantId: userTenantID }
      } as AxiosResponse);
    });
    const fetchLoggedInUserSpy = jest.spyOn(userService, 'fetchLoggedInUser').mockImplementation(() => {
      return Promise.resolve({
        data: {
          entity: {
            username: email,
            firstName,
            lastName,
            id,
            role: roles?.[0]?.name,
            tenantId,
            country,
            suiteAccess,
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
      loginActions.addToken(encryptedToken),
      loginActions.addUserTenantID(userTenantID),
      loginActions.loginSuccess(loginSuccessResponseMockData as any)
    ]);
    expect(loginUserSpy).toHaveBeenCalledTimes(1);
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
