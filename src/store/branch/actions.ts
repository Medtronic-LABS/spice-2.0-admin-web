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
  IFetchBranchListRequestPayload
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
