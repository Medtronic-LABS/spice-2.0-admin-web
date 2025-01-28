import { Link } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../../components/loader/Loader';
import Searchbar from '../../components/searchbar/Searchbar';
import SummaryCard, { ISummaryCardProps } from '../../components/summaryCard/SummaryCard';
import APPCONSTANTS from '../../constants/appConstants';
import { useLoadMorePagination } from '../../hooks/pagination';
import { PROTECTED_ROUTES } from '../../constants/route';
import { IHFDashboard } from '../../store/healthFacility/types';
import {
  hfDashboardListSelector,
  healthFacilityListTotalSelector,
  healthFacilityLoadingSelector,
  hfLoadingMoreSelector
} from '../../store/healthFacility/selectors';
import { formDataIdSelector, roleSelector, tenantIdSelector, countryIdSelector } from '../../store/user/selectors';
import ERRORS from '../../constants/errors';
import toastCenter from '../../utils/toastCenter';

import styles from './HealthFacility.module.scss';
import { clearHFSummary, fetchHFDashboardListRequest, setHFSummary } from '../../store/healthFacility/actions';
import { clearSideMenu } from '../../store/common/actions';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import { formatUserToastMsg } from '../../utils/commonUtils';

/**
 * HealthFacilityDashboard component
 * Displays a dashboard of health facilities details list with search functionality
 * @returns {React.ReactElement} The rendered HealthFacilityDashboard component
 */
const HealthFacilityDashboard = (): React.ReactElement => {
  const dispatch = useDispatch();
  const hfDashboardList = useSelector(hfDashboardListSelector);
  const hfCount = useSelector(healthFacilityListTotalSelector);
  const loading = useSelector(healthFacilityLoadingSelector);
  const loadingMore = useSelector(hfLoadingMoreSelector);
  const currentRole = useSelector(roleSelector);
  const searchText = useRef<string>('');
  const chiefdomId = useSelector(formDataIdSelector);
  const loggedInUsertenantId = useSelector(tenantIdSelector);
  const countryId = useSelector(countryIdSelector)?.id;
  const {
    healthFacility: { s: healthFacilitySName, p: healthFacilityPName }
  } = useAppTypeConfigs();

  /**
   * Fetches health facility dashboard details
   * @param {number} skip - Number of items to skip
   * @param {number | null} limit - Number of items to fetch
   * @param {string} [searchString] - Search string for filtering results
   * @param {boolean} [isLoadMore] - Flag indicating if this is a load more request
   * @param {Function} [successCb] - Callback function to be called on successful fetch
   */
  const fetchDetails = useCallback(
    (
      skip: number,
      limit: number | null,
      searchString: string = searchText.current,
      isLoadMore: boolean = false,
      successCb?: any
    ) => {
      dispatch(
        fetchHFDashboardListRequest({
          skip,
          limit,
          searchTerm: searchString,
          isLoadMore,
          countryId,
          successCb,
          failureCb: (e) => {
            if (e.message === ERRORS.NETWORK_ERROR.message) {
              toastCenter.error(APPCONSTANTS.NETWORK_ERROR, APPCONSTANTS.CONNECTION_LOST);
            } else {
              toastCenter.error(
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_LIST_FETCH_ERROR, healthFacilityPName)
              );
            }
          }
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [countryId, dispatch]
  );

  const { isLastPage, loadMore, resetPage } = useLoadMorePagination({
    total: hfCount,
    itemsPerPage: APPCONSTANTS.HF_PER_PAGE,
    onLoadMore: ({ skip, limit }) => {
      fetchDetails(skip, limit, searchText.current, true, currentRole);
    }
  });

  /**
   * Clears sidemenu on component mount
   */
  useEffect(() => {
    dispatch(clearSideMenu());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Fetches initial health facility data on component mount
   */
  useEffect(() => {
    fetchDetails(0, APPCONSTANTS.HF_PER_PAGE);
  }, [dispatch, fetchDetails]);

  /**
   * Handles search functionality
   * @param {string} search - Search string
   */
  const onSearch = useCallback(
    (search: string) => {
      searchText.current = search;
      fetchDetails(0, APPCONSTANTS.HF_PER_PAGE, search, false, resetPage);
    },
    [fetchDetails, resetPage]
  );

  /**
   * Parses health facility data for SummaryCard components
   * @returns {ISummaryCardProps[]} Array of parsed data for SummaryCard components
   */
  const parsedData: ISummaryCardProps[] = useMemo(
    () =>
      hfDashboardList.map(({ name, id, type, tenantId }: IHFDashboard) => ({
        title: name,
        subTitle: type,
        setBreadcrumbDetails: () => {
          dispatch(clearHFSummary());
          dispatch(setHFSummary({ name, id, tenantId }));
        },
        detailRoute: PROTECTED_ROUTES.healthFacilitySummary
          .replace(':healthFacilityId', id.toString())
          .replace(':tenantId', tenantId.toString()),
        data: []
      })),
    [dispatch, hfDashboardList]
  );
  const noHFAvailable = !(searchText.current || parsedData.length);
  const noSearchResultAvailable = Boolean(searchText.current && !parsedData.length);

  const createHFRoute = PROTECTED_ROUTES.createHealthFacilityByChiefdom
    .replace(':chiefdomId', chiefdomId)
    .replace(':tenantId', loggedInUsertenantId);
  const loaderWrapperClass = loadingMore
    ? `${styles.loaderWrapper} d-flex align-items-center justify-content-center mt-2dot5`
    : '';
  return (
    <div className='py-1dot5'>
      <div className='row'>
        <div
          className={`col-12 mb-1dot25 d-flex align-items-sm-center align-items-start flex-sm-row flex-column ${styles.header}`}
        >
          <h4 className='page-title mb-sm-0 mb-0dot5'>{healthFacilityPName}</h4>
          {!noHFAvailable && (
            <>
              <span className='ms-sm-auto mb-sm-0 mb-1'>
                <Searchbar placeholder={`Search ${healthFacilitySName}`} onSearch={onSearch} isOutlined={false} />
              </span>
              <Link to={createHFRoute} className='ms-sm-1dot5' tabIndex={-1}>
                {currentRole !== APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN && (
                  <button className='btn primary-btn'>Create {healthFacilitySName}</button>
                )}
              </Link>
            </>
          )}
        </div>
        <div className='col-12'>
          <div className='row gx-1dot25 gy-1dot25'>
            {parsedData.map((summaryProps: ISummaryCardProps, i: number) => (
              <div key={`hf${i}`} className='col-lg-4 col-md-6 col-12 mx-md-0 mx-auto'>
                <SummaryCard disableImg={true} titleClassName={styles.hfSummaryTitle} {...summaryProps} />
              </div>
            ))}
          </div>
        </div>
        {noHFAvailable && !loading && (
          <div className={`col-12 text-center mt-1 py-3dot75 ${styles.noData}`}>
            <div className='fw-bold highlight-text'>Let’s Get Started!</div>
            <div className='subtle-color fs-0dot875 lh-1dot25 mb-1'>Create an {healthFacilitySName.toLowerCase()}</div>
            <Link to={createHFRoute} className='mx-auto' tabIndex={-1}>
              <button className='btn primary-btn'>Create {healthFacilitySName}</button>
            </Link>
          </div>
        )}
        {noSearchResultAvailable && (
          <div className={`col-12 text-center mt-1 py-3dot75 ${styles.noData}`}>
            <div className='fw-bold highlight-text'>No {healthFacilityPName} available</div>
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

export default HealthFacilityDashboard;
