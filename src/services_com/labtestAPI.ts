import axios from 'axios';
import { IFetchLabtest, ILabTest } from '../store/labTest_com/types';

export const fetchLabTest = (data: IFetchLabtest) =>
  axios({
    method: 'POST',
    url: '/admin-service/lab-test-customization/list',
    data
  });

export const fetchLabtestCustomization = ({ name, countryId }: { name: string; countryId: number }) =>
  axios({
    method: 'POST',
    url: `/admin-service/lab-test-customization/get-by-unique-name`,
    data: {
      name,
      countryId
    }
  });

export const fetchLabTestbyId = (data: { tenantId: string; id: string }) =>
  axios({
    method: 'POST',
    url: '/admin-service/labtest/details',
    data
  });

export const addLabTestCustomization = (data: ILabTest) =>
  axios({
    method: 'POST',
    url: '/admin-service/lab-test-customization/create',
    data
  });
export const updateLabTestCustomization = (data: ILabTest) =>
  axios({
    method: 'POST',
    url: '/admin-service/lab-test-customization/update',
    data
  });

export const deleteLabtest = (data: { id: number }) =>
  axios({
    method: 'POST',
    url: '/admin-service/lab-test-customization/delete',
    data
  });

export const fetchUnitList = () =>
  axios({
    method: 'GET',
    url: '/admin-service/unit/list/LABTEST'
  });

export const validateLabtest = (data: { name: string; countryId: any }) =>
  axios({
    method: 'POST',
    url: 'admin-service/lab-test-customization/validate',
    data
  });
