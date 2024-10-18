import {
  siteListDropdownSelector,
  programLoadingSelector,
  programListTotalSelector,
  programListSelector
} from '../selectors';
import { initialState as mainInitialState } from '../reducer';

const initialState: any = {
  program: mainInitialState
};

// Test siteListDropdownSelector
test('siteListDropdownSelector should return hfDropdownOptions from state', () => {
  expect(siteListDropdownSelector(initialState)).toEqual(initialState.program.hfDropdownOptions);
});

// Test programLoadingSelector
test('programLoadingSelector should return loading from state', () => {
  expect(programLoadingSelector(initialState)).toEqual(initialState.program.loading);
});

// Test programListTotalSelector
test('programListTotalSelector should return total from state', () => {
  expect(programListTotalSelector(initialState)).toEqual(initialState.program.total);
});

// Test programListSelector
test('programListSelector should return programList from state', () => {
  expect(programListSelector(initialState)).toEqual(initialState.program.programList);
});
