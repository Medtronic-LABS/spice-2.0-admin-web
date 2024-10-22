import axios from 'axios';
import { IDeleteMedicationRequestPayload, IMedicationPayload } from '../store/medication_com/types';

export const getMedicationList = (skip: number, limit: number | null, countryId: string, search?: string) =>
  axios({
    url: '/admin-service/medication/list',
    method: 'POST',
    data: {
      countryId: Number(countryId),
      limit,
      skip,
      ...(search ? { searchTerm: search } : {})
    }
  });

export const getMedicationClassifications = (countryId: number) =>
  axios({
    method: 'POST',
    url: '/admin-service/medication/classification-list',
    data: {
      countryId
    }
  });

export const getMedicationDosageForm = () =>
  axios({
    method: 'POST',
    url: '/admin-service/medication/dosageform-list'
  });

export const getMedicationCategory = () =>
  axios({
    method: 'GET',
    url: 'spice-service/category/list'
  });

export const createMedication = (data: IMedicationPayload) =>
  axios({
    method: 'POST',
    url: '/admin-service/medication/create',
    data
  });

export const updateMedication = (data: IMedicationPayload) =>
  axios({
    method: 'PUT',
    url: '/admin-service/medication/update',
    data
  });

export const validateMedication = (data: IMedicationPayload) =>
  axios({
    method: 'POST',
    url: '/admin-service/medication/validate',
    data
  });

export const deleteMedication = (data: IDeleteMedicationRequestPayload) =>
  axios({
    method: 'POST',
    url: 'admin-service/medication/remove',
    data
  });
