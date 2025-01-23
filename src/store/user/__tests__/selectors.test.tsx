import USER_MOCK_DATA from '../../../tests/mockData/userDataConstants';
import {
  emailSelector,
  firstNameSelector,
  formDataIdSelector,
  getIsLoggedInSelector,
  getIsLoggingInSelector,
  getIsLoggingOutSelector,
  getUserSuiteAccessSelector,
  initializingSelector,
  isPasswordSetSelector,
  isUserRolesLoading,
  lastNameSelector,
  loadingSelector,
  roleDetailSelector,
  roleSelector,
  showLoaderSelector,
  tenantIdSelector,
  userDataSelector,
  userRolesSelector,
  communityListSelector,
  timezoneListSelector,
  designationListSelector,
  countryIdSelector,
  countryListSelector,
  isTACLoadingSelector,
  termsAndConditionsSelector
} from '../selectors';

const initialState: any = {
  user: USER_MOCK_DATA.INITIAL_STATE
};

// Test getIsLoggedInSelector
test('getIsLoggedInSelector should return isLoggedIn from state', () => {
  return expect(getIsLoggedInSelector(initialState)).toEqual(initialState.user.isLoggedIn);
});

// Test getIsLoggingInSelector
test('getIsLoggingInSelector should return loggingIn from state', () => {
  expect(getIsLoggingInSelector(initialState)).toEqual(initialState.user.loggingIn);
});
// Test getIsLoggingOutSelector
test('getIsLoggingOutSelector should return loggingOut from state', () => {
  expect(getIsLoggingOutSelector(initialState)).toEqual(initialState.user.loggingOut);
});

// Test firstNameSelector
test('firstNameSelector should return firstName from state', () => {
  expect(firstNameSelector(initialState)).toEqual(initialState.user.user.firstName);
});

// Test lastNameSelector
test('lastNameSelector should return lastName from state', () => {
  expect(lastNameSelector(initialState)).toEqual(initialState.user.user.lastName);
});
// Test emailSelector
test('emailSelector should return email from state', () => {
  expect(emailSelector(initialState)).toEqual(initialState.user.user.email);
});
// Test formDataIdSelector
test('formDataIdSelector should return formDataId from state', () => {
  expect(formDataIdSelector(initialState)).toEqual(initialState.user.user.formDataId);
});
// Test tenantIdSelector
test('tenantIdSelector should return tenantId from state', () => {
  expect(tenantIdSelector(initialState)).toEqual(initialState.user.user.tenantId);
});

// Test timezoneListSelector
test('timezoneListSelector should return timezoneList from state', () => {
  expect(timezoneListSelector(initialState)).toEqual(initialState.user.timezoneList);
});

// Test loadingSelector
test('loadingSelector should return loading from state', () => {
  expect(loadingSelector(initialState)).toEqual(initialState.user.loading);
});

// Test initializingSelector
test('initializingSelector should return initializing from state', () => {
  expect(initializingSelector(initialState)).toEqual(initialState.user.initializing);
});

// Test roleSelector
test('roleSelector should return role from state', () => {
  expect(roleSelector(initialState)).toEqual(initialState.user.user.role);
});

// Test userRolesSelector
test('userRolesSelector should return userRoles from state', () => {
  expect(userRolesSelector(initialState)).toEqual(initialState.user.userRoles);
});

// Test showLoaderSelector
test('showLoaderSelector should return showLoader from state', () => {
  expect(showLoaderSelector(initialState)).toEqual(initialState.user.showLoader);
});
// Test userDataSelector
test('userDataSelector should return userData from state', () => {
  expect(userDataSelector(initialState)).toEqual(initialState.user.user);
});

// Test isUserRolesLoading
test('isUserRolesLoading should return isRolesLoading from state', () => {
  expect(isUserRolesLoading(initialState)).toEqual(initialState.user.isRolesLoading);
});

test('roleDetailSelector should return  from state', () => {
  expect(roleDetailSelector(initialState)).toEqual(initialState.user.user.roleDetail);
});

test('getUserSuiteAccessSelector should return  from state', () => {
  expect(getUserSuiteAccessSelector(initialState)).toEqual(initialState.user.user.suiteAccess);
});

test('isPasswordSetSelector should return  from state', () => {
  expect(isPasswordSetSelector(initialState)).toEqual(initialState.user.user.isPasswordSet);
});

test('communityListSelector should return  from state', () => {
  expect(communityListSelector(initialState)).toEqual(initialState.user.communityList);
});

test('designationListSelector should return  from state', () => {
  expect(designationListSelector(initialState)).toEqual(initialState.user.designationList);
});

test('countryIdSelector should return  from state', () => {
  expect(countryIdSelector(initialState)).toEqual(initialState.user.country);
});

test('countryListSelector should return  from state', () => {
  expect(countryListSelector(initialState)).toEqual(initialState.user.countryList);
});

test('isTACLoadingSelector should return  from state', () => {
  expect(isTACLoadingSelector(initialState)).toEqual(initialState.user.isTermsConditionsLoading);
});

test('termsAndConditionsSelector should return  from state', () => {
  expect(termsAndConditionsSelector(initialState)).toEqual(initialState.user.termsAndConditions);
});
