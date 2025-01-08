export const SPICE = 'SPICE';
export const REPORTS = 'REPORTS';
export const INSIGHTS = 'INSIGHTS';

export const spiceRole = {
  spice: 'admin',
  spiceInsights: 'cfr'
};

export const hfAdminRole = 'HEALTH_FACILITY_ADMIN';
export const superAdminRole = 'SUPER_ADMIN';
export const redRisk = 'RED_RISK_USER';
export const peerSupervisor = 'PEER_SUPERVISOR';
export const hf4ReportUser = 'HF4_REPORT_USER';

// COMMUNITY
export const onlyCHWRoles = ['CHW'];
export const onlyPeerSupervisor = [peerSupervisor];
export const chwPeerRoles = ['CHW', peerSupervisor];
export const mobCommunityRoles = ['PROVIDER', 'MID_WIFE', 'LAB_ASSISTANT', 'SRN', 'SECHN', 'CHA', 'MCHA'];
export const adminRoles = ['HEALTH_FACILITY_ADMIN', ...mobCommunityRoles];
export const superAdminRoles = ['SUPER_ADMIN', 'SUPER_USER'];
// REPORTS
export const allReportRoles = ['REPORT_ADMIN', 'FACILITY_REPORT_ADMIN', hf4ReportUser];
export const reportAndFacilityAdmin = ['REPORT_ADMIN', 'FACILITY_REPORT_ADMIN'];
export const reportAdminRole = ['REPORT_ADMIN'];
export const onlyHF4UserRole = [hf4ReportUser];
export const facilityReportAdminRole = ['FACILITY_REPORT_ADMIN'];
export const facilityPlusHF4ReportUserRole = [hf4ReportUser, 'FACILITY_REPORT_ADMIN'];
// INSIGHTS
export const allInsightRoles = ['INSIGHTS_USER', 'INSIGHTS_DEVELOPER'];
export const insightUserRole = ['INSIGHTS_USER'];
export const insightDeveloperRole = ['INSIGHTS_DEVELOPER'];

// NON_COMMUNITY
export const chaRole = ['COMMUNITY_HEALTH_ASSISTANT'];
export const CHPARoles = ['COMMUNITY_HEALTH_PROMOTER', 'COMMUNITY_HEALTH_ASSISTANT'];
export const allAFSingleRoles = [
  'HEALTH_COACH',
  'HEALTH_SCREENER',
  'HRIO',
  'LAB_TECHNICIAN',
  'NUTRITIONIST',
  'COUNSELOR',
  'PHARMACIST',
  'PROVIDER',
  'NURSE',
  'PHYSICIAN_PRESCRIBER'
];
export const mobNonCommunityRoles = [...allAFSingleRoles, ...CHPARoles];

export const villageBasedRoles = ['CHW', 'COMMUNITY_HEALTH_PROMOTER'];

// extra
export const hfCreateRoles = [
  'HEALTH_FACILITY_ADMIN',
  'PROVIDER',
  'MID_WIFE',
  'LAB_ASSISTANT',
  'SRN',
  'SECHN',
  'CHA',
  'MCHA',
  peerSupervisor
];
export const allHFNeededRoles = [...adminRoles, ...chwPeerRoles, ...mobNonCommunityRoles, ...CHPARoles];

export const urlBased: { [key: string]: string } = {
  district: 'district',
  region: 'region',
  chiefdom: 'chiefdom',
  'health-facility': 'healthFacility'
};

export const healthFacility = [hfAdminRole];
export const chiefdom = [...healthFacility, 'CHIEFDOM_ADMIN'];
export const district = [...chiefdom, 'DISTRICT_ADMIN'];
export const region = [...district, 'REGION_ADMIN', 'SUPER_ADMIN'];

export const allHierarchyAdmins = [...district, 'REGION_ADMIN']; // upto region admin
export const allMigrationAdmins = [...region]; // upto super admin

export const HIERARCHY_ROLES: { [key: string]: string[] } = { healthFacility, chiefdom, district, region };
