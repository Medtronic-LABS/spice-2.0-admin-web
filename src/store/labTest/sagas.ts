import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as labtestService from '../../services/labtestAPI';
import {
  IDeleteLabtestRequest,
  IFetchLabtestsRequest,
  ILabTestCustomizationRequest,
  IValidateLabtestRequest
} from './types';
import * as labtestActions from './actions';
import {
  DELETE_LABTEST_REQUEST,
  FETCH_LABTEST_CUSTOMIZATION_REQUEST,
  FETCH_LABTEST_REQUEST,
  FETCH_UNIT_LIST_REQUEST,
  LABTEST_CUSTOMIZATION_REQUEST,
  VALIDATE_LABTEST_REQUEST
} from './actionTypes';

/*
  Worker Saga: Fired on FETCH_LABTEST_REQUEST action
*/
export function* fetchLabTest({ data, failureCb }: IFetchLabtestsRequest): SagaIterator {
  try {
    const {
      data: { entityList: labtests, totalCount: total }
    } = yield call(labtestService.fetchLabTest, data);
    const payload = { labtests: labtests || [], total };
    yield put(labtestActions.fetchLabtestsSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(labtestActions.fetchLabtestsFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on DELETE_LABTEST_REQUEST action
*/
export function* deleteLabtest({ id, successCb, failureCb }: IDeleteLabtestRequest): SagaIterator {
  try {
    yield call(labtestService.deleteLabtest, { id });
    yield put(labtestActions.deleteLabtestSuccess());
    successCb?.();
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(labtestActions.deleteLabtestFail(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_UNIT_LIST_REQUEST action
*/
export function* fetchUnitList(): SagaIterator {
  try {
    const { data: units } = yield call(labtestService.fetchUnitList);
    yield put(labtestActions.fetchUnitListSuccess(units));
  } catch (e) {
    if (e instanceof Error) {
      yield put(labtestActions.fetchUnitListFail(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_LABTEST_CUSTOMIZATION_REQUEST action
*/
export function* fetchLabTestCustomizationSaga({ name, countryId, successCb, failureCb }: any): SagaIterator {
  try {
    const {
      data: { entity: data }
    } = yield call(labtestService.fetchLabtestCustomization, {
      countryId,
      name
    } as any);
    successCb?.(data);
    const newData = { ...data, formInput: JSON.parse(data?.formInput) };
    yield put(labtestActions.fetchLabTestCustomizationSuccess({ payload: newData }));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(labtestActions.fetchLabTestCustomizationFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on LABTEST_CUSTOMIZATION_REQUEST action
*/
export function* labTestCustomizationSaga({ data, successCb, failureCb }: ILabTestCustomizationRequest): SagaIterator {
  try {
    yield call(labtestService[data?.id ? 'updateLabTestCustomization' : 'addLabTestCustomization'], data);
    yield put(labtestActions.labtestCustomizationSuccess());
    successCb?.();
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(labtestActions.labtestCustomizationFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on VALIDATE_LABTEST_REQUEST action
*/
export function* validateLabtest({ name, countryId, successCb, failureCb }: IValidateLabtestRequest): SagaIterator {
  try {
    yield call(labtestService.validateLabtest, { name, countryId });
    yield put(labtestActions.validateLabtestSuccess());
    successCb?.();
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(labtestActions.validateLabtestFailure(e));
    }
  }
}

/*
  Starts worker saga on latest dispatched specific action.
*/
function* labtestSaga() {
  yield all([takeLatest(FETCH_LABTEST_REQUEST, fetchLabTest)]);
  yield all([takeLatest(FETCH_LABTEST_CUSTOMIZATION_REQUEST, fetchLabTestCustomizationSaga)]);
  yield all([takeLatest(DELETE_LABTEST_REQUEST, deleteLabtest)]);
  yield all([takeLatest(LABTEST_CUSTOMIZATION_REQUEST, labTestCustomizationSaga)]);
  yield all([takeLatest(FETCH_UNIT_LIST_REQUEST, fetchUnitList)]);
  yield all([takeLatest(VALIDATE_LABTEST_REQUEST, validateLabtest)]);
}

export default labtestSaga;
