import React, { useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import arrayMutators from 'final-form-arrays';
import { FormApi } from 'final-form';

import DetailCard from '../../components/detailCard/DetailCard';
import Loader from '../../components/loader/Loader';
import APPCONSTANTS from '../../constants/appConstants';
import ModalForm from '../../components/modal/ModalForm';
import UserForm from '../../components/userForm/UserForm';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import { IHFUserGet } from '../../store/healthFacility/types';
import CustomTable from '../../components/customTable/CustomTable';
import { userDataSelector } from '../../store/user/selectors';

interface IMatchParams {
  regionId: string;
  tenantId: string;
}

interface IMatchProps extends RouteComponentProps<IMatchParams> {}

const UserList = (props: IMatchProps): React.ReactElement => {
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const regionData = useSelector(userDataSelector).country;

  const userForEdit = useRef<IHFUserGet | {}>({});

  const handleUserDelete = useCallback(({ data }: any) => {
    //
  }, []);

  /**
   * Handler to open user edit modal
   * @param value
   */
  const openEditModal = (value: any) => {
    //
  };

  /**
   * Handler for modal cancel
   */
  const handleCancelClick = () => {
    setIsOpenUserModal(false);
    userForEdit.current = { users: [] };
  };

  /**
   * Handler for edit user form submit.
   */
  const handleEditSubmit = useCallback(({ users }: { users: IHFUserGet[] }) => {
    //
  }, []);

  const formatName = (user: IHFUserGet) => `${user.firstName} ${user.lastName}`;

  const formatRoles = (user: IHFUserGet) => `${(user.roles || []).map((role) => role.displayName).join(',')}`;
  const formatHealthFacility = (user: IHFUserGet) => `${(user.organizations || []).map((org) => org.name).join(',')}`;

  const userFormRederer = (form?: FormApi<any>) => {
    return (
      <UserForm
        form={form as FormApi<any>}
        initialEditValue={userForEdit.current}
        disableOptions={true}
        isEdit={true}
        countryId={regionData.id}
      />
    );
  };

  const siteUsers = [
    {
      id: 3,
      firstName: 'Test',
      roles: [
        {
          id: 4,
          name: 'SITE_ADMIN',
          groupName: 'SPICE',
          displayName: 'Site Admin'
        },
        {
          id: 4,
          name: 'SITE_ADMIN',
          groupName: 'SPICE',
          displayName: 'CHW'
        }
      ],
      lastName: 'User',
      gender: '',
      phoneNumber: '9798987873',
      username: 'test@spice.com',
      countryCode: '232',
      country: {
        id: 1,
        name: 'SL',
        tenantId: 1
      },
      organizations: [
        {
          id: 12,
          formDataId: 2,
          name: 'New Hospital',
          parentOrganizationId: null
        },
        {
          id: 13,
          formDataId: 1,
          name: 'AMC Hospital',
          parentOrganizationId: null
        }
      ],
      tenantId: 12,
      villages: [],
      supervisor: null
    }
  ] as IHFUserGet[];

  return (
    <>
      {false && <Loader />}
      <div className='col-12'>
        <DetailCard
          header='Users'
          isSearch={true}
          searchPlaceholder={APPCONSTANTS.SEARCH_BY_NAME_EMAIL}
          onSearch={handleSearch}
        >
          <CustomTable
            rowData={siteUsers}
            columnsDef={[
              {
                id: 1,
                name: 'name',
                label: 'Name',
                width: '150px',
                cellFormatter: formatName
              },
              {
                id: 2,
                name: 'role',
                label: 'ROLE',
                width: '200px',
                cellFormatter: formatRoles
              },
              {
                id: 3,
                name: 'healthFacility',
                label: 'HEALTH FACILITY',
                width: '140px',
                cellFormatter: formatHealthFacility
              },
              {
                id: 3,
                name: 'gender',
                label: 'GENDER',
                width: '140px'
              },
              {
                id: 3,
                name: 'phoneNumber',
                label: 'CONTACT NUMBER',
                width: '140px'
              }
            ]}
            isDelete={true}
            isEdit={true}
            onRowEdit={openEditModal}
            onDeleteClick={handleUserDelete}
            page={listParams.page}
            rowsPerPage={listParams.rowsPerPage}
            handlePageChange={handlePage}
            count={12}
            confirmationTitle={APPCONSTANTS.USER_DELETE_CONFIRMATION}
            deleteTitle={APPCONSTANTS.USER_DELETE_TITLE}
          />
        </DetailCard>
        <ModalForm
          show={isOpenUserModal}
          title='Edit Site User'
          cancelText='Cancel'
          submitText='Submit'
          handleCancel={handleCancelClick}
          handleFormSubmit={handleEditSubmit}
          initialValues={{ users: userForEdit.current }}
          render={userFormRederer}
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
