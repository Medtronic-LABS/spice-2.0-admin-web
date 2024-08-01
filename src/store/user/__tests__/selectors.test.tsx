import USER_MOCK_DATA from '../../../tests/mockData/userDataConstants';
import {
  authTokenSelector,
  emailSelector,
  firstNameSelector,
  formDataIdSelector,
  getIsLoggedInSelector,
  getIsLoggingInSelector,
  getIsLoggingOutSelector,
  initializingSelector,
  isUserRolesLoading,
  lastNameSelector,
  loadingSelector,
  roleSelector,
  showLoaderSelector,
  tenantIdSelector,
  userDataSelector,
  userRolesSelector
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
// test('timezoneListSelector should return timezoneList from state', () => {
//   expect(timezoneListSelector(initialState)).toEqual(initialState.user.timezoneList);
// });

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
  expect(userRolesSelector(initialState)).toEqual(initialState.user?.userRoles);
});

// Test showLoaderSelector
test('showLoaderSelector should return showLoader from state', () => {
  expect(showLoaderSelector(initialState)).toEqual(initialState.user.showLoader);
});
// Test authTokenSelector
test('authTokenSelector should return token from state', () => {
  expect(authTokenSelector(initialState)).toEqual(initialState.user.token);
});
// Test userDataSelector
test('userDataSelector should return userData from state', () => {
  expect(userDataSelector(initialState)).toEqual(initialState.user.user);
});

// Test isUserRolesLoading
test('isUserRolesLoading should return isRolesLoading from state', () => {
  expect(isUserRolesLoading(initialState)).toEqual(initialState.user.isRolesLoading);
});
