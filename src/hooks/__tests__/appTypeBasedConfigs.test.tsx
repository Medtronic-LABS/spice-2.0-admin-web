import { renderHook } from '@testing-library/react';
import { useSelector } from 'react-redux';
import useAppTypeConfigs from '../appTypeBasedConfigs';
import { APP_TYPE } from '../../constants/appConstants';

jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}));

jest.mock('../../store/user/selectors', () => ({
  countryIdSelector: jest.fn((state) => state?.userCountry),
  getAppTypeSelector: jest.fn((state) => state?.appTypesFromUser)
}));

jest.mock('../../store/common/selectors', () => ({
  labelNameSelector: jest.fn((state) => state?.labelNamesFromStore)
}));

describe('useAppTypeConfigs', () => {
  const mockUseSelector = useSelector as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    // Default: useSelector is called 3 times (getAppTypeSelector, countryIdSelector, labelNameSelector)
    // We pass a mock implementation that returns based on call order
    mockUseSelector.mockImplementation((selector: (state: any) => any) => {
      const mockState = {
        appTypesFromUser: undefined,
        userCountry: undefined,
        labelNamesFromStore: undefined
      };
      return selector(mockState);
    });
  });

  const setupSelectors = ({
    appTypesFromUser,
    userCountry,
    labelNamesFromStore
  }: {
    appTypesFromUser?: string[];
    userCountry?: { appTypes?: string[] };
    labelNamesFromStore?: Record<string, unknown>;
  }) => {
    mockUseSelector.mockImplementation((selector: (state: any) => any) => {
      const state = {
        appTypesFromUser: appTypesFromUser ?? undefined,
        userCountry: userCountry ?? undefined,
        labelNamesFromStore: labelNamesFromStore ?? undefined
      };
      return selector(state);
    });
  };

  it('should return COMMUNITY config when appTypes from user is [COMMUNITY]', () => {
    setupSelectors({ appTypesFromUser: [APP_TYPE.COMMUNITY] });

    const { result } = renderHook(() => useAppTypeConfigs());

    expect(result.current.isCommunity).toBe(true);
    expect(result.current.appTypes).toEqual([APP_TYPE.COMMUNITY]);
    expect(result.current.district).toEqual({ s: 'District', p: 'Districts' });
    expect(result.current.chiefdom).toEqual({ s: 'Chiefdom', p: 'Chiefdoms' });
    expect(result.current.village).toEqual({ s: 'Village', p: 'Villages' });
    expect(result.current.subVillage).toEqual({ s: 'Sub Village', p: 'Sub Villages' });
    expect(result.current.GENDER_OPTIONS).toHaveLength(3);
    expect(result.current.hfDetails.map.available).toBe(true);
    expect(result.current.user.dhisId.available).toBe(true);
  });

  it('should return NON_COMMUNITY config when appTypes from user includes NON_COMMUNITY', () => {
    setupSelectors({ appTypesFromUser: [APP_TYPE.NON_COMMUNITY] });

    const { result } = renderHook(() => useAppTypeConfigs());

    expect(result.current.isCommunity).toBe(false);
    expect(result.current.appTypes).toEqual([APP_TYPE.NON_COMMUNITY]);
    expect(result.current.district).toEqual({ s: 'County', p: 'Counties' });
    expect(result.current.chiefdom).toEqual({ s: 'Sub County', p: 'Sub Counties' });
    expect(result.current.village).toEqual({ s: 'Village', p: 'Villages' });
    expect(result.current.subVillage).toEqual({ s: 'Sub Village', p: 'Sub Villages' });
    expect(result.current.GENDER_OPTIONS).toHaveLength(2);
    expect(result.current.hfDetails.map.available).toBe(false);
    expect(result.current.user.dhisId.available).toBe(false);
  });

  it('should prefer NON_COMMUNITY when both COMMUNITY and NON_COMMUNITY are in appTypes', () => {
    setupSelectors({
      appTypesFromUser: [APP_TYPE.COMMUNITY, APP_TYPE.NON_COMMUNITY]
    });

    const { result } = renderHook(() => useAppTypeConfigs());

    expect(result.current.isCommunity).toBe(false);
    expect(result.current.district).toEqual({ s: 'County', p: 'Counties' });
    expect(result.current.chiefdom).toEqual({ s: 'Sub County', p: 'Sub Counties' });
    expect(result.current.subVillage).toEqual({ s: 'Sub Village', p: 'Sub Villages' });
  });

  it('should use country appTypes when user appTypes is empty and country has appTypes', () => {
    setupSelectors({
      appTypesFromUser: [],
      userCountry: { appTypes: [APP_TYPE.NON_COMMUNITY] }
    });

    const { result } = renderHook(() => useAppTypeConfigs());

    expect(result.current.appTypes).toEqual([APP_TYPE.NON_COMMUNITY]);
    expect(result.current.isCommunity).toBe(false);
  });

  it('should apply noAppTypes overrides (reduced GENDER_OPTIONS) when appTypes is empty', () => {
    setupSelectors({
      appTypesFromUser: [],
      userCountry: undefined
    });

    const { result } = renderHook(() => useAppTypeConfigs());

    expect(result.current.appTypes).toEqual([]);
    expect(result.current.GENDER_OPTIONS).toHaveLength(2);
    expect(result.current.isCommunity).toBe(true);
    expect(result.current.subVillage).toEqual({ s: 'Sub Village', p: 'Sub Villages' });
  });

  it('should use labelNamesFromStore when display values are present', () => {
    const customLabels = {
      region: { s: 'Custom Region', p: 'Custom Regions' },
      district: { s: 'Custom District', p: 'Custom Districts' },
      chiefdom: { s: 'Custom Chiefdom', p: 'Custom Chiefdoms' },
      healthFacility: { s: 'Custom HF', p: 'Custom HFs' },
      village: { s: 'Custom Village', p: 'Custom Villages' },
      subVillage: { s: 'Custom Subvillage', p: 'Custom Subvillages' }
    };
    setupSelectors({
      appTypesFromUser: [APP_TYPE.COMMUNITY],
      labelNamesFromStore: customLabels
    });

    const { result } = renderHook(() => useAppTypeConfigs());

    expect(result.current.region).toEqual(customLabels.region);
    expect(result.current.district).toEqual(customLabels.district);
    expect(result.current.chiefdom).toEqual(customLabels.chiefdom);
    expect(result.current.healthFacility).toEqual(customLabels.healthFacility);
    expect(result.current.village).toEqual(customLabels.village);
    expect(result.current.subVillage).toEqual(customLabels.subVillage);
  });

  it('should return COMMUNITY hfDetails when appTypes is COMMUNITY only', () => {
    setupSelectors({ appTypesFromUser: [APP_TYPE.COMMUNITY] });

    const { result } = renderHook(() => useAppTypeConfigs());

    expect(result.current.hfDetails.linkedVillages.required).toBe(true);
    expect(result.current.hfDetails.city.isRequired).toBe(true);
    expect(result.current.hfDetails.city.isCityVillage).toBe(true);
    expect(result.current.hfDetails.map.available).toBe(true);
  });

  it('should return NON_COMMUNITY hfDetails when appTypes includes NON_COMMUNITY', () => {
    setupSelectors({ appTypesFromUser: [APP_TYPE.NON_COMMUNITY] });

    const { result } = renderHook(() => useAppTypeConfigs());

    expect(result.current.hfDetails.linkedVillages.required).toBe(false);
    expect(result.current.hfDetails.city.isRequired).toBe(false);
    expect(result.current.hfDetails.city.isCityVillage).toBe(false);
    expect(result.current.hfDetails.map.available).toBe(false);
  });

  it('should include userList and medication config', () => {
    setupSelectors({ appTypesFromUser: [APP_TYPE.COMMUNITY] });

    const { result } = renderHook(() => useAppTypeConfigs());

    expect(result.current.userList.filters.available).toBe(true);
    expect(result.current.userList.activeToogle.available).toBe(true);
    expect(result.current.medication.categories.available).toBe(true);
    expect(result.current.medication.categories.isMandatory).toBe(false);
  });

  it('should include NON_COMMUNITY userList and medication when appTypes is NON_COMMUNITY', () => {
    setupSelectors({ appTypesFromUser: [APP_TYPE.NON_COMMUNITY] });

    const { result } = renderHook(() => useAppTypeConfigs());

    expect(result.current.userList.activeToogle.available).toBe(false);
    expect(result.current.medication.categories.isMandatory).toBe(true);
  });

  it('should return subVillage label for both COMMUNITY and NON_COMMUNITY configs', () => {
    const expectedSubvillage = { s: 'Sub Village', p: 'Sub Villages' };

    setupSelectors({ appTypesFromUser: [APP_TYPE.COMMUNITY] });
    const { result: communityResult } = renderHook(() => useAppTypeConfigs());
    expect(communityResult.current.subVillage).toEqual(expectedSubvillage);

    setupSelectors({ appTypesFromUser: [APP_TYPE.NON_COMMUNITY] });
    const { result: nonCommunityResult } = renderHook(() => useAppTypeConfigs());
    expect(nonCommunityResult.current.subVillage).toEqual(expectedSubvillage);
  });
});
