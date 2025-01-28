import { FormApi } from 'final-form';
import arrayMutators from 'final-form-arrays';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { ReactComponent as PasswordChangeIcon } from '../../assets/images/reset-password.svg';
import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import Loader from '../../components/loader/Loader';
import ModalForm from '../../components/modal/ModalForm';
import UserForm from '../../components/userForm/UserForm';
import APPCONSTANTS, { NAMING_VARIABLES } from '../../constants/appConstants';
import { villageBasedRoles } from '../../constants/roleConstants';
import sessionStorageServices from '../../global/sessionStorageServices';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import { CHIEFDOM_ADMIN, HEALTH_FACILITY_ADMIN } from '../../routes';
import {
  clearHFList,
  clearSupervisorList,
  clearVillageHFList,
  createHFUserRequest,
  deleteHFUserRequest,
  fetchHFListRequest,
  fetchHFUserListRequest,
  fetchUserDetailRequest,
  updateHFUserRequest
} from '../../store/healthFacility/actions';
import {
  healthFacilityListSelector,
  healthFacilityListUsersTotalSelector,
  healthFacilityLoadingSelector,
  healthFacilityUserListSelector,
  healthFacilityUsersLoadingSelector,
  userDetailLoadingSelector
} from '../../store/healthFacility/selectors';
import { IHFUserGet, IHFUserPost, IUserRole } from '../../store/healthFacility/types';
import { changePassword, fetchUserRolesAction } from '../../store/user/actions';
import { countryIdSelector, emailSelector, roleSelector, userRolesSelector } from '../../store/user/selectors';
import { getUserPayload } from '../../utils/formatObjectUtils';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import ResetPasswordFields, { generatePassword } from '../authentication/ResetPasswordFields';
import { columnDef } from './userListMeta';
import { filterByAppTypes, formatUserToastMsg } from '../../utils/commonUtils';

export interface IMatchParams {
  tenantId: string;
  regionId: string;
  districtId: string;
  chiefdomId: string;
  healthFacilityId: string;
}

/**
 * Component for User List
 * @returns {React.ReactElement}
 */
const UserList = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { tenantId, healthFacilityId } = useParams<IMatchParams>();
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const [isOpenUserModal, setIsOpenUserModal] = useState({ isOpen: false, isEdit: false });
  const countryId = useSelector(countryIdSelector);
  const countryIdValue = countryId?.id || sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID);
  const role = useSelector(roleSelector);
  const email = useSelector(emailSelector);
  const rolesGrouped = useSelector(userRolesSelector);
  const hfUserList = useSelector(healthFacilityUserListSelector);
  const hfUserLoading = useSelector(healthFacilityUsersLoadingSelector);
  const loading = useSelector(healthFacilityLoadingSelector);
  const hfUserCount = useSelector(healthFacilityListUsersTotalSelector);
  const hfUserDetailLoading = useSelector(userDetailLoadingSelector);
  const healthFacilityList = useSelector(healthFacilityListSelector);
  const isSuperUser = [APPCONSTANTS.ROLES.SUPER_ADMIN, APPCONSTANTS.ROLES.SUPER_USER].includes(role);
  const userForEdit = useRef<{ users: any[] }>({ users: [] });
  const [selectedFacility, setSelectedFacility] = useState<string[]>();
  const [selectedRole, setSelectedRole] = useState<string[]>();
  const [changePasswordLoading, setChangePasswordLoading] = useState<boolean>(false);
  const {
    isCommunity,
    appTypes,
    userList: {
      filters: { available: showFilters }
    },
    healthFacility: { s: healthFacilitySname, p: healthFacilityPname }
  } = useAppTypeConfigs();

  /**
   * useCallback hook to refresh the user list.
   */
  const refreshHFUserList = useCallback(() => {
    return dispatch(
      fetchHFUserListRequest({
        countryId: countryIdValue,
        skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
        limit: listParams.rowsPerPage,
        searchTerm: listParams.searchTerm,
        roleNames: selectedRole || [],
        isSiteUsers: true,
        tenantBased: role === HEALTH_FACILITY_ADMIN,
        tenantId,
        tenantIds: role === HEALTH_FACILITY_ADMIN || role === CHIEFDOM_ADMIN ? [tenantId] : selectedFacility || [],
        failureCb: (e: Error) => {
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.USERS_LIST_FETCH_ERROR));
        }
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    countryIdValue,
    listParams.page,
    listParams.rowsPerPage,
    listParams.searchTerm,
    selectedRole,
    tenantId,
    selectedFacility
  ]);

  /**
   * useEffect for refrech the list whenever filter gets changed
   */
  useEffect(() => {
    refreshHFUserList();
    return () => {
      dispatch(clearSupervisorList());
      dispatch(clearVillageHFList());
    };
  }, [dispatch, refreshHFUserList, selectedFacility, selectedRole]);

  /**
   * useEffect for fetch roles whenever countryId or rolesGrouped gets changed
   */
  useEffect(() => {
    if (!rolesGrouped?.hasOwnProperty('SPICE') && showFilters) {
      dispatch(
        fetchUserRolesAction({
          countryId: countryIdValue,
          failureCb: (_) => toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.USER_ROLES_FETCH_ERROR)
        })
      );
    }
  }, [countryIdValue, dispatch, rolesGrouped, showFilters]);

  /**
   * Handler function for user delete
   * @param {object} data
   * @param {number} data.id - User id for user to delete
   * @param {any[]} data.organizations - user organization for user to delete
   */
  const handleUserDelete = useCallback(
    ({ data: { id, organizations = [] } }: { data: { id: number; organizations: any[] } }) => {
      dispatch(
        deleteHFUserRequest({
          data: {
            id,
            appTypes,
            countryId: countryIdValue,
            tenantIds: organizations.map((s) => Number(s.id))
          },
          successCb: () => {
            toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.USER_DELETE_SUCCESS);
            refreshHFUserList();
          },
          failureCb: (e) => {
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.USER_DELETE_FAIL));
          }
        })
      );
    },
    [appTypes, countryIdValue, dispatch, refreshHFUserList]
  );

  /**
   * Handler to open user edit modal
   * @param value
   */
  const openEditModal = (value: any) => {
    if ((value.roles || []).some((userRole: IUserRole) => villageBasedRoles.includes(userRole.name))) {
      dispatch(
        fetchUserDetailRequest({
          id: Number(value?.id),
          successCb: (user: any) => {
            const postData = { ...user };
            userForEdit.current = { users: [{ ...postData }] };
            setIsOpenUserModal({ isOpen: true, isEdit: true });
          },
          failureCb: (e) => {
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.USER_DETAIL_FETCH_FAIL));
          }
        })
      );
    } else {
      const postData = { ...value };
      userForEdit.current = { users: [{ ...postData }] };
      setIsOpenUserModal({ isOpen: true, isEdit: true });
    }
  };

  /**
   * Handler for add user button click
   */
  const handleAddUserClick = () => {
    userForEdit.current = { users: [] as IHFUserGet[] };
    setIsOpenUserModal({ isOpen: true, isEdit: false });
  };

  /**
   * Handler for modal cancel
   */
  const handleCancelClick = () => {
    setIsOpenUserModal({ isOpen: false, isEdit: true });
    userForEdit.current = { users: [] as IHFUserGet[] };
    fetchList(); // get list of HF for filter dropdown, while closing the modal
  };

  /**
   * Handler function for success callback for add user and edit user
   */
  const siteUserSuccess = useCallback(() => {
    const successMessage = isOpenUserModal.isEdit
      ? APPCONSTANTS.USER_DETAILS_UPDATE_SUCCESS
      : APPCONSTANTS.USER_DETAILS_CREATE_SUCCESS;
    toastCenter.success(APPCONSTANTS.SUCCESS, successMessage);
    refreshHFUserList();
    setIsOpenUserModal({ isOpen: false, isEdit: isOpenUserModal.isEdit });
    fetchList(); // get list of HF for filter dropdown, while submitting the edited user
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenUserModal.isEdit, refreshHFUserList]);

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
   * Handler for edit user form submit.
   */
  const handleEditSubmit = useCallback(
    ({ users }: { users: IHFUserGet[] }) => {
      const userObj = getUserPayload({
        userFormData: users,
        countryId: countryIdValue,
        tenantId: tenantId && healthFacilityId ? tenantId : undefined, // use hf tenantId only
        spiceRolesGroup: rolesGrouped?.SPICE,
        appTypes
      });
      const data: IHFUserPost = userObj[0];
      onSubmitHandler(
        { ...data },
        isOpenUserModal.isEdit || data.id ? updateHFUserRequest : createHFUserRequest,
        siteUserSuccess,
        (e) => {
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              isOpenUserModal.isEdit || data.id
                ? formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_USER_UPDATE_ERROR, healthFacilitySname)
                : formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_USER_CREATE_ERROR, healthFacilitySname)
            )
          );
        }
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      countryIdValue,
      tenantId,
      healthFacilityId,
      rolesGrouped?.SPICE,
      appTypes,
      onSubmitHandler,
      isOpenUserModal.isEdit,
      siteUserSuccess
    ]
  );

  /**
   * Renders the UserForm inside an edit modal
   * @param {any} form - The form API instance used to manage the form's state and submissions.
   */
  const userFormRenderer = (form?: FormApi<any>) => {
    /*
     * Find if the user is report super admin to
     * disable reports role to prevent further edit
     * This is temporary solution, until reports and insights have dedicated screen
     */
    const isReportSuperAdmin = userForEdit.current.users[0]?.roles.some(
      (r: { name: string; suiteAccessName: string }) =>
        r.name === APPCONSTANTS.ALL_ROLES.REPORT_SUPER_ADMIN && r.suiteAccessName === APPCONSTANTS.SUITE_ACCESS.CFR
    );
    return (
      <UserForm
        form={form as FormApi<any>}
        initialEditValue={userForEdit.current.users[0]}
        disableOptions={true}
        isEdit={isOpenUserModal.isEdit}
        countryId={countryIdValue}
        enableAutoPopulate={true}
        hfTenantId={Number(tenantId)}
        isSiteUser={true}
        appTypes={appTypes}
        userFormParams={{
          isReportSuperAdmin
        }}
      />
    );
  };

  // state for Change Password
  const [openModal, setOpenModal] = useState({ isOpen: false, userData: {} as IHFUserGet });
  const [submitEnable, setSubmitEnabled] = useState(false);

  /**
   * Handler function for close modal
   */
  const onModalCancel = () => {
    setOpenModal({ isOpen: false, userData: {} as IHFUserGet });
  };

  /**
   * Handler function for change password button click
   * @param {IHFUserGet} userData - user data values
   */
  const handleChangePassword = (userData: IHFUserGet) => {
    setOpenModal({ isOpen: true, userData });
  };

  /**
   * Submit handler for change password modal
   * @param {object} data - change password modal form value
   * @param {string} data.newPassword - new password value
   */
  const handleResetPasswordSubmit = (data: { newPassword: string }) => {
    setChangePasswordLoading(true);
    const password = generatePassword(data.newPassword);
    dispatch(
      changePassword({
        userId: Number(openModal.userData?.id),
        password,
        successCB: () => {
          setChangePasswordLoading(false);
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.PASSWORD_CHANGE_SUCCESS);
          onModalCancel();
        },
        failureCb: (e) => {
          setChangePasswordLoading(false);
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.PASSWORD_CHANGE_FAILED));
        }
      })
    );
  };

  /**
   * Function to fetch list
   */
  const fetchList = useCallback(() => {
    if (showFilters) {
      dispatch(
        fetchHFListRequest({
          countryId: countryIdValue,
          skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
          limit: null,
          userBased: !isSuperUser,
          tenantIds: [tenantId],
          failureCb: (e: Error) => {
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.ERROR,
                formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_LIST_FETCH_ERROR, healthFacilityPname)
              )
            );
          }
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isSuperUser, countryIdValue, showFilters]);

  /**
   * useEffect to invoke fetchlist function when component mounts
   */
  useEffect(() => {
    fetchList();
    return () => {
      dispatch(clearHFList());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Memoized value to filter SPICE user roles based on certain conditions for filter dropdown
   * Remove redrisk from role list
   */
  const spiceUserRole = useMemo(() => {
    const rolesByAppTypes = filterByAppTypes(rolesGrouped?.SPICE || [], appTypes);
    return rolesByAppTypes.filter(
      (data: { suiteAccessName: string; name: string; displayName: string }) =>
        data.suiteAccessName !== APPCONSTANTS.spiceRole.spice &&
        (data.name !== NAMING_VARIABLES.redRisk || data.displayName !== null)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolesGrouped]);

  /**
   * Memoized value to filter REPORTS user roles based on certain conditions for filter dropdown
   */
  const roleCFRList = useMemo(() => {
    return filterByAppTypes(rolesGrouped?.REPORTS || [], appTypes);
  }, [appTypes, rolesGrouped?.REPORTS]);

  /**
   * Memoized value to filter INSIGHTS user roles based on certain conditions for filter dropdown
   */
  const roleInsightsList = useMemo(() => {
    return filterByAppTypes(rolesGrouped?.INSIGHTS || [], appTypes);
  }, [appTypes, rolesGrouped?.INSIGHTS]);

  /**
   * Icon Handler for edit, password reset and delete
   * Don't show icons if user has admin roles in it
   * Don't show icon for logged in user
   */
  const handleIconHandler = (rowData: { roles: Array<{ suiteAccessName: string }>; username: string }) => {
    const isAdminUser =
      !isCommunity &&
      rowData?.roles.some(
        (r: { suiteAccessName: string }) => r.suiteAccessName === APPCONSTANTS.SPICE_ROLE_SUITE_ACCESS.admin
      );
    return isAdminUser || rowData.username === email;
  };

  return (
    <>
      {(hfUserLoading || hfUserDetailLoading || loading || changePasswordLoading) && <Loader />}
      <div className='col-12'>
        <DetailCard
          buttonLabel='Add User'
          header='Users'
          isSearch={true}
          onSearch={handleSearch}
          searchPlaceholder={APPCONSTANTS.SEARCH_BY_NAME_EMAIL}
          onButtonClick={handleAddUserClick}
          setSelectedRole={setSelectedRole}
          setSelectedFacility={setSelectedFacility}
          isFilter={showFilters}
          onFilterData={[
            {
              id: 1,
              name: 'Filter by Facility',
              isFacility: true,
              isSearchable: true,
              data: healthFacilityList,
              isShow: role !== HEALTH_FACILITY_ADMIN,
              filterCount: selectedFacility?.length
            },
            {
              id: 2,
              name: 'Filter by Role',
              isFacility: false,
              isSearchable: false,
              data: [...(spiceUserRole || []), ...(roleCFRList || []), ...(roleInsightsList || [])],
              isShow: true,
              filterCount: selectedRole?.length
            }
          ]}
        >
          <CustomTable
            rowData={hfUserList}
            columnsDef={columnDef({ healthFacilityModuleName: healthFacilitySname })}
            isDelete={true}
            isEdit={true}
            onRowEdit={openEditModal}
            onDeleteClick={handleUserDelete}
            page={listParams.page}
            rowsPerPage={listParams.rowsPerPage}
            handlePageChange={handlePage}
            count={hfUserCount}
            confirmationTitle={APPCONSTANTS.USER_DELETE_CONFIRMATION}
            deleteTitle={APPCONSTANTS.USER_DELETE_TITLE}
            onCustomConfirmed={handleChangePassword}
            CustomIcon={PasswordChangeIcon}
            customTitle='Change Password'
            isCustom={true}
            customIconStyle={{ width: 18 }}
            actionFormatter={{
              hideEditIcon: (rowData: any) => handleIconHandler(rowData),
              hideDeleteIcon: (rowData: any) => handleIconHandler(rowData),
              hideCustomIcon: (rowData: any) => handleIconHandler(rowData)
            }}
          />
        </DetailCard>
        <ModalForm
          show={isOpenUserModal.isOpen}
          title={`${isOpenUserModal.isEdit ? 'Edit' : 'Add'} User`}
          cancelText='Cancel'
          submitText='Submit'
          handleCancel={handleCancelClick}
          handleFormSubmit={handleEditSubmit}
          initialValues={{ users: userForEdit.current }}
          render={userFormRenderer}
          mutators={{ ...arrayMutators }}
        />
        <ModalForm
          show={openModal.isOpen}
          title={'Change Password'}
          cancelText={'Cancel'}
          submitText={'Submit'}
          handleCancel={onModalCancel}
          handleFormSubmit={handleResetPasswordSubmit}
          size={'modal-md'}
          submitDisabled={!submitEnable}
        >
          <ResetPasswordFields
            email={openModal.userData.username}
            setSubmitEnabled={setSubmitEnabled}
            adminPasswordChange={false}
          />
        </ModalForm>
      </div>
    </>
  );
};

export default UserList;
