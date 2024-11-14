import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import arrayMutators from 'final-form-arrays';
import { FormApi } from 'final-form';
import { ReactComponent as PasswordChangeIcon } from '../../assets/images/reset-password.svg';
import DetailCard from '../../components/detailCard/DetailCard';
import Loader from '../../components/loader/Loader';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import ModalForm from '../../components/modal/ModalForm';
import UserForm from '../../components/userForm/UserForm';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import { IHFUserGet, IHFUserPost, IUserRole } from '../../store/healthFacility/types';
import { columnDef } from './adminListMeta';
import CustomTable from '../../components/customTable/CustomTable';
import { countryIdSelector, emailSelector, userRolesSelector } from '../../store/user/selectors';
import {
  clearSupervisorList,
  clearVillageHFList,
  createHFUserRequest,
  deleteHFUserRequest,
  fetchHFUserListRequest,
  fetchUserDetailRequest,
  updateHFUserRequest
} from '../../store/healthFacility/actions';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import {
  healthFacilityListUsersTotalSelector,
  healthFacilityUserListSelector,
  healthFacilityUsersLoadingSelector,
  userDetailLoadingSelector
} from '../../store/healthFacility/selectors';
import { IRoles } from '../../store/user/types';
import ResetPasswordFields, { generatePassword } from '../authentication/ResetPasswordFields';
import { changePassword, fetchUserRolesAction } from '../../store/user/actions';
import sessionStorageServices from '../../global/sessionStorageServices';
import { getAdminPayload } from '../../utils/commonUtils';

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
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName }
  } = NAME_CONSTANTS;
  const { filterSpiceCommonRoles, filterSpiceAdminRoles } = APPCONSTANTS;
  const [selectedRole, setSelectedRole] = useState<string[]>();
  const [loading, setLoading] = useState<boolean>(false);

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
    [dispatch, refreshHFUserList]
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
            const allSuiteAccess = user.roles.map((r: IRoles) => ({ groupName: r.groupName, id: r.groupName }));
            postData.suiteAccess = [...new Map(allSuiteAccess.map((item: any) => [item.groupName, item])).values()];
            postData.role = postData.roles.filter((r: IRoles) => r.groupName === 'SPICE') || [];
            postData.spiceInsightsRole = postData.roles.filter((r: IRoles) => r.groupName === 'SPICE INSIGHTS') || [];
            postData.supervisor = {
              ...postData.supervisor,
              name: `${postData.supervisor?.firstName || ''} ${postData.supervisor?.lastName || ''}`
            };
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
      const allSuiteAccess = value.roles.map((r: IRoles) => ({
        groupName: r.groupName,
        id: r.groupName
      }));
      postData.suiteAccess = [...new Map(allSuiteAccess.map((item: any) => [item.groupName, item])).values()];
      postData.role = postData.roles.filter((r: IRoles) => r.groupName === 'SPICE') || [];
      postData.spiceInsightsRole = postData.roles.filter((r: IRoles) => r.groupName === 'SPICE INSIGHTS') || [];
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
    [isOpenUserModal.isEdit, onSubmitHandler, countryIdValue, adminSuccess, tenantId]
  );

  /**
   * Renders the UserForm inside an edit modal
   * @param {any} form - The form API instance used to manage the form's state and submissions.
   */
  const userFormRenderer = (form?: FormApi<any>) => {
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
   * Memoized value to filter SPICE spice role
   */
  const roleSpiceList = (rolesGrouped?.SPICE || [])?.filter(
    (data: { suiteAccessName: string }) => data.suiteAccessName === APPCONSTANTS.spiceRole.spice
  );

  /**
   * Memoized value to filter SPICE INSIGHTS admin roles based on certain conditions for filter dropdown
   * filter only spice common roles and spice admin roles
   */
  const roleCFRList = (rolesGrouped?.['SPICE INSIGHTS'] || [])?.filter(
    (data: { suiteAccessName: string }) =>
      filterSpiceCommonRoles.includes(data.suiteAccessName) || filterSpiceAdminRoles.includes(data.suiteAccessName)
  );

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
              data: [...roleSpiceList, ...roleCFRList],
              isShow: true,
              filterCount: selectedRole?.length
            }
          ]}
        >
          <CustomTable
            rowData={hfUserList}
            columnsDef={columnDef({ chiefdomModuleName: chiefdomSName, districtModuleName: districtSName })}
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
              hideEditIcon: (rowData: any) => rowData.username === email,
              hideDeleteIcon: (rowData: any) => rowData.username === email,
              hideCustomIcon: (rowData: any) => rowData.username === email
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
