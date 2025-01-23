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
  fetchUserById,
  fetchLockedUsers,
  fetchTimezoneList,
  fetchCommunityListRequest,
  fetchDesignationListRequest,
  unlockUsers,
  fetchTermsConditionsSaga,
  updateTermsConditionsSaga
} from '../sagas';
import { runSaga } from 'redux-saga';
import * as userService from '../../../services/userAPI';
import CryptoJS from 'crypto-js';
import * as ACTION_TYPES from '../actionTypes';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/userDataConstants';
import { AxiosResponse } from 'axios';
import * as userActions from '../actions';
import * as commonActions from '../../common/actions';
import localStorageServices from '../../../global/localStorageServices';
import APPCONSTANTS from '../../../constants/appConstants';

jest.mock('crypto-js', () => ({
  HmacSHA512: () => 'hmac',
  enc: {
    Hex: () => 'hex'
  }
}));

// Mock encryptData function
jest.mock('../../../utils/commonUtils', () => ({
  encryptData: jest.fn((password) => password)
}));

// Mock the selector function used in the saga
const mockState = {
  user: {
    user: {
      role: 'SUPER_USER',
      appTypes: ['COMMUNITY']
    }
  }
};
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockImplementation((selector) => selector(mockState))
}));

let loginRequestMockData: any = MOCK_DATA_CONSTANTS.MOCK_LOGIN_REQUEST;
loginRequestMockData.password = loginRequestMockData.pass;
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

const appTypes = [APPCONSTANTS.appTypes.community];

const userRoles = MOCK_DATA_CONSTANTS.USER_ROLES_RESPONSE_PAYLOAD;

describe('User Saga', () => {
  // login
  describe('User Login', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it(`Adds user tenant id and encrypted token to store and
      logs in successfully with appTypes in outside country`, async () => {
      const { username, password } = loginRequestMockData;
      const hmac = CryptoJS.HmacSHA512(password, process.env.REACT_APP_PASSWORD_HASH_KEY as string);
      const hashedPassword = hmac.toString(CryptoJS.enc.Hex);
      const loginUserSpy = jest.spyOn(userService, 'login').mockImplementation(() => {
        return Promise.resolve({
          headers: { authorization: token, Tenantid: userTenantID },
          data: { isTermsAndConditionsAccepted: true }
        } as AxiosResponse);
      });
      const fetchLoggedInUserSpy = jest.spyOn(userService, 'fetchLoggedInUser').mockImplementation(() => {
        return Promise.resolve({
          data: { entity: { ...loggedInUserMockData.data.entity, appTypes } }
        } as AxiosResponse);
      });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        login,
        {
          ...loginRequestMockData,
          successCb: jest.fn(),
          failureCb: jest.fn(),
          type: ACTION_TYPES.LOGIN_REQUEST
        }
      ).toPromise();

      expect(loginUserSpy).toHaveBeenCalledWith(username, hashedPassword);
      expect(fetchLoggedInUserSpy).toHaveBeenCalled();
      expect(dispatched).toEqual([
        userActions.addUserTenantID(userTenantID),
        commonActions.setLabelName(country.displayValues as any),
        userActions.loginSuccess({ ...loginSuccessResponseMockData, appTypes } as any)
      ]);
    });

    it(`Adds user tenant id and encrypted token to store and
      logs in successfully with appTypes in inside country`, async () => {
      const { username, password } = loginRequestMockData;
      const hmac = CryptoJS.HmacSHA512(password, process.env.REACT_APP_PASSWORD_HASH_KEY as string);
      const hashedPassword = hmac.toString(CryptoJS.enc.Hex);
      const loginUserSpy = jest.spyOn(userService, 'login').mockImplementation(() => {
        return Promise.resolve({
          headers: { authorization: token, Tenantid: userTenantID },
          data: { isTermsAndConditionsAccepted: true }
        } as AxiosResponse);
      });
      const fetchLoggedInUserSpy = jest.spyOn(userService, 'fetchLoggedInUser').mockImplementation(() => {
        return Promise.resolve({
          data: { entity: { ...loggedInUserMockData.data.entity, country: { ...country, appTypes } } }
        } as AxiosResponse);
      });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
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
        userActions.addUserTenantID(userTenantID),
        commonActions.setLabelName(country.displayValues as any),
        userActions.loginSuccess({
          ...loginSuccessResponseMockData,
          appTypes: [APPCONSTANTS.appTypes.community],
          country: { ...country, appTypes }
        } as any)
      ]);
    });

    it(`Adds user tenant id and encrypted token to store and
      logs in successfully with appTypes in inside store`, async () => {
      const { username, password } = loginRequestMockData;
      const hmac = CryptoJS.HmacSHA512(password, process.env.REACT_APP_PASSWORD_HASH_KEY as string);
      const hashedPassword = hmac.toString(CryptoJS.enc.Hex);
      const loginUserSpy = jest.spyOn(userService, 'login').mockImplementation(() => {
        return Promise.resolve({
          headers: { authorization: token, Tenantid: userTenantID },
          data: { isTermsAndConditionsAccepted: true }
        } as AxiosResponse);
      });
      const fetchLoggedInUserSpy = jest.spyOn(userService, 'fetchLoggedInUser').mockImplementation(() => {
        return Promise.resolve(loggedInUserMockData as AxiosResponse);
      });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
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
        userActions.addUserTenantID(userTenantID),
        commonActions.setLabelName(country.displayValues as any),
        userActions.loginSuccess({
          ...loginSuccessResponseMockData,
          appTypes: [APPCONSTANTS.appTypes.community]
        } as any)
      ]);
    });

    it(`Adds user tenant id and encrypted token to store and
      logs in successfully without displayValues and admin suite access`, async () => {
      const { username, password } = loginRequestMockData;
      const hmac = CryptoJS.HmacSHA512(password, process.env.REACT_APP_PASSWORD_HASH_KEY as string);
      const hashedPassword = hmac.toString(CryptoJS.enc.Hex);
      const loginUserSpy = jest.spyOn(userService, 'login').mockImplementation(() => {
        return Promise.resolve({
          headers: { authorization: token, Tenantid: userTenantID },
          data: { isTermsAndConditionsAccepted: true }
        } as AxiosResponse);
      });
      const fetchLoggedInUserSpy = jest.spyOn(userService, 'fetchLoggedInUser').mockImplementation(() => {
        return Promise.resolve({
          ...loggedInUserMockData,
          data: {
            entity: {
              ...loggedInUserMockData.data.entity,
              country: { ...loggedInUserMockData.data.entity.country, displayValues: null },
              roles: [{ name: 'ADMIN', suiteAccessName: 'cfr' }]
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
        login,
        {
          ...loginRequestMockData,
          type: ACTION_TYPES.LOGIN_REQUEST
        }
      ).toPromise();

      expect(loginUserSpy).toHaveBeenCalledWith(username, hashedPassword);
      expect(fetchLoggedInUserSpy).toHaveBeenCalled();
      expect(dispatched).toEqual([
        userActions.addUserTenantID(userTenantID),
        userActions.loginSuccess({
          ...loginSuccessResponseMockData,
          role: 'ADMIN',
          roleDetail: { name: 'ADMIN', suiteAccessName: 'cfr' },
          country: { ...loggedInUserMockData.data.entity.country, displayValues: null },
          appTypes: [APPCONSTANTS.appTypes.community]
        } as any)
      ]);
    });

    it(`Adds user tenant id and encrypted token to store and
      logs in successfully without appTypes and roles`, async () => {
      const { username, password } = loginRequestMockData;
      const hmac = CryptoJS.HmacSHA512(password, process.env.REACT_APP_PASSWORD_HASH_KEY as string);
      const hashedPassword = hmac.toString(CryptoJS.enc.Hex);
      const loginUserSpy = jest.spyOn(userService, 'login').mockImplementation(() => {
        return Promise.resolve({
          headers: { authorization: token, Tenantid: userTenantID },
          data: { isTermsAndConditionsAccepted: true }
        } as AxiosResponse);
      });
      const fetchLoggedInUserSpy = jest.spyOn(userService, 'fetchLoggedInUser').mockImplementation(() => {
        return Promise.resolve({
          ...loggedInUserMockData,
          data: {
            entity: {
              ...loggedInUserMockData.data.entity,
              country: { ...loggedInUserMockData.data.entity.country },
              roles: [],
              appTypes: []
            }
          }
        } as AxiosResponse);
      });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({
            ...mockState,
            user: {
              ...mockState.user,
              appTypes: []
            }
          })
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
        userActions.addUserTenantID(userTenantID),
        commonActions.setLabelName(country.displayValues as any),
        userActions.loginSuccess({
          ...loginSuccessResponseMockData,
          appTypes: [],
          role: '',
          roleDetail: undefined
        } as any)
      ]);
    });

    it('Login failure with instance of error', async () => {
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
      expect(dispatched).toEqual([userActions.resetStore(), userActions.loginFailure({ error })]);
      expect(loginUserSpy).toHaveBeenCalledTimes(1);
    });

    it('Login failure without instance of error', async () => {
      const { username, password } = loginRequestMockData;
      const hmac = CryptoJS.HmacSHA512(password, process.env.REACT_APP_PASSWORD_HASH_KEY as string);
      const hashedPassword = hmac.toString(CryptoJS.enc.Hex);
      const loginUserSpy = jest.spyOn(userService, 'login').mockImplementation(() => {
        return Promise.reject('Login failed');
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
      expect(dispatched).not.toEqual([userActions.resetStore(), userActions.loginFailure({ error })]);
      expect(loginUserSpy).toHaveBeenCalledTimes(1);
    });
  });

  // updateRememberMe
  describe('updateRememberMe function', () => {
    afterEach(() => {
      jest.clearAllMocks();
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
      expect(deleteItemsSpy).not.toHaveBeenCalled();
    });

    it('should delete items from local storage when rememberMe is false', () => {
      const rememberMe = false;

      const deleteItemsSpy = jest.spyOn(localStorageServices, 'deleteItems');
      const setItemsSpy = jest.spyOn(localStorageServices, 'setItems');

      updateRememberMe('testuser', 'testpassword', rememberMe);

      expect(deleteItemsSpy).toHaveBeenCalledWith([
        APPCONSTANTS.USERNAME,
        APPCONSTANTS.PASSWORD,
        APPCONSTANTS.REMEMBER_ME
      ]);
      expect(setItemsSpy).not.toHaveBeenCalled();
    });

    it('should handle with instance of error', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error');
      const error = new Error('Test error');
      jest.spyOn(localStorageServices, 'setItems').mockImplementation(() => {
        throw error;
      });

      updateRememberMe('testuser', 'testpassword', true);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error occured', error);
    });
  });

  // logout
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
      expect(dispatched).toEqual([userActions.resetStore(), userActions.logoutSuccess()]);
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
      expect(dispatched).toEqual([userActions.removeUserTenantID(), userActions.logoutFailure()]);
    });
  });

  // fetchLoggedInUser
  describe('Fetch Logged in user', () => {
    it('Fetches details of the logged in user', async () => {
      const fetchLoggedInUserSpy = jest.spyOn(userService, 'fetchLoggedInUser').mockImplementation(() => {
        return Promise.resolve({
          data: {
            entity: {
              username: email,
              firstName,
              lastName,
              id,
              roles,
              appTypes,
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
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchLoggedInUser
      ).toPromise();
      expect(fetchLoggedInUserSpy).toHaveBeenCalledWith();
      expect(dispatched).toEqual([
        commonActions.setLabelName(country.displayValues as any),
        userActions.fetchLoggedInUserSuccess({
          email,
          firstName,
          lastName,
          userId: id,
          role: roles[0].name,
          roleDetail: roles[0],
          tenantId,
          formDataId: organizations[0]?.formDataId,
          appTypes,
          country,
          suiteAccess,
          countryId: undefined,
          organizations
        } as any)
      ]);
    });

    it('Fetch details of the logged in user with appTypes inside country', async () => {
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
              country: {
                ...country,
                appTypes
              },
              organizations,
              suiteAccess
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
        formDataId: organizations[0]?.formDataId,
        country: {
          appTypes,
          id: 1,
          name: 'Sierra Leone',
          phoneNumberCode: '+21',
          regionCode: '',
          tenantId: 1,
          unitMeasurement: null,
          displayValues: country.displayValues
        },
        suiteAccess,
        countryId: undefined,
        organizations,
        appTypes,
        tenantId: '1'
      };
      expect(dispatched).toEqual([
        commonActions.setLabelName(country.displayValues as any),
        userActions.fetchLoggedInUserSuccess(payload as any)
      ]);
    });

    it('Fetches details of the user who is logged in without tenantId and tenantId inside country', async () => {
      const fetchLoggedInUserSpy = jest.spyOn(userService, 'fetchLoggedInUser').mockImplementation(() => {
        return Promise.resolve({
          data: {
            entity: {
              username: email,
              firstName,
              lastName,
              id,
              roles,
              appTypes,
              country: {
                ...country,
                tenantId: undefined
              },
              organizations,
              suiteAccess
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
        tenantId: undefined,
        formDataId: organizations[0]?.formDataId,
        appTypes,
        country: {
          ...country,
          tenantId: undefined
        },
        suiteAccess,
        countryId: undefined,
        organizations
      };
      expect(dispatched).toEqual([
        commonActions.setLabelName(country.displayValues as any),
        userActions.fetchLoggedInUserSuccess(payload as any)
      ]);
    });

    it('Fetch details of the logged in user without country Id and displayValues', async () => {
      const fetchLoggedInUserSpy = jest.spyOn(userService, 'fetchLoggedInUser').mockImplementation(() => {
        return Promise.resolve({
          data: {
            entity: {
              username: email,
              firstName,
              lastName,
              id,
              roles: [{ name: 'ADMIN', suiteAccessName: 'cfr' }],
              tenantId,
              country: {
                ...country,
                appTypes: null,
                id: null,
                displayValues: null
              },
              organizations,
              suiteAccess
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
        fetchLoggedInUser
      ).toPromise();
      expect(fetchLoggedInUserSpy).toHaveBeenCalledWith();
      const payload = {
        email,
        firstName,
        lastName,
        userId: id,
        role: 'ADMIN',
        roleDetail: { name: 'ADMIN', suiteAccessName: 'cfr' },
        formDataId: organizations[0]?.formDataId,
        country: {
          appTypes: null,
          id: null,
          name: 'Sierra Leone',
          phoneNumberCode: '+21',
          regionCode: '',
          tenantId: 1,
          unitMeasurement: null,
          displayValues: null
        },
        suiteAccess,
        countryId: undefined,
        organizations,
        appTypes,
        tenantId: '1'
      };
      expect(dispatched).toEqual([userActions.fetchLoggedInUserSuccess(payload as any)]);
    });

    it('Fetch details of the logged in user without apptypes in store and roles in API response', async () => {
      const fetchLoggedInUserSpy = jest.spyOn(userService, 'fetchLoggedInUser').mockImplementation(() => {
        return Promise.resolve({
          data: {
            entity: {
              username: email,
              firstName,
              lastName,
              id,
              tenantId,
              roles: [{ suiteAccessName: 'cfr' }],
              country: {
                ...country,
                appTypes: null,
                id: null,
                displayValues: null
              },
              organizations,
              suiteAccess
            }
          }
        } as AxiosResponse);
      });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({
            ...mockState,
            user: {
              ...mockState.user,
              user: {
                ...mockState.user.user,
                appTypes: []
              }
            }
          })
        },
        fetchLoggedInUser
      ).toPromise();
      expect(fetchLoggedInUserSpy).toHaveBeenCalledWith();
      const payload = {
        email,
        firstName,
        lastName,
        userId: id,
        role: '',
        roleDetail: { suiteAccessName: 'cfr' },
        formDataId: organizations[0]?.formDataId,
        country: {
          appTypes: null,
          id: null,
          name: 'Sierra Leone',
          phoneNumberCode: '+21',
          regionCode: '',
          tenantId: 1,
          unitMeasurement: null,
          displayValues: null
        },
        suiteAccess,
        countryId: undefined,
        organizations,
        appTypes: [],
        tenantId: '1'
      };
      expect(dispatched).toEqual([userActions.fetchLoggedInUserSuccess(payload as any)]);
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
      expect(dispatched).toEqual([userActions.resetStore(), userActions.fetchLoggedInUserFail()]);
    });
  });

  // fetchUserRoles
  describe('Fetch user roles', () => {
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
        userActions.fetchUserRolesActionSuccess({
          ...userRoles.data.entity
        } as any)
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
                role: 'REGION_ADMIN',
                appTypes: ['COMMUNITY']
              }
            }
          })
        },
        fetchUserRoles,
        { countryId: 1, type: ACTION_TYPES.FETCH_USER_ROLES_REQUEST }
      ).toPromise();

      expect(userService.fetchUserRoles).toHaveBeenCalledWith(1);
      expect(dispatched).toEqual([
        userActions.fetchUserRolesActionSuccess({
          ...userRoles.data.entity,
          INSIGHTS: [
            {
              displayName: 'Insights Developer',
              groupName: 'INSIGHTS',
              id: 3,
              level: 1,
              name: 'SPICE_INSIGHTS_DEVELOPER',
              suiteAccessName: 'insights'
            }
          ],
          REPORTS: []
        } as any)
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
      expect(dispatched).toEqual([userActions.fetchUserRolesActionFail()]);
    });
  });

  // getUsername
  describe('Fetch getUsername', () => {
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
      expect(dispatched).toEqual([userActions.getUserNameSuccess()]);
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
      expect(dispatched).toEqual([userActions.getUserNameFail(new Error('Error'))]);
    });
  });

  // resetPassword
  describe('Reset Password', () => {
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
      expect(dispatched).toEqual([userActions.resetPasswordSuccess()]);
    });

    it('resetPassword fails without error', async () => {
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
      expect(dispatched).toEqual([userActions.resetPasswordFail(new Error('Error'))]);
    });

    it('resetPassword fails with instance of error', async () => {
      jest.spyOn(userService, 'resetPasswordReq').mockImplementation(() => {
        return Promise.reject();
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
    });
  });

  // userForgotPassword
  describe('User Forgot Password', () => {
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
      expect(dispatched).toEqual([userActions.forgotPasswordSuccess()]);
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
      expect(dispatched).toEqual([userActions.forgotPasswordFail(new Error('Error'))]);
    });
  });

  // updatePassword
  describe('Update Password', () => {
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

      expect(userService.updatePassword).toHaveBeenCalledWith({
        userId: '1',
        oldPassword: 'pass',
        newPassword: 'pass'
      });
      expect(dispatched).toEqual([userActions.changeOwnPasswordSuccess()]);
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

      expect(userService.updatePassword).toHaveBeenCalledWith({
        userId: '1',
        oldPassword: 'pass',
        newPassword: 'pass'
      });
      expect(dispatched).toEqual([userActions.changeOwnPasswordFail(e)]);
    });
  });

  // changePassword
  describe('Change Password', () => {
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
      expect(dispatched).toEqual([userActions.changePasswordSuccess()]);
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
      expect(dispatched).toEqual([userActions.changePasswordFail(e)]);
    });
  });

  // updateUser
  describe('Update User', () => {
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
          } as any,
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
      expect(dispatched).toEqual([userActions.updateUserSuccess()]);
    });

    it('updateUser Fail with instance of error', async () => {
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
          } as any,
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
      expect(dispatched).toEqual([userActions.updateUserFailure()]);
    });

    it('updateUser Fail without instance of error', async () => {
      jest.spyOn(userService, 'updateUser').mockImplementation(() => {
        return Promise.reject('Error');
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
          } as any,
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
      expect(dispatched).toEqual([userActions.updateUserFailure()]);
    });
  });

  // fetchUserById
  describe('Fetch User By Id', () => {
    it('fetchUserById success', async () => {
      jest.spyOn(userService, 'fetchUserById').mockImplementation(() => {
        return Promise.resolve({
          data: {
            entity: {
              userId: '1',
              email: 'email',
              firstName: 'firstName',
              lastName: 'lastName',
              roleDetail: 'any',
              tenantId: '1',
              country: 'chennai',
              suiteAccess: ['SUPER_USER'],
              appTypes: ['COMMUNITY']
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
        userActions.fetchUserByIdSuccess({
          userId: '1',
          email: 'email',
          firstName: 'firstName',
          lastName: 'lastName',
          roleDetail: 'any',
          tenantId: '1',
          country: 'chennai',
          suiteAccess: ['SUPER_USER'],
          appTypes: ['COMMUNITY']
        } as any)
      ]);
    });

    it('fetchUserById Failure with instance of error', async () => {
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
      expect(dispatched).toEqual([userActions.fetchUserByIdFailure()]);
    });

    it('fetchUserById Failure without instance of error', async () => {
      jest.spyOn(userService, 'fetchUserById').mockImplementation(() => {
        return Promise.reject('Error');
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
      expect(dispatched).toEqual([userActions.fetchUserByIdFailure()]);
    });
  });

  // fetchLockedUsers
  describe('Fetch Locked Users', () => {
    it('fetchLockedUsers success', async () => {
      jest.spyOn(userService, 'fetchLockedUsers').mockImplementation(() => {
        return Promise.resolve({
          data: {
            entityList: [],
            totalCount: 0
          }
        } as AxiosResponse);
      });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchLockedUsers,
        {
          tenantId: '1',
          skip: 0,
          limit: 10,
          search: '',
          role: '',
          successCb: jest.fn(),
          failureCb: jest.fn(),
          type: ACTION_TYPES.FETCH_LOCKED_USERS_REQUEST
        }
      ).toPromise();

      expect(userService.fetchLockedUsers).toHaveBeenCalledWith('1', 0, 10, '', '');
      expect(dispatched).toEqual([userActions.fetchLockedUsersSuccess({ lockedUsers: [], totalCount: 0 })]);
    });

    it('fetchLockedUsers failure with instance of error', async () => {
      jest.spyOn(userService, 'fetchLockedUsers').mockImplementation(() => {
        return Promise.reject(new Error('Error'));
      });

      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchLockedUsers,
        {
          tenantId: '1',
          skip: 0,
          limit: 10,
          search: '',
          role: '',
          successCb: jest.fn(),
          failureCb: jest.fn(),
          type: ACTION_TYPES.FETCH_LOCKED_USERS_REQUEST
        }
      ).toPromise();

      expect(userService.fetchLockedUsers).toHaveBeenCalledWith('1', 0, 10, '', '');
      expect(dispatched).toEqual([userActions.fetchLockedUsersFailure()]);
    });

    it('fetchLockedUsers failure without instance of error', async () => {
      jest.spyOn(userService, 'fetchLockedUsers').mockImplementation(() => {
        return Promise.reject('Error');
      });

      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchLockedUsers,
        {
          tenantId: '1',
          skip: 0,
          limit: 10,
          search: '',
          role: '',
          successCb: jest.fn(),
          failureCb: jest.fn(),
          type: ACTION_TYPES.FETCH_LOCKED_USERS_REQUEST
        }
      ).toPromise();

      expect(userService.fetchLockedUsers).toHaveBeenCalledWith('1', 0, 10, '', '');
      expect(dispatched).not.toEqual([userActions.fetchLockedUsersFailure()]);
    });
  });

  // fetchTimezoneList
  describe('Fetch Timezone List', () => {
    it('fetchTimezoneList success', async () => {
      jest.spyOn(userService, 'fetchTimezoneList').mockImplementation(() => {
        return Promise.resolve({
          data: [
            {
              id: '1',
              name: 'timezone'
            }
          ]
        } as AxiosResponse);
      });

      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchTimezoneList
      ).toPromise();

      expect(userService.fetchTimezoneList).toHaveBeenCalled();
      expect(dispatched).toEqual([userActions.fetchTimezoneListSuccess([{ id: '1', name: 'timezone' }] as any)]);
    });

    it('fetchTimezoneList failure with instance of error', async () => {
      jest.spyOn(userService, 'fetchTimezoneList').mockImplementation(() => {
        return Promise.reject(new Error('Error'));
      });

      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchTimezoneList
      ).toPromise();

      expect(userService.fetchTimezoneList).toHaveBeenCalled();
      expect(dispatched).toEqual([userActions.fetchTimezoneListFailure()]);
    });
  });

  // fetchCommunityListRequest
  describe('Fetch Community List', () => {
    it('fetchCommunityListRequest success', async () => {
      jest.spyOn(userService, 'fetchCommunityListRequest').mockImplementation(() => {
        return Promise.resolve({
          data: []
        } as AxiosResponse);
      });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchCommunityListRequest,
        {
          countryId: '1',
          successCb: jest.fn(),
          failureCb: jest.fn(),
          type: ACTION_TYPES.FETCH_COMMUNITY_LIST_REQUEST
        }
      ).toPromise();

      expect(userService.fetchCommunityListRequest).toHaveBeenCalledWith('1');
      expect(dispatched).toEqual([userActions.fetchCommunityListSuccess([] as any)]);
    });

    it('fetchCommunityListRequest failure with instance of error', async () => {
      jest.spyOn(userService, 'fetchCommunityListRequest').mockImplementation(() => {
        return Promise.reject(new Error('Error'));
      });

      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchCommunityListRequest,
        {
          countryId: '1',
          successCb: jest.fn(),
          failureCb: jest.fn(),
          type: ACTION_TYPES.FETCH_COMMUNITY_LIST_REQUEST
        }
      ).toPromise();

      expect(userService.fetchCommunityListRequest).toHaveBeenCalledWith('1');
      expect(dispatched).toEqual([userActions.fetchCommunityListFailure()]);
    });
  });

  // fetchDesignationListRequest
  describe('Fetch Designation List', () => {
    it('fetchDesignationListRequest success', async () => {
      jest.spyOn(userService, 'fetchDesignationListRequest').mockImplementation(() => {
        return Promise.resolve({
          data: {
            entity: []
          }
        } as AxiosResponse);
      });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchDesignationListRequest,
        {
          countryId: '1',
          type: ACTION_TYPES.FETCH_DESIGNATION_LIST_REQUEST
        }
      ).toPromise();

      expect(userService.fetchDesignationListRequest).toHaveBeenCalledWith('1');
      expect(dispatched).toEqual([userActions.fetchDesignationListSuccess({ designationList: [] } as any)]);
    });

    it('fetchDesignationListRequest failure with instance of error', async () => {
      jest.spyOn(userService, 'fetchDesignationListRequest').mockImplementation(() => {
        return Promise.reject(new Error('Error'));
      });

      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchDesignationListRequest,
        {
          countryId: '1',
          type: ACTION_TYPES.FETCH_DESIGNATION_LIST_REQUEST
        }
      ).toPromise();

      expect(userService.fetchDesignationListRequest).toHaveBeenCalledWith('1');
      expect(dispatched).toEqual([userActions.fetchDesignationListFailure()]);
    });
  });

  // unlockUsers
  describe('Unlock Users', () => {
    it('unlockUsers success', async () => {
      jest.spyOn(userService, 'unlockUsers').mockImplementation(() => {
        return Promise.resolve({} as AxiosResponse);
      });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        unlockUsers,
        {
          userId: '1',
          successCb: jest.fn(),
          failureCb: jest.fn(),
          type: ACTION_TYPES.UNLOCK_USERS_REQUEST
        }
      ).toPromise();

      expect(userService.unlockUsers).toHaveBeenCalledWith('1');
      expect(dispatched).toEqual([userActions.unlockUsersSuccess()]);
    });

    it('unlockUsers failure with instance of error', async () => {
      jest.spyOn(userService, 'unlockUsers').mockImplementation(() => {
        return Promise.reject(new Error('Error'));
      });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        unlockUsers,
        {
          userId: '1',
          successCb: jest.fn(),
          failureCb: jest.fn(),
          type: ACTION_TYPES.UNLOCK_USERS_REQUEST
        }
      ).toPromise();

      expect(userService.unlockUsers).toHaveBeenCalledWith('1');
      expect(dispatched).toEqual([userActions.unlockUsersFailure()]);
    });

    it('unlockUsers failure without instance of error', async () => {
      jest.spyOn(userService, 'unlockUsers').mockImplementation(() => {
        return Promise.reject('Error');
      });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        unlockUsers,
        {
          userId: '1',
          successCb: jest.fn(),
          failureCb: jest.fn(),
          type: ACTION_TYPES.UNLOCK_USERS_REQUEST
        }
      ).toPromise();

      expect(userService.unlockUsers).toHaveBeenCalledWith('1');
      expect(dispatched).not.toEqual([userActions.unlockUsersFailure()]);
    });
  });

  // fetchTermsConditionsSaga
  describe('Fetch Terms Conditions', () => {
    it('fetchTermsConditionsSaga success', async () => {
      jest.spyOn(userService, 'fetchTermsConditionsAPI').mockImplementation(() => {
        return Promise.resolve({
          data: {
            entity: []
          }
        } as AxiosResponse);
      });

      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchTermsConditionsSaga,
        { countryId: 1, successCB: jest.fn(), type: ACTION_TYPES.FETCH_TERMS_CONDITIONS_REQUEST }
      ).toPromise();

      expect(userService.fetchTermsConditionsAPI).toHaveBeenCalledWith(1);
      expect(dispatched).toEqual([userActions.fetchTermsAndConditionsSuccess([] as any)]);
    });

    it('fetchTermsConditionsSaga failure', async () => {
      jest.spyOn(userService, 'fetchTermsConditionsAPI').mockImplementation(() => {
        return Promise.reject(new Error('Error'));
      });

      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchTermsConditionsSaga,
        { countryId: 1, successCB: jest.fn(), type: ACTION_TYPES.FETCH_TERMS_CONDITIONS_REQUEST }
      ).toPromise();

      expect(userService.fetchTermsConditionsAPI).toHaveBeenCalledWith(1);
      expect(dispatched).toEqual([userActions.fetchTermsAndConditionsFailure(new Error('Error'))]);
    });
  });

  describe('Update Terms Conditions', () => {
    it('updateTermsConditionsSaga success', async () => {
      jest.spyOn(userService, 'updateTermsConditionsAPI').mockImplementation(() => {
        return Promise.resolve({
          data: {
            entity: []
          }
        } as AxiosResponse);
      });

      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        updateTermsConditionsSaga,
        {
          userId: 1,
          isTermsAndConditionAccepted: true,
          successCB: jest.fn(),
          failureCB: jest.fn(),
          type: ACTION_TYPES.UPDATE_TERMS_CONDITIONS_REQUEST
        }
      ).toPromise();

      expect(userService.updateTermsConditionsAPI).toHaveBeenCalledWith({
        userId: 1,
        isTermsAndConditionAccepted: true
      });
      expect(dispatched).toEqual([userActions.updateTermsAndConditionsSuccess()]);
    });

    it('updateTermsConditionsSaga failure with instance of error', async () => {
      jest.spyOn(userService, 'updateTermsConditionsAPI').mockImplementation(() => {
        return Promise.reject(new Error('Error'));
      });

      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        updateTermsConditionsSaga,
        {
          userId: 1,
          isTermsAndConditionAccepted: true,
          successCB: jest.fn(),
          failureCB: jest.fn(),
          type: ACTION_TYPES.UPDATE_TERMS_CONDITIONS_REQUEST
        }
      ).toPromise();

      expect(userService.updateTermsConditionsAPI).toHaveBeenCalledWith({
        userId: 1,
        isTermsAndConditionAccepted: true
      });
      expect(dispatched).toEqual([userActions.updateTermsAndConditionsFailure(new Error('Error'))]);
    });

    it('updateTermsConditionsSaga failure without instance of error', async () => {
      jest.spyOn(userService, 'updateTermsConditionsAPI').mockImplementation(() => {
        return Promise.reject('Error');
      });

      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        updateTermsConditionsSaga,
        {
          userId: 1,
          isTermsAndConditionAccepted: true,
          successCB: jest.fn(),
          failureCB: jest.fn(),
          type: ACTION_TYPES.UPDATE_TERMS_CONDITIONS_REQUEST
        }
      ).toPromise();

      expect(userService.updateTermsConditionsAPI).toHaveBeenCalledWith({
        userId: 1,
        isTermsAndConditionAccepted: true
      });
      expect(dispatched).toEqual([userActions.updateTermsAndConditionsFailure('Error')]);
    });
  });
});
