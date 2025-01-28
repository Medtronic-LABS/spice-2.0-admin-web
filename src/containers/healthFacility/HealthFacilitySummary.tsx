import arrayMutators from 'final-form-arrays';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { FormApi } from 'final-form';
import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import Loader from '../../components/loader/Loader';
import ModalForm from '../../components/modal/ModalForm';
import UserForm from '../../components/userForm/UserForm';
import APPCONSTANTS from '../../constants/appConstants';
import sessionStorageServices from '../../global/sessionStorageServices';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import {
  clearHFWorkflowList,
  clearSupervisorList,
  clearVillageHFList,
  createHFUserRequest,
  deleteHFUserRequest,
  fetchHFSummaryRequest,
  fetchHFUserListRequest,
  fetchUserDetailRequest,
  fetchWorkflowListRequest,
  updateHFDetailsRequest,
  updateHFUserRequest,
  validateLinkedRestrictionsRequest
} from '../../store/healthFacility/actions';
import {
  healthFacilityLoadingSelector,
  healthFacilitySelector,
  userDetailLoadingSelector,
  workflowListSelector
} from '../../store/healthFacility/selectors';
import {
  IHFUserGet,
  IHFUserPost,
  IHealthFacility,
  IHealthFacilityForm,
  IPeerSupervisor,
  IVillages
} from '../../store/healthFacility/types';
import { countryIdSelector, roleSelector, userRolesSelector } from '../../store/user/selectors';
import { formatRoles, formatUserToastMsg } from '../../utils/commonUtils';
import { formatHealthFacility, getUserPayload } from '../../utils/formatObjectUtils';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import HealthFacilityDetailsForm from '../createHealthFacility/HealthFacilityDetailsForm';

interface IMatchParams {
  healthFacilityId: string;
  tenantId: string;
}

interface ISummaryUsersState {
  data?: any[];
  total?: number;
  loading: boolean;
}

interface IModalState {
  data?: any;
  isOpen: boolean;
  isNextClicked: boolean;
}

const HealthFacilitySummary = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { healthFacilityId, tenantId } = useParams<IMatchParams>();
  const healthFacility = useSelector(healthFacilitySelector);
  const loading = useSelector(healthFacilityLoadingSelector);
  const countryId = useSelector(countryIdSelector);
  const countryIdValue = countryId?.id || sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID);
  const role = useSelector(roleSelector);
  const hfUserDetailLoading = useSelector(userDetailLoadingSelector);
  const rolesGrouped = useSelector(userRolesSelector);
  const workflows = useSelector(workflowListSelector);

  const [editHFDetailsModal, setEditHFDetailsModal] = useState<IModalState>({
    isOpen: false,
    isNextClicked: false
  });
  const [hfUsers, setHFUsers] = useState<ISummaryUsersState>({
    loading: false
  });
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const { HEALTH_FACILITY_ADMIN } = APPCONSTANTS.ROLES;

  const [showHFUserModal, setHFUserModal] = useState(false);
  const [isHFUserEdit, setIsHFUserEdit] = useState(false);
  const hfUserForEdit = useRef<{ users: any[] }>({ users: [] });
  const {
    isCommunity,
    appTypes,
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName },
    healthFacility: { s: healthFacilitySName },
    hfDetails: { supervisor: supervisorLabel }
  } = useAppTypeConfigs();
  const lableData = useMemo(
    () => [
      { label: `${healthFacilitySName} Name`, value: healthFacility?.name },
      { label: `${healthFacilitySName} Type`, value: healthFacility?.type },
      {
        label: `${isCommunity ? 'PHU Focal Person Name' : 'Facility Incharge'}`,
        value: healthFacility?.phuFocalPersonName
      },
      {
        label: `${isCommunity ? 'PHU Focal Person No' : 'Facility Incharge No'}`,
        value: healthFacility?.phuFocalPersonNumber
      },
      { label: districtSName, value: healthFacility?.district?.name },
      { label: chiefdomSName, value: healthFacility?.chiefdom?.name },
      { label: 'Address', value: healthFacility?.address },
      { label: 'City/Village', value: healthFacility?.cityName },
      { label: 'Latitude', value: healthFacility?.latitude },
      { label: 'Longitude', value: healthFacility?.longitude },
      { label: 'Facility ID', value: healthFacility?.postalCode },
      { label: 'Language', value: healthFacility?.language },
      {
        label: supervisorLabel,
        value: healthFacility?.peerSupervisors,
        subKey: 'name',
        style: { col: 'col-12', subCol: 'col-3' }
      },
      {
        label: 'Linked Villages',
        value: healthFacility?.linkedVillages,
        subKey: 'name',
        style: { col: 'col-12', subCol: 'col-3' }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [healthFacility]
  );

  /*
   * To Handle initial data loading, pagination and search
   * requests for users table
   */
  useEffect(() => {
    refreshHFUserList();
    refreshHFDetails();
    return () => {
      clearSupervisorList();
      clearVillageHFList();
    };
    // eslint-disable-next-line
  }, [listParams, tenantId, dispatch]);

  /*
   * Load initial health facility summary details
   */
  const refreshHFDetails = useCallback(() => {
    dispatch(
      fetchHFSummaryRequest({
        tenantId: Number(tenantId),
        id: Number(healthFacilityId),
        appTypes,
        failureCb: (e) => {
          fetchFailure(e, formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_DETAILS_FETCH_ERROR, healthFacilitySName));
        }
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appTypes, dispatch, healthFacilityId, tenantId]);

  const fetchFailure = (e: Error, errorMessage: string) =>
    toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, errorMessage));

  /**
   * Refreshes the list of health facility (HF) users by fetching data based on the current list parameters.
   * It sets the loading state, dispatches a request to fetch the HF users, and handles success or failure accordingly.
   *
   * @returns {void}
   */
  const refreshHFUserList = (): void => {
    setHFUsers((prevState) => ({ ...prevState, loading: true }));
    // Dispatch a request to fetch the list of HF users
    dispatch(
      fetchHFUserListRequest({
        countryId: countryIdValue,
        tenantIds: [tenantId],
        roleNames: [], // Fetch users with any role
        skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
        limit: listParams.rowsPerPage,
        searchTerm: listParams.searchTerm,
        userBased: !(role === APPCONSTANTS.ROLES.SUPER_ADMIN || role === APPCONSTANTS.ROLES.SUPER_USER),
        tenantBased: true,
        isSiteUsers: null,
        successCb: turnOffUsersTableLoading,
        failureCb: (e: Error) => {
          turnOffUsersTableLoading();
          fetchFailure(e, formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_USERS_FETCH_ERROR, healthFacilitySName));
        }
      })
    );
  };

  /**
   * Updates the user table state by turning off the loading indicator and setting the data and total count.
   *
   * @param {IHFUserGet[] | any[]} [data=[]] - The user data to display in the table. Defaults to an empty array.
   * @param {number} [total=0] - The total number of users. Defaults to 0.
   *
   * @returns {void}
   */
  const turnOffUsersTableLoading = (data: IHFUserGet[] | [] = [], total: number = 0): void => {
    setHFUsers((prevState) => ({
      ...prevState,
      data,
      total,
      loading: false
    }));
  };

  const openHFEditModal = () => {
    if (healthFacility) {
      setEditHFDetailsModal({
        ...editHFDetailsModal,
        isOpen: true,
        data: {
          ...healthFacility,
          type: { id: healthFacility.type, name: healthFacility.type },
          city: { id: healthFacility.cityName, name: healthFacility.cityName },
          language: { id: healthFacility.language, name: healthFacility.language },
          rawClinicalWorkflows: healthFacility.clinicalWorkflows,
          rawCustomizedWorkflows: healthFacility?.customizedWorkflows,
          clinicalWorkflows: healthFacility.clinicalWorkflows.map((wfIds: any) => wfIds.id),
          customizedWorkflows: healthFacility?.customizedWorkflows?.map((wfIds: any) => wfIds.id)
        } as IHealthFacilityForm
      });
    } else {
      toastCenter.info('');
    }
  };

  /**
   * Closes the health facility edit modal
   * @param {boolean} [isFromCloseBtn] - Flag indicating if the close button was clicked
   */
  const closeHFEditModal = (isFromCloseBtn?: boolean) => {
    if (editHFDetailsModal.isNextClicked && !isFromCloseBtn) {
      setEditHFDetailsModal({ ...editHFDetailsModal, isNextClicked: !editHFDetailsModal.isNextClicked });
    } else {
      setEditHFDetailsModal({
        isOpen: false,
        isNextClicked: false
      });
      dispatch(clearHFWorkflowList());
    }
  };

  /**
   * Renders the health facility details form
   * @param {any} form - The form data
   * @returns {React.ReactElement} The rendered health facility details form
   */
  const editHFDetailsModalRender = (form: any): React.ReactElement => {
    return (
      <HealthFacilityDetailsForm
        formName='healthFacility'
        form={form}
        isEdit={true}
        data={{ ...editHFDetailsModal.data }}
        isNextClicked={editHFDetailsModal.isNextClicked}
      />
    );
  };

  /**
   * Fetches the workflow list for the health facility. If workflows are not yet loaded, it dispatches a request to
   * fetch the workflows. If workflows are already available, it skips the fetch and proceeds with the next step.
   *
   * @returns {void}
   */
  const fetchWorkflowList = (): void => {
    if (!workflows.length) {
      dispatch(
        fetchWorkflowListRequest({
          countryId: Number(countryIdValue),
          successCb: (flows) => {
            setEditHFDetailsModal({
              ...editHFDetailsModal,
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
        ...editHFDetailsModal,
        isNextClicked: true
      });
    }
  };

  /**
   * Validates linked restrictions for a health facility, checking missing supervisors and linked village IDs.
   * If validation succeeds, it fetches the workflow list for the health facility.
   *
   * @param {number[]} missingIds - The IDs of supervisors that are missing or need to be validated.
   * @param {number} hfTenantId - The tenant ID of the health facility.
   * @param {any} healthFacilityParams - Parameters related to the health facility.
   * @param {number[]} linkedVillageIds - The IDs of the villages linked to the health facility.
   *
   * @returns {void}
   */
  const validateLinkedRestrictions = (
    missingIds: number[],
    hfTenantId: number,
    healthFacilityParams: any,
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
   * Handles the submission of health facility (HF) details.
   * If the next button hasn't been clicked, it validates the linked restrictions (supervisors and villages),
   * otherwise, it updates the health facility details.
   *
   * @param {Object} formData - The submitted form data.
   * @param {IHealthFacility} formData.healthFacility - The health facility details from the form.
   *
   * @returns {void}
   */
  const handleHFEditDetailsSubmit = ({ healthFacility: healthFacilityData }: { healthFacility: IHealthFacility }) => {
    const postData = formatHealthFacility(healthFacilityData, countryIdValue, appTypes);
    if (!editHFDetailsModal.isNextClicked) {
      const peerSupervisors = healthFacilityData?.peerSupervisors ?? [];
      const linkedVillages = healthFacilityData?.linkedVillages ?? [];
      const peerIdsSet = peerSupervisors?.map((obj: any) => obj.id);
      const linkedVillagesIds = linkedVillages?.map((obj: any) => Number(obj.id));
      const missingIds: number[] = [];
      for (const supervisor of editHFDetailsModal?.data?.peerSupervisors) {
        if (!peerIdsSet.includes(supervisor.id)) {
          missingIds.push(supervisor.id);
        }
      }
      validateLinkedRestrictions(missingIds, Number(healthFacilityData.tenantId), healthFacility, linkedVillagesIds);
    } else {
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
        closeHFEditModal(true);
      }
    }
  };

  /**
   * Handles the success response after updating health facility details
   */
  const hfUpdateSuccess = () => {
    toastCenter.success(
      APPCONSTANTS.SUCCESS,
      formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_DETAILS_UPDATE_SUCCESS, healthFacilitySName)
    );
    refreshHFDetails();
    refreshHFUserList();
    closeHFEditModal(true);
  };

  /**
   * Handles the click event to edit a health facility user
   * @param {any} user - The user data
   */
  const handleEditUserClick = useCallback(
    (user: any) => {
      dispatch(
        fetchUserDetailRequest({
          id: Number(user?.id),
          successCb: (userData: any) => {
            setIsHFUserEdit(true);
            const postData = { ...userData };
            hfUserForEdit.current = { users: [{ ...postData }] };
            setHFUserModal(true);
          },
          failureCb: (e) => {
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.USER_DETAIL_FETCH_FAIL));
          }
        })
      );
    },
    [dispatch]
  );

  /**
   * Common submit handler for user add and edit
   * @param {IHFUserPost} data - API Payload data
   * @param {any} actionFn - redux action function
   * @param {any} successCB - callback for api success
   * @param {any} failureCB - callback for api failure
   */
  const onSubmitHandler = useCallback(
    (data: IHFUserPost, actionFn: any, successCB: (data: any) => void, failureCB: (error: any) => void) => {
      dispatch(actionFn({ data, successCb: successCB, failureCb: failureCB }));
    },
    [dispatch]
  );

  /**
   * Handles the submission of user details for adding a new health facility (HF) user.
   * It processes the user data, formats it into the required payload, and dispatches a request to create the user.
   *
   * @param {Object} formData - The submitted form data.
   * @param {IHFUserPost[]} formData.users - An array of user objects from the form.
   *
   * @returns {void}
   */
  const handleAddEditUserSubmit = ({ users }: { users: IHFUserPost[] }): void => {
    const userObj = getUserPayload({
      appTypes,
      userFormData: users,
      countryId: countryIdValue,
      tenantId,
      spiceRolesGroup: rolesGrouped?.SPICE
    });
    const data: IHFUserPost = userObj[0];
    const isUserEdit = isHFUserEdit || data.id;
    onSubmitHandler(
      data,
      isUserEdit ? updateHFUserRequest : createHFUserRequest,
      healthfacilityUserSuccess,
      (e: Error) => {
        if (isUserEdit) {
          setHFUserModal(false);
        }
        fetchFailure(
          e,
          isUserEdit
            ? formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_USER_UPDATE_ERROR, healthFacilitySName)
            : formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_USER_CREATE_ERROR, healthFacilitySName)
        );
      }
    );
  };

  /**
   * Handles the success response after creating or updating a health facility (HF) user.
   *
   * @returns {void}
   */
  const healthfacilityUserSuccess = (): void => {
    // Determine the success message based on whether it's an edit or create action
    const successMessage = isHFUserEdit
      ? formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_USER_UPDATE_SUCCESS, healthFacilitySName)
      : formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_USER_CREATE_SUCCESS, healthFacilitySName);

    toastCenter.success(APPCONSTANTS.SUCCESS, successMessage);

    if (isHFUserEdit) {
      refreshHFUserList();
      refreshHFDetails();
    } else {
      // If creating a new user, reset the search
      handleSearch('');
    }
    setHFUserModal(false);
  };

  /**
   * Handles the click event to add a health facility user
   */
  const handleAddUserClick = useCallback(() => {
    setIsHFUserEdit(false);
    hfUserForEdit.current = { users: [] };
    setHFUserModal(true);
  }, [hfUserForEdit]);

  /**
   * Handles the click event to delete a health facility user
   * @param {Object} param0 - The delete parameters
   */
  const handleUserDelete = ({ data: { id } }: { data: { id: number } }) => {
    dispatch(
      deleteHFUserRequest({
        data: {
          id,
          appTypes,
          countryId: countryIdValue,
          tenantIds: [Number(tenantId)]
        },
        successCb: () => {
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_USER_DELETE_SUCCESS, healthFacilitySName)
          );
          refreshHFUserList();
          refreshHFDetails();
        },
        failureCb: (e) => {
          fetchFailure(e, formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_USER_DELETE_FAIL, healthFacilitySName));
        }
      })
    );
  };

  /**
   * Formats a user's phone number by combining the country code and phone number for hf summary.
   *
   * @param {Object} user - The user object containing phone information.
   * @param {string} user.countryCode - The country code of the user's phone number.
   * @param {string} user.phoneNumber - The user's phone number.
   *
   * @returns {string} - The formatted phone number string in the format: "+ {countryCode} {phoneNumber}".
   */
  const formatPhone = (user: { countryCode: string; phoneNumber: string }): string => {
    return `${user.countryCode && '+ ' + user.countryCode} ${user.phoneNumber}`;
  };

  /**
   * Formats a user's full name by combining the first name and last name for summary details.
   *
   * @param {Object} user - The user object containing name information.
   * @param {string} user.firstName - The user's first name.
   * @param {string} user.lastName - The user's last name.
   *
   * @returns {string} - The formatted full name string in the format: "{firstName} {lastName}".
   */
  const formatName = (user: { firstName: string; lastName: string }): string => {
    return `${user.firstName} ${user.lastName}`;
  };

  const userFormRender = (form?: FormApi<any>) => {
    return (
      <UserForm
        form={form as FormApi<any>}
        countryId={countryIdValue}
        initialEditValue={hfUserForEdit.current.users[0]}
        disableOptions={true}
        isEdit={isHFUserEdit}
        entityName='healthFacility'
        isSiteUser={true}
        enableAutoPopulate={true}
        hfTenantId={Number(tenantId)}
        parentOrgId={healthFacility?.chiefdom?.tenantId}
        ignoreTenantId={tenantId}
        appTypes={appTypes}
        userFormParams={{ isHF: true }}
      />
    );
  };

  /**
   * Checks if the action icons should be hidden for a given row data
   * @param {any} rowData - The row data
   * @returns {boolean} - True if the action icons should be hidden, false otherwise
   */
  const isHideActionIcons = (rowData: any): boolean =>
    role === HEALTH_FACILITY_ADMIN &&
    (rowData?.defaultRoleName === HEALTH_FACILITY_ADMIN ||
      rowData.roles?.some((r: { name: string }) => r?.name === HEALTH_FACILITY_ADMIN));

  return (
    <>
      {(loading || hfUserDetailLoading) && <Loader />}
      <div className='row g-0dot625'>
        <div className='col-12'>
          <DetailCard
            buttonLabel={`Edit ${healthFacilitySName}`}
            isEdit={true}
            header={`${healthFacilitySName} Summary`}
            onButtonClick={openHFEditModal}
          >
            <div className='row gy-1 mt-0dot25 mb-1dot25 mx-0dot5'>
              {lableData.map(({ label, value, style, subKey }, index) => (
                <div
                  key={typeof label === 'string' ? label : index}
                  className={`${style?.col ? style.col : 'col-lg-4 col-sm-6'}`}
                >
                  <div className='fs-0dot875 charcoal-grey-text'>{typeof label === 'string' ? label : label.s}</div>
                  {Array.isArray(value) ? (
                    <ol className='row'>
                      {[...value].map((data: IPeerSupervisor | IVillages) => (
                        <li
                          key={subKey && (data as any)[subKey] ? (data as any)[subKey] : JSON.stringify(data)}
                          className={`${style?.subCol ? style?.subCol : 'col-3'}`}
                        >
                          {subKey && (data as any)[subKey] ? (data as any)[subKey] : JSON.stringify(data)}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className='primary-title text-ellipsis'>{value || '--'}</div>
                  )}
                </div>
              ))}
            </div>
          </DetailCard>
        </div>
        <div className='col-12'>
          <DetailCard
            buttonLabel='Add User'
            header='Users'
            isSearch={true}
            onSearch={handleSearch}
            searchPlaceholder={APPCONSTANTS.SEARCH_BY_NAME_EMAIL}
            onButtonClick={handleAddUserClick}
          >
            <CustomTable
              rowData={hfUsers.data || []}
              loading={hfUsers.loading && !(loading || hfUserDetailLoading)}
              columnsDef={[
                {
                  id: 1,
                  name: 'name',
                  label: 'NAME',
                  width: '20%',
                  cellFormatter: formatName
                },
                { id: 2, name: 'role', label: 'ROLE', width: '20%', cellFormatter: formatRoles },
                { id: 3, name: 'username', label: 'EMAIL ID', width: '20%' },
                { id: 4, name: 'gender', label: 'GENDER', width: '9%' },
                {
                  id: 5,
                  name: 'phoneNumber',
                  label: 'CONTACT NUMBER',
                  width: '20',
                  cellFormatter: formatPhone
                }
              ]}
              isEdit={true}
              isDelete={true}
              page={listParams.page}
              rowsPerPage={listParams.rowsPerPage}
              count={hfUsers.total}
              onRowEdit={handleEditUserClick}
              onDeleteClick={handleUserDelete}
              handlePageChange={handlePage}
              confirmationTitle={formatUserToastMsg(
                APPCONSTANTS.HEALTH_FACILITY_USER_DELETE_CONFIRMATION,
                healthFacilitySName
              )}
              deleteTitle={formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_USER_DELETE_TITLE, healthFacilitySName)}
              actionFormatter={{
                hideEditIcon: (rowData: any) => isHideActionIcons(rowData),
                hideDeleteIcon: (rowData: any) => isHideActionIcons(rowData)
              }}
            />
          </DetailCard>
        </div>
        <ModalForm
          show={editHFDetailsModal.isOpen}
          title={`Edit ${healthFacilitySName}`}
          cancelText={editHFDetailsModal?.isNextClicked ? 'Back' : 'Cancel'}
          submitText={editHFDetailsModal?.isNextClicked ? 'Submit' : 'Next'}
          handleCancel={closeHFEditModal}
          handleFormSubmit={handleHFEditDetailsSubmit}
          initialValues={{ healthFacility: editHFDetailsModal.data }}
          render={editHFDetailsModalRender}
          size='modal-lg'
          mutators={arrayMutators}
        />
        <ModalForm
          show={showHFUserModal}
          title={`${isHFUserEdit ? 'Edit' : 'Add'} User`}
          cancelText='Cancel'
          submitText='Submit'
          handleCancel={() => setHFUserModal(false)}
          handleFormSubmit={handleAddEditUserSubmit}
          initialValues={hfUserForEdit.current}
          render={userFormRender}
          mutators={{ ...arrayMutators }}
        />
      </div>
    </>
  );
};

export default HealthFacilitySummary;
