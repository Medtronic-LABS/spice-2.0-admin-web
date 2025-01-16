import { FormApi } from 'final-form';
import arrayMutators from 'final-form-arrays';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { ReactComponent as PasswordChangeIcon } from '../../assets/images/reset-password.svg';
import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import Loader from '../../components/loader/Loader';
import ModalForm from '../../components/modal/ModalForm';
import UserForm, { ModuleNames } from '../../components/userForm/UserForm';
import APPCONSTANTS from '../../constants/appConstants';
import sessionStorageServices from '../../global/sessionStorageServices';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import { useRoleOptions } from '../../hooks/roleOptionsHook';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import {
  clearSupervisorList,
  clearVillageHFList,
  createHFUserRequest,
  deleteHFUserRequest,
  fetchHFUserListRequest,
  fetchUserDetailRequest,
  updateHFUserRequest
} from '../../store/healthFacility/actions';
import {
  healthFacilityListUsersTotalSelector,
  healthFacilityUserListSelector,
  healthFacilityUsersLoadingSelector,
  userDetailLoadingSelector
} from '../../store/healthFacility/selectors';
import { IHFUserGet, IHFUserPost, IUserRole } from '../../store/healthFacility/types';
import { changePassword, fetchUserRolesAction } from '../../store/user/actions';
import { countryIdSelector, emailSelector, userRolesSelector } from '../../store/user/selectors';
import { IRoles } from '../../store/user/types';
import { getAdminPayload } from '../../utils/formatObjectUtils';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import ResetPasswordFields, { generatePassword } from '../authentication/ResetPasswordFields';
import { columnDef } from './adminListMeta';
import { filterByAppTypes } from '../../utils/commonUtils';
import { redRisk } from '../../constants/roleConstants';

interface IMatchParams {
  tenantId: string;
}

/**
 * Admin List Component
 * @returns {React.ReactElement}
 */
const UserList = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { tenantId } = useParams<IMatchParams>();
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const [isOpenUserModal, setIsOpenUserModal] = useState({ isOpen: false, isEdit: false });
  const countryId = useSelector(countryIdSelector);
  const countryIdValue = countryId?.id || sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID);
  const email = useSelector(emailSelector);
  const rolesGrouped = useSelector(userRolesSelector);
  const hfUserList = useSelector(healthFacilityUserListSelector);
  const hfUserLoading = useSelector(healthFacilityUsersLoadingSelector);
  const hfUserCount = useSelector(healthFacilityListUsersTotalSelector);
  const hfUserDetailLoading = useSelector(userDetailLoadingSelector);
  const userForEdit = useRef<{ users: any[] }>({ users: [] });
  const {
    isCommunity,
    appTypes,
    healthFacility: { s: healthFacilitySName },
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName }
  } = useAppTypeConfigs();
  const [selectedRole, setSelectedRole] = useState<string[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const { pathname } = useLocation();
  const currentModule: ModuleNames = pathname.split('/')[1];

  const spiceRoles = useRef<IRoles[]>([]);

  const { getRoleOptions } = useRoleOptions({
    isHF: false,
    isHFCreate: false,
    isEdit: false,
    isSiteUser: false,
    allRoles: rolesGrouped,
    currentModule,
    roleOptionsFn: ({ spiceRoleOptions, reportRoleOptions: newReportRoles, insightRoleOptions }) => {
      spiceRoles.current = spiceRoleOptions;
    }
  });

  useEffect(() => {
    getRoleOptions();
  }, [getRoleOptions]);

  /**
   * useCallback hook to refresh the admin list.
   */
  const refreshHFUserList = useCallback(
    () =>
      dispatch(
        fetchHFUserListRequest({
          countryId: countryIdValue,
          skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
          limit: listParams.rowsPerPage,
          searchTerm: listParams.searchTerm,
          roleNames: selectedRole || [],
          isSiteUsers: false,
          tenantId,
          failureCb: (e: Error) => {
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.ADMIN_LIST_FETCH_ERROR));
          }
        })
      ),
    [dispatch, countryIdValue, listParams.page, listParams.rowsPerPage, listParams.searchTerm, selectedRole, tenantId]
  );

  /**
   * useEffect for refrech the list whenever filter gets changed
   */
  useEffect(() => {
    refreshHFUserList();
    return () => {
      dispatch(clearSupervisorList());
      dispatch(clearVillageHFList());
    };
  }, [dispatch, refreshHFUserList, selectedRole]);

  /**
   * useEffect for fetch roles whenever countryId or rolesGrouped gets changed
   */
  useEffect(() => {
    if (!rolesGrouped?.hasOwnProperty('SPICE')) {
      dispatch(
        fetchUserRolesAction({
          countryId: countryIdValue,
          failureCb: (_) => toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.USER_ROLES_FETCH_ERROR)
        })
      );
    }
  }, [countryIdValue, dispatch, rolesGrouped]);

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
            toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.ADMIN_DELETE_SUCCESS);
            refreshHFUserList();
          },
          failureCb: (e) => {
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.ADMIN_DELETE_FAIL));
          }
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appTypes, countryId, dispatch, refreshHFUserList]
  );

  /**
   * Handler to open user edit modal
   * @param value
   */
  const openEditModal = (value: any) => {
    if ((value.roles || []).some((userRole: IUserRole) => ['CHW'].includes(userRole.name))) {
      dispatch(
        fetchUserDetailRequest({
          id: Number(value?.id),
          successCb: (user: any) => {
            const postData = { ...user };
            userForEdit.current = { users: [{ ...postData }] };
            setIsOpenUserModal({ isOpen: true, isEdit: true });
          },
          failureCb: (e) => {
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.ADMIN_DETAIL_FETCH_FAIL));
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
  };

  /**
   * Handler function for success callback for add admin and edit admin
   */
  const adminSuccess = useCallback(() => {
    const successMessage = isOpenUserModal.isEdit
      ? APPCONSTANTS.ADMIN_DETAILS_UPDATE_SUCCESS
      : APPCONSTANTS.ADMIN_DETAILS_CREATE_SUCCESS;
    toastCenter.success(APPCONSTANTS.SUCCESS, successMessage);
    refreshHFUserList();
    setLoading(false);
    setIsOpenUserModal({ isOpen: false, isEdit: isOpenUserModal.isEdit });
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
      const userObj = getAdminPayload({
        appTypes,
        userFormData: users,
        countryId: countryIdValue,
        tenantId
      });
      const data: IHFUserPost = userObj[0];
      setLoading(true);
      onSubmitHandler(data, isOpenUserModal.isEdit ? updateHFUserRequest : createHFUserRequest, adminSuccess, (e) => {
        setLoading(false);
        toastCenter.error(
          ...getErrorToastArgs(
            e,
            APPCONSTANTS.OOPS,
            isOpenUserModal.isEdit ? APPCONSTANTS.ADMIN_DETAILS_UPDATE_ERROR : APPCONSTANTS.ADMIN_DETAILS_CREATE_ERROR
          )
        );
      });
    },
    [appTypes, countryIdValue, tenantId, onSubmitHandler, isOpenUserModal.isEdit, adminSuccess]
  );

  /**
   * Renders the UserForm inside an edit modal
   * @param {any} form - The form API instance used to manage the form's state and submissions.
   */
  const userFormRenderer = (form?: FormApi<any>) => {
    /*
     * Find if the user is only have report or insights or both access
     * used to enable spice role for edit
     * This is temporary solution, until reports and insights have dedicated menu
     */
    const userSuiteNames = userForEdit.current.users[0]?.roles.map(
      (role: { suiteAccessName: string }) => role.suiteAccessName
    );
    const isReportOrInsightUser = userSuiteNames?.includes(APPCONSTANTS.SUITE_ACCESS.ADMIN) ? false : true;
    /*
     * Find if the user is report super admin to
     * disable reports role to prevent further edit
     * This is temporary solution, until reports and insights have dedicated screen
     */
    const isReportSuperAdmin = userForEdit.current.users[0]?.roles.some(
      (role: { name: string; suiteAccessName: string }) =>
        role.name === APPCONSTANTS.ALL_ROLES.REPORT_SUPER_ADMIN &&
        role.suiteAccessName === APPCONSTANTS.SUITE_ACCESS.CFR
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
        isSiteUser={false}
        userFormParams={{
          isFromAdminList: true,
          isReportOrInsightUser,
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
  const handleResetPasswordSubmit = (data: any) => {
    setLoading(true);
    const password = generatePassword(data.newPassword);
    dispatch(
      changePassword({
        userId: Number(openModal.userData?.id),
        password,
        successCB: () => {
          setLoading(false);
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.PASSWORD_CHANGE_SUCCESS);
          onModalCancel();
        },
        failureCb: (e) => {
          setLoading(false);
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.PASSWORD_CHANGE_FAILED));
        }
      })
    );
  };

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
   * Don't show icons if user has mob roles in it
   * Don't show icon for logged in user
   */
  const actionIconViewer = (rowData: {
    roles: Array<{ suiteAccessName: string; displayName: string; name: string }>;
    username: string;
  }) => {
    const isMobUser =
      !isCommunity &&
      rowData?.roles.some(
        (role: { suiteAccessName: string; displayName: string; name: string }) =>
          role.suiteAccessName === APPCONSTANTS.SPICE_ROLE_SUITE_ACCESS.mob &&
          (role.displayName !== null || role.name !== redRisk)
      );
    return isMobUser || rowData.username === email;
  };

  return (
    <>
      {(hfUserLoading || hfUserDetailLoading || loading) && <Loader />}
      <div className='col-12' data-testid='admins-component'>
        <DetailCard
          buttonLabel='Add Admin'
          header='Admins'
          isSearch={true}
          onSearch={handleSearch}
          searchPlaceholder={APPCONSTANTS.SEARCH_BY_NAME_EMAIL}
          onButtonClick={handleAddUserClick}
          isFilter={true}
          setSelectedRole={setSelectedRole}
          onFilterData={[
            {
              id: 1,
              name: 'Filter by Admin',
              isFacility: false,
              isSearchable: false,
              data: [...spiceRoles.current, ...roleCFRList, ...roleInsightsList],
              isShow: true,
              filterCount: selectedRole?.length
            }
          ]}
        >
          <CustomTable
            rowData={hfUserList}
            columnsDef={columnDef({
              chiefdomModuleName: chiefdomSName,
              districtModuleName: districtSName,
              healthFacilityModuleName: healthFacilitySName
            })}
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
              hideEditIcon: (rowData: any) => actionIconViewer(rowData),
              hideDeleteIcon: (rowData: any) => actionIconViewer(rowData),
              hideCustomIcon: (rowData: any) => actionIconViewer(rowData)
            }}
          />
        </DetailCard>
        <ModalForm
          show={isOpenUserModal.isOpen}
          title={`${isOpenUserModal.isEdit ? 'Edit' : 'Add'} Admin`}
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
