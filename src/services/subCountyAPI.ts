import axios from 'axios';
import {
  IDeleteSubCountyAdminRequest,
  IFetchSubCountyAdminsRequest,
  IFetchSubCountyByIdRequest,
  ISubCountyFormData,
  IOuAdminApiData
} from '../store/subCounty/types';

export const fetchSubCountyDashboardList = (
  tenantId: string,
  limit: number | null,
  skip: number,
  sort: string,
  searchTerm?: string
) =>
  axios({
    method: 'POST',
    url: '/admin-service/sub-county/list',
    data: {
      limit,
      skip,
      sort,
      tenantId,
      searchTerm: searchTerm || ''
    }
  });

export const getSubCountyDetails = (data: { tenantId: string; id: string }) =>
  axios({
    url: '/admin-service/sub-county/details',
    method: 'POST',
    data
  });

export const fetchSubCountyList = (tenantId: string, limit?: number | null, skip?: number, searchName?: string) =>
  axios({
    method: 'POST',
    url: '/admin-service/sub-county/all',
    data: {
      tenantId,
      limit,
      skip,
      searchTerm: searchName || ''
    }
  });

export const createSubCounty = (data: ISubCountyFormData) => {
  return axios({
    method: 'POST',
    url: '/user-service/organization/create-sub-county',
    data
  });
};

export const updateSubCounty = (data: Omit<ISubCountyFormData, 'users' | 'parentOrganizationId'>) => {
  return axios({
    method: 'PUT',
    url: '/admin-service/sub-county/update',
    data: {
      id: data.id,
      tenantId: data.tenantId,
      name: data.name
    }
  });
};

export const createSubCountyAdmin = (data: IOuAdminApiData) =>
  axios({
    method: 'POST',
    url: '/admin-service/sub-county/user-add',
    data
  });

export const updateSubCountyAdmin = (data: IOuAdminApiData) =>
  axios({
    method: 'PUT',
    url: '/admin-service/sub-county/user-update',
    data
  });

export const deleteSubCountyAdmin = (data: IDeleteSubCountyAdminRequest['payload']) =>
  axios({
    method: 'DELETE',
    url: '/admin-service/sub-county/user-remove',
    data
  });

export const fetchSubCountyById = (data: IFetchSubCountyByIdRequest['payload']) =>
  axios({
    method: 'POST',
    url: '/admin-service/sub-county/details',
    data: { ...data, is_user_not_required: true }
  });

export const fetchSubCountyAdmins = (data: IFetchSubCountyAdminsRequest) =>
  axios({
    method: 'POST',
    url: '/user-service/user/admin-users',
    data
  });

export const fetchSubCountyForDropdown = (params: { tenantId: string }) =>
  axios({
    method: 'POST',
    url: '/admin-service/sub-county/all',
    data: {
      tenantId: params.tenantId,
      isPaginated: false
    }
  });
