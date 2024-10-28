import {
  fetchLoggedInUser,
  fetchUserRoles,
  login,
  logout,
  updateRememberMe,
  getUsername,
  resetPassword,
  userForgotPassword,
  updatePassword,
  changePassword,
  updateUser,
  fetchUserById
} from '../sagas';
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
    expect(dispatched).toEqual([loginActions.resetStore(), loginActions.loginFailure({ error })]);
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
    expect(dispatched).toEqual([loginActions.resetStore(), loginActions.logoutSuccess()]);
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
    expect(dispatched).toEqual([loginActions.removeUserTenantID(), loginActions.logoutFailure()]);
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
    expect(dispatched).toEqual([loginActions.resetStore(), loginActions.fetchLoggedInUserFail()]);
  });
});

// Mock the selector function used in the saga
const mockState = {
  user: {
    user: {
      role: 'SUPER_USER'
    }
  }
};
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockImplementation((selector) => selector(mockState))
}));

describe('Other User related Sagas', () => {
  it('Fetches the user roles', async () => {
    jest.spyOn(userService, 'fetchUserRoles').mockImplementation(() => {
      return Promise.resolve(userRoles as AxiosResponse);
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => mockState
      },
      fetchUserRoles,
      { countryId: 1, type: ACTION_TYPES.FETCH_USER_ROLES_REQUEST }
    ).toPromise();

    expect(userService.fetchUserRoles).toHaveBeenCalledWith(1);
    expect(dispatched).toEqual([
      loginActions.fetchUserRolesActionSuccess({
        ...userRoles.data.entity
        // SPICE: [{ id: '',name: 'SUPER_USER' }, { name: 'SUPER_ADMIN' }]
      })
    ]);
  });

  it('Fetch user roles failure', async () => {
    jest.spyOn(userService, 'fetchUserRoles').mockImplementation(() => {
      return Promise.reject(new Error('Error'));
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => mockState
      },
      fetchUserRoles,
      { countryId: 1, type: ACTION_TYPES.FETCH_USER_ROLES_REQUEST }
    ).toPromise();

    expect(userService.fetchUserRoles).toHaveBeenCalledWith(1);
    expect(dispatched).toEqual([loginActions.fetchUserRolesActionFail()]);
  });

  it('getUsername success', async () => {
    jest.spyOn(userService, 'getUsername').mockImplementation(() => {
      return Promise.resolve({} as any);
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => mockState
      },
      getUsername,
      { token: '1', type: ACTION_TYPES.GET_USERNAME_FOR_PASSWORD_RESET }
    ).toPromise();

    expect(userService.getUsername).toHaveBeenCalledWith('1');
    expect(dispatched).toEqual([loginActions.getUserNameSuccess()]);
  });
  it('getUsername fails', async () => {
    jest.spyOn(userService, 'getUsername').mockImplementation(() => {
      return Promise.reject(new Error('Error'));
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => mockState
      },
      getUsername,
      { token: '1', type: ACTION_TYPES.GET_USERNAME_FOR_PASSWORD_RESET }
    ).toPromise();

    expect(userService.getUsername).toHaveBeenCalledWith('1');
    expect(dispatched).toEqual([loginActions.getUserNameFail(new Error('Error'))]);
  });

  it('resetPassword fails', async () => {
    jest.spyOn(userService, 'resetPasswordReq').mockImplementation(() => {
      return Promise.reject(new Error('Error'));
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => mockState
      },
      resetPassword,
      { data: { email: 'email', password: 'pass', token: '1' }, type: ACTION_TYPES.GET_USERNAME_FOR_PASSWORD_RESET }
    ).toPromise();

    expect(userService.resetPasswordReq).toHaveBeenCalledWith({ email: 'email', password: 'pass' }, '1');
    expect(dispatched).toEqual([loginActions.resetPasswordFail(new Error('Error'))]);
  });

  it('resetPassword success', async () => {
    jest.spyOn(userService, 'resetPasswordReq').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => mockState
      },
      resetPassword,
      {
        data: { email: 'email', password: 'pass', token: '1', successCB: jest.fn() },
        type: ACTION_TYPES.GET_USERNAME_FOR_PASSWORD_RESET
      }
    ).toPromise();

    expect(userService.resetPasswordReq).toHaveBeenCalledWith({ email: 'email', password: 'pass' }, '1');
    expect(dispatched).toEqual([loginActions.resetPasswordSuccess()]);
  });

  it('userForgotPassword fails', async () => {
    jest.spyOn(userService, 'forgotPassword').mockImplementation(() => {
      return Promise.reject(new Error('Error'));
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => mockState
      },
      userForgotPassword,
      { email: 'email', successCB: jest.fn(), type: ACTION_TYPES.USER_FORGOT_PASSWORD_REQUEST }
    ).toPromise();

    expect(userService.forgotPassword).toHaveBeenCalledWith('email');
    expect(dispatched).toEqual([loginActions.forgotPasswordFail(new Error('Error'))]);
  });

  it('userForgotPassword Success', async () => {
    jest.spyOn(userService, 'forgotPassword').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => mockState
      },
      userForgotPassword,
      { email: 'email', successCB: jest.fn(), type: ACTION_TYPES.USER_FORGOT_PASSWORD_REQUEST }
    ).toPromise();

    expect(userService.forgotPassword).toHaveBeenCalledWith('email');
    expect(dispatched).toEqual([loginActions.forgotPasswordSuccess()]);
  });

  it('update Password success', async () => {
    jest.spyOn(userService, 'updatePassword').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => mockState
      },
      updatePassword,
      {
        data: { userId: '1', oldPassword: 'pass', newPassword: 'pass', successCB: jest.fn(), failureCb: jest.fn() },
        type: ACTION_TYPES.CHANGE_OWN_PASSWORD_REQUEST
      }
    ).toPromise();

    expect(userService.updatePassword).toHaveBeenCalledWith({ userId: '1', oldPassword: 'pass', newPassword: 'pass' });
    expect(dispatched).toEqual([loginActions.changeOwnPasswordSuccess()]);
  });

  it('update Password Fail', async () => {
    const e = new Error('Error');
    jest.spyOn(userService, 'updatePassword').mockImplementation(() => {
      return Promise.reject(e);
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => mockState
      },
      updatePassword,
      {
        data: { userId: '1', oldPassword: 'pass', newPassword: 'pass', successCB: jest.fn(), failureCb: jest.fn() },
        type: ACTION_TYPES.CHANGE_OWN_PASSWORD_REQUEST
      }
    ).toPromise();

    expect(userService.updatePassword).toHaveBeenCalledWith({ userId: '1', oldPassword: 'pass', newPassword: 'pass' });
    expect(dispatched).toEqual([loginActions.changeOwnPasswordFail(e)]);
  });

  it('change Password success', async () => {
    jest.spyOn(userService, 'changePasswordReq').mockImplementation(() => {
      return Promise.resolve({ data: { userId: 1, newPassword: 'pass' } } as AxiosResponse);
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => mockState
      },
      changePassword,
      {
        data: { userId: '1', password: 'pass', successCB: jest.fn(), failureCb: jest.fn() },
        type: ACTION_TYPES.CHANGE_PASSWORD_REQUEST
      }
    ).toPromise();

    expect(userService.changePasswordReq).toHaveBeenCalledWith({ userId: '1', newPassword: 'pass' });
    expect(dispatched).toEqual([loginActions.changePasswordSuccess()]);
  });

  it('change Password Fail', async () => {
    const e = new Error('Error');
    jest.spyOn(userService, 'changePasswordReq').mockImplementation(() => {
      return Promise.reject(e);
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => mockState
      },
      changePassword,
      {
        data: { userId: '1', password: 'pass', successCB: jest.fn(), failureCb: jest.fn() },
        type: ACTION_TYPES.CHANGE_PASSWORD_REQUEST
      }
    ).toPromise();

    expect(userService.changePasswordReq).toHaveBeenCalledWith({ userId: '1', newPassword: 'pass' });
    expect(dispatched).toEqual([loginActions.changePasswordFail(e)]);
  });

  it('updateUser success', async () => {
    jest.spyOn(userService, 'updateUser').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => mockState
      },
      updateUser,
      {
        payload: {
          id: '1',
          firstName: 'first',
          lastName: 'second',
          gender: 'male',
          phoneNumber: '87878787',
          countryCode: '91'
        },
        type: ACTION_TYPES.UPDATE_USER_REQUEST
      }
    ).toPromise();

    expect(userService.updateUser).toHaveBeenCalledWith({
      id: '1',
      firstName: 'first',
      lastName: 'second',
      gender: 'male',
      phoneNumber: '87878787',
      countryCode: '91'
    });
    expect(dispatched).toEqual([loginActions.updateUserSuccess()]);
  });

  it('updateUser Fail', async () => {
    const e = new Error('Error');
    jest.spyOn(userService, 'updateUser').mockImplementation(() => {
      return Promise.reject(e);
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => mockState
      },
      updateUser,
      {
        payload: {
          id: '1',
          firstName: 'first',
          lastName: 'second',
          gender: 'male',
          phoneNumber: '87878787',
          countryCode: '91'
        },
        type: ACTION_TYPES.UPDATE_USER_REQUEST
      }
    ).toPromise();

    expect(userService.updateUser).toHaveBeenCalledWith({
      id: '1',
      firstName: 'first',
      lastName: 'second',
      gender: 'male',
      phoneNumber: '87878787',
      countryCode: '91'
    });
    expect(dispatched).toEqual([loginActions.updateUserFailure()]);
  });

  it('fetchUserById success', async () => {
    jest.spyOn(userService, 'fetchUserById').mockImplementation(() => {
      return Promise.resolve({
        data: {
          entity: {
            userId: '1',
            email: 'email',
            firstName: 'firstName',
            lastName: 'lastName',
            // role: 'any',
            roleDetail: 'any',
            tenantId: '1',
            country: 'chennai',
            suiteAccess: ['SUPER_USER']
          }
        }
      } as AxiosResponse);
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => mockState
      },
      fetchUserById,
      {
        payload: {
          id: '1'
        },
        type: ACTION_TYPES.FETCH_USER_BY_ID_REQUEST
      }
    ).toPromise();

    expect(userService.fetchUserById).toHaveBeenCalledWith({
      id: '1'
    });
    expect(dispatched).toEqual([
      loginActions.fetchUserByIdSuccess({
        userId: '1',
        email: 'email',
        firstName: 'firstName',
        lastName: 'lastName',
        roleDetail: 'any',
        tenantId: '1',
        country: 'chennai',
        suiteAccess: ['SUPER_USER']
      })
    ]);
  });

  it('fetchUserById Failure', async () => {
    jest.spyOn(userService, 'fetchUserById').mockImplementation(() => {
      return Promise.reject(new Error('Error'));
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => mockState
      },
      fetchUserById,
      {
        payload: {
          id: '1'
        },
        type: ACTION_TYPES.FETCH_USER_BY_ID_REQUEST
      }
    ).toPromise();

    expect(userService.fetchUserById).toHaveBeenCalledWith({
      id: '1'
    });
    expect(dispatched).toEqual([loginActions.fetchUserByIdFailure()]);
  });
});
