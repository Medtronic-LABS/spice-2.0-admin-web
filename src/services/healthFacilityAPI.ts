import axios from 'axios';

import {
  IFetchHFListRequest,
  IHFUserPayLoad,
  IFetchHFUserListRequest,
  IDeleteUserPayload,
  ICreateHFRequestPayload,
  IHFUserPost,
  IHealthFacilityPost,
  IDeleteHFPayload
} from '../store/healthFacility/types';

export const fetchHealthFacilityList = ({
  countryId,
  limit,
  skip,
  userBased,
  tenantBased,
  searchTerm,
  tenantIds = []
}: IFetchHFListRequest) =>
  axios({
    method: 'POST',
    url: 'admin-service/healthfacility/list',
    data: {
      limit: limit || null,
      skip: skip || null,
      countryId,
      tenantIds,
      userBased,
      tenantBased,
      searchTerm: searchTerm || '',
      ...(tenantIds.length ? { tenantIds } : {})
    }
  });

export const createHealthFacility = (data: ICreateHFRequestPayload) =>
  axios({
    method: 'POST',
    url: '/user-service/organization/create-healthfacility',
    data
  });

export const deleteHealtFacility = (data: IDeleteHFPayload) =>
  axios({
    url: '/user-service/organization/delete-healthfacility',
    method: 'POST',
    data
  });

export const fetchHFSummary = (tenantId: string, id: number, appTypes: string[]) =>
  axios({
    method: 'POST',
    url: '/admin-service/healthfacility/details',
    data: {
      appTypes,
      tenantId,
      id
    }
  });

export const updateHFDetails = (data: IHealthFacilityPost) =>
  axios({
    method: 'PUT',
    url: '/admin-service/healthfacility/update',
    data
  });

export const fetchHealthFacilityTypes = () =>
  axios({
    method: 'POST',
    url: '/admin-service/healthfacility-types'
  });

export const addHFUser = (data: IHFUserPayLoad) =>
  axios({
    method: 'POST',
    url: '/admin-service/healthfacility/user-add',
    data
  });

export const updateHFUser = (data: IHFUserPost) =>
  axios({
    method: 'PUT',
    url: '/admin-service/healthfacility/user-update',
    data
  });

export const fetchHFUserList = (data: IFetchHFUserListRequest) =>
  axios({
    method: 'POST',
    url: '/user-service/user/admin-users',
    data
  });
export const fetchHFUserDetail = (id: number) =>
  axios({
    method: 'POST',
    url: `/user-service/user/details/${id}`
  });

export const deleteHFUser = (data: IDeleteUserPayload) =>
  axios({
    url: '/admin-service/healthfacility/user-remove',
    method: 'POST',
    data
  });

export const fetchDistrictList = (countryId: number, appTypes: string[]) =>
  axios({
    url: '/admin-service/district-list',
    method: 'POST',
    data: { countryId, appTypes }
  });

export const fetchChiefdomList = (countryId: number, districtId: number, appTypes: string[]) =>
  axios({
    url: '/admin-service/chiefdom-list',
    method: 'POST',
    data: {
      countryId,
      districtId,
      appTypes
    }
  });

export const fetchVillagesList = (countryId: number, districtId: number, chiefdomId: number, appTypes: string[]) =>
  axios({
    url: '/admin-service/villages-list',
    method: 'POST',
    data: { countryId, districtId, chiefdomId, appTypes }
  });

export const fetchUnlinkedVillagesAPI = (
  countryId: number,
  districtId: number,
  chiefdomId: number,
  appTypes: string[],
  healthFacilityId?: number
) =>
  axios({
    url: 'admin-service/unlinked-villages-list',
    method: 'POST',
    data: { countryId, districtId, chiefdomId, healthFacilityId, appTypes }
  });

export const fetchVillagesListfromHF = (tenantIds: number[], userId: number, appTypes: string[]) =>
  axios({
    url: '/admin-service/healthfacility/unlinked-villages-list',
    method: 'POST',
    data: { tenantIds, userId, appTypes }
  });

export const fetchPeerSupervisorList = (tenantIds: number[], appTypes: string[]) =>
  axios({
    url: '/user-service/user/peer-supervisors',
    method: 'POST',
    data: { tenantIds, appTypes }
  });

export const fetchWorkflowList = (data: any) =>
  axios({
    url: '/admin-service/clinical-workflow/list',
    method: 'POST',
    data
  });

export const peerSupervisorValidation = (data: any) =>
  axios({
    url: '/user-service/user/validate-peer-supervisors',
    method: 'POST',
    data
  });

export const validateLinkedRestrictionsAPI = (data: any) =>
  axios({
    url: '/admin-service/healthfacility/validate',
    method: 'POST',
    data
  });

export const fetchCultureList = () =>
  axios({
    url: '/admin-service/cultures',
    method: 'POST'
  });

export const fetchCountryCodeList = () =>
  axios({
    url: '/admin-service/country-codes',
    method: 'POST'
  });

export const fetchCityList = (searchTerm: string, appTypes: string[]) =>
  axios({
    url: '/admin-service/healthfacility/list-cities',
    method: 'POST',
    data: { searchTerm, appTypes }
  });
