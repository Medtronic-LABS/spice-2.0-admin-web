import APPCONSTANTS from './appConstants';

export const PUBLIC_ROUTES = {
  login: '/',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  privacyPolicy: '/privacy-policy'
};

export const PROTECTED_ROUTES = {
  landingPage: '/home',
  profile: '/profile',
  dashboard: '/home',
  createSuperAdmin: '/super-admin/create',
  screen: '/screening-form',
  superAdmin: '/super-admin',
  deactivatedRecords: '/deactivated-records',
  lockedUsers: '/locked-users',
  legalTerms: '#',

  regionDashboard: '/region',
  createRegion: '/region/create',
  region: '/region/:regionId/:tenantId',
  regionSummary: '/region/:regionId/:tenantId',

  customizationByRegion: '/region/:regionId/:tenantId/customize',
  accordianViewRegionCustomizationForm: '/region/:regionId/:tenantId/:form/regionCustomize',

  accountByRegion: '/region/:regionId/:tenantId/county',

  accountAdminByRegion: '/region/:regionId/:tenantId/account-admin',

  OUByRegion: '/region/:regionId/:tenantId/OU',
  OUByAccount: '/account/:accountId/:tenantId/OU',

  chiefdomDashboard: '/chiefdom',
  createChiefdomByRegion: '/region/:regionId/:tenantId/chiefdom/create',
  createChiefdomByDistrict: '/district/:districtId/:tenantId/chiefdom/create',
  chiefdomByRegion: '/region/:regionId/:tenantId/chiefdom',
  chiefdomByDistrict: '/district/:districtId/:tenantId/chiefdom',
  chiefdomSummary: '/chiefdom/:chiefdomId/:tenantId',

  healthFacilityDashboard: '/health-facility',
  healthFacilitySummary: '/health-facility/:healthFacilityId/:tenantId',
  healthFacilityByRegion: '/region/:regionId/:tenantId/health-facility',
  healthFacilityByDistrict: '/district/:districtId/:tenantId/health-facility',
  healthFacilityByChiefdom: '/chiefdom/:chiefdomId/:tenantId/health-facility',

  createHealthFacilityByRegion: '/region/:regionId/:tenantId/health-facility/create',
  createHealthFacilityByDistrict: '/district/:districtId/:tenantId/health-facility/create',
  createHealthFacilityByChiefdom: '/chiefdom/:chiefdomId/:tenantId/health-facility/create',

  userByRegion: '/region/:regionId/:tenantId/user',
  userByDistrict: '/district/:districtId/:tenantId/user',
  userByChiefdom: '/chiefdom/:chiefdomId/:tenantId/user',
  userByHealthFacility: '/health-facility/:healthFacilityId/:tenantId/user',

  adminByRegion: '/region/:regionId/:tenantId/admin',
  adminByDistrict: '/district/:districtId/:tenantId/admin',
  adminByChiefdom: '/chiefdom/:chiefdomId/:tenantId/admin',
  adminByHealthFacility: '/health-facility/:healthFacilityId/:tenantId/admin',

  labTestByRegion: '/region/:regionId/:tenantId/lab-test',
  customizeLabTest: '/region/:regionId/:tenantId/:labTestName/lab-test/:identifier/:testId',
  createLabTest: '/region/:regionId/:tenantId/lab-test/create',
  editLabTest: '/region/:regionId/:tenantId/lab-test/:labTestId/:labTestTenantId',

  superAdmin: '/super-admin',
  deactivatedRecords: '/deactivated-records',
  lockedUsers: '/locked-users',
  legalTerms: '#'
};

export const HOME_PAGE_BY_ROLE = {
  [APPCONSTANTS.ROLES.SUPER_USER]: PROTECTED_ROUTES.dashboard,
  [APPCONSTANTS.ROLES.SUPER_ADMIN]: PROTECTED_ROUTES.dashboard,
  [APPCONSTANTS.ROLES.REGION_ADMIN]: PROTECTED_ROUTES.accountDashboard,
  [APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN]: PROTECTED_ROUTES.healthFacilityByAdmin
};
