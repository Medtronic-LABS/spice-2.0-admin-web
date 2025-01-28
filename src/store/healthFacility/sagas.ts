import { SagaIterator } from 'redux-saga';
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

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
  IValidateLinkedRestrictions,
  IPeerSupervisor,
  IFetchHFTypesRequest,
  IFetchVillagesListFromHFRequest,
  IFetchUserDetailRequest,
  IDeleteHFRequest,
  IFetchHFDashboardListRequest,
  IFetchUnlinkedVillagesRequest,
  IPeerSupervisorValidation,
  IFetchVillagesListUserLinked,
  IWorkflow,
  IFetchCityListRequest
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
  deleteHealthFacilityFailure,
  fetchPeerSupervisorValidationsFailure,
  fetchHFDashboardListFailure,
  fetchHFDashboardListSuccess,
  fetchUnlinkedVillagesListSuccess,
  fetchUnlinkedVillagesListFailure,
  validateLinkedRestrictionsSuccess,
  validateLinkedRestrictionsFailure,
  fetchCityListSuccess,
  setAssignedHFListForHFAdmin,
  fetchCityListFailure
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
  FETCH_CHIEFDOM_LIST_REQUEST_FOR_HF,
  FETCH_DISTRICT_LIST_REQUEST_FOR_HF,
  FETCH_VILLAGES_LIST_REQUEST_FOR_HF,
  FETCH_PEER_SUPERVISOR_LIST_REQUEST,
  FETCH_WORKFLOW_LIST_REQUEST,
  FETCH_HEALTH_FACILITY_TYPES_REQUEST,
  FETCH_VILLAGES_LIST_FROM_HF_REQUEST,
  FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST,
  FETCH_CULTURE_LIST_REQUEST,
  FETCH_COUNTRY_LIST_REQUEST,
  DELETE_HEALTH_FACILITY_REQUEST,
  FETCH_PEER_SUPERVISOR_VALIDATION,
  FETCH_HF_DASHBOARD_LIST_REQUEST,
  LINKED_RESTRICTIONS_VALIDATION_REQUEST,
  FETCH_UNLINKED_VILLAGES_REQUEST,
  FETCH_VILLAGES_LIST_USER_LINKED,
  FETCH_CITY_LIST_REQUEST_FOR_HF
} from './actionTypes';
import ApiError from '../../global/ApiError';
import { AppState } from '../rootReducer';

/*
  Worker Saga: Fired on FETCH_HEALTH_FACILITY_LIST_REQUEST action
*/
export function* fetchHealthFacilityList({
  countryId,
  skip,
  limit,
  searchTerm,
  userBased,
  tenantBased,
  tenantIds,
  forHFAdmin,
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
      tenantIds,
      tenantBased
    });
    const payload = { healthFacilityList: healthFacilities || [], total, limit };
    successCb?.({ healthFacilityList: healthFacilities || [], total, limit });
    if (forHFAdmin) {
      yield put(setAssignedHFListForHFAdmin(payload));
    } else {
      yield put(fetchHFListSuccess(payload));
    }
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchHFListFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on CREATE_HEALTH_FACILITY_REQUEST action
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
    const appTypes = yield select((state: AppState) => state.user?.user?.appTypes);
    const {
      data: { entity: hfSummary }
    } = yield call(hfService.fetchHFSummary as any, tenantId, id, appTypes);
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
  Worker Saga: Fired on UPDATE_HEALTH_FACILITY_DETAILS_REQUEST action
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
  roleNames,
  isSiteUsers,
  tenantBased,
  tenantIds,
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
      roleNames,
      isSiteUsers,
      tenantBased,
      tenantIds,
      appTypes: yield select((state: AppState) => state.user?.user?.appTypes)
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
  Worker Saga: Fired on FETCH_DISTRICT_LIST_REQUEST_FOR_HF action
*/
export function* fetchDistrictListSagaRequest({
  countryId,
  successCb,
  failureCb
}: IFetchDistrictListRequest): SagaIterator {
  try {
    const appTypes = yield select((state: AppState) => state.user?.user?.appTypes);
    const {
      data: { entity: list },
      totalCount: total
    } = yield call(hfService.fetchDistrictList as any, countryId, appTypes);
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
  Worker Saga: Fired on FETCH_CHIEFDOM_LIST_REQUEST_FOR_HF action
*/
export function* fetchChiefdomListSagaRequest({
  countryId,
  districtId,
  successCb,
  failureCb
}: IFetchChiefdomListRequest): SagaIterator {
  try {
    const appTypes = yield select((state: AppState) => state.user?.user?.appTypes);
    const {
      data: { entity: list },
      totalCount: total
    } = yield call(hfService.fetchChiefdomList as any, countryId, districtId, appTypes);
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
  Worker Saga: Fired on FETCH_VILLAGES_LIST_REQUEST_FOR_HF action
*/
export function* fetchVillagesListSagaRequest({
  countryId,
  districtId,
  chiefdomId,
  successCb,
  failureCb
}: IFetchVillagesListRequest): SagaIterator {
  try {
    const appTypes = yield select((state: AppState) => state.user?.user?.appTypes);
    const {
      data: { entity: list },
      totalCount: total
    } = yield call(hfService.fetchVillagesList as any, countryId, districtId, chiefdomId, appTypes);
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
  Worker Saga: Fired on FETCH_CITY_LIST_REQUEST_FOR_HF action
*/
export function* fetchCityListSagaRequest({
  searchTerm,
  appTypes,
  successCb,
  failureCb
}: IFetchCityListRequest): SagaIterator {
  try {
    const { data } = yield call(hfService.fetchCityList, searchTerm, appTypes);
    successCb(data);
    yield put(fetchCityListSuccess());
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchCityListFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_UNLINKED_VILLAGES_REQUEST action
*/
export function* fetchUnlinkedVillagesSagaRequest({
  countryId,
  districtId,
  chiefdomId,
  healthFacilityId,
  successCb,
  failureCb
}: IFetchUnlinkedVillagesRequest): SagaIterator {
  try {
    const appTypes = yield select((state: AppState) => state.user?.user?.appTypes);
    const {
      data: { entity: list },
      totalCount: total
    } = yield call(
      hfService.fetchUnlinkedVillagesAPI as any,
      countryId,
      districtId,
      chiefdomId,
      appTypes,
      healthFacilityId
    );
    successCb?.(list, total);
    yield put(fetchUnlinkedVillagesListSuccess({ list, total }));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchUnlinkedVillagesListFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_VILLAGES_LIST_FROM_HF_REQUEST action
*/
export function* fetchVillagesListFromHFSagaRequest({
  countryId,
  districtId,
  chiefdomId,
  successCb,
  failureCb
}: IFetchVillagesListFromHFRequest): SagaIterator {
  try {
    const appTypes = yield select((state: AppState) => state.user?.user?.appTypes);
    const {
      data: { entity: list }
    } = yield call(hfService.fetchVillagesList as any, countryId, districtId, chiefdomId, appTypes);
    successCb?.({ list, hfTenantIds: [countryId] });
    yield put(fetchVillagesListFromHFSuccess({ data: { list, hfTenantIds: [countryId] } }));
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
  appTypes,
  successCb,
  failureCb
}: IFetchPeerSupervisorListRequest): SagaIterator {
  try {
    const {
      data: { entity: peerSupervisorList },
      totalCount: total
    } = yield call(hfService.fetchPeerSupervisorList as any, tenantIds, appTypes);
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
  Worker Saga: Fired on FETCH_VILLAGES_LIST_FOR_HF_REQUEST action
*/
export function* fetchVillagesListUserLinkedSagaRequest({
  tenantIds,
  userId,
  successCb,
  failureCb
}: IFetchVillagesListUserLinked): SagaIterator {
  try {
    const {
      data: { entity: list }
    } = yield call(hfService.fetchVillagesListfromHF as any, tenantIds, userId);
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
    const appTypes = yield select((state: AppState) => state.user?.user?.appTypes);
    let filteredWorkflows = [];
    // Current workflow filter based on appTypes
    if (appTypes && appTypes.length === 1) {
      filteredWorkflows = list.filter((workflow: IWorkflow) => {
        const workflowAppTypes = workflow.appTypes || [];
        return workflowAppTypes.includes(appTypes[0]);
      });
    } else {
      filteredWorkflows = list;
    }
    successCb?.(filteredWorkflows);
    yield put(fetchWorkflowListSuccess({ list: filteredWorkflows }));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchWorkflowListFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_PEER_SUPERVISOR_VALIDATION action
*/
export function* peerSupervisorValidationSagaRequest({
  ids,
  tenantId,
  appTypes,
  successCb,
  failureCb
}: IPeerSupervisorValidation): SagaIterator {
  try {
    const { data } = yield call(hfService.peerSupervisorValidation as any, { ids, tenantId, appTypes });
    successCb?.(data);
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchPeerSupervisorValidationsFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on LINKED_RESTRICTIONS_VALIDATION_REQUEST action
*/
export function* validateLinkedRestrictionsSagaRequest({
  ids,
  tenantId,
  healthFacilityId,
  linkedVillageIds,
  appTypes,
  successCb,
  failureCb
}: IValidateLinkedRestrictions): SagaIterator {
  try {
    const { data } = yield call(hfService.validateLinkedRestrictionsAPI as any, {
      ids,
      appTypes,
      tenantId,
      healthFacilityId,
      linkedVillageIds
    });
    successCb?.(data);
    yield put(validateLinkedRestrictionsSuccess());
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(validateLinkedRestrictionsFailure(e));
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
  Worker Saga: Fired on FETCH_HF_DASHBOARD_LIST_REQUEST action
*/
export function* fetchHealthFacilityDashboardList({
  isLoadMore,
  skip,
  limit,
  searchTerm,
  countryId,
  successCb,
  failureCb
}: IFetchHFDashboardListRequest): SagaIterator {
  try {
    const organizations = yield select((state: AppState) => state.user.user.organizations);
    const tenantIds = [...organizations].map((org: any) => org.id);
    const {
      data: { entityList: siteDashboardList, totalCount: total }
    } = yield call(hfService.fetchHealthFacilityList as any, {
      countryId,
      limit,
      skip,
      searchTerm,
      tenantIds
    });
    const payload = { siteDashboardList: siteDashboardList || [], total, isLoadMore };
    successCb?.(payload);
    yield put(fetchHFDashboardListSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchHFDashboardListFailure(e));
    }
  }
}

/*
  Starts worker saga on latest dispatched specific action.
  Allows concurrent increments.
*/
function* healthFacilitySaga() {
  yield all([takeEvery(FETCH_HEALTH_FACILITY_LIST_REQUEST, fetchHealthFacilityList)]);
  yield all([takeLatest(CREATE_HEALTH_FACILITY_REQUEST, createHealthFacilityRequest)]);
  yield all([takeLatest(DELETE_HEALTH_FACILITY_REQUEST, deleteHFRequest)]);
  yield all([takeLatest(FETCH_HEALTH_FACILITY_SUMMARY_REQUEST, fetchHFSummaryRequest)]);
  yield all([takeLatest(UPDATE_HEALTH_FACILITY_DETAILS_REQUEST, updateHFDetailsRequest)]);
  yield all([takeLatest(FETCH_HEALTH_FACILITY_USER_LIST_REQUEST, fetchHFUserList)]);
  yield all([takeLatest(FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST, fetchUserDetailRequest)]);
  yield all([takeLatest(DELETE_HEALTH_FACILITY_USER_REQUEST, deleteHFUserRequest)]);
  yield all([takeLatest(UPDATE_HEALTH_FACILITY_USER_REQUEST, updateHFUserSagaRequest)]);
  yield all([takeLatest(CREATE_HEALTH_FACILITY_USER_REQUEST, createHFUserSagaRequest)]);
  yield all([takeLatest(FETCH_DISTRICT_LIST_REQUEST_FOR_HF, fetchDistrictListSagaRequest)]);
  yield all([takeLatest(FETCH_CHIEFDOM_LIST_REQUEST_FOR_HF, fetchChiefdomListSagaRequest)]);
  yield all([takeLatest(FETCH_VILLAGES_LIST_REQUEST_FOR_HF, fetchVillagesListSagaRequest)]);
  yield all([takeLatest(FETCH_CITY_LIST_REQUEST_FOR_HF, fetchCityListSagaRequest)]);
  yield all([takeLatest(FETCH_PEER_SUPERVISOR_LIST_REQUEST, fetchPeerSupervisorListSagaRequest)]);
  yield all([takeLatest(FETCH_WORKFLOW_LIST_REQUEST, fetchWorkflowListSagaRequest)]);
  yield all([takeLatest(FETCH_PEER_SUPERVISOR_VALIDATION, peerSupervisorValidationSagaRequest)]);
  yield all([takeLatest(LINKED_RESTRICTIONS_VALIDATION_REQUEST, validateLinkedRestrictionsSagaRequest)]);
  yield all([takeLatest(FETCH_HEALTH_FACILITY_TYPES_REQUEST, fetchHFTypesSaga)]);
  yield all([takeLatest(FETCH_VILLAGES_LIST_FROM_HF_REQUEST, fetchVillagesListFromHFSagaRequest)]);
  yield all([takeLatest(FETCH_VILLAGES_LIST_USER_LINKED, fetchVillagesListUserLinkedSagaRequest)]);
  yield all([takeLatest(FETCH_CULTURE_LIST_REQUEST, fetchCultureList)]);
  yield all([takeLatest(FETCH_COUNTRY_LIST_REQUEST, fetchCountryList)]);
  yield all([takeLatest(FETCH_HF_DASHBOARD_LIST_REQUEST, fetchHealthFacilityDashboardList)]);
  yield all([takeLatest(FETCH_UNLINKED_VILLAGES_REQUEST, fetchUnlinkedVillagesSagaRequest)]);
}

export default healthFacilitySaga;
