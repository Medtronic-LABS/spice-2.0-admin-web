import * as REGION_TYPES from './actionTypes';
import {
  IFetchRegionsRequest,
  IFetchRegionsSuccess,
  IFetchRegionsFailure,
  IFetchRegionsSuccessPayload,
  ICreateRegionRequest,
  ICreateRegionFailure,
  ICreateRegionSuccess,
  ICreateRegionRequestPayload,
  IRegionDetail,
  ISetRegionDetails,
  IClearRegionDetail,
  IFetchClientRegistryStatusReq,
  IFetchClientRegistryStatusReqPayload,
  IFetchClientRegistryStatusSuccess,
  IFetchClientRegistryStatusFail,
  IClearClientRegistryStatus,
  IUploadFileRequest,
  IUploadFileSuccess,
  IUploadFileFailure,
  IRegionDetailsRequest,
  IRegionDetailsSuccess,
  IRegionDetailsFailure,
  IRegionDetailList,
  IDownloadFileRequest,
  IDownloadFileSuccess,
  IDownloadFileFailure,
  IUploadFilePayload,
  IFetchRegionDetailReqPayload,
  IFetchCountryDetailReq,
  IFetchCountryDetailSuccess,
  IFetchCountryDetailFail
} from './types';

export const fetchRegionsRequest = ({
  skip,
  limit,
  isLoadMore,
  search,
  successCb,
  failureCb
}: {
  skip: number;
  limit: number | null;
  isLoadMore?: boolean;
  search?: string;
  successCb?: (payload: IFetchRegionsSuccessPayload) => void;
  failureCb?: (error: Error) => void;
}): IFetchRegionsRequest => {
  return {
    type: REGION_TYPES.FETCH_REGIONS_REQUEST,
    skip,
    limit,
    isLoadMore,
    search,
    successCb,
    failureCb
  };
};

export const fetchRegionsSuccess = (payload: IFetchRegionsSuccessPayload): IFetchRegionsSuccess => ({
  type: REGION_TYPES.FETCH_REGIONS_SUCCESS,
  payload
});

export const fetchRegionsFailure = (error: Error): IFetchRegionsFailure => ({
  type: REGION_TYPES.FETCH_REGIONS_FAILURE,
  error
});

export const createRegionRequest = ({
  data,
  successCb,
  failureCb
}: ICreateRegionRequestPayload): ICreateRegionRequest => ({
  type: REGION_TYPES.CREATE_REGION_REQUEST,
  data,
  successCb,
  failureCb
});

export const createRegionSuccess = (): ICreateRegionSuccess => ({
  type: REGION_TYPES.CREATE_REGION_SUCCESS
});

export const createRegionFailure = (error: Error): ICreateRegionFailure => ({
  type: REGION_TYPES.CREATE_REGION_FAILURE,
  error
});

export const regionDetailsRequest = ({
  skip,
  limit,
  search,
  countryId,
  successCb,
  failureCb
}: {
  skip: number;
  limit: number | null;
  search?: string;
  countryId: number;
  successCb?: (payload: any) => void;
  failureCb?: (error: Error) => void;
}): IRegionDetailsRequest => ({
  type: REGION_TYPES.FETCH_REGION_DETAIL_REQUEST,
  skip,
  limit,
  search,
  countryId,
  successCb,
  failureCb
});

export const regionDetailsSuccess = (payload: { list: IRegionDetailList[]; total: number }): IRegionDetailsSuccess => ({
  type: REGION_TYPES.FETCH_REGION_DETAIL_SUCCESS,
  payload
});

export const regionDetailsFailure = (error: Error): IRegionDetailsFailure => ({
  type: REGION_TYPES.FETCH_REGION_DETAIL_FAILURE,
  error
});

export const fetchCountryDetailReq = (payload: IFetchRegionDetailReqPayload): IFetchCountryDetailReq => ({
  type: REGION_TYPES.FETCH_COUNTRY_DETAILS_REQUEST,
  payload
});

export const fetchCountryDetailSuccess = (payload: IRegionDetail): IFetchCountryDetailSuccess => ({
  type: REGION_TYPES.FETCH_COUNTRY_DETAILS_SUCCESS,
  payload
});

export const fetchCountryDetailFail = (error: Error): IFetchCountryDetailFail => ({
  type: REGION_TYPES.FETCH_COUNTRY_DETAILS_FAILURE,
  error
});

export const clearRegionDetail = (): IClearRegionDetail => ({
  type: REGION_TYPES.CLEAR_REGION_DETAIL
});

export const setRegionDetail = (data?: Partial<IRegionDetail>): ISetRegionDetails => ({
  type: REGION_TYPES.SET_REGION_DETAILS,
  data
});

export const fetchClientRegistryStatusReq = (
  payload: IFetchClientRegistryStatusReqPayload
): IFetchClientRegistryStatusReq => ({
  type: REGION_TYPES.FETCH_CLIENT_REGISTRY_STATUS_REQUEST,
  payload
});

export const fetchClientRegistryStatusSuccess = (
  isClientRegistryEnabled: boolean
): IFetchClientRegistryStatusSuccess => ({
  type: REGION_TYPES.FETCH_CLIENT_REGISTRY_STATUS_SUCCESS,
  payload: { isClientRegistryEnabled }
});

export const fetchClientRegistryStatusFail = (error: Error): IFetchClientRegistryStatusFail => ({
  type: REGION_TYPES.FETCH_CLIENT_REGISTRY_STATUS_FAIL,
  error
});

export const clearClientRegistryStatus = (): IClearClientRegistryStatus => ({
  type: REGION_TYPES.CLEAR_CLIENT_REGISTRY_STATUS
});

export const uploadFileRequest = ({
  file,
  appTypes,
  successCb,
  failureCb
}: IUploadFilePayload): IUploadFileRequest => ({
  type: REGION_TYPES.UPLOAD_FILE_REQUEST,
  file,
  appTypes,
  successCb,
  failureCb
});

export const uploadFileSuccess = (payload: any): IUploadFileSuccess => ({
  type: REGION_TYPES.UPLOAD_FILE_SUCCESS,
  payload
});

export const uploadFileFailure = (payload: any): IUploadFileFailure => ({
  type: REGION_TYPES.UPLOAD_FILE_FAILURE,
  payload
});

export const downloadFileRequest = ({
  countryId,
  appTypes,
  successCb,
  failureCb
}: {
  countryId: number;
  appTypes: string[];
  successCb?: (payload: any) => void;
  failureCb?: (error: Error) => void;
}): IDownloadFileRequest => ({
  type: REGION_TYPES.DOWNLOAD_FILE_REQUEST,
  countryId,
  appTypes,
  successCb,
  failureCb
});

export const downloadFileSuccess = (payload: any): IDownloadFileSuccess => ({
  type: REGION_TYPES.DOWNLOAD_FILE_SUCCESS,
  payload
});

export const downloadFileFailure = (payload: any): IDownloadFileFailure => ({
  type: REGION_TYPES.DOWNLOAD_FILE_FAILURE,
  payload
});
