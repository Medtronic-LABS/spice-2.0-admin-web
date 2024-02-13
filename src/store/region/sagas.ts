import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as USERTYPES from './actionTypes';
import { IDownloadFileRequest, IRegionDetailsRequest, IUploadFileRequest } from './types';
import * as regionService from '../../services/regionAPI';
import * as regionActions from './actions';

/*
  Worker Saga: Fired on UPLOAD_FILE_REQUEST action
*/
export function* uploadFileSaga({ file, successCb, failureCb }: IUploadFileRequest): SagaIterator {
  try {
    const data = yield call(regionService.uploadFile, file);
    successCb?.(data);
    yield put(regionActions.uploadFileSuccess(data));
  } catch (e: any) {
    failureCb?.(e);
    yield put(regionActions.uploadFileFailure(e));
  }
}

/*
  Worker Saga: Fired on DOWNLOAD_FILE_REQUEST action
*/
export function* downloadFileSaga({ countryId, successCb, failureCb }: IDownloadFileRequest): SagaIterator {
  try {
    const { data } = yield call(regionService.downloadFile, countryId);
    successCb?.(data);
    yield put(regionActions.downloadFileSuccess(data));
  } catch (e: any) {
    failureCb?.(e);
    yield put(regionActions.downloadFileFailure(e));
  }
}

/*
  Worker Saga: Fired on REGION_DETAILS_REQUEST action
*/
export function* regionDetailsSaga({
  skip,
  limit,
  search,
  countryId,
  successCb,
  failureCb
}: IRegionDetailsRequest): SagaIterator {
  try {
    const {
      data: { entityList: regionDetails, totalCount }
    } = yield call(regionService.regionDetails, countryId, limit, skip, search);
    const payload = { list: regionDetails, total: totalCount };
    successCb?.(payload);
    yield put(regionActions.regionDetailsSuccess(payload));
  } catch (e: any) {
    failureCb?.(e);
    yield put(regionActions.regionDetailsFailure(e));
  }
}

/*
  Starts worker saga on latest dispatched `LOGIN_REQUEST` action.
  Allows concurrent increments.
*/
function* userSaga() {
  yield all([takeLatest(USERTYPES.UPLOAD_FILE_REQUEST, uploadFileSaga)]);
  yield all([takeLatest(USERTYPES.DOWNLOAD_FILE_REQUEST, downloadFileSaga)]);
  yield all([takeLatest(USERTYPES.REGION_DETAILS_REQUEST, regionDetailsSaga)]);
}

export default userSaga;
