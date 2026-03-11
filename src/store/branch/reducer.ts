import * as BRANCH_TYPES from './actionTypes';
import { BranchActions, IBranchState } from './types';

export const initialState: IBranchState = {
  branches: [],
  loading: false,
  totalCount: 0,
  error: null
};

const branchReducer = (state = initialState, action = {} as BranchActions): IBranchState => {
  switch (action.type) {
    case BRANCH_TYPES.FETCH_BRANCH_LIST_REQUEST:
    case BRANCH_TYPES.CREATE_BRANCH_REQUEST:
    case BRANCH_TYPES.UPDATE_BRANCH_REQUEST:
      return { ...state, loading: true };
    case BRANCH_TYPES.FETCH_BRANCH_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        branches: action.payload.branches,
        totalCount: action.payload.totalCount,
        error: null
      };
    case BRANCH_TYPES.FETCH_BRANCH_LIST_FAILURE:
    case BRANCH_TYPES.CREATE_BRANCH_FAILURE:
    case BRANCH_TYPES.UPDATE_BRANCH_FAILURE:
      return { ...state, loading: false, error: action.error };
    case BRANCH_TYPES.CREATE_BRANCH_SUCCESS:
    case BRANCH_TYPES.UPDATE_BRANCH_SUCCESS:
      return { ...state, loading: false, error: null };
    case BRANCH_TYPES.CLEAR_BRANCH_LIST:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export default branchReducer;
