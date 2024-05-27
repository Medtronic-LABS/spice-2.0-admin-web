import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useParams } from 'react-router-dom';
import arrayMutators from 'final-form-arrays';
import { FormApi } from 'final-form';

import { ReactComponent as PasswordChangeIcon } from '../../assets/images/reset-password.svg';
import DetailCard from '../../components/detailCard/DetailCard';
import Loader from '../../components/loader/Loader';
import APPCONSTANTS from '../../constants/appConstants';
import ModalForm from '../../components/modal/ModalForm';
import UserForm from '../../components/userForm/UserForm';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import { IHFUserGet, IHFUserPost, IUserRole } from '../../store/healthFacility/types';
import CustomTable from '../../components/customTable/CustomTable';
import { roleSelector, userDataSelector } from '../../store/user/selectors';
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
  healthFacilityLoadingSelector,
  healthFacilityUserListSelector,
  healthFacilityUsersLoadingSelector,
  userDetailLoadingSelector
} from '../../store/healthFacility/selectors';
import { IRoles } from '../../store/user/types';
import { formatHFUserData } from '../healthFacility/HealthFacilitySummary';
import ResetPasswordFields, { generatePassword } from '../authentication/ResetPasswordFields';
import { changePassword } from '../../store/user/actions';

interface IMatchParams {
  tenantId: string;
}

interface IMatchProps extends RouteComponentProps<IMatchParams> {}

const UserList = (props: IMatchProps): React.ReactElement => {
  const dispatch = useDispatch();
  const { tenantId } = useParams<IMatchParams>();
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const [isOpenUserModal, setIsOpenUserModal] = useState({ isOpen: false, isEdit: false });
  const regionData = useSelector(userDataSelector).country;
  const role = useSelector(roleSelector);
  const hfUserList = useSelector(healthFacilityUserListSelector);
  const hfUserLoading = useSelector(healthFacilityUsersLoadingSelector);
  const loading = useSelector(healthFacilityLoadingSelector);
  const hfUserCount = useSelector(healthFacilityListUsersTotalSelector);
  const hfUserDetailLoading = useSelector(userDetailLoadingSelector);

  const userForEdit = useRef<{ users: any[] }>({ users: [] });
  const refreshHFUserList = useCallback(
    () =>
      dispatch(
        fetchHFUserListRequest({
          countryId: regionData.id,
          skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
          limit: listParams.rowsPerPage,
          searchTerm: listParams.searchTerm,
          userBased: !(role === APPCONSTANTS.ROLES.SUPER_ADMIN || role === APPCONSTANTS.ROLES.SUPER_USER),
          tenantBased: false,
          failureCb: (e: Error) => {
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.USERS_LIST_FETCH_ERROR));
          }
        })
      ),
    [dispatch, listParams.page, listParams.rowsPerPage, listParams.searchTerm, regionData.id, role]
  );

  useEffect(() => {
    refreshHFUserList();
    return () => {
      clearSupervisorList();
      clearVillageHFList();
    };
  }, [refreshHFUserList]);

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
        ['CHW', 'CHA', 'MCHA', 'SECHN', 'PROVIDER'].includes(userRole.name)
      )
    ) {
      dispatch(
        fetchUserDetailRequest({
          id: Number(value?.id),
          successCb: (user: any) => {
            const postData = { ...user };
            postData.suiteAccess = user.roles[0] || [];
            postData.role = postData.roles.filter((r: IRoles) => r.groupName === postData.suiteAccess.groupName) || [];
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
      postData.suiteAccess = value.roles[0] || [];
      postData.role = postData.roles.filter((r: IRoles) => r.groupName === postData.suiteAccess.groupName) || [];
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
  };

  const siteUserSuccess = useCallback(() => {
    const successMessage = isOpenUserModal.isEdit
      ? APPCONSTANTS.HEALTH_FACILITY_USER_UPDATE_SUCCESS
      : APPCONSTANTS.HEALTH_FACILITY_USER_CREATE_SUCCESS;
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
      const userObj = formatHFUserData(users, regionData.id, tenantId);
      const data: IHFUserPost = userObj[0];
      onSubmitHandler(
        data,
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
    [isOpenUserModal.isEdit, onSubmitHandler, regionData.id, siteUserSuccess, tenantId]
  );

  const formatName = (user: IHFUserGet) => `${user.firstName} ${user.lastName}`;

  const formatRoles = (user: IHFUserGet) =>
    `${(user.roles || []).map((userRole: IUserRole) => userRole.displayName).join(', ')}`;

  const formatHealthFacility = (user: IHFUserGet) => `${(user.organizations || []).map((org) => org.name).join(', ')}`;

  const userFormRenderer = (form?: FormApi<any>) => {
    return (
      <UserForm
        form={form as FormApi<any>}
        initialEditValue={userForEdit.current.users[0]}
        disableOptions={true}
        isEdit={isOpenUserModal.isEdit}
        countryId={regionData.id}
        enableAutoPopulate={true}
        hfTenantId={Number(tenantId)}
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
        >
          <CustomTable
            rowData={hfUserList}
            columnsDef={[
              {
                id: 1,
                name: 'name',
                label: 'Name',
                width: '20%',
                cellFormatter: formatName
              },
              {
                id: 2,
                name: 'role',
                label: 'ROLE',
                width: '20%',
                cellFormatter: formatRoles
              },
              {
                id: 3,
                name: 'healthFacility',
                label: 'HEALTH FACILITY',
                width: '20%',
                cellFormatter: formatHealthFacility
              },
              {
                id: 4,
                name: 'gender',
                label: 'GENDER',
                width: '10%'
              },
              {
                id: 5,
                name: 'phoneNumber',
                label: 'CONTACT NUMBER',
                width: '18%',
                cellFormatter: (user: IHFUserGet) => `+${user.countryCode} ${user.phoneNumber}`
              }
            ]}
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
