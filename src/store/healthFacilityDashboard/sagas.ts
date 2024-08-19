import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import { AppState } from '../rootReducer';

import * as siteListService from '../../services/siteAPI';
import { getHFForDropdown } from '../../services/programAPI';
import {
  IFetchSiteListRequest,
  ICreateSiteRequest,
  IFetchSiteSummaryRequest,
  IFetchSiteSummaryUsersRequest,
  IUpdateSiteDetailsRequest,
  ICreateSiteUserRequest,
  IUpdateSiteUserRequest,
  IDeleteSiteUserRequest,
  IFetchSiteUserListRequest,
  IFetchSiteDashboardListRequest,
  IFetchSiteDropdownRequest,
  IFetchDistrictDropdownRequest,
  IFetchChiefdomDropdownRequest
} from '../healthFacilityDashboard/types';
import {
  fetchSiteListSuccess,
  fetchSiteListFailure,
  fetchSiteDistrictDropdownSuccess,
  fetchSiteDistrictDropdownFailure,
  createSiteSuccess,
  createSiteFailure,
  fetchSiteSummarySuccess,
  fetchSiteSummaryFailure,
  fetchSiteSummaryUsersSuccess,
  fetchSiteSummaryUsersFailure,
  updateSiteDetailsSuccess,
  updateSiteDetailsFailure,
  createSiteUserSuccess,
  createSiteUserFailure,
  updateSiteUserSuccess,
  updateSiteUserFailure,
  fetchCultureDropdownSuccess,
  fetchCultureDropdownFailure,
  deleteSiteUserSuccess,
  deleteSiteUserFailure,
  fetchSiteUserListSuccess,
  fetchSiteUserListFailure,
  fetchChiefdomDropdownSuccess,
  fetchChiefdomDropdownFailure,
  fetchSiteDashboardListSuccess,
  fetchSiteDashboardListFailure,
  fetchSiteDropdownFailure,
  fetchSiteDropdownSuccess
} from './actions';
import * as siteActions from '../healthFacilityDashboard/actions';
import {
  FETCH_SITE_LIST_REQUEST,
  FETCH_DISTRICT_DROPDOWN_REQUEST,
  CREATE_SITE_REQUEST,
  FETCH_SITE_SUMMARY_REQUEST,
  FETCH_SITE_USERS_REQUEST,
  CREATE_SITE_USER_REQUEST,
  UPDATE_SITE_DETAILS_REQUEST,
  UPDATE_SITE_USER_REQUEST,
  FETCH_CULTURE_DROPDOWN_REQUEST,
  FETCH_SITE_USER_LIST_REQUEST,
  DELETE_SITE_USER_REQUEST,
  FETCH_CHIEFDOM_DROPDOWN_REQUEST,
  FETCH_SITE_DASHBOARD_LIST_REQUEST,
  FETCH_SITE_DROPDOWN_REQUEST,
  FETCH_HF_DROPDOWN_REQUEST
} from './actionTypes';

/*
  Worker Saga: Fired on FETCH_SITE_LIST_REQUEST action
*/
export function* fetchSiteList({ tenantId, skip, limit, search, failureCb }: IFetchSiteListRequest): SagaIterator {
  try {
    const {
      data: { entityList: sites, totalCount: total }
    } = yield call(siteListService.fetchSiteList as any, { tenantId, limit, skip, search });
    const payload = { sites: sites || [], total, limit };
    yield put(fetchSiteListSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchSiteListFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_STATE_DROPDOWN_REQUEST action
*/
export function* fetchSiteDistrictList({ countryId }: IFetchDistrictDropdownRequest): SagaIterator {
  try {
    const { data: districtList } = yield call(siteListService.fetchSiteDistrict as any, countryId);
    const payload = { districtList };
    yield put(fetchSiteDistrictDropdownSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      yield put(fetchSiteDistrictDropdownFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_CHIEFDOM_DROPDOWN_REQUEST action
*/
export function* fetchChiefdomList(districtId: IFetchChiefdomDropdownRequest): SagaIterator {
  try {
    const {
      data: { entityList: chiefdomList }
    } = yield call(siteListService.fetchChiefdom as any, districtId.districtId);
    const payload = { chiefdomList: chiefdomList || [] };
    yield put(fetchChiefdomDropdownSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      yield put(fetchChiefdomDropdownFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_CULTURE_DROPDOWN_REQUEST action
*/
export function* fetchSiteCultureList(): SagaIterator {
  try {
    const { data: cultureList } = yield call(siteListService.fetchSiteCulture as any);
    yield put(fetchCultureDropdownSuccess({ cultureList }));
  } catch (e) {
    if (e instanceof Error) {
      yield put(fetchCultureDropdownFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on CREATE_SITE_REQUEST action
*/
export function* createSiteRequest({ data, successCb, failureCb }: ICreateSiteRequest): SagaIterator {
  try {
    yield call(siteListService.createSite as any, data);
    successCb?.();
    yield put(siteActions.clearSiteDropdown());
    yield put(createSiteSuccess());
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(createSiteFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_SITE_SUMMARY_REQUEST action
*/
export function* fetchSiteSummaryRequest({
  tenantId,
  id,
  successCb,
  failureCb
}: IFetchSiteSummaryRequest): SagaIterator {
  try {
    const { data: siteSummary } = yield call(siteListService.fetchSiteSummary as any, tenantId, id);
    successCb?.(siteSummary.entity);
    yield put(fetchSiteSummarySuccess(siteSummary.entity));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchSiteSummaryFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on UPDATE_SITE_BASIC_DETAILS_REQUEST action
*/
export function* updateSiteDetailsRequest({ data, successCb, failureCb }: IUpdateSiteDetailsRequest): SagaIterator {
  try {
    yield call(siteListService.updateSiteDetails as any, data);
    successCb?.();
    yield put(siteActions.clearSiteDropdown());
    yield put(updateSiteDetailsSuccess());
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(updateSiteDetailsFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_SITE_USER_LIST_REQUEST action
*/
export function* fetchSiteUserList({
  tenantId,
  skip,
  limit,
  search,
  roleType,
  failureCb
}: IFetchSiteUserListRequest): SagaIterator {
  try {
    const {
      data: { entityList: siteUsers, totalCount: total }
    } = yield call(siteListService.fetchSiteUserList as any, {
      tenantId,
      limit,
      skip,
      searchTerm: search,
      userType: 'site',
      roleType
    });
    const payload = { siteUsers: siteUsers || [], total, limit };
    payload.siteUsers.forEach((siteUser: any) => {
      siteUser.organizationName = siteUser.defaultOrganizationName;
      siteUser.roleName = siteUser.defaultRoleName;
    });
    yield put(fetchSiteUserListSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchSiteUserListFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on DELETE_SITE_USER_REQUEST action
*/

export function* deleteSiteUserRequest({
  data,
  isAllSites = false,
  successCb,
  failureCb
}: IDeleteSiteUserRequest): SagaIterator {
  try {
    isAllSites
      ? yield call(siteListService.deleteAllSiteUser as any, data)
      : yield call(siteListService.deleteSiteUser as any, data);
    yield put(deleteSiteUserSuccess());
    successCb?.();
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(deleteSiteUserFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on CREATE_SITE_USER_REQUEST action
*/
export function* createSiteUserRequest({ data, successCb, failureCb }: ICreateSiteUserRequest): SagaIterator {
  try {
    yield call(siteListService.addSiteUser as any, data);
    successCb?.();
    yield put(createSiteUserSuccess());
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(createSiteUserFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on UPDATE_SITE_USER_REQUEST action
*/
export function* updateSiteUserRequest({ data, successCb, failureCb }: IUpdateSiteUserRequest): SagaIterator {
  try {
    yield call(siteListService.updateSiteUser as any, data);
    successCb?.();
    yield put(updateSiteUserSuccess());
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(updateSiteUserFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_SITE_USERS_REQUEST action
*/
export function* fetchSiteSummaryusersRequest({
  tenantId,
  searchParams,
  limit,
  skip,
  successCb,
  failureCb
}: IFetchSiteSummaryUsersRequest): SagaIterator {
  try {
    const {
      data: { entityList: users, totalCount }
    } = yield call(siteListService.fetchSiteUsers as any, {
      tenantId,
      searchParams,
      limit,
      skip
    });
    const userList = (users || []).map((user: any) => {
      user.roleName = user.defaultRoleName;
      return user;
    });
    successCb?.(userList, totalCount || 0);
    yield put(fetchSiteSummaryUsersSuccess(userList));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchSiteSummaryUsersFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_SITE_DASHBOARD_LIST_REQUEST action
*/
export function* fetchSiteDashboardList({
  isLoadMore,
  skip,
  limit,
  search,
  role,
  successCb,
  failureCb
}: IFetchSiteDashboardListRequest): SagaIterator {
  try {
    const tenantId = yield select((state: AppState) => state.user.user.tenantId);
    const {
      data: { entityList: siteDashboardList, totalCount: total }
    } = yield call(siteListService.fetchSiteList as any, { tenantId, limit, skip, undefined, role, search });
    const payload = { siteDashboardList: siteDashboardList || [], total, isLoadMore };
    successCb?.(payload);
    yield put(fetchSiteDashboardListSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchSiteDashboardListFailure(e));
    }
  }
}

/*
  Starts worker saga on latest dispatched specific action.
  Allows concurrent increments.
*/
function* siteSaga() {
  yield all([takeLatest(FETCH_SITE_LIST_REQUEST, fetchSiteList)]);
  yield all([takeLatest(FETCH_DISTRICT_DROPDOWN_REQUEST, fetchSiteDistrictList)]);
  yield all([takeLatest(FETCH_CHIEFDOM_DROPDOWN_REQUEST, fetchChiefdomList)]);
  yield all([takeLatest(CREATE_SITE_REQUEST, createSiteRequest)]);
  yield all([takeLatest(FETCH_SITE_SUMMARY_REQUEST, fetchSiteSummaryRequest)]);
  yield all([takeLatest(FETCH_SITE_USERS_REQUEST, fetchSiteSummaryusersRequest)]);
  yield all([takeLatest(UPDATE_SITE_DETAILS_REQUEST, updateSiteDetailsRequest)]);
  yield all([takeLatest(FETCH_SITE_USER_LIST_REQUEST, fetchSiteUserList)]);
  yield all([takeLatest(DELETE_SITE_USER_REQUEST, deleteSiteUserRequest)]);
  yield all([takeLatest(UPDATE_SITE_USER_REQUEST, updateSiteUserRequest)]);
  yield all([takeLatest(CREATE_SITE_USER_REQUEST, createSiteUserRequest)]);
  yield all([takeLatest(FETCH_CULTURE_DROPDOWN_REQUEST, fetchSiteCultureList)]);
  yield all([takeLatest(FETCH_SITE_DASHBOARD_LIST_REQUEST, fetchSiteDashboardList)]);
}

export default siteSaga;
