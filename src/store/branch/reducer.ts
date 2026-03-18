import * as BRANCH_TYPES from './actionTypes';
import { BranchActions, IBranch, IBranchState } from './types';

export const initialState: IBranchState = {
  branches: [],
  branchesByUnion: [],
  branchSummary: null,
  loading: false,
  loadingBranchesByUnion: false,
  totalCount: 0,
  error: null
};

const branchReducer = (state = initialState, action = {} as BranchActions): IBranchState => {
  switch (action.type) {
    case BRANCH_TYPES.FETCH_BRANCH_LIST_REQUEST:
    case BRANCH_TYPES.CREATE_BRANCH_REQUEST:
    case BRANCH_TYPES.UPDATE_BRANCH_REQUEST:
    case BRANCH_TYPES.FETCH_BRANCH_SUMMARY_REQUEST:
      return { ...state, loading: true };
    case BRANCH_TYPES.FETCH_BRANCHES_BY_UNION_REQUEST:
      return { ...state, loadingBranchesByUnion: true };
    case BRANCH_TYPES.FETCH_BRANCH_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        branches: action.payload.branches,
        totalCount: action.payload.totalCount,
        error: null
      };
    case BRANCH_TYPES.FETCH_BRANCH_SUMMARY_SUCCESS:
      return {
        ...state,
        loading: false,
        branchSummary: action.payload,
        error: null
      };
    case BRANCH_TYPES.FETCH_BRANCHES_BY_UNION_SUCCESS:
      return {
        ...state,
        loadingBranchesByUnion: false,
        branchesByUnion: action.payload,
        error: null
      };
    case BRANCH_TYPES.FETCH_BRANCH_LIST_FAILURE:
    case BRANCH_TYPES.CREATE_BRANCH_FAILURE:
    case BRANCH_TYPES.UPDATE_BRANCH_FAILURE:
    case BRANCH_TYPES.FETCH_BRANCH_SUMMARY_FAILURE:
      return { ...state, loading: false, error: action.error };
    case BRANCH_TYPES.FETCH_BRANCHES_BY_UNION_FAILURE:
      return { ...state, loadingBranchesByUnion: false, error: action.error };
    case BRANCH_TYPES.CREATE_BRANCH_SUCCESS:
    case BRANCH_TYPES.UPDATE_BRANCH_SUCCESS:
      return { ...state, loading: false, error: null };
    case BRANCH_TYPES.CLEAR_BRANCH_LIST:
      return {
        ...initialState
      };
    case BRANCH_TYPES.CLEAR_BRANCHES_BY_UNION:
      return {
        ...state,
        branchesByUnion: []
      };
    case BRANCH_TYPES.SET_BRANCH_SUMMARY:
      return {
        ...state,
        branchSummary: action.data ? { ...(state.branchSummary || ({} as IBranch)), ...action.data } : null
      };
    case BRANCH_TYPES.CLEAR_BRANCH_SUMMARY:
      return {
        ...state,
        branchSummary: null
      };
    default:
      return state;
  }
};

export default branchReducer;
