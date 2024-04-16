const MOCK_DATA_CONSTANTS = {
  REGION_DETAIL: {
    id: 12,
    name: 'NBC',
    type: 'CPHP',
    phuFocalPersonName: 'TestUser',
    phuFocalPersonNumber: '123456789',
    address: 'Test Address',
    chiefdom: {
      id: 5,
      name: 'MADRAS CENTRAL',
      code: '6',
      tenantId: 18,
      district: {
        id: 5,
        name: null,
        code: null,
        tenantId: null,
        country: null
      }
    },
    district: {
      id: 5,
      name: 'MADRAS',
      code: '6',
      tenantId: 17,
      country: {
        id: 1,
        name: null,
        phoneNumberCode: null,
        unitMeasurement: null,
        regionCode: null,
        tenantId: null
      }
    },
    cityName: 'Guindy',
    latitude: '12',
    longitude: '21',
    postalCode: '8765461',
    language: 'English',
    linkedVillages: [
      {
        id: 8,
        name: 'Liverpool',
        code: '23',
        chiefdomId: 4,
        countryId: 1,
        districtId: 4
      }
    ],
    tenantId: 23,
    fhirId: '958',
    clinicalWorkflows: [],
    organizations: [],
    peerSupervisors: [
      {
        id: 38,
        firstName: 'Robert',
        roles: [
          {
            id: 5,
            name: 'PEER_SUPERVISOR',
            level: 100,
            groupName: 'SPICE',
            displayName: 'Peer Supervisor'
          }
        ],
        middleName: null,
        lastName: 'Oppeneimer',
        gender: 'Male',
        phoneNumber: '6345678921',
        username: 'oppeneimer@gmail.com',
        countryCode: '232',
        country: {
          id: 1,
          name: 'SL',
          phoneNumberCode: '21',
          unitMeasurement: null,
          regionCode: '1',
          tenantId: 1
        },
        organizations: [
          {
            id: 23,
            formDataId: 12,
            name: 'NBC',
            sequence: null,
            parentOrganizationId: 5
          }
        ],
        tenantId: 23,
        fhirId: '4352',
        suiteAccess: ['admin'],
        supervisor: null,
        villages: []
      }
    ]
  }
};

export const REGION_LIST = [MOCK_DATA_CONSTANTS.REGION_DETAIL];
