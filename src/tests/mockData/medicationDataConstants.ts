const MEDICATION_MOCK_DATA = {
  MEDICATION_LIST_FETCH_PAYLOAD: {
    limit: 10,
    skip: 0,
    countryId: 2
  },
  MEDICATION_LIST_DATA: [
    {
      id: '1265',
      name: 'Vildagliptin + Metformin',
      countryId: 2,
      classificationId: '3',
      dosageFormId: '3',
      dosageFormName: 'Injection',
      brandId: '140',
      classificationName: 'Angiotensin receptor blocker',
      brandName: 'Losar - Denk'
    }
  ],
  MEDICATION_TI_ID: {
    id: '1',
    tenantId: '1'
  },
  MEDICATION_DROPDOWN_ILIST: [
    {
      id: '15',
      name: 'Aldosterone Antagonist'
    }
  ],
  CLASSIFICATION_DROPDOWN_ILIST: [
    {
      id: '15',
      name: 'Aldosterone Antagonist',
      brands: []
    }
  ]
};

export default MEDICATION_MOCK_DATA;
