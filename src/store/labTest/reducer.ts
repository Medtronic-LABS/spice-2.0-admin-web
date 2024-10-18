import * as ACTION_TYPES from './actionTypes';

import { LabtestActions, ILabtestState, ILabTest } from './types';

export const initialState: ILabtestState = {
  labTests: [],
  total: 0,
  loading: false,
  error: null,
  units: [],
  unitsLoading: false,
  customizationLoading: false,
  labTestCustomizationData: {} as ILabTest,
  labtestJson: null
};

const labtestReducer = (state = initialState, action = {} as LabtestActions): ILabtestState => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_LABTEST_CUSTOMIZATION_REQUEST: {
      return {
        ...state,
        loading: true,
        customizationLoading: true
      };
    }
    case ACTION_TYPES.FETCH_LABTEST_CUSTOMIZATION_SUCCESS: {
      return {
        ...state,
        loading: false,
        customizationLoading: false,
        labTestCustomizationData: action.payload,
        labtestJson: action.payload.formInput
      };
    }
    case ACTION_TYPES.FETCH_LABTEST_CUSTOMIZATION_FAILURE: {
      return {
        ...state,
        loading: false,
        customizationLoading: false,
        error: action.error
      };
    }
    case ACTION_TYPES.LABTEST_CUSTOMIZATION_REQUEST: {
      return {
        ...state,
        customizationLoading: true
      };
    }
    case ACTION_TYPES.LABTEST_CUSTOMIZATION_SUCCESS:
    case ACTION_TYPES.LABTEST_CUSTOMIZATION_FAILURE:
      return {
        ...state,
        customizationLoading: false
      };
    case ACTION_TYPES.VALIDATE_LABTEST_REQUEST:
    case ACTION_TYPES.FETCH_LABTEST_REQUEST:
    case ACTION_TYPES.DELETE_LABTEST_REQUEST:
      return {
        ...state,
        loading: true
      };
    case ACTION_TYPES.DELETE_LABTEST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };
    case ACTION_TYPES.FETCH_LABTEST_SUCCESS:
      return {
        ...state,
        labTests: action.payload.labtests,
        total: action.payload.total,
        loading: false
      };
    case ACTION_TYPES.VALIDATE_LABTEST_FAILURE:
    case ACTION_TYPES.FETCH_LABTEST_FAILURE:
    case ACTION_TYPES.DELETE_LABTEST_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.error
      };
    }
    case ACTION_TYPES.VALIDATE_LABTEST_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case ACTION_TYPES.FETCH_UNIT_LIST_REQUEST:
      return {
        ...state,
        unitsLoading: true
      };
    case ACTION_TYPES.FETCH_UNIT_LIST_SUCCESS:
      return {
        ...state,
        units: action.payload,
        unitsLoading: false
      };
    case ACTION_TYPES.FETCH_UNIT_LIST_FAILURE:
      return {
        ...state,
        unitsLoading: false,
        error: action.error
      };
    default:
      return {
        ...state
      };
  }
};

export default labtestReducer;
