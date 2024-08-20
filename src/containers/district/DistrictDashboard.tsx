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
  districtCountSelector,
  districtDashboardListSelector,
  districtDashboardLoadingMoreSelector,
  districtLoadingSelector
} from '../../store/district/selectors';
import { IDistrictDetail, IDashboardDistrict } from '../../store/district/types';
import { clearDistrictDetails, fetchDistrictDashboardList, setDistrictDetails } from '../../store/district/actions';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import { countryIdSelector, formDataIdSelector, tenantIdSelector } from '../../store/user/selectors';

import styles from './District.module.scss';
import sessionStorageServices from '../../global/sessionStorageServices';

const DistrictDashboard = () => {
  const dispatch = useDispatch();
  const regionId = useSelector(formDataIdSelector);
  const tenantId = useSelector(tenantIdSelector);
  const districtList = useSelector(districtDashboardListSelector);
  const count = useSelector(districtCountSelector);
  const loading = useSelector(districtLoadingSelector);
  const loadingMore = useSelector(districtDashboardLoadingMoreSelector);
  const countryId = useSelector(countryIdSelector);
  const { push } = useHistory();
  const {
    district: { s: districtSName, p: districtPName },
    chiefdom: { s: chiefdomSName }
  } = NAME_CONSTANTS;

  const { isLastPage, loadMore, resetPage } = useLoadMorePagination({
    total: count,
    itemsPerPage: APPCONSTANTS.DISTRICT_PER_PAGE,
    onLoadMore: ({ skip, limit, onFail }) => {
      dispatch(
        fetchDistrictDashboardList({
          skip,
          limit,
          isLoadMore: true,
          failureCb: (e: Error) => {
            onFail();
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.DISTRICT_FETCH_ERROR, districtSName)
              )
            );
          }
        })
      );
    }
  });

  /**
   * To clear cache and set current District name
   */
  const onDashboardExit = useCallback(
    (partialDistrictDetail: Partial<IDistrictDetail>) => {
      dispatch(clearDistrictDetails());
      dispatch(setDistrictDetails(partialDistrictDetail));
      sessionStorageServices.setItem(APPCONSTANTS.COUNTRY_ID, countryId?.id);
      sessionStorageServices.setItem(APPCONSTANTS.COUNTRY_TENANT_ID, countryId?.tenantId);
    },
    [countryId, dispatch]
  );

  useEffect(() => {
    dispatch(
      fetchDistrictDashboardList({
        skip: 0,
        limit: APPCONSTANTS.DISTRICT_PER_PAGE,
        failureCb: (e: Error) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.DISTRICT_FETCH_ERROR, districtSName)
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
        fetchDistrictDashboardList({
          skip: 0,
          limit: APPCONSTANTS.DISTRICT_PER_PAGE,
          searchTerm,
          successCb: () => resetPage(),
          failureCb: (e: Error) =>
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.DISTRICT_FETCH_ERROR, districtSName)
              )
            )
        })
      );
    },
    [dispatch, resetPage]
  );

  const parsedData: ISummaryCardProps[] = useMemo(
    () =>
      districtList?.map(({ siteCount, ouCount, name, tenantId: _id, id: formDataId }: IDashboardDistrict) => ({
        title: name,
        _id,
        formId: formDataId,
        detailRoute: PROTECTED_ROUTES.districtSummary.replace(':districtId', formDataId).replace(':tenantId', _id),
        setBreadcrumbDetails: () => onDashboardExit({ id: formDataId, name, tenantId: _id }),
        data: [
          {
            type: 'number',
            value: Number(ouCount) ? appendZeroBefore(ouCount, 2) : '-',
            label: chiefdomModuleName,
            disableEllipsis: true,
            route: PROTECTED_ROUTES.chiefdomByDistrict.replace(':districtId', formDataId).replace(':tenantId', _id),
            onClick: () => onDashboardExit({ id: formDataId, name, tenantId: _id })
          },
          {
            type: 'number',
            value: Number(siteCount) ? appendZeroBefore(siteCount, 2) : '-',
            label: 'Health Facility',
            route: PROTECTED_ROUTES.healthFacilityByDistrict
              .replace(':districtId', formDataId)
              .replace(':tenantId', _id),
            onClick: () => onDashboardExit({ id: formDataId, name, tenantId: _id })
          }
        ]
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [districtList, onDashboardExit]
  );

  const noDistrictAvailable = !(searchText.current || parsedData.length);
  const noSearchRecordsAvailable = Boolean(searchText.current && !parsedData.length);

  const navigateToCreateDistrict = () => {
    push(PROTECTED_ROUTES.createDistrictByRegion.replace(':regionId', regionId).replace(':tenantId', tenantId));
  };

  return (
    <div className='py-1dot5'>
      <div className='row'>
        <div className='col-12 mb-1dot25 d-flex align-items-sm-center align-items-start flex-sm-row flex-column'>
          <h4 className='page-title mb-sm-0 mb-0dot5'>{districtPName}</h4>
          {!noDistrictAvailable && (
            <>
              <span className='ms-sm-auto mb-sm-0 mb-1'>
                <Searchbar placeholder={`Search ${districtSName}`} onSearch={onSearch} isOutlined={false} />
              </span>
              <button className='ms-sm-1dot5 btn primary-btn' onClick={navigateToCreateDistrict}>
                Create {districtSName}
              </button>
            </>
          )}
        </div>
        <div className='col-12'>
          <div className='row gx-1dot25 gy-1dot25'>
            {parsedData.map((summaryProps: ISummaryCardProps, i: number) => (
              <div key={`district${i}`} className='col-md-6 col-12 mx-md-0 mx-auto'>
                <SummaryCard {...summaryProps} disableImg={true} />
              </div>
            ))}
          </div>
        </div>
        {noDistrictAvailable && !loading && (
          <div className={`col-12 text-center mt-1 py-3dot75 ${styles.noData}`}>
            <div className='fw-bold highlight-text'>Let’s Get Started!</div>
            <div className='subtle-color fs-0dot875 lh-1dot25 mb-1'>Create an {districtSName.toLowerCase()}</div>
            <button className='btn primary-btn mx-auto' onClick={navigateToCreateDistrict}>
              Create {districtSName}
            </button>
          </div>
        )}
        {noSearchRecordsAvailable && (
          <div className={`col-12 text-center mt-1 py-3dot75 ${styles.noData}`}>
            <div className='fw-bold highlight-text'>No {districtSName} available</div>
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

export default DistrictDashboard;
