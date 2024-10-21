import { createSelector } from 'reselect';
import { AppState } from '../rootReducer';

const getLoading = (state: AppState) => state.medication.loading;
const getMedicationList = (state: AppState) => state.medication.list;
const getMedicationListCount = (state: AppState) => state.medication.total;
const getMedicationClassifications = (state: AppState) => state.medication.classifications;
const getMedicationBrands = (state: AppState) => state.medication.brands;
const getMedicationDosageForm = (state: AppState) => state.medication.dosageForms;
const getMedicationCategoryForm = (state: AppState) => state.medication.categoryList;
const getClassificationsLoading = (state: AppState) => state.medication.classificationsLoading;
const getBrandsLoading = (state: AppState) => state.medication.brandsLoading;
const getDosageFormsLoading = (state: AppState) => state.medication.dosageFormsLoading;
const getCategoryFormsLoading = (state: AppState) => state.medication.categoryLoading;

export const getMedicationLoadingSelector = createSelector(getLoading, (loading) => loading);
export const getMedicationListSelector = createSelector(getMedicationList, (list) => list);
export const getMedicationListCountSelector = createSelector(getMedicationListCount, (total) => total);
export const getMedicationClassificationsSelector = createSelector(
  getMedicationClassifications,
  (classifications) => classifications
);
export const getMedicationBrandsSelector = createSelector(getMedicationBrands, (brands) => brands);
export const getMedicationDosageFormsSelector = createSelector(getMedicationDosageForm, (dosageForms) => dosageForms);
export const getMedicationCategorySelector = createSelector(
  getMedicationCategoryForm,
  (categoryForms) => categoryForms
);
export const getClassificationsLoadingSelector = createSelector(
  getClassificationsLoading,
  (classificationsLoading) => classificationsLoading
);
export const getBrandsLoadingSelector = createSelector(getBrandsLoading, (brandsLoading) => brandsLoading);
export const getDosageFormsLoadingSelector = createSelector(
  getDosageFormsLoading,
  (dosageFormsLoading) => dosageFormsLoading
);

export const getCategoryLoadingSelector = createSelector(
  getCategoryFormsLoading,
  (categoryFormsLoading) => categoryFormsLoading
);
