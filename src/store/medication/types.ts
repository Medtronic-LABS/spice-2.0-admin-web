import * as ACTION_TYPES from './actionTypes';

export interface IList {
  id: string;
  name: string;
}

interface ICountry {
  id: number;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  tenantId: number;
  name: string;
  phoneNumberCode: string;
  unitMeasurement: string | null;
  regionCode: string;
  appTypes: string[];
  active: boolean;
  deleted: boolean;
}
export interface IClassification extends IList {
  brands: IList[];
  country: ICountry;
}

export interface IMedicationList {
  id: string;
  name: string;
  countryId: string;
  brandId: string;
  brandName: string;
  classificationId: string;
  classificationName: string;
  dosageFormId: string;
  dosageFormName: string;
  category: {
    id: string;
    name: string;
  };
}

export interface IMedicationState {
  loading: boolean;
  classificationsLoading: boolean;
  brandsLoading: boolean;
  dosageFormsLoading: boolean;
  categoryLoading: boolean;
  total: number;
  list: IMedicationList[];
  classifications: IClassification[];
  brands: IList[];
  dosageForms: IList[];
  categoryList: IList[];
  error: string | null | Error;
}

export interface IFetchMedicationListFailurePayload {
  error: string;
}

export interface IFetchMedicationListSuccessPayload {
  list: IMedicationList[];
  total: number;
}

export interface IFetchMedicationListReq {
  type: typeof ACTION_TYPES.FETCH_MEDICATIONS_LIST_REQUEST;
  skip: number;
  limit: number | null;
  search?: string;
  countryId: number;
  failureCb?: (error: Error) => void;
}

export interface IFetchMedicationListSuccess {
  type: typeof ACTION_TYPES.FETCH_MEDICATIONS_LIST_SUCCESS;
  payload: IFetchMedicationListSuccessPayload;
}
export interface IFetchMedicationListFailure {
  type: typeof ACTION_TYPES.FETCH_MEDICATIONS_LIST_FAILURE;
  error: Error;
}

export interface IFetchClassificationSuccessPayload {
  classifications: IClassification[];
}
export interface IFetchBrandsSuccessPayload {
  brands: IList[];
}
export interface IFetchClassificationsReq {
  type: typeof ACTION_TYPES.FETCH_MEDICATION_CLASSIFICATIONS_REQUEST;
  countryId: number;
}

export interface IFetchClassificationSuccess {
  type: typeof ACTION_TYPES.FETCH_MEDICATION_CLASSIFICATIONS_SUCCESS;
  payload: IFetchClassificationSuccessPayload;
}

export interface IFetchClassificationFailure {
  type: typeof ACTION_TYPES.FETCH_MEDICATION_CLASSIFICATIONS_FAILURE;
}

export interface IFetchBrandReq {
  type: typeof ACTION_TYPES.FETCH_MEDICATION_BRANDS;
  countryId: string;
  classificationId: string;
  successCb?: (brands: IList[]) => void;
}

export interface IFetchBrandSuccess {
  type: typeof ACTION_TYPES.FETCH_MEDICATION_BRANDS_SUCCESS;
  payload: IFetchBrandsSuccessPayload;
}

export interface IFetchBrandFailure {
  type: typeof ACTION_TYPES.FETCH_MEDICATION_BRANDS_FAILURE;
}

export interface IRemoveBrands {
  type: typeof ACTION_TYPES.REMOVE_MEDICATION_BRANDS;
}

export interface IFetchDosageFormSuccessPayload {
  dosageForms: IList[];
}

export interface IFetchCategorySuccessPayload {
  categoryList: IList[];
}

export interface IFetchDosageFormReq {
  type: typeof ACTION_TYPES.FETCH_MEDICATION_DOSAGE_FORM;
  failureCb?: (error: Error) => void;
}

export interface IFetchCategoryFormReq {
  type: typeof ACTION_TYPES.FETCH_CATEGORY_FORM;
  failureCb?: (error: Error) => void;
}

export interface IFetchDosageFormSuccess {
  type: typeof ACTION_TYPES.FETCH_MEDICATION_DOSAGE_FORM_SUCCESS;
  payload: IFetchDosageFormSuccessPayload;
}

export interface IFetchDosageFormFailure {
  type: typeof ACTION_TYPES.FETCH_MEDICATION_DOSAGE_FORM_FAILURE;
}

export interface IFetchCategoryFormSuccess {
  type: typeof ACTION_TYPES.FETCH_CATEGORY_FORM_SUCCESS;
  payload: IFetchCategorySuccessPayload;
}

export interface IFetchCategoryFormFailure {
  type: typeof ACTION_TYPES.FETCH_CATEGORY_FORM_FAILURE;
}

export interface IMedicationPayload {
  name: string;
  countryId: number;
  classificationId: string;
  classificationName: string;
  brandId: string;
  code?: ICodeDetailsPayload;
  brandName: string;
  dosageFormId: string;
  dosageFormName: string;
  category?: IList;
  id?: string;
}

export interface ICodeDetailsPayload {
  code: string;
  url: string;
}

export interface ICreateMedicationRequestPayload {
  data: IMedicationPayload[];
  successCb: () => void;
  failureCb: (error: Error) => void;
}

export interface ICreateMedicationRequest {
  type: typeof ACTION_TYPES.CREATE_MEDICATION_REQUEST;
  data: any;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface ICreateMedicationSuccess {
  type: typeof ACTION_TYPES.CREATE_MEDICATION_SUCCESS;
}

export interface ICreateMedicationFailure {
  type: typeof ACTION_TYPES.CREATE_MEDICATION_FAILURE;
  error: Error;
}

export interface IUpdateMedicationReq {
  type: typeof ACTION_TYPES.UPDATE_MEDICATION_REQUEST;
  data: IMedicationPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IUpdateMedicationSuccess {
  type: typeof ACTION_TYPES.UPDATE_MEDICATION_SUCCESS;
}

export interface IUpdateMedicationFailure {
  type: typeof ACTION_TYPES.UPDATE_MEDICATION_FAILURE;
  error: Error;
}

export interface IDeleteMedicationRequestPayload {
  id: string;
  tenantId: string;
}

export interface IDeleteMedicationRequest {
  type: typeof ACTION_TYPES.DELETE_MEDICATION_REQUEST;
  data: IDeleteMedicationRequestPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IDeleteMedicationSuccess {
  type: typeof ACTION_TYPES.DELETE_MEDICATION_SUCCESS;
}

export interface IDeleteMedicationFailure {
  type: typeof ACTION_TYPES.DELETE_MEDICATION_FAILURE;
  error: Error;
}

export interface IValidateMedication {
  type: typeof ACTION_TYPES.VALIDATE_MEDICATION;
  data: IMedicationPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export type MedicationActions =
  | IFetchMedicationListReq
  | IFetchMedicationListSuccess
  | IFetchMedicationListFailure
  | IFetchClassificationsReq
  | IFetchClassificationSuccess
  | IFetchClassificationFailure
  | IFetchBrandReq
  | IFetchBrandSuccess
  | IFetchBrandFailure
  | IRemoveBrands
  | IFetchDosageFormReq
  | IFetchCategoryFormReq
  | IFetchDosageFormSuccess
  | IFetchDosageFormFailure
  | IFetchCategoryFormFailure
  | IFetchCategoryFormFailure
  | IFetchCategoryFormSuccess
  | ICreateMedicationRequest
  | ICreateMedicationSuccess
  | ICreateMedicationFailure
  | IUpdateMedicationReq
  | IUpdateMedicationSuccess
  | IUpdateMedicationFailure
  | IDeleteMedicationRequest
  | IDeleteMedicationSuccess
  | IDeleteMedicationFailure
  | IValidateMedication;
