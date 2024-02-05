import APPCONSTANTS from './appConstants';

export const PUBLIC_ROUTES = {
  login: '/',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password/:token',
  privacyPolicy: '/privacy-policy'
};

export const PROTECTED_ROUTES = {
  home: '/region/:regionId/:tenantId'
};

export const HOME_PAGE_BY_ROLE = {
  [APPCONSTANTS.ROLES.SUPER_USER]: PROTECTED_ROUTES.home,
  [APPCONSTANTS.ROLES.SUPER_ADMIN]: PROTECTED_ROUTES.home,
  [APPCONSTANTS.ROLES.ADMIN]: PROTECTED_ROUTES.home
};
