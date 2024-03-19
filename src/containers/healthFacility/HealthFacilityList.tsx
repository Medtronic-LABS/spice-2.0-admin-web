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
import { fetchHFListRequest, fetchHFSummaryRequest, updateHFDetailsRequest } from '../../store/healthFacility/actions';
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

  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const [editHealthFacilityModal, setEditHFDetailsModal] = useState<IModalState>({
    isOpen: false,
    data: {} as IHealthFacilityForm
  });

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
        userBased: role !== (APPCONSTANTS.ROLES.SUPER_ADMIN || APPCONSTANTS.ROLES.SUPER_USER),
        failureCb: (e: Error) => requestFailure(e, APPCONSTANTS.HEALTH_FACILITY_LIST_FETCH_ERROR)
      })
    );
  }, [dispatch, listParams.page, listParams.rowsPerPage, listParams.searchTerm, regionData.id, role]);

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
          language: { id: hfDetails.language, name: hfDetails.language }
        } as IHealthFacilityForm
      });
    } else {
      toastCenter.error(APPCONSTANTS.ERROR, APPCONSTANTS.HEALTH_FACILITY_SUMMARY_UPDATE_ERROR);
    }
  };

  const closeHealthFacilityEditModal = () => {
    setEditHFDetailsModal({
      isOpen: false
    });
  };

  const editHealthFacilityDetailsModalRender = (form: any) => {
    return <HealthFacilityDetailsForm form={form as FormApi<any>} isEdit={true} data={editHealthFacilityModal.data} />;
  };

  const hfUpdateSuccess = () => {
    toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.HEALTH_FACILITY_DETAILS_UPDATE_SUCCESS);
    fetchList();
    closeHealthFacilityEditModal();
  };
  const fetchFailure = (e: Error, errorMessage: string) =>
    toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, errorMessage));

  const handleHealthFacilityDetailsSubmit = ({ healthFacility }: any) => {
    const postData = formatHealthFacility(healthFacility, regionData.id);
    dispatch(
      updateHFDetailsRequest({
        data: postData,
        successCb: hfUpdateSuccess,
        failureCb: (e) => {
          closeHealthFacilityEditModal();
          fetchFailure(e, APPCONSTANTS.HEALTH_FACILITY_DETAILS_UPDATE_ERROR);
        }
      })
    );
  };

  const openCreateHealthFacility = () => {
    const url = PROTECTED_ROUTES.createHealthFacility;
    history.push(url.replace(':regionId', regionData.id as string));
  };

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
          buttonLabel='Add Health Facility'
          header='Health Facility'
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
                width: '40%'
              },
              {
                id: 2,
                name: 'type',
                label: 'Type',
                width: '20%'
              },
              {
                id: 3,
                name: 'chiefdom',
                label: 'Chiefdom',
                width: '40%',
                cellFormatter: (chiefdom) => chiefdom.name
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
          />
        </DetailCard>
      </div>
      <ModalForm
        show={editHealthFacilityModal.isOpen}
        title={`Edit Health Facility`}
        cancelText='Cancel'
        submitText='Submit'
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
