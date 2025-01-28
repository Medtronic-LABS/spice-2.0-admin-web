import axios from 'axios';
import {
  IDistrictPayload,
  IDistrictInfo,
  IDistrictAdmin,
  IDistrictDeactivate,
  IFetchDistrictList,
  IFetchDistrictOptionsPayload
} from '../store/district/types';

export const fetchDistrictList = (
  countryId: number,
  tenantId: number,
  isActive: boolean,
  skip: number,
  limit: number | null,
  appTypes: string[],
  search?: string
) =>
  axios({
    method: 'POST',
    url: '/admin-service/district/district-list',
    data: {
      countryId,
      appTypes,
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
    url: '/admin-service/district/deactivate-list',
    data: {
      skip,
      limit,
      sort,
      searchTerm: search || '',
      tenantId
    }
  });

export const createDistrict = (data: IDistrictPayload) =>
  axios({
    method: 'POST',
    url: '/user-service/organization/create-district',
    data
  });

export const fetchDistrictDetails = (data: { tenantId: number; id: number }) =>
  axios({
    method: 'POST',
    url: '/admin-service/district/details',
    data
  });

export const fetchDashboardDistrict = (data: { skip: number; limit: number; tenantId: string; searchTerm: string }) =>
  axios({
    method: 'POST',
    url: '/admin-service/district/list',
    data
  });

export const updateDistrict = (data: IDistrictInfo) =>
  axios({
    method: 'POST',
    url: '/admin-service/district/update',
    data
  });

export const createDistrictAdmin = (data: IDistrictAdmin) =>
  axios({
    url: '/admin-service/district/user-add',
    method: 'POST',
    data
  });

export const updateDistrictAdmin = (data: IDistrictAdmin) =>
  axios({
    url: '/admin-service/district/user-update',
    method: 'PUT',
    data
  });

export const deleteDistrictAdmin = (data: { tenantId: string | number; id: string | number }) =>
  axios({
    url: '/admin-service/district/user-remove',
    method: 'DELETE',
    data
  });

export const activateAccount = (data: { tenantId: number }) =>
  axios({
    url: '/admin-service/district/activate',
    method: 'PUT',
    data
  });

export const deactivateDistrict = (data: IDistrictDeactivate) =>
  axios({
    url: '/admin-service/district/deactivate',
    method: 'POST',
    data
  });

export const fetchDistrictOptions = (data: IFetchDistrictOptionsPayload) =>
  axios({
    method: 'POST',
    url: '/admin-service/district/district-list',
    data
  });

export const fetchDistrictAdmins = (data: IFetchDistrictList) =>
  axios({
    method: 'POST',
    url: '/user-service/user/admin-users',
    data
  });
