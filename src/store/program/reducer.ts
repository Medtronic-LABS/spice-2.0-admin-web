import * as PROGRAM_ACTION_TYPES from './actionTypes';

import { ProgramActions, IProgramState } from './types';

export const initialState: IProgramState = {
  loading: false,
  total: 0,
  programList: [],
  program: {
    id: '',
    name: '',
    healthFacilities: [],
    country: { id: '' },
    tenantId: '',
    deletedHealthFacilities: [],
    active: false
  },
  hfDropdownLoading: false,
  hfDropdownOptions: {
    list: [],
    countryId: ''
  },
  error: null
};

const programReducer = (state: IProgramState = initialState, action = {} as ProgramActions) => {
  switch (action.type) {
    case PROGRAM_ACTION_TYPES.FETCH_PROGRAM_LIST_REQUEST:
    case PROGRAM_ACTION_TYPES.CREATE_PROGRAM_REQUEST:
    case PROGRAM_ACTION_TYPES.FETCH_PROGRAM_DETAILS_REQUEST:
    case PROGRAM_ACTION_TYPES.UPDATE_PROGRAM_REQUEST:
    case PROGRAM_ACTION_TYPES.DELETE_PROGRAM_REQUEST:
      return {
        ...state,
        loading: true
      };
    case PROGRAM_ACTION_TYPES.FETCH_PROGRAM_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        total: action.payload.total || 0,
        programList: action.payload.programs || []
      };
    case PROGRAM_ACTION_TYPES.FETCH_PROGRAM_LIST_FAILURE:
    case PROGRAM_ACTION_TYPES.CREATE_PROGRAM_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case PROGRAM_ACTION_TYPES.CLEAR_PROGRAM_LIST:
      return {
        ...state,
        total: 0,
        programList: []
      };
    case PROGRAM_ACTION_TYPES.CREATE_PROGRAM_REQUEST_SUCCESS:
    case PROGRAM_ACTION_TYPES.UPDATE_PROGRAM_SUCCESS:
    case PROGRAM_ACTION_TYPES.FETCH_PROGRAM_DETAILS_FAILURE:
    case PROGRAM_ACTION_TYPES.UPDATE_PROGRAM_FAILURE:
    case PROGRAM_ACTION_TYPES.DELETE_PROGRAM_SUCCESS:
    case PROGRAM_ACTION_TYPES.DELETE_PROGRAM_FAILURE:
      return {
        ...state,
        loading: false
      };
    case PROGRAM_ACTION_TYPES.FETCH_PROGRAM_DETAILS_SUCCESS:
      return {
        ...state,
        program: action.payload,
        loading: false
      };
    case PROGRAM_ACTION_TYPES.FETCH_HF_DROPDOWN_SUCCESS:
      return {
        ...state,
        hfDropdownLoading: false,
        hfDropdownOptions: action.payload
      };
    case PROGRAM_ACTION_TYPES.FETCH_HF_DROPDOWN_REQUEST:
      return {
        ...state,
        siteDropdownLoading: true
      };
    case PROGRAM_ACTION_TYPES.FETCH_HF_DROPDOWN_FAILURE:
      return {
        ...state,
        siteDropdownLoading: false,
        error: action.error
      };
    case PROGRAM_ACTION_TYPES.CLEAR_HF_DROPDOWN_OPTIONS:
      return {
        ...state,
        siteDropdownLoading: false,
        siteDropdownOptions: { list: [], regionTenantId: '' }
      };
    default:
      return state;
  }
};

export default programReducer;
