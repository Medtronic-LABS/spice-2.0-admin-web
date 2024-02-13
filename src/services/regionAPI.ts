import axios from 'axios';

export const uploadFile = (file: any) => {
  const data = new FormData();
  data.append('file', file);
  return axios({
    method: 'POST',
    url: '/admin-service/region/upload-file',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const downloadFile = (countryId: number) => {
  return axios({
    method: 'POST',
    url: '/admin-service/region/download-file',
    responseType: 'blob',
    data: {
      countryId
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
