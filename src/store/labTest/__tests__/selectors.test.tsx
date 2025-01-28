import { initialState as mainInitialState } from '../reducer';
import {
  labtestLoadingSelector,
  labtestsSelector,
  labtestCountSelector,
  unitsSelector,
  unitsLoadingSelector,
  labTestJSONLoadingSelector,
  labTestCustomDataSelector,
  labTestJSONSelector
} from '../selectors';

const initialState: any = {
  labtest: mainInitialState
};

// Test labtestLoadingSelector
test('labtestLoadingSelector should return loading from state', () => {
  expect(labtestLoadingSelector(initialState)).toEqual(initialState.labtest.loading);
});

// Test labtestsSelector
test('labtestsSelector should return labtests from state', () => {
  expect(labtestsSelector(initialState)).toEqual(initialState.labtest.labTests);
});

// Test labtestCountSelector
test('labtestCountSelector should return total labtest count from state', () => {
  expect(labtestCountSelector(initialState)).toEqual(initialState.labtest.total);
});

// Test unitsSelector
test('unitsSelector should return units from state', () => {
  expect(unitsSelector(initialState)).toEqual(initialState.labtest.units);
});

// Test unitsLoadingSelector
test('unitsLoadingSelector should return units loading from state', () => {
  expect(unitsLoadingSelector(initialState)).toEqual(initialState.labtest.unitsLoading);
});

// Test labTestJSONLoadingSelector
test('labTestJSONLoadingSelector should return labtest JSON loading from state', () => {
  expect(labTestJSONLoadingSelector(initialState)).toEqual(initialState.labtest.customizationLoading);
});

// Test labTestCustomDataSelector
test('labTestCustomDataSelector should return labtest customization data from state', () => {
  expect(labTestCustomDataSelector(initialState)).toEqual(initialState.labtest.labTestCustomizationData);
});

// Test labTestJSONSelector
test('labTestJSONSelector should return labtest JSON data from state', () => {
  expect(labTestJSONSelector(initialState)).toEqual(initialState.labtest.labtestJson);
});
