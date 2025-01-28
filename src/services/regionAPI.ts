import axios from 'axios';
import { IFetchRegionDetailReqPayload, IRegionPayload } from '../store/region/types';

export const uploadFile = (file: any, appTypes: string) => {
  const data = new FormData();
  data.append('file', file);
  data.append('appTypes', appTypes);
  return axios({
    method: 'POST',
    url: '/admin-service/region-details/upload-file',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const downloadFile = (countryId: number, appTypes: string[]) => {
  return axios({
    method: 'POST',
    url: '/admin-service/region-details/download-file',
    responseType: 'blob',
    data: {
      countryId,
      appTypes
    }
  });
};

export const regionDetails = (countryId: number, limit: number | null, skip: number, search?: string) =>
  axios({
    method: 'POST',
    url: '/admin-service/region-details',
    data: {
      countryId,
      searchTerm: search || '',
      skip: skip || 0,
      limit: limit || 0
    }
  });
export const fetchRegions = (limit: number | null, skip: number, sort: string, search?: string) =>
  axios({
    method: 'POST',
    url: '/admin-service/country/list',
    data: {
      searchTerm: search || '',
      skip: skip || '',
      limit: limit || ''
    }
  });

export const createRegion = (data: IRegionPayload) =>
  axios({
    method: 'POST',
    url: '/user-service/organization/create-country',
    data
  });

export const getCountryDetail = (data: IFetchRegionDetailReqPayload) =>
  axios({
    url: '/admin-service/country/details',
    method: 'POST',
    data
  });

export const getRegionDetailById = (countryId: string) =>
  axios({
    url: `/admin-service/data/get-country/${countryId}`,
    method: 'GET'
  });
