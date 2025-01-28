import React, { useState, useEffect, useCallback } from 'react';
import styles from './Pagination.module.scss';
import Select from 'react-select';
import APPCONSTANTS from '../../constants/appConstants';
import PaginationInput from './PaginationInput';

interface IAnchorProps {
  content: string | number;
  onClick: () => void;
  className: string;
}

/**
 * Anchor component
 * Renders an anchor element
 * @param {IAnchorProps} props - Component props
 * @returns {React.ReactElement} The rendered Anchor component
 */
const Anchor: React.FC<IAnchorProps> = ({ content, onClick, className }: IAnchorProps): React.ReactElement => (
  <li role='presentation' data-testid='anchor' className={className} onClick={onClick}>
    <div className={styles.paginationButton}>{content}</div>
  </li>
);

interface IPaginationProps {
  length: number;
  total: number;
  onChangePage: (page: number, rowsPerPage: number) => void;
  initialPage: number;
  currentPage: number;
  onChangeRowsPerPage: (rowsPerPage: number) => void;
}

interface IPaginationState {
  pages: Array<number | string>;
  totalPages: number;
  currentPage: number;
}

/**
 *
 * @param {number} totalItems - The total number of items
 * @param {number} pageSize - The page size
 * @param {number} currentPage - The current page
 * @returns {IPaginationState} The pager
 */
const getPager = (totalItems: number, pageSize: number, currentPage: number = 1) => {
  const paginationRange = APPCONSTANTS.PAGINATION_RANGE;
  const pages: Array<number | string> = [];
  const totalPages = Math.ceil(totalItems / pageSize);
  const halfWay = Math.ceil(paginationRange / 2);
  let position: 'start' | 'middle' | 'end';

  if (currentPage <= halfWay) {
    position = 'start';
  } else if (totalPages - halfWay < currentPage) {
    position = 'end';
  } else {
    position = 'middle';
  }

  const ellipsesNeeded = paginationRange < totalPages;
  let i = 1;
  while (i <= totalPages && i <= paginationRange) {
    const pageNumber = calculatePageNumber(i, currentPage, paginationRange, totalPages);
    const openingEllipsesNeeded = i === 2 && (position === 'middle' || position === 'end');
    const closingEllipsesNeeded = i === paginationRange - 1 && (position === 'middle' || position === 'start');

    if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
      pages.push('...');
    } else {
      pages.push(pageNumber);
    }
    i++;
  }
  return { pages };
};

/**
 * Calculates the page number
 * @param {number} i - The index
 * @param {number} currentPage - The current page
 * @param {number} paginationRange - The pagination range
 * @param {number} totalPages - The total number of pages
 * @returns {number} The page number
 */
const calculatePageNumber = (i: number, currentPage: number, paginationRange: number, totalPages: number): number => {
  const halfWay = Math.ceil(APPCONSTANTS.PAGINATION_RANGE / 2);
  if (i === paginationRange) {
    return totalPages;
  } else if (i === 1) {
    return i;
  } else if (paginationRange < totalPages) {
    if (totalPages - halfWay < currentPage) {
      return totalPages - paginationRange + i;
    } else if (halfWay < currentPage) {
      return currentPage - halfWay + i;
    } else {
      return i;
    }
  } else {
    return i;
  }
};

/**
 * Pagination component
 * @param {IPaginationProps} props - Component props
 * @returns {React.ReactElement} The rendered Pagination component
 */
const Pagination: React.FC<IPaginationProps> = ({
  length,
  total,
  onChangePage,
  initialPage,
  currentPage: propCurrentPage,
  onChangeRowsPerPage
}) => {
  const [state, setState] = useState<IPaginationState>({
    pages: getPager(total, length, propCurrentPage).pages || [],
    totalPages: Math.ceil(total / length),
    currentPage: initialPage
  });

  /**
   * Updates the state from props
   */
  const updateStateFromProps = useCallback(() => {
    const totalPages = Math.ceil(total / length);
    if (state.totalPages !== totalPages || state.currentPage !== propCurrentPage) {
      const pager = getPager(total, length, propCurrentPage);
      setState({
        pages: pager.pages,
        totalPages,
        currentPage: propCurrentPage
      });
    }
  }, [total, length, state, propCurrentPage]);

  /**
   * Updates the state from props
   */
  useEffect(() => {
    updateStateFromProps();
  }, [updateStateFromProps]);

  /**
   * Sets the page
   * @param {number} newPage - The new page
   */
  const setPage = (newPage: number) => {
    if (newPage < 1 || newPage > state.totalPages || newPage === state.currentPage) {
      return;
    }
    const pager = getPager(total, length, newPage);
    setState((prevState) => ({
      ...prevState,
      pages: pager.pages,
      currentPage: newPage
    }));
    onChangePage(newPage, length);
  };

  /**
   * Renders the anchor
   * @param {string | number} page - The page
   * @param {number} index - The index
   * @returns {React.ReactElement} The rendered anchor
   */
  const renderAnchor = (page: string | number, index: number): React.ReactElement => {
    const { currentPage } = state;
    if (page === '...') {
      return (
        <Anchor
          key={index}
          content={page}
          className={styles.cursorNotAllowed}
          /* tslint:disable:no-empty */
          onClick={() => {}}
        />
      );
    }
    return (
      <Anchor
        key={index}
        content={page}
        onClick={() => setPage(page as number)}
        className={currentPage === page ? styles.active : ''}
      />
    );
  };

  /**
   * Render Pagination Anchors
   * @returns {any[]}
   */
  const renderAnchors = (): any[] => state.pages.map(renderAnchor);

  const handleRowsPerPageChange = (selectedOption: { value: number }) => {
    onChangeRowsPerPage(selectedOption.value);
  };

  const isFirstPage = state.currentPage === 1;
  const isEndPage = state.currentPage === state.totalPages;
  const paginationLengthOptions = [
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 }
  ];
  const currentOption = paginationLengthOptions.find((option) => option.value === length);

  return (
    <div className={`${styles.pagination} d-flex justify-content-between`}>
      <div className='d-none d-md-flex align-items-center me-1'>
        <span className='d-none d-lg-flex pr-4 me-1'>Rows per page</span>
        <div className={styles.selectEl}>
          <Select
            aria-label='Rows per page'
            menuPlacement='top'
            className='pagination-select me-1 w-100'
            classNamePrefix='select-field'
            value={currentOption}
            options={paginationLengthOptions}
            onChange={handleRowsPerPageChange as any}
          />
        </div>
      </div>
      <div className={styles.paginationWrapper}>
        <div className={`${styles.count} text-nowrap me-1`}>
          {` ${isFirstPage ? 1 : (state.currentPage - 1) * length + 1} - ${
            isEndPage ? total : state.currentPage * length
          } of ${total}`}
        </div>
        <div className='d-flex align-items-center mx-1'>
          <PaginationInput
            onPagination={(page) => setPage(page)}
            maxNumber={state.totalPages}
            type='text'
            placeholder='#page'
          />
        </div>
        <ul className='m-0 ps-1 text-nowrap'>
          <li>
            <div
              data-testid='firstPage'
              className={`${styles.paginationButton} ${isFirstPage ? styles.disabled : ''}`}
              onClick={() => !isFirstPage && setPage(1)}
            >
              «
            </div>
          </li>
          <li>
            <div
              data-testid='prevPage'
              className={`${styles.paginationButton} ${isFirstPage ? styles.disabled : ''}`}
              onClick={() => !isFirstPage && setPage(state.currentPage - 1)}
            >
              ‹
            </div>
          </li>
          {renderAnchors()}
          <li>
            <div
              className={`${styles.paginationButton} ${isEndPage ? styles.disabled : ''}`}
              onClick={() => !isEndPage && setPage(state.currentPage + 1)}
            >
              ›
            </div>
          </li>
          <li>
            <div
              data-testid='lastPage'
              className={`${styles.paginationButton} ${isEndPage ? styles.disabled : ''}`}
              onClick={() => !isEndPage && setPage(state.totalPages)}
            >
              »
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Pagination;
