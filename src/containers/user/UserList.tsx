import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import arrayMutators from 'final-form-arrays';
import { FormApi } from 'final-form';

import { ReactComponent as PasswordChangeIcon } from '../../assets/images/reset-password.svg';
import DetailCard from '../../components/detailCard/DetailCard';
import Loader from '../../components/loader/Loader';
import APPCONSTANTS, { NAMING_VARIABLES } from '../../constants/appConstants';
import ModalForm from '../../components/modal/ModalForm';
import UserForm from '../../components/userForm/UserForm';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import { IHFUserGet, IHFUserPost, IUserRole } from '../../store/healthFacility/types';
import { columnDef } from './userListMeta';
import CustomTable from '../../components/customTable/CustomTable';
import { countryIdSelector, emailSelector, roleSelector, userRolesSelector } from '../../store/user/selectors';
import {
  clearSupervisorList,
  clearVillageHFList,
  createHFUserRequest,
  deleteHFUserRequest,
  fetchHFListRequest,
  fetchHFUserListRequest,
  fetchUserDetailRequest,
  updateHFUserRequest
} from '../../store/healthFacility/actions';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import {
  healthFacilityListSelector,
  healthFacilityListUsersTotalSelector,
  healthFacilityLoadingSelector,
  healthFacilityUserListSelector,
  healthFacilityUsersLoadingSelector,
  userDetailLoadingSelector
} from '../../store/healthFacility/selectors';
import { IRoles } from '../../store/user/types';
import { formatHFUserData } from '../healthFacility/HealthFacilitySummary';
import ResetPasswordFields, { generatePassword } from '../authentication/ResetPasswordFields';
import { changePassword, fetchUserRolesAction } from '../../store/user/actions';
import sessionStorageServices from '../../global/sessionStorageServices';
import { CHIEFDOM_ADMIN, HEALTH_FACILITY_ADMIN } from '../../routes';
import { addRedRiskToUserPayload } from '../../utils/commonUtils';

interface IMatchParams {
  tenantId: string;
  regionId: string;
  districtId: string;
  chiefdomId: string;
}

const UserList = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { tenantId } = useParams<IMatchParams>();
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

  const spiceUserRole = rolesGrouped?.SPICE?.filter(
    (data: { suiteAccessName: string; name: string; displayName: string }) =>
      data.suiteAccessName !== APPCONSTANTS.spiceRole.spice &&
      (data.name !== NAMING_VARIABLES.redRisk || data.displayName !== null)
  );

  const refreshHFUserList = useCallback(() => {
    return dispatch(
      fetchHFUserListRequest({
        countryId: countryIdValue,
        skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
        limit: listParams.rowsPerPage,
        searchTerm: listParams.searchTerm,
        roleNames: selectedRole || [],
        isSiteUsers: true,
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

  useEffect(() => {
    refreshHFUserList();
    return () => {
      dispatch(clearSupervisorList());
      dispatch(clearVillageHFList());
    };
  }, [dispatch, refreshHFUserList, selectedFacility, selectedRole]);

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

  const handleUserDelete = useCallback(
    ({ data: { id, organizations = [] } }: { data: { id: number; organizations: any[] } }) => {
      dispatch(
        deleteHFUserRequest({
          data: {
            id,
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
    [dispatch, refreshHFUserList]
  );

  /**
   * Handler to open user edit modal
   * @param value
   */
  const openEditModal = (value: any) => {
    if (
      (value.roles || []).some((userRole: IUserRole) =>
        [NAMING_VARIABLES.COMMUNITY_HEALTH_PROMOTER].includes(userRole.name)
      )
    ) {
      dispatch(
        fetchUserDetailRequest({
          id: Number(value?.id),
          successCb: (user: any) => {
            const postData = { ...user };
            const allSuiteAccess = user.roles.map((r: IRoles) => ({ groupName: r.groupName, id: r.groupName }));
            postData.suiteAccess = [...new Map(allSuiteAccess.map((item: any) => [item.groupName, item])).values()];
            postData.role =
              postData.roles.filter((r: IRoles) => r.groupName === 'SPICE' && r.name !== NAMING_VARIABLES.redRisk) ||
              [];
            postData.spiceInsightsRole = postData.roles.filter((r: IRoles) => r.groupName === 'SPICE INSIGHTS') || [];
            postData.supervisor = {
              ...postData.supervisor,
              name: `${postData.supervisor?.firstName || ''} ${postData.supervisor?.lastName || ''}`
            };
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
      const allSuiteAccess = value.roles.map((r: IRoles) => ({ groupName: r.groupName, id: r.groupName }));
      postData.suiteAccess = [...new Map(allSuiteAccess.map((item: any) => [item.groupName, item])).values()];
      postData.role =
        postData.roles.filter((r: IRoles) => r.groupName === 'SPICE' && r.name !== NAMING_VARIABLES.redRisk) || [];
      postData.spiceInsightsRole = postData.roles.filter((r: IRoles) => r.groupName === 'SPICE INSIGHTS') || [];
      userForEdit.current = { users: [{ ...postData }] };
      setIsOpenUserModal({ isOpen: true, isEdit: true });
    }
  };

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

  const siteUserSuccess = useCallback(() => {
    const successMessage = isOpenUserModal.isEdit
      ? APPCONSTANTS.USER_DETAILS_UPDATE_SUCCESS
      : APPCONSTANTS.USER_DETAILS_CREATE_SUCCESS;
    toastCenter.success(APPCONSTANTS.SUCCESS, successMessage);
    refreshHFUserList();
    setIsOpenUserModal({ isOpen: false, isEdit: isOpenUserModal.isEdit });
  }, [isOpenUserModal.isEdit, refreshHFUserList]);

  const onSubmitHandler = useCallback(
    (
      data: IHFUserPost,
      actionFn: any,
      options: any,
      successCB: (data: any) => void,
      failureCB: (error: any) => void
    ) => {
      dispatch(actionFn({ data, ...options, successCb: successCB, failureCb: failureCB }));
    },
    [dispatch]
  );

  /**
   * Handler for edit user form submit.
   */
  const handleEditSubmit = useCallback(
    ({ users }: { users: IHFUserGet[] }) => {
      const [getRedRisk] = (rolesGrouped?.SPICE || [])?.filter(
        (roleData: { name: string }) => NAMING_VARIABLES.redRisk === roleData.name
      );
      let userObj = formatHFUserData({ userData: users, countryId: countryIdValue, tenantId, fromUserForm: true });
      userObj = addRedRiskToUserPayload(userObj, getRedRisk?.id);
      const data: IHFUserPost = userObj[0];
      onSubmitHandler(
        { ...data },
        isOpenUserModal.isEdit ? updateHFUserRequest : createHFUserRequest,
        null,
        siteUserSuccess,
        (e) => {
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              isOpenUserModal.isEdit
                ? APPCONSTANTS.HEALTH_FACILITY_USER_UPDATE_ERROR
                : APPCONSTANTS.HEALTH_FACILITY_USER_CREATE_ERROR
            )
          );
        }
      );
    },
    [rolesGrouped?.SPICE, isOpenUserModal.isEdit, onSubmitHandler, countryIdValue, siteUserSuccess, tenantId]
  );

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
        isSiteUser={true}
      />
    );
  };

  // state for Change Password
  const [openModal, setOpenModal] = useState({ isOpen: false, userData: {} as IHFUserGet });
  const [submitEnable, setSubmitEnabled] = useState(false);

  const onModalCancel = () => {
    setOpenModal({ isOpen: false, userData: {} as IHFUserGet });
  };

  const handleChangePassword = (userData: IHFUserGet) => {
    setOpenModal({ isOpen: true, userData });
  };

  const handleFormSubmit = (data: any) => {
    const password = generatePassword(data.newPassword);
    dispatch(
      changePassword({
        userId: Number(openModal.userData?.id),
        password,
        successCB: () => {
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.PASSWORD_CHANGE_SUCCESS);
          onModalCancel();
        },
        failureCb: (e) => {
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.PASSWORD_CHANGE_FAILED));
        }
      })
    );
  };

  const requestFailure = (e: Error, errorMessage: string) =>
    toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, errorMessage));

  const fetchList = useCallback(() => {
    dispatch(
      fetchHFListRequest({
        countryId: countryIdValue,
        skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
        limit: null,
        userBased: !isSuperUser,
        tenantIds: [tenantId],
        failureCb: (e: Error) => requestFailure(e, APPCONSTANTS.HEALTH_FACILITY_LIST_FETCH_ERROR)
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isSuperUser, countryIdValue]);

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {(hfUserLoading || hfUserDetailLoading || loading) && <Loader />}
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
          isFilter={true}
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
              data: spiceUserRole,
              isShow: true,
              filterCount: selectedRole?.length
            }
          ]}
        >
          <CustomTable
            rowData={hfUserList}
            columnsDef={columnDef}
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
          handleFormSubmit={handleFormSubmit}
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
