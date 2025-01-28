import APPCONSTANTS from '../../constants/appConstants';

const MOCK_DATA_CONSTANTS = {
  FETCH_CHIEFDOM_DETAILS_REQUEST_PAYLOAD_WITH_SEARCH: {
    tenantId: '4',
    searchTerm: 'Admin',
    roleNames: ['CHIEFDOM_ADMIN']
  },

  ID_AND_TENANT_ID_REQUEST_PAYLOAD: {
    id: '1',
    tenantId: '4'
  },

  FETCH_CHIEFDOM_ADMINS_RESPONSE_PAYLOAD: [
    {
      id: '2',
      tenantId: '3',
      firstName: 'Admin',
      lastName: 'Lname',
      email: 'admin@email.com',
      gender: 'Male',
      countryCode: '+91',
      phoneNumber: '1234567890',
      username: 'username@email.com',
      timezone: {
        id: '+4',
        descriptionn: 'Timezone'
      },
      country: '2',
      model_org_Name: 'OrgName',
      organizationName: 'OrgName',
      organizations: [
        {
          id: '1',
          name: 'Organization One'
        }
      ]
    }
  ],

  FETCH_CHIEFDOM_DETAIL_RESPONSE_PAYLOAD: {
    id: '2',
    name: 'Chiefdom Two',
    tenantId: '4',
    district: { id: '1', name: 'District One', tenantId: '1' },
    countryId: '1',
    districtId: '1',
    districtName: 'District One',
    districtTenantId: '1',
    users: [
      {
        id: '2',
        tenantId: '3',
        firstName: 'Admin',
        lastName: 'Lname',
        email: 'admin@email.com',
        gender: 'Male',
        countryCode: '+91',
        phoneNumber: '1234567890',
        username: 'username@email.com',
        timezone: {
          id: '+4',
          descriptionn: 'Timezone'
        },
        country: '2',
        model_org_Name: 'OrgName',
        organizationName: 'OrgName'
      }
    ]
  },

  UPDATE_CHIEFDOM_REQUEST_PAYLOAD: {
    id: '2',
    name: 'Chiefdom Two',
    district: { id: 2 },
    countryId: 5,
    tenantId: '7',
    districtId: 2
  },

  FETCH_DASHBOARD_CHIEFDOM_REQUEST_PAYLOAD: {
    isLoadMore: false,
    skip: 0,
    limit: null,
    search: 'Sample'
  },

  FETCH_DASHBOARD_CHIEFDOM_RESPONSE_PAYLOAD: [
    {
      id: '1',
      name: 'Chiefdom One',
      healthFacilityCount: 45,
      groupCount: 3,
      tenantId: '7'
    }
  ],

  FETCH_SUB_CHIEFDOM_REQUEST_PAYLOAD: {
    tenantId: '1',
    skip: 0,
    limit: null,
    search: 'Sample'
  },

  FETCH_CHIEFDOM_LIST_RESPONSE_PAYLOAD: [
    {
      id: '1',
      tenantId: '2',
      name: 'Chiefdom One',
      email: 'chiefdom@email.com',
      district: '5',
      account: { name: 'District One' },
      districtName: 'District One'
    }
  ],

  CREATE_CHIEFDOM_REQUEST_PAYLOAD: {
    id: '2',
    name: 'Chiefdom Two',
    district: { id: 2 },
    countryId: 6,
    districtId: 2,
    parentOrganizationId: 9,
    tenantId: '3',
    users: [
      {
        id: '4',
        email: 'user@email.com',
        username: 'user@email.com',
        firstName: 'User',
        lastName: 'Name',
        phoneNumber: '1234567890',
        timezone: { id: 5 },
        gender: 'Male',
        tenantId: '5',
        country: { id: 2 },
        countryCode: '823'
      }
    ]
  },

  FETCH_CHIEFDOM_BY_ID_REQUEST_PAYLOAD: {
    id: 60,
    name: 'Hablot Manos',
    tenantId: 360,
    users: [
      {
        id: 6538,
        username: 'davidboon@spice.mdt',
        firstName: 'David',
        lastName: 'Bonn',
        gender: 'male',
        country: {
          id: 3,
          name: 'Ghana',
          countryCode: '233',
          unitMeasurement: 'metric'
        },
        countryCode: '1',
        phoneNumber: '1234567890',
        timezone: {
          id: 2,
          offset: '-08:00',
          description: '(UTC-08:00) Baja California'
        }
      }
    ],
    district: {
      id: 15,
      name: 'St. Annes Medical Center',
      tenantId: 248
    }
  },

  FETCH_CHIEFDOM_DROPDOWN_LIST_REQUEST_PAYLOAD: {
    tenantId: '4'
  },

  FETCH_CHIEFDOM_DROPDOWN_LIST_RESPONSE_PAYLOAD: {
    total: 10,
    chiefdomList: [
      {
        id: '1',
        tenantId: '2',
        name: 'Chiefdom One',
        email: 'chiefdom@email.com',
        district: '5'
      }
    ],
    limit: null
  },

  CHIEFDOM_ADMIN_REQUEST_PAYLOAD: {
    id: '4',
    email: 'user@email.com',
    username: 'user@email.com',
    firstName: 'User',
    lastName: 'Name',
    phoneNumber: '1234567890',
    timezone: { id: 5 },
    gender: 'Male',
    tenantId: '5',
    country: { id: 2 },
    countryCode: '823'
  },
  TEST_FORM_INITIAL_VALUES: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    },
    phoneNumber: '555-555-5555'
  },
  TEST_STORE_INITIAL_VALUES: {
    account: {
      accountOptionsLoading: false,
      accountOptions: [],
      accountsLoading: false,
      account: null
    },
    user: {
      role: APPCONSTANTS.ROLES.SUPER_ADMIN
    }
  }
};

export default MOCK_DATA_CONSTANTS;
