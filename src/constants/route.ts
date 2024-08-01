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
  healthFacilityBySuperAdmin: '/region/:regionId/healthFacility/list',
  healthFacilityByAdmin: '/healthFacility/list',
  healthFacilitySummary: '/healthFacility/:healthFacilityId/:hfTenantId',
  createHealthFacility: '/region/:regionId/healthFacility/create',
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
  accountDashboard: '/account',
  OUDashboard: '/OU',
  siteDashboard: '/site',
  createAccountByRegion: '/region/:regionId/:tenantId/account/create',
  createOUByRegion: '/region/:regionId/:tenantId/OU/create',
  createOUByAccount: '/account/:accountId/:tenantId/OU/create',
  customizationByRegion: '/region/:regionId/:tenantId/customize',
  accountWorkflowCustomization: '/region/:regionId/:tenantId/customize/accountWorkflow',

  accountByRegion: '/region/:regionId/:tenantId/county',

  accountAdminByRegion: '/region/:regionId/:tenantId/account-admin',

  OUByRegion: '/region/:regionId/:tenantId/OU',
  OUByAccount: '/account/:accountId/:tenantId/OU',

  OUAdminByRegion: '/region/:regionId/:tenantId/ouAdmin',
  OUAdminByAccount: '/account/:accountId/:tenantId/ou-admin',

  siteAdminByRegion: '/region/:regionId/:tenantId/siteAdmin',
  siteAdminByAccount: '/account/:accountId/:tenantId/siteAdmin',
  siteAdminByOU: '/OU/:OUId/:tenantId/siteAdmin',

  siteByRegion: '/region/:regionId/:tenantId/site',
  siteByAccount: '/account/:accountId/:tenantId/site',
  siteByOU: '/OU/:OUId/:tenantId/site',
  createSiteByRegion: '/region/:regionId/:tenantId/site/create',
  createSiteByOU: '/OU/:OUId/:tenantId/site/create',
  createSiteByAccount: '/account/:accountId/:tenantId/site/create',

  groupByRegion: '/region/:regionId/:tenantId/group',
  groupByAccount: '/account/:accountId/:tenantId/group',
  groupByOU: '/OU/:OUId/:tenantId/group',
  groupBySite: '/site/:siteId/:tenantId/group',
  createGroupByRegion: '/region/:regionId/:tenantId/group/create',
  createGroupByOU: '/OU/:OUId/:tenantId/group/create',
  createGroupByAccount: '/account/:accountId/:tenantId/group/create',
  createGroupBySite: '/site/:siteId/:tenantId/group/create',

  programByRegion: '/region/:regionId/:tenantId/program',
  createProgramByRegion: '/region/:regionId/:tenantId/program/create',

  userByRegion: '/region/:regionId/:tenantId/user',
  userByAccount: '/account/:accountId/:tenantId/user',
  userByOU: '/OU/:OUId/:tenantId/user',

  regionSummary: '/region/:regionId/:tenantId',
  accountSummary: '/account/:accountId/:tenantId',
  OUSummary: '/OU/:OUId/:tenantId',
  siteSummary: '/site/:siteId/:tenantId',

  workflowByRegion: '/region/:regionId/:tenantId/workflow',
  workflowByAccount: '/account/:accountId/:tenantId/workflow',

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
  [APPCONSTANTS.ROLES.REGION_ADMIN]: PROTECTED_ROUTES.accountDashboard,
  [APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN]: PROTECTED_ROUTES.healthFacilityByAdmin
};
