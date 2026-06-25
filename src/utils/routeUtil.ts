import { ISummaryCardProps } from '../components/summaryCard/SummaryCard';

/**
 *
 * This method used for go to specific application based on url
 *
 * @param {string} url The URL used for go to specific website.
 */
export const goToUrl = (url: string = '/', locationRef: Pick<Location, 'replace'> = globalThis.location) => {
  locationRef.replace(url);
};

const normalizeRegionLabel = (value?: string): string => value?.trim().toLowerCase() ?? '';

export const findMatchingRegionCard = (
  regions: ISummaryCardProps[],
  userCountry?: {
    id?: string | number;
    tenantId?: string | number;
    name?: string;
  }
): ISummaryCardProps | undefined => {
  if (!regions.length || !userCountry) {
    return;
  }

  const criteria = {
    id: userCountry.id?.toString(),
    tenantId: userCountry.tenantId?.toString(),
    name: normalizeRegionLabel(userCountry.name),
  };

  if (!criteria.id && !criteria.tenantId && !criteria.name) {
    return;
  }

  return regions.find(
    ({ formId, tenantId, title }) =>
      (!criteria.id || String(formId) === criteria.id) &&
      (!criteria.tenantId || String(tenantId) === criteria.tenantId) &&
      (!criteria.name || normalizeRegionLabel(title) === criteria.name)
  );
};
