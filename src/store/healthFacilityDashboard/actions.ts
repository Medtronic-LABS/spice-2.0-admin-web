import * as SITE_TYPES from './actionTypes';
import {
  IFetchSiteListFailure,
  IFetchSiteListRequest,
  IFetchSiteListSuccess,
  IFetchSiteListSuccessPayload,
  IFetchDistrictDropdownRequest,
  IFetchDistrictDropdownSuccess,
  IFetchDistrictDropdownSuccessPayload,
  IFetchDistrictDropdownFailure,
  ICreateSiteRequest,
  ICreateSiteSuccess,
  ICreateSiteFailure,
  IClearDropdownValues,
  IFetchSiteSummaryRequest,
  IFetchSiteSummarySuccess,
  IFetchSiteSummaryFailure,
  IFetchSiteSummaryUsersRequest,
  IFetchSiteSummaryUsersSuccess,
  IFetchSiteSummaryUsersFailure,
  ISiteUser,
  ICreateSiteUserRequest,
  ICreateSiteUserSuccess,
  ICreateSiteUserFailure,
  IUpdateSiteDetailsRequest,
  IUpdateSiteDetailsSuccess,
  IUpdateSiteDetailsFailure,
  IUpdateSiteUserRequest,
  IUpdateSiteUserSuccess,
  IUpdateSiteUserFailure,
  ISiteUserPayLoad,
  IFetchCultureDropdownRequest,
  IFetchCultureDropdownSuccess,
  IFetchCultureDropdownSuccessPayload,
  IFetchSiteUserListRequest,
  IFetchSiteUserListSuccessPayload,
  IFetchSiteUserListSuccess,
  IFetchSiteUserListFailure,
  IDeleteUserSuccessPayload,
  IDeleteSiteUserRequest,
  IDeleteSiteUserSuccess,
  IDeleteSiteUserFailure,
  IFetchChiefdomDropdownSuccessPayload,
  IFetchChiefdomDropdownSuccess,
  IFetchChiefdomDropdownFailure,
  ICreateSiteRequestPayload,
  ISiteSummary,
  ISiteUpdateReqPayload,
  IFetchSiteDashboardListRequest,
  IFetchSiteDashboardListSuccessPayload,
  IFetchSiteDashboardListSuccess,
  IFetchSiteDashboardListFailure,
  IClearSiteSummary,
  IClearSiteList,
  IClearSiteUserList,
  ISetSiteSummary,
  ICultureDropdownFailure,
  IFetchSiteDropdownFailure,
  IFetchSiteDropdownRequest,
  IFetchSiteDropdownSuccess,
  IFetchSiteDropdownSuccessPayload,
  IFetchChiefdomDropdownRequest
} from '../healthFacilityDashboard/types';

export const fetchSiteListRequest = ({
  tenantId,
  skip,
  limit,
  search,
  failureCb
}: {
  tenantId: number;
  skip: number;
  limit: number | null;
  search?: string;
  failureCb?: (error: Error) => void;
}): IFetchSiteListRequest => ({
  type: SITE_TYPES.FETCH_SITE_LIST_REQUEST,
  skip,
  limit,
  tenantId,
  search,
  failureCb
});

export const fetchSiteListSuccess = (payload: IFetchSiteListSuccessPayload): IFetchSiteListSuccess => ({
  type: SITE_TYPES.FETCH_SITE_LIST_SUCCESS,
  payload
});

export const fetchSiteListFailure = (error: Error): IFetchSiteListFailure => ({
  type: SITE_TYPES.FETCH_SITE_LIST_FAILURE,
  error
});

export const fetchSiteDistrictDropdownRequest = ({
  countryId
}: {
  countryId: string;
}): IFetchDistrictDropdownRequest => ({
  type: SITE_TYPES.FETCH_DISTRICT_DROPDOWN_REQUEST,
  countryId
});

export const fetchSiteDistrictDropdownSuccess = (
  payload: IFetchDistrictDropdownSuccessPayload
): IFetchDistrictDropdownSuccess => ({
  type: SITE_TYPES.FETCH_DISTRICT_DROPDOWN_SUCCESS,
  payload
});

export const fetchSiteDistrictDropdownFailure = (error: Error): IFetchDistrictDropdownFailure => ({
  type: SITE_TYPES.FETCH_DISTRICT_DROPDOWN_FAILURE,
  error
});

export const fetchChiefdomDropdownRequest = ({
  districtId
}: {
  districtId: string;
}): IFetchChiefdomDropdownRequest => ({
  type: SITE_TYPES.FETCH_CHIEFDOM_DROPDOWN_REQUEST,
  districtId
});

export const fetchChiefdomDropdownSuccess = (
  payload: IFetchChiefdomDropdownSuccessPayload
): IFetchChiefdomDropdownSuccess => ({
  type: SITE_TYPES.FETCH_CHIEFDOM_DROPDOWN_SUCCESS,
  payload
});

export const fetchChiefdomDropdownFailure = (error: Error): IFetchChiefdomDropdownFailure => ({
  type: SITE_TYPES.FETCH_CHIEFDOM_DROPDOWN_FAILURE,
  error
});

export const fetchCultureDropdownRequest = (): IFetchCultureDropdownRequest => ({
  type: SITE_TYPES.FETCH_CULTURE_DROPDOWN_REQUEST
});

export const fetchCultureDropdownSuccess = (
  payload: IFetchCultureDropdownSuccessPayload
): IFetchCultureDropdownSuccess => ({
  type: SITE_TYPES.FETCH_CULTURE_DROPDOWN_SUCCESS,
  payload
});

export const fetchCultureDropdownFailure = (error: Error): ICultureDropdownFailure => ({
  type: SITE_TYPES.FETCH_CULTURE_DROPDOWN_FAILURE,
  error
});

export const createSiteRequest = ({
  data,
  successCb,
  failureCb
}: {
  data: ICreateSiteRequestPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}): ICreateSiteRequest => ({
  type: SITE_TYPES.CREATE_SITE_REQUEST,
  data,
  successCb,
  failureCb
});

export const createSiteSuccess = (): ICreateSiteSuccess => ({
  type: SITE_TYPES.CREATE_SITE_SUCCESS
});

export const createSiteFailure = (error: Error): ICreateSiteFailure => ({
  type: SITE_TYPES.CREATE_SITE_FAILURE,
  error
});

export const clearDropdownValues = (): IClearDropdownValues => ({
  type: SITE_TYPES.CLEAR_DROPDOWN_VALUES
});

export const fetchSiteSummaryRequest = ({
  tenantId,
  id,
  failureCb,
  successCb
}: {
  tenantId: number;
  id: number;
  successCb?: (data: ISiteSummary) => void;
  failureCb?: (error: Error) => void;
}): IFetchSiteSummaryRequest => ({
  type: SITE_TYPES.FETCH_SITE_SUMMARY_REQUEST,
  tenantId,
  id,
  failureCb,
  successCb
});

export const fetchSiteSummarySuccess = (payload: ISiteSummary): IFetchSiteSummarySuccess => ({
  type: SITE_TYPES.FETCH_SITE_SUMMARY_SUCCESS,
  payload
});

export const fetchSiteSummaryFailure = (error: Error): IFetchSiteSummaryFailure => ({
  type: SITE_TYPES.FETCH_SITE_SUMMARY_FAILURE,
  error
});

export const createSiteUserRequest = ({
  data,
  successCb,
  failureCb
}: {
  data: ISiteUserPayLoad;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}): ICreateSiteUserRequest => ({
  type: SITE_TYPES.CREATE_SITE_USER_REQUEST,
  data,
  successCb,
  failureCb
});

export const createSiteUserSuccess = (): ICreateSiteUserSuccess => ({
  type: SITE_TYPES.CREATE_SITE_USER_SUCCESS
});

export const createSiteUserFailure = (error: Error): ICreateSiteUserFailure => ({
  type: SITE_TYPES.CREATE_SITE_USER_FAILURE,
  error
});

export const updateSiteDetailsRequest = ({
  data,
  successCb,
  failureCb
}: {
  data: ISiteUpdateReqPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}): IUpdateSiteDetailsRequest => ({
  type: SITE_TYPES.UPDATE_SITE_DETAILS_REQUEST,
  data,
  successCb,
  failureCb
});

export const updateSiteDetailsSuccess = (): IUpdateSiteDetailsSuccess => ({
  type: SITE_TYPES.UPDATE_SITE_DETAILS_SUCCESS
});

export const updateSiteDetailsFailure = (error: Error): IUpdateSiteDetailsFailure => ({
  type: SITE_TYPES.UPDATE_SITE_DETAILS_FAILURE,
  error
});

export const updateSiteUserRequest = ({
  data,
  successCb,
  failureCb
}: {
  data: ISiteUser;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}): IUpdateSiteUserRequest => ({
  type: SITE_TYPES.UPDATE_SITE_USER_REQUEST,
  data,
  successCb,
  failureCb
});

export const updateSiteUserSuccess = (): IUpdateSiteUserSuccess => ({
  type: SITE_TYPES.UPDATE_SITE_USER_SUCCESS
});

export const updateSiteUserFailure = (error: Error): IUpdateSiteUserFailure => ({
  type: SITE_TYPES.UPDATE_SITE_USER_FAILURE,
  error
});

export const fetchSiteSummaryUsersRequest = ({
  tenantId,
  searchParams,
  limit,
  skip,
  successCb,
  failureCb
}: {
  tenantId: string;
  searchParams: string;
  limit: number | null;
  skip: number;
  successCb?: (data: ISiteUser[]) => void;
  failureCb?: (error: Error) => void;
}): IFetchSiteSummaryUsersRequest => ({
  type: SITE_TYPES.FETCH_SITE_USERS_REQUEST,
  tenantId,
  searchParams,
  limit,
  skip,
  successCb,
  failureCb
});

export const fetchSiteSummaryUsersSuccess = (payload: ISiteUser[]): IFetchSiteSummaryUsersSuccess => ({
  type: SITE_TYPES.FETCH_SITE_USERS_SUCCESS,
  payload
});

export const fetchSiteSummaryUsersFailure = (error: Error): IFetchSiteSummaryUsersFailure => ({
  type: SITE_TYPES.FETCH_SITE_USERS_FAILURE,
  error
});

export const fetchSiteUserListRequest = ({
  tenantId,
  skip,
  limit,
  search,
  roleType,
  failureCb
}: {
  tenantId: string;
  skip: number;
  limit: number | null;
  search?: string;
  roleType?: string;
  failureCb?: (error: Error) => void;
}): IFetchSiteUserListRequest => ({
  type: SITE_TYPES.FETCH_SITE_USER_LIST_REQUEST,
  skip,
  limit,
  tenantId,
  search,
  roleType,
  failureCb
});

export const fetchSiteUserListSuccess = (payload: IFetchSiteUserListSuccessPayload): IFetchSiteUserListSuccess => ({
  type: SITE_TYPES.FETCH_SITE_USER_LIST_SUCCESS,
  payload
});

export const fetchSiteUserListFailure = (error: Error): IFetchSiteUserListFailure => ({
  type: SITE_TYPES.FETCH_SITE_USER_LIST_FAILURE,
  error
});

export const deleteSiteUserRequest = ({
  data,
  isAllSites,
  successCb,
  failureCb
}: {
  data: IDeleteUserSuccessPayload;
  isAllSites?: boolean;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}): IDeleteSiteUserRequest => ({
  type: SITE_TYPES.DELETE_SITE_USER_REQUEST,
  isAllSites,
  data,
  successCb,
  failureCb
});

export const deleteSiteUserSuccess = (): IDeleteSiteUserSuccess => ({
  type: SITE_TYPES.DELETE_SITE_USER_SUCCESS
});

export const deleteSiteUserFailure = (error: Error): IDeleteSiteUserFailure => ({
  type: SITE_TYPES.DELETE_SITE_USER_FAILURE,
  error
});

export const fetchSiteDashboardListRequest = ({
  skip,
  limit,
  isLoadMore,
  search,
  role,
  successCb,
  failureCb
}: Omit<IFetchSiteDashboardListRequest, 'type'>): IFetchSiteDashboardListRequest => {
  return {
    type: SITE_TYPES.FETCH_SITE_DASHBOARD_LIST_REQUEST,
    skip,
    limit,
    isLoadMore,
    role,
    search,
    successCb,
    failureCb
  };
};

export const fetchSiteDashboardListSuccess = (
  payload: IFetchSiteDashboardListSuccessPayload
): IFetchSiteDashboardListSuccess => ({
  type: SITE_TYPES.FETCH_SITE_DASHBOARD_LIST_SUCCESS,
  payload
});

export const fetchSiteDashboardListFailure = (error: Error): IFetchSiteDashboardListFailure => ({
  type: SITE_TYPES.FETCH_SITE_DASHBOARD_LIST_FAILURE,
  error
});

export const clearSiteList = (): IClearSiteList => ({
  type: SITE_TYPES.CLEAR_SITE_LIST
});

export const clearSiteUserList = (): IClearSiteUserList => ({
  type: SITE_TYPES.CLEAR_SITE_USER_LIST
});

export const clearSiteSummary = (): IClearSiteSummary => ({
  type: SITE_TYPES.CLEAR_SITE_SUMMARY
});

export const setSiteSummary = (data: Partial<ISiteSummary>): ISetSiteSummary => ({
  type: SITE_TYPES.SET_SITE_SUMMARY,
  data
});

export const fetchSiteDropdownRequest = ({
  tenantId,
  regionTenantId
}: {
  tenantId: string;
  regionTenantId?: string;
}): IFetchSiteDropdownRequest => ({
  type: SITE_TYPES.FETCH_SITE_DROPDOWN_REQUEST,
  tenantId,
  regionTenantId
});

export const fetchSiteDropdownSuccess = (payload: IFetchSiteDropdownSuccessPayload): IFetchSiteDropdownSuccess => ({
  type: SITE_TYPES.FETCH_SITE_DROPDOWN_SUCCESS,
  payload
});

export const fetchSiteDropdownFailure = (error: Error): IFetchSiteDropdownFailure => ({
  type: SITE_TYPES.FETCH_SITE_DROPDOWN_FAILURE,
  error
});

export const clearSiteDropdown = () => ({
  type: SITE_TYPES.CLEAR_SITE_DROPDOWN_OPTIONS
});
