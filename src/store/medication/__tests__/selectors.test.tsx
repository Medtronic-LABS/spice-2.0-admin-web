import {
  getMedicationLoadingSelector,
  getMedicationListSelector,
  getMedicationListCountSelector,
  getMedicationClassificationsSelector,
  getMedicationBrandsSelector,
  getMedicationDosageFormsSelector,
  getClassificationsLoadingSelector,
  getBrandsLoadingSelector,
  getDosageFormsLoadingSelector
} from '../selectors';
import { initialState as medicationInitialState } from '../reducer';

// Mock initial state based on your reducer structure
const initialState: any = {
  medication: medicationInitialState
};

// Test getMedicationLoadingSelector
test('getMedicationLoadingSelector should return loading from state', () => {
  expect(getMedicationLoadingSelector(initialState)).toEqual(initialState.medication.loading);
});

// Test getMedicationListSelector
test('getMedicationListSelector should return medication list from state', () => {
  expect(getMedicationListSelector(initialState)).toEqual(initialState.medication.list);
});

// Test getMedicationListCountSelector
test('getMedicationListCountSelector should return medication list count from state', () => {
  expect(getMedicationListCountSelector(initialState)).toEqual(initialState.medication.total);
});

// Test getMedicationClassificationsSelector
test('getMedicationClassificationsSelector should return classifications from state', () => {
  expect(getMedicationClassificationsSelector(initialState)).toEqual(initialState.medication.classifications);
});

// Test getMedicationBrandsSelector
test('getMedicationBrandsSelector should return brands from state', () => {
  expect(getMedicationBrandsSelector(initialState)).toEqual(initialState.medication.brands);
});

// Test getMedicationDosageFormsSelector
test('getMedicationDosageFormsSelector should return dosage forms from state', () => {
  expect(getMedicationDosageFormsSelector(initialState)).toEqual(initialState.medication.dosageForms);
});

// Test getClassificationsLoadingSelector
test('getClassificationsLoadingSelector should return classifications loading from state', () => {
  expect(getClassificationsLoadingSelector(initialState)).toEqual(initialState.medication.classificationsLoading);
});

// Test getBrandsLoadingSelector
test('getBrandsLoadingSelector should return brands loading from state', () => {
  expect(getBrandsLoadingSelector(initialState)).toEqual(initialState.medication.brandsLoading);
});

// Test getDosageFormsLoadingSelector
test('getDosageFormsLoadingSelector should return dosage forms loading from state', () => {
  expect(getDosageFormsLoadingSelector(initialState)).toEqual(initialState.medication.dosageFormsLoading);
});
