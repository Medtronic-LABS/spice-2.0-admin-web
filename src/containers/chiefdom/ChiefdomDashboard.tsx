import { Link } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../../components/loader/Loader';
import Searchbar from '../../components/searchbar/Searchbar';
import SummaryCard, { ISummaryCardProps } from '../../components/summaryCard/SummaryCard';
import APPCONSTANTS from '../../constants/appConstants';
import { useLoadMorePagination } from '../../hooks/pagination';
import { PROTECTED_ROUTES } from '../../constants/route';
import { appendZeroBefore, formatUserToastMsg } from '../../utils/commonUtils';
import {
  getChiefdomDetailSelector,
  chiefdomCountSelector,
  chiefdomDashboardListSelector,
  chiefdomLoadingMoreSelector,
  chiefdomLoadingSelector
} from '../../store/chiefdom/selectors';
import { IChiefdomSummary } from '../../store/chiefdom/types';
import {
  fetchChiefdomDashboardListRequest,
  fetchChiefdomDetail,
  clearChiefdomDetail,
  setChiefdomDetails
} from '../../store/chiefdom/actions';
import { countryIdSelector, formDataIdSelector, tenantIdSelector } from '../../store/user/selectors';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';

import styles from './Chiefdom.module.scss';
import sessionStorageServices from '../../global/sessionStorageServices';
import { clearSideMenu } from '../../store/common/actions';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';

/**
 * Chiefdom Dashboard component
 */
const ChiefdomDashboard = () => {
  const dispatch = useDispatch();
  const chiefdomDashboardList = useSelector(chiefdomDashboardListSelector);
  const chiefdomCount = useSelector(chiefdomCountSelector);
  const loading = useSelector(chiefdomLoadingSelector);
  const loadingMore = useSelector(chiefdomLoadingMoreSelector);
  const chiefdomDetail = useSelector(getChiefdomDetailSelector);
  const countryId = useSelector(countryIdSelector);
  const {
    chiefdom: { s: chiefdomSName, p: chiefdomPName },
    healthFacility: { s: healthFacilitySName }
  } = useAppTypeConfigs();

  /**
   * Custom hook for handling load-more pagination.
   *
   * @param {Object} options - The options for configuring pagination
   * @param {number} options.total - The total number of items available for pagination
   * @param {number} options.itemsPerPage - The number of items to load per page
   * @param {Function} options.onLoadMore - Callback function to be called when loading more items
   * @param {Object} options.onLoadMore.params - The parameters passed to the onLoadMore callback
   * @param {number} options.onLoadMore.params.skip - The number of items to skip
   * @param {number} options.onLoadMore.params.limit - The number of items to load in the current page
   * @param {Function} options.onLoadMore.params.onFail - Callback function to handle failure during the data fetch
   *
   * @returns {Object} - Returns an object containing `isLastPage`, `loadMore`, and `resetPage`
   * @returns {boolean} isLastPage - Indicates if the current page is the last page of the pagination
   * @returns {Function} loadMore - Function to trigger loading the next page of items
   * @returns {Function} resetPage - Function to reset the pagination to the first page
   */
  const { isLastPage, loadMore, resetPage } = useLoadMorePagination({
    total: chiefdomCount,
    itemsPerPage: APPCONSTANTS.CHIEFDOM_PER_PAGE,
    onLoadMore: ({ skip, limit, onFail }) => {
      dispatch(
        fetchChiefdomDashboardListRequest({
          skip,
          limit,
          isLoadMore: true,
          failureCb: (e) => {
            onFail();
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.CHIEFDOM_FETCH_ERROR, chiefdomSName)
              )
            );
          }
        })
      );
    }
  });

  /**
   * useEffect for fetching chiefdom list for dashboard
   */

  useEffect(() => {
    dispatch(
      fetchChiefdomDashboardListRequest({
        skip: 0,
        limit: APPCONSTANTS.CHIEFDOM_PER_PAGE,
        failureCb: (e) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.CHIEFDOM_FETCH_ERROR, chiefdomSName)
            )
          )
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  /**
   * To clear sidemenu
   */
  useEffect(() => {
    dispatch(clearSideMenu());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * To clear cache and set current Chiefdom details
   */
  const onDashboardExit = useCallback(
    (id: string, tenantId: string, name: string) => {
      dispatch(clearChiefdomDetail());
      dispatch(setChiefdomDetails({ id, name, tenantId }));
      sessionStorageServices.setItem(APPCONSTANTS.COUNTRY_ID, countryId?.id);
    },
    [dispatch, countryId]
  );

  const searchText = useRef<string>('');
  /**
   * Handler function for search bar input
   * @param {string} searchTerm
   */
  const onSearch = useCallback(
    (search: string) => {
      searchText.current = search;
      dispatch(
        fetchChiefdomDashboardListRequest({
          skip: 0,
          limit: APPCONSTANTS.CHIEFDOM_PER_PAGE,
          search,
          successCb: () => resetPage(),
          failureCb: (e) =>
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.CHIEFDOM_FETCH_ERROR, chiefdomSName)
              )
            )
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, resetPage]
  );

  /**
   * useMemo hook to parse chiefdom dashboard data and map it to ISummaryCardProps[] format.
   *
   * @param {IChiefdomSummary[]} chiefdomDashboardList - The list of chiefdom summaries with details for each chiefdom.
   * @param {Function} onDashboardExit - Callback function to be invoked when exiting the dashboard.
   * @param {Object} chiefdomDetail - The current chiefdom details object.
   * @param {string | number} chiefdomDetail.id - The ID of the currently selected chiefdom.
   * @param {Function} dispatch - The dispatch function to trigger Redux actions.
   *
   * @returns {ISummaryCardProps[]} - Returns an array of summary card props with title, routes, and data.
   */
  const parsedData: ISummaryCardProps[] = useMemo(
    () =>
      chiefdomDashboardList?.map(({ healthFacilityCount, name, id, tenantId }: IChiefdomSummary) => ({
        title: name,
        detailRoute: PROTECTED_ROUTES.chiefdomSummary.replace(':chiefdomId', id).replace(':tenantId', tenantId),
        setBreadcrumbDetails: () => onDashboardExit(id, tenantId, name),
        data: [
          {
            type: 'number',
            value: Number(healthFacilityCount) ? appendZeroBefore(healthFacilityCount, 2) : '-',
            label: healthFacilitySName,
            disableEllipsis: true,
            route: PROTECTED_ROUTES.healthFacilityByChiefdom.replace(':chiefdomId', id).replace(':tenantId', tenantId),
            onClick: () => {
              if (!chiefdomDetail.id || chiefdomDetail.id !== id) {
                onDashboardExit(id, tenantId, name);
                dispatch(
                  fetchChiefdomDetail({
                    tenantId,
                    id
                  })
                );
              }
            }
          }
        ]
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chiefdomDashboardList, onDashboardExit, chiefdomDetail.id, dispatch]
  );

  const noChiefdomsAvailable = !(searchText.current || parsedData?.length);
  const noSearchResultAvailable = Boolean(searchText.current && !parsedData?.length);

  const districtId = useSelector(formDataIdSelector);
  const districtTentantId = useSelector(tenantIdSelector);
  const createChiefdomRoute = PROTECTED_ROUTES.createChiefdomByDistrict
    .replace(':districtId', districtId)
    .replace(':tenantId', districtTentantId);
  const loaderWrapperClass = loadingMore
    ? `${styles.loaderWrapper} d-flex align-items-center justify-content-center mt-2dot5`
    : '';
  return (
    <div className='py-1dot5'>
      <div className='row'>
        <div
          className={`col-12 mb-1dot25 d-flex align-items-sm-center align-items-start flex-sm-row flex-column ${styles.header}`}
        >
          <h4 className='page-title mb-sm-0 mb-0dot5'>{chiefdomPName}</h4>
          {!noChiefdomsAvailable && (
            <>
              <span className='ms-sm-auto mb-sm-0 mb-1'>
                <Searchbar placeholder={`Search ${chiefdomSName}`} onSearch={onSearch} isOutlined={false} />
              </span>
              <Link to={createChiefdomRoute} className='ms-sm-1dot5' tabIndex={-1}>
                <button className='btn primary-btn'>Create {chiefdomSName}</button>
              </Link>
            </>
          )}
        </div>
        <div className='col-12'>
          <div className='row gx-1dot25 gy-1dot25'>
            {parsedData?.map((summaryProps: ISummaryCardProps, i: number) => (
              <div key={`chiefdom${i}`} className='col-lg-4 col-md-6 col-12 mx-md-0 mx-auto'>
                <SummaryCard disableImg={true} titleClassName={styles.ouSummaryTitle} {...summaryProps} />
              </div>
            ))}
          </div>
        </div>
        {noChiefdomsAvailable && !loading && (
          <div className={`col-12 text-center mt-1 py-3dot75 ${styles.noData}`}>
            <div className='fw-bold highlight-text'>Let's Get Started!</div>
            <div className='subtle-color fs-0dot875 lh-1dot25 mb-1'>Create an {chiefdomSName.toLowerCase()}</div>
            <Link to={createChiefdomRoute} className='mx-auto' tabIndex={-1}>
              <button className='btn primary-btn'>Create {chiefdomSName}</button>
            </Link>
          </div>
        )}
        {noSearchResultAvailable && (
          <div className={`col-12 text-center mt-1 py-3dot75 ${styles.noData}`}>
            <div className='fw-bold highlight-text'>No {chiefdomPName.toLowerCase()} available</div>
            <div className='subtle-color fs-0dot875 lh-1dot25 mb-1'>Try changing the search keyword</div>
          </div>
        )}
        {!isLastPage && !loadingMore && (
          <div className='col-12 text-center mt-2dot5'>
            <button className='btn load-more-btn pointer' onClick={loadMore}>
              Load More<b className='ls-2px ms-0dot125'>...</b>
            </button>
          </div>
        )}
        {loadingMore || loading ? (
          <div className={loaderWrapperClass}>
            <Loader isFullScreen={!loadingMore} className='translate-x-minus50' />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChiefdomDashboard;
