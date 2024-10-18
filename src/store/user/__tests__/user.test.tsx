import {
  changePassword,
  fetchCommunityListRequest,
  fetchLockedUsers,
  fetchLoggedInUser,
  fetchTimezoneList,
  fetchUserById,
  fetchUserRoles,
  getUsername,
  login,
  logout,
  resetPassword,
  unlockUsers,
  updatePassword,
  updateRememberMe,
  updateUser,
  userForgotPassword
} from '../sagas';
import { runSaga } from 'redux-saga';
import * as userService from '../../../services/userAPI';
import CryptoJS from 'crypto-js';
import * as ACTION_TYPES from '../actionTypes';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/userDataConstants';
import { AxiosResponse } from 'axios';
import * as loginActions from '../actions';
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
const fetchUserByIdRequestMockData = MOCK_DATA_CONSTANTS.FETCH_USER_BY_ID_REQUEST;
const fetchUserByIdResponseMockData = MOCK_DATA_CONSTANTS.FETCH_USER_RESPONSE_PAYLOAD;
const updateUserRequestMockData = MOCK_DATA_CONSTANTS.UPDATE_USER_REQUEST_PAYLOAD;
const changePasswordRequestMockData = MOCK_DATA_CONSTANTS.CHANGE_PASSWORD_REQUEST_MOCK_DATA;
const updatePasswordRequestMockData = MOCK_DATA_CONSTANTS.UPDATE_PASSWORD_REQUEST_MOCK_DATA;
const resetPasswordRequestMockData = MOCK_DATA_CONSTANTS.RESET_PASSWORD_REQUEST_MOCK_DATA;
const getUsernameRequestMockData = MOCK_DATA_CONSTANTS.GET_USERNAME_REQUEST_MOCK_DATA;
const getUsernameResponseMockData = MOCK_DATA_CONSTANTS.GET_USERNAME_RESPONSE_MOCK_DATA;
const fetchLockedUsersResponseMockData = [MOCK_DATA_CONSTANTS.FETCH_LOCKED_USERS_RESPONSE_PAYLOAD];
const fetchLockedUsersRequestMockData = MOCK_DATA_CONSTANTS.FETCH_LOCKED_USERS_REQUEST;
const fetchTimezoneListResponseMockData = [MOCK_DATA_CONSTANTS.FETCH_TIMEZONE_RESPONSE_PAYLOAD];
const communityUnitResponse = MOCK_DATA_CONSTANTS.COMMUNITY_UNIT_RESPONSE;
const unlockUserRequestMockData = MOCK_DATA_CONSTANTS.UNLOCK_USER_REQUEST_PAYLOAD;

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

describe('User Login', () => {
  it('Adds user tenant id and encrypted token to store and logs in successfully', async () => {
    const { username, password } = loginRequestMockData;
    const hmac = CryptoJS.HmacSHA512(password, 'spice_uat');
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
            tenantId,
            country,
            organizations,
            suiteAccess
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
      tenantId,
      formDataId: organizations[0]?.formDataId,
      country,
      suiteAccess,
      countryId: undefined,
      organizations
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

describe('Other User related Sagas', () => {
  it('Fetches the user roles for super user', async () => {
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
      })
    ]);
  });

  it('Fetches the user roles for region admin', async () => {
    jest.spyOn(userService, 'fetchUserRoles').mockImplementation(() => {
      return Promise.resolve(userRoles as AxiosResponse);
    });

    const dispatched: any = [];

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          user: {
            user: {
              role: 'REGION_ADMIN'
            }
          }
        })
      },
      fetchUserRoles,
      { countryId: 1, type: ACTION_TYPES.FETCH_USER_ROLES_REQUEST }
    ).toPromise();
    expect(userService.fetchUserRoles).toHaveBeenCalledWith(1);
    expect(dispatched).toEqual([
      loginActions.fetchUserRolesActionSuccess({
        ...userRoles.data.entity
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
});

describe('Fetch User by id', () => {
  it('Fetches single user by id', async () => {
    const fetchUserByIdSpy = jest.spyOn(userService, 'fetchUserById').mockImplementation(() => {
      return Promise.resolve({ data: { entity: fetchUserByIdResponseMockData } } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchUserById,
      { payload: fetchUserByIdRequestMockData, type: ACTION_TYPES.FETCH_USER_BY_ID_REQUEST }
    ).toPromise();
    expect(fetchUserByIdSpy).toHaveBeenCalledWith(fetchUserByIdRequestMockData);
    expect(dispatched).toEqual([loginActions.fetchUserByIdSuccess(fetchUserByIdResponseMockData)]);
  });

  it('Fails to fetch user by id', async () => {
    const error = new Error('Failed to fetch user');
    const failureCb = jest.fn();
    const fetchUserByIdSpy = jest.spyOn(userService, 'fetchUserById').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchUserById,
      { payload: fetchUserByIdRequestMockData, type: ACTION_TYPES.FETCH_USER_BY_ID_REQUEST, failureCb }
    ).toPromise();
    expect(fetchUserByIdSpy).toHaveBeenCalledWith(fetchUserByIdRequestMockData);
    expect(failureCb).toHaveBeenCalled();
    expect(dispatched).toEqual([loginActions.fetchUserByIdFailure()]);
  });
});

describe('Update User', () => {
  it('Update a single user', async () => {
    const updateUserSpy = jest.spyOn(userService, 'updateUser').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateUser,
      {
        payload: updateUserRequestMockData,
        type: ACTION_TYPES.UPDATE_USER_REQUEST
      }
    ).toPromise();
    expect(updateUserSpy).toHaveBeenCalledWith(updateUserRequestMockData);
    expect(dispatched).toEqual([loginActions.updateUserSuccess()]);
  });

  it('Fails to update user', async () => {
    const error = new Error('Failed to update user');
    const updateUserSpy = jest.spyOn(userService, 'updateUser').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateUser,
      {
        payload: updateUserRequestMockData,
        type: ACTION_TYPES.UPDATE_USER_REQUEST
      }
    ).toPromise();
    expect(updateUserSpy).toHaveBeenCalledWith(updateUserRequestMockData);
    expect(dispatched).toEqual([loginActions.updateUserFailure()]);
  });
});

describe('Change Password', () => {
  const successCB = jest.fn();
  const failureCb = jest.fn();
  it('Change Password executed Successfully', async () => {
    const { userId, password } = changePasswordRequestMockData;
    const changePasswordSpy = jest.spyOn(userService, 'changePasswordReq').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      changePassword,
      { data: { ...changePasswordRequestMockData, successCB, failureCb }, type: ACTION_TYPES.CHANGE_PASSWORD_REQUEST }
    ).toPromise();
    expect(changePasswordSpy).toHaveBeenCalledWith({ userId, newPassword: password });
    expect(dispatched).toEqual([loginActions.changePasswordSuccess()]);
  });

  it('Failed to execute Change Password', async () => {
    const error = new Error('Change Password failed');
    const { userId, password } = changePasswordRequestMockData;
    const changePasswordSpy = jest.spyOn(userService, 'changePasswordReq').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      changePassword,
      { data: { ...changePasswordRequestMockData, successCB, failureCb }, type: ACTION_TYPES.CHANGE_PASSWORD_REQUEST }
    ).toPromise();
    expect(changePasswordSpy).toHaveBeenCalledWith({ userId, newPassword: password });
    expect(failureCb).toHaveBeenCalled();
    expect(dispatched).toEqual([loginActions.changePasswordFail(error)]);
  });
});
describe('Update Password', () => {
  const successCB = jest.fn();
  const failureCb = jest.fn();
  it('Update Password executed Successfully', async () => {
    const { userId, oldPassword, newPassword } = updatePasswordRequestMockData;
    const updatePasswordSpy = jest.spyOn(userService, 'updatePassword').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updatePassword,
      {
        data: { ...updatePasswordRequestMockData, successCB, failureCb },
        type: ACTION_TYPES.CHANGE_OWN_PASSWORD_REQUEST
      }
    ).toPromise();
    expect(updatePasswordSpy).toHaveBeenCalledWith({
      userId,
      oldPassword,
      newPassword
    });
    expect(dispatched).toEqual([loginActions.changeOwnPasswordSuccess()]);
  });

  it('Failed to execute update Password', async () => {
    const error = new Error('update Password failed');
    const { userId, oldPassword, newPassword } = updatePasswordRequestMockData;
    const updatePasswordSpy = jest.spyOn(userService, 'updatePassword').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updatePassword,
      {
        data: { ...updatePasswordRequestMockData, successCB, failureCb },
        type: ACTION_TYPES.CHANGE_OWN_PASSWORD_REQUEST
      }
    ).toPromise();
    expect(updatePasswordSpy).toHaveBeenCalledWith({
      userId,
      oldPassword,
      newPassword
    });
    expect(failureCb).toHaveBeenCalled();
    expect(dispatched).toEqual([loginActions.changeOwnPasswordFail(error)]);
  });
});
describe('Forgot Password', () => {
  const forgotPasswordRequestMockData = {
    email: MOCK_DATA_CONSTANTS.MOCK_LOGIN_REQUEST.username
  };
  const successCB = jest.fn();
  it('Forgot password email sent', async () => {
    const forgotPasswordSpy = jest.spyOn(userService, 'forgotPassword').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      userForgotPassword,
      { ...forgotPasswordRequestMockData, successCB }
    ).toPromise();
    expect(forgotPasswordSpy).toHaveBeenCalledWith(forgotPasswordRequestMockData.email);
    expect(successCB).toHaveBeenCalled();
    expect(dispatched).toEqual([loginActions.forgotPasswordSuccess()]);
  });

  it('Failed to send forgot password email', async () => {
    const error = new Error('Failed to send forgot password email');
    const forgotPasswordSpy = jest.spyOn(userService, 'forgotPassword').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      userForgotPassword,
      forgotPasswordRequestMockData
    ).toPromise();
    expect(forgotPasswordSpy).toHaveBeenCalledWith(forgotPasswordRequestMockData.email);
    expect(dispatched).toEqual([loginActions.forgotPasswordFail(error)]);
  });
});
describe('Reset Password', () => {
  it('Reset Password executed Successfully', async () => {
    const { email: requestEmail, password, token: requestToken } = resetPasswordRequestMockData;
    const resetPasswordSpy = jest.spyOn(userService, 'resetPasswordReq').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      resetPassword,
      { data: resetPasswordRequestMockData, type: ACTION_TYPES.RESET_PASSWORD_REQUEST }
    ).toPromise();
    expect(resetPasswordSpy).toHaveBeenCalledWith({ email: requestEmail, password }, requestToken);
    expect(dispatched).toEqual([loginActions.resetPasswordSuccess()]);
  });

  it('Failed to execute Reset Password', async () => {
    const { email: requestEmail, password, token: requestToken } = resetPasswordRequestMockData;
    const error = new Error('Reset Password failed');
    const resetPasswordSpy = jest.spyOn(userService, 'resetPasswordReq').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      resetPassword,
      { data: resetPasswordRequestMockData, type: ACTION_TYPES.RESET_PASSWORD_REQUEST }
    ).toPromise();
    expect(resetPasswordSpy).toHaveBeenCalledWith({ email: requestEmail, password }, requestToken);
    expect(dispatched).toEqual([loginActions.resetPasswordFail(error)]);
  });
});
describe('Get Username', () => {
  const successCB = jest.fn();
  it('Get username executed Successfully', async () => {
    const { token: requestToken } = getUsernameRequestMockData;
    const getUsernameSpy = jest.spyOn(userService, 'getUsername').mockImplementation(() => {
      return Promise.resolve({ data: { entity: getUsernameResponseMockData } } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      getUsername,
      { token, type: ACTION_TYPES.GET_USERNAME_FOR_PASSWORD_RESET, successCB }
    ).toPromise();
    expect(getUsernameSpy).toHaveBeenCalledWith(requestToken);
    expect(successCB).toHaveBeenCalled();
    expect(dispatched).toEqual([loginActions.getUserNameSuccess()]);
  });

  it('Failed to get username', async () => {
    const error = new Error('Failed to get username');
    const failureCB = jest.fn();
    const { token: requestToken } = getUsernameRequestMockData;
    const getUsernameSpy = jest.spyOn(userService, 'getUsername').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      getUsername,
      { token, type: ACTION_TYPES.GET_USERNAME_FOR_PASSWORD_RESET, failureCB }
    ).toPromise();
    expect(getUsernameSpy).toHaveBeenCalledWith(requestToken);
    expect(failureCB).toHaveBeenCalled();
    expect(dispatched).toEqual([loginActions.getUserNameFail(error)]);
  });
});
describe('Fetch Locked users', () => {
  const successCb = jest.fn();
  const failureCb = jest.fn();
  it('Fetches a list of locked users', async () => {
    const fetchLockedUsersListSpy = jest.spyOn(userService, 'fetchLockedUsers').mockImplementation(() => {
      return Promise.resolve({
        data: { entityList: fetchLockedUsersResponseMockData, totalCount: 10 }
      } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchLockedUsers,
      { ...fetchLockedUsersRequestMockData, successCb, type: ACTION_TYPES.FETCH_LOCKED_USERS_REQUEST }
    ).toPromise();
    expect(fetchLockedUsersListSpy).toHaveBeenCalledWith('2', 0, null, 'Sample', undefined);
    expect(successCb).toHaveBeenCalledWith(fetchLockedUsersResponseMockData);
    expect(dispatched).toEqual([
      loginActions.fetchLockedUsersSuccess({ lockedUsers: fetchLockedUsersResponseMockData, totalCount: 10 })
    ]);
  });

  it('Failed to fetch list of locked users', async () => {
    const error = new Error('Failed to fetch locked users list');
    const fetchLockedUsersListSpy = jest.spyOn(userService, 'fetchLockedUsers').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchLockedUsers,
      { ...fetchLockedUsersRequestMockData, failureCb, type: ACTION_TYPES.FETCH_LOCKED_USERS_REQUEST }
    ).toPromise();
    expect(fetchLockedUsersListSpy).toHaveBeenCalledWith('2', 0, null, 'Sample', undefined);
    expect(failureCb).toHaveBeenCalled();
    expect(dispatched).toEqual([loginActions.fetchLockedUsersFailure()]);
  });
});
describe('Fetch Timezone List', () => {
  it('Fetches list of timezones Successfully', async () => {
    const fetchTimezoneListSpy = jest.spyOn(userService, 'fetchTimezoneList').mockImplementation(() => {
      return Promise.resolve({ data: fetchTimezoneListResponseMockData } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchTimezoneList
    ).toPromise();
    expect(fetchTimezoneListSpy).toHaveBeenCalled();
    expect(dispatched).toEqual([loginActions.fetchTimezoneListSuccess(fetchTimezoneListResponseMockData)]);
  });

  it('Fails to fetch list of timezones', async () => {
    const fetchTimezoneListSpy = jest.spyOn(userService, 'fetchTimezoneList').mockImplementation(() => {
      return Promise.reject();
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchTimezoneList
    ).toPromise();
    expect(fetchTimezoneListSpy).toHaveBeenCalled();
    expect(dispatched).toEqual([loginActions.fetchTimezoneListFailure()]);
  });
});
describe('Fetch Community List', () => {
  const successCB = jest.fn();
  const failureCB = jest.fn();
  it('Fetches list of community list dispatch success', async () => {
    const fetchCommunityListSpy = jest.spyOn(userService, 'fetchCommunityListRequest').mockImplementation(() => {
      return Promise.resolve({ data: communityUnitResponse } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchCommunityListRequest,
      {
        type: ACTION_TYPES.FETCH_COMMUNITY_LIST_REQUEST,
        countryId: 1,
        successCB
      }
    ).toPromise();
    expect(fetchCommunityListSpy).toHaveBeenCalled();
    expect(successCB).toHaveBeenCalledWith(communityUnitResponse);
    expect(dispatched).toEqual([loginActions.fetchCommunityListSuccess(communityUnitResponse)]);
  });

  it('Fetches list of community list dispatch failure', async () => {
    const error = new Error('Failed to fetch community list');
    const fetchCommunityListSpy = jest.spyOn(userService, 'fetchCommunityListRequest').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchCommunityListRequest,
      {
        type: ACTION_TYPES.FETCH_COMMUNITY_LIST_REQUEST,
        countryId: 1,
        failureCB
      }
    ).toPromise();
    expect(fetchCommunityListSpy).toHaveBeenCalled();
    expect(failureCB).toHaveBeenCalledWith(error);
    expect(dispatched).toEqual([loginActions.fetchCommunityListFailure()]);
  });
});
describe('Unlock a user', () => {
  const successCb = jest.fn();
  const failureCb = jest.fn();
  it('Unlocks a user dispatch success', async () => {
    const unlockUsersListSpy = jest.spyOn(userService, 'unlockUsers').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      unlockUsers,
      { ...unlockUserRequestMockData, successCb, type: ACTION_TYPES.UNLOCK_USERS_REQUEST }
    ).toPromise();
    expect(unlockUsersListSpy).toHaveBeenCalledWith(unlockUserRequestMockData.userId);
    expect(successCb).toHaveBeenCalled();
    expect(dispatched).toEqual([loginActions.unlockUsersSuccess()]);
  });

  it('Fails to unlock user dispatch failure', async () => {
    const error = new Error('Failed to unlock user');
    const unlockUsersListSpy = jest.spyOn(userService, 'unlockUsers').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      unlockUsers,
      { ...unlockUserRequestMockData, failureCb, type: ACTION_TYPES.UNLOCK_USERS_REQUEST }
    ).toPromise();
    expect(unlockUsersListSpy).toHaveBeenCalledWith(unlockUserRequestMockData.userId);
    expect(failureCb).toHaveBeenCalled();
    expect(dispatched).toEqual([loginActions.unlockUsersFailure()]);
  });
});
