import { useCallback, useMemo, useEffect } from 'react';
import DetailCard from '../../components/detailCard/DetailCard';
import CustomTable from '../../components/customTable/CustomTable';
import APPCONSTANTS from '../../constants/appConstants';
import {
  districtCountSelector,
  districtLoadingSelector,
  getDistrictListSelector
} from '../../store/district/selectors';
import { useDispatch, useSelector } from 'react-redux';
import {
  activateAccountReq,
  fetchDistrictListRequest,
  removeDeactivatedAccountList
} from '../../store/district/actions';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import { roleSelector, tenantIdSelector } from '../../store/user/selectors';
import { IDistrict } from '../../store/district/types';
import { formatDate } from '../../utils/validation';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import { formatUserToastMsg } from '../../utils/commonUtils';
import useCountryId from '../../hooks/useCountryId';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';

/**
 * DeactivatedRecords component for displaying and managing deactivated district records.
 * @return {React.ReactElement} The rendered DeactivatedRecords component
 */
const DeactivatedRecords = (): React.ReactElement => {
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const dispatch = useDispatch();
  const loading = useSelector(districtLoadingSelector);
  const deactivatedRecords = useSelector(getDistrictListSelector);
  const deactivatedRecordsCount = useSelector(districtCountSelector);
  const countryId = useCountryId();
  const tenantId = useSelector(tenantIdSelector);
  const role = useSelector(roleSelector);
  const { ROLES } = APPCONSTANTS;
  const {
    district: { s: districtSName, p: districtPName }
  } = useAppTypeConfigs();

  /**
   * Fetches deactivated district details based on current list parameters.
   */
  const fetchDetails = useCallback(() => {
    dispatch(
      fetchDistrictListRequest({
        countryId,
        tenantId: ROLES.REGION_ADMIN === role ? tenantId : '',
        skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
        limit: listParams.rowsPerPage,
        search: listParams.searchTerm,
        isActive: false,
        failureCb: (e) => {
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.DEACTIVATED_RECORDS_FETCH_ERROR));
        }
      })
    );
  }, [dispatch, countryId, ROLES.REGION_ADMIN, role, tenantId, listParams]);

  useEffect(() => {
    fetchDetails();
    return () => {
      dispatch(removeDeactivatedAccountList());
    };
  }, [dispatch, fetchDetails, listParams]);

  /**
   * Handler to open activate modal and process district activation.
   * @param {IDistrict} value - The district to be activated
   */
  const openActivateModal = (value: IDistrict) => {
    dispatch(
      activateAccountReq({
        data: { tenantId: Number(value?.tenantId) },
        successCb: () => {
          fetchDetails();
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.ACTIVATE_COUNTY_SUCCESS, districtSName)
          );
        },
        failureCb: (e) => {
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.ERROR,
              formatUserToastMsg(APPCONSTANTS.ACTIVATE_COUNTY_FAIL, districtSName)
            )
          );
        }
      })
    );
  };

  /**
   * Defines the column configuration for the deactivated records table.
   * @return {Array} An array of column definition objects
   */
  const columnDefs = useMemo(
    () => [
      {
        id: 1,
        name: 'name',
        label: 'Name'
      },
      {
        id: 2,
        name: 'updated_at',
        label: 'Deactivated Date',
        cellFormatter: (data: IDistrict) => {
          if (data?.updatedAt) {
            return formatDate(data.updatedAt, { month: 'short', format: 'DD MM, YYYY' });
          } else {
            return '';
          }
        }
      },
      {
        id: 3,
        name: 'status',
        label: 'Deactivated Reason'
      }
    ],
    []
  );

  return (
    <div className='row g-0dot625'>
      <div className='col-12'>
        <DetailCard header={`Deactivated ${districtPName}`} isSearch={true} onSearch={handleSearch}>
          <CustomTable
            loading={loading}
            rowData={deactivatedRecords}
            columnsDef={columnDefs}
            isEdit={false}
            isDelete={false}
            isActivate={true}
            page={listParams.page}
            rowsPerPage={listParams.rowsPerPage}
            count={deactivatedRecordsCount}
            handlePageChange={handlePage}
            onActivateClick={openActivateModal}
            activateConfirmationTitle={formatUserToastMsg(APPCONSTANTS.ACTIVATE_COUNTY_CONFIRMATION, districtSName)}
            activateTitle={formatUserToastMsg(APPCONSTANTS.ACTIVATE_COUNTY_TITLE, districtSName)}
          />
        </DetailCard>
      </div>
    </div>
  );
};

export default DeactivatedRecords;
