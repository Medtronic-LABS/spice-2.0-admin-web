const APPCONSTANTS = {
  APP_TYPE: 'web',
  HASH_ALGORITM: 'sha512',
  USER_TENANTID: 'uti',
  APP_VERSION: 'av',
  SECRET_TOKEN: 'sat',
  USERNAME: 'un',
  PASSWORD: 'pw',
  REMEMBER_ME: 'rm',
  TENANT_ID: 'ti',
  ENCRYPTION: {
    ALGM: 'aes-256-gcm',
    IV: 'ncd@123',
    SALT: 'ncd@123',
    ITERATION: 2048,
    KEYLEN: 32,
    DIGEST: 'sha512'
  },
  PAGINATION_RANGE: 5,
  INITIAL_PAGE: 1,
  ROWS_PER_PAGE_OF_TABLE: 10,
  FIRST_NAME_LENGTH: 100,
  LAST_NAME_LENGTH: 100,
  FAMILY_NAME_LENGTH: 100,
  TAC_STATUS: 'tac',
  SUITE_ACCESS: {
    ADMIN: 'admin',
    CFR: 'cfr',
    INSIGHTS: 'insights'
  },
  SPICE_ROLE_SUITE_ACCESS: {
    mob: 'mob',
    admin: 'admin'
  },
  COMMUNITY_ROLES: {
    SUPER_USER: 'SUPER_USER',
    SUPER_ADMIN: 'SUPER_ADMIN',
    HEALTH_FACILITY_ADMIN: 'HEALTH_FACILITY_ADMIN',
    PEER_SUPERVISOR: 'PEER_SUPERVISOR',
    REPORT_ADMIN: 'REPORT_ADMIN',
    FACILITY_REPORT_ADMIN: 'FACILITY_REPORT_ADMIN',
    SPICE_INSIGHTS_USER: 'INSIGHTS_USER',
    SPICE_INSIGHTS_DEVELOPER: 'INSIGHTS_DEVELOPER'
  },
  ROLES: {
    SUPER_USER: 'SUPER_USER',
    SUPER_ADMIN: 'SUPER_ADMIN',
    REGION_ADMIN: 'REGION_ADMIN',
    DISTRICT_ADMIN: 'DISTRICT_ADMIN',
    CHIEFDOM_ADMIN: 'CHIEFDOM_ADMIN',
    HEALTH_FACILITY_ADMIN: 'HEALTH_FACILITY_ADMIN'
  },
  ALL_ROLES: {
    SUPER_USER: 'SUPER_USER',
    SUPER_ADMIN: 'SUPER_ADMIN',
    REGION_ADMIN: 'REGION_ADMIN',
    DISTRICT_ADMIN: 'DISTRICT_ADMIN',
    CHIEFDOM_ADMIN: 'CHIEFDOM_ADMIN',
    HEALTH_FACILITY_ADMIN: 'HEALTH_FACILITY_ADMIN',
    HEALTH_COACH: 'HEALTH_COACH',
    HEALTH_SCREENER: 'HEALTH_SCREENER',
    HRIO: 'HRIO',
    LAB_TECHNICIAN: 'LAB_TECHNICIAN',
    NUTRITIONIST: 'NUTRITIONIST',
    COUNSELOR: 'COUNSELOR',
    PHARMACIST: 'PHARMACIST',
    PROVIDER: 'PROVIDER',
    NURSE: 'NURSE',
    PHYSICIAN_PRESCRIBER: 'PHYSICIAN_PRESCRIBER',
    REPORT_ADMIN: 'REPORT_ADMIN',
    REPORT_SUPER_ADMIN: 'REPORT_SUPER_ADMIN',
    COMMUNITY_HEALTH_PROMOTER: 'COMMUNITY_HEALTH_PROMOTER',
    COMMUNITY_HEALTH_ASSISTANT: 'COMMUNITY_HEALTH_ASSISTANT'
  },
  SITE_ROLE_NAMES: [
    'HRIO',
    'LAB_TECHNICIAN',
    'NURSE',
    'RED_RISK_USER',
    'HEALTH_COACH',
    'JOB_USER',
    'PROVIDER',
    'COMMUNITY_HEALTH_PROMOTER',
    'NUTRITIONIST',
    'PHYSICIAN_PRESCRIBER',
    'PHARMACIST',
    'COUNSELOR',
    'HEALTH_SCREENER',
    'COMMUNITY_HEALTH_ASSISTANT'
  ],
  ROUTE_NAMES: {
    REGION: 'region',
    DISTRICT: 'district',
    CHIEFDOM: 'chiefdom',
    HEALTHFACILITY: 'health-facility'
  },
  IS_SIDEMENU_COLLAPSED: 'isSmCollapsed',
  REGIONS_PER_PAGE: 10,
  MEDICATION_LIST_PER_PAGE: 10,
  CHIEFDOM_PER_PAGE: 15,
  SUPERADMINS_PER_PAGE: 10,
  DISTRICT_PER_PAGE: 10,
  HF_PER_PAGE: 15,
  LINK_EXPIRED: 'Link has expired.',
  ALERT: 'Alert',
  PASSWORD_SET_SUCCESS: 'Password has been set successfully.',
  PASSWORD_SET_FAILED: 'Failed to set password. Please try again.',
  PASSWORD_CHANGE_SUCCESS: 'Password has been changed successfully.',
  PASSWORD_CHANGE_FAILED: 'Failed to change the password. Please try again.',
  SUCCESS: 'Success',
  PASSWORD_RESET_EMAIL_SENT_MESSAGE:
    'You will receive the email notification to reset the password if your account exists in our system.',
  OOPS: 'Oops',
  ERROR: 'Error',
  // REGION
  REGION_UPLOAD_SUCCESS: 'Module_Name data uploaded successfully.',
  REGION_UPLOAD_FAILURE: 'Unable to upload the module_name data. Please try after sometime.',
  REGION_DOWNLOAD_SUCCESS: 'Module_Name data downloaded successfully.',
  REGION_DOWNLOAD_FAILURE: 'Unable to download the module_name data. Please try after sometime.',
  REGION_CREATION_SUCCESS: 'Module_Name created successfully.',
  REGION_CREATION_ERROR: 'Unable to create module_name. Please try after sometime.',
  REGION_FETCH_ERROR: 'Unable to load module_name. Please try after sometime.',
  REGION_DETAIL_FETCH_ERROR: 'Unable to load module_name details. Please try after sometime.',
  // DEACTIVATED RECORDS
  ACTIVATE_COUNTY_CONFIRMATION: 'Are you sure want to activate the Module_Name?',
  ACTIVATE_COUNTY_TITLE: 'Activate Module_Name',
  ACTIVATE_COUNTY_SUCCESS: 'Module_Name activated successfully.',
  ACTIVATE_COUNTY_FAIL: 'Unable to activate the module_name. Please try after sometime.',
  // WORKFLOW
  WORKFLOW_CREATE_SUCCESS: 'Workflow created successfully.',
  WORKFLOW_CREATE_FAIL: 'Unable to create workflow. Please try after sometime.',
  WORKFLOW_UPDATE_SUCCESS: 'Workflow updated successfully.',
  WORKFLOW_UPDATE_FAIL: 'Unable to update workflow. Please try after sometime.',
  WORKFLOW_DELETE_TITLE: 'Delete Workflow',
  WORKFLOW_DELETE_CONFIRMATION: 'Are you sure you want to delete the workflow?',
  WORKFLOW_DELETE_SUCCESS: 'Workflow deleted successfully.',
  WORKFLOW_DELETE_ERROR: 'Unable to delete the workflow. Please try after sometime.',
  WORKFLOW_ALREADY_EXISTS: 'Workflow name already exists.',
  // DISTRICT
  DISTRICT_UPDATE_SUCCESS: 'Module_Name name updated successfully.',
  DISTRICT_UPDATE_FAIL: 'Unable to update module_name summary. Please try after sometime.',
  DISTRICT_DEACTIVATE_SUCCESS: 'Module_Name deactivated successfully.',
  DISTRICT_DEACTIVATE_FAIL: 'Unable to deactivate the module_name. Please try after sometime.',
  DISTRICT_CREATION_SUCCESS: 'Module_Name created successfully.',
  DISTRICT_CREATION_FAIL: 'Unable to create module_name. Please try after sometime.',
  DISTRICT_ADMIN_DELETE_CONFIRMATION: 'Are you sure want to delete module_name admin?',
  DISTRICT_ADMIN_DELETE_TITLE: 'Delete Module_Name Admin',
  DISTRICT_DETAIL_FETCH_ERROR: 'Unable to load module_name summary. Please try after sometime.',
  DISTRICT_ADMIN_CREATE_SUCCESS: 'Module_Name admin added successfully.',
  DISTRICT_ADMIN_CREATE_FAIL: 'Unable to add module_name admin. Please try after sometime',
  DISTRICT_ADMIN_UPDATE_SUCCESS: 'Module_name admin updated successfully.',
  DISTRICT_ADMIN_UPDATE_FAIL: 'Unable to update module_name admin. Please try after sometime',
  DISTRICT_ADMIN_DELETE_SUCCESS: 'Module_name admin deleted successfully.',
  DISTRICT_ADMIN_DELETE_FAIL: 'Unable to delete module_name admin. Please try after sometime.',
  DISTRICT_FETCH_ERROR: 'Unable to load module_name. Please try after sometime.',
  DELETE_CONSENT_CONFIRMATION: 'Are you sure you want to delete the module_name consent form?',
  // CHIEFDOM
  CHIEFDOM_CREATION_SUCCESS: 'Module_Name created successfully.',
  CHIEFDOM_CREATION_FAIL: 'Unable to create module_name. Please try after sometime.',
  CHIEFDOM_ADMIN_FETCH_ERROR: 'Unable to load module_name admins. Please try after sometime.',
  CHIEFDOM_ADMIN_DELETE_SUCCESS: 'Module_Name admin deleted successfully.',
  CHIEFDOM_ADMIN_DELETE_FAIL: 'Unable to delete module_name admin. Please try after sometime.',
  CHIEFDOM_ADMIN_UPDATE_FAIL: 'Unable to update module_name admin. Please try after sometime.',
  CHIEFDOM_ADMIN_UPDATE_SUCCESS: 'Module_Name admin updated successfully.',
  CHIEFDOM_ADMIN_DELETE_CONFIRMATION: 'Are you sure want to delete the module_name admin?',
  CHIEFDOM_ADMIN_DELETE_TITLE: 'Delete Module_Name Admin',
  CHIEFDOM_FETCH_ERROR: 'Unable to load module_names. Please try after sometime.',
  CHIEFDOM_LIST_FETCH_ERROR: 'Unable to load module_name list. Please try after sometime.',
  CHIEFDOM_UPDATE_FAIL: 'Unable to update module_name. Please try after sometime.',
  CHIEFDOM_UPDATE_SUCCESS: 'Module_Name updated successfully.',
  CHIEFDOM_DELETE_CONFIRMATION: 'Are you sure want to delete the module_name?',
  CHIEFDOM_DELETE_TITLE: 'Delete Module_Name',
  CHIEFDOM_DETAIL_FETCH_ERROR: 'Unable to load module_name summary. Please try after sometime.',
  CHIEFDOM_ADMIN_CREATE_SUCCESS: 'Module_Name admin created successfully.',
  CHIEFDOM_ADMIN_CREATE_FAIL: 'Unable to create module_name admin. Please try after sometime.',
  // HF
  HEALTH_FACILITY_LIST_FETCH_ERROR: 'Unable to load module_name. Please try after sometime.', //
  HEALTH_FACILITY_USERS_FETCH_ERROR: 'Unable to load module_name users. Please try after sometime.',
  HEALTH_FACILITY_DETAILS_UPDATE_ERROR: 'Unable to update module_name details. Please try after sometime.',
  HEALTH_FACILITY_DETAILS_UPDATE_SUCCESS: 'Module_name details updated successfully.',
  HEALTH_FACILITY_DETAILS_FETCH_ERROR: 'Unable to load module_name details. Please try after sometime.',
  HEALTH_FACILITY_SUMMARY_UPDATE_ERROR: 'Unable to update module_name summary details. Please try after sometime.',
  HEALTH_FACILITY_CREATION_SUCCESS: 'Module_name created successfully',
  HEALTH_FACILITY_CREATION_ERROR: 'Unable to create module_name. Please try after sometime.',
  HEALTH_FACILITY_USER_CREATE_SUCCESS: 'Module_name user added successfully.',
  HEALTH_FACILITY_USER_CREATE_ERROR: 'Unable to add module_name user. Please try after sometime.',
  HEALTH_FACILITY_USER_UPDATE_SUCCESS: 'Module_name user updated successfully.',
  HEALTH_FACILITY_USER_UPDATE_ERROR: 'Unable to update module_name user. Please try after sometime.',
  HEALTH_FACILITY_USER_DELETE_SUCCESS: 'Module_name user deleted successfully.',
  HEALTH_FACILITY_USER_DELETE_FAIL: 'Unable to delete module_name user. Please try after sometime.',
  HEALTH_FACILITY_USER_DELETE_CONFIRMATION: 'Are you sure you want to delete the module_name user?',
  HEALTH_FACILITY_USER_DELETE_TITLE: 'Delete Module_Name User',
  HEALTH_FACILITY_DELETE_CONFIRMATION:
    'Are you sure you want to delete the module_name? All the users linked to this facility will also be deleted!',
  HEALTH_FACILITY_DELETE_TITLE: 'Delete Module_Name',

  FETCH_CITY_LIST_FAILURE: 'Unable to load city list. Please try after sometime',
  CLINICAL_WORKFLOW_FETCH_FAILURE: 'Unable to load the clinical workflows. Please try after sometime.',
  WORKFLOW_SELECT_ERROR_MESSAGE: 'Please select workflow',
  CUSTOMIZED_WORKFLOW: 'Customized Workflow',
  CLINICAL_WORKFLOW: 'Clinical Workflow',
  WORKFLOW_MODULE: {
    clinical: 'clinical',
    customized: 'customized'
  },
  WORKFLOW_NAME: {
    substanceAbuse: 'substanceAbuse',
    suicideScreener: 'suicideScreener',
    phq4: 'phq4',
    pregnancy: 'pregnancy',
    pregnancyAnc: 'pregnancyAnc'
  },

  spiceRole: {
    spice: 'admin',
    spiceInsights: 'cfr'
  },
  spiceRoleGrouped: {
    spice: 'SPICE',
    reports: 'REPORTS',
    insights: 'INSIGHTS'
  },
  appTypes: {
    community: 'COMMUNITY',
    non_community: 'NON_COMMUNITY'
  },
  // USER
  CHW_USER_EXCEPTION_HF_CREATE: 'CHW user should not be created in Health facility create',
  CHP_USER_EXCEPTION_HF_CREATE: 'CHP/CHW user should not be created in Health facility create',
  SUPER_ADMIN_USER_EXCEPTION_HF_CREATE: 'Existing Super Admin should not be added.',
  PROFILE_DETAIL_ERROR: 'Unable to fetch user details.  Please try after sometime.',
  USER_DETAILS_CREATE_SUCCESS: 'User details created successfully.',
  USER_DETAILS_UPDATE_SUCCESS: 'User details updated successfully.',
  USER_DETAILS_UPDATE_ERROR: 'Unable to update user. Please try after sometime.',
  USER_CREATE_SUCCESS: 'User added successfully.',
  USER_CREATE_ERROR: 'Unable to add user. Please try after sometime.',
  USER_UPDATE_SUCCESS: 'User updated successfully.',
  USER_UPDATE_ERROR: 'Unable to update user. Please try after sometime.',
  USER_DELETE_CONFIRMATION: 'Are you sure you want to delete the user?',
  USER_DELETE_TITLE: 'Delete User',
  USER_DELETE_SUCCESS: 'User deleted successfully.',
  USER_DELETE_FAIL: 'Unable to delete the user. Please try after sometime.',
  USER_DETAIL_FETCH_FAIL: 'Unable to load the user detail. Please try after sometime.',
  USERS_LIST_FETCH_ERROR: 'Unable to load users. Please try after sometime.',
  NO_VILLAGE_FOUND: 'No village available. Villages are already linked to other users.',
  ADD_ANOTHER_USER: 'Add Another User',
  IS_TERMS_CONDITIONS_DISMISSED: 'isTacD',
  TERMSCONDITIONS_UPDATE_FAIL: 'Failed to accept terms and conditions.',
  // Admin
  ADMIN_DETAILS_CREATE_SUCCESS: 'Admin details created successfully.',
  ADMIN_DETAILS_UPDATE_SUCCESS: 'Admin details updated successfully.',
  ADMIN_DETAILS_UPDATE_ERROR: 'Unable to update admin. Please try after sometime.',
  ADMIN_DETAILS_CREATE_ERROR: 'Unable to create admin. Please try after sometime.',
  ADMIN_DELETE_TITLE: 'Delete Admin',
  ADMIN_DELETE_SUCCESS: 'Admin deleted successfully.',
  ADMIN_DELETE_FAIL: 'Unable to delete the admin. Please try after sometime.',
  ADMIN_DETAIL_FETCH_FAIL: 'Unable to load the admin detail. Please try after sometime.',
  ADMIN_LIST_FETCH_ERROR: 'Unable to load Admins. Please try after sometime.',
  ADMIN_DELETE_CONFIRMATION: 'Admin will be deleted from all the linked sites. Are you sure to proceed?',
  ADD_ANOTHER_ADMIN: 'Add Another Admin',
  // MEDICATION
  MEDICATION_CREATION_SUCCESS: 'Medication created successfully.',
  MEDICATION_CREATION_ERROR: 'Unable to create medication. Please try after sometime.',
  MEDICATION_FETCH_ERROR: 'Unable to load medications. Please try after sometime.',
  MEDICATION_REENTERED_ERROR: 'You have already entered this medication in the form.',
  RESULT_NAME_REENTERED_ERROR: 'You have already entered this result name in the form.',
  RESULT_UNIT_REENTERED_ERROR: 'You have already entered this range in the form.',
  UNSAVED_CHANGES_MESSAGE: 'Please save your edited changes before submitting.',
  MEDICATION_EXISTS_ERROR: 'This medication is already available in the database.',
  MEDICATION_LIST_FETCH_ERROR: 'Unable to load medications list. Please try after sometime.',
  MEDICATION_UPDATE_SUCCESS: 'Medication updated successfully.',
  MEDICATION_UPDATE_FAIL: 'Unable to update medication. Please try after sometime.',
  MEDICATION_DELETE_SUCCESS: 'Medication deleted successfully.',
  MEDICATION_DELETE_FAIL: 'Unable to delete the medication. Please try after sometime.',
  MEDICATION_DELETE_TITLE: 'Delete Medication',
  MEDICATION_DELETE_CONFIRMATION: 'Are you sure you want to delete the medication?',

  USER_ROLES_FETCH_ERROR: 'Unable to fetch the user roles. Please try again after sometime',

  NETWORK_ERROR: 'Network Error',
  LOGIN_FAILED_TITLE: 'Login failed',
  LOGIN_FAILED_MESSAGE: 'Unable to login. Please try after sometime.',
  CONNECTION_LOST: 'There is an issue with the connection. Please try after sometime.',
  PASSWORD_RULE: 'Password must contain 6 or more characters, including uppercase, lowercase and number characters.',
  ENTER_PASSWORD: 'Please enter new password.',
  ENTER_CONFIRM_PASSWORD: 'Please enter confirm password.',
  PASSWORD_SHOULD_NOT_MATCH_ACC_NAME: `New password should not match the user's account name.`,
  FETCH_SIDEMENU_ERROR: 'Unable to fetch sidemenu. Please try after sometime',
  COMMON_PASSWORDS_ARE_NOT_ALLOWED: 'Common passwords are not allowed.',
  CONFIRM_PASSWORD_SHOULD_MATCH: 'Confirm new password should match with new password.',
  LOGIN_GENERAL_ERROR: 'Unable to login. Please try after sometime.',
  NO_RECORDS_FOUND: 'No records found',
  SEARCH_USER_ERROR: 'Unable to search the admin. Please try after sometime.',

  // form Builder
  FORM_CUSTOMIZATION_SUCCESS: 'Dynamic customization updated successfully.',
  FORM_CUSTOMIZATION_ERROR: 'Unable to update the dynamic customization. Please try after sometime.',
  VALIDITY_OPTIONS: {
    gone: { key: 'gone', label: 'Hide' },
    visible: { key: 'visible', label: 'Show' }
  },

  //

  REGION_TENANT_ERROR: 'Unable to get region information. Please try after sometime.',
  SEARCH_BY_NAME_EMAIL: 'Name / Email',
  SEARCH_BY_NAME: 'Search Name',
  SEARCH_BY_EMAIL: 'Search Email',
  GENDER_OPTIONS: [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
  ],
  SESSION_EXPIRED: 'Session got expired. Please login again.',
  LOCKED_USERS_FETCH_ERROR: 'Unable to load the locked users list. Please try after sometime.',
  RESTRICTION_OPTIONS: [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
  ],
  DEACTIVATED_RECORDS_FETCH_ERROR: 'Unable to load deactivated records. Please try after sometime.',

  UNLOCK_USER_SUCCESS: 'User unlocked successfully.',
  UNLOCK_USER_FAIL: 'Unable to unlock the user. Please try after sometime.',

  FORM_ID: 'formId',
  COUNTRY_ID: 'ci',
  COUNTRY_TENANT_ID: 'cti',
  ID: 'id',
  REGION_NAME: 'regionName',
  ACC_ID: 'accId',
  REGION_ADMIN_UPDATE_SUCCESS: 'Region admin updated successfully.',
  REGION_ADMIN_UPDATE_FAIL: 'Unable to update region admin. Please try after sometime.',
  DELETE: 'Delete',
  ADD: 'Add',
  RESET: 'Reset',
  YES: 'Yes',
  NO: 'No',

  // LAB TEST
  LABTEST_CREATION_SUCCESS: 'Lab test created successfully.',
  LABTEST_CREATION_ERROR: 'Unable to create lab tests. Please try after sometime.',
  LABTEST_FETCH_ERROR: 'Unable to load lab tests. Please try after sometime.',
  LABTEST_LIST_FETCH_ERROR: 'Unable to load lab tests list. Please try after sometime.',
  LABTEST_UPDATE_SUCCESS: 'Lab test updated successfully.',
  LABTEST_UPDATE_FAIL: 'Unable to update lab test. Please try after sometime.',
  LABTEST_DELETE_SUCCESS: 'Lab test deleted successfully.',
  LABTEST_DELETE_ERROR: 'Unable to delete the lab test. Please try after sometime.',
  LABTEST_RANGE_DELETE_ERROR: 'Unable to delete the lab test range. Please try after sometime.',
  LABTEST_RANGE_FETCH_ERROR: 'Unable to load the lab test range. Please try after sometime.',
  LABTEST_DELETE_TITLE: 'Delete Lab test',
  LABTEST_DELETE_CONFIRMATION: 'Are you sure you want to delete the lab test?',
  LABT_RESULT_RANGE_DELETE_TITLE: 'Delete Lab test result range',
  LABT_RESULT_RANGE_DELETE_CONFIRMATION: 'Are you sure you want to delete the lab test result range?',
  LABTEST_RESULT_RANGES_CREATE_SUCCESS: 'Labtest result ranges created successfully.',
  LABTEST_RESULT_RANGES_CREATE_FAIL: 'Unable to create lab result ranges. Please try after sometime.',
  LABTEST_RESULT_RANGES_UPDATE_SUCCESS: 'Labtest result ranges updated successfully.',
  LABTEST_RESULT_RANGES_UPDATE_FAIL: 'Unable to update lab result ranges. Please try after sometime.',
  REQUIRED_MANDATORY_FAILED: 'At least two fields need to be mandatory.',

  FORGOT_USER_FAILURE_ERR_MSG: 'Unable to submit the request. Please try after sometime.',
  EMAIL_ALREADY_EXISTS_ERR_MSG: 'Email ID already exists',
  EMR_ERR_MSG: 'Email ID already exists in EMR role',
  CFR_ERR_MSG: 'Email ID already exists in CFR role',
  SITE_ADMIN_PERMISSION_ERR_MSG: 'You dont have permission to add Site Admin',
  HEALTH_FACILITY_ADMIN_PERMISSION_ERR_MSG: 'You dont have permission to add health facility admin',
  EMAIL_ALREADY_EXISTS_IN_ORG_ERR_MSG: 'Email ID already exists in different organization',
  EMAIL_DUPLICATION_ERR_MSG: `Multiple users can't have same`,
  PHONE_NUMBER_ALREADY_EXISTS_ERR_MSG: 'Phone number already exists',
  PHONE_NUMBER_DUPLICATION_ERR_MSG: `Multiple users can't have same`,
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  LABTEST_REENTERED_ERROR: 'You have already entered this lab test in the form.',
  LABTEST_EXISTS_ERROR: 'This lab test is already available in the regional database.',
  PROGRAM_CREATION_SUCCESS: 'Program created successfully.',
  PROGRAM_CREATION_ERROR: 'Unable to create program. Please try after sometime.',
  PROGRAM_DETAILS_ERROR: 'Unable to fetch program details. Please try after sometime.',
  PROGRAM_UPDATE_SUCCESS: 'Program updated successfully.',
  PROGRAM_UPDATE_ERROR: 'Unable to update program. Please try after sometime.',
  PROGRAM_DELETE_TITLE: 'Delete Program',
  PROGRAM_DELETE_CONFIRMATION: 'Are you sure you want to delete the program?',
  PROGRAM_FETCH_ERROR: 'Unable to load programs. Please try after sometime.',
  PROGRAM_DELETE_SUCCESS: 'Program deleted successfully.',
  PROGRAM_DELETE_ERROR: 'Unable to delete the program. Please try after sometime.',

  // consent form values
  FETCH_CONSENT_FORM_ERROR: 'Unable to fetch the consent form data. Please try after sometime.',
  CONSENT_FORM_CUSTOMIZATION_SUCCESS: 'consent form updated successfully.',
  CONSENT_FORM_CUSTOMIZATION_ERROR: 'consent form updation failed. Please try after sometime.',
  CONSENT_FORM_EMPTY_ERROR: 'Consent data should not be empty.',
  DEACTIVATE_CONSENT_SUCCESS: 'consent form deleted successfully.',
  DEACTIVATE_CONSENT_FAILURE: 'consent form deletion failed. Please try after sometime.',
  DEACTIVATE_CONSENT_NO_DATA: 'consent data not found. Please try after sometime.',
  DELETE_CONSENT_TITLE: 'Delete confirmation',
  FETCH_FORM_META_ERROR: 'Unable to fetch the form meta data. Please try after sometime.',

  REGION_CUSTOMIZATION_SCREENS: [
    { name: 'Screening Form' },
    { name: 'Enrollment Form' },
    { name: 'Assessment Form', isCustomIconInvisible: true }
  ],
  NO_FAMILY: 'NO_FAMILY',
  INVALID_CREDENTIALS: 'Invalid credentials',
  DEACTIVATE_REASON: [
    { label: 'Unable to pay', value: 'Unable to pay' },
    { label: 'Contract expired', value: 'Contract expired' },
    { label: 'Site closure', value: 'Site closure' },
    { label: 'Inactive site', value: 'Inactive site' },
    { label: 'Other', value: 'Other' }
  ],
  // utils

  MONTHS: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  CUSTOMIZATION_FORM_CATEGORY: 'Input_form',
  levelBasedAdminRole: {
    REGION_ADMIN_LEVEL: 10,
    CHIEFDOM_ADMIN_LEVEL: 20,
    DISTRICT_ADMIN_LEVEL: 15,
    HEALTH_FACILITY_ADMIN_LEVEL: 25
  },
  BY_REGION_DETAILS: 'BY_REGION_DETAILS'
};

export const ROLE_LABELS = {
  [APPCONSTANTS.ALL_ROLES.SUPER_USER]: 'Super User',
  [APPCONSTANTS.ALL_ROLES.SUPER_ADMIN]: 'Super Admin',
  [APPCONSTANTS.ALL_ROLES.REGION_ADMIN]: 'Region Admin',
  [APPCONSTANTS.ALL_ROLES.DISTRICT_ADMIN]: 'District Admin',
  [APPCONSTANTS.ALL_ROLES.CHIEFDOM_ADMIN]: 'Chiefdom Admin',
  [APPCONSTANTS.ALL_ROLES.HEALTH_COACH]: 'Health Coach',
  [APPCONSTANTS.ALL_ROLES.HEALTH_SCREENER]: 'Health Screener',
  [APPCONSTANTS.ALL_ROLES.HRIO]: 'HRIO',
  [APPCONSTANTS.ALL_ROLES.LAB_TECHNICIAN]: 'Lab Technician',
  [APPCONSTANTS.ALL_ROLES.COUNSELOR]: 'Counselor',
  [APPCONSTANTS.ALL_ROLES.NUTRITIONIST]: 'Nutritionist',
  [APPCONSTANTS.ALL_ROLES.PHARMACIST]: 'Pharmacist',
  [APPCONSTANTS.ALL_ROLES.PROVIDER]: 'Provider',
  [APPCONSTANTS.ALL_ROLES.NURSE]: 'Nurse',
  [APPCONSTANTS.ALL_ROLES.PHYSICIAN_PRESCRIBER]: 'Physician Prescriber',
  [APPCONSTANTS.ALL_ROLES.REPORT_ADMIN]: 'Report Admin',
  [APPCONSTANTS.ALL_ROLES.HEALTH_FACILITY_ADMIN]: 'Health Facility Admin'
};

export const NAMING_VARIABLES = {
  // internal purpose only, users can't able to see
  country: 'country',
  region: 'region',
  district: 'district',
  chiefdom: 'chiefdom',
  healthFacility: 'healthfacility',
  redRisk: 'RED_RISK_USER',
  COMMUNITY_HEALTH_PROMOTER: 'COMMUNITY_HEALTH_PROMOTER'
};

export const ADMIN_BASED_ON_URL = {
  region: 'SUPER_ADMIN',
  district: 'REGION_ADMIN',
  chiefdom: 'DISTRICT_ADMIN',
  'health-facility': 'CHIEFDOM_ADMIN'
};

export const SIDE_MENU_FETCHING_HIERARCHY = {
  region: 'BY_REGION',
  district: 'BY_DISTRICT',
  chiefdom: 'BY_CHIEFDOM',
  'health-facility': 'BY_HEALTH_FACILITY'
};

export const APP_TYPE_NAME = 'appTypes';

export const APP_TYPE = {
  COMMUNITY: 'COMMUNITY',
  NON_COMMUNITY: 'NON_COMMUNITY'
};
export const SL_REGION = ['Sierra Leone', 'SL'];
export const CFR_SUITEACCSESS_NAME = { user: 'cfr_user', admin: 'cfr_admin', quickSight: 'cfr_quicksight_admin' };
export const COMMON_INSIGHTS_ADMINROLE = ['CFR_QUICKSIGHT_SPICE_ADMIN', 'CFR_QUICKSIGHT_TC_ADMIN'];
export const COMMON_INSIGHTS_USERROLE = ['CFR_HEALTH_FACILITY_USER'];

export default APPCONSTANTS;
