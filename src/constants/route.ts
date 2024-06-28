import APPCONSTANTS from './appConstants';

export const PUBLIC_ROUTES = {
  login: '/',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password/:token',
  privacyPolicy: '/privacy-policy'
};

export const PROTECTED_ROUTES = {
  profile: '/profile',
  region: '/region/:regionId/:tenantId',
  healthFacilityBySuperAdmin: '/region/:regionId/healthFacility/list',
  healthFacilityByAdmin: '/healthFacility/list',
  healthFacilitySummary: '/healthFacility/:healthFacilityId/:hfTenantId',
  createHealthFacility: '/region/:regionId/healthFacility/create',
  usersBySuperAdmin: '/region/:regionId/users/list',
  usersByAdmin: '/users/list',
  medicationByRegion: '/region/:regionId/medication/list',
  createMedication: '/region/:regionId/medication/create',
  labtestList: '/region/:regionId/:tenantId/lab-test',
  customizeLabTest: '/region/:regionId/:tenantId/:labTestName/lab-test/:identifier'
};

export const HOME_PAGE_BY_ROLE = {
  [APPCONSTANTS.ROLES.SUPER_USER]: PROTECTED_ROUTES.region,
  [APPCONSTANTS.ROLES.SUPER_ADMIN]: PROTECTED_ROUTES.region,
  [APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN]: PROTECTED_ROUTES.healthFacilityByAdmin
};
