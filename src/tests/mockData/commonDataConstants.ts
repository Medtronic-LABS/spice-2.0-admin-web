const MOCK_DATA_CONSTANTS = {
  MOCK_SIDEMENU_REQUEST: {
    countryId: 1,
    roleName: 'SUPER_ADMIN'
  },
  MOCK_SIDEMENU: [
    {
      BY_REGION: [
        {
          displayName: 'Region',
          route: '/region/:regionId/:tenantId',
          name: 'REGION',
          order: 1
        }
      ]
    }
  ],
  MOCK_LABELNAME: {
    region: {
      p: 'Regions',
      s: 'Region'
    },
    chiefdom: {
      p: 'Sub Counties',
      s: 'Sub County'
    },
    district: {
      p: 'Counties',
      s: 'County'
    },
    healthFacility: {
      p: 'Health Facilities',
      s: 'Health Facility'
    }
  }
};

export default MOCK_DATA_CONSTANTS;
