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
import { FormApi } from 'final-form';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteHealthFacilityRequest,
  fetchHFListRequest,
  fetchHFSummaryRequest,
  fetchWorkflowListRequest,
  updateHFDetailsRequest,
  validationPeerSupervisor
} from '../../store/healthFacility/actions';
import {
  healthFacilityListSelector,
  healthFacilityListTotalSelector,
  healthFacilityLoadingSelector
} from '../../store/healthFacility/selectors';
import { countryIdSelector, roleSelector } from '../../store/user/selectors';
import { IHealthFacility, IHealthFacilityForm } from '../../store/healthFacility/types';
import { formatHealthFacility } from './HealthFacilitySummary';
import sessionStorageServices from '../../global/sessionStorageServices';

interface IModalState {
  data?: any;
  isOpen: boolean;
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
    data: {} as IHealthFacilityForm
  });
  const [submittedData, setSubmittedData] = useState({ data: {}, isNextClicked: false });

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
        isOpen: true,
        data: {
          ...hfDetails,
          type: { id: hfDetails.type, name: hfDetails.type },
          city: { id: hfDetails.cityName, name: hfDetails.cityName },
          language: { id: hfDetails.language, name: hfDetails.language },
          workflows: hfDetails.clinicalWorkflows.map((wfIds: any) => wfIds.id)
        } as IHealthFacilityForm
      });
    } else {
      toastCenter.error(APPCONSTANTS.ERROR, APPCONSTANTS.HEALTH_FACILITY_SUMMARY_UPDATE_ERROR);
    }
  };

  const closeHealthFacilityEditModal = (isFromCloseBtn?: boolean) => {
    if (submittedData.isNextClicked && !isFromCloseBtn) {
      setSubmittedData({ ...submittedData, isNextClicked: !submittedData.isNextClicked });
    } else {
      setEditHFDetailsModal({
        ...editHealthFacilityModal,
        isOpen: false
      });
      setSubmittedData({ ...submittedData, isNextClicked: false });
    }
  };

  const editHealthFacilityDetailsModalRender = (form: any) => {
    return (
      <HealthFacilityDetailsForm
        formName='healthFacility'
        form={form as FormApi<any>}
        isEdit={true}
        data={editHealthFacilityModal.data}
        submittedData={submittedData}
      />
    );
  };

  const hfUpdateSuccess = () => {
    toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.HEALTH_FACILITY_DETAILS_UPDATE_SUCCESS);
    fetchList();
    closeHealthFacilityEditModal();
  };
  const fetchFailure = (e: Error, errorMessage: string) =>
    toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, errorMessage));

  const fetchWorkflowList = (healthFacility: any) =>
    dispatch(
      fetchWorkflowListRequest({
        countryId: Number(countryIdValue),
        successCb: (flows) => {
          setSubmittedData({
            data: {
              healthFacility: {
                ...healthFacility,
                workflows: healthFacility.clinicalWorkflows.map((v: any) => v.id)
              }
            },
            isNextClicked: true
          });
        },
        failureCb: (error) =>
          toastCenter.error(
            ...getErrorToastArgs(error, APPCONSTANTS.ERROR, APPCONSTANTS.CLINICAL_WORKFLOW_FETCH_SUCCESS)
          )
      })
    );

  const validatePeerSupervisor = (missingIds: number[], hfTenantId: number, healthFacility: any) => {
    dispatch(
      validationPeerSupervisor({
        ids: missingIds,
        tenantId: hfTenantId,
        successCb: () => {
          fetchWorkflowList(healthFacility);
        },
        failureCb: (error) =>
          toastCenter.error(
            ...getErrorToastArgs(error, APPCONSTANTS.ERROR, APPCONSTANTS.CLINICAL_WORKFLOW_FETCH_SUCCESS)
          )
      })
    );
  };

  const handleHealthFacilityDetailsSubmit = ({ healthFacility }: any) => {
    if (!submittedData.isNextClicked) {
      const peerIdsSet = new Set((healthFacility.peerSupervisors || []).map((obj: any) => obj.id));
      const missingIds = [];
      for (const supervisor of editHealthFacilityModal.data.peerSupervisors) {
        if (!peerIdsSet.has(supervisor.id)) {
          missingIds.push(supervisor.id);
        }
      }
      validatePeerSupervisor(missingIds, healthFacility.tenantId, healthFacility);
    } else {
      const postData = formatHealthFacility(healthFacility, countryIdValue);
      if (postData.clinicalWorkflowIds.length) {
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

  const adminPSRoles = ['HEALTH_FACILITY_ADMIN', 'PROVIDER', 'MID_WIFE', 'LAB_ASSISTANT', 'SRN', 'PEER_SUPERVISOR'];

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
                cellFormatter: ({ chiefdom }) => chiefdom?.name
              }
            ]}
            isDelete={!adminPSRoles.includes(role)}
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
        cancelText={submittedData?.isNextClicked ? 'Back' : 'Cancel'}
        submitText={submittedData?.isNextClicked ? 'Submit' : 'Next'}
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
