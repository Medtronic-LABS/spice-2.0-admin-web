import { IChiefdom, IDistrict } from '../healthFacility/types';
import * as ACTION_TYPES from './actionTypes';

interface BranchPositionCounts {
  skPositionCount?: string | number | null;
  ssPositionCount?: string | number | null;
  poPositionCount?: string | number | null;
  foPositionCount?: string | number | null;
}

interface BranchBase extends BranchPositionCounts {
  name: string;
  code: string;
  currentAccountCode: string;
}

export interface IBranch extends BranchBase {
  id: number;
  district: IDistrict;
  chiefdom: IChiefdom;
}

export interface ICreateBranchRequestPayload extends BranchBase {
  districtId: number;
  chiefdomId: number;
}

export interface IUpdateBranchRequestPayload extends ICreateBranchRequestPayload {
  id: number;
}

export interface IBranchState {
  branches: IBranch[];
  loading: boolean;
  totalCount: number;
  error: string | null | Error;
}

export interface IFetchBranchListSuccessPayload {
  branches: IBranch[];
  totalCount: number;
}

export interface IFetchBranchListSuccess {
  type: typeof ACTION_TYPES.FETCH_BRANCH_LIST_SUCCESS;
  payload: IFetchBranchListSuccessPayload;
}

export interface IFetchBranchListRequestPayload {
  countryId: number;
  limit: number;
  skip: number;
  searchTerm: string;
  districtIds?: number[] | string[];
  chiefdomIds?: number[] | string[];
}

export interface IFetchBranchListRequest {
  type: typeof ACTION_TYPES.FETCH_BRANCH_LIST_REQUEST;
  payload: IFetchBranchListRequestPayload;
  successCb?: (data: IFetchBranchListSuccessPayload) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchBranchListFailure {
  type: typeof ACTION_TYPES.FETCH_BRANCH_LIST_FAILURE;
  error: Error;
}

export interface ICreateBranchRequest {
  type: typeof ACTION_TYPES.CREATE_BRANCH_REQUEST;
  payload: ICreateBranchRequestPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface ICreateBranchSuccess {
  type: typeof ACTION_TYPES.CREATE_BRANCH_SUCCESS;
}

export interface ICreateBranchFailure {
  type: typeof ACTION_TYPES.CREATE_BRANCH_FAILURE;
  error: Error;
}

export interface IUpdateBranchRequest {
  type: typeof ACTION_TYPES.UPDATE_BRANCH_REQUEST;
  payload: IUpdateBranchRequestPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IUpdateBranchSuccess {
  type: typeof ACTION_TYPES.UPDATE_BRANCH_SUCCESS;
}

export interface IUpdateBranchFailure {
  type: typeof ACTION_TYPES.UPDATE_BRANCH_FAILURE;
  error: Error;
}

export interface IClearBranchList {
  type: typeof ACTION_TYPES.CLEAR_BRANCH_LIST;
}

export type BranchActions =
  | IFetchBranchListRequest
  | IFetchBranchListSuccess
  | IFetchBranchListFailure
  | ICreateBranchRequest
  | ICreateBranchSuccess
  | ICreateBranchFailure
  | IUpdateBranchRequest
  | IUpdateBranchSuccess
  | IUpdateBranchFailure
  | IClearBranchList;
