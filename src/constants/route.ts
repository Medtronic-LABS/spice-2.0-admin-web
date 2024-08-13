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
  region: '/region/:regionId/:tenantId',
  healthFacilityBySuperAdmin: '/region/:regionId/health-facility/list',
  healthFacilityByAdmin: '/health-facility/list',
  healthFacilitySummary: '/health-facility/:healthFacilityId/:hfTenantId',
  createHealthFacility: '/region/:regionId/health-facility/create',
  usersBySuperAdmin: '/region/:regionId/users/list',
  usersByAdmin: '/users/list',
  adminBySuperAdmin: '/region/:regionId/admin/list',
  medicationByRegion: '/region/:regionId/medication/list',
  createMedication: '/region/:regionId/medication/create',
  labtestList: '/region/:regionId/:tenantId/lab-test',
  customizeLabTest: '/region/:regionId/:tenantId/:labTestName/lab-test/:identifier/:testId',
  createRegion: '/region/create',
  createSuperAdmin: '/super-admin/create',
  screen: '/screening-form',
  accordianViewRegionCustomizationForm: '/region/:regionId/:tenantId/:form/regionCustomize',
  accordianViewAccountWorlflowCustomizationForm:
    '/region/:regionId/:tenantId/:form/accountCustomize/:clinicalWorkflowId/:workflowId',
  regionDashboard: '/region',
  DistrictDashboard: '/district',
  ChiefdomDashboard: '/chiefdom',
  siteDashboard: '/site',
  createDistrictByRegion: '/region/:regionId/:tenantId/district/create',
  createChiefdomByRegion: '/region/:regionId/:tenantId/chiefdom/create',
  createChiefdomByDistrict: '/district/:districtId/:tenantId/chiefdom/create',
  customizationByRegion: '/region/:regionId/:tenantId/customize',
  countyWorkflowCustomization: '/region/:regionId/:tenantId/customize/countyWorkflow',

  districtByRegion: '/region/:regionId/:tenantId/district',

  districtAdminByRegion: '/region/:regionId/:tenantId/district-admin',

  chiefdomByRegion: '/region/:regionId/:tenantId/chiefdom',
  chiefdomByDistrict: '/district/:districtId/:tenantId/chiefdom',

  chiefdomAdminByRegion: '/region/:regionId/:tenantId/chiefdom-admin',
  chiefdomAdminByDistrict: '/district/:districtId/:tenantId/chiefdom-admin',

  siteAdminByRegion: '/region/:regionId/:tenantId/siteAdmin',
  siteAdminByDistrict: '/district/:districtId/:tenantId/siteAdmin',
  siteAdminByChiefdom: '/chiefdom/:chiefdomId/:tenantId/siteAdmin',

  hfByRegion: '/region/:regionId/:tenantId/health-facility',
  hfByDistrict: '/district/:districtId/:tenantId/health-facility',
  hfByChiefdom: '/chiefdom/:chiefdomId/:tenantId/health-facility',
  createHFByRegion: '/region/:regionId/:tenantId/health-facility/create',
  createHFByChiefdom: '/chiefdom/:chiefdomId/:tenantId/health-facility/create',
  createHFByDistrict: '/district/:districtId/:tenantId/health-facility/create',

  groupByRegion: '/region/:regionId/:tenantId/group',
  groupByDistrict: '/district/:districtId/:tenantId/group',
  groupByChiefdom: '/chiefdom/:chiefdomId/:tenantId/group',
  groupBySite: '/site/:siteId/:tenantId/group',
  createGroupByRegion: '/region/:regionId/:tenantId/group/create',
  createGroupByChiefdom: '/chiefdom/:chiefdomId/:tenantId/group/create',
  createGroupByDistrict: '/district/:districtId/:tenantId/group/create',
  createGroupBySite: '/site/:siteId/:tenantId/group/create',

  programByRegion: '/region/:regionId/:tenantId/program',
  createProgramByRegion: '/region/:regionId/:tenantId/program/create',

  userByRegion: '/region/:regionId/:tenantId/user',
  userByDistrict: '/district/:districtId/:tenantId/user',
  userByChiefdom: '/chiefdom/:chiefdomId/:tenantId/user',

  regionSummary: '/region/:regionId/:tenantId',
  districtSummary: '/district/:districtId/:tenantId',
  chiefdomSummary: '/chiefdom/:chiefdomId/:tenantId',
  siteSummary: '/site/:siteId/:tenantId',

  workflowByRegion: '/region/:regionId/:tenantId/workflow',
  workflowByCounty: '/county/:accountId/:tenantId/workflow',

  labTestByRegion: '/region/:regionId/:tenantId/lab-test',
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
  [APPCONSTANTS.ROLES.REGION_ADMIN]: PROTECTED_ROUTES.DistrictDashboard,
  [APPCONSTANTS.ROLES.DISTRICT_ADMIN]: PROTECTED_ROUTES.ChiefdomDashboard,
  [APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN]: PROTECTED_ROUTES.healthFacilityByAdmin
};
