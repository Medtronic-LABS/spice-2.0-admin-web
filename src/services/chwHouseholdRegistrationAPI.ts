import axios from 'axios';

export interface IFetchHouseholdRegistrationParams {
  chwId?: number;
  healthFacilityId?: number;
  startDate?: string;
  endDate?: string;
}

export const fetchCHWHouseholdRegistrationData = (params: IFetchHouseholdRegistrationParams) =>
  axios({
    method: 'POST',
    url: '/admin-service/chw/household-registration/data',
    data: params
  });

export const fetchCHWHouseholdRegistrationSummary = (params: IFetchHouseholdRegistrationParams) =>
  axios({
    method: 'POST',
    url: '/admin-service/chw/household-registration/summary',
    data: params
  });
