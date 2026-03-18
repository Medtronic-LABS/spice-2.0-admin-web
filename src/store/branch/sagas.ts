import { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';

import * as branchService from '../../services/branchAPI';
import {
  IFetchBranchListRequest,
  ICreateBranchRequest,
  IUpdateBranchRequest,
  IFetchBranchSummaryRequest,
  IFetchBranchesByUnionRequest
} from './types';
import * as branchActions from './actions';
import {
  FETCH_BRANCH_LIST_REQUEST,
  CREATE_BRANCH_REQUEST,
  UPDATE_BRANCH_REQUEST,
  FETCH_BRANCH_SUMMARY_REQUEST,
  FETCH_BRANCHES_BY_UNION_REQUEST
} from './actionTypes';

/**
 * Worker saga: fetches branch list via POST /admin-service/branch/list
 */
export function* fetchBranchListSaga({ payload, successCb, failureCb }: IFetchBranchListRequest): SagaIterator {
  try {
    const { data } = yield call(branchService.fetchBranchList as any, payload);
    const branches = data?.entityList ?? data?.list ?? [];
    const totalCount = data?.totalCount ?? 0;
    const successPayload = { branches, totalCount };
    successCb?.(successPayload);
    yield put(branchActions.fetchBranchListSuccess(successPayload));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(branchActions.fetchBranchListFailure(e));
    }
  }
}

/**
 * Worker saga: creates branch via POST /admin-service/branch/create
 */
export function* createBranchSaga({ payload, successCb, failureCb }: ICreateBranchRequest): SagaIterator {
  try {
    yield call(branchService.createBranch as any, payload);
    successCb?.();
    yield put(branchActions.createBranchSuccess());
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(branchActions.createBranchFailure(e));
    }
  }
}

/**
 * Worker saga: updates branch via PUT /admin-service/branch/update
 */
export function* updateBranchSaga({ payload, successCb, failureCb }: IUpdateBranchRequest): SagaIterator {
  try {
    yield call(branchService.updateBranch as any, payload);
    successCb?.();
    yield put(branchActions.updateBranchSuccess());
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(branchActions.updateBranchFailure(e));
    }
  }
}

/**
 * Worker saga: fetches branch summary via GET /admin-service/branch/:branchId
 */
export function* fetchBranchSummarySaga({
  branchId,
  successCb,
  failureCb
}: IFetchBranchSummaryRequest): SagaIterator {
  try {
    const { data } = yield call(branchService.fetchBranchById as any, branchId);
    const branchSummary = data?.entity;
    successCb?.(branchSummary);
    yield put(branchActions.fetchBranchSummarySuccess(branchSummary));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(branchActions.fetchBranchSummaryFailure(e));
    }
  }
}

/**
 * Worker saga: fetches branches by unions via POST /admin-service/branch/list-by-unions
 */
export function* fetchBranchesByUnionSaga({
  unionIds,
  successCb,
  failureCb
}: IFetchBranchesByUnionRequest): SagaIterator {
  try {
    const {
      data: { entityList }
    } = yield call(branchService.fetchBranchesByUnions as any, unionIds);
    const branches = entityList ?? [];
    successCb?.(branches);
    yield put(branchActions.fetchBranchesByUnionSuccess(branches));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(branchActions.fetchBranchesByUnionFailure(e));
    }
  }
}

function* branchSaga(): SagaIterator {
  yield takeLatest(FETCH_BRANCH_LIST_REQUEST, fetchBranchListSaga);
  yield takeLatest(CREATE_BRANCH_REQUEST, createBranchSaga);
  yield takeLatest(UPDATE_BRANCH_REQUEST, updateBranchSaga);
  yield takeLatest(FETCH_BRANCH_SUMMARY_REQUEST, fetchBranchSummarySaga);
  yield takeLatest(FETCH_BRANCHES_BY_UNION_REQUEST, fetchBranchesByUnionSaga);
}

export default branchSaga;
