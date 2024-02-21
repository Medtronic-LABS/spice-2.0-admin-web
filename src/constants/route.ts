import APPCONSTANTS from './appConstants';

export const PUBLIC_ROUTES = {
  login: '/',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password/:token',
  privacyPolicy: '/privacy-policy'
};

export const PROTECTED_ROUTES = {
  region: '/region/:regionId/:tenantId',
  healthFacility: '/healthFacility/list/:regionId/',
  healthFacilitySummary: '/healthFacility/:healthFacilityId/'
};

export const HOME_PAGE_BY_ROLE = {
  [APPCONSTANTS.ROLES.SUPER_USER]: PROTECTED_ROUTES.region,
  [APPCONSTANTS.ROLES.SUPER_ADMIN]: PROTECTED_ROUTES.region,
  [APPCONSTANTS.ROLES.SITE_ADMIN]: PROTECTED_ROUTES.healthFacility
};
