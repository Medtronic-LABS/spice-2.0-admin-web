import { IRequestQuery } from '../typings/global';

interface IUrl {
  resource: string;
  query: IRequestQuery;
}

/**
 * Adds limit and pagination parameters to the URL
 * @param {any} urlOptions - The object containing URL construction options
 * @param {any} limit - The limit value for pagination
 * @param {number} [pageNo] - The page number for pagination
 */
const limitParamsFn = (urlOptions: any, limit: any, pageNo?: number) => {
  if (limit) {
    if (limit === 'all') {
      urlOptions.url += `${urlOptions.paramAdded ? '&' : '?'}$limit=null`;
      urlOptions.paramAdded = true;
    }
    if (limit !== 'all' && typeof limit === 'number') {
      urlOptions.url += `${urlOptions.paramAdded ? '&' : '?'}$limit=${limit}&$skip=${pageNo ? limit * pageNo : 0}`;
      urlOptions.paramAdded = true;
    }
  }
};

/**
 * Adds sorting parameters to the URL
 * @param {any} urlOptions - The object containing URL construction options
 * @param {any} sortField - The field to sort by
 * @param {any} sortOrder - The order of sorting (ascending or descending)
 */
const sortParamsFn = (urlOptions: any, sortField: any, sortOrder: any) => {
  if (sortOrder && sortField) {
    urlOptions.url += `${urlOptions.paramAdded ? '&' : '?'}$sort[${sortField}]=${sortOrder}`;
    urlOptions.paramAdded = true;
  }
};

/**
 * Adds search parameters to the URL
 * @param {any} urlOptions - The object containing URL construction options
 * @param {any} search - The search criteria
 */
const searchParamsFn = (urlOptions: any, search: any) => {
  if (search && search.length) {
    for (let idx = 0; idx < search.length; idx++) {
      urlOptions.url += `${urlOptions.paramAdded ? '&' : '?'}$or[${idx}][${search[idx].field}][$search]=${
        search[idx].value
      }`;
      urlOptions.paramAdded = true;
    }
  }
};

/**
 * Adds core filter parameters to the URL
 * @param {any} urlOptions - The object containing URL construction options
 * @param {any} coreFilters - The core filters to be applied
 */
const coreFilterParamsFn = (urlOptions: any, coreFilters: any) => {
  if (coreFilters) {
    urlOptions.url += `${urlOptions.paramAdded ? '&' : '?'}$or[${0}][${coreFilters.field}]`;
    const filterValues = coreFilters.value;
    for (let idx = 0; idx < filterValues.length; idx++) {
      urlOptions.url += `[$in]=${coreFilters.value[idx]}`;
      urlOptions.paramAdded = true;
    }
  }
};

/**
 * Adds additional filter parameters to the URL
 * @param {any} urlOptions - The object containing URL construction options
 * @param {any} filters - The additional filters to be applied
 */
const filterParamsFn = (urlOptions: any, filters: any) => {
  if (filters) {
    urlOptions.url += `${urlOptions.paramAdded ? '&' : '?'}${filters}`;
    urlOptions.paramAdded = true;
  }
};

/**
 * Constructs a URL with query parameters based on the provided request URL and query options
 * @param {IUrl} requestUrl - The request URL object containing resource and query information
 * @returns {string} The constructed URL with query parameters
 */
export const constructUrl = (requestUrl: IUrl) => {
  const { resource, query } = requestUrl;
  const { pageNo, limit, sortField, sortOrder, filters, search, coreFilters } = query;
  const urlOptions = { url: `${resource}`, paramAdded: false };

  limitParamsFn(urlOptions, limit, pageNo);
  sortParamsFn(urlOptions, sortField, sortOrder);
  searchParamsFn(urlOptions, search);
  coreFilterParamsFn(urlOptions, coreFilters);
  filterParamsFn(urlOptions, filters);

  return urlOptions.url;
};
