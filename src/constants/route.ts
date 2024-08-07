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
  CountyDashboard: '/county',
  SubCountyDashboard: '/sub-county',
  siteDashboard: '/site',
  createCountyByRegion: '/region/:regionId/:tenantId/county/create',
  createSubCountyByRegion: '/region/:regionId/:tenantId/sub-county/create',
  createSubCountyByCounty: '/county/:countyId/:tenantId/sub-county/create',
  customizationByRegion: '/region/:regionId/:tenantId/customize',
  countyWorkflowCustomization: '/region/:regionId/:tenantId/customize/countyWorkflow',

  countyByRegion: '/region/:regionId/:tenantId/county',

  countyAdminByRegion: '/region/:regionId/:tenantId/county-admin',

  subCountyByRegion: '/region/:regionId/:tenantId/sub-county',
  subCountyByCounty: '/county/:countyId/:tenantId/sub-county',

  subCountyAdminByRegion: '/region/:regionId/:tenantId/sub-county-admin',
  subCountyAdminByCounty: '/county/:countyId/:tenantId/sub-county-admin',

  siteAdminByRegion: '/region/:regionId/:tenantId/siteAdmin',
  siteAdminByCounty: '/county/:countyId/:tenantId/siteAdmin',
  siteAdminBySubCounty: '/sub-county/:subCountyId/:tenantId/siteAdmin',

  hfByRegion: '/region/:regionId/:tenantId/health-facility',
  hfByCounty: '/county/:countyId/:tenantId/health-facility',
  hfBySubCounty: '/sub-county/:subCountyId/:tenantId/health-facility',
  createHFByRegion: '/region/:regionId/:tenantId/health-facility/create',
  createHFBySubCounty: '/sub-county/:subCountyId/:tenantId/health-facility/create',
  createHFByCounty: '/county/:countyId/:tenantId/health-facility/create',

  groupByRegion: '/region/:regionId/:tenantId/group',
  groupByCounty: '/county/:countyId/:tenantId/group',
  groupBySubCounty: '/sub-county/:subCountyId/:tenantId/group',
  groupBySite: '/site/:siteId/:tenantId/group',
  createGroupByRegion: '/region/:regionId/:tenantId/group/create',
  createGroupBySubCounty: '/sub-county/:subCountyId/:tenantId/group/create',
  createGroupByCounty: '/county/:countyId/:tenantId/group/create',
  createGroupBySite: '/site/:siteId/:tenantId/group/create',

  programByRegion: '/region/:regionId/:tenantId/program',
  createProgramByRegion: '/region/:regionId/:tenantId/program/create',

  userByRegion: '/region/:regionId/:tenantId/user',
  userByCounty: '/county/:countyId/:tenantId/user',
  userBySubCounty: '/sub-county/:subCountyId/:tenantId/user',

  regionSummary: '/region/:regionId/:tenantId',
  countySummary: '/county/:countyId/:tenantId',
  subCountySummary: '/sub-county/:subCountyId/:tenantId',
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
  [APPCONSTANTS.ROLES.REGION_ADMIN]: PROTECTED_ROUTES.CountyDashboard,
  [APPCONSTANTS.ROLES.ACCOUNT_ADMIN]: PROTECTED_ROUTES.SubCountyDashboard,
  [APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN]: PROTECTED_ROUTES.healthFacilityByAdmin
};
