import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as regionService from '../../services/regionAPI';
import * as regionActions from './actions';
import {
  ICreateRegionRequest,
  IFetchRegionsRequest,
  IFetchClientRegistryStatusReq,
  IUploadFileRequest,
  IDownloadFileRequest,
  IRegionDetailsRequest,
  IFetchCountryDetailReq,
  IFetchSubVillagesRequest
} from './types';
import {
  createRegionSuccess,
  fetchRegionsFailure,
  fetchRegionsSuccess,
  createRegionFailure,
  fetchClientRegistryStatusSuccess,
  fetchClientRegistryStatusFail,
  fetchCountryDetailSuccess,
  fetchCountryDetailFail
} from './actions';
import {
  CREATE_REGION_REQUEST,
  FETCH_REGIONS_REQUEST,
  FETCH_CLIENT_REGISTRY_STATUS_REQUEST,
  UPLOAD_FILE_REQUEST,
  DOWNLOAD_FILE_REQUEST,
  FETCH_REGION_DETAIL_REQUEST,
  FETCH_COUNTRY_DETAILS_REQUEST,
  FETCH_SUB_VILLAGES_REQUEST
} from './actionTypes';
import { setLabelName } from '../common/actions';
import { setAppType } from '../user/actions';

/*
  Worker Saga: Fired on FETCH_REGIONS_REQUEST action
*/
export function* fetchRegionsSaga({
  isLoadMore,
  skip,
  limit,
  search,
  successCb,
  failureCb
}: IFetchRegionsRequest): SagaIterator {
  try {
    const {
      data: { entityList: regions, totalCount: total }
    } = yield call(regionService.fetchRegions as any, limit, skip, undefined, search);
    const payload = { regions: regions || [], total, isLoadMore };
    successCb?.(payload);
    yield put(fetchRegionsSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchRegionsFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on CREATE_REGION_REQUEST action
*/
export function* createRegion({ data, successCb, failureCb }: ICreateRegionRequest): SagaIterator {
  try {
    yield call(regionService.createRegion as any, data);
    successCb?.();
    yield put(createRegionSuccess());
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(createRegionFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_CLIENT_REGISTRY_STATUS_REQUEST action
*/

export function* fetchClientRegistryStatus(action: IFetchClientRegistryStatusReq): SagaIterator {
  const { countryId } = action.payload;
  try {
    const {
      data: { isClientRegistryEnabled }
    } = yield call(regionService.getRegionDetailById, countryId);
    yield put(fetchClientRegistryStatusSuccess(!!isClientRegistryEnabled));
  } catch (e) {
    yield put(fetchClientRegistryStatusSuccess(false));
    if (e instanceof Error) {
      yield put(fetchClientRegistryStatusFail(e));
    }
  }
}

/*
  Worker Saga: Fired on UPLOAD_FILE_REQUEST action
*/
export function* uploadFileSaga({ file, appTypes, countryId, successCb, failureCb }: IUploadFileRequest): SagaIterator {
  try {
    const data = yield call(regionService.uploadFile, file, appTypes, countryId);
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
export function* downloadFileSaga({ countryId, appTypes, successCb, failureCb }: IDownloadFileRequest): SagaIterator {
  try {
    const { data } = yield call(regionService.downloadFile, countryId, appTypes);
    successCb?.(data);
    yield put(regionActions.downloadFileSuccess(data));
  } catch (e: any) {
    failureCb?.(e);
    yield put(regionActions.downloadFileFailure(e));
  }
}

/*
  Worker Saga: Fired on FETCH_REGION_DETAIL_REQUEST action
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
      data: { entityList: list, totalCount: total }
    } = yield call(regionService.regionDetails, countryId, limit, skip, search);
    const payload = {
      list,
      total
    };
    successCb?.(payload);
    yield put(regionActions.regionDetailsSuccess(payload));
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(regionActions.regionDetailsFailure(e));
    }
  }
}

export function* fetchSubVillagesSagaRequest({
  villageIds,
  successCb,
  failureCb
}: IFetchSubVillagesRequest): SagaIterator {
  try {
    const response = yield call(regionService.fetchSubVillages, villageIds);
    const { entity } = response.data;
    yield put(regionActions.fetchSubVillagesSuccess(entity ?? []));
    successCb?.(entity ?? []);
  } catch (e) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(regionActions.fetchSubVillagesFailure(e));
    }
  }
}

/*
  Worker Saga: Fired on FETCH_COUNTRY_DETAILS_REQUEST action
*/
export function* fetchCountryDetail(action: IFetchCountryDetailReq): SagaIterator {
  const { tenantId, id, failureCb } = action.payload;
  try {
    const response = yield call(regionService.getCountryDetail, {
      tenantId,
      id
    });
    const { displayValues = null, appTypes } = response.data.entity;
    if (appTypes && Array.isArray(appTypes) && appTypes.length) {
      yield put(setAppType(appTypes));
    }
    yield put(setLabelName(displayValues));
    yield put(fetchCountryDetailSuccess(response.data.entity));
  } catch (e: any) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchCountryDetailFail(e));
    }
  }
}

/*
  Starts worker saga on latest dispatched specific action.
  Allows concurrent increments.
*/
function* regionSaga() {
  yield all([takeLatest(FETCH_REGIONS_REQUEST, fetchRegionsSaga)]);
  yield all([takeLatest(FETCH_REGION_DETAIL_REQUEST, regionDetailsSaga)]);
  yield all([takeLatest(CREATE_REGION_REQUEST, createRegion)]);
  yield all([takeLatest(FETCH_CLIENT_REGISTRY_STATUS_REQUEST, fetchClientRegistryStatus)]);
  yield all([takeLatest(UPLOAD_FILE_REQUEST, uploadFileSaga)]);
  yield all([takeLatest(DOWNLOAD_FILE_REQUEST, downloadFileSaga)]);
  yield all([takeLatest(FETCH_COUNTRY_DETAILS_REQUEST, fetchCountryDetail)]);
  yield all([takeLatest(FETCH_SUB_VILLAGES_REQUEST, fetchSubVillagesSagaRequest)])
}

export default regionSaga;
