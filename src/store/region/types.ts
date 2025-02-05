import { ISelectOption } from '../../components/formFields/SelectInput';
import { ILabelName } from '../common/types';
import { ITimezone } from '../user/types';
import * as ACTION_TYPES from './actionTypes';

interface IRegion {
  id: string | number;
  tenantId: string | number;
  name: string;
  appTypes: string[];
  districtCount: number;
  chiefdomCount: number;
  healthFacilityCount: number;
}

export interface IMatchParams {
  tenantId: string;
  regionId: string;
}

export interface IRegionState {
  regions: IRegion[];
  total: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null | Error;
  detail: IRegionDetail;
  isClientRegistryEnabled?: boolean;
  file: any;
  uploading: boolean;
  downloading: boolean;
}

export interface IRegionDetailFormValues {
  region: {
    name: string;
    countryCode: string;
    unitMeasurement: ISelectOption;
    tenantId?: string;
  };
}
export interface IFetchRegionsSuccessPayload {
  regions: IRegion[];
  total: number;
  isLoadMore?: boolean;
}

export interface IRegionPayload {
  name: string;
  countryCode: string;
  appTypes: string[];
  users?: Array<{
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber: string;
    gender: string;
    timezone: any;
  }>;
}

export interface IFetchRegionDetailReqPayload {
  tenantId?: string;
  id: string;
  searchTerm?: string;
  failureCb?: (error: Error) => void;
}
export interface IFetchRegionAdmins {
  tenantId: string;
  skip?: number;
  limit?: number | null;
  searchTerm?: string;
  appTypes?: string[];
}

export interface ICreateRegionRequestPayload {
  data: IRegionPayload;
  successCb: () => void;
  failureCb: (error: Error) => void;
}

export interface IFetchRegionsRequest {
  type: typeof ACTION_TYPES.FETCH_REGIONS_REQUEST;
  isLoadMore?: boolean;
  skip: number;
  limit: number | null;
  search?: string;
  successCb?: (payload: IFetchRegionsSuccessPayload) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchRegionsSuccess {
  type: typeof ACTION_TYPES.FETCH_REGIONS_SUCCESS;
  payload: IFetchRegionsSuccessPayload;
}

export interface IFetchRegionsFailure {
  type: typeof ACTION_TYPES.FETCH_REGIONS_FAILURE;
  error: Error;
}

export interface IRegionDetailsRequest {
  type: typeof ACTION_TYPES.FETCH_REGION_DETAIL_REQUEST;
  skip: number;
  limit: number | null;
  search?: string;
  countryId: number;
  successCb?: (payload: any) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchCountryDetailReq {
  type: typeof ACTION_TYPES.FETCH_COUNTRY_DETAILS_REQUEST;
  payload: IFetchRegionDetailReqPayload;
}

export interface IFetchCountryDetailSuccess {
  type: typeof ACTION_TYPES.FETCH_COUNTRY_DETAILS_SUCCESS;
  payload: IRegionDetail;
}

export interface IFetchCountryDetailFail {
  type: typeof ACTION_TYPES.FETCH_COUNTRY_DETAILS_FAILURE;
  error: Error;
}

export interface IRegionAdmin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  username: string;
  gender: string;
  countryCode: string;
  timezone: ITimezone;
  country?: string;
  tenantId?: string;
}

export interface IRegionAdminAddPayload extends Omit<IRegionAdmin, 'timezone' | 'country'> {
  timezone: { id: number };
  country: { id: number };
}

export interface IRegionDetailList {
  countrycode: string | null;
  countryname: string;
  countryid: number;
  countrytenantid: number;
  districtcode: string | null;
  districtname: string;
  districtid: number;
  districttenantid: number;
  chiefdomcode: string | null;
  chiefdomname: string;
  chiefdomid: number;
  chiefdomtenantid: number;
  villagecode: string | null;
  villagename: string;
  villageid: number;
  villagetype: string | null;
}
export interface IRegionDetail {
  id: string;
  tenantId: string;
  name: string;
  appTypes: string[];
  list: IRegionDetailList[] | [];
  total: number;
  displayValues?: ILabelName;
}

export interface IRegionInfo {
  id: string;
  name: string;
  countryCode: string;
  unitMeasurement: string;
}

export interface IFetchRegionDetailFailurePayload {
  error: string;
}
export interface IDeactivateReqPayload {
  tenantId: string;
  successCb?: () => void;
  failureCb?: (e: Error) => void;
}

export interface IUploadFilePayload {
  file: any;
  appTypes: string;
  successCb?: (payload: any) => void;
  failureCb?: (error: Error) => void;
}

/*
  Declare all interface with type for redux actions
*/

export interface IRegionDetailsSuccess {
  type: typeof ACTION_TYPES.FETCH_REGION_DETAIL_SUCCESS;
  payload: { list: IRegionDetailList[]; total: number };
}

export interface IRegionDetailsFailure {
  type: typeof ACTION_TYPES.FETCH_REGION_DETAIL_FAILURE;
  error: Error;
}

export interface IClearRegionDetail {
  type: typeof ACTION_TYPES.CLEAR_REGION_DETAIL;
}

export interface ICreateRegionRequest {
  type: typeof ACTION_TYPES.CREATE_REGION_REQUEST;
  data: any;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface ICreateRegionSuccess {
  type: typeof ACTION_TYPES.CREATE_REGION_SUCCESS;
}

export interface ICreateRegionFailure {
  type: typeof ACTION_TYPES.CREATE_REGION_FAILURE;
  error: Error;
}

export interface IDeleteRegionAdminPayload {
  id: string;
  tenantId: string;
}

export interface ISetRegionDetails {
  type: typeof ACTION_TYPES.SET_REGION_DETAILS;
  data?: Partial<IRegionDetail>;
}

export interface IFetchClientRegistryStatusReq {
  type: typeof ACTION_TYPES.FETCH_CLIENT_REGISTRY_STATUS_REQUEST;
  payload: IFetchClientRegistryStatusReqPayload;
}

export interface IFetchClientRegistryStatusReqPayload {
  countryId: string;
}

export interface IFetchClientRegistryStatusSuccess {
  type: typeof ACTION_TYPES.FETCH_CLIENT_REGISTRY_STATUS_SUCCESS;
  payload: { isClientRegistryEnabled: boolean };
}

export interface IFetchClientRegistryStatusFail {
  type: typeof ACTION_TYPES.FETCH_CLIENT_REGISTRY_STATUS_FAIL;
  error: Error;
}

export interface IClearClientRegistryStatus {
  type: typeof ACTION_TYPES.CLEAR_CLIENT_REGISTRY_STATUS;
}

export interface IUploadFileRequest {
  type: typeof ACTION_TYPES.UPLOAD_FILE_REQUEST;
  file: any;
  appTypes: string;
  successCb?: (payload: any) => void;
  failureCb?: (error: Error) => void;
}

export interface IUploadFileSuccess {
  type: typeof ACTION_TYPES.UPLOAD_FILE_SUCCESS;
  payload: any;
}

export interface IUploadFileFailure {
  type: typeof ACTION_TYPES.UPLOAD_FILE_FAILURE;
  payload: { error: string };
}

export interface IDownloadFileRequest {
  type: typeof ACTION_TYPES.DOWNLOAD_FILE_REQUEST;
  countryId: number;
  appTypes: string[];
  successCb?: (payload: any) => void;
  failureCb?: (error: Error) => void;
}

export interface IDownloadFileSuccess {
  type: typeof ACTION_TYPES.DOWNLOAD_FILE_SUCCESS;
  payload: any;
}

export interface IDownloadFileFailure {
  type: typeof ACTION_TYPES.DOWNLOAD_FILE_FAILURE;
  payload: { error: string };
}

export type RegionActions =
  | IFetchRegionsRequest
  | IFetchRegionsSuccess
  | IFetchRegionsFailure
  | ICreateRegionRequest
  | ICreateRegionSuccess
  | ICreateRegionFailure
  | ISetRegionDetails
  | IClearRegionDetail
  | IFetchClientRegistryStatusReq
  | IFetchClientRegistryStatusSuccess
  | IFetchClientRegistryStatusFail
  | IClearClientRegistryStatus
  | IUploadFileRequest
  | IUploadFileSuccess
  | IUploadFileFailure
  | IRegionDetailsRequest
  | IRegionDetailsSuccess
  | IRegionDetailsFailure
  | IDownloadFileRequest
  | IDownloadFileSuccess
  | IDownloadFileFailure
  | IFetchCountryDetailReq
  | IFetchCountryDetailSuccess
  | IFetchCountryDetailFail;
