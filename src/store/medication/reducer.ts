import { IMedicationState, MedicationActions } from './types';
import * as MEDICATION_TYPES from './actionTypes';

export const initialState: IMedicationState = {
  loading: false,
  classificationsLoading: false,
  brandsLoading: false,
  dosageFormsLoading: false,
  error: null,
  total: 0,
  list: [],
  classifications: [],
  brands: [],
  dosageForms: [],
  categoryList: [],
  categoryLoading: false
};

const medicationReducer = (state = initialState, action = {} as MedicationActions): IMedicationState => {
  switch (action.type) {
    case MEDICATION_TYPES.FETCH_MEDICATIONS_LIST_REQUEST:
    case MEDICATION_TYPES.CREATE_MEDICATION_REQUEST:
    case MEDICATION_TYPES.UPDATE_MEDICATION_REQUEST:
    case MEDICATION_TYPES.DELETE_MEDICATION_REQUEST:
      return {
        ...state,
        loading: true
      };
    case MEDICATION_TYPES.FETCH_MEDICATIONS_LIST_SUCCESS:
      return {
        ...state,
        list: action.payload.list,
        total: action.payload.total,
        loading: false
      };
    case MEDICATION_TYPES.FETCH_MEDICATIONS_LIST_FAILURE:
    case MEDICATION_TYPES.CREATE_MEDICATION_FAILURE:
    case MEDICATION_TYPES.UPDATE_MEDICATION_FAILURE:
    case MEDICATION_TYPES.DELETE_MEDICATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case MEDICATION_TYPES.FETCH_MEDICATION_CLASSIFICATIONS_FAILURE:
      return {
        ...state,
        classificationsLoading: false
      };
    case MEDICATION_TYPES.FETCH_MEDICATION_BRANDS_FAILURE:
      return {
        ...state,
        brandsLoading: false
      };
    case MEDICATION_TYPES.FETCH_MEDICATION_DOSAGE_FORM_FAILURE:
      return {
        ...state,
        dosageFormsLoading: false
      };
    case MEDICATION_TYPES.FETCH_CATEGORY_FORM_FAILURE:
      return {
        ...state,
        categoryLoading: false
      };
    case MEDICATION_TYPES.CREATE_MEDICATION_SUCCESS:
    case MEDICATION_TYPES.UPDATE_MEDICATION_SUCCESS:
    case MEDICATION_TYPES.DELETE_MEDICATION_SUCCESS:
    case MEDICATION_TYPES.VALIDATE_MEDICATION:
      return {
        ...state,
        loading: false,
        error: null
      };
    case MEDICATION_TYPES.FETCH_MEDICATION_CLASSIFICATIONS_REQUEST:
      return {
        ...state,
        classificationsLoading: true
      };
    case MEDICATION_TYPES.FETCH_MEDICATION_BRANDS:
      return {
        ...state,
        brands: [],
        brandsLoading: true
      };
    case MEDICATION_TYPES.FETCH_MEDICATION_DOSAGE_FORM:
      return {
        ...state,
        dosageFormsLoading: true
      };
    case MEDICATION_TYPES.FETCH_CATEGORY_FORM:
      return {
        ...state,
        categoryLoading: true
      };
    case MEDICATION_TYPES.FETCH_MEDICATION_CLASSIFICATIONS_SUCCESS:
      return {
        ...state,
        classifications: action.payload.classifications,
        classificationsLoading: false
      };
    case MEDICATION_TYPES.FETCH_MEDICATION_BRANDS_SUCCESS:
      return {
        ...state,
        brands: action.payload.brands,
        brandsLoading: false
      };
    case MEDICATION_TYPES.REMOVE_MEDICATION_BRANDS:
      return {
        ...state,
        brands: []
      };
    case MEDICATION_TYPES.FETCH_MEDICATION_DOSAGE_FORM_SUCCESS:
      return {
        ...state,
        dosageForms: action.payload.dosageForms,
        dosageFormsLoading: false
      };
    case MEDICATION_TYPES.FETCH_CATEGORY_FORM_SUCCESS:
      return {
        ...state,
        categoryList: action.payload.categoryList,
        categoryLoading: false
      };
    default:
      return { ...state };
  }
};

export default medicationReducer;
