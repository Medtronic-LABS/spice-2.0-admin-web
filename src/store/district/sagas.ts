import { SagaIterator } from 'redux-saga';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import * as districtService from '../../services/districtAPI';
import { fetchDistrictAdmins as fetchDistrictAdminsApi } from '../../services/districtAPI';
import {
  IFetchDistrictListRequest,
  ICreateDistrictRequest,
  IFetchDistrictDetailReq,
  IFetchDashboardDistrict,
  IUpdateDistrictReq,
  IUpdateDistrictAdminReq,
  ICreateDistrictAdminReq,
  IDeleteDistrictAdminReq,
  IDeactivateDistrictReq,
  IFetchDistrictOptionsRequest,
  IActivateAccountReq,
  IDistrict,
  IFetchDistrictOptionsPayload
} from './types';
import * as districtActions from './actions';
import * as hfActions from '../healthFacility/actions';
import {
  FETCH_DISTRICT_LIST_REQUEST,
  CREATE_DISTRICT_REQUEST,
  FETCH_DISTRICT_DETAIL_REQUEST,
  FETCH_DISTRICT_DASHBOARD_LIST_REQUEST,
  UPDATE_DISTRICT_DETAIL_REQUEST,
  CREATE_DISTRICT_ADMIN_REQUEST,
  UPDATE_DISTRICT_ADMIN_REQUEST,
  DELETE_DISTRICT_ADMIN_REQUEST,
  DEACTIVATE_DISTRICT_REQUEST,
  FETCH_DISTRICT_OPTIONS_REQUEST,
  ACTIVATE_ACCOUNT_REQUEST
} from './actionTypes';
import { AppState } from '../rootReducer';
import APPCONSTANTS from '../../constants/appConstants';

/*
  Worker Saga: Fired on FETCH_DISTRICT_LIST_REQUEST action
*/
export function* fetchDistrictList({
  countryId,
  tenantId,
  isActive,
  skip,
  limit,
  search,
  successCb,
  failureCb
}: IFetchDistrictListRequest): SagaIterator {
  try {
    let response: { entityList: IDistrict[]; totalCount: number };
    const appTypes = yield select((state: AppState) => state.user?.user?.appTypes);
    if (!isActive) {
      const { data } = yield call(
        districtService.fetchDeactivatedAccounts as any,
        skip,
        limit,
        undefined,
        search,
        tenantId
      );
      response = data;
    } else {
      const { data } = yield call(
        districtService.fetchDistrictList as any,
        countryId,
        tenantId,
        isActive,
        skip,
        limit,
        appTypes,
        search
      );
      response = data;
    }
    const payload = { districtList: response?.entityList || [], total: response.totalCount };
    successCb?.(payload);
    yield put(districtActions.fetchDistrictListSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(districtActions.fetchDistrictListFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on CREATE_DISTRICT_REQUEST action
*/
export function* createDistrict({ data, successCb, failureCb }: ICreateDistrictRequest): SagaIterator {
  try {
    yield call(districtService.createDistrict, data);
    successCb?.();
    yield put(districtActions.createDistrictSuccess());
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(districtActions.createDistrictFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_DISTRICT_DETAIL_REQUEST action
*/
export function* fetchDistrictDetail(action: IFetchDistrictDetailReq): SagaIterator {
  const { tenantId, id, successCb, failureCb, searchTerm, countryId } = action.payload;
  try {
    if (searchTerm) {
      const {
        data: { entityList }
      } = yield call(fetchDistrictAdminsApi as any, {
        tenantId,
        searchTerm,
        ...(countryId && { countryId }),
        roleNames: [APPCONSTANTS.ROLES.DISTRICT_ADMIN],
        appTypes: yield select((state: AppState) => state.user?.user?.appTypes)
      });
      yield put(districtActions.searchUserSuccess(entityList || []));
    } else {
      const response = yield call(districtService.fetchDistrictDetails, {
        tenantId: Number(tenantId),
        id: Number(id)
      });
      yield put(districtActions.fetchDistrictDetailSuccess(response.data?.entity));
      successCb?.(response.data?.entity);
    }
  } catch (e: any) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(districtActions.fetchDistrictDetailFail(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_DISTRICT_DASHBOARD_LIST_REQUEST action
*/
export function* getDashboardDistrict(action: IFetchDashboardDistrict): SagaIterator {
  try {
    const { skip, limit, searchTerm, successCb, isLoadMore } = action.payload;
    const tenantId = yield select((state: AppState) => state.user.user.tenantId);
    const {
      data: { entityList: data, totalCount: total }
    }: any = yield call(districtService.fetchDashboardDistrict as any, {
      skip,
      limit,
      tenantId,
      searchTerm: searchTerm || ''
    });
    successCb?.();
    const payload = { data: data || [], total, isLoadMore };
    yield put(districtActions.fetchDashboardDistrictSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      action.payload.failureCb?.(e);
      yield put(districtActions.fetchDashboardDistrictFail(e));
    }
  }
}

/*
  Worker Saga: Fired on UPDATE_DISTRICT_DETAIL_REQUEST action
*/
export function* updateDistrictDetail({ data, successCb, failureCb }: IUpdateDistrictReq): SagaIterator {
  try {
    yield call(districtService.updateDistrict, data);
    successCb?.();
    yield put(districtActions.updateDistrictDetailSuccess(data));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(districtActions.updateDistrictDetailFail(e));
    }
  }
}

/*
  Worker Saga: Fired on UPDATE_DISTRICT_ADMIN_REQUEST action
*/
export function* updateDistrictAdminInfo({ data, successCb, failureCb }: IUpdateDistrictAdminReq): SagaIterator {
  try {
    yield call(districtService.updateDistrictAdmin, data);
    yield put(districtActions.updateDistrictAdminSuccess());
    successCb?.();
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(districtActions.updateDistrictAdminFail(e));
    }
  }
}

/*
  Worker Saga: Fired on CREATE_DISTRICT_ADMIN_REQUEST action
*/
export function* createDistrictAdminInfo({ data, successCb, failureCb }: ICreateDistrictAdminReq): SagaIterator {
  try {
    yield call(districtService.createDistrictAdmin, data);
    yield put(districtActions.createDistrictAdminSuccess());
    successCb?.();
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(districtActions.createDistrictAdminFail(e));
    }
  }
}

/*
  Worker Saga: Fired on DELETE_DISTRICT_ADMIN_REQUEST action
*/
export function* removeDistrictAdmin({ data, successCb, failureCb }: IDeleteDistrictAdminReq) {
  try {
    yield call(districtService.deleteDistrictAdmin, data);
    yield put(districtActions.deleteDistrictAdminSuccess());
    successCb?.();
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(districtActions.deleteDistrictAdminFail(e));
    }
  }
}

/*
  Worker Saga: Fired on DEACTIVATE_DISTRICT_REQUEST action
*/
export function* deactivateDistrict({ data, successCb, failureCb }: IDeactivateDistrictReq) {
  try {
    yield call(districtService.deactivateDistrict, data);
    yield put(districtActions.deactivateDistrictSuccess());
    yield put(hfActions.clearHFDropdown());
    successCb?.();
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(districtActions.deactivateDistrictFail(e));
    }
  }
}

/*
  Worker Saga: Fired on ACTIVATE_ACCOUNT_REQUEST action
*/
export function* activateAccount({ data, successCb, failureCb }: IActivateAccountReq) {
  try {
    yield call(districtService.activateAccount, data);
    yield put(districtActions.activateAccountSuccess());
    successCb?.();
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(districtActions.activateAccountFail(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_DISTRICT_OPTIONS_REQUEST action
*/
export function* fetchDistrictOptions(action: IFetchDistrictOptionsRequest): SagaIterator {
  try {
    const {
      data: { entityList: data }
    } = yield call(districtService.fetchDistrictOptions, {
      tenantId: action.tenantId,
      skip: 0,
      limit: null,
      searchTerm: ''
    } as IFetchDistrictOptionsPayload);
    yield put(districtActions.fetchDistrictOptionsSuccess(data));
  } catch (e) {
    yield put(districtActions.fetchDistrictOptionsFailure());
  }
}

/*
  Starts worker saga on latest dispatched specific action.
*/
function* districtSaga() {
  yield all([takeLatest(FETCH_DISTRICT_LIST_REQUEST, fetchDistrictList)]);
  yield all([takeLatest(CREATE_DISTRICT_REQUEST, createDistrict)]);
  yield all([takeLatest(FETCH_DISTRICT_DETAIL_REQUEST, fetchDistrictDetail)]);
  yield all([takeLatest(FETCH_DISTRICT_DASHBOARD_LIST_REQUEST, getDashboardDistrict)]);
  yield all([takeLatest(UPDATE_DISTRICT_DETAIL_REQUEST, updateDistrictDetail)]);
  yield all([takeLatest(UPDATE_DISTRICT_ADMIN_REQUEST, updateDistrictAdminInfo)]);
  yield all([takeLatest(CREATE_DISTRICT_ADMIN_REQUEST, createDistrictAdminInfo)]);
  yield all([takeLatest(DELETE_DISTRICT_ADMIN_REQUEST, removeDistrictAdmin)]);
  yield all([takeLatest(ACTIVATE_ACCOUNT_REQUEST, activateAccount)]);
  yield all([takeLatest(DEACTIVATE_DISTRICT_REQUEST, deactivateDistrict)]);
  yield all([takeLatest(FETCH_DISTRICT_OPTIONS_REQUEST, fetchDistrictOptions)]);
}

export default districtSaga;
