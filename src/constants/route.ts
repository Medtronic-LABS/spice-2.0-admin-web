import APPCONSTANTS from './appConstants';

export const PUBLIC_ROUTES = {
  login: '/',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password/:token',
  privacyPolicy: '/privacy-policy'
};

export const PROTECTED_ROUTES = {
  profile: '/profile',
  dashboard: '/home',
  createSuperAdmin: '/super-admin/create',
  screen: '/screening-form',
  superAdmin: '/super-admin',
  deactivatedRecords: '/deactivated-records',
  lockedUsers: '/locked-users',
  legalTerms: '#',

  // region
  regionDashboard: '/region',
  createRegion: '/region/create',
  region: '/region/:regionId/:tenantId',
  regionSummary: '/region/:regionId/:tenantId',

  // region customization
  customizationByRegion: '/region/:regionId/:tenantId/customize',
  accordianViewRegionCustomizationForm: '/region/:regionId/:tenantId/:form/regionCustomize',

  // district
  DistrictDashboard: '/district',
  createDistrictByRegion: '/region/:regionId/:tenantId/district/create',
  districtByRegion: '/region/:regionId/:tenantId/district',
  districtAdminByRegion: '/region/:regionId/:tenantId/district-admin',
  districtSummary: '/district/:districtId/:tenantId',

  // chiefdom
  ChiefdomDashboard: '/chiefdom',
  createChiefdomByRegion: '/region/:regionId/:tenantId/chiefdom/create',
  createChiefdomByDistrict: '/district/:districtId/:tenantId/chiefdom/create',
  chiefdomByRegion: '/region/:regionId/:tenantId/chiefdom',
  chiefdomByDistrict: '/district/:districtId/:tenantId/chiefdom',
  chiefdomAdminByRegion: '/region/:regionId/:tenantId/chiefdom-admin',
  chiefdomAdminByDistrict: '/district/:districtId/:tenantId/chiefdom-admin',
  chiefdomSummary: '/chiefdom/:chiefdomId/:tenantId',
  // hf
  siteDashboard: '/site',
  createHealthFacility: '/region/:regionId/health-facility/create',
  healthFacilityBySuperAdmin: '/region/:regionId/health-facility/list',
  healthFacilityByAdmin: '/health-facility/list',
  healthFacilitySummary: '/health-facility/:healthFacilityId/:hfTenantId',
  siteAdminByRegion: '/region/:regionId/:tenantId/siteAdmin',
  siteAdminByDistrict: '/district/:districtId/:tenantId/siteAdmin',
  siteAdminByChiefdom: '/chiefdom/:chiefdomId/:tenantId/siteAdmin',
  hfByRegion: '/region/:regionId/:tenantId/health-facility',
  hfByDistrict: '/district/:districtId/:tenantId/health-facility',
  hfByChiefdom: '/chiefdom/:chiefdomId/:tenantId/health-facility',
  createHFByRegion: '/region/:regionId/:tenantId/health-facility/create',
  createHFByChiefdom: '/chiefdom/:chiefdomId/:tenantId/health-facility/create',
  createHFByDistrict: '/district/:districtId/:tenantId/health-facility/create',
  siteSummary: '/site/:siteId/:tenantId',

  // user
  usersBySuperAdmin: '/region/:regionId/users/list',
  usersByAdmin: '/users/list',
  userByRegion: '/region/:regionId/:tenantId/user',
  userByDistrict: '/district/:districtId/:tenantId/user',
  userByChiefdom: '/chiefdom/:chiefdomId/:tenantId/user',

  // admin
  adminBySuperAdmin: '/region/:regionId/admin/list',

  // labtest
  labtestList: '/region/:regionId/:tenantId/lab-test',
  customizeLabTest: '/region/:regionId/:tenantId/:labTestName/lab-test/:identifier/:testId',
  labTestByRegion: '/region/:regionId/:tenantId/lab-test',
  createLabTest: '/region/:regionId/:tenantId/lab-test/create',
  editLabTest: '/region/:regionId/:tenantId/lab-test/:labTestId/:labTestTenantId',

  // medication
  createMedication: '/region/:regionId/medication/create',
  medicationByRegion: '/region/:regionId/medication/list',

  // program
  programByRegion: '/region/:regionId/:tenantId/program',
  createProgramByRegion: '/region/:regionId/:tenantId/program/create',

  // group
  groupByRegion: '/region/:regionId/:tenantId/group',
  groupByDistrict: '/district/:districtId/:tenantId/group',
  groupByChiefdom: '/chiefdom/:chiefdomId/:tenantId/group',
  groupBySite: '/site/:siteId/:tenantId/group',
  createGroupByRegion: '/region/:regionId/:tenantId/group/create',
  createGroupByChiefdom: '/chiefdom/:chiefdomId/:tenantId/group/create',
  createGroupByDistrict: '/district/:districtId/:tenantId/group/create',
  createGroupBySite: '/site/:siteId/:tenantId/group/create',

  // workflow
  workflowByRegion: '/region/:regionId/:tenantId/workflow',
  workflowCustomization: '/region/:regionId/:tenantId/:form/workflowCustomize/:clinicalWorkflowId/:workflowId'
};

export const HOME_PAGE_BY_ROLE = {
  [APPCONSTANTS.ROLES.SUPER_USER]: PROTECTED_ROUTES.dashboard,
  [APPCONSTANTS.ROLES.SUPER_ADMIN]: PROTECTED_ROUTES.dashboard,
  [APPCONSTANTS.ROLES.REGION_ADMIN]: PROTECTED_ROUTES.DistrictDashboard,
  [APPCONSTANTS.ROLES.DISTRICT_ADMIN]: PROTECTED_ROUTES.ChiefdomDashboard,
  [APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN]: PROTECTED_ROUTES.healthFacilityByAdmin
};
