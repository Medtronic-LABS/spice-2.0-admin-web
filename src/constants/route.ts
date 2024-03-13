import APPCONSTANTS from './appConstants';

export const PUBLIC_ROUTES = {
  login: '/',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password/:token',
  privacyPolicy: '/privacy-policy'
};

export const PROTECTED_ROUTES = {
  region: '/region/:regionId/:tenantId',
  healthFacilityBySuperAdmin: '/region/:regionId/healthFacility/list',
  healthFacilityByAdmin: '/healthFacility/list',
  healthFacilitySummary: '/healthFacility/:healthFacilityId/:tenantId',
  createHealthFacility: '/region/:regionId/healthFacility/create'
};

export const HOME_PAGE_BY_ROLE = {
  [APPCONSTANTS.ROLES.SUPER_USER]: PROTECTED_ROUTES.region,
  [APPCONSTANTS.ROLES.SUPER_ADMIN]: PROTECTED_ROUTES.region,
  [APPCONSTANTS.ROLES.SITE_ADMIN]: PROTECTED_ROUTES.healthFacilityByAdmin,
  [APPCONSTANTS.ROLES.PEER_SUPERVISOR]: PROTECTED_ROUTES.region
};
