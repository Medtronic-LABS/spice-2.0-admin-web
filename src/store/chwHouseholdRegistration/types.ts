export interface IHouseholdRegistrationData {
  month: string;
  registered: number;
  target: number;
  achievement: number;
}

export interface ICHWHouseholdRegistrationState {
  householdRegistrationData: IHouseholdRegistrationData[];
  loading: boolean;
  error: string | null;
}

export interface IFetchHouseholdRegistrationRequest {
  type: typeof ACTION_TYPES.FETCH_HOUSEHOLD_REGISTRATION_REQUEST;
  chwId?: number;
  healthFacilityId?: number;
  successCb?: (data: IHouseholdRegistrationData[]) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchHouseholdRegistrationSuccess {
  type: typeof ACTION_TYPES.FETCH_HOUSEHOLD_REGISTRATION_SUCCESS;
  payload: IHouseholdRegistrationData[];
}

export interface IFetchHouseholdRegistrationFailure {
  type: typeof ACTION_TYPES.FETCH_HOUSEHOLD_REGISTRATION_FAILURE;
  error: string;
}

export interface IClearHouseholdRegistrationData {
  type: typeof ACTION_TYPES.CLEAR_HOUSEHOLD_REGISTRATION_DATA;
}

export const ACTION_TYPES = {
  FETCH_HOUSEHOLD_REGISTRATION_REQUEST: 'FETCH_HOUSEHOLD_REGISTRATION_REQUEST',
  FETCH_HOUSEHOLD_REGISTRATION_SUCCESS: 'FETCH_HOUSEHOLD_REGISTRATION_SUCCESS',
  FETCH_HOUSEHOLD_REGISTRATION_FAILURE: 'FETCH_HOUSEHOLD_REGISTRATION_FAILURE',
  CLEAR_HOUSEHOLD_REGISTRATION_DATA: 'CLEAR_HOUSEHOLD_REGISTRATION_DATA'
} as const;

export type CHWHouseholdRegistrationActions =
  | IFetchHouseholdRegistrationRequest
  | IFetchHouseholdRegistrationSuccess
  | IFetchHouseholdRegistrationFailure
  | IClearHouseholdRegistrationData;
