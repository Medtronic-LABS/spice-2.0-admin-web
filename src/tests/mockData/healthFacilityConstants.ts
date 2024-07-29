const HF_LIST_FETCH_PAYLOAD = {
  limit: 10,
  skip: 0,
  countryId: 1,
  userBased: false
};

const CLINICAL_WORKFLOWS = [
  {
    id: 8,
    createdBy: null,
    updatedBy: null,
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
    name: 'Community Health Post',
    active: true,
    deleted: false
  },
  {
    id: 2,
    name: 'Community Health Centre',
    active: true,
    deleted: false
  },
  {
    id: 3,
    name: 'Maternity and Child Health Post',
    active: true,
    deleted: false
  }
];

const HF_USERS_REQUEST = {
  countryId: 1,
  tenantId: '349',
  limit: 10,
  skip: 0,
  searchTerm: '',
  userBased: false,
  tenantBased: true
};

const HF_USER = {
  id: 682,
  firstName: 'Mariot',
  roles: [
    {
      id: 6,
      name: 'PROVIDER',
      level: 2,
      groupName: 'SPICE',
      displayName: 'Community Health Officer',
      suiteAccessName: 'mob'
    }
  ],
  lastName: 'CHO',
  gender: 'Male',
  phoneNumber: '2873458398',
  username: 'mari_cho@spice.com',
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
      id: 324,
      formDataId: 222,
      name: 'Mariot - Gulmarg',
      sequence: null,
      parentOrganizationId: 323
    }
  ],
  tenantId: 324,
  fhirId: '111331',
  suiteAccess: ['mob'],
  villages: []
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

const CHIEF_DOM_LIST = [
  {
    id: 1,
    name: 'South Chennai',
    code: '0001',
    tenantId: 3,
    district: {
      id: 1,
      name: null,
      code: null,
      tenantId: null,
      country: null
    }
  },
  {
    id: 13,
    name: 'North Chennai',
    code: '2012',
    tenantId: 83,
    district: {
      id: 1,
      name: null,
      code: null,
      tenantId: null,
      country: null
    }
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
  tenantId: 348
};

const HF_ID_TIS = {
  id: 757,
  tenantIds: [349]
};

const HF_IDS_TI = {
  ids: [757],
  tenantId: 349
};

const HF_CI_DI = {
  countryId: 1,
  districtId: 1
};

const HF_CI_DI_CDI = {
  ...HF_CI_DI,
  chiefdomId: 13
};

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
  HF_IDS_TI
};
