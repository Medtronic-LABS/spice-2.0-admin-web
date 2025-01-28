import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Loader from '../../components/loader/Loader';
import Searchbar from '../../components/searchbar/Searchbar';
import SummaryCard, { ISummaryCardProps } from '../../components/summaryCard/SummaryCard';
import APPCONSTANTS, { APP_TYPE, APP_TYPE_NAME } from '../../constants/appConstants';
import { useLoadMorePagination } from '../../hooks/pagination';
import {
  clearClientRegistryStatus,
  clearRegionDetail,
  fetchRegionsRequest,
  setRegionDetail
} from '../../store/region/actions';
import {
  getLoadingSelector,
  getRegionsCountSelector,
  getRegionsLoadingMoreSelector,
  getRegionsSelector
} from '../../store/region/selectors';
import { appendZeroBefore, formatUserToastMsg } from '../../utils/commonUtils';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';

import { PROTECTED_ROUTES } from '../../constants/route';
import localStorageServices from '../../global/localStorageServices';
import sessionStorageServices from '../../global/sessionStorageServices';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import { clearChiefdomDetail } from '../../store/chiefdom/actions';
import { clearLabelName, clearSideMenu, setLabelName } from '../../store/common/actions';
import { clearDistrictDetails, resetClinicalWorkflow } from '../../store/district/actions';
import { getClinicalWorkflowSelector } from '../../store/district/selectors';
import { clearHFSummary } from '../../store/healthFacility/actions';
import { IRegionDetail } from '../../store/region/types';
import { clearAppType, fetchTimezoneListRequest, setAppType } from '../../store/user/actions';
import { timezoneListSelector } from '../../store/user/selectors';
import styles from './Region.module.scss';

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
    region: { s: regionSName, p: regionPName }
  } = useAppTypeConfigs();

  // for community
  const cChiefdomName = 'Chiefdom';
  const cDistrictName = 'District';

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
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.REGION_FETCH_ERROR, regionPName)
              )
            );
          }
        })
      );
    }
  });

  useEffect(() => {
    dispatch(
      fetchRegionsRequest({
        skip: 0,
        limit: APPCONSTANTS.REGIONS_PER_PAGE,
        failureCb: (e) =>
          toastCenter.error(
            ...getErrorToastArgs(e, APPCONSTANTS.OOPS, formatUserToastMsg(APPCONSTANTS.REGION_FETCH_ERROR, regionPName))
          )
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
   * To remove Region based details
   */
  useEffect(() => {
    dispatch(clearRegionDetail());
    dispatch(clearDistrictDetails());
    dispatch(clearChiefdomDetail());
    dispatch(clearHFSummary());
    dispatch(clearClientRegistryStatus());
    dispatch(clearSideMenu());
    dispatch(clearAppType());
    dispatch(clearLabelName());
    localStorageServices.deleteItem(APP_TYPE_NAME);
    sessionStorageServices.deleteItems([APPCONSTANTS.COUNTRY_ID, APPCONSTANTS.COUNTRY_TENANT_ID]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * To clear cached region details data and set current region name
   */
  const onDashboardExit = useCallback(
    (partialRegionDetail: Partial<IRegionDetail>) => {
      if (partialRegionDetail.appTypes && partialRegionDetail.appTypes.length) {
        localStorageServices.setItem(APP_TYPE_NAME, `${JSON.stringify(partialRegionDetail.appTypes)}`);
        dispatch(setAppType(partialRegionDetail.appTypes));
      }
      dispatch(clearRegionDetail());
      dispatch(setRegionDetail(partialRegionDetail));
      if (partialRegionDetail.displayValues) {
        dispatch(setLabelName(partialRegionDetail.displayValues));
      }

      sessionStorageServices.setItem(APPCONSTANTS.COUNTRY_ID, partialRegionDetail.id);
      sessionStorageServices.setItem(APPCONSTANTS.COUNTRY_TENANT_ID, partialRegionDetail.tenantId);
    },
    [dispatch]
  );
  /**
   * Handles search functionality
   */
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
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.REGION_FETCH_ERROR, regionPName)
              )
            )
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, resetPage]
  );

  /**
   * Parses the region data for summary cards
   */
  const parsedData: ISummaryCardProps[] = useMemo(
    () =>
      regions.map(
        ({
          chiefdomCount,
          healthFacilityCount,
          districtCount,
          name,
          tenantId,
          id: regionId,
          appTypes,
          displayValues
        }: any) => {
          const {
            healthFacility: { s: healthFacilitySName = 'Health facility' } = {},
            district: { s: ncDistrictName = 'County' } = {},
            chiefdom: { s: ncChiefdomName = 'Sub County' } = {}
          } = displayValues || {};
          return {
            title: name,
            detailRoute: PROTECTED_ROUTES.regionSummary.replace(':regionId', regionId).replace(':tenantId', tenantId),
            setBreadcrumbDetails: () => onDashboardExit({ id: regionId, name, tenantId, appTypes, displayValues }),
            tenantId,
            formId: regionId,
            data: [
              {
                type: 'number',
                value: Number(districtCount) ? appendZeroBefore(districtCount, 2) : '-',
                label: appTypes.includes(APP_TYPE.NON_COMMUNITY) ? ncDistrictName : cDistrictName,
                disableEllipsis: true,
                route: PROTECTED_ROUTES.districtByRegion.replace(':regionId', regionId).replace(':tenantId', tenantId),
                onClick: () => onDashboardExit({ id: regionId, name, tenantId, appTypes, displayValues }),
                appType: appTypes
              },
              {
                type: 'number',
                value: Number(chiefdomCount) ? appendZeroBefore(chiefdomCount, 2) : '-',
                label: appTypes.includes(APP_TYPE.NON_COMMUNITY) ? ncChiefdomName : cChiefdomName,
                route: PROTECTED_ROUTES.chiefdomByRegion.replace(':regionId', regionId).replace(':tenantId', tenantId),
                onClick: () => onDashboardExit({ id: regionId, name, tenantId, appTypes, displayValues }),
                appType: appTypes
              },
              {
                type: 'number',
                value: Number(healthFacilityCount) ? appendZeroBefore(healthFacilityCount, 2) : '-',
                label: healthFacilitySName,
                disableEllipsis: true,
                route: PROTECTED_ROUTES.healthFacilityByRegion
                  .replace(':regionId', regionId)
                  .replace(':tenantId', tenantId),
                onClick: () => onDashboardExit({ id: regionId, name, tenantId, appTypes, displayValues }),
                appType: appTypes
              }
            ]
          };
        }
      ),
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
              <button
                className='ms-sm-1dot5 btn primary-btn'
                onClick={() => {
                  setTimeout(() => {
                    push(PROTECTED_ROUTES.createRegion);
                  }, 0);
                }}
              >
                Create {regionSName}
              </button>
            </>
          )}
        </div>
        <div className='col-12'>
          <div className='row gx-1dot25 gy-1dot25'>
            {parsedData.map((summaryProps: ISummaryCardProps, i: number) => (
              <div key={`region-${i}`} className='col-lg-6 col-12 mx-lg-0 mx-auto'>
                <SummaryCard {...summaryProps} disableImg={true} linkStyle={{ minWidth: '150px' }} />
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
