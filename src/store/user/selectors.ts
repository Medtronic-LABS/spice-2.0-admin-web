import { createSelector } from 'reselect';

import { AppState } from '../rootReducer';

const getIsLoggedIn = (state: AppState) => state.user.isLoggedIn;
const getIsLoggingIn = (state: AppState) => state.user.loggingIn;
const getIsLoggingOut = (state: AppState) => state.user.loggingOut;
const getUserData = (state: AppState) => state.user.user;
const getFirstName = (state: AppState) => state.user.user?.firstName;
const getLastName = (state: AppState) => state.user.user?.lastName;
const getEmail = (state: AppState) => state.user.user?.email;
const getFormDataId = (state: AppState) => state.user.user?.formDataId;
const getTenantId = (state: AppState) => state.user.user?.tenantId;
const getRole = (state: AppState) => state.user.user?.role;
const getUserId = (state: AppState) => state.user.user?.userId;
const getLoading = (state: AppState) => state.user.loading;
const getInitializing = (state: AppState) => state.user.initializing;
const getShowLoader = (state: AppState) => state.user.showLoader;
const getAuthToken = (state: AppState) => state.user.token;
const getUserRoles = (state: AppState) => state.user.userRoles;
const getIsUserRolesLoading = (state: AppState) => state.user.isRolesLoading;

export const getIsLoggedInSelector = createSelector(getIsLoggedIn, (isLoggedIn) => isLoggedIn);
export const getIsLoggingInSelector = createSelector(getIsLoggingIn, (loggingIn) => loggingIn);
export const getIsLoggingOutSelector = createSelector(getIsLoggingOut, (loggingOut) => loggingOut);
export const firstNameSelector = createSelector(getFirstName, (firstName) => firstName);
export const lastNameSelector = createSelector(getLastName, (lastName) => lastName);
export const emailSelector = createSelector(getEmail, (email) => email);
export const formDataIdSelector = createSelector(getFormDataId, (formDataId) => formDataId);
export const tenantIdSelector = createSelector(getTenantId, (tenantId) => tenantId);
export const userIdSelector = createSelector(getUserId, (userId) => userId);
export const loadingSelector = createSelector(getLoading, (loading) => loading);
export const initializingSelector = createSelector(getInitializing, (initializing) => initializing);
export const roleSelector = createSelector(getRole, (role) => role);
export const showLoaderSelector = createSelector(getShowLoader, (loading) => loading);
export const authTokenSelector = createSelector(getAuthToken, (token) => token);
export const userDataSelector = createSelector(getUserData, (user) => user);
export const userRolesSelector = createSelector(getUserRoles, (roles) => roles);
export const isUserRolesLoading = createSelector(getIsUserRolesLoading, (loading) => loading);
