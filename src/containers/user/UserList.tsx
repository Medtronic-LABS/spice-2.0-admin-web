import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import arrayMutators from 'final-form-arrays';
import { FormApi } from 'final-form';

import DetailCard from '../../components/detailCard/DetailCard';
import Loader from '../../components/loader/Loader';
import APPCONSTANTS from '../../constants/appConstants';
import ModalForm from '../../components/modal/ModalForm';
import UserForm from '../../components/userForm/UserForm';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import { IHFUserGet, IUserRole } from '../../store/healthFacility/types';
import CustomTable from '../../components/customTable/CustomTable';
import { roleSelector, userDataSelector } from '../../store/user/selectors';
import { fetchHFUserListRequest } from '../../store/healthFacility/actions';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import {
  healthFacilityListUsersTotalSelector,
  healthFacilityUserListSelector,
  healthFacilityUsersLoadingSelector
} from '../../store/healthFacility/selectors';
import { IRoles } from '../../store/user/types';

interface IMatchParams {
  regionId: string;
  tenantId: string;
}

interface IMatchProps extends RouteComponentProps<IMatchParams> {}

const UserList = (props: IMatchProps): React.ReactElement => {
  const dispatch = useDispatch();
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const [isOpenUserModal, setIsOpenUserModal] = useState({ isOpen: false, isEdit: false });
  const regionData = useSelector(userDataSelector).country;
  const role = useSelector(roleSelector);
  const hfUserList = useSelector(healthFacilityUserListSelector);
  const hfUserCount = useSelector(healthFacilityListUsersTotalSelector);
  const hfUserLoading = useSelector(healthFacilityUsersLoadingSelector);

  const userForEdit = useRef<{ users: any[] }>({ users: [] });

  useEffect(() => {
    dispatch(
      fetchHFUserListRequest({
        countryId: regionData.id,
        skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
        limit: listParams.rowsPerPage,
        searchTerm: listParams.searchTerm,
        userBased: role !== (APPCONSTANTS.ROLES.SUPER_ADMIN || APPCONSTANTS.ROLES.SUPER_USER),
        tenantBased: false,
        failureCb: (e: Error) => {
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.USERS_LIST_FETCH_ERROR));
        }
      })
    );
  }, [dispatch, listParams.page, listParams.rowsPerPage, listParams.searchTerm, regionData.id, role]);

  const handleUserDelete = useCallback(({ data }: any) => {
    //
  }, []);

  /**
   * Handler to open user edit modal
   * @param value
   */
  const openEditModal = (value: any) => {
    value.suiteAccess = value.roles[0];
    value.role = value.roles.filter((r: IRoles) => r.groupName === value.suiteAccess.groupName) || [];
    userForEdit.current = { users: [{ ...value }] };
    setIsOpenUserModal({ isOpen: true, isEdit: true });
  };

  const handleAddUserClick = () => {
    userForEdit.current = { users: [] };
    setIsOpenUserModal({ isOpen: true, isEdit: false });
  };

  /**
   * Handler for modal cancel
   */
  const handleCancelClick = () => {
    setIsOpenUserModal({ isOpen: false, isEdit: true });
    userForEdit.current = { users: [] };
  };

  /**
   * Handler for edit user form submit.
   */
  const handleEditSubmit = useCallback(({ users }: { users: IHFUserGet[] }) => {
    //
  }, []);

  const formatName = (user: IHFUserGet) => `${user.firstName} ${user.lastName}`;

  const formatRoles = (user: IHFUserGet) =>
    `${(user.roles || []).map((userRole: IUserRole) => userRole.displayName).join(',')}`;

  const formatHealthFacility = (user: IHFUserGet) => `${(user.organizations || []).map((org) => org.name).join(',')}`;

  const userFormRenderer = (form?: FormApi<any>) => {
    return (
      <UserForm
        form={form as FormApi<any>}
        initialEditValue={userForEdit.current.users[0]}
        disableOptions={true}
        isEdit={isOpenUserModal.isEdit}
        countryId={regionData.id}
      />
    );
  };

  return (
    <>
      {hfUserLoading && <Loader />}
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
                width: '20%'
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
          />
        </DetailCard>
        <ModalForm
          show={isOpenUserModal.isOpen}
          title='Edit User'
          cancelText='Cancel'
          submitText='Submit'
          handleCancel={handleCancelClick}
          handleFormSubmit={handleEditSubmit}
          initialValues={{ users: userForEdit.current }}
          render={userFormRenderer}
          mutators={{ ...arrayMutators }}
        />
        {/* To be added later */}
        {/* <ModalForm
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
        </ModalForm> */}
      </div>
    </>
  );
};

export default UserList;
