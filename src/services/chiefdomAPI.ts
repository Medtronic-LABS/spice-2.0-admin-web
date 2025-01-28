import axios from 'axios';
import {
  IDeleteChiefdomAdminRequest,
  IFetchChiefdomAdminsRequest,
  IFetchChiefdomByIdRequest,
  IChiefdomFormData,
  IChiefdomAdminApiData
} from '../store/chiefdom/types';

export const fetchChiefdomDashboardList = (
  tenantId: string,
  limit: number | null,
  skip: number,
  sort: string,
  appTypes: string[],
  searchTerm?: string
) =>
  axios({
    method: 'POST',
    url: '/admin-service/chiefdom/list',
    data: {
      appTypes,
      limit,
      skip,
      sort,
      tenantId,
      searchTerm: searchTerm || ''
    }
  });

export const getChiefdomDetails = (data: { tenantId: string; id: string }) =>
  axios({
    url: '/admin-service/chiefdom/details',
    method: 'POST',
    data
  });

export const fetchChiefdomList = (tenantId: string, limit?: number | null, skip?: number, searchName?: string) =>
  axios({
    method: 'POST',
    url: '/admin-service/chiefdom/all',
    data: {
      tenantId,
      limit,
      skip,
      searchTerm: searchName || ''
    }
  });

export const createChiefdom = (data: IChiefdomFormData) => {
  return axios({
    method: 'POST',
    url: '/user-service/organization/create-chiefdom',
    data
  });
};

export const updateChiefdom = (data: Omit<IChiefdomFormData, 'users' | 'parentOrganizationId'>) => {
  return axios({
    method: 'PUT',
    url: '/admin-service/chiefdom/update',
    data: {
      id: data.id,
      tenantId: data.tenantId,
      name: data.name
    }
  });
};

export const createChiefdomAdmin = (data: IChiefdomAdminApiData) =>
  axios({
    method: 'POST',
    url: '/admin-service/chiefdom/user-add',
    data
  });

export const updateChiefdomAdmin = (data: IChiefdomAdminApiData) =>
  axios({
    method: 'PUT',
    url: '/admin-service/chiefdom/user-update',
    data
  });

export const deleteChiefdomAdmin = (data: IDeleteChiefdomAdminRequest['payload']) =>
  axios({
    method: 'DELETE',
    url: '/admin-service/chiefdom/user-remove',
    data
  });

export const fetchChiefdomById = (data: IFetchChiefdomByIdRequest['payload']) =>
  axios({
    method: 'POST',
    url: '/admin-service/chiefdom/details',
    data: { ...data, is_user_not_required: true }
  });

export const fetchChiefdomAdmins = (data: IFetchChiefdomAdminsRequest) =>
  axios({
    method: 'POST',
    url: '/user-service/user/admin-users',
    data
  });

export const fetchChiefdomForDropdown = (params: { tenantId: string }) =>
  axios({
    method: 'POST',
    url: '/admin-service/chiefdom/all',
    data: {
      tenantId: params.tenantId,
      isPaginated: false
    }
  });
