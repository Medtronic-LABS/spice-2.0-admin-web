import * as USER_TYPES from './actionTypes';
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
  IDownloadFileFailure
} from './types';

export const uploadFileRequest = ({ file, successCb, failureCb }: IUploadFilePayload): IUploadFileRequest => ({
  type: USER_TYPES.UPLOAD_FILE_REQUEST,
  file,
  successCb,
  failureCb
});

export const uploadFileSuccess = (payload: any): IUploadFileSuccess => ({
  type: USER_TYPES.UPLOAD_FILE_SUCCESS,
  payload
});

export const uploadFileFailure = (payload: any): IUploadFileFailure => ({
  type: USER_TYPES.UPLOAD_FILE_FAILURE,
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
  type: USER_TYPES.DOWNLOAD_FILE_REQUEST,
  countryId,
  successCb,
  failureCb
});

export const downloadFileSuccess = (payload: any): IDownloadFileSuccess => ({
  type: USER_TYPES.DOWNLOAD_FILE_SUCCESS,
  payload
});

export const downloadFileFailure = (payload: any): IDownloadFileFailure => ({
  type: USER_TYPES.DOWNLOAD_FILE_FAILURE,
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
  type: USER_TYPES.REGION_DETAILS_REQUEST,
  skip,
  limit,
  search,
  countryId,
  successCb,
  failureCb
});

export const regionDetailsSuccess = (payload: { list: IRegionDetails[]; total: number }): IRegionDetailsSuccess => ({
  type: USER_TYPES.REGION_DETAILS_SUCCESS,
  payload
});

export const regionDetailsFailure = (payload: any): IRegionDetailsFailure => ({
  type: USER_TYPES.REGION_DETAILS_FAILURE,
  payload
});
