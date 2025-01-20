import APPCONSTANTS from '../../constants/appConstants';

const MOCK_DATA_CONSTANTS = {
  FETCH_ACTIVE_DISTRICT_LIST_REQUEST_PAYLOAD: {
    isActive: true,
    countryId: 1,
    tenantId: '5',
    skip: 0,
    limit: 10,
    search: 'Sample'
  },
  FETCH_INACTIVE_ACCOUNTS_REQUEST_PAYLOAD: {
    tenantId: '3',
    skip: 0,
    limit: 10,
    search: 'Sample'
  },
  FETCH_DISTRICT_LIST_RESPONSE_PAYLOAD: {
    id: '3',
    users: [
      {
        id: '4946',
        username: 'novoaccountadmin@spice.mdt',
        email: 'novoaccountadmin@spice.mdt',
        firstName: 'Novo',
        lastName: 'Novo',
        gender: 'Male',
        countryCode: '254',
        phoneNumber: '1234567890',
        timezone: '',
        country: {
          id: '4',
          countryCode: '254'
        }
      }
    ],
    name: 'Sample District',
    maxNoOfUsers: '100',
    tenantId: '3',
    country: {
      countryCode: '233',
      tenantId: '4',
      id: '6'
    }
  },
  FETCH_DASHBOARD_DISTRICT_PAYLOAD: {
    skip: 0,
    limit: 10,
    searchTerm: 'Sample',
    tenantId: '4'
  },
  DASHBOARD_DISTRICT_RESPONSE_PAYLOAD: [
    {
      id: '1',
      name: 'District One',
      chiefdomCount: 3,
      healthFacilityCount: 10,
      tenantId: '5'
    },
    {
      id: '2',
      name: 'District Two',
      chiefdomCount: 13,
      healthFacilityCount: 20,
      tenantId: '6'
    }
  ],
  ACTIVATE_DISTRICT_PAYLOAD: {
    tenantId: 4
  },
  DEACTIVATE_DISTRICT_PAYLOAD: {
    tenantId: 3,
    status: 'Inactive',
    reason: 'Not active anymore'
  },
  FETCH_DISTRICT_OPTIONS_REQUEST_PAYLOAD: {
    tenantId: '2',
    skip: 0,
    limit: null,
    searchTerm: ''
  },
  FETCH_DISTRICT_OPTIONS_RESPONSE_PAYLOAD: [
    {
      name: 'District option one',
      id: '1',
      tenantId: '5'
    },
    {
      name: 'District option two',
      id: '2',
      tenantId: '6'
    }
  ],
  CREATE_DISTRICT_PAYLOAD: {
    name: 'District Test',
    maxNoOfUsers: 100,
    clinicalWorkflow: [2, 4],
    customizedWorkflow: [],
    countryId: 3,
    parentOrganizationId: 290,
    tenantId: 290,
    users: [
      {
        email: 'testdistrict@admin.com',
        firstName: 'TestDistrict',
        lastName: 'Admin',
        phoneNumber: '1234567890',
        gender: 'Male',
        username: 'testdistrict@admin.com',
        country: '3',
        timezone: {
          id: 2
        }
      }
    ]
  },
  DISTRICT_WORLFOW_PAYLOAD: {
    name: 'District Workflow sample',
    viewScreens: ['ViewScreen 1', 'ViewScreen 2'],
    countryId: '2',
    tenantId: '4',
    id: '2'
  },
  DELETE_DISTRICT_WORLFOW_PAYLOAD: {
    tenantId: '4',
    id: '2'
  },
  FETCH_CLINICAL_WORKFLOWS_REQUEST_PAYLOAD: {
    countryId: '2',
    limit: 10,
    skip: 0,
    searchTerm: 'Clinical'
  },
  FETCH_CLINICAL_WORKFLOWS_RESPONSE_PAYLOAD: [
    {
      id: '1',
      name: 'Clinical Worlfow One',
      isActive: true,
      default: true,
      isDeleted: false,
      coreType: 'Sample',
      workflowId: '4',
      moduleType: 'clinical',
      country: '2',
      tenantId: '3',
      viewScreens: ['View Screen One', 'View Screen Two']
    },
    {
      id: '1',
      name: 'Clinical Worlfow Two',
      isActive: true,
      default: true,
      isDeleted: false,
      coreType: 'Sample',
      workflowId: '2',
      moduleType: 'clinical',
      country: '1',
      tenantId: '4',
      viewScreens: ['View Screen One', 'View Screen Two']
    }
  ],
  UPDATE_DISTRICT_PAYLOAD: {
    id: '1',
    name: 'District Dummy',
    maxNoOfUsers: '100',
    tenantId: '4'
  },
  DEFAULT_REQUEST_PAYLOAD: {
    tenantId: 1,
    id: 1
  },
  SEARCH_DISTRICT_ADMIN_REQUEST_PAYLOAD: {
    tenantId: 80,
    searchTerm: 'of',
    roleNames: [APPCONSTANTS.ROLES.DISTRICT_ADMIN]
  },
  DISTRICT_DETAIL_RESPONSE_PAYLOAD: {
    id: '1',
    name: 'Novo Kenya',
    maxNoOfUsers: '100',
    tenantId: '2',
    users: [
      {
        id: '4946',
        username: 'novoaccountadmin@spice.mdt',
        email: 'novoaccountadmin@spice.mdt',
        firstName: 'Novo',
        lastName: 'Novo',
        gender: 'Male',
        countryCode: '254',
        phoneNumber: '1234567890',
        organizationName: 'test',
        timezone: { id: '1', description: 'test' },
        country: {
          id: '4',
          countryCode: '254'
        }
      }
    ]
  },
  DISTRICT_ADMIN: {
    id: '2',
    firstName: 'District',
    lastName: 'Admin',
    email: 'districtadmin@email.com',
    phoneNumber: '1234567890',
    username: 'districtadmin@email.com',
    gender: 'male',
    countryCode: '231',
    timezone: '23',
    country: { countryCode: '231', id: '4' },
    tenantId: '4',
    roles: []
  }
};

export default MOCK_DATA_CONSTANTS;
