import * as ACTION_TYPES from './actionTypes';

export interface ILabTest {
  id?: number | string;
  testName: string;
  codeDetails?: {
    code: string;
    url: string;
  };
  uniqueName: string;
  tenantId: number | string | null;
  countryId: number | string;
  formInput: string | any;
  updatedAt?: string;
  displayOrder?: number;
}

export interface ILabTestCustomizationRequest {
  data: ILabTest;
  type: typeof ACTION_TYPES.LABTEST_CUSTOMIZATION_REQUEST;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface ILabTestCustomizationSuccess {
  type: typeof ACTION_TYPES.LABTEST_CUSTOMIZATION_SUCCESS;
}
export interface ILabTestCustomizationFailure {
  type: typeof ACTION_TYPES.LABTEST_CUSTOMIZATION_FAILURE;
  error: any;
}

export interface IFetchLabTestCustomizationRequest {
  type: typeof ACTION_TYPES.FETCH_LABTEST_CUSTOMIZATION_REQUEST;
  name: string;
  countryId?: number;
  successCb?: (payload: any) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchLabTestCustomizationSuccess {
  type: typeof ACTION_TYPES.FETCH_LABTEST_CUSTOMIZATION_SUCCESS;
  payload: ILabTest;
}

export interface IFetchLabTestCustomizationFailure {
  type: typeof ACTION_TYPES.FETCH_LABTEST_CUSTOMIZATION_FAILURE;
  error: any;
}

export interface IUnit {
  id: string;
  unit: string;
}
export interface ILabtestState {
  labTests: ILabTest[];
  loading: boolean;
  total: number;
  error: string | null | Error;
  units: IUnit[];
  unitsLoading: boolean;
  labTestCustomizationData: ILabTest;
  customizationLoading: boolean;
  labtestJson: null | any;
}

export interface IFetchLabtest {
  skip: number;
  limit: number | null;
  searchTerm?: string;
  countryId?: string;
}

export interface IFetchLabtestsSuccessPayload {
  labtests: ILabTest[];
  total: number;
}

export interface IFetchLabtestsRequest {
  type: typeof ACTION_TYPES.FETCH_LABTEST_REQUEST;
  data: IFetchLabtest;
  successCb?: (payload: IFetchLabtestsSuccessPayload) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchLabtestsSuccess {
  type: typeof ACTION_TYPES.FETCH_LABTEST_SUCCESS;
  payload: IFetchLabtestsSuccessPayload;
}

export interface IFetchLabtestsFailure {
  type: typeof ACTION_TYPES.FETCH_LABTEST_FAILURE;
  error: Error;
}

export interface IDeleteLabtestRequestPayload {
  id: number;
  tenantId: number;
}

export interface IDeleteLabtestRequest {
  type: typeof ACTION_TYPES.DELETE_LABTEST_REQUEST;
  id: number;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IDeleteLabtestSuccess {
  type: typeof ACTION_TYPES.DELETE_LABTEST_SUCCESS;
}

export interface IDeleteLabtestFailure {
  type: typeof ACTION_TYPES.DELETE_LABTEST_FAILURE;
  error: Error;
}
export interface IFetchUnitListRequest {
  type: typeof ACTION_TYPES.FETCH_UNIT_LIST_REQUEST;
}

export interface IFetchUnitListSuccess {
  type: typeof ACTION_TYPES.FETCH_UNIT_LIST_SUCCESS;
  payload: any;
}

export interface IFetchUnitListFailure {
  type: typeof ACTION_TYPES.FETCH_UNIT_LIST_FAILURE;
  error: Error;
}

export interface IValidateLabtestRequest {
  type: typeof ACTION_TYPES.VALIDATE_LABTEST_REQUEST;
  name: string;
  countryId: number;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IValidateLabtestSuccess {
  type: typeof ACTION_TYPES.VALIDATE_LABTEST_SUCCESS;
}

export interface IValidateLabtestFailure {
  type: typeof ACTION_TYPES.VALIDATE_LABTEST_FAILURE;
  error: Error;
}

export type LabtestActions =
  | IFetchLabtestsRequest
  | IFetchLabtestsSuccess
  | IFetchLabtestsFailure
  | IFetchLabTestCustomizationRequest
  | IFetchLabTestCustomizationSuccess
  | IFetchLabTestCustomizationFailure
  | ILabTestCustomizationRequest
  | ILabTestCustomizationSuccess
  | ILabTestCustomizationFailure
  | IDeleteLabtestRequest
  | IDeleteLabtestSuccess
  | IDeleteLabtestFailure
  | IFetchUnitListRequest
  | IFetchUnitListSuccess
  | IFetchUnitListFailure
  | IValidateLabtestRequest
  | IValidateLabtestSuccess
  | IValidateLabtestFailure;
