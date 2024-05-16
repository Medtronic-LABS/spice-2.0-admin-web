import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as hfService from '../../services/healthFacilityAPI';
import {
  ICreateHFRequest,
  IFetchHFSummaryRequest,
  IUpdateHFDetailsRequest,
  IDeleteHFUserRequest,
  IFetchHFUserListRequest,
  IFetchHFListRequest,
  ICreateHFUserRequest,
  IUpdateHFUserRequest,
  IFetchChiefdomListRequest,
  IFetchDistrictListRequest,
  IFetchVillagesListRequest,
  IFetchPeerSupervisorListRequest,
  IFetchWorkflowListRequest,
  IPeerSupervisor,
  IFetchHFTypesRequest,
  IFetchVillagesListFromHFRequest,
  IFetchUserDetailRequest,
  IDeleteHFRequest
} from '../healthFacility/types';
import {
  fetchHFListSuccess,
  fetchHFListFailure,
  createHFSuccess,
  createHFFailure,
  fetchHFSummarySuccess,
  fetchHFSummaryFailure,
  updateHFDetailsSuccess,
  updateHFDetailsFailure,
  deleteHFUserSuccess,
  deleteHFUserFailure,
  fetchHFUserListSuccess,
  fetchHFUserListFailure,
  createHFUserSuccess,
  createHFUserFailure,
  updateHFUserSuccess,
  updateHFUserFailure,
  fetchChiefdomListSuccess,
  fetchChiefdomListFailure,
  fetchDistrictListSuccess,
  fetchDistrictListFailure,
  fetchVillagesListSuccess,
  fetchVillagesListFailure,
  fetchPeerSupervisorListSuccess,
  fetchPeerSupervisorListFailure,
  fetchWorkflowListSuccess,
  fetchWorkflowListFailure,
  fetchHFTypesSuccess,
  fetchHFTypesFailure,
  fetchVillagesListFromHFSuccess,
  fetchVillagesListFromHFFailure,
  fetchUserDetailSuccess,
  fetchUserDetailFailure,
  fetchCultureListSuccess,
  fetchCultureListFailure,
  fetchCountryListSuccess,
  fetchCountryListFailure,
  deleteHealthFacilitySuccess,
  deleteHealthFacilityFailure
} from './actions';
import {
  FETCH_HEALTH_FACILITY_LIST_REQUEST,
  CREATE_HEALTH_FACILITY_REQUEST,
  FETCH_HEALTH_FACILITY_SUMMARY_REQUEST,
  UPDATE_HEALTH_FACILITY_DETAILS_REQUEST,
  FETCH_HEALTH_FACILITY_USER_LIST_REQUEST,
  DELETE_HEALTH_FACILITY_USER_REQUEST,
  CREATE_HEALTH_FACILITY_USER_REQUEST,
  UPDATE_HEALTH_FACILITY_USER_REQUEST,
  FETCH_CHIEFDOM_LIST_REQUEST,
  FETCH_DISTRICT_LIST_REQUEST,
  FETCH_VILLAGES_LIST_REQUEST,
  FETCH_PEER_SUPERVISOR_LIST_REQUEST,
  FETCH_WORKFLOW_LIST_REQUEST,
  FETCH_HEALTH_FACILITY_TYPES_REQUEST,
  FETCH_VILLAGES_LIST_FROM_HF_REQUEST,
  FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST,
  FETCH_CULTURE_LIST_REQUEST,
  FETCH_COUNTRY_LIST_REQUEST,
  DELETE_HEALTH_FACILITY_REQUEST
} from './actionTypes';
import ApiError from '../../global/ApiError';

/*
  Worker Saga: Fired on FETCH_REGIONS_REQUEST action
*/
export function* fetchHealthFacilityList({
  countryId,
  skip,
  limit,
  searchTerm,
  userBased,
  tenantBased,
  successCb,
  failureCb
}: IFetchHFListRequest): SagaIterator {
  try {
    const {
      data: { entityList: healthFacilities, totalCount: total }
    } = yield call(hfService.fetchHealthFacilityList as any, {
      countryId,
      limit,
      skip,
      searchTerm,
      userBased,
      tenantBased
    });
    const payload = { healthFacilityList: healthFacilities || [], total, limit };
    successCb?.({ healthFacilityList: healthFacilities || [], total, limit });
    yield put(fetchHFListSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchHFListFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on CREATE_SITE_REQUEST action
*/
export function* createHealthFacilityRequest({ data, successCb, failureCb }: ICreateHFRequest): SagaIterator {
  try {
    yield call(hfService.createHealthFacility as any, data);
    successCb?.();
    yield put(createHFSuccess());
  } catch (e) {
    if (e instanceof ApiError) {
      failureCb?.(e);
      yield put(createHFFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on DELETE_HEALTH_FACILITY_REQUEST action
*/
export function* deleteHFRequest({ data, successCb, failureCb }: IDeleteHFRequest): SagaIterator {
  try {
    yield call(hfService.deleteHealtFacility as any, data);
    yield put(deleteHealthFacilitySuccess());
    successCb?.();
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(deleteHealthFacilityFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST action
*/
export function* fetchUserDetailRequest({ id, successCb, failureCb }: IFetchUserDetailRequest): SagaIterator {
  try {
    const {
      data: { entity: user }
    } = yield call(hfService.fetchHFUserDetail as any, id);
    successCb?.(user);
    yield put(fetchUserDetailSuccess(user));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchUserDetailFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_HEALTH_FACILITY_SUMMARY_REQUEST action
*/
export function* fetchHFSummaryRequest({ tenantId, id, successCb, failureCb }: IFetchHFSummaryRequest): SagaIterator {
  try {
    const {
      data: { entity: hfSummary }
    } = yield call(hfService.fetchHFSummary as any, tenantId, id);
    const hfDetail = {
      ...hfSummary,
      peerSupervisors: hfSummary.peerSupervisors.map((supervisor: IPeerSupervisor) => ({
        ...supervisor,
        name: `${supervisor.firstName} ${supervisor.lastName}`
      }))
    };
    successCb?.(hfDetail);
    yield put(fetchHFSummarySuccess(hfDetail));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchHFSummaryFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on UPDATE_HEALTH_FACILITY_BASIC_DETAILS_REQUEST action
*/
export function* updateHFDetailsRequest({ data, successCb, failureCb }: IUpdateHFDetailsRequest): SagaIterator {
  try {
    yield call(hfService.updateHFDetails as any, data);
    successCb?.();
    yield put(updateHFDetailsSuccess());
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(updateHFDetailsFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_HEALTH_FACILITY_TYPES_REQUEST action
*/
export function* fetchHFTypesSaga({ successCb, failureCb }: IFetchHFTypesRequest): SagaIterator {
  try {
    const {
      data: { entity: list }
    } = yield call(hfService.fetchHealthFacilityTypes as any);
    successCb?.(list);
    yield put(fetchHFTypesSuccess(list));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchHFTypesFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_HEALTH_FACILITY_USER_LIST_REQUEST action
*/
export function* fetchHFUserList({
  countryId,
  tenantId,
  skip,
  limit,
  searchTerm,
  userBased,
  tenantBased,
  successCb,
  failureCb
}: IFetchHFUserListRequest): SagaIterator {
  try {
    const {
      data: { entityList: hfUsers, totalCount: total }
    } = yield call(hfService.fetchHFUserList as any, {
      countryId,
      tenantId,
      limit,
      skip,
      searchTerm,
      userBased,
      tenantBased
    });
    const payload = { users: hfUsers || [], total, limit };
    yield put(fetchHFUserListSuccess(payload));
    successCb?.(hfUsers, total);
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchHFUserListFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on DELETE_HEALTH_FACILITY_USER_REQUEST action
*/
export function* deleteHFUserRequest({ data, successCb, failureCb }: IDeleteHFUserRequest): SagaIterator {
  try {
    yield call(hfService.deleteHFUser as any, data);
    yield put(deleteHFUserSuccess());
    successCb?.();
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(deleteHFUserFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on CREATE_HEALTH_FACILITY_USER_REQUEST action
*/
export function* createHFUserSagaRequest({ data, successCb, failureCb }: ICreateHFUserRequest): SagaIterator {
  try {
    yield call(hfService.addHFUser as any, data);
    successCb?.();
    yield put(createHFUserSuccess());
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(createHFUserFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on UPDATE_HEALTH_FACILITY_USER_REQUEST action
*/
export function* updateHFUserSagaRequest({ data, successCb, failureCb }: IUpdateHFUserRequest): SagaIterator {
  try {
    yield call(hfService.updateHFUser as any, data);
    successCb?.();
    yield put(updateHFUserSuccess());
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(updateHFUserFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_DISTRICT_LIST_REQUEST action
*/
export function* fetchDistrictListSagaRequest({
  countryId,
  successCb,
  failureCb
}: IFetchDistrictListRequest): SagaIterator {
  try {
    const {
      data: { entity: list },
      totalCount: total
    } = yield call(hfService.fetchDistrictList as any, countryId);
    successCb?.(list, total);
    yield put(fetchDistrictListSuccess({ list, total }));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchDistrictListFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_CHIEFDOM_LIST_REQUEST action
*/
export function* fetchChiefdomListSagaRequest({
  countryId,
  districtId,
  successCb,
  failureCb
}: IFetchChiefdomListRequest): SagaIterator {
  try {
    const {
      data: { entity: list },
      totalCount: total
    } = yield call(hfService.fetchChiefdomList as any, countryId, districtId);
    successCb?.(list, total);
    yield put(fetchChiefdomListSuccess({ list, total }));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchChiefdomListFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_VILLAGES_LIST_REQUEST action
*/
export function* fetchVillagesListSagaRequest({
  countryId,
  districtId,
  chiefdomId,
  successCb,
  failureCb
}: IFetchVillagesListRequest): SagaIterator {
  try {
    const {
      data: { entity: list },
      totalCount: total
    } = yield call(hfService.fetchVillagesList as any, countryId, districtId, chiefdomId);
    successCb?.(list, total);
    yield put(fetchVillagesListSuccess({ list, total }));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchVillagesListFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_VILLAGES_LIST_FOR_HF_REQUEST action
*/
export function* fetchVillagesListFromHFSagaRequest({
  tenantIds,
  successCb,
  failureCb
}: IFetchVillagesListFromHFRequest): SagaIterator {
  try {
    const {
      data: { entity: list }
    } = yield call(hfService.fetchVillagesListfromHF as any, tenantIds);
    successCb?.({ list, hfTenantIds: tenantIds });
    yield put(fetchVillagesListFromHFSuccess({ data: { list, hfTenantIds: tenantIds } }));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchVillagesListFromHFFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_PEER_SUPERVISOR_LIST_REQUEST action
*/
export function* fetchPeerSupervisorListSagaRequest({
  tenantIds,
  successCb,
  failureCb
}: IFetchPeerSupervisorListRequest): SagaIterator {
  try {
    const {
      data: { entity: peerSupervisorList },
      totalCount: total
    } = yield call(hfService.fetchPeerSupervisorList as any, tenantIds);
    const list = peerSupervisorList.map((supervisor: IPeerSupervisor) => ({
      ...supervisor,
      name: `${supervisor.firstName} ${supervisor.lastName}`
    }));
    successCb?.({ list, hfTenantIds: tenantIds }, total);
    yield put(fetchPeerSupervisorListSuccess({ data: { list, hfTenantIds: tenantIds }, total }));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchPeerSupervisorListFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_WORKFLOW_LIST_REQUEST action
*/
export function* fetchWorkflowListSagaRequest({
  countryId,
  successCb,
  failureCb
}: IFetchWorkflowListRequest): SagaIterator {
  try {
    const {
      data: { entityList: list }
    } = yield call(hfService.fetchWorkflowList as any, { countryId });
    successCb?.(list);
    yield put(fetchWorkflowListSuccess({ list }));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchWorkflowListFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_CULTURE_LIST_REQUEST action
*/
export function* fetchCultureList(): SagaIterator {
  try {
    const {
      data: { entity: cultureList }
    } = yield call(hfService.fetchCultureList);
    yield put(fetchCultureListSuccess(cultureList || []));
  } catch (e) {
    yield put(fetchCultureListFailure());
  }
}

/*
  Worker Saga: Fired on FETCH_COUNTRY_LIST_REQUEST action
*/
export function* fetchCountryList(): SagaIterator {
  try {
    const {
      data: { entity: countryList }
    } = yield call(hfService.fetchCountryCodeList);
    const countryCodeList = countryList.map((code: any) => ({
      phoneNumberCode: code,
      id: code
    }));
    yield put(fetchCountryListSuccess(countryCodeList || []));
  } catch (e) {
    yield put(fetchCountryListFailure());
  }
}

/*
  Starts worker saga on latest dispatched specific action.
  Allows concurrent increments.
*/
function* healthFacilitySaga() {
  yield all([takeLatest(FETCH_HEALTH_FACILITY_LIST_REQUEST, fetchHealthFacilityList)]);
  yield all([takeLatest(CREATE_HEALTH_FACILITY_REQUEST, createHealthFacilityRequest)]);
  yield all([takeLatest(DELETE_HEALTH_FACILITY_REQUEST, deleteHFRequest)]);
  yield all([takeLatest(FETCH_HEALTH_FACILITY_SUMMARY_REQUEST, fetchHFSummaryRequest)]);
  yield all([takeLatest(UPDATE_HEALTH_FACILITY_DETAILS_REQUEST, updateHFDetailsRequest)]);
  yield all([takeLatest(FETCH_HEALTH_FACILITY_USER_LIST_REQUEST, fetchHFUserList)]);
  yield all([takeLatest(FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST, fetchUserDetailRequest)]);
  yield all([takeLatest(DELETE_HEALTH_FACILITY_USER_REQUEST, deleteHFUserRequest)]);
  yield all([takeLatest(UPDATE_HEALTH_FACILITY_USER_REQUEST, updateHFUserSagaRequest)]);
  yield all([takeLatest(CREATE_HEALTH_FACILITY_USER_REQUEST, createHFUserSagaRequest)]);
  yield all([takeLatest(FETCH_DISTRICT_LIST_REQUEST, fetchDistrictListSagaRequest)]);
  yield all([takeLatest(FETCH_CHIEFDOM_LIST_REQUEST, fetchChiefdomListSagaRequest)]);
  yield all([takeLatest(FETCH_VILLAGES_LIST_REQUEST, fetchVillagesListSagaRequest)]);
  yield all([takeLatest(FETCH_PEER_SUPERVISOR_LIST_REQUEST, fetchPeerSupervisorListSagaRequest)]);
  yield all([takeLatest(FETCH_WORKFLOW_LIST_REQUEST, fetchWorkflowListSagaRequest)]);
  yield all([takeLatest(FETCH_HEALTH_FACILITY_TYPES_REQUEST, fetchHFTypesSaga)]);
  yield all([takeLatest(FETCH_VILLAGES_LIST_FROM_HF_REQUEST, fetchVillagesListFromHFSagaRequest)]);
  yield all([takeLatest(FETCH_CULTURE_LIST_REQUEST, fetchCultureList)]);
  yield all([takeLatest(FETCH_COUNTRY_LIST_REQUEST, fetchCountryList)]);
}

export default healthFacilitySaga;
