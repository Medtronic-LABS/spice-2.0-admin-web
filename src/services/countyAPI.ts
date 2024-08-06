import axios from 'axios';
import {
  ICountyPayload,
  ICountyInfo,
  ICountyAdmin,
  ICountyDeactivate,
  IFetchCountyList,
  ICountyWorkflowModuleReqPayload,
  IDeleteCountyWorkflowModuleReqPayload,
  IFetchClinicalWorkflowReqPayload,
  IFetchCountyOptionsPayload
} from '../store/county/types';

export const fetchCountyList = (
  tenantId: number,
  isActive: boolean,
  skip: number,
  limit: number | null,
  search?: string
) =>
  axios({
    method: 'POST',
    url: '/admin-service/county/county-list',
    data: {
      tenantId,
      skip,
      limit,
      is_active: isActive,
      searchTerm: search || ''
    }
  });

export const fetchDeactivatedAccounts = (
  skip: number,
  limit: number | null,
  sort: string,
  search?: string,
  tenantId?: string
) =>
  axios({
    method: 'POST',
    url: '/admin-service/county/deactivate-list',
    data: {
      skip,
      limit,
      sort,
      search: search || '',
      tenantId
    }
  });

export const createCounty = (data: ICountyPayload) =>
  axios({
    method: 'POST',
    url: '/user-service/organization/create-county',
    data
  });

export const fetchCountyDetails = (data: { tenantId: number; id: number }) =>
  axios({
    method: 'POST',
    url: '/admin-service/county/details',
    data
  });

export const fetchDashboardCounty = (data: { skip: number; limit: number; tenantId: string; searchTerm: string }) =>
  axios({
    method: 'POST',
    url: '/admin-service/county/list',
    data
  });

export const updateCounty = (data: ICountyInfo) =>
  axios({
    method: 'POST',
    url: '/admin-service/county/update',
    data
  });

export const createCountyAdmin = (data: ICountyAdmin) =>
  axios({
    url: '/admin-service/county/user-add',
    method: 'POST',
    data
  });

export const updateCountyAdmin = (data: ICountyAdmin) =>
  axios({
    url: '/admin-service/county/user-update',
    method: 'PUT',
    data
  });

export const deleteCountyAdmin = (data: { tenantId: string | number; id: string | number }) =>
  axios({
    url: '/admin-service/county/user-remove',
    method: 'DELETE',
    data
  });

export const activateCounty = (data: { tenantId: number }) =>
  axios({
    url: '/admin-service/county/activate',
    method: 'PUT',
    data
  });

export const deactivateCounty = (data: ICountyDeactivate) =>
  axios({
    url: '/admin-service/county/deactivate',
    method: 'POST',
    data
  });

export const fetchCountyOptions = (data: IFetchCountyOptionsPayload) =>
  axios({
    method: 'POST',
    url: '/admin-service/county/county-list',
    data
  });

export const fetchCountyAdmins = (data: IFetchCountyList) =>
  axios({
    method: 'POST',
    url: '/user-service/user/admin-users',
    data
  });

export const fetchClinicalWorkflows = (data: IFetchClinicalWorkflowReqPayload) =>
  axios({
    method: 'POST',
    url: '/admin-service/clinical-workflow/list',
    data
  });

export const createCountyWorkflowModule = (data: ICountyWorkflowModuleReqPayload) =>
  axios({
    method: 'POST',
    url: '/admin-service/clinical-workflow/create',
    data
  });

export const updateCountyWorkflowModule = (data: ICountyWorkflowModuleReqPayload) =>
  axios({
    method: 'PUT',
    url: '/admin-service/clinical-workflow/update',
    data
  });

export const deleteCountyWorkflowModule = (data: IDeleteCountyWorkflowModuleReqPayload) =>
  axios({
    method: 'PUT',
    url: '/admin-service/clinical-workflow/remove',
    data
  });
