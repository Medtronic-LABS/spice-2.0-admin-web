import arrayMutators from 'final-form-arrays';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import Loader from '../../components/loader/Loader';
import ModalForm from '../../components/modal/ModalForm';
import { PROTECTED_ROUTES } from '../../constants/route';
import { useTablePaginationHook } from '../../hooks/tablePagination';

import { useDispatch, useSelector } from 'react-redux';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import useCountryId from '../../hooks/useCountryId';
import {
  clearHFWorkflowList,
  deleteHealthFacilityRequest,
  fetchHFListRequest,
  fetchHFSummaryRequest,
  fetchWorkflowListRequest,
  updateHFDetailsRequest,
  validateLinkedRestrictionsRequest
} from '../../store/healthFacility/actions';
import {
  healthFacilityListSelector,
  healthFacilityListTotalSelector,
  healthFacilityLoadingSelector
} from '../../store/healthFacility/selectors';
import { IHealthFacility, IHealthFacilityForm } from '../../store/healthFacility/types';
import { getAppTypeSelector, roleSelector } from '../../store/user/selectors';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import HealthFacilityDetailsForm from '../createHealthFacility/HealthFacilityDetailsForm';
import { formatHealthFacility } from './HealthFacilitySummary';

/**
 * Interface for modal state
 */
interface IModalState {
  data?: any;
  isOpen: boolean;
  isNextClicked: boolean;
}

/**
 * Interface for route parameters
 */
interface IMatchParams {
  regionId?: string;
  tenantId: string;
  districtId?: string;
  chiefdomId?: string;
}

/**
 * HealthFacilityList component for displaying health facilities list
 * @returns {React.ReactElement} The rendered component
 */
const HealthFacilityList = (): React.ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const healthFacilityList = useSelector(healthFacilityListSelector);
  const healthFacilityCount = useSelector(healthFacilityListTotalSelector);
  const loading = useSelector(healthFacilityLoadingSelector);
  const role = useSelector(roleSelector);
  const countryId = useCountryId();
  const appTypes = useSelector(getAppTypeSelector);
  const isSuperUser = [APPCONSTANTS.ROLES.SUPER_ADMIN, APPCONSTANTS.ROLES.SUPER_USER].includes(role);
  const {
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName },
    healthFacility: { s: healthFacilitySName }
  } = NAME_CONSTANTS;

  const { regionId, tenantId, districtId, chiefdomId } = useParams<IMatchParams>();

  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const [editHealthFacilityModal, setEditHFDetailsModal] = useState<IModalState>({
    isOpen: false,
    data: {} as IHealthFacilityForm,
    isNextClicked: false
  });

  /**
   * Fetches the health facility list
   */
  const fetchList = useCallback(() => {
    dispatch(
      fetchHFListRequest({
        countryId,
        skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
        limit: listParams.rowsPerPage,
        searchTerm: listParams.searchTerm,
        userBased: !isSuperUser,
        tenantIds: [tenantId],
        failureCb: (e: Error) => requestFailure(e, APPCONSTANTS.HEALTH_FACILITY_LIST_FETCH_ERROR)
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isSuperUser, listParams.page, listParams.rowsPerPage, listParams.searchTerm, countryId]);

  useEffect(() => {
    fetchList();
  }, [listParams, dispatch, fetchList]);

  /**
   * Handles request failures
   * @param {Error} e - The error object
   * @param {string} errorMessage - The error message to display
   */
  const requestFailure = (e: Error, errorMessage: string) =>
    toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, errorMessage));

  /**
   * Opens the edit dialogue for a health facility
   * @param {any} data - The health facility data
   */
  const openEditDialogue = (data: any) => {
    dispatch(
      fetchHFSummaryRequest({
        tenantId: data.tenantId,
        id: data.id,
        appTypes,
        successCb: openHFEditModal,
        failureCb: (e: Error) => {
          requestFailure(e, APPCONSTANTS.HEALTH_FACILITY_DETAILS_FETCH_ERROR);
        }
      })
    );
  };

  /**
   * Opens the health facility edit modal
   * @param {IHealthFacility} hfDetails - The health facility details
   */
  const openHFEditModal = (hfDetails: IHealthFacility) => {
    if (hfDetails) {
      setEditHFDetailsModal({
        ...editHealthFacilityModal,
        isOpen: true,
        data: {
          ...hfDetails,
          type: { id: hfDetails.type, name: hfDetails.type },
          city: { id: hfDetails.cityName, name: hfDetails.cityName },
          language: { id: hfDetails.language, name: hfDetails.language },
          workflows: hfDetails.clinicalWorkflows.map((wfIds: any) => wfIds.id),
          clinicalWorkflows: hfDetails.clinicalWorkflows.map((wfIds: any) => wfIds.id),
          customizedWorkflows: hfDetails?.customizedWorkflows?.map((wfIds: any) => wfIds.id),
          rawClinicalWorkflows: hfDetails.clinicalWorkflows,
          rawCustomizedWorkflows: hfDetails?.customizedWorkflows
        } as IHealthFacilityForm
      });
    } else {
      toastCenter.error(APPCONSTANTS.ERROR, APPCONSTANTS.HEALTH_FACILITY_SUMMARY_UPDATE_ERROR);
    }
  };

  /**
   * Closes the health facility edit modal
   * @param {boolean} [isFromCloseBtn] - Indicates if the close action is from the close button
   */
  const closeHealthFacilityEditModal = (isFromCloseBtn?: boolean) => {
    if (editHealthFacilityModal.isNextClicked && !isFromCloseBtn) {
      setEditHFDetailsModal({
        ...editHealthFacilityModal,
        isNextClicked: !editHealthFacilityModal.isNextClicked,
        isOpen: true
      });
    } else {
      setEditHFDetailsModal({
        isOpen: false,
        isNextClicked: false,
        data: {}
      });
      dispatch(clearHFWorkflowList());
    }
  };

  /**
   * Renders the health facility details form
   * @param {any} form - The form object
   * @returns {React.ReactElement} The rendered form
   */
  const editHealthFacilityDetailsModalRender = (form: any) => {
    return (
      <HealthFacilityDetailsForm
        formName='healthFacility'
        form={form}
        isEdit={true}
        data={{ ...editHealthFacilityModal.data }}
        isNextClicked={editHealthFacilityModal.isNextClicked}
      />
    );
  };

  const hfUpdateSuccess = () => {
    toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.HEALTH_FACILITY_DETAILS_UPDATE_SUCCESS);
    fetchList();
    closeHealthFacilityEditModal(true);
  };
  const fetchFailure = (e: Error, errorMessage: string) =>
    toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, errorMessage));

  // Fetches the workflow list
  const fetchWorkflowList = () => {
    dispatch(
      fetchWorkflowListRequest({
        countryId: Number(countryId),
        successCb: (flows) => {
          setEditHFDetailsModal({
            ...editHealthFacilityModal,
            isNextClicked: true
          });
        },
        failureCb: (error) =>
          toastCenter.error(
            ...getErrorToastArgs(error, APPCONSTANTS.ERROR, APPCONSTANTS.CLINICAL_WORKFLOW_FETCH_FAILURE)
          )
      })
    );
  };

  /**
   * Validates linked restrictions
   * @param {number[]} missingIds - The missing IDs
   * @param {number} hfTenantId - The health facility tenant ID
   * @param {any} healthFacility - The health facility data
   * @param {number[]} linkedVillageIds - The linked village IDs
   */
  const validateLinkedRestrictions = (
    missingIds: number[],
    hfTenantId: number,
    healthFacility: any,
    linkedVillageIds: number[]
  ) => {
    dispatch(
      validateLinkedRestrictionsRequest({
        ids: missingIds,
        tenantId: hfTenantId,
        healthFacilityId: healthFacility.id,
        linkedVillageIds,
        successCb: () => {
          fetchWorkflowList();
        },
        failureCb: (error) =>
          toastCenter.error(
            ...getErrorToastArgs(error, APPCONSTANTS.ERROR, APPCONSTANTS.CLINICAL_WORKFLOW_FETCH_FAILURE)
          )
      })
    );
  };

  /**
   * Handles the submission of health facility details
   * @param {any} healthFacility - The health facility data
   */
  const handleHealthFacilityDetailsSubmit = ({ healthFacility }: any) => {
    if (!editHealthFacilityModal.isNextClicked) {
      const peerIdsSet = new Set((healthFacility.peerSupervisors || []).map((obj: any) => obj.id));
      const linkedVillagesIds = [
        ...new Set((healthFacility.linkedVillages || []).map((obj: any) => Number(obj?.id)))
      ] as number[];
      const missingIds = [];
      for (const supervisor of editHealthFacilityModal.data.peerSupervisors) {
        if (!peerIdsSet.has(supervisor.id)) {
          missingIds.push(supervisor.id);
        }
      }
      validateLinkedRestrictions(missingIds, healthFacility.tenantId, healthFacility, linkedVillagesIds);
    } else {
      const postData = formatHealthFacility(healthFacility, countryId);
      if (postData?.clinicalWorkflowIds?.length || postData?.customizedWorkflowIds?.length) {
        dispatch(
          updateHFDetailsRequest({
            data: postData,
            successCb: hfUpdateSuccess,
            failureCb: (e) => {
              fetchFailure(e, APPCONSTANTS.HEALTH_FACILITY_DETAILS_UPDATE_ERROR);
            }
          })
        );
        closeHealthFacilityEditModal(true);
      } else {
        toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.WORKFLOW_SELECT_ERROR_MESSAGE);
      }
    }
  };

  /**
   * Opens the create health facility form
   */
  const openCreateHealthFacility = () => {
    const url = ((regionId && PROTECTED_ROUTES.createHealthFacilityByRegion) ||
      (districtId && PROTECTED_ROUTES.createHealthFacilityByDistrict) ||
      (chiefdomId && PROTECTED_ROUTES.createHealthFacilityByChiefdom)) as string;
    if (url) {
      history.push(
        url
          .replace(':tenantId', tenantId)
          .replace(/(:regionId)|(:districtId)|(:chiefdomId)/, (regionId || chiefdomId || districtId) as string)
      );
    }
  };

  /**
   * Handles the row click event
   * @param {any} data - The row data
   */
  const handleRowClick = (data: any) => {
    history.push(
      PROTECTED_ROUTES.healthFacilitySummary.replace(':healthFacilityId', data.id).replace(':tenantId', data.tenantId)
    );
  };

  return (
    <>
      {loading && <Loader />}
      <div className='col-12'>
        <DetailCard
          buttonLabel={`Add ${healthFacilitySName}`}
          header={healthFacilitySName}
          isSearch={true}
          onSearch={handleSearch}
          onButtonClick={openCreateHealthFacility}
        >
          <CustomTable
            rowData={healthFacilityList}
            columnsDef={[
              {
                id: 1,
                name: 'name',
                label: 'Name',
                width: '30%'
              },
              {
                id: 2,
                name: 'type',
                label: 'Type',
                width: '30%'
              },
              {
                id: 3,
                name: 'district',
                label: districtSName,
                width: '30%',
                cellFormatter: ({ district }) => district?.name
              },
              {
                id: 4,
                name: 'chiefdom',
                label: chiefdomSName,
                width: '30%',
                cellFormatter: ({ chiefdom }) => chiefdom?.name
              }
            ]}
            isDelete={false}
            isEdit={true}
            page={listParams.page}
            rowsPerPage={listParams.rowsPerPage}
            count={healthFacilityCount}
            onRowEdit={openEditDialogue}
            handlePageChange={handlePage}
            handleRowClick={handleRowClick}
            confirmationTitle={APPCONSTANTS.HEALTH_FACILITY_DELETE_CONFIRMATION}
            deleteTitle={APPCONSTANTS.HEALTH_FACILITY_DELETE_TITLE}
          />
        </DetailCard>
      </div>
      <ModalForm
        show={editHealthFacilityModal.isOpen}
        title={`Edit ${healthFacilitySName}`}
        cancelText={editHealthFacilityModal?.isNextClicked ? 'Back' : 'Cancel'}
        submitText={editHealthFacilityModal?.isNextClicked ? 'Submit' : 'Next'}
        handleCancel={closeHealthFacilityEditModal}
        handleFormSubmit={handleHealthFacilityDetailsSubmit}
        initialValues={{ healthFacility: editHealthFacilityModal.data }}
        mutators={arrayMutators}
        render={editHealthFacilityDetailsModalRender}
        size='modal-lg'
      />
    </>
  );
};

export default HealthFacilityList;
