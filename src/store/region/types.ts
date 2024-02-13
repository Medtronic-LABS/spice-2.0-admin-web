import * as USER_TYPES from './actionTypes';

export interface IRegionState {
  file: any;
  uploading: boolean;
  downloading: boolean;
  error?: Error | null | string;
  loading: boolean;
  regionDetails: { list: IRegionDetails[]; total: number };
}

export interface IUploadFilePayload {
  file: any;
  successCb?: (payload: any) => void;
  failureCb?: (error: Error) => void;
}

export interface IUploadFileRequest {
  type: typeof USER_TYPES.UPLOAD_FILE_REQUEST;
  file: any;
  successCb?: (payload: any) => void;
  failureCb?: (error: Error) => void;
}

export interface IUploadFileSuccess {
  type: typeof USER_TYPES.UPLOAD_FILE_SUCCESS;
  payload: any;
}

export interface IUploadFileFailure {
  type: typeof USER_TYPES.UPLOAD_FILE_FAILURE;
  payload: { error: string };
}

export interface IDownloadFileRequest {
  type: typeof USER_TYPES.DOWNLOAD_FILE_REQUEST;
  countryId: number;
  successCb?: (payload: any) => void;
  failureCb?: (error: Error) => void;
}

export interface IDownloadFileSuccess {
  type: typeof USER_TYPES.DOWNLOAD_FILE_SUCCESS;
  payload: any;
}

export interface IDownloadFileFailure {
  type: typeof USER_TYPES.DOWNLOAD_FILE_FAILURE;
  payload: { error: string };
}

export interface IRegionDetails {
  id: number;
  name: string;
  type: string;
  countryid: number;
  countryname: string;
  districtid: number;
  districtname: string;
  chiefdomname: string;
  chiefdomid: number;
}

export interface IRegionDetailsRequest {
  type: typeof USER_TYPES.REGION_DETAILS_REQUEST;
  skip: number;
  limit: number | null;
  search?: string;
  countryId: number;
  successCb?: (payload: any) => void;
  failureCb?: (error: Error) => void;
}

export interface IRegionDetailsSuccess {
  type: typeof USER_TYPES.REGION_DETAILS_SUCCESS;
  payload: { list: IRegionDetails[]; total: number };
}

export interface IRegionDetailsFailure {
  type: typeof USER_TYPES.REGION_DETAILS_FAILURE;
  payload: { error: string };
}

export type RegionActions =
  | IUploadFileRequest
  | IUploadFileSuccess
  | IUploadFileFailure
  | IDownloadFileRequest
  | IDownloadFileSuccess
  | IDownloadFileFailure
  | IRegionDetailsRequest
  | IRegionDetailsSuccess
  | IRegionDetailsFailure;
