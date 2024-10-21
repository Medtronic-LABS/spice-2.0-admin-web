import { useState } from 'react';

import APPCONSTANTS from '../constants/appConstants';

interface IListParamsState {
  page: number;
  rowsPerPage: number;
  searchTerm: string;
}
/**
 * Custom hook to manage table pagination and search functionality.
 */
export const useTablePaginationHook = () => {
  const [listParams, setListReqParams] = useState<IListParamsState>({
    page: APPCONSTANTS.INITIAL_PAGE,
    rowsPerPage: APPCONSTANTS.ROWS_PER_PAGE_OF_TABLE,
    searchTerm: ''
  });

  /**
   * Handles the search functionality by updating the search term and resetting the page to 1.
   * @param {string} searchString - The search string to be applied
   */
  const handleSearch = (searchString: string) => {
    setListReqParams((prevstate) => ({
      ...prevstate,
      page: 1,
      searchTerm: searchString
    }));
  };

  /**
   * Handles the pagination functionality by updating the page number and rows per page.
   * @param {number} pageNo - The page number to be set
   * @param {number} [rowsPerPage]
   * - The number of rows per page to be set (default is APPCONSTANTS.ROWS_PER_PAGE_OF_TABLE)
   */
  const handlePage = (pageNo: number, rowsPerPage: number | undefined = APPCONSTANTS.ROWS_PER_PAGE_OF_TABLE) => {
    setListReqParams((prevstate) => ({
      ...prevstate,
      page: pageNo,
      rowsPerPage
    }));
  };

  return { listParams, handleSearch, handlePage };
};
