import * as BRANCH_TYPES from './actionTypes';
import {
  IFetchBranchListSuccess,
  IFetchBranchListSuccessPayload,
  IFetchBranchListFailure,
  ICreateBranchRequest,
  ICreateBranchRequestPayload,
  ICreateBranchFailure,
  IUpdateBranchRequest,
  IUpdateBranchRequestPayload,
  IUpdateBranchFailure,
  IUpdateBranchSuccess,
  IClearBranchList,
  IFetchBranchListRequestPayload,
  IFetchBranchSummaryRequest,
  IFetchBranchSummarySuccess,
  IFetchBranchSummaryFailure,
  IBranch,
  ISetBranchSummary,
  IClearBranchSummary,
  IFetchBranchesByUnionRequest,
  IFetchBranchesByUnionSuccess,
  IFetchBranchesByUnionFailure,
  IClearBranchesByUnion,
  IBranchRegionFilterPayload
} from './types';

export const fetchBranchListRequest = ({
  payload,
  successCb,
  failureCb
}: {
  payload: IFetchBranchListRequestPayload;
  successCb?: (data: IFetchBranchListSuccessPayload) => void;
  failureCb?: (error: Error) => void;
}) => ({
  type: BRANCH_TYPES.FETCH_BRANCH_LIST_REQUEST,
  payload,
  successCb,
  failureCb
});

export const fetchBranchListSuccess = (
  payload: IFetchBranchListSuccessPayload
): IFetchBranchListSuccess => ({
  type: BRANCH_TYPES.FETCH_BRANCH_LIST_SUCCESS,
  payload
});

export const fetchBranchListFailure = (error: Error): IFetchBranchListFailure => ({
  type: BRANCH_TYPES.FETCH_BRANCH_LIST_FAILURE,
  error
});

export const createBranchRequest = ({
  payload,
  successCb,
  failureCb
}: {
  payload: ICreateBranchRequestPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}): ICreateBranchRequest => ({
  type: BRANCH_TYPES.CREATE_BRANCH_REQUEST,
  payload,
  successCb,
  failureCb
});

export const createBranchSuccess = () => ({
  type: BRANCH_TYPES.CREATE_BRANCH_SUCCESS
});

export const createBranchFailure = (error: Error): ICreateBranchFailure => ({
  type: BRANCH_TYPES.CREATE_BRANCH_FAILURE,
  error
});

export const updateBranchRequest = ({
  payload,
  successCb,
  failureCb
}: {
  payload: IUpdateBranchRequestPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}): IUpdateBranchRequest => ({
  type: BRANCH_TYPES.UPDATE_BRANCH_REQUEST,
  payload,
  successCb,
  failureCb
});

export const updateBranchSuccess = (): IUpdateBranchSuccess => ({
  type: BRANCH_TYPES.UPDATE_BRANCH_SUCCESS
});

export const updateBranchFailure = (error: Error): IUpdateBranchFailure => ({
  type: BRANCH_TYPES.UPDATE_BRANCH_FAILURE,
  error
});

export const clearBranchList = (): IClearBranchList => ({
  type: BRANCH_TYPES.CLEAR_BRANCH_LIST
});

export const fetchBranchSummaryRequest = ({
  branchId,
  successCb,
  failureCb
}: {
  branchId: number;
  successCb?: (data: IBranch) => void;
  failureCb?: (error: Error) => void;
}): IFetchBranchSummaryRequest => ({
  type: BRANCH_TYPES.FETCH_BRANCH_SUMMARY_REQUEST,
  branchId,
  successCb,
  failureCb
});

export const fetchBranchSummarySuccess = (payload: IBranch): IFetchBranchSummarySuccess => ({
  type: BRANCH_TYPES.FETCH_BRANCH_SUMMARY_SUCCESS,
  payload
});

export const fetchBranchSummaryFailure = (error: Error): IFetchBranchSummaryFailure => ({
  type: BRANCH_TYPES.FETCH_BRANCH_SUMMARY_FAILURE,
  error
});

export const setBranchSummary = (data: Partial<IBranch>): ISetBranchSummary => ({
  type: BRANCH_TYPES.SET_BRANCH_SUMMARY,
  data
});

export const clearBranchSummary = (): IClearBranchSummary => ({
  type: BRANCH_TYPES.CLEAR_BRANCH_SUMMARY
});

export const fetchBranchesByUnionRequest = ({
  payload,
  successCb,
  failureCb
}: {
  payload: IBranchRegionFilterPayload
  successCb?: (branches: IBranch[]) => void;
  failureCb?: (error: Error) => void;
}): IFetchBranchesByUnionRequest => ({
  type: BRANCH_TYPES.FETCH_BRANCHES_BY_UNION_REQUEST,
  payload,
  successCb,
  failureCb
});

export const fetchBranchesByUnionSuccess = (payload: IBranch[]): IFetchBranchesByUnionSuccess => ({
  type: BRANCH_TYPES.FETCH_BRANCHES_BY_UNION_SUCCESS,
  payload
});

export const fetchBranchesByUnionFailure = (error: Error): IFetchBranchesByUnionFailure => ({
  type: BRANCH_TYPES.FETCH_BRANCHES_BY_UNION_FAILURE,
  error
});

export const clearBranchesByUnion = (): IClearBranchesByUnion => ({
  type: BRANCH_TYPES.CLEAR_BRANCHES_BY_UNION
});
