import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest, select } from 'redux-saga/effects';

import * as chiefdomAPI from '../../services/chiefdomAPI';
import * as operatinUnitActions from './actions';
import {
  IFetchChiefdomDashboardListRequest,
  IFetchChiefdomDetailReq,
  IFetchChiefdomListRequest,
  ICreateChiefdomRequest,
  IUpdateChiefdomRequest,
  IUpdateChiefdomAdminRequest,
  IDeleteChiefdomAdminRequest,
  IFetchChiefdomByIdRequest,
  ICreateChiefdomAdminRequest,
  IChiefdomDropdownRequest
} from './types';
import * as ACTION_TYPES from './actionTypes';
import { AppState } from '../rootReducer';
import { fetchChiefdomAdmins } from '../../services/chiefdomAPI';
import { fetchChiefdomDropdownFailure, fetchChiefdomDropdownSuccess } from './actions';
import APPCONSTANTS from '../../constants/appConstants';

/*
  Worker Saga: Fired on FETCH_CHIEFDOM_DASHBOARD_LIST_REQUEST action
*/
export function* fetchChiefdomDashboardList({
  isLoadMore,
  skip,
  limit,
  search,
  successCb,
  failureCb
}: IFetchChiefdomDashboardListRequest): SagaIterator {
  try {
    const tenantId = yield select((state: AppState) => state.user.user.tenantId);
    const appTypes = yield select((state: AppState) => state.user?.user?.appTypes);
    const {
      data: { entityList: chiefdomDashboardList, totalCount: total }
    } = yield call(chiefdomAPI.fetchChiefdomDashboardList as any, tenantId, limit, skip, undefined, appTypes, search);
    const payload = { chiefdomDashboardList: chiefdomDashboardList || [], total, isLoadMore };
    successCb?.(payload);
    yield put(operatinUnitActions.fetchChiefdomDashboardListSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(operatinUnitActions.fetchChiefdomDashboardListFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_CHIEFDOM_DETAIL_REQUEST action
*/
export function* fetchChiefdomDetail(action: IFetchChiefdomDetailReq): SagaIterator {
  const { tenantId, id, successCb, failureCb, searchTerm, countryId } = action.payload;
  try {
    if (searchTerm) {
      const {
        data: { entityList: userResponse }
      } = yield call(fetchChiefdomAdmins, {
        tenantId,
        searchTerm,
        ...(countryId && { countryId }),
        roleNames: [APPCONSTANTS.ROLES.CHIEFDOM_ADMIN],
        appTypes: yield select((state: AppState) => state.user?.user?.appTypes)
      });
      yield put(operatinUnitActions.searchUserSuccess(userResponse || []));
    } else {
      const {
        data: {
          entity: { users: chiefdomAdmins, ...chiefdomDetail }
        }
      } = yield call(chiefdomAPI.getChiefdomDetails, { tenantId, id });
      yield put(
        operatinUnitActions.fetchChiefdomDetailSuccess({
          chiefdomDetail: {
            ...chiefdomDetail,
            district: {
              id: chiefdomDetail.districtId,
              name: chiefdomDetail.districtName,
              tenantId: chiefdomDetail?.districtTenantId
            }
          },
          chiefdomAdmins
        })
      );
      successCb?.();
    }
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(operatinUnitActions.fetchChiefdomDetailFail(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_CHIEFDOM_LIST_REQUEST action
*/
export function* fetchChiefdomList({
  tenantId,
  skip,
  limit,
  search,
  failureCb
}: IFetchChiefdomListRequest): SagaIterator {
  try {
    const {
      data: { entityList: chiefdomList, totalCount: total }
    } = yield call(chiefdomAPI.fetchChiefdomList, tenantId, limit, skip, search);
    const payload = { chiefdomList: chiefdomList || [], total };
    yield put(operatinUnitActions.fetchChiefdomListSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(operatinUnitActions.fetchChiefdomListFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on CREATE_CHIEFDOM_REQUEST action
*/
export function* createChiefdom(action: ICreateChiefdomRequest) {
  try {
    yield call(chiefdomAPI.createChiefdom, action.payload);
    action.successCb?.();
    yield put(operatinUnitActions.createChiefdomSuccess());
  } catch (e) {
    if (e instanceof Error) {
      action.failureCb?.(e);
    }
    yield put(operatinUnitActions.createChiefdomFailure());
  }
}

/*
  Worker Saga: Fired on UPDATE_CHIEFDOM_REQUEST action
*/
export function* updateChiefdom(action: IUpdateChiefdomRequest) {
  try {
    const { payload } = action;
    yield call(chiefdomAPI.updateChiefdom, payload);
    action.successCb?.();
    let newOuDetail;
    if (action.isSuccessPayloadNeeded) {
      newOuDetail = {
        name: payload.name
      };
    }
    yield put(operatinUnitActions.updateChiefdomSuccess(newOuDetail));
  } catch (e) {
    if (e instanceof Error) {
      action.failureCb?.(e);
    }
    yield put(operatinUnitActions.updateChiefdomFailure());
  }
}

/*
  Worker Saga: Fired on UPDATE_CHIEFDOM_ADMIN_REQUEST action
*/
export function* updateChiefdomAdmin(action: IUpdateChiefdomAdminRequest) {
  try {
    yield call(chiefdomAPI.updateChiefdomAdmin, action.payload);
    action.successCb?.();
    yield put(operatinUnitActions.updateChiefdomAdminSuccess());
  } catch (e) {
    if (e instanceof Error) {
      action.failureCb?.(e);
    }
    yield put(operatinUnitActions.updateChiefdomAdminFailure());
  }
}

/*
  Worker Saga: Fired on CREATE_CHIEFDOM_ADMIN_REQUEST action
*/
export function* createChiefdomAdmin(action: ICreateChiefdomAdminRequest) {
  try {
    yield call(chiefdomAPI.createChiefdomAdmin, action.payload);
    action.successCb?.();
    yield put(operatinUnitActions.createChiefdomAdminSuccess());
  } catch (e) {
    if (e instanceof Error) {
      action.failureCb?.(e);
    }
    yield put(operatinUnitActions.createChiefdomAdminFailure());
  }
}

/*
  Worker Saga: Fired on DELETE_CHIEFDOM_ADMIN_REQUEST action
*/
export function* deleteChiefdomAdmin(action: IDeleteChiefdomAdminRequest) {
  try {
    yield call(chiefdomAPI.deleteChiefdomAdmin, action.payload);
    action.successCb?.();
    yield put(operatinUnitActions.deleteChiefdomAdminSuccess());
  } catch (e) {
    if (e instanceof Error) {
      action.failureCb?.(e);
    }
    yield put(operatinUnitActions.deleteChiefdomAdminFailure());
  }
}

/*
  Worker Saga: Fired on FETCH_CHIEFDOM_BY_ID_REQUEST action
*/
export function* fetchChiefdomById(action: IFetchChiefdomByIdRequest): SagaIterator {
  try {
    const {
      data: { entity: data }
    } = yield call(chiefdomAPI.fetchChiefdomById, action.payload);
    action.successCb?.({ ...data, district: { id: data.district?.id || data.district } });
    yield put(operatinUnitActions.fetchChiefdomByIdSuccess());
  } catch (e) {
    if (e instanceof Error) {
      action.failureCb?.(e);
    }
    yield put(operatinUnitActions.fetchChiefdomByIdFailure());
  }
}

/*
  Worker Saga: Fired on FETCH_CHIEFDOM_DROPDOWN_REQUEST action
*/
export function* getChiefdomListForDropdown({ tenantId }: IChiefdomDropdownRequest): SagaIterator {
  try {
    const {
      data: { entityList: chiefdomList, total, limit }
    } = yield call(chiefdomAPI.fetchChiefdomForDropdown as any, { tenantId });
    const payload = { chiefdomList: chiefdomList || [], total, limit };
    yield put(fetchChiefdomDropdownSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      yield put(fetchChiefdomDropdownFailure(e));
    }
  }
}

/*
  Starts worker saga on latest dispatched specific action.
  Allows concurrent increments.
*/
function* chiefdomSaga() {
  yield all([takeLatest(ACTION_TYPES.FETCH_CHIEFDOM_DASHBOARD_LIST_REQUEST, fetchChiefdomDashboardList)]);
  yield all([takeLatest(ACTION_TYPES.FETCH_CHIEFDOM_DETAIL_REQUEST, fetchChiefdomDetail)]);
  yield all([takeLatest(ACTION_TYPES.FETCH_CHIEFDOM_LIST_REQUEST, fetchChiefdomList)]);
  yield all([takeLatest(ACTION_TYPES.CREATE_CHIEFDOM_REQUEST, createChiefdom)]);
  yield all([takeLatest(ACTION_TYPES.UPDATE_CHIEFDOM_REQUEST, updateChiefdom)]);
  yield all([takeLatest(ACTION_TYPES.UPDATE_CHIEFDOM_ADMIN_REQUEST, updateChiefdomAdmin)]);
  yield all([takeLatest(ACTION_TYPES.CREATE_CHIEFDOM_ADMIN_REQUEST, createChiefdomAdmin)]);
  yield all([takeLatest(ACTION_TYPES.DELETE_CHIEFDOM_ADMIN_REQUEST, deleteChiefdomAdmin)]);
  yield all([takeLatest(ACTION_TYPES.FETCH_CHIEFDOM_BY_ID_REQUEST, fetchChiefdomById)]);
  yield all([takeLatest(ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_REQUEST, getChiefdomListForDropdown)]);
}

export default chiefdomSaga;
