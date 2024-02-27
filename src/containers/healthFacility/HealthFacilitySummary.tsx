import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import arrayMutators from 'final-form-arrays';

import DetailCard from '../../components/detailCard/DetailCard';
import CustomTable from '../../components/customTable/CustomTable';
import APPCONSTANTS, { ROLE_LABELS } from '../../constants/appConstants';
import toastCenter from '../../utils/toastCenter';
import ModalForm from '../../components/modal/ModalForm';
import { FormApi } from 'final-form';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import HealthFacilityDetailsForm from './HealthFacilityDetailsForm';
import UserForm from '../../components/userForm/UserForm';

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
}

const HealthFacilitySummary = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { tenantId } = useParams<IMatchParams>();

  const [editHFDetailsModal, setEditHFDetailsModal] = useState<IModalState>({
    isOpen: false
  });

  const [summaryUsers, setSummaryUsers] = useState<ISummaryUsersState>({
    loading: false,
    data: [
      {
        id: 1,
        firstName: 'Albert',
        lastName: 'Flores',
        role: 'CHW',
        username: 'albert@exmple.com',
        gender: 'Male',
        countryCode: '232',
        phoneNumber: '9840123456',
        suiteAccess: 'SPICE',
        assignedHealthFacility: 'Health Facility 1',
        selectedPeerSupervisor: 'Peer Supervisor 1',
        assignedVillages: [{ label: 'Village 1', value: 'village1' }]
      },
      {
        id: 2,
        firstName: 'Albert',
        lastName: 'Flores',
        role: 'CHW',
        username: 'albert@exmple.com',
        gender: 'Male',
        countryCode: '232',
        phoneNumber: '9840123456',
        assignedHealthFacility: '',
        selectedPeerSupervisor: '',
        assignedVillages: [{ label: 'Peer Supervisor 1', value: 'peersupervisor1' }]
      }
    ]
  });
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();

  const [showHFUserModal, setHFUserModal] = useState(false);
  const [isHFUserEdit, setIsHFUserEdit] = useState(false);
  const hfUserForEdit = useRef<{ users: any[] }>({ users: [] });
  const summaryDetails = useMemo(
    () =>
      ({
        name: 'Kalangba',
        type: 'CHP',
        phuName: 'Neil Kamara',
        phuNo: '+254 79474839',
        district: 'Port Loko',
        chiefdom: 'Kamaranka',
        address: 'test address',
        city: 'Makatha',
        latitude: '12.4',
        longitude: '10.37',
        postalCode: '485645',
        linkedPeerSupervisor: 'Supervisor 1',
        language: 'English',
        linkedVillages: [
          { label: 'Village 1', value: 'village1' },
          { label: 'Village 2', value: 'village2' },
          { label: 'Village 5', value: '5' }
        ]
      } as any),
    []
  );

  const lableData = useMemo(
    () => [
      { label: 'Health Facility Name', value: summaryDetails?.name },
      { label: 'Health Facility Type', value: summaryDetails?.type },
      { label: 'PHU Focal Person Name', value: summaryDetails?.phuName },
      { label: 'PHU Focal Person No', value: summaryDetails?.phuNo },
      { label: 'District', value: summaryDetails?.district },
      { label: 'Chiefdom', value: summaryDetails?.chiefdom },
      { label: 'Address', value: summaryDetails?.address },
      { label: 'City/Village', value: summaryDetails?.city },
      { label: 'Latitude', value: summaryDetails?.latitude },
      { label: 'Longitude', value: summaryDetails?.longitude },
      { label: 'Pin code', value: summaryDetails?.postalCode },
      { label: 'Linked Peer Supervisor', value: summaryDetails?.linkedPeerSupervisor },
      { label: 'Language', value: summaryDetails?.language },
      {
        label: 'Linked Villages',
        value: summaryDetails?.linkedVillages,
        subKey: 'label',
        style: { col: 'col-12', subCol: 'col-3' }
      }
    ],
    [summaryDetails]
  );

  /*
   * To Handle initial data loading, pagination and search
   * requests for users table
   */
  useEffect(() => {
    refreshPage();
    // eslint-disable-next-line
  }, [listParams, tenantId, dispatch]);

  const refreshPage = () => {
    setSummaryUsers((prevState) => ({ ...prevState, loading: true }));
  };

  const openHFEditModal = () => {
    if (summaryDetails) {
      setEditHFDetailsModal({
        isOpen: true,
        data: {
          ...summaryDetails
        } as any
      });
    } else {
      toastCenter.info('');
    }
  };

  const closeHFEditModal = () => {
    setEditHFDetailsModal({
      isOpen: false
    });
  };

  const editHFDetailsModalRender = (form: any) => {
    return <HealthFacilityDetailsForm form={form} isEdit={true} data={editHFDetailsModal.data} />;
  };

  const handleHFDetailsSubmit = () => {
    //
  };

  const handleEditUserClick = useCallback(
    (user: any) => {
      setIsHFUserEdit(true);
      user.country = { countryCode: user.countryCode || '' };
      hfUserForEdit.current = { users: [{ ...user }] };
      setHFUserModal(true);
    },
    [hfUserForEdit]
  );

  const handleEditUserSubmit = ({ users }: { users: any[] }) => {
    //
  };

  const handleAddUserClick = useCallback(() => {
    setIsHFUserEdit(false);
    hfUserForEdit.current = { users: [] };
    setHFUserModal(true);
  }, [hfUserForEdit]);

  const handleAddUserSubmit = ({ users }: { users: any[] }) => {
    //
  };

  const handleUserDelete = ({ data: user }: { data: any; index: number; pageNo: number }) => {
    //
  };

  /**
   * Formats the phone number with country code
   * @param user
   * @returns
   */
  const formatPhone = (user: any) => {
    return `${user.countryCode && '+ ' + user.countryCode} ${user.phoneNumber}`;
  };

  const formatName = (user: any) => {
    return `${user.firstName} ${user.lastName}`;
  };

  const formatRole = (user: any) => {
    if (user.role) {
      const role = user.role as keyof typeof ROLE_LABELS;
      return ROLE_LABELS[role] || user.role;
    }
  };

  const userFormRender = (form?: FormApi<any>) => {
    return (
      <UserForm
        form={form as FormApi<any>}
        initialEditValue={hfUserForEdit.current.users[0]}
        disableOptions={true}
        isEdit={isHFUserEdit}
        entityName='healthFacility'
        enableAutoPopulate={true}
      />
    );
  };

  return (
    <>
      <div className='row g-0dot625'>
        <div className='col-12'>
          <DetailCard
            buttonLabel='Edit Health Facility'
            isEdit={true}
            header='Health Facility Summary'
            onButtonClick={openHFEditModal}
          >
            <div className='row gy-1 mt-0dot25 mb-1dot25 mx-0dot5'>
              {lableData.map(({ label, value, style, subKey }) => (
                <div key={label} className={`${style?.col ? style.col : 'col-lg-4 col-sm-6'}`}>
                  <div className='fs-0dot875 charcoal-grey-text'>{label}</div>
                  {Array.isArray(value) ? (
                    <ol className='row'>
                      {value.map((data) => (
                        <li
                          key={subKey && data[subKey] ? data[subKey] : data}
                          className={`${style?.subCol ? style?.subCol : 'col-3'}`}
                        >
                          {subKey && data[subKey] ? data[subKey] : data}
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
              rowData={summaryUsers.data || []}
              loading={false}
              columnsDef={[
                {
                  id: 1,
                  name: 'name',
                  label: 'ADMIN NAME',
                  width: '20%',
                  cellFormatter: formatName
                },
                { id: 2, name: 'role', label: 'ROLE', width: '12%', cellFormatter: formatRole },
                { id: 3, name: 'username', label: 'EMAIL ID', width: '25%' },
                { id: 4, name: 'gender', label: 'GENDER', width: '9%' },
                {
                  id: 5,
                  name: 'phoneNumber',
                  label: 'CONTACT NUMBER',
                  width: '140px',
                  cellFormatter: formatPhone
                }
              ]}
              isEdit={true}
              isDelete={true}
              page={listParams.page}
              rowsPerPage={listParams.rowsPerPage}
              count={summaryUsers.total}
              onRowEdit={handleEditUserClick}
              onDeleteClick={handleUserDelete}
              handlePageChange={handlePage}
              confirmationTitle={APPCONSTANTS.HEALTH_FACILITY_USER_DELETE_CONFIRMATION}
              deleteTitle={APPCONSTANTS.HEALTH_FACILITY_USER_DELETE_TITLE}
            />
          </DetailCard>
        </div>
        <ModalForm
          show={editHFDetailsModal.isOpen}
          title='Edit Health Facility'
          cancelText='Cancel'
          submitText='Submit'
          handleCancel={closeHFEditModal}
          handleFormSubmit={handleHFDetailsSubmit}
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
          handleFormSubmit={isHFUserEdit ? handleEditUserSubmit : handleAddUserSubmit}
          initialValues={hfUserForEdit.current}
          render={userFormRender}
          mutators={{ ...arrayMutators }}
        />
      </div>
    </>
  );
};

export default HealthFacilitySummary;
