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

  const [editHealthFacilityDetailsModal, setEditHealthFacilityDetailsModal] = useState<IModalState>({
    isOpen: false
  });

  const [summaryUsers, setSummaryUsers] = useState<ISummaryUsersState>({
    loading: false,
    data: [
      {
        id: 1,
        adminName: 'Albert Flores',
        roleName: 'Nurse',
        username: 'albert@exmple.com',
        gender: 'Male',
        countryCode: '232',
        phoneNumber: '9840123456'
      },
      {
        id: 2,
        adminName: 'Albert Flores',
        roleName: 'Nurse',
        username: 'albert@exmple.com',
        gender: 'Male',
        countryCode: '232',
        phoneNumber: '9840123456'
      }
    ]
  });
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();

  const [showHealtFacilityUserModal, setHealthFacilityUserModal] = useState(false);
  const [isHealthFacilityUserEdit, setIsHealthFacilityUserEdit] = useState(false);
  const healtFacilityUserForEdit = useRef<{ users: any[] }>({ users: [] });
  const summaryDetails = useMemo(
    () =>
      ({
        name: 'Kalangba',
        type: 'CHP',
        phuName: 'Neil Kamara',
        phuNo: '+254 79474839',
        district: 'Port Loko',
        chiefdom: 'Kamaranka',
        address: '',
        city: 'Makatha',
        latitude: '',
        longitude: '',
        postalCode: '485645',
        linkedPeerSupervisor: '',
        language: '',
        linkedVillages: [
          { name: 'Village 1' },
          { name: 'Village 2' },
          { name: 'Village 3' },
          { name: 'Village 4' },
          { name: 'Village 5' },
          { name: 'Village 6' },
          { name: 'Village 7' },
          { name: 'Village 8' },
          { name: 'Village 9' },
          { name: 'Village 10' },
          { name: 'Village 11' }
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
        subKey: 'name',
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

  const openHealthFacilityEditModal = () => {
    if (summaryDetails) {
      setEditHealthFacilityDetailsModal({
        isOpen: true,
        data: {
          ...summaryDetails
        } as any
      });
    } else {
      toastCenter.info('');
    }
  };

  const closeHealthFacilityEditModal = () => {
    setEditHealthFacilityDetailsModal({
      isOpen: false
    });
  };

  const editHealthFacilityDetailsModalRender = () => {
    return <></>;
  };

  const handleHealthFacilityDetailsSubmit = () => {
    //
  };

  const handleEditUserClick = useCallback(
    (user: any) => {
      setIsHealthFacilityUserEdit(true);
      user.country = { countryCode: user.countryCode || '' };
      healtFacilityUserForEdit.current = { users: [{ ...user }] };
      setHealthFacilityUserModal(true);
    },
    [healtFacilityUserForEdit]
  );

  const handleEditUserSubmit = ({ users }: { users: any[] }) => {
    //
  };

  const handleAddUserClick = useCallback(() => {
    setIsHealthFacilityUserEdit(false);
    healtFacilityUserForEdit.current = { users: [] };
    setHealthFacilityUserModal(true);
  }, [healtFacilityUserForEdit]);

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

  const formatRole = (user: any) => {
    if (user.roleName) {
      const role = user.roleName as keyof typeof ROLE_LABELS;
      return ROLE_LABELS[role] || user.roleName;
    }
  };

  const userFormRender = (form?: FormApi<any>) => {
    return <></>;
  };

  return (
    <>
      <div className='row g-0dot625'>
        <div className='col-12'>
          <DetailCard
            buttonLabel='Edit Health Facility'
            isEdit={true}
            header='Health Facility Summary'
            onButtonClick={openHealthFacilityEditModal}
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
                  name: 'adminName',
                  label: 'ADMIN NAME',
                  width: '20%'
                },
                { id: 2, name: 'roleName', label: 'ROLE', width: '12%', cellFormatter: formatRole },
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
          show={editHealthFacilityDetailsModal.isOpen}
          title='Edit Health Facility'
          cancelText='Cancel'
          submitText='Submit'
          handleCancel={closeHealthFacilityEditModal}
          handleFormSubmit={handleHealthFacilityDetailsSubmit}
          initialValues={{ healthFacility: editHealthFacilityDetailsModal.data }}
          render={editHealthFacilityDetailsModalRender}
          size='modal-lg'
          mutators={arrayMutators}
        />
        <ModalForm
          show={showHealtFacilityUserModal}
          title={`${isHealthFacilityUserEdit ? 'Edit' : 'Add'} User`}
          cancelText='Cancel'
          submitText='Submit'
          handleCancel={() => setHealthFacilityUserModal(false)}
          handleFormSubmit={isHealthFacilityUserEdit ? handleEditUserSubmit : handleAddUserSubmit}
          initialValues={healtFacilityUserForEdit.current}
          render={userFormRender}
          mutators={{ ...arrayMutators }}
        />
      </div>
    </>
  );
};

export default HealthFacilitySummary;
