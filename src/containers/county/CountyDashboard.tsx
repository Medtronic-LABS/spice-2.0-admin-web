import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Loader from '../../components/loader/Loader';
import Searchbar from '../../components/searchbar/Searchbar';
import SummaryCard, { ISummaryCardProps } from '../../components/summaryCard/SummaryCard';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import { useLoadMorePagination } from '../../hooks/pagination';
import { PROTECTED_ROUTES } from '../../constants/route';
import { appendZeroBefore, formatUserToastMsg } from '../../utils/commonUtils';
import {
  countyCountSelector,
  countyDashboardListSelector,
  countyDashboardLoadingMoreSelector,
  countyLoadingSelector
} from '../../store/county/selectors';
import { ICountyDetail, IDashboardCounty } from '../../store/county/types';
import { clearCountyDetails, fetchCountyDashboardList, setCountyDetails } from '../../store/county/actions';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import { countryIdSelector, formDataIdSelector, tenantIdSelector } from '../../store/user/selectors';

import styles from './County.module.scss';
import sessionStorageServices from '../../global/sessionStorageServices';

const CountyDashboard = () => {
  const dispatch = useDispatch();
  const regionId = useSelector(formDataIdSelector);
  const tenantId = useSelector(tenantIdSelector);
  const countyList = useSelector(countyDashboardListSelector);
  const count = useSelector(countyCountSelector);
  const loading = useSelector(countyLoadingSelector);
  const loadingMore = useSelector(countyDashboardLoadingMoreSelector);
  const countryId = useSelector(countryIdSelector);
  const { push } = useHistory();
  const { county: countyModuleName, subCounty: subCountyModuleName } = NAME_CONSTANTS;

  const { isLastPage, loadMore, resetPage } = useLoadMorePagination({
    total: count,
    itemsPerPage: APPCONSTANTS.COUNTY_PER_PAGE,
    onLoadMore: ({ skip, limit, onFail }) => {
      dispatch(
        fetchCountyDashboardList({
          skip,
          limit,
          isLoadMore: true,
          failureCb: (e: Error) => {
            onFail();
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.COUNTY_FETCH_ERROR, countyModuleName)
              )
            );
          }
        })
      );
    }
  });

  /**
   * To clear cache and set current County name
   */
  const onDashboardExit = useCallback(
    (partialCountyDetail: Partial<ICountyDetail>) => {
      dispatch(clearCountyDetails());
      dispatch(setCountyDetails(partialCountyDetail));
      sessionStorageServices.setItem(APPCONSTANTS.COUNTRY_ID, countryId?.id);
      sessionStorageServices.setItem(APPCONSTANTS.COUNTRY_TENANT_ID, countryId?.tenantId);
    },
    [countryId, dispatch]
  );

  useEffect(() => {
    dispatch(
      fetchCountyDashboardList({
        skip: 0,
        limit: APPCONSTANTS.COUNTY_PER_PAGE,
        failureCb: (e: Error) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.COUNTY_FETCH_ERROR, countyModuleName)
            )
          )
      })
    );
  }, [dispatch]);

  const searchText = useRef<string>('');
  const onSearch = useCallback(
    (searchTerm: string) => {
      searchText.current = searchTerm;
      dispatch(
        fetchCountyDashboardList({
          skip: 0,
          limit: APPCONSTANTS.COUNTY_PER_PAGE,
          searchTerm,
          successCb: () => resetPage(),
          failureCb: (e: Error) =>
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.COUNTY_FETCH_ERROR, countyModuleName)
              )
            )
        })
      );
    },
    [dispatch, resetPage]
  );

  const parsedData: ISummaryCardProps[] = useMemo(
    () =>
      countyList?.map(({ siteCount, ouCount, name, tenantId: _id, id: formDataId }: IDashboardCounty) => ({
        title: name,
        _id,
        formId: formDataId,
        detailRoute: PROTECTED_ROUTES.countySummary.replace(':accountId', formDataId).replace(':tenantId', _id),
        setBreadcrumbDetails: () => onDashboardExit({ id: formDataId, name, tenantId: _id }),
        data: [
          {
            type: 'number',
            value: Number(ouCount) ? appendZeroBefore(ouCount, 2) : '-',
            label: subCountyModuleName,
            disableEllipsis: true,
            route: PROTECTED_ROUTES.subCountyByCounty.replace(':accountId', formDataId).replace(':tenantId', _id),
            onClick: () => onDashboardExit({ id: formDataId, name, tenantId: _id })
          },
          {
            type: 'number',
            value: Number(siteCount) ? appendZeroBefore(siteCount, 2) : '-',
            label: 'Health Facility',
            route: PROTECTED_ROUTES.hfByCounty.replace(':accountId', formDataId).replace(':tenantId', _id),
            onClick: () => onDashboardExit({ id: formDataId, name, tenantId: _id })
          }
        ]
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [countyList, onDashboardExit]
  );

  const noCountyAvailable = !(searchText.current || parsedData.length);
  const noSearchRecordsAvailable = Boolean(searchText.current && !parsedData.length);

  const navigateToCreateAcc = () => {
    push(PROTECTED_ROUTES.createCountyByRegion.replace(':regionId', regionId).replace(':tenantId', tenantId));
  };

  return (
    <div className='py-1dot5'>
      <div className='row'>
        <div className='col-12 mb-1dot25 d-flex align-items-sm-center align-items-start flex-sm-row flex-column'>
          <h4 className='page-title mb-sm-0 mb-0dot5'>{countyModuleName}s</h4>
          {!noCountyAvailable && (
            <>
              <span className='ms-sm-auto mb-sm-0 mb-1'>
                <Searchbar placeholder={`Search ${countyModuleName}`} onSearch={onSearch} isOutlined={false} />
              </span>
              <button className='ms-sm-1dot5 btn primary-btn' onClick={navigateToCreateAcc}>
                Create {countyModuleName}
              </button>
            </>
          )}
        </div>
        <div className='col-12'>
          <div className='row gx-1dot25 gy-1dot25'>
            {parsedData.map((summaryProps: ISummaryCardProps, i: number) => (
              <div key={`county${i}`} className='col-md-6 col-12 mx-md-0 mx-auto'>
                <SummaryCard {...summaryProps} disableImg={true} />
              </div>
            ))}
          </div>
        </div>
        {noCountyAvailable && !loading && (
          <div className={`col-12 text-center mt-1 py-3dot75 ${styles.noData}`}>
            <div className='fw-bold highlight-text'>Let’s Get Started!</div>
            <div className='subtle-color fs-0dot875 lh-1dot25 mb-1'>Create an {countyModuleName.toLowerCase()}</div>
            <button className='btn primary-btn mx-auto' onClick={navigateToCreateAcc}>
              Create {countyModuleName}
            </button>
          </div>
        )}
        {noSearchRecordsAvailable && (
          <div className={`col-12 text-center mt-1 py-3dot75 ${styles.noData}`}>
            <div className='fw-bold highlight-text'>No {countyModuleName} available</div>
            <div className='subtle-color fs-0dot875 lh-1dot25 mb-1'>Try changing the search keyword</div>
          </div>
        )}
        {Boolean(parsedData.length) && !isLastPage && !loadingMore && (
          <div className='col-12 text-center mt-2dot5'>
            <button className='btn load-more-btn pointer' onClick={loadMore}>
              Load More<b className='ls-2px ms-0dot125'>...</b>
            </button>
          </div>
        )}
        {(loadingMore || loading) && (
          <div
            className={
              loadingMore ? `${styles.loaderWrapper} d-flex align-items-center justify-content-center mt-2dot5` : ''
            }
          >
            <Loader isFullScreen={!loadingMore} className='translate-x-minus50' />
          </div>
        )}
      </div>
    </div>
  );
};

export default CountyDashboard;
