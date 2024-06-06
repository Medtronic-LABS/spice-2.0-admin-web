import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import arrayMutators from 'final-form-arrays';

import DetailCard from '../../components/detailCard/DetailCard';
import CustomTable from '../../components/customTable/CustomTable';
import Loader from '../../components/loader/Loader';
import { PROTECTED_ROUTES } from '../../constants/route';
import ModalForm from '../../components/modal/ModalForm';
import { useTablePaginationHook } from '../../hooks/tablePagination';

import HealthFacilityDetailsForm from './HealthFacilityDetailsForm';
import { FormApi } from 'final-form';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import APPCONSTANTS from '../../constants/appConstants';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteHealthFacilityRequest,
  fetchHFListRequest,
  fetchHFSummaryRequest,
  fetchWorkflowListRequest,
  updateHFDetailsRequest
} from '../../store/healthFacility/actions';
import {
  healthFacilityListSelector,
  healthFacilityListTotalSelector,
  healthFacilityLoadingSelector
} from '../../store/healthFacility/selectors';
import { roleSelector, userDataSelector } from '../../store/user/selectors';
import { IHealthFacility, IHealthFacilityForm } from '../../store/healthFacility/types';
import { formatHealthFacility } from './HealthFacilitySummary';

interface IModalState {
  data?: any;
  isOpen: boolean;
}

const HealthFacilityList = (): React.ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const healthFacilityList = useSelector(healthFacilityListSelector);
  const healthFacilityCount = useSelector(healthFacilityListTotalSelector);
  const loading = useSelector(healthFacilityLoadingSelector);
  const role = useSelector(roleSelector);
  const regionData = useSelector(userDataSelector).country;
  const isSuperUser = [APPCONSTANTS.ROLES.SUPER_ADMIN, APPCONSTANTS.ROLES.SUPER_USER].includes(role);

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
        countryId: regionData.id,
        skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
        limit: listParams.rowsPerPage,
        searchTerm: listParams.searchTerm,
        userBased: !isSuperUser,
        failureCb: (e: Error) => requestFailure(e, APPCONSTANTS.HEALTH_FACILITY_LIST_FETCH_ERROR)
      })
    );
  }, [dispatch, isSuperUser, listParams.page, listParams.rowsPerPage, listParams.searchTerm, regionData.id]);

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

  const handleHealthFacilityDetailsSubmit = ({ healthFacility }: any) => {
    if (!submittedData.isNextClicked) {
      dispatch(
        fetchWorkflowListRequest({
          countryId: Number(regionData.id),
          successCb: (flows) => {
            setSubmittedData({
              data: {
                healthFacility: { ...healthFacility, workflows: healthFacility.clinicalWorkflows.map((v: any) => v.id) }
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
    } else {
      const postData = formatHealthFacility(healthFacility, regionData.id);
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
    const url = PROTECTED_ROUTES.createHealthFacility;
    history.push(url.replace(':regionId', regionData.id as string));
  };

  const handleRowClick = (data: any) => {
    history.push(
      PROTECTED_ROUTES.healthFacilitySummary.replace(':healthFacilityId', data.id).replace(':hfTenantId', data.tenantId)
    );
  };

  const handleHFDelete = useCallback(
    ({ data: { id, tenantId } }: { data: { id: number; tenantId: number } }) => {
      dispatch(
        deleteHealthFacilityRequest({
          data: {
            id,
            tenantId
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
          buttonLabel={`${isSuperUser ? 'Add Health Facility' : ''}`}
          header='Health Facility'
          isSearch={true}
          onSearch={handleSearch}
          onButtonClick={
            isSuperUser
              ? openCreateHealthFacility
              : () => {
                  //
                }
          }
        >
          <CustomTable
            rowData={healthFacilityList}
            columnsDef={[
              {
                id: 1,
                name: 'name',
                label: 'Name',
                width: '40%'
              },
              {
                id: 2,
                name: 'type',
                label: 'Type',
                width: '35%'
              },
              {
                id: 3,
                name: 'chiefdom',
                label: 'Chiefdom',
                width: '30%',
                cellFormatter: ({ chiefdom }) => chiefdom.name
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
        title={`Edit Health Facility`}
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
