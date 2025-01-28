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
  createSuperAdmin: '/super-admin/create',
  screen: '/screening-form',
  superAdmin: '/super-admin',
  deactivatedRecords: '/deactivated-records',
  lockedUsers: '/locked-users',
  legalTerms: '#',

  // SL
  regionCommunity: '/region/:regionId/:tenantId/community',
  healthFacilityBySuperAdmin: '/region/:regionId/healthFacility/list',
  healthFacilityByAdmin: '/healthFacility/list',
  // healthFacilitySummaryCom: '/healthFacility/:healthFacilityId/:hfTenantId',
  createHealthFacility: '/region/:regionId/healthFacility/create',
  usersBySuperAdmin: '/region/:regionId/users/list',
  usersByAdmin: '/users/list',
  medicationByRegionCom: '/region/:regionId/medication/list',
  createMedicationCom: '/region/:regionId/medication/create',
  labtestListCom: '/region/:regionId/:tenantId/lab-test/list',
  customizeLabTestCom: '/region/:regionId/:tenantId/:labTestName/lab-test/:identifier/:testId/community',

  regionDashboard: '/region',
  createRegion: '/region/create',
  region: '/region/:regionId/:tenantId',
  regionSummary: '/region/:regionId/:tenantId',

  customizationByRegion: '/region/:regionId/:tenantId/customize',
  accordianViewRegionCustomizationForm: '/region/:regionId/:tenantId/:form/regionCustomize',

  districtDashboard: '/district',
  createDistrictByRegion: '/region/:regionId/:tenantId/district/create',
  districtByRegion: '/region/:regionId/:tenantId/district',
  districtSummary: '/district/:districtId/:tenantId',

  chiefdomDashboard: '/chiefdom',
  createChiefdomByRegion: '/region/:regionId/:tenantId/chiefdom/create',
  createChiefdomByDistrict: '/district/:districtId/:tenantId/chiefdom/create',
  chiefdomByRegion: '/region/:regionId/:tenantId/chiefdom',
  chiefdomByDistrict: '/district/:districtId/:tenantId/chiefdom',
  chiefdomSummary: '/chiefdom/:chiefdomId/:tenantId',

  // AF
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

  createMedication: '/region/:regionId/:tenantId/medication/create',
  medicationByRegion: '/region/:regionId/:tenantId/medication/list',

  programByRegion: '/region/:regionId/:tenantId/program',
  createProgramByRegion: '/region/:regionId/:tenantId/program/create',

  workflowByRegion: '/region/:regionId/:tenantId/workflow',
  workflowCustomization: '/region/:regionId/:tenantId/:form/workflowCustomize/:clinicalWorkflowId/:workflowId'
};

export const routesWithSideMenu = [
  { route: PROTECTED_ROUTES.regionSummary },
  { route: PROTECTED_ROUTES.customizationByRegion },
  { route: PROTECTED_ROUTES.districtSummary, disabledRoles: [APPCONSTANTS.ROLES.DISTRICT_ADMIN] },
  { route: PROTECTED_ROUTES.districtByRegion },
  { route: PROTECTED_ROUTES.chiefdomByRegion },
  { route: PROTECTED_ROUTES.chiefdomByDistrict },
  { route: PROTECTED_ROUTES.chiefdomSummary, disabledRoles: [APPCONSTANTS.ROLES.CHIEFDOM_ADMIN] },
  { route: PROTECTED_ROUTES.healthFacilityByRegion },
  { route: PROTECTED_ROUTES.healthFacilityByDistrict },
  { route: PROTECTED_ROUTES.healthFacilityByChiefdom },
  { route: PROTECTED_ROUTES.healthFacilitySummary },
  { route: PROTECTED_ROUTES.adminByRegion },
  { route: PROTECTED_ROUTES.adminByDistrict },
  { route: PROTECTED_ROUTES.adminByChiefdom },
  { route: PROTECTED_ROUTES.adminByHealthFacility },
  { route: PROTECTED_ROUTES.userByRegion },
  { route: PROTECTED_ROUTES.userByDistrict },
  { route: PROTECTED_ROUTES.userByChiefdom },
  { route: PROTECTED_ROUTES.userByHealthFacility },
  { route: PROTECTED_ROUTES.labTestByRegion },
  { route: PROTECTED_ROUTES.medicationByRegion },
  { route: PROTECTED_ROUTES.programByRegion },
  { route: PROTECTED_ROUTES.workflowByRegion },

  // SL
  { route: PROTECTED_ROUTES.regionCommunity },
  { route: PROTECTED_ROUTES.healthFacilityByAdmin },
  { route: PROTECTED_ROUTES.usersBySuperAdmin },
  { route: PROTECTED_ROUTES.usersByAdmin },
  { route: PROTECTED_ROUTES.medicationByRegionCom },
  { route: PROTECTED_ROUTES.labTestByRegion },
  { route: PROTECTED_ROUTES.healthFacilityBySuperAdmin }
];

export const SIDE_MENU_MAPPER = {
  REGION: PROTECTED_ROUTES.regionCommunity,
  REGION_CUSTOMIZATION: PROTECTED_ROUTES.customizationByRegion,
  DISTRICT_BY_REGION: PROTECTED_ROUTES.districtByRegion,
  CHIEFDOM_BY_REGION: PROTECTED_ROUTES.chiefdomByRegion,
  HEALTH_FACILITY_BY_REGION: PROTECTED_ROUTES.healthFacilityByRegion,
  ADMINS_BY_REGION: PROTECTED_ROUTES.adminByRegion,
  USERS_BY_REGION: PROTECTED_ROUTES.userByRegion,
  PROGRAM_BY_REGION: PROTECTED_ROUTES.programByRegion,
  LAB_TEST_DATABASE_BY_REGION: PROTECTED_ROUTES.labTestByRegion,
  MEDICATION_DATABASE_BY_REGION: PROTECTED_ROUTES.medicationByRegion,
  WORKFLOW_BY_REGION: PROTECTED_ROUTES.workflowByRegion,

  DISTRICT_SUMMARY: PROTECTED_ROUTES.districtSummary,
  CHIEFDOM_BY_DISTRICT: PROTECTED_ROUTES.chiefdomByDistrict,
  HEALTH_FACILITY_BY_DISTRICT: PROTECTED_ROUTES.healthFacilityByDistrict,
  ADMINS_BY_DISTRICT: PROTECTED_ROUTES.adminByDistrict,
  USERS_BY_DISTRICT: PROTECTED_ROUTES.userByDistrict,

  CHIEFDOM_SUMMARY: PROTECTED_ROUTES.chiefdomSummary,
  HEALTH_FACILITY_BY_CHIEFDOM: PROTECTED_ROUTES.healthFacilityByChiefdom,
  ADMINS_BY_CHIEFDOM: PROTECTED_ROUTES.adminByChiefdom,
  USERS_BY_CHIEFDOM: PROTECTED_ROUTES.userByChiefdom,

  HEALTH_FACILITY_SUMMARY: PROTECTED_ROUTES.healthFacilitySummary,
  ADMINS_BY_HEALTH_FACILITY: PROTECTED_ROUTES.adminByHealthFacility,
  USERS_BY_HEALTH_FACILITY: PROTECTED_ROUTES.userByHealthFacility
};

export const regionRoutesWithSideMenu = [PROTECTED_ROUTES.region, PROTECTED_ROUTES.regionSummary];

export const districtRoutesWithSideMenu = [PROTECTED_ROUTES.districtByRegion, PROTECTED_ROUTES.districtSummary];

export const chiefdomWithSideMenu = [
  PROTECTED_ROUTES.chiefdomByRegion,
  PROTECTED_ROUTES.chiefdomByDistrict,
  PROTECTED_ROUTES.chiefdomSummary
];

export const hfWithSideMenu = [
  PROTECTED_ROUTES.healthFacilityByRegion,
  PROTECTED_ROUTES.healthFacilityByDistrict,
  PROTECTED_ROUTES.healthFacilityByChiefdom,
  PROTECTED_ROUTES.healthFacilitySummary
];

export const HOME_PAGE_BY_ROLE = {
  [APPCONSTANTS.ROLES.SUPER_USER]: PROTECTED_ROUTES.regionDashboard,
  [APPCONSTANTS.ROLES.SUPER_ADMIN]: PROTECTED_ROUTES.regionDashboard,
  [APPCONSTANTS.ROLES.REGION_ADMIN]: PROTECTED_ROUTES.districtDashboard,
  [APPCONSTANTS.ROLES.DISTRICT_ADMIN]: PROTECTED_ROUTES.chiefdomDashboard,
  [APPCONSTANTS.ROLES.CHIEFDOM_ADMIN]: PROTECTED_ROUTES.healthFacilityDashboard,
  [APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN]: PROTECTED_ROUTES.healthFacilityDashboard
};

export const COMMUNITY_HOME_PAGE_BY_ROLE = {
  [APPCONSTANTS.ROLES.SUPER_USER]: PROTECTED_ROUTES.regionDashboard,
  [APPCONSTANTS.ROLES.SUPER_ADMIN]: PROTECTED_ROUTES.regionDashboard,
  [APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN]: PROTECTED_ROUTES.healthFacilityDashboard
};
