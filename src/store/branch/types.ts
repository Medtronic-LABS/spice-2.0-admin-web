import { IChiefdom, IDistrict } from '../healthFacility/types';
import * as ACTION_TYPES from './actionTypes';

type BranchPositionCountValue = string | number | null;

interface IBranchPositionCounts {
  skPositionCount?: BranchPositionCountValue;
  ssPositionCount?: BranchPositionCountValue;
  poPositionCount?: BranchPositionCountValue;
  foPositionCount?: BranchPositionCountValue;
}

interface IBranchBase extends IBranchPositionCounts {
  name: string;
  code: string;
  currentAccountCode: string;
}

export interface IBranch extends IBranchBase {
  id: number;
  district: IDistrict;
  chiefdom: IChiefdom;
}

export interface ICreateBranchRequestPayload extends IBranchBase {
  districtId: number;
  chiefdomId: number;
}

export interface IUpdateBranchRequestPayload extends ICreateBranchRequestPayload {
  id: number;
}

export interface IBranchState {
  branches: IBranch[];
  branchesByUnion: IBranch[];
  branchSummary: IBranch | null;
  loading: boolean;
  loadingBranchesByUnion: boolean;
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

export interface IBranchRegionFilterPayload {
  unionIds?: number[];
  districtIds?: number[];
  chiefdomIds?: number[];
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

export interface IFetchBranchSummaryRequest {
  type: typeof ACTION_TYPES.FETCH_BRANCH_SUMMARY_REQUEST;
  branchId: number;
  successCb?: (data: IBranch) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchBranchSummarySuccess {
  type: typeof ACTION_TYPES.FETCH_BRANCH_SUMMARY_SUCCESS;
  payload: IBranch;
}

export interface IFetchBranchSummaryFailure {
  type: typeof ACTION_TYPES.FETCH_BRANCH_SUMMARY_FAILURE;
  error: Error;
}

export interface ISetBranchSummary {
  type: typeof ACTION_TYPES.SET_BRANCH_SUMMARY;
  data: Partial<IBranch>;
}

export interface IClearBranchSummary {
  type: typeof ACTION_TYPES.CLEAR_BRANCH_SUMMARY;
}

export interface IFetchBranchesByUnionRequest {
  type: typeof ACTION_TYPES.FETCH_BRANCHES_BY_UNION_REQUEST;
  payload: IBranchRegionFilterPayload;
  successCb?: (branches: IBranch[]) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchBranchesByUnionSuccess {
  type: typeof ACTION_TYPES.FETCH_BRANCHES_BY_UNION_SUCCESS;
  payload: IBranch[];
}

export interface IFetchBranchesByUnionFailure {
  type: typeof ACTION_TYPES.FETCH_BRANCHES_BY_UNION_FAILURE;
  error: Error;
}

export interface IClearBranchesByUnion {
  type: typeof ACTION_TYPES.CLEAR_BRANCHES_BY_UNION;
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
  | IClearBranchList
  | IFetchBranchSummaryRequest
  | IFetchBranchSummarySuccess
  | IFetchBranchSummaryFailure
  | ISetBranchSummary
  | IClearBranchSummary
  | IFetchBranchesByUnionRequest
  | IFetchBranchesByUnionSuccess
  | IFetchBranchesByUnionFailure
  | IClearBranchesByUnion;
