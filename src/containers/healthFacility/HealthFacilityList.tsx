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
import APPCONSTANTS from '../../constants/appConstants';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import useCountryId from '../../hooks/useCountryId';
import {
  clearHFList,
  clearHFWorkflowList,
  fetchHFListRequest,
  fetchHFSummaryRequest,
  fetchHFTypesRequest,
  fetchHFTypesRequest,
  fetchWorkflowListRequest,
  updateHFDetailsRequest,
  updateHFStatusRequest,
  updateHFStatusRequest,
  validateLinkedRestrictionsRequest
} from '../../store/healthFacility/actions';
import { fetchDistrictsByCountryIdRequest } from '../../store/district/actions';
import { fetchDistrictsByCountryIdRequest } from '../../store/district/actions';
import {
  healthFacilityListSelector,
  healthFacilityListTotalSelector,
  healthFacilityLoadingSelector,
  hfTypesSelector
} from '../../store/healthFacility/selectors';
import { getAllDistrictListSelector } from '../../store/district/selectors';
import { IHealthFacility, IHealthFacilityForm } from '../../store/healthFacility/types';
import { roleSelector } from '../../store/user/selectors';
import { formatHealthFacility } from '../../utils/formatObjectUtils';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import HealthFacilityDetailsForm from '../createHealthFacility/HealthFacilityDetailsForm';
import { chiefdomListSelector as getAllChiefdomsSelector } from '../../store/healthFacility/selectors';
import { fetchChiefdomListRequest, clearChiefdomList } from '../../store/healthFacility/actions';
import { filterByAppTypes, formatUserToastMsg } from '../../utils/commonUtils';
import ConfirmationModalPopup from '../../components/customTable/ConfirmationModalPopup';

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
  const hfTypesList = useSelector(hfTypesSelector);
  const districtList = useSelector(getAllDistrictListSelector);
  const chiefdomList = useSelector(getAllChiefdomsSelector);
  const countryId = useCountryId();
  const isSuperUser = [APPCONSTANTS.ROLES.SUPER_ADMIN, APPCONSTANTS.ROLES.SUPER_USER].includes(role);
  const {
    appTypes,
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName },
    healthFacility: { s: healthFacilitySName, p: healthFacilityPName }
  } = useAppTypeConfigs();

  const { regionId, tenantId, districtId, chiefdomId } = useParams<IMatchParams>();

  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const [editHealthFacilityModal, setEditHFDetailsModal] = useState<IModalState>({
    isOpen: false,
    data: {} as IHealthFacilityForm,
    isNextClicked: false
  });
  const [filters, setFilters] = useState<any>({
    healthFacilityTypes: [],
    districtIds: [],
    chiefdomIds: [],
    skip: null
  });
  /**
   * Fetches the health facility list
   */
  const fetchList = useCallback(
    ({ skip = null, healthFacilityTypes = null, districtIds = null, chiefdomIds = null }: any) => {
      dispatch(
        fetchHFListRequest({
          countryId,
          skip: skip ?? (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
          limit: listParams.rowsPerPage,
          searchTerm: listParams.searchTerm,
          userBased: !isSuperUser,
          tenantIds: [tenantId],
          healthFacilityTypes: healthFacilityTypes ?? filters.healthFacilityTypes,
          districtIds: districtIds ?? filters.districtIds,
          chiefdomIds: chiefdomIds ?? filters.chiefdomIds,
          failureCb: (e: Error) =>
            requestFailure(e, formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_LIST_FETCH_ERROR, healthFacilityPName))
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      dispatch,
      isSuperUser,
      listParams.page,
      listParams.rowsPerPage,
      listParams.searchTerm,
      countryId,
      filters.districtIds
    ]
  );

  useEffect(() => {
    if (!hfTypesList.length) {
      dispatch(fetchHFTypesRequest({}));
    }
    setFilters({ ...filters, chiefdomIds: [] });
    if (!districtList.length) {
      dispatch(
        fetchDistrictsByCountryIdRequest({
          data: { countryId },
          failureCb: (e) =>
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.DISTRICT_FETCH_ERROR, chiefdomSName)
              )
            )
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, hfTypesList.length, districtList.length, chiefdomList.length, countryId]);

  useEffect(() => {
    dispatch(clearChiefdomList());
    setFilters({ ...filters, chiefdomIds: [] });
    if (filters.districtIds.length) {
      dispatch(
        fetchChiefdomListRequest({
          countryId: Number(countryId),
          districtIds: filters.districtIds
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.districtIds, districtId, countryId, tenantId]);

  useEffect(() => {
    fetchList({ ...filters });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchList, filters.districtIds, filters.chiefdomIds, filters.healthFacilityTypes, listParams]);

  useEffect(() => {
    return () => {
      dispatch(clearHFList());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          requestFailure(e, formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_DETAILS_FETCH_ERROR, healthFacilitySName));
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
      toastCenter.error(
        APPCONSTANTS.ERROR,
        formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_SUMMARY_UPDATE_ERROR, healthFacilitySName)
      );
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
    toastCenter.success(
      APPCONSTANTS.SUCCESS,
      formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_DETAILS_UPDATE_SUCCESS, healthFacilitySName)
    );
    fetchList({});
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
        appTypes,
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
      const postData = formatHealthFacility(healthFacility, countryId, appTypes);
      if (postData?.clinicalWorkflowIds?.length || postData?.customizedWorkflowIds?.length) {
        dispatch(
          updateHFDetailsRequest({
            data: postData,
            successCb: hfUpdateSuccess,
            failureCb: (e) => {
              fetchFailure(
                e,
                formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_DETAILS_UPDATE_ERROR, healthFacilitySName)
              );
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

  const handleFilterChange = (option: any, name: string) => {
    let newFilters = Object.assign({}, filters);
    let healthFacilityTypes: any = [];
    if (name === 'healthFacilityTypes') {
      healthFacilityTypes = hfTypesList.filter((data: any) => option.includes(data.id)).map((item: any) => item.name);
    }
    newFilters = {
      ...newFilters,
      [name]: option,
      ...(name === 'healthFacilityTypes' && { healthFacilityTypes }),
      skip: 0
    };
    if (!newFilters.districtIds.length) {
      newFilters.chiefdomIds = [];
    }
    handlePage(1);
    setFilters(newFilters);
  };

  const [openConfirmationModal, setOpenConfirmationModal] = useState({
    isOpen: false,
    userData: {} as IHealthFacility
  });

  const handleHFChangeStatusSubmit = (data?: any) => {
    dispatch(
      updateHFStatusRequest({
        id: openConfirmationModal.userData.id,
        tenantId: Number(openConfirmationModal.userData.tenantId),
        successCb: (newdata: any) => {
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.HEALTH_FACILITY_DEACTIVATE_SUCCESS);
          fetchList({});
          setOpenConfirmationModal({ isOpen: false, userData: {} as IHealthFacility });
        },
        failureCb: (e) => {
          setOpenConfirmationModal({ isOpen: false, userData: {} as IHealthFacility });
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, e.message));
        }
      })
    );
  };

  return (
    <>
      {loading && <Loader />}
      <div className='col-12'>
        <DetailCard
          buttonLabel={'Add'}
          header={healthFacilitySName}
          isSearch={true}
          onSearch={handleSearch}
          onButtonClick={openCreateHealthFacility}
          onChange={handleFilterChange}
          updatedFilterData={filters}
          isFilter={true}
          onFilterData={[
            {
              id: 1,
              name: 'Type',
              key: 'healthFacilityTypes',
              isFacility: false,
              isGeneric: true,
              isSearchable: false,
              data: filterByAppTypes(hfTypesList, appTypes),
              isShow: true
            },
            {
              id: 2,
              name: 'District',
              key: 'districtIds',
              isFacility: false,
              isGeneric: true,
              isSearchable: true,
              placeholder: 'Search District',
              data: districtList,
              isShow: true
            },
            {
              id: 3,
              name: 'Chiefdom',
              key: 'chiefdomIds',
              isFacility: false,
              isGeneric: true,
              isSearchable: true,
              placeholder: 'Search Chiefdom',
              data: chiefdomList,
              isShow: true
            }
          ]}
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
            confirmationTitle={formatUserToastMsg(
              APPCONSTANTS.HEALTH_FACILITY_DELETE_CONFIRMATION,
              healthFacilitySName
            )}
            deleteTitle={formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_DELETE_TITLE, healthFacilitySName)}
            isActiveToggle={true}
            isActiveKey='isActive'
            onActivateClick={(rowData: any) => {
              setOpenConfirmationModal({ isOpen: true, userData: rowData });
            }}
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
      <ConfirmationModalPopup
        isOpen={openConfirmationModal.isOpen}
        popupTitle='Deactivate Health Facility'
        cancelText='Canel'
        submitText='Submit'
        handleCancel={() => setOpenConfirmationModal({ isOpen: false, userData: {} as IHealthFacility })}
        handleSubmit={handleHFChangeStatusSubmit}
        confirmationMessage={APPCONSTANTS.HEALTH_FACILITY_DEACTIVATE_CONFIRMATION}
        popupSize='modal-md'
      />
    </>
  );
};

export default HealthFacilityList;
