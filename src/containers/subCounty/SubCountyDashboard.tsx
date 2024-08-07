import { Link } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../../components/loader/Loader';
import Searchbar from '../../components/searchbar/Searchbar';
import SummaryCard, { ISummaryCardProps } from '../../components/summaryCard/SummaryCard';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import { useLoadMorePagination } from '../../hooks/pagination';
import { PROTECTED_ROUTES } from '../../constants/route';
import { appendZeroBefore, formatUserToastMsg } from '../../utils/commonUtils';
import {
  getSubCountyDetailSelector,
  subCountyCountSelector,
  subCountyDashboardListSelector,
  subCountyLoadingMoreSelector,
  subCountyLoadingSelector
} from '../../store/subCounty/selectors';
import { ISubCountySummary } from '../../store/subCounty/types';
import {
  fetchSubCountyDashboardListRequest,
  fetchSubCountyDetail,
  clearSubCountyDetail,
  setSubCountyDetails
} from '../../store/subCounty/actions';
import { countryIdSelector, formDataIdSelector, tenantIdSelector } from '../../store/user/selectors';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';

import styles from './SubCounty.module.scss';
import sessionStorageServices from '../../global/sessionStorageServices';

const SubCountyDashboard = () => {
  const dispatch = useDispatch();
  const subCountyDashboardList = useSelector(subCountyDashboardListSelector);
  const subCountyCount = useSelector(subCountyCountSelector);
  const loading = useSelector(subCountyLoadingSelector);
  const loadingMore = useSelector(subCountyLoadingMoreSelector);
  const subCountyDetail = useSelector(getSubCountyDetailSelector);
  const countryId = useSelector(countryIdSelector);
  const { subCounty: subCountyModuleName } = NAME_CONSTANTS;

  const { isLastPage, loadMore, resetPage } = useLoadMorePagination({
    total: subCountyCount,
    itemsPerPage: APPCONSTANTS.SUB_COUNTY_PER_PAGE,
    onLoadMore: ({ skip, limit, onFail }) => {
      dispatch(
        fetchSubCountyDashboardListRequest({
          skip,
          limit,
          isLoadMore: true,
          failureCb: (e) => {
            onFail();
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_FETCH_ERROR, subCountyModuleName)
              )
            );
          }
        })
      );
    }
  });

  useEffect(() => {
    dispatch(
      fetchSubCountyDashboardListRequest({
        skip: 0,
        limit: APPCONSTANTS.SUB_COUNTY_PER_PAGE,
        failureCb: (e) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_FETCH_ERROR, subCountyModuleName)
            )
          )
      })
    );
  }, [dispatch]);

  /**
   * To clear cache and set current SubCounty details
   */
  const onDashboardExit = useCallback(
    (id: string, tenantId: string, name: string) => {
      dispatch(clearSubCountyDetail());
      dispatch(setSubCountyDetails({ id, name, tenantId }));
      sessionStorageServices.setItem(APPCONSTANTS.COUNTRY_ID, countryId?.id);
    },
    [dispatch, countryId]
  );

  const searchText = useRef<string>('');
  const onSearch = useCallback(
    (search: string) => {
      searchText.current = search;
      dispatch(
        fetchSubCountyDashboardListRequest({
          skip: 0,
          limit: APPCONSTANTS.SUB_COUNTY_PER_PAGE,
          search,
          successCb: () => resetPage(),
          failureCb: (e) =>
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_FETCH_ERROR, subCountyModuleName)
              )
            )
        })
      );
    },
    [dispatch, resetPage]
  );

  const parsedData: ISummaryCardProps[] = useMemo(
    () =>
      subCountyDashboardList?.map(({ siteCount, name, id, tenantId }: ISubCountySummary) => ({
        title: name,
        detailRoute: PROTECTED_ROUTES.subCountySummary.replace(':subCountyId', id).replace(':tenantId', tenantId),
        setBreadcrumbDetails: () => onDashboardExit(id, tenantId, name),
        data: [
          {
            type: 'number',
            value: Number(siteCount) ? appendZeroBefore(siteCount, 2) : '-',
            label: 'Site',
            disableEllipsis: true,
            route: PROTECTED_ROUTES.hfBySubCounty.replace(':subCountyId', id).replace(':tenantId', tenantId),
            onClick: () => {
              if (!subCountyDetail.id || subCountyDetail.id !== id) {
                onDashboardExit(id, tenantId, name);
                dispatch(
                  fetchSubCountyDetail({
                    tenantId,
                    id
                  })
                );
              }
            }
          }
        ]
      })),
    [subCountyDashboardList, onDashboardExit, subCountyDetail.id, dispatch]
  );

  const noSubCountysAvailable = !(searchText.current || parsedData?.length);
  const noSearchResultAvailable = Boolean(searchText.current && !parsedData?.length);

  const countyId = useSelector(formDataIdSelector);
  const accountTentantId = useSelector(tenantIdSelector);
  const createSubCountyRoute = PROTECTED_ROUTES.createSubCountyByCounty
    .replace(':countyId', countyId)
    .replace(':tenantId', accountTentantId);
  const loaderWrapperClass = loadingMore
    ? `${styles.loaderWrapper} d-flex align-items-center justify-content-center mt-2dot5`
    : '';
  return (
    <div className='py-1dot5'>
      <div className='row'>
        <div
          className={`col-12 mb-1dot25 d-flex align-items-sm-center align-items-start flex-sm-row flex-column ${styles.header}`}
        >
          <h4 className='page-title mb-sm-0 mb-0dot5'>{subCountyModuleName}s</h4>
          {!noSubCountysAvailable && (
            <>
              <span className='ms-sm-auto mb-sm-0 mb-1'>
                <Searchbar placeholder={`Search ${subCountyModuleName}`} onSearch={onSearch} isOutlined={false} />
              </span>
              <Link to={createSubCountyRoute} className='ms-sm-1dot5' tabIndex={-1}>
                <button className='btn primary-btn'>Create {subCountyModuleName}</button>
              </Link>
            </>
          )}
        </div>
        <div className='col-12'>
          <div className='row gx-1dot25 gy-1dot25'>
            {parsedData?.map((summaryProps: ISummaryCardProps, i: number) => (
              <div key={`sub-county${i}`} className='col-lg-4 col-md-6 col-12 mx-md-0 mx-auto'>
                <SummaryCard disableImg={true} titleClassName={styles.ouSummaryTitle} {...summaryProps} />
              </div>
            ))}
          </div>
        </div>
        {noSubCountysAvailable && !loading && (
          <div className={`col-12 text-center mt-1 py-3dot75 ${styles.noData}`}>
            <div className='fw-bold highlight-text'>Let’s Get Started!</div>
            <div className='subtle-color fs-0dot875 lh-1dot25 mb-1'>Create an {subCountyModuleName.toLowerCase()}</div>
            <Link to={createSubCountyRoute} className='mx-auto' tabIndex={-1}>
              <button className='btn primary-btn'>Create {subCountyModuleName}</button>
            </Link>
          </div>
        )}
        {noSearchResultAvailable && (
          <div className={`col-12 text-center mt-1 py-3dot75 ${styles.noData}`}>
            <div className='fw-bold highlight-text'>No {subCountyModuleName.toLowerCase()}s available</div>
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

export default SubCountyDashboard;
