import {
  ACTION_TYPES,
  ICHWHouseholdRegistrationState,
  CHWHouseholdRegistrationActions
} from './types';

const initialState: ICHWHouseholdRegistrationState = {
  householdRegistrationData: [],
  loading: false,
  error: null
};

const chwHouseholdRegistrationReducer = (
  state = initialState,
  action: CHWHouseholdRegistrationActions
): ICHWHouseholdRegistrationState => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_HOUSEHOLD_REGISTRATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ACTION_TYPES.FETCH_HOUSEHOLD_REGISTRATION_SUCCESS:
      return {
        ...state,
        loading: false,
        householdRegistrationData: action.payload,
        error: null
      };
    case ACTION_TYPES.FETCH_HOUSEHOLD_REGISTRATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case ACTION_TYPES.CLEAR_HOUSEHOLD_REGISTRATION_DATA:
      return {
        ...state,
        householdRegistrationData: [],
        error: null
      };
    default:
      return state;
  }
};

export default chwHouseholdRegistrationReducer;
