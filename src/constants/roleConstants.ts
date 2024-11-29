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

// COMMUNITY
export const onlyCHWRoles = ['CHW'];
export const chwPeerRoles = ['CHW', 'PEER_SUPERVISOR'];
export const mobCommunityRoles = ['PROVIDER', 'MID_WIFE', 'LAB_ASSISTANT', 'SRN', 'SECHN', 'CHA', 'MCHA'];
export const adminRoles = ['HEALTH_FACILITY_ADMIN', ...mobCommunityRoles];
export const superAdminRoles = ['SUPER_ADMIN', 'SUPER_USER'];
// REPORTS
export const allReportRoles = ['REPORT_ADMIN', 'FACILITY_REPORT_ADMIN'];
export const reportAdminRole = ['REPORT_ADMIN'];
export const facilityReportAdminRole = ['FACILITY_REPORT_ADMIN'];
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
  'PEER_SUPERVISOR'
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

export const HIERARCHY_ROLES: { [key: string]: string[] } = { healthFacility, chiefdom, district, region };
