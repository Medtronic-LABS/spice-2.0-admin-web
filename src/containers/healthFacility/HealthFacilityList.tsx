import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import arrayMutators from 'final-form-arrays';

import DetailCard from '../../components/detailCard/DetailCard';
import CustomTable from '../../components/customTable/CustomTable';
import Loader from '../../components/loader/Loader';
import { PROTECTED_ROUTES } from '../../constants/route';
import ModalForm from '../../components/modal/ModalForm';
import { useTablePaginationHook } from '../../hooks/tablePagination';

import HealthFacilityDetailsForm from '../createHealthFacility/HealthFacilityDetailsForm';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import { useDispatch, useSelector } from 'react-redux';
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
  healthFacilityLoadingSelector,
  workflowListSelector
} from '../../store/healthFacility/selectors';
import { countryIdSelector, roleSelector } from '../../store/user/selectors';
import { IHealthFacility, IHealthFacilityForm } from '../../store/healthFacility/types';
import { formatHealthFacility } from './HealthFacilitySummary';
import sessionStorageServices from '../../global/sessionStorageServices';

interface IModalState {
  data?: any;
  isOpen: boolean;
  isNextClicked: boolean;
}

interface IMatchParams {
  regionId?: string;
  tenantId: string;
  districtId?: string;
  chiefdomId?: string;
}

const HealthFacilityList = (): React.ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const workflows = useSelector(workflowListSelector);
  const healthFacilityList = useSelector(healthFacilityListSelector);
  const healthFacilityCount = useSelector(healthFacilityListTotalSelector);
  const loading = useSelector(healthFacilityLoadingSelector);
  const role = useSelector(roleSelector);
  const countryId = useSelector(countryIdSelector);
  const countryIdValue = countryId?.id || sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID);
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
   * to load Health Facility List data.
   * @param healthFacility List
   */
  const fetchList = useCallback(() => {
    dispatch(
      fetchHFListRequest({
        countryId: countryIdValue,
        skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
        limit: listParams.rowsPerPage,
        searchTerm: listParams.searchTerm,
        userBased: !isSuperUser,
        tenantIds: [tenantId],
        failureCb: (e: Error) => requestFailure(e, APPCONSTANTS.HEALTH_FACILITY_LIST_FETCH_ERROR)
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isSuperUser, listParams.page, listParams.rowsPerPage, listParams.searchTerm, countryIdValue]);

  useEffect(() => {
    fetchList();
  }, [listParams, dispatch, fetchList]);

  const requestFailure = (e: Error, errorMessage: string) =>
    toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, errorMessage));

  const openEditDialogue = (data: any) => {
    dispatch(
      fetchHFSummaryRequest({
        tenantId: data.tenantId,
        id: data.id,
        successCb: openHFEditModal,
        failureCb: (e: Error) => {
          requestFailure(e, APPCONSTANTS.HEALTH_FACILITY_DETAILS_FETCH_ERROR);
        }
      })
    );
  };

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

  const fetchWorkflowList = (healthFacility: any) => {
    if (!workflows.length) {
      dispatch(
        fetchWorkflowListRequest({
          countryId: Number(countryIdValue),
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
    } else {
      setEditHFDetailsModal({
        ...editHealthFacilityModal,
        isNextClicked: true
      });
    }
  };

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
          fetchWorkflowList(healthFacility);
        },
        failureCb: (error) =>
          toastCenter.error(
            ...getErrorToastArgs(error, APPCONSTANTS.ERROR, APPCONSTANTS.CLINICAL_WORKFLOW_FETCH_FAILURE)
          )
      })
    );
  };

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
      const postData = formatHealthFacility(healthFacility, countryIdValue);
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
  const openCreateHealthFacility = () => {
    const url = ((regionId && PROTECTED_ROUTES.createHealthFacilityByRegion) ||
      (districtId && PROTECTED_ROUTES.createHealthFacilityByDistrict) ||
      (chiefdomId && PROTECTED_ROUTES.createHealthFacilityByChiefdom)) as string;
    history.push(
      url
        .replace(':tenantId', tenantId)
        .replace(/(:regionId)|(:districtId)|(:chiefdomId)/, (regionId || chiefdomId || districtId) as string)
    );
  };

  const handleRowClick = (data: any) => {
    history.push(
      PROTECTED_ROUTES.healthFacilitySummary.replace(':healthFacilityId', data.id).replace(':tenantId', data.tenantId)
    );
  };

  const handleHFDelete = useCallback(
    ({ data: { id, tenantId: hfTenantId } }: { data: { id: number; tenantId: number } }) => {
      dispatch(
        deleteHealthFacilityRequest({
          data: {
            id,
            tenantId: hfTenantId
          },
          successCb: () => {
            toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.HEALTH_FACILITY_DELETE_SUCCESS);
            fetchList();
          },
          failureCb: (e) => {
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.HEALTH_FACILITY_DELETE_FAIL));
          }
        })
      );
    },
    [dispatch, fetchList]
  );

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
            onDeleteClick={handleHFDelete}
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
