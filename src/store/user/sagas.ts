import { SagaIterator } from 'redux-saga';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import * as USERTYPES from './actionTypes';
import {
  IFetchLockedUsersRequest,
  IFetchUserByIdRequest,
  IFetchUserRolesRequest,
  ILoginRequest,
  IUnlockUsersRequest,
  IUpdateUserRequest,
  IUser
} from './types';
import APPCONSTANTS from '../../constants/appConstants';
import sessionStorageServices from '../../global/sessionStorageServices';
import localStorageServices from '../../global/localStorageServices';
import { encryptData } from '../../utils/commonUtils';
import CryptoJS from 'crypto-js';
import * as userService from '../../services/userAPI';
import * as userActions from './actions';
import { IActionProps } from '../../typings/global';
import { error, success } from '../../utils/toastCenter';
import { AppState } from '../rootReducer';
import { IUserRole } from '../healthFacility/types';

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
      formDataId: organizations[0]?.formDataId,
      countryId: undefined,
      organizations
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
    yield put(userActions.logoutSuccess());
  } catch (e) {
    sessionStorageServices.deleteItem(APPCONSTANTS.AUTHTOKEN);
    sessionStorageServices.deleteItem(APPCONSTANTS.USER_TENANTID);
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
      suiteAccess,
      countryId: undefined,
      organizations
    };
    yield put(userActions.fetchLoggedInUserSuccess(payload));
  } catch (e: any) {
    sessionStorageServices.clearAllItem();
    sessionStorageServices.deleteItem(APPCONSTANTS.AUTHTOKEN);
    sessionStorageServices.deleteItem(APPCONSTANTS.USER_TENANTID);
    yield put(userActions.resetStore());
    yield put(userActions.fetchLoggedInUserFail());
  }
}

/*
  Worker Saga: Fired on FETCH_USER_ROLES_REQUEST action
*/
export function* fetchUserRoles({ countryId, successCb, failureCb }: IFetchUserRolesRequest): SagaIterator {
  try {
    const {
      data: { entity: userRoles }
    } = yield call(userService.fetchUserRoles, countryId);
    const role = yield select((state: AppState) => state.user.user.role);
    const updatedUserRoles = {
      ...userRoles,
      SPICE: [APPCONSTANTS.ROLES.SUPER_ADMIN, APPCONSTANTS.ROLES.SUPER_USER].includes(role)
        ? userRoles.SPICE
        : userRoles.SPICE.filter((r: IUserRole) => r.name !== APPCONSTANTS.ROLES.SUPER_ADMIN),
      'SPICE INSIGHTS': [APPCONSTANTS.ROLES.SUPER_ADMIN, APPCONSTANTS.ROLES.SUPER_USER].includes(role)
        ? userRoles['SPICE INSIGHTS']
        : userRoles['SPICE INSIGHTS'].filter((r: IUserRole) => r.name !== APPCONSTANTS.ROLES.REPORT_ADMIN)
    };
    successCb?.(updatedUserRoles);
    yield put(userActions.fetchUserRolesActionSuccess(updatedUserRoles));
  } catch (e: any) {
    failureCb?.(e);
    yield put(userActions.fetchUserRolesActionFail());
  }
}

/*
  Worker Saga: Fired on FETCH_USER_BY_ID_REQUEST action
*/
export function* fetchUserById(action: IFetchUserByIdRequest): SagaIterator {
  try {
    const {
      data: { entity: userDetail }
    } = yield call(userService.fetchUserById, action.payload);
    action.successCb?.(userDetail);
    const payload: Omit<IUser, 'formDataId' | 'countryId' | 'role'> = {
      ...userDetail
    };
    yield put(userActions.fetchUserByIdSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      action.failureCb?.(e);
    }
    yield put(userActions.fetchUserByIdFailure());
  }
}

/*
  Worker Saga: Fired on UPDATE_USER_REQUEST action
*/
export function* updateUser(action: IUpdateUserRequest): SagaIterator {
  try {
    yield call(userService.updateUser, action.payload);
    action.successCb?.();
    yield put(userActions.updateUserSuccess());
  } catch (e) {
    if (e instanceof Error) {
      action.failureCb?.(e);
    }
    yield put(userActions.updateUserFailure());
  }
}

/*
  Worker Saga: Fired on CHANGE_PASSWORD_REQUEST action
*/
export function* changePassword(action: IActionProps) {
  const { userId, password, successCB, failureCb } = action.data;
  try {
    yield call(userService.changePasswordReq, { userId, newPassword: password });
    yield put(userActions.changePasswordSuccess());
    successCB();
  } catch (e: any) {
    failureCb?.(e);
    yield put(userActions.changePasswordFail(e));
  }
}

/*
  Worker Saga: Fired on UPDATE_PASSWORD_REQUEST action
*/
export function* updatePassword(action: IActionProps) {
  const { userId, oldPassword, newPassword, successCB, failureCb } = action.data;
  try {
    yield call(userService.updatePassword, {
      userId,
      oldPassword,
      newPassword
    });
    yield put(userActions.changeOwnPasswordSuccess());
    successCB();
  } catch (e: any) {
    failureCb?.(e);
    yield put(userActions.changeOwnPasswordFail(e));
  }
}

/*
  Worker Saga: Fired on USER_FORGOT_PASSWORD_REQUEST action
*/
export function* userForgotPassword(action: any) {
  const { email, successCB } = action;
  try {
    yield call(userService.forgotPassword, email.toLowerCase());
    yield put(userActions.forgotPasswordSuccess());
    success(APPCONSTANTS.SUCCESS, APPCONSTANTS.PASSWORD_RESET_EMAIL_SENT_MESSAGE);
    successCB();
  } catch (e: any) {
    error(APPCONSTANTS.ALERT, e.message);
    yield put(userActions.forgotPasswordFail(e));
  }
}

/*
  Worker Saga: Fired on RESET_PASSWORD_REQUEST action
*/
export function* resetPassword(action: IActionProps) {
  const { email, password, token, successCB, failureCb } = action.data;
  try {
    yield call(userService.resetPasswordReq, { email, password }, token);
    yield put(userActions.resetPasswordSuccess());
    success(APPCONSTANTS.SUCCESS, APPCONSTANTS.PASSWORD_SET_SUCCESS);
    successCB();
  } catch (e: any) {
    failureCb?.(e);
    yield put(userActions.resetPasswordFail(e));
    const message = e?.message || APPCONSTANTS.PASSWORD_SET_FAILED;
    error(APPCONSTANTS.ALERT, message);
  }
}

/*
  Worker Saga: Fired on GET_USERNAME_FOR_PASSWORD_RESET action
*/
export function* getUsername(action: IActionProps): SagaIterator {
  const { token, successCB, failureCB } = action;
  try {
    yield call(userService.getUsername, token);
    yield put(userActions.getUserNameSuccess());
    successCB?.();
  } catch (e) {
    failureCB?.(e);
    yield put(userActions.getUserNameFail(e));
  }
}

/*
  Worker Saga: Fired on FETCH_LOCKED_USERS_REQUEST action
*/
export function* fetchLockedUsers({
  tenantId,
  skip,
  limit,
  search,
  role,
  successCb,
  failureCb
}: IFetchLockedUsersRequest): SagaIterator {
  try {
    const {
      data: { entityList: lockedUsers, totalCount }
    } = yield call(userService.fetchLockedUsers as any, tenantId, skip, limit, search, role);
    successCb?.(lockedUsers || []);
    yield put(userActions.fetchLockedUsersSuccess({ lockedUsers: lockedUsers || [], totalCount }));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(userActions.fetchLockedUsersFailure());
    }
  }
}

/*
  Worker Saga: Fired on FETCH_TIMEZONE_LIST_REQUEST action
*/
export function* fetchTimezoneList(): SagaIterator {
  try {
    const { data: timezoneList } = yield call(userService.fetchTimezoneList);
    yield put(userActions.fetchTimezoneListSuccess(timezoneList));
  } catch (e) {
    yield put(userActions.fetchTimezoneListFailure());
  }
}

/*
  Worker Saga: Fired on FETCH_COMMUNITY_LIST_REQUEST action
*/
export function* fetchCommunityListRequest(action: IActionProps): SagaIterator {
  const { countryId, successCB, failureCB } = action;
  try {
    const { data: entityList } = yield call(userService.fetchCommunityListRequest, countryId);
    yield put(userActions.fetchCommunityListSuccess(entityList));
    successCB?.(entityList);
  } catch (e) {
    failureCB?.(e);
    yield put(userActions.fetchCommunityListFailure());
  }
}

/*
  Worker Saga: Fired on UNLOCK_USERS_REQUEST action
*/
export function* unlockUsers({ userId, successCb, failureCb }: IUnlockUsersRequest): SagaIterator {
  try {
    yield call(userService.unlockUsers as any, userId);
    successCb?.();
    yield put(userActions.unlockUsersSuccess());
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(userActions.unlockUsersFailure());
    }
  }
}

/*
  Starts worker saga on latest dispatched `LOGIN_REQUEST` action.
  Allows concurrent increments.
*/
function* userSaga() {
  yield all([takeLatest(USERTYPES.LOGIN_REQUEST, login)]);
  yield all([takeLatest(USERTYPES.LOGOUT_REQUEST, logout)]);
  yield all([takeLatest(USERTYPES.USER_FORGOT_PASSWORD_REQUEST, userForgotPassword)]);
  yield all([takeLatest(USERTYPES.RESET_PASSWORD_REQUEST, resetPassword)]);
  yield all([takeLatest(USERTYPES.GET_USERNAME_FOR_PASSWORD_RESET, getUsername)]);
  yield all([takeLatest(USERTYPES.FETCH_USER_BY_ID_REQUEST, fetchUserById)]);
  yield all([takeLatest(USERTYPES.UPDATE_USER_REQUEST, updateUser)]);
  yield takeLatest(USERTYPES.FETCH_LOGGED_IN_USER_REQUEST, fetchLoggedInUser);
  yield takeLatest(USERTYPES.FETCH_USER_ROLES_REQUEST, fetchUserRoles);
  yield all([takeLatest(USERTYPES.CHANGE_PASSWORD_REQUEST, changePassword)]);
  yield all([takeLatest(USERTYPES.CHANGE_OWN_PASSWORD_REQUEST, updatePassword)]);
  yield all([takeLatest(USERTYPES.FETCH_TIMEZONE_LIST_REQUEST, fetchTimezoneList)]);
  yield all([takeLatest(USERTYPES.FETCH_LOCKED_USERS_REQUEST, fetchLockedUsers)]);
  yield all([takeLatest(USERTYPES.FETCH_COMMUNITY_LIST_REQUEST, fetchCommunityListRequest)]);
  yield all([takeLatest(USERTYPES.UNLOCK_USERS_REQUEST, unlockUsers)]);
}

export default userSaga;
