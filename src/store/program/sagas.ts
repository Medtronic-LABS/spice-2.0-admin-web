import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as programService from '../../services/programAPI';
import {
  CREATE_PROGRAM_REQUEST,
  FETCH_PROGRAM_DETAILS_REQUEST,
  FETCH_PROGRAM_LIST_REQUEST,
  UPDATE_PROGRAM_REQUEST,
  DELETE_PROGRAM_REQUEST,
  FETCH_HF_DROPDOWN_REQUEST
} from './actionTypes';
import {
  ICreateProgramRequest,
  IFetchProgramDetailsRequest,
  IFetchProgramListRequest,
  IUpdateProgramRequest,
  IDeleteProgramRequest,
  IFetchSiteDropdownRequest
} from './types';
import * as programActions from './actions';
import { fetchSiteDropdownFailure, fetchSiteDropdownSuccess } from '../program/actions';

/*
  Worker Saga: Fired on FETCH_PROGRAM_LIST_REQUEST action
*/
export function* fetchProgramList({ data, failureCb }: IFetchProgramListRequest): SagaIterator {
  try {
    const {
      data: { entityList: programs, totalCount, limit }
    } = yield call(programService.fetchProgramList as any, data);
    const payload = { programs: programs || [], total: totalCount, limit };
    yield put(programActions.fetchProgramListSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(programActions.fetchProgramListFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on DELETE_PROGRAM_REQUEST action
*/
export function* deleteProgram({ id, tenantId, successCb, failureCb }: IDeleteProgramRequest): SagaIterator {
  try {
    yield call(programService.deleteProgram as any, id, tenantId);
    successCb?.();
    yield put(programActions.deleteProgramSuccess());
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
    }
    yield put(programActions.deleteProgramFailure());
  }
}

/*
  Worker Saga: Fired on CREATE_PROGRAM_REQUEST action
*/
export function* createProgram({ data, successCb, failureCb }: ICreateProgramRequest): SagaIterator {
  try {
    yield call(programService.saveProgram as any, data);
    yield put(programActions.createProgramSuccess());
    successCb?.();
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(programActions.createProgramFail(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_PROGRAM_DETAILS_REQUEST action
*/
export function* fetchProgramDetailsRequest({
  tenantId,
  id,
  successCb,
  failureCb
}: IFetchProgramDetailsRequest): SagaIterator {
  try {
    const {
      data: { entity: programDetails }
    } = yield call(programService.fetchProgramDetails as any, {
      tenantId,
      id
    });
    successCb?.(programDetails);
    yield put(programActions.fetchProgramDetailsSuccess(programDetails));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
    }
    yield put(programActions.fetchProgramDetailsFailure());
  }
}

/*
  Worker Saga: Fired on UPDATE_PROGRAM_REQUEST action
*/
export function* updateProgramDetailsRequest({ data, successCb, failureCb }: IUpdateProgramRequest): SagaIterator {
  try {
    yield call(programService.updateProgramDetails as any, data);
    successCb?.();
    yield put(programActions.updateProgramSuccess());
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
    }
    yield put(programActions.updateProgramFail());
  }
}

/*
  Worker Saga: Fired on FETCH_SITE_DROPDOWN_REQUEST action
*/
export function* fetchSitesForDropdown({ tenantId, countryId = '' }: IFetchSiteDropdownRequest): SagaIterator {
  try {
    const {
      data: { entityList: siteList }
    } = yield call(programService.getHFForDropdown as any, { tenantId });
    const payload = { list: siteList || [], countryId: countryId || '' };
    yield put(fetchSiteDropdownSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      yield put(fetchSiteDropdownFailure(e));
    }
  }
}

function* programSaga() {
  yield all([takeLatest(FETCH_PROGRAM_LIST_REQUEST, fetchProgramList)]);
  yield all([takeLatest(CREATE_PROGRAM_REQUEST, createProgram)]);
  yield all([takeLatest(FETCH_PROGRAM_DETAILS_REQUEST, fetchProgramDetailsRequest)]);
  yield all([takeLatest(UPDATE_PROGRAM_REQUEST, updateProgramDetailsRequest)]);
  yield all([takeLatest(DELETE_PROGRAM_REQUEST, deleteProgram)]);
  yield all([takeLatest(FETCH_HF_DROPDOWN_REQUEST, fetchSitesForDropdown)]);
}

export default programSaga;
