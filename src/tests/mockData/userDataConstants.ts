const MOCK_DATA_CONSTANTS = {
  INITIAL_STATE: {
    defaultRole: [],
    token: '',
    isLoggedIn: true,
    loggingIn: false,
    loggingOut: false,
    user: {
      isPasswordSet: false
    },
    userRoles: {},
    // isRolesLoading: false,
    error: null,
    loading: false,
    cultureListLoading: false,
    initializing: false,
    isPasswordSet: false,
    email: '',
    timezoneList: [],
    errorMessage: '',
    showLoader: false,
    countryList: [],
    lockedUsers: [],
    totalLockedUsers: 0,
    userTenantId: '',
    cultureList: [],
    communityList: [],
    designationList: []
  },
  MOCK_LOGIN_REQUEST: {
    username: 'testuser@test.com',
    pass: 'Spice123',
    rememberMe: false,
    countryId: 1
  },
  MOCK_TOKEN: '4',
  MOCK_USER_TENANT_ID: '3',
  MOCK_USER: {
    email: 'testuser@test.com',
    firstName: 'Test',
    lastName: 'User',
    userId: '1',
    role: 'SUPER_USER',
    roleDetail: { name: 'SUPER_USER', suiteAccessName: 'admin' },
    tenantId: '1',
    formDataId: 1,
    country: {
      id: 1,
      name: 'Sierra Leone',
      phoneNumberCode: '+21',
      unitMeasurement: null,
      regionCode: '',
      tenantId: 1,
      displayValues: {
        region: {
          s: 'region',
          p: 'regions'
        }
      }
    },
    suiteAccess: ['admin'],
    organizations: [{ formDataId: 1 }],
    countryId: undefined
  },
  LOGGED_IN_USER_DATA: {
    data: {
      entity: {
        username: 'testuser@test.com',
        firstName: 'Test',
        lastName: 'User',
        id: '1',
        roles: [{ name: 'SUPER_USER', suiteAccessName: 'admin' }],
        tenantId: '1',
        country: {
          id: 1,
          name: 'Sierra Leone',
          phoneNumberCode: '+21',
          unitMeasurement: null,
          regionCode: '',
          tenantId: 1,
          displayValues: {
            region: {
              s: 'region',
              p: 'regions'
            }
          }
        },
        // appTypes: [APPCONSTANTS.appTypes.community],
        suiteAccess: ['admin'],
        organizations: [{ formDataId: 1 }]
      }
    }
  },
  USER_ROLES_RESPONSE_PAYLOAD: {
    data: {
      entity: {
        REPORTS: [
          {
            id: 1,
            name: 'REPORT_ADMIN',
            level: 1,
            suiteAccessName: 'cfr',
            displayName: 'Report Admin',
            groupName: 'REPORTS'
          }
        ],
        SPICE: [
          {
            id: 2,
            name: 'SUPER_USER',
            level: 1,
            suiteAccessName: 'admin',
            displayName: 'Super user',
            groupName: 'SPICE'
          },
          {
            id: 2,
            name: 'HEALTH_FACILITY_ADMIN',
            level: 1,
            suiteAccessName: 'admin',
            displayName: 'Admin',
            groupName: 'SPICE'
          }
        ],
        INSIGHTS: [
          {
            id: 3,
            name: 'SPICE_INSIGHTS_DEVELOPER',
            level: 1,
            suiteAccessName: 'insights',
            displayName: 'Insights Developer',
            groupName: 'INSIGHTS'
          }
        ]
      }
    }
  },

  ALL_ROLES: [{ name: 'SUPER_ADMIN' }],
  NO_PERMISSION_ROLE: [{ name: 'HRIO' }],
  INVALID_ROLE: [{ name: 'TEACHER' }],

  FETCH_TIMEZONE_RESPONSE_PAYLOAD: {
    id: '+5',
    description: 'GMT'
  },
  FETCH_USER_BY_ID_REQUEST: {
    id: '4'
  },
  FETCH_USER_RESPONSE_PAYLOAD: {
    userId: '2',
    email: 'test@email.com',
    firstName: 'Test',
    lastName: 'Name',
    tenantId: '3'
  },
  FETCH_USER_BACKEND_RESPONSE: {
    id: '2',
    username: 'test@email.com',
    roles: [
      {
        id: 23,
        name: 'PROVIDER'
      }
    ],
    firstName: 'Test',
    lastName: 'Name',
    tenantId: '3'
  },
  FETCH_USER_BY_EMAIL_REQUEST: {
    email: 'test@email.com',
    parentOrgId: '2'
  },
  UPDATE_USER_REQUEST_PAYLOAD: {
    id: '2',
    firstName: 'Test',
    lastName: 'Name',
    username: 'test@email.com',
    email: 'test@email.com',
    gender: 'Male',
    phoneNumber: '1234567890',
    timezone: {
      id: '+5',
      description: 'GMT'
    },
    isAdded: true,
    redRisk: false,
    isUpdated: false,
    roleName: 'HRIO',
    countryCode: '91',
    country: {
      id: '2',
      countryCode: '91',
      name: 'India'
    }
  },
  FETCH_COUNTRY_PAYLOAD: {
    id: '2',
    countryCode: '91'
  },
  FETCH_LOCKED_USERS_REQUEST: {
    skip: 0,
    limit: null,
    tenantId: '2',
    search: 'Sample'
  },
  FETCH_LOCKED_USERS_RESPONSE_PAYLOAD: {
    id: '2',
    firstName: 'Test',
    lastName: 'Name',
    email: 'test@email.com'
  },
  UNLOCK_USER_REQUEST_PAYLOAD: {
    userId: '4'
  },
  FETCH_CULTURE_LIST_RESPONSE_PAYLOAD: [
    {
      id: 1,
      name: 'English - India'
    },
    {
      id: 2,
      name: 'Bengali - Bangladesh'
    }
  ]
};

export default MOCK_DATA_CONSTANTS;
