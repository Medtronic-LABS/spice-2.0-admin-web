import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest, select } from 'redux-saga/effects';

import * as subCountyAPI from '../../services/subCountyAPI';
import * as operatinUnitActions from './actions';
import {
  IFetchSubCountyDashboardListRequest,
  IFetchSubCountyDetailReq,
  IFetchSubCountyListRequest,
  ICreateSubCountyRequest,
  IUpdateSubCountyRequest,
  IUpdateSubCountyAdminRequest,
  IDeleteSubCountyAdminRequest,
  IFetchSubCountyByIdRequest,
  ICreateSubCountyAdminRequest,
  ISubCountyDropdownRequest
} from './types';
import * as ACTION_TYPES from './actionTypes';
import { AppState } from '../rootReducer';
import { fetchSubCountyAdmins } from '../../services/subCountyAPI';
import { fetchSubCountyDropdownFailure, fetchSubCountyDropdownSuccess } from './actions';
import APPCONSTANTS from '../../constants/appConstants';

/*
  Worker Saga: Fired on FETCH_REGIONS_REQUEST action
*/
export function* fetchSubCountyDashboardList({
  isLoadMore,
  skip,
  limit,
  search,
  successCb,
  failureCb
}: IFetchSubCountyDashboardListRequest): SagaIterator {
  try {
    const tenantId = yield select((state: AppState) => state.user.user.tenantId);
    const {
      data: { entityList: subCountyDashboardList, totalCount: total }
    } = yield call(subCountyAPI.fetchSubCountyDashboardList as any, tenantId, limit, skip, undefined, search);
    const payload = { subCountyDashboardList: subCountyDashboardList || [], total, isLoadMore };
    successCb?.(payload);
    yield put(operatinUnitActions.fetchSubCountyDashboardListSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(operatinUnitActions.fetchSubCountyDashboardListFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_SUB_COUNTY_DETAIL_REQUEST action
*/
export function* fetchSubCountyDetail(action: IFetchSubCountyDetailReq): SagaIterator {
  const { tenantId, id, successCb, failureCb, searchTerm } = action.payload;
  try {
    if (searchTerm) {
      const {
        data: { entityList: userResponse }
      } = yield call(fetchSubCountyAdmins, {
        tenantId,
        searchTerm,
        roleNames: [APPCONSTANTS.ROLES.SUB_COUNTY_ADMIN]
      });
      yield put(operatinUnitActions.searchUserSuccess(userResponse || []));
    } else {
      const {
        data: {
          entity: { users: subCountyAdmins, ...subCountyDetail }
        }
      } = yield call(subCountyAPI.getSubCountyDetails, { tenantId, id });
      yield put(
        operatinUnitActions.fetchSubCountyDetailSuccess({
          subCountyDetail: {
            ...subCountyDetail,
            county: {
              id: subCountyDetail.countryId,
              name: subCountyDetail.countyName
            }
          },
          subCountyAdmins
        })
      );
      successCb?.();
    }
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(operatinUnitActions.fetchSubCountyDetailFail(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_SUB_COUNTY_LIST_REQUEST action
*/
export function* fetchSubCountyList({
  tenantId,
  skip,
  limit,
  search,
  failureCb
}: IFetchSubCountyListRequest): SagaIterator {
  try {
    const {
      data: { entityList: subCountyList, totalCount: total }
    } = yield call(subCountyAPI.fetchSubCountyList, tenantId, limit, skip, search);
    const payload = { subCountyList: subCountyList || [], total };
    yield put(operatinUnitActions.fetchSubCountyListSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(operatinUnitActions.fetchSubCountyListFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on CREATE_SUB_COUNTY_REQUEST action
*/
export function* createSubCounty(action: ICreateSubCountyRequest) {
  try {
    yield call(subCountyAPI.createSubCounty, action.payload);
    action.successCb?.();
    yield put(operatinUnitActions.createSubCountySuccess());
  } catch (e) {
    if (e instanceof Error) {
      action.failureCb?.(e);
    }
    yield put(operatinUnitActions.createSubCountyFailure());
  }
}

/*
  Worker Saga: Fired on UPDATE_SUB_COUNTY_REQUEST action
*/
export function* updateSubCounty(action: IUpdateSubCountyRequest) {
  try {
    const { payload } = action;
    yield call(subCountyAPI.updateSubCounty, payload);
    action.successCb?.();
    let newOuDetail;
    if (action.isSuccessPayloadNeeded) {
      newOuDetail = {
        name: payload.name
      };
    }
    yield put(operatinUnitActions.updateSubCountySuccess(newOuDetail));
  } catch (e) {
    if (e instanceof Error) {
      action.failureCb?.(e);
    }
    yield put(operatinUnitActions.updateSubCountyFailure());
  }
}

/*
  Worker Saga: Fired on UPDATE_SUB_COUNTY_ADMIN_REQUEST action
*/
export function* updateSubCountyAdmin(action: IUpdateSubCountyAdminRequest) {
  try {
    yield call(subCountyAPI.updateSubCountyAdmin, action.payload);
    action.successCb?.();
    yield put(operatinUnitActions.updateSubCountyAdminSuccess());
  } catch (e) {
    if (e instanceof Error) {
      action.failureCb?.(e);
    }
    yield put(operatinUnitActions.updateSubCountyAdminFailure());
  }
}

/*
  Worker Saga: Fired on CREATE_SUB_COUNTY_ADMIN_REQUEST action
*/
export function* createSubCountyAdmin(action: ICreateSubCountyAdminRequest) {
  try {
    yield call(subCountyAPI.createSubCountyAdmin, action.payload);
    action.successCb?.();
    yield put(operatinUnitActions.createSubCountyAdminSuccess());
  } catch (e) {
    if (e instanceof Error) {
      action.failureCb?.(e);
    }
    yield put(operatinUnitActions.createSubCountyAdminFailure());
  }
}

/*
  Worker Saga: Fired on DELETE_SUB_COUNTY_ADMIN_REQUEST action
*/
export function* deleteSubCountyAdmin(action: IDeleteSubCountyAdminRequest) {
  try {
    yield call(subCountyAPI.deleteSubCountyAdmin, action.payload);
    action.successCb?.();
    yield put(operatinUnitActions.deleteSubCountyAdminSuccess());
  } catch (e) {
    if (e instanceof Error) {
      action.failureCb?.(e);
    }
    yield put(operatinUnitActions.deleteSubCountyAdminFailure());
  }
}

/*
  Worker Saga: Fired on FETCH_SUB_COUNTY_BY_ID_REQUEST action
*/
export function* fetchSubCountyById(action: IFetchSubCountyByIdRequest): SagaIterator {
  try {
    const {
      data: { entity: data }
    } = yield call(subCountyAPI.fetchSubCountyById, action.payload);
    action.successCb?.({ ...data, county: { id: data.county?.id || data.county } });
    yield put(operatinUnitActions.fetchSubCountyByIdSuccess());
  } catch (e) {
    if (e instanceof Error) {
      action.failureCb?.(e);
    }
    yield put(operatinUnitActions.fetchSubCountyByIdFailure());
  }
}

/*
  Worker Saga: Fired on FETCH_SUB_COUNTY_DROPDOWN_REQUEST action
*/
export function* getOUListForDropdown({ tenantId }: ISubCountyDropdownRequest): SagaIterator {
  try {
    const {
      data: { entityList: subCountyList, total, limit }
    } = yield call(subCountyAPI.fetchSubCountyForDropdown as any, { tenantId });
    const payload = { subCountyList: subCountyList || [], total, limit };
    yield put(fetchSubCountyDropdownSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      yield put(fetchSubCountyDropdownFailure(e));
    }
  }
}

/*
  Starts worker saga on latest dispatched specific action.
  Allows concurrent increments.
*/
function* subCountySaga() {
  yield all([takeLatest(ACTION_TYPES.FETCH_SUB_COUNTY_DASHBOARD_LIST_REQUEST, fetchSubCountyDashboardList)]);
  yield all([takeLatest(ACTION_TYPES.FETCH_SUB_COUNTY_DETAIL_REQUEST, fetchSubCountyDetail)]);
  yield all([takeLatest(ACTION_TYPES.FETCH_SUB_COUNTY_LIST_REQUEST, fetchSubCountyList)]);
  yield all([takeLatest(ACTION_TYPES.CREATE_SUB_COUNTY_REQUEST, createSubCounty)]);
  yield all([takeLatest(ACTION_TYPES.UPDATE_SUB_COUNTY_REQUEST, updateSubCounty)]);
  yield all([takeLatest(ACTION_TYPES.UPDATE_SUB_COUNTY_ADMIN_REQUEST, updateSubCountyAdmin)]);
  yield all([takeLatest(ACTION_TYPES.CREATE_SUB_COUNTY_ADMIN_REQUEST, createSubCountyAdmin)]);
  yield all([takeLatest(ACTION_TYPES.DELETE_SUB_COUNTY_ADMIN_REQUEST, deleteSubCountyAdmin)]);
  yield all([takeLatest(ACTION_TYPES.FETCH_SUB_COUNTY_BY_ID_REQUEST, fetchSubCountyById)]);
  yield all([takeLatest(ACTION_TYPES.FETCH_SUB_COUNTY_DROPDOWN_REQUEST, getOUListForDropdown)]);
}

export default subCountySaga;
