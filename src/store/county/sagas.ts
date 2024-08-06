import { SagaIterator } from 'redux-saga';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import * as countyService from '../../services/countyAPI';
import { fetchCountyAdmins as fetchCountyAdminsApi } from '../../services/countyAPI';
import {
  IFetchCountyListRequest,
  ICreateCountyRequest,
  IFetchCountyDetailReq,
  IFetchDashboardCounty,
  IUpdateCountyReq,
  IUpdateCountyAdminReq,
  ICreateCountyAdminReq,
  IDeleteCountyAdminReq,
  IDeactivateCountyReq,
  IFetchCountyOptionsRequest,
  IActivateCountyReq,
  ICounty,
  ICreateCountyWorkflowModule,
  IFetchClinicalWorkflowReq,
  IClinicalWorkflow,
  IUpdateCountyWorkflowModule,
  IFetchClinicalWorkflowSuccessPayload,
  IDeleteCountyWorkflowModule,
  IFetchCountyOptionsPayload
} from './types';
import * as countyActions from './actions';
import * as siteActions from '../healthFacilityDashboard/actions';
import {
  FETCH_COUNTY_LIST_REQUEST,
  CREATE_COUNTY_REQUEST,
  FETCH_COUNTY_DETAIL_REQUEST,
  FETCH_COUNTY_DASHBOARD_LIST_REQUEST,
  UPDATE_COUNTY_DETAIL_REQUEST,
  CREATE_COUNTY_ADMIN_REQUEST,
  UPDATE_COUNTY_ADMIN_REQUEST,
  DELETE_COUNTY_ADMIN_REQUEST,
  DEACTIVATE_COUNTY_REQUEST,
  FETCH_COUNTY_OPTIONS_REQUEST,
  ACTIVATE_COUNTY_REQUEST,
  FETCH_CLINICAL_WORKFLOW_REQUEST,
  CREATE_COUNTY_WORKFLOW_MODULE_REQUEST,
  UPDATE_COUNTY_WORKFLOW_MODULE_REQUEST,
  DELETE_COUNTY_WORKFLOW_MODULE_REQUEST
} from './actionTypes';
import { AppState } from '../rootReducer';
import APPCONSTANTS from '../../constants/appConstants';

/*
  Worker Saga: Fired on FETCH_COUNTY_LIST_REQUEST action
*/
export function* fetchCountyList({
  tenantId,
  isActive,
  skip,
  limit,
  search,
  successCb,
  failureCb
}: IFetchCountyListRequest): SagaIterator {
  try {
    let response: { entityList: ICounty[]; totalCount: number };
    if (!isActive) {
      const { data } = yield call(
        countyService.fetchDeactivatedAccounts as any,
        skip,
        limit,
        undefined,
        search,
        tenantId
      );
      response = data;
    } else {
      const { data } = yield call(countyService.fetchCountyList as any, tenantId, isActive, skip, limit, search);
      response = data;
    }
    const payload = { countyList: response?.entityList || [], total: response.totalCount };
    successCb?.(payload);
    yield put(countyActions.fetchCountyListSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(countyActions.fetchCountyListFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on CREATE_COUNTY_REQUEST action
*/
export function* createCounty({ data, successCb, failureCb }: ICreateCountyRequest): SagaIterator {
  try {
    yield call(countyService.createCounty, data);
    successCb?.();
    yield put(countyActions.createCountySuccess());
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(countyActions.createCountyFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_COUNTY_DETAIL_REQUEST action
*/
export function* fetchCountyDetail(action: IFetchCountyDetailReq): SagaIterator {
  const { tenantId, id, successCb, failureCb, searchTerm } = action.payload;
  try {
    if (searchTerm) {
      const {
        data: { entityList }
      } = yield call(fetchCountyAdminsApi as any, {
        tenantId,
        searchTerm,
        roleNames: [APPCONSTANTS.ROLES.ACCOUNT_ADMIN]
      });
      yield put(countyActions.searchUserSuccess(entityList || []));
    } else {
      const response = yield call(countyService.fetchCountyDetails, {
        tenantId: Number(tenantId),
        id: Number(id)
      });
      yield put(countyActions.fetchCountyDetailSuccess(response.data?.entity));
      successCb?.(response.data?.entity);
    }
  } catch (e: any) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(countyActions.fetchCountyDetailFail(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_COUNTY_DASHBOARD_LIST_REQUEST action
*/
export function* getDashboardCounty(action: IFetchDashboardCounty): SagaIterator {
  try {
    const { skip, limit, searchTerm, successCb, isLoadMore } = action.payload;
    const tenantId = yield select((state: AppState) => state.user.user.tenantId);
    const {
      data: { entityList: data, totalCount: total }
    }: any = yield call(countyService.fetchDashboardCounty as any, {
      skip,
      limit,
      tenantId,
      searchTerm: searchTerm || ''
    });
    successCb?.();
    const payload = { data: data || [], total, isLoadMore };
    yield put(countyActions.fetchDashboardCountySuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      action.payload.failureCb?.(e);
      yield put(countyActions.fetchDashboardCountyFail(e));
    }
  }
}

/*
  Worker Saga: Fired on UPDATE_COUNTY_DETAIL_REQUEST action
*/
export function* updateCountyDetail({ data, successCb, failureCb }: IUpdateCountyReq): SagaIterator {
  try {
    yield call(countyService.updateCounty, data);
    successCb?.();
    yield put(countyActions.updateCountyDetailSuccess(data));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(countyActions.updateCountyDetailFail(e));
    }
  }
}

/*
  Worker Saga: Fired on UPDATE_COUNTY_ADMIN_REQUEST action
*/
export function* updateCountyAdminInfo({ data, successCb, failureCb }: IUpdateCountyAdminReq): SagaIterator {
  try {
    yield call(countyService.updateCountyAdmin, data);
    yield put(countyActions.updateCountyAdminSuccess());
    successCb?.();
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(countyActions.updateCountyAdminFail(e));
    }
  }
}

/*
  Worker Saga: Fired on CREATE_COUNTY_ADMIN_REQUEST action
*/
export function* createCountyAdminInfo({ data, successCb, failureCb }: ICreateCountyAdminReq): SagaIterator {
  try {
    yield call(countyService.createCountyAdmin, data);
    yield put(countyActions.createCountyAdminSuccess());
    successCb?.();
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(countyActions.createCountyAdminFail(e));
    }
  }
}

/*
  Worker Saga: Fired on DELETE_COUNTY_ADMIN_REQUEST action
*/
export function* removeCountyAdmin({ data, successCb, failureCb }: IDeleteCountyAdminReq) {
  try {
    yield call(countyService.deleteCountyAdmin, data);
    yield put(countyActions.deleteCountyAdminSuccess());
    successCb?.();
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(countyActions.deleteCountyAdminFail(e));
    }
  }
}

/*
  Worker Saga: Fired on DEACTIVATE_COUNTY_REQUEST action
*/
export function* deactivateCounty({ data, successCb, failureCb }: IDeactivateCountyReq) {
  try {
    yield call(countyService.deactivateCounty, data);
    yield put(countyActions.deactivateCountySuccess());
    yield put(siteActions.clearSiteDropdown());
    successCb?.();
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(countyActions.deactivateCountyFail(e));
    }
  }
}

/*
  Worker Saga: Fired on ACTIVATE_COUNTY_REQUEST action
*/
export function* activateCounty({ data, successCb, failureCb }: IActivateCountyReq) {
  try {
    yield call(countyService.activateCounty, data);
    yield put(countyActions.activateCountySuccess());
    successCb?.();
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(countyActions.activateCountyFail(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_COUNTY_OPTIONS_REQUEST action
*/
export function* fetchCountyOptions(action: IFetchCountyOptionsRequest): SagaIterator {
  try {
    const {
      data: { entityList: data }
    } = yield call(countyService.fetchCountyOptions, {
      tenantId: action.tenantId,
      skip: 0,
      limit: null,
      searchTerm: ''
    } as IFetchCountyOptionsPayload);
    yield put(countyActions.fetchCountyOptionsSuccess(data));
  } catch (e) {
    yield put(countyActions.fetchCountyOptionsFailure());
  }
}

/*
  Worker Saga: Fired on FETCH_CLINICAL_WORKFLOW_REQUEST action
*/
export function* fetchClinicalWorkflows({ data }: IFetchClinicalWorkflowReq): SagaIterator {
  try {
    const { data: worflowsResponse } = yield call(countyService.fetchClinicalWorkflows, data);
    const { entityList: workflows } = worflowsResponse;
    const { totalCount: total } = worflowsResponse;
    const sortedWokflows = workflows.sort((workflowA: IClinicalWorkflow, workflowB: IClinicalWorkflow) =>
      (workflowA.moduleType || 0) > (workflowB.moduleType || 0) ? 1 : -1
    );
    const payload: IFetchClinicalWorkflowSuccessPayload = {
      data: (sortedWokflows || []) as IClinicalWorkflow[],
      total
    };
    yield put(countyActions.fetchClinicalWorkflowSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      yield put(countyActions.fetchClinicalWorkflowFailure());
    }
  }
}

/*
  Worker Saga: Fired on CREATE_COUNTY_WORKFLOW_MODULE_REQUEST action
*/
export function* createCountyWorkflowRequest({
  data,
  successCb,
  failureCb
}: ICreateCountyWorkflowModule): SagaIterator {
  try {
    yield call(countyService.createCountyWorkflowModule, data);
    successCb?.();
    yield put(countyActions.createCountyWorkflowModuleSuccess());
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(countyActions.createCountyWorkflowModuleFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on UPDATE_COUNTY_WORKFLOW_MODULE_REQUEST action
*/
export function* updateCountyWorkflowRequest({
  data,
  successCb,
  failureCb
}: IUpdateCountyWorkflowModule): SagaIterator {
  try {
    yield call(countyService.updateCountyWorkflowModule, data);
    successCb?.();
    yield put(countyActions.updateCountyWorkflowModuleSuccess());
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(countyActions.updateCountyWorkflowModuleFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on DELETE_COUNTY_WORKFLOW_MODULE_REQUEST action
*/
export function* deleteCountyWorkflowRequest({
  data,
  successCb,
  failureCb
}: IDeleteCountyWorkflowModule): SagaIterator {
  try {
    yield call(countyService.deleteCountyWorkflowModule, data);
    successCb?.();
    yield put(countyActions.deleteCountyWorkflowModuleSuccess());
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(countyActions.deleteCountyWorkflowModuleFailure(e));
    }
  }
}

/*
  Starts worker saga on latest dispatched specific action.
*/
function* countySaga() {
  yield all([takeLatest(FETCH_COUNTY_LIST_REQUEST, fetchCountyList)]);
  yield all([takeLatest(CREATE_COUNTY_REQUEST, createCounty)]);
  yield all([takeLatest(FETCH_COUNTY_DETAIL_REQUEST, fetchCountyDetail)]);
  yield all([takeLatest(FETCH_COUNTY_DASHBOARD_LIST_REQUEST, getDashboardCounty)]);
  yield all([takeLatest(UPDATE_COUNTY_DETAIL_REQUEST, updateCountyDetail)]);
  yield all([takeLatest(UPDATE_COUNTY_ADMIN_REQUEST, updateCountyAdminInfo)]);
  yield all([takeLatest(CREATE_COUNTY_ADMIN_REQUEST, createCountyAdminInfo)]);
  yield all([takeLatest(DELETE_COUNTY_ADMIN_REQUEST, removeCountyAdmin)]);
  yield all([takeLatest(ACTIVATE_COUNTY_REQUEST, activateCounty)]);
  yield all([takeLatest(DEACTIVATE_COUNTY_REQUEST, deactivateCounty)]);
  yield all([takeLatest(FETCH_COUNTY_OPTIONS_REQUEST, fetchCountyOptions)]);
  yield all([takeLatest(FETCH_CLINICAL_WORKFLOW_REQUEST, fetchClinicalWorkflows)]);
  yield all([takeLatest(CREATE_COUNTY_WORKFLOW_MODULE_REQUEST, createCountyWorkflowRequest)]);
  yield all([takeLatest(UPDATE_COUNTY_WORKFLOW_MODULE_REQUEST, updateCountyWorkflowRequest)]);
  yield all([takeLatest(DELETE_COUNTY_WORKFLOW_MODULE_REQUEST, deleteCountyWorkflowRequest)]);
}

export default countySaga;
