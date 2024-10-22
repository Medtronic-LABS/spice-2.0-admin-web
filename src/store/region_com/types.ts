import * as REGION_TYPES from './actionTypes';

export interface IRegionDetail {
  id: string;
  tenantId: string;
  name: string;
  appTypes: string[];
  total: number;
}

export interface IRegionState {
  file: any;
  uploading: boolean;
  downloading: boolean;
  error?: Error | null | string;
  loading: boolean;
  detail: IRegionDetail;
  regionDetails: { list: IRegionDetails[]; total: number };
}

export interface IUploadFilePayload {
  file: any;
  successCb?: (payload: any) => void;
  failureCb?: (error: Error) => void;
}

export interface IUploadFileRequest {
  type: typeof REGION_TYPES.UPLOAD_FILE_REQUEST_COM;
  file: any;
  successCb?: (payload: any) => void;
  failureCb?: (error: Error) => void;
}

export interface IUploadFileSuccess {
  type: typeof REGION_TYPES.UPLOAD_FILE_SUCCESS_COM;
  payload: any;
}

export interface IUploadFileFailure {
  type: typeof REGION_TYPES.UPLOAD_FILE_FAILURE_COM;
  payload: { error: string };
}

export interface IDownloadFileRequest {
  type: typeof REGION_TYPES.DOWNLOAD_FILE_REQUEST_COM;
  countryId: number;
  successCb?: (payload: any) => void;
  failureCb?: (error: Error) => void;
}

export interface IDownloadFileSuccess {
  type: typeof REGION_TYPES.DOWNLOAD_FILE_SUCCESS_COM;
  payload: any;
}

export interface IDownloadFileFailure {
  type: typeof REGION_TYPES.DOWNLOAD_FILE_FAILURE_COM;
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
  type: typeof REGION_TYPES.REGION_DETAILS_REQUEST_COM;
  skip: number;
  limit: number | null;
  search?: string;
  countryId: number;
  successCb?: (payload: any) => void;
  failureCb?: (error: Error) => void;
}

export interface IRegionDetailsSuccess {
  type: typeof REGION_TYPES.REGION_DETAILS_SUCCESS_COM;
  payload: { list: IRegionDetails[]; total: number };
}

export interface IRegionDetailsFailure {
  type: typeof REGION_TYPES.REGION_DETAILS_FAILURE_COM;
  payload: { error: string };
}

export interface ISetRegionDetails {
  type: typeof REGION_TYPES.SET_REGION_DETAILS_COM;
  data?: Partial<IRegionDetail>;
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
  | IRegionDetailsFailure
  | ISetRegionDetails;
