import { ISummaryCardProps } from '../../components/summaryCard/SummaryCard';
import { findMatchingRegionCard, goToUrl } from '../routeUtil';

describe('goToUrl', () => {
  const replaceSpy = jest.fn();
  const locationRef = { replace: replaceSpy };

  beforeEach(() => {
    replaceSpy.mockClear();
  });

  it('should call window.location.replace with the provided URL', () => {
    const url = 'https://example.com';
    goToUrl(url, locationRef);
    expect(replaceSpy).toHaveBeenCalledWith(url);
  });

  it('should default to "/" if no URL is provided', () => {
    goToUrl(undefined, locationRef);
    expect(replaceSpy).toHaveBeenCalledWith('/');
  });
});

describe('findMatchingRegionCard', () => {
  const regionCards: ISummaryCardProps[] = [
    {
      title: 'Region A',
      formId: '1',
      tenantId: '101',
      detailRoute: '/region/1/101/summary',
      setBreadcrumbDetails: jest.fn(),
      data: []
    },
    {
      title: 'Region B',
      formId: '2',
      tenantId: '102',
      detailRoute: '/region/2/102/summary',
      setBreadcrumbDetails: jest.fn(),
      data: []
    }
  ];

  it('matches when only country id is provided', () => {
    expect(findMatchingRegionCard(regionCards, { id: 1 })?.formId).toBe('1');
  });

  it('matches when only tenant id is provided', () => {
    expect(findMatchingRegionCard(regionCards, { tenantId: '102' })?.formId).toBe('2');
  });

  it('matches when only normalized country name is provided', () => {
    expect(findMatchingRegionCard(regionCards, { name: 'region a' })?.formId).toBe('1');
  });

  it('matches when id, tenantId, and name all match', () => {
    expect(
      findMatchingRegionCard(regionCards, { id: '1', tenantId: '101', name: 'region a' })?.formId
    ).toBe('1');
  });

  it('returns undefined when id matches but name does not', () => {
    expect(findMatchingRegionCard(regionCards, { id: '1', name: 'Region B' })).toBeUndefined();
  });

  it('returns undefined when no region matches', () => {
    expect(findMatchingRegionCard(regionCards, { name: 'Unknown Region' })).toBeUndefined();
  });
});
