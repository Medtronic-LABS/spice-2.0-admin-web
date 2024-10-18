import USER_MOCK_DATA from '../../../tests/mockData/userDataConstants';
import {
  communityListSelector,
  countryIdSelector,
  countryListSelector,
  cultureListLoadingSelector,
  cultureListSelector,
  emailSelector,
  firstNameSelector,
  formDataIdSelector,
  getIsLoggedInSelector,
  getIsLoggingInSelector,
  getIsLoggingOutSelector,
  initializingSelector,
  isLockedUserLoading,
  isPasswordSetSelector,
  isUserRolesLoading,
  lastNameSelector,
  loadingSelector,
  lockedUsers,
  lockedUsersCount,
  roleDetailSelector,
  roleSelector,
  showLoaderSelector,
  tenantIdSelector,
  timezoneListSelector,
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
// Test userDataSelector
test('userDataSelector should return userData from state', () => {
  expect(userDataSelector(initialState)).toEqual(initialState.user.user);
});

// Test isUserRolesLoading
test('isUserRolesLoading should return isRolesLoading from state', () => {
  expect(isUserRolesLoading(initialState)).toEqual(initialState.user.isRolesLoading);
});

// Test isPasswordSetSelector
test('isPasswordSetSelector should return isRolesLoading from state', () => {
  expect(isPasswordSetSelector(initialState)).toEqual(initialState.user.isPasswordSet);
});

// Test timezoneListSelector
test('timezoneListSelector should return isRolesLoading from state', () => {
  expect(timezoneListSelector(initialState)).toEqual(initialState.user.timezoneList);
});

// Test countryIdSelector
test('countryIdSelector should return isRolesLoading from state', () => {
  expect(countryIdSelector(initialState)).toEqual(initialState.user.user?.country);
});

// Test cultureListSelector
test('cultureListSelector should return isRolesLoading from state', () => {
  expect(cultureListSelector(initialState)).toEqual(initialState.user.cultureList);
});

// Test communityListSelector
test('communityListSelector should return isRolesLoading from state', () => {
  expect(communityListSelector(initialState)).toEqual(initialState.user.communityList);
});

// Test cultureListLoadingSelector
test('cultureListLoadingSelector should return isRolesLoading from state', () => {
  expect(cultureListLoadingSelector(initialState)).toEqual(initialState.user.cultureListLoading);
});

// Test countryListSelector
test('countryListSelector should return isRolesLoading from state', () => {
  expect(countryListSelector(initialState)).toEqual(initialState.user.countryList);
});

// Test lockedUsers
test('lockedUsers should return isRolesLoading from state', () => {
  expect(lockedUsers(initialState)).toEqual(initialState.user.lockedUsers);
});

// Test lockedUsersCount
test('lockedUsersCount should return isRolesLoading from state', () => {
  expect(lockedUsersCount(initialState)).toEqual(initialState.user.totalLockedUsers);
});

// Test isLockedUserLoading
test('isLockedUserLoading should return isRolesLoading from state', () => {
  expect(isLockedUserLoading(initialState)).toEqual(initialState.user.islockedUsersLoading);
});

// Test roleDetailSelector
test('roleDetailSelector should return isRolesLoading from state', () => {
  expect(roleDetailSelector(initialState)).toEqual(initialState.user.user?.roleDetail);
});
