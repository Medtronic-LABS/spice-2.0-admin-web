import * as REGION_TYPES from './actionTypes';
import {
  IUploadFileRequest,
  IUploadFileSuccess,
  IUploadFileFailure,
  IUploadFilePayload,
  IRegionDetailsRequest,
  IRegionDetailsSuccess,
  IRegionDetailsFailure,
  IRegionDetails,
  IDownloadFileRequest,
  IDownloadFileSuccess,
  IDownloadFileFailure,
  IRegionDetail,
  ISetRegionDetails
} from './types';

export const setRegionDetailCom = (data?: Partial<IRegionDetail>): ISetRegionDetails => ({
  type: REGION_TYPES.SET_REGION_DETAILS_COM,
  data
});

export const uploadFileRequest = ({ file, successCb, failureCb }: IUploadFilePayload): IUploadFileRequest => ({
  type: REGION_TYPES.UPLOAD_FILE_REQUEST_COM,
  file,
  successCb,
  failureCb
});

export const uploadFileSuccess = (payload: any): IUploadFileSuccess => ({
  type: REGION_TYPES.UPLOAD_FILE_SUCCESS_COM,
  payload
});

export const uploadFileFailure = (payload: any): IUploadFileFailure => ({
  type: REGION_TYPES.UPLOAD_FILE_FAILURE_COM,
  payload
});
export const downloadFileRequest = ({
  countryId,
  successCb,
  failureCb
}: {
  countryId: number;
  successCb?: (payload: any) => void;
  failureCb?: (error: Error) => void;
}): IDownloadFileRequest => ({
  type: REGION_TYPES.DOWNLOAD_FILE_REQUEST_COM,
  countryId,
  successCb,
  failureCb
});

export const downloadFileSuccess = (payload: any): IDownloadFileSuccess => ({
  type: REGION_TYPES.DOWNLOAD_FILE_SUCCESS_COM,
  payload
});

export const downloadFileFailure = (payload: any): IDownloadFileFailure => ({
  type: REGION_TYPES.DOWNLOAD_FILE_FAILURE_COM,
  payload
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
  type: REGION_TYPES.REGION_DETAILS_REQUEST_COM,
  skip,
  limit,
  search,
  countryId,
  successCb,
  failureCb
});

export const regionDetailsSuccess = (payload: { list: IRegionDetails[]; total: number }): IRegionDetailsSuccess => ({
  type: REGION_TYPES.REGION_DETAILS_SUCCESS_COM,
  payload
});

export const regionDetailsFailure = (payload: any): IRegionDetailsFailure => ({
  type: REGION_TYPES.REGION_DETAILS_FAILURE_COM,
  payload
});
