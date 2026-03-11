import { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';

import * as branchService from '../../services/branchAPI';
import { IFetchBranchListRequest, ICreateBranchRequest, IUpdateBranchRequest } from './types';
import * as branchActions from './actions';
import { FETCH_BRANCH_LIST_REQUEST, CREATE_BRANCH_REQUEST, UPDATE_BRANCH_REQUEST } from './actionTypes';

/**
 * Worker saga: fetches branch list via POST /admin-service/branch/list
 */
function* fetchBranchListSaga({ payload, successCb, failureCb }: IFetchBranchListRequest): SagaIterator {
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
function* createBranchSaga({ payload, successCb, failureCb }: ICreateBranchRequest): SagaIterator {
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
function* updateBranchSaga({ payload, successCb, failureCb }: IUpdateBranchRequest): SagaIterator {
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

function* branchSaga(): SagaIterator {
  yield takeLatest(FETCH_BRANCH_LIST_REQUEST, fetchBranchListSaga);
  yield takeLatest(CREATE_BRANCH_REQUEST, createBranchSaga);
  yield takeLatest(UPDATE_BRANCH_REQUEST, updateBranchSaga);
}

export default branchSaga;
