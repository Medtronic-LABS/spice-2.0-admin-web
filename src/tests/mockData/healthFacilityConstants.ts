const HF_LIST_FETCH_PAYLOAD = {
  limit: 10,
  skip: 0,
  countryId: 1,
  userBased: false
};

const CLINICAL_WORKFLOWS = [
  {
    id: '8',
    createdBy: null,
    updatedBy: null,
    appTypes: ['COMMUNITY'],
    createdAt: '"2024-05-08T11:23:48+00:00',
    updatedAt: '"2024-05-08T11:23:48+00:00',
    name: 'Mother and Neonate',
    moduleType: 'clinical',
    workflowName: 'MOTHER & NEONATE',
    countryId: 1,
    displayOrder: 2,
    conditions: [
      {
        gender: 'male',
        maxAge: 60,
        minAge: 0,
        moduleType: 'assessment'
      },
      {
        gender: 'female',
        maxAge: 60,
        minAge: 0,
        moduleType: 'assessment'
      }
    ],
    active: true,
    deleted: false
  }
];

const HF_TYPES = [
  {
    id: 1,
    name: 'Community Health Post'
  },
  {
    id: 2,
    name: 'Community Health Centre'
  },
  {
    id: 3,
    name: 'Maternity and Child Health Post'
  }
];

const HF_USERS_REQUEST = {
  countryId: 1,
  tenantId: '349',
  skip: 0,
  limit: 10,
  searchTerm: '',
  roleNames: ['CHP'],
  isSiteUsers: true,
  tenantIds: [1],
  tenantBased: false
};

const HF_USER = {
  id: 682,
  appTypes: ['COMMUNITY'],
  firstName: 'Mariot',
  lastName: 'CHO',
  gender: 'Male',
  phoneNumber: '2873458398',
  username: 'mari_cho@spice.com',
  countryCode: '232',
  roles: [
    {
      id: 6,
      name: 'PROVIDER',
      groupName: 'SPICE',
      displayName: 'Community Health Officer',
      suiteAccessName: 'mob'
    }
  ],
  tenantId: 324,
  villages: [],
  supervisor: null,
  organizations: [
    {
      id: 324,
      formDataId: 222,
      name: 'Mariot - Gulmarg',
      sequence: null,
      parentOrganizationId: 323
    }
  ]
};

const HF_USERS = [HF_USER];

const PEER_SUPERVISOR = {
  list: [
    {
      id: 550,
      name: 'Super Peer',
      firstName: 'Super',
      roles: [
        {
          id: 5,
          name: 'PEER_SUPERVISOR',
          level: 100,
          groupName: 'SPICE',
          displayName: 'Peer Supervisor',
          suiteAccessName: 'mob'
        }
      ],
      lastName: 'Peer',
      gender: '',
      phoneNumber: '2387878787',
      username: 'srm_ps@spice.mdt',
      countryCode: '232',
      country: {
        id: 1,
        name: 'Sierra Leone',
        phoneNumberCode: '232',
        unitMeasurement: null,
        regionCode: '1',
        tenantId: 1
      },
      organizations: [
        {
          id: 343,
          formDataId: 233,
          name: 'Health Facility AN',
          sequence: null,
          parentOrganizationId: 3
        },
        {
          id: 273,
          formDataId: 194,
          name: 'Srm hf',
          sequence: null,
          parentOrganizationId: 3
        }
      ],
      tenantId: 273,
      fhirId: '63127',
      suiteAccess: ['mob'],
      villages: []
    }
  ],
  hfTenantIds: [2]
};

const HF_SUMMARY = {
  id: 222,
  name: 'Health Facility AN',
  type: 'Community Health Centre',
  phuFocalPersonName: 'Samir',
  phuFocalPersonNumber: '2453423623',
  address: 'Gulmarg',
  appTypes: ['NON_COMMUNITY'],
  chiefdom: {
    id: 62,
    name: 'Gulmarg',
    code: '2017',
    tenantId: 323,
    district: {
      id: 39,
      name: null,
      code: null,
      tenantId: null,
      country: null
    }
  },
  district: {
    id: 39,
    name: 'JamuKashmir',
    code: '5007',
    tenantId: 322,
    country: {
      id: 1,
      name: null,
      phoneNumberCode: null,
      unitMeasurement: null,
      regionCode: null,
      tenantId: null
    }
  },
  cityName: 'Gulmarg',
  latitude: '23',
  longitude: '23',
  postalCode: '234234',
  language: 'English',
  linkedVillages: [
    {
      id: 125,
      name: 'Gulmarg',
      villagecode: null,
      chiefdomId: 62,
      countryId: 1,
      districtId: 39,
      chiefdomCode: null,
      districtCode: null
    }
  ],
  tenantId: 324,
  fhirId: '111323',
  clinicalWorkflows: CLINICAL_WORKFLOWS,
  peerSupervisors: [PEER_SUPERVISOR.list[0]]
};

const HF_LIST = [HF_SUMMARY];

const HF_DASHBOARD_LIST = [
  {
    id: 1,
    name: 'HF 1',
    type: 'village',
    tenantId: 1
  }
];

const CHIEF_DOM_LIST = [
  {
    id: 1,
    name: 'South Chennai',
    tenantId: '3'
  },
  {
    id: 13,
    name: 'North Chennai',
    tenantId: '83'
  }
];

const DISTRICT_LIST = [
  {
    id: 1,
    name: 'Tanzania',
    code: '0001',
    tenantId: 2,
    country: {
      id: 1,
      name: null,
      phoneNumberCode: null,
      unitMeasurement: null,
      regionCode: null,
      tenantId: null
    }
  },
  {
    id: 2,
    name: 'Kenya',
    code: '21',
    tenantId: 7,
    country: {
      id: 1,
      name: null,
      phoneNumberCode: null,
      unitMeasurement: null,
      regionCode: null,
      tenantId: null
    }
  }
];

const VILLAGES_LIST = [
  {
    id: 1,
    name: 'Shangana',
    villagecode: null,
    chiefdomId: 1,
    countryId: 1,
    districtId: 1,
    chiefdomCode: null,
    districtCode: null
  },
  {
    id: 2,
    name: 'Basotho',
    villagecode: null,
    chiefdomId: 1,
    countryId: 1,
    districtId: 1,
    chiefdomCode: null,
    districtCode: null
  }
];

const VILLAGES_LIST_FROM_HF = {
  list: VILLAGES_LIST,
  hfTenantIds: [2]
};

const WORKFLOW_LIST = CLINICAL_WORKFLOWS;

const CULTURE_LIST = [
  {
    id: 1,
    createdBy: null,
    updatedBy: null,
    createdAt: '2024-05-06T09:52:46+00:00',
    updatedAt: '2024-05-06T09:52:46+00:00',
    name: 'English',
    code: 'en',
    appTypes: ['COMMUNITY'],
    active: true,
    deleted: false
  }
];

const COUNTRY_LIST = {
  phoneNumberCode: '232',
  id: '232'
};

const HF_TI_ID = {
  id: 235,
  appTypes: ['COMMUNITY'],
  tenantId: 348
};

const HF_ID_TIS = {
  id: 757,
  countryId: 1,
  appTypes: ['NON_COMMUNITY'],
  tenantIds: [349]
};

const HF_IDS_TI = {
  ids: [757],
  appTypes: ['COMMUNITY'],
  tenantId: 349,
  healthFacilityId: 23,
  linkedVillageIds: [1, 2]
};

const HF_CI_DI = {
  countryId: 1,
  districtId: 1
};

const HF_CI_DI_CDI = {
  ...HF_CI_DI,
  chiefdomId: 13
};

const mockHealthFacilityList = [
  {
    id: 1,
    name: 'Central Health Facility',
    type: 'Hospital',
    phuFocalPersonName: 'Dr. John Doe',
    phuFocalPersonNumber: '+123456789',
    address: '123 Health Street, Cityville',
    district: {
      id: 1,
      name: 'District 1',
      tenantId: 1001
    },
    chiefdom: {
      tenantId: '2001',
      id: 10,
      name: 'Chiefdom A'
    },
    cityName: 'Cityville',
    latitude: '34.0522',
    longitude: '-118.2437',
    postalCode: '90210',
    language: 'English',
    tenantId: 3001,
    peerSupervisors: [
      {
        id: 1,
        firstName: 'Jane',
        lastName: 'Smith',
        name: 'Jane Smith',
        tenantId: '3001',
        roles: {
          id: 2,
          name: 'Supervisor',
          displayName: 'Supervisor',
          groupName: 'Group A',
          suiteAccessName: 'Suite X',
          appTypes: ['type1', 'type2']
        }
      }
    ],
    linkedVillages: [
      {
        id: 101,
        name: 'Village Alpha',
        chiefdomId: '2001',
        countryId: 'CountryID_123',
        districtId: 'DistrictID_456'
      },
      {
        id: 102,
        name: 'Village Beta',
        chiefdomId: '2002',
        countryId: 'CountryID_123',
        districtId: 'DistrictID_456'
      }
    ],
    clinicalWorkflows: [
      {
        id: 201,
        name: 'Workflow Alpha',
        moduleType: 'Clinical',
        workflowName: 'Initial Checkup',
        appTypes: ['type1']
      },
      {
        id: 202,
        name: 'Workflow Beta',
        moduleType: 'Clinical',
        workflowName: 'Follow-Up',
        appTypes: ['type2']
      }
    ],
    workflows: [201, 202],
    customizedWorkflows: [
      {
        id: 203,
        name: 'Custom Workflow Alpha',
        moduleType: 'Clinical',
        workflowName: 'Custom Initial Checkup',
        appTypes: ['type3']
      }
    ],
    defaultTrueWorkflows: [
      {
        id: 204,
        name: 'Default Workflow Alpha',
        moduleType: 'Clinical',
        workflowName: 'Emergency Handling',
        appTypes: ['type1', 'type2']
      }
    ]
  },
  {
    id: 2,
    name: 'New Whales Health Facility',
    type: 'Hospital',
    phuFocalPersonName: 'Dr. Jermi Vel',
    phuFocalPersonNumber: '+123456789',
    address: '123 Health Street, billiyVile',
    district: {
      id: 1,
      name: 'District 1',
      tenantId: 1001
    },
    chiefdom: {
      tenantId: '2001',
      id: 10,
      name: 'Chiefdom A'
    },
    cityName: 'billiyVile',
    latitude: '34.0522',
    longitude: '-118.2437',
    postalCode: '90210',
    language: 'English',
    tenantId: 3001,
    peerSupervisors: [
      {
        id: 1,
        firstName: 'Robert',
        lastName: 'Smith',
        name: 'Robert Smith',
        tenantId: '3001',
        roles: {
          id: 2,
          name: 'Supervisor',
          displayName: 'Supervisor',
          groupName: 'Group A',
          suiteAccessName: 'Suite X',
          appTypes: ['type1', 'type2']
        }
      }
    ],
    linkedVillages: [
      {
        id: 101,
        name: 'Village Alpha',
        chiefdomId: '2001',
        countryId: 'CountryID_123',
        districtId: 'DistrictID_456'
      },
      {
        id: 102,
        name: 'Village Beta',
        chiefdomId: '2002',
        countryId: 'CountryID_123',
        districtId: 'DistrictID_456'
      }
    ],
    clinicalWorkflows: [
      {
        id: 201,
        name: 'Workflow Alpha',
        moduleType: 'Clinical',
        workflowName: 'Initial Checkup',
        appTypes: ['type1']
      },
      {
        id: 202,
        name: 'Workflow Beta',
        moduleType: 'Clinical',
        workflowName: 'Follow-Up',
        appTypes: ['type2']
      }
    ],
    workflows: [201, 202],
    customizedWorkflows: [
      {
        id: 203,
        name: 'Custom Workflow Alpha',
        moduleType: 'Clinical',
        workflowName: 'Custom Initial Checkup',
        appTypes: ['type3']
      }
    ],
    defaultTrueWorkflows: [
      {
        id: 204,
        name: 'Default Workflow Alpha',
        moduleType: 'Clinical',
        workflowName: 'Emergency Handling',
        appTypes: ['type1', 'type2']
      }
    ]
  }
];

export {
  HF_LIST_FETCH_PAYLOAD,
  HF_LIST,
  HF_TYPES,
  HF_USERS,
  HF_USER,
  HF_SUMMARY,
  CHIEF_DOM_LIST,
  DISTRICT_LIST,
  VILLAGES_LIST,
  VILLAGES_LIST_FROM_HF,
  PEER_SUPERVISOR,
  WORKFLOW_LIST,
  CULTURE_LIST,
  COUNTRY_LIST,
  HF_TI_ID,
  HF_ID_TIS,
  HF_USERS_REQUEST,
  HF_CI_DI,
  HF_CI_DI_CDI,
  HF_IDS_TI,
  HF_DASHBOARD_LIST,
  mockHealthFacilityList
};
