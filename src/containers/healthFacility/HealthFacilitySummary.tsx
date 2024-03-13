import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import arrayMutators from 'final-form-arrays';

import DetailCard from '../../components/detailCard/DetailCard';
import CustomTable from '../../components/customTable/CustomTable';
import APPCONSTANTS from '../../constants/appConstants';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import ModalForm from '../../components/modal/ModalForm';
import { FormApi } from 'final-form';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import HealthFacilityDetailsForm from './HealthFacilityDetailsForm';
import UserForm from '../../components/userForm/UserForm';
import {
  createHFUserRequest,
  deleteHFUserRequest,
  fetchHFSummaryRequest,
  fetchHFUserListRequest,
  updateHFDetailsRequest,
  updateHFUserRequest
} from '../../store/healthFacility/actions';
import { IHFUserGet, IHFUserPost, IHealthFacility, IHealthFacilityForm } from '../../store/healthFacility/types';
import { healthFacilitySelector } from '../../store/healthFacility/selectors';
import { userDataSelector } from '../../store/user/selectors';

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

export const formatHealthFacility = (hf: any, countryId: number | string) => {
  const postData = {
    id: hf.id,
    name: hf.name,
    type: hf.type.name,
    phuFocalPersonName: hf.phuFocalPersonName,
    phuFocalPersonNumber: hf.phuFocalPersonNumber,
    address: hf.address,
    district: hf.district,
    chiefdom: hf.chiefdom,
    cityName: hf.city.name,
    latitude: hf.latitude,
    longitude: hf.longitude,
    postalCode: hf.postalCode,
    country: { id: countryId },
    language: hf.language.name,
    parentTenantId: hf.chiefdom?.id,
    linkedSupervisorIds: (hf.linkedVillages || []).map(({ id }: { id: number }) => id),
    linkedVillageIds: (hf.linkedVillages || []).map(({ id }: { id: number }) => id),
    clinicalWorkflowIds: (hf.clinicalWorkflows || []).map(({ id }: { id: number }) => id)
  };
  return postData;
};

export const formatHFUserData = (userData: any[], countryId: number | string, tenantId?: number | string) =>
  userData.map((user: any) => {
    const data = {
      id: Number(user?.id),
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      username: user.username,
      phoneNumber: user.phoneNumber,
      country: { id: Number(countryId) },
      countryCode: user.countryCode.countryCode || user.countryCode,
      tenantId: user?.assignedHealthFacility?.tenantId
        ? Number(user.assignedHealthFacility.tenantId)
        : Number(tenantId),
      supervisorId: Number(user.selectedPeerSupervisor?.id),
      roleIds: Array.isArray(user.roles) ? (user.roles || []).map(({ id }: { id: any }) => id) : [user.roles.id],
      villageIds: (user.assignedVillages || []).map(({ id }: { id: number }) => id)
    };
    return data;
  });

const HealthFacilitySummary = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { healthFacilityId, tenantId } = useParams<IMatchParams>();
  const healthFacility = useSelector(healthFacilitySelector);
  const regionData = useSelector(userDataSelector).country;

  const [editHFDetailsModal, setEditHFDetailsModal] = useState<IModalState>({
    isOpen: false
  });

  const [hfUsers, setHFUsers] = useState<ISummaryUsersState>({
    loading: false
  });
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();

  const [showHFUserModal, setHFUserModal] = useState(false);
  const [isHFUserEdit, setIsHFUserEdit] = useState(false);
  const hfUserForEdit = useRef<{ users: any[] }>({ users: [] });

  const lableData = useMemo(
    () => [
      { label: 'Health Facility Name', value: healthFacility?.name },
      { label: 'Health Facility Type', value: healthFacility?.type },
      { label: 'PHU Focal Person Name', value: healthFacility?.phuFocalPersonName },
      { label: 'PHU Focal Person No', value: healthFacility?.phuFocalPersonNumber },
      { label: 'District', value: healthFacility?.district?.name },
      { label: 'Chiefdom', value: healthFacility?.chiefdom?.name },
      { label: 'Address', value: healthFacility?.address },
      { label: 'City/Village', value: healthFacility?.cityName },
      { label: 'Latitude', value: healthFacility?.latitude },
      { label: 'Longitude', value: healthFacility?.longitude },
      { label: 'Pin code', value: healthFacility?.postalCode },
      { label: 'Language', value: healthFacility?.language },
      {
        label: 'Linked Peer Supervisor',
        value: healthFacility?.linkedPeerSupervisor,
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
    [healthFacility]
  );

  /*
   * To Handle initial data loading, pagination and search
   * requests for users table
   */
  useEffect(() => {
    refreshHFUserList();
    refreshHFDetails();
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
        failureCb: (e) => {
          fetchFailure(e, APPCONSTANTS.HEALTH_FACILITY_LIST_FETCH_ERROR);
        }
      })
    );
  }, [dispatch, healthFacilityId, tenantId]);

  const fetchFailure = (e: Error, errorMessage: string) =>
    toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, errorMessage));

  const refreshHFUserList = () => {
    setHFUsers((prevState) => ({ ...prevState, loading: true }));
    dispatch(
      fetchHFUserListRequest({
        countryId: regionData.id,
        tenantId,
        skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
        limit: listParams.rowsPerPage,
        searchTerm: listParams.searchTerm,
        userBased: false,
        tenantBased: false,
        successCb: turnOffUsersTableLoading,
        failureCb: (e: Error) => {
          turnOffUsersTableLoading();
          fetchFailure(e, APPCONSTANTS.HEALTH_FACILITY_USERS_FETCH_ERROR);
        }
      })
    );
  };

  const turnOffUsersTableLoading = (data: IHFUserGet[] | any[] = [], total = 0) => {
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
        isOpen: true,
        data: {
          ...healthFacility,
          type: { id: healthFacility.type, name: healthFacility.type },
          city: { id: healthFacility.cityName, name: healthFacility.cityName },
          language: { id: healthFacility.language, name: healthFacility.language }
        } as IHealthFacilityForm
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

  const handleHFEditDetailsSubmit = ({ healthFacility: healthFacilityData }: { healthFacility: IHealthFacility }) => {
    const postData = formatHealthFacility(healthFacilityData, regionData.id);
    dispatch(
      updateHFDetailsRequest({
        data: postData,
        successCb: hfUpdateSuccess,
        failureCb: (e) => {
          closeHFEditModal();
          fetchFailure(e, APPCONSTANTS.HEALTH_FACILITY_DETAILS_UPDATE_ERROR);
        }
      })
    );
  };

  const hfUpdateSuccess = () => {
    toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.HEALTH_FACILITY_DETAILS_UPDATE_SUCCESS);
    refreshHFDetails();
    closeHFEditModal();
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
    const userObj = formatHFUserData(users, regionData.id, tenantId);
    const data: IHFUserPost = userObj[0];
    dispatch(
      updateHFUserRequest({
        data,
        successCb: siteUserSuccess,
        failureCb: (e) => {
          setHFUserModal(false);
          fetchFailure(e, APPCONSTANTS.HEALTH_FACILITY_USER_UPDATE_ERROR);
        }
      })
    );
  };

  const siteUserSuccess = () => {
    const successMessage = isHFUserEdit
      ? APPCONSTANTS.HEALTH_FACILITY_USER_UPDATE_SUCCESS
      : APPCONSTANTS.HEALTH_FACILITY_USER_CREATE_SUCCESS;
    toastCenter.success(APPCONSTANTS.SUCCESS, successMessage);
    isHFUserEdit ? refreshHFUserList() : handleSearch('');
    setHFUserModal(false);
  };

  const handleAddUserClick = useCallback(() => {
    setIsHFUserEdit(false);
    hfUserForEdit.current = { users: [] };
    setHFUserModal(true);
  }, [hfUserForEdit]);

  const handleAddUserSubmit = ({ users }: { users: any[] }) => {
    const userObj = formatHFUserData(users, regionData.id, tenantId);
    const data: IHFUserPost = userObj[0];
    dispatch(
      createHFUserRequest({
        data,
        successCb: siteUserSuccess,
        failureCb: (e: Error) => {
          setHFUserModal(false);
          fetchFailure(e, APPCONSTANTS.HEALTH_FACILITY_USER_CREATE_ERROR);
        }
      })
    );
  };

  const handleUserDelete = ({ data: { id, tenantId: userTenantId } }: { data: { id: number; tenantId: number } }) => {
    dispatch(
      deleteHFUserRequest({
        data: {
          id,
          tenantId: userTenantId
        },
        successCb: () => {
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.HEALTH_FACILITY_USER_DELETE_SUCCESS);
          refreshHFUserList();
        },
        failureCb: (e) => {
          fetchFailure(e, APPCONSTANTS.HEALTH_FACILITY_USER_DELETE_FAIL);
        }
      })
    );
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
    if (user.roles.length) {
      return user.roles.filter(({ groupName }: { groupName: string }) => groupName === 'SPICE')[0].displayName;
    }
  };

  const userFormRender = (form?: FormApi<any>) => {
    return (
      <UserForm
        form={form as FormApi<any>}
        initialEditValue={hfUserForEdit.current.users[0]}
        disableOptions={true}
        isEdit={isHFUserEdit}
        isHF={true}
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
              rowData={hfUsers.data || []}
              loading={hfUsers.loading}
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
              count={hfUsers.total}
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
