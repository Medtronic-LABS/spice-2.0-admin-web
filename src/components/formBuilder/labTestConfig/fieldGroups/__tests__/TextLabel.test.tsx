import TEXT_LABEL_CONFIG from '../TextLabel';

describe('TEXT_LABEL_CONFIG', () => {
  it('should expose the expected config methods', () => {
    expect(TEXT_LABEL_CONFIG.getEmptyData).toEqual(expect.any(Function));
    expect(TEXT_LABEL_CONFIG.getJSON).toEqual(expect.any(Function));
  });

  it('should return empty data when calling getEmptyData()', () => {
    const emptyData = TEXT_LABEL_CONFIG.getEmptyData();
    expect(emptyData).toEqual({
      id: expect.any(String),
      viewType: 'TextLabel',
      title: '',
      fieldName: '',
      family: '',
      isMandatory: false,
      isEnabled: true,
      visibility: 'visible',
      isDefault: true
    });
  });

  it('Get json with label', () => {
    const sampleJson = {
      fieldName: {
        label: 'label'
      }
    };
    if (TEXT_LABEL_CONFIG.getJSON) {
      const json = TEXT_LABEL_CONFIG.getJSON(sampleJson);
      expect(json).toEqual({
        fieldName: 'label'
      });
    }
  });

  it('Get json without label', () => {
    const sampleJson = {
      fieldName: 'label'
    };
    if (TEXT_LABEL_CONFIG.getJSON) {
      const json = TEXT_LABEL_CONFIG.getJSON(sampleJson);
      expect(json).toEqual({
        fieldName: 'label'
      });
    }
  });
});
