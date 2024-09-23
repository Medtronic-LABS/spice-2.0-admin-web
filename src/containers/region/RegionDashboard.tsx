import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import SummaryCard, { ISummaryCardProps } from '../../components/summaryCard/SummaryCard';
import Searchbar from '../../components/searchbar/Searchbar';
import Loader from '../../components/loader/Loader';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import { useLoadMorePagination } from '../../hooks/pagination';
import {
  clearClientRegistryStatus,
  clearRegionDetail,
  fetchRegionsRequest,
  setRegionDetail
} from '../../store/region/actions';
import {
  getRegionsCountSelector,
  getRegionsLoadingMoreSelector,
  getLoadingSelector,
  getRegionsSelector
} from '../../store/region/selectors';
import { appendZeroBefore } from '../../utils/commonUtils';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';

import styles from './Region.module.scss';
import { PROTECTED_ROUTES } from '../../constants/route';
import { fetchTimezoneListRequest } from '../../store/user/actions';
import { timezoneListSelector } from '../../store/user/selectors';
import { clearHFSummary } from '../../store/healthFacility/actions';
import { clearDistrictDetails, resetClinicalWorkflow } from '../../store/district/actions';
import { clearChiefdomDetail } from '../../store/chiefdom/actions';
import { IRegionDetail } from '../../store/region/types';
import { getClinicalWorkflowSelector } from '../../store/district/selectors';
import sessionStorageServices from '../../global/sessionStorageServices';
import { clearSideMenu } from '../../store/common/actions';

/**
 * Lists all the regions
 * Provides search feature
 * Provided the links to navigate to creation page of super admin and region
 * @returns {React.ReactElement}
 */
const Region = (): React.ReactElement => {
  const dispatch = useDispatch();
  const regions = useSelector(getRegionsSelector);
  const regionsCount = useSelector(getRegionsCountSelector);
  const loading = useSelector(getLoadingSelector);
  const loadingMore = useSelector(getRegionsLoadingMoreSelector);
  const timezoneList = useSelector(timezoneListSelector);
  const clinicalWorkflows = useSelector(getClinicalWorkflowSelector);
  const { push } = useHistory();

  const {
    region: { s: regionSName, p: regionPName },
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName },
    healthFacility: { s: healthFacilitySName }
  } = NAME_CONSTANTS;

  const { isLastPage, loadMore, resetPage } = useLoadMorePagination({
    total: regionsCount,
    itemsPerPage: APPCONSTANTS.REGIONS_PER_PAGE,
    onLoadMore: ({ skip, limit, onFail }) => {
      dispatch(
        fetchRegionsRequest({
          skip,
          limit,
          isLoadMore: true,
          failureCb: (e) => {
            onFail();
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.REGION_FETCH_ERROR));
          }
        })
      );
    }
  });

  useEffect(() => {
    dispatch(clearSideMenu());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(
      fetchRegionsRequest({
        skip: 0,
        limit: APPCONSTANTS.REGIONS_PER_PAGE,
        failureCb: (e) =>
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.REGION_FETCH_ERROR)),
        successCb: (regionList) => {
          const { regions: allRegions } = regionList;
          // if there is only one region then redirect to region summary
          if (allRegions.length === 1) {
            const { id, tenantId, name } = allRegions[0];
            if (id && tenantId && name) {
              onDashboardExit({ id: String(id), tenantId: String(tenantId), name });
              push({
                pathname: PROTECTED_ROUTES.regionSummary
                  .replace(':regionId', String(id))
                  .replace(':tenantId', String(tenantId))
              });
            }
          }
        }
      })
    );
    if (clinicalWorkflows.length) {
      dispatch(resetClinicalWorkflow());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinicalWorkflows.length, dispatch]);

  useEffect(() => {
    if (!timezoneList?.length) {
      dispatch(fetchTimezoneListRequest());
    }
  }, [dispatch, timezoneList?.length]);

  /**
   * To remove Region, District, Chiefdom, Site Details cache in store
   */
  useEffect(() => {
    dispatch(clearRegionDetail());
    dispatch(clearDistrictDetails());
    dispatch(clearChiefdomDetail());
    dispatch(clearHFSummary());
    dispatch(clearClientRegistryStatus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * To clear cached region details data and set current region name
   */
  const onDashboardExit = useCallback(
    (partialRegionDetail: Partial<IRegionDetail>) => {
      dispatch(clearRegionDetail());
      dispatch(setRegionDetail(partialRegionDetail));
      sessionStorageServices.setItem(APPCONSTANTS.COUNTRY_ID, partialRegionDetail.id);
      sessionStorageServices.setItem(APPCONSTANTS.COUNTRY_TENANT_ID, partialRegionDetail.tenantId);
    },
    [dispatch]
  );

  const searchText = useRef<string>('');
  const onSearch = useCallback(
    (search: string) => {
      searchText.current = search;
      dispatch(
        fetchRegionsRequest({
          skip: 0,
          limit: APPCONSTANTS.REGIONS_PER_PAGE,
          search,
          successCb: () => resetPage(),
          failureCb: (e) =>
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.REGION_FETCH_ERROR))
        })
      );
    },
    [dispatch, resetPage]
  );

  const parsedData: ISummaryCardProps[] = useMemo(
    () =>
      regions.map(({ chiefdomCount, healthFacilityCount, districtCount, name, tenantId, id: regionId }: any) => ({
        title: name,
        detailRoute: PROTECTED_ROUTES.regionSummary.replace(':regionId', regionId).replace(':tenantId', tenantId),
        setBreadcrumbDetails: () => onDashboardExit({ id: regionId, name, tenantId }),
        tenantId,
        formId: regionId,
        data: [
          {
            type: 'number',
            value: Number(districtCount) ? appendZeroBefore(districtCount, 2) : '-',
            label: districtSName,
            disableEllipsis: true,
            route: PROTECTED_ROUTES.districtByRegion.replace(':regionId', regionId).replace(':tenantId', tenantId),
            onClick: () => onDashboardExit({ id: regionId, name, tenantId })
          },
          {
            type: 'number',
            value: Number(chiefdomCount) ? appendZeroBefore(chiefdomCount, 2) : '-',
            label: chiefdomSName,
            route: PROTECTED_ROUTES.chiefdomByRegion.replace(':regionId', regionId).replace(':tenantId', tenantId),
            onClick: () => onDashboardExit({ id: regionId, name, tenantId })
          },
          {
            type: 'number',
            value: Number(healthFacilityCount) ? appendZeroBefore(healthFacilityCount, 2) : '-',
            label: healthFacilitySName,
            disableEllipsis: true,
            route: PROTECTED_ROUTES.healthFacilityByRegion
              .replace(':regionId', regionId)
              .replace(':tenantId', tenantId),
            onClick: () => onDashboardExit({ id: regionId, name, tenantId })
          }
        ]
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [regions, onDashboardExit]
  );

  const noRegionsAvailable = !(searchText.current || parsedData.length);
  const noSearchResultAvailable = Boolean(searchText.current && !parsedData.length);
  const loaderWrapperClass = loadingMore
    ? `${styles.loaderWrapper} d-flex align-items-center justify-content-center mt-2dot5`
    : '';

  return (
    <div className='py-1dot5'>
      <div className='row'>
        <div className={`col-12 mb-1dot25 d-flex align-items-sm-center align-items-start flex-sm-row flex-column`}>
          <h4 className='page-title mb-sm-0 mb-0dot5'>{regionPName}</h4>
          {!noRegionsAvailable && (
            <>
              <span className='ms-sm-auto mb-sm-0 mb-1'>
                <Searchbar placeholder={`Search ${regionSName}`} onSearch={onSearch} isOutlined={false} />
              </span>
              <button className='ms-sm-1dot5 btn primary-btn' onClick={() => push(PROTECTED_ROUTES.createRegion)}>
                Create {regionSName}
              </button>
            </>
          )}
        </div>
        <div className='col-12'>
          <div className='row gx-1dot25 gy-1dot25'>
            {parsedData.map((summaryProps: ISummaryCardProps, i: number) => (
              <div key={`region${i}`} className='col-lg-6 col-12 mx-lg-0 mx-auto'>
                <SummaryCard {...summaryProps} disableImg={true} />
              </div>
            ))}
          </div>
        </div>
        {noRegionsAvailable && !loading && (
          <div className={`col-12 text-center mt-1 py-3dot75 ${styles.noData}`}>
            <div className='fw-bold highlight-text'>Let’s Get Started!</div>
            <div className='subtle-color fs-0dot875 lh-1dot25 mb-1'>Create a new {regionSName}</div>
            <button className='ms-sm-1dot5 btn primary-btn' onClick={() => push(PROTECTED_ROUTES.createRegion)}>
              Create {regionSName}
            </button>
          </div>
        )}
        {noSearchResultAvailable && (
          <div className={`col-12 text-center mt-1 py-3dot75 ${styles.noData}`}>
            <div className='fw-bold highlight-text'>No {regionPName} available</div>
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
        {loadingMore || loading ? (
          <div className={loaderWrapperClass}>
            <Loader isFullScreen={!loadingMore} className='translate-x-minus50' />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Region;
