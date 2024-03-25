import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as USERTYPES from './actionTypes';
import { IFetchUserRolesRequest, ILoginRequest, IUser } from './types';
import APPCONSTANTS from '../../constants/appConstants';
import sessionStorageServices from '../../global/sessionStorageServices';
import localStorageServices from '../../global/localStorageServices';
import { encryptData } from '../../utils/commonUtils';
import CryptoJS from 'crypto-js';
import * as userService from '../../services/userAPI';
import * as userActions from './actions';

// export const checkRoles = (rolesArray: string[] = [], roles: string[] = []) =>
//   roles.length && rolesArray.find((role) => roles.includes(role));

/*
  Worker Saga: Fired on LOGIN_REQUEST action
*/
export function* login({ username, password, rememberMe, successCb, failureCb }: ILoginRequest): SagaIterator {
  try {
    const hmac = CryptoJS.HmacSHA512(password, process.env.REACT_APP_PASSWORD_HASH_KEY as string);
    const hashedPassword = hmac.toString(CryptoJS.enc.Hex);
    const { headers } = yield call(userService.login, username, hashedPassword);
    sessionStorageServices.setItem('iLi', true);
    sessionStorageServices.setItem(APPCONSTANTS.USER_TENANTID, headers?.Tenantid);
    yield put(userActions.addUserTenantID(headers?.Tenantid));
    const encryptedToken = encryptData(headers?.authorization);
    sessionStorageServices.setItem(APPCONSTANTS.AUTHTOKEN, encryptedToken);
    yield put(userActions.addToken(encryptedToken));
    const {
      data: {
        entity: {
          username: email,
          firstName,
          lastName,
          id: userId,
          roles,
          tenantId,
          country,
          organizations,
          suiteAccess
        }
      }
    } = yield call(userService.fetchLoggedInUser);
    sessionStorageServices.setItem(APPCONSTANTS.USER_TENANTID, tenantId);
    sessionStorageServices.setItem(APPCONSTANTS.COUNTRY_TENANT_ID, country?.tenantId);
    updateRememberMe(username, password, rememberMe);
    const payload: IUser = {
      email,
      firstName,
      lastName,
      userId,
      role: roles[0].name,
      roleDetail: roles[0],
      tenantId,
      country,
      suiteAccess,
      formDataId: organizations[0]?.formDataId
    };
    successCb?.(payload);
    yield put(userActions.loginSuccess(payload));
  } catch (e: any) {
    if (e instanceof Error) {
      sessionStorageServices.clearAllItem();
      sessionStorageServices.deleteItem(APPCONSTANTS.AUTHTOKEN);
      sessionStorageServices.deleteItem(APPCONSTANTS.USER_TENANTID);
      sessionStorageServices.deleteItem(APPCONSTANTS.COUNTRY_TENANT_ID);
      yield put(userActions.resetStore());
      yield put(userActions.removeToken());
      failureCb?.(e);
      yield put(userActions.loginFailure({ error: e?.message }));
    }
  }
}

/*
  Worker Saga: Fired on LOGOUT_REQUEST action
*/
export function* logout(): SagaIterator {
  const token = sessionStorageServices.getItem(APPCONSTANTS.AUTHTOKEN);
  try {
    yield call(userService.logout, token);
    sessionStorageServices.clearAllItem();
    yield put(userActions.resetStore());
    yield put(userActions.removeToken());
    yield put(userActions.logoutSuccess());
  } catch (e) {
    sessionStorageServices.deleteItem(APPCONSTANTS.AUTHTOKEN);
    sessionStorageServices.deleteItem(APPCONSTANTS.USER_TENANTID);
    yield put(userActions.removeToken());
    yield put(userActions.removeUserTenantID());
    yield put(userActions.logoutFailure());
  }
}

export function updateRememberMe(username: string, password: string, rememberMe: boolean) {
  try {
    if (rememberMe) {
      localStorageServices.setItems([
        { key: APPCONSTANTS.USERNAME, value: username },
        { key: APPCONSTANTS.PASSWORD, value: encryptData(password) },
        { key: APPCONSTANTS.REMEMBER_ME, value: rememberMe }
      ]);
    } else {
      localStorageServices.deleteItems([APPCONSTANTS.USERNAME, APPCONSTANTS.PASSWORD, APPCONSTANTS.REMEMBER_ME]);
    }
  } catch (e) {
    console.error('Error occured', e);
  }
}

/*
  Worker Saga: Fired on FETCH_LOGGED_IN_USER_REQUEST action
*/
export function* fetchLoggedInUser(): SagaIterator {
  try {
    const {
      data: {
        entity: {
          username: email,
          firstName,
          lastName,
          id: userId,
          roles,
          tenantId,
          country,
          organizations,
          suiteAccess
        }
      }
    } = yield call(userService.fetchLoggedInUser);
    const payload: IUser = {
      email,
      firstName,
      lastName,
      userId,
      role: roles[0].name,
      roleDetail: roles[0],
      tenantId,
      formDataId: organizations[0]?.formDataId,
      country,
      suiteAccess
    };
    yield put(userActions.fetchLoggedInUserSuccess(payload));
  } catch (e: any) {
    sessionStorageServices.clearAllItem();
    sessionStorageServices.deleteItem(APPCONSTANTS.AUTHTOKEN);
    sessionStorageServices.deleteItem(APPCONSTANTS.USER_TENANTID);
    yield put(userActions.removeToken());
    yield put(userActions.resetStore());
    yield put(userActions.fetchLoggedInUserFail());
  }
}

/*
  Worker Saga: Fired on FETCH_LOGGED_IN_USER_REQUEST action
*/
export function* fetchUserRoles({ successCb, failureCb }: IFetchUserRolesRequest): SagaIterator {
  try {
    const {
      data: { entity: userRoles }
    } = yield call(userService.fetchUserRoles);
    successCb?.(userRoles);
    yield put(userActions.fetchUserRolesActionSuccess(userRoles));
  } catch (e: any) {
    failureCb?.(e);
    yield put(userActions.fetchUserRolesActionFail());
  }
}

/*
  Starts worker saga on latest dispatched `LOGIN_REQUEST` action.
  Allows concurrent increments.
*/
function* userSaga() {
  yield all([takeLatest(USERTYPES.LOGIN_REQUEST, login)]);
  yield all([takeLatest(USERTYPES.LOGOUT_REQUEST, logout)]);
  yield takeLatest(USERTYPES.FETCH_LOGGED_IN_USER_REQUEST, fetchLoggedInUser);
  yield takeLatest(USERTYPES.FETCH_USER_ROLES_REQUEST, fetchUserRoles);
}

export default userSaga;
