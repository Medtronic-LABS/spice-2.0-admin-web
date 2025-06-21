import {
  ACTION_TYPES,
  IFetchHouseholdRegistrationRequest,
  IFetchHouseholdRegistrationSuccess,
  IFetchHouseholdRegistrationFailure,
  IClearHouseholdRegistrationData,
  IHouseholdRegistrationData
} from './types';

export const fetchHouseholdRegistrationRequest = ({
  chwId,
  healthFacilityId,
  successCb,
  failureCb
}: Omit<IFetchHouseholdRegistrationRequest, 'type'>): IFetchHouseholdRegistrationRequest => ({
  type: ACTION_TYPES.FETCH_HOUSEHOLD_REGISTRATION_REQUEST,
  chwId,
  healthFacilityId,
  successCb,
  failureCb
});

export const fetchHouseholdRegistrationSuccess = (
  payload: IHouseholdRegistrationData[]
): IFetchHouseholdRegistrationSuccess => ({
  type: ACTION_TYPES.FETCH_HOUSEHOLD_REGISTRATION_SUCCESS,
  payload
});

export const fetchHouseholdRegistrationFailure = (error: string): IFetchHouseholdRegistrationFailure => ({
  type: ACTION_TYPES.FETCH_HOUSEHOLD_REGISTRATION_FAILURE,
  error
});

export const clearHouseholdRegistrationData = (): IClearHouseholdRegistrationData => ({
  type: ACTION_TYPES.CLEAR_HOUSEHOLD_REGISTRATION_DATA
});
