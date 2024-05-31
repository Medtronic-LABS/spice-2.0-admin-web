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
  clearSupervisorList,
  clearVillageHFList,
  createHFUserRequest,
  deleteHFUserRequest,
  fetchHFSummaryRequest,
  fetchHFUserListRequest,
  fetchUserDetailRequest,
  updateHFDetailsRequest,
  updateHFUserRequest
} from '../../store/healthFacility/actions';
import {
  IHFUserGet,
  IHFUserPost,
  IHealthFacility,
  IHealthFacilityForm,
  IPeerSupervisor,
  IVillages
} from '../../store/healthFacility/types';
import {
  healthFacilityLoadingSelector,
  healthFacilitySelector,
  userDetailLoadingSelector
} from '../../store/healthFacility/selectors';
import { emailSelector, roleSelector, userDataSelector } from '../../store/user/selectors';
import { IRoles } from '../../store/user/types';
import Loader from '../../components/loader/Loader';

interface IMatchParams {
  healthFacilityId: string;
  hfTenantId: string;
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
    tenantId: hf.tenantId,
    linkedSupervisorIds: (hf.peerSupervisors || []).map(({ id }: { id: number }) => id),
    linkedVillageIds: (hf.linkedVillages || []).map(({ id }: { id: number }) => id),
    clinicalWorkflowIds: hf.workflows
  };
  return postData;
};

export const formatHFUserData = (userData: any[], countryId: number | string, tenantId?: number | string) =>
  userData.map((user: any) => ({
    id: Number(user?.id),
    firstName: user.firstName,
    lastName: user.lastName,
    gender: user.gender,
    username: user.username,
    phoneNumber: user.phoneNumber,
    countryCode: user.country.phoneNumberCode || user.countryCode,
    country: { id: Number(countryId) },
    tenantId: user?.healthFacility?.tenantId ? Number(user.healthFacility.tenantId) : Number(tenantId) || user.tenantId,
    supervisorId: Number(user.supervisor?.id),
    roleIds: Array.isArray(user.roles) ? (user.roles || []).map(({ id }: { id: any }) => id) : [user.roles.id],
    villageIds: (Array.isArray(user?.villages) ? user.villages : []).map(({ id }: { id: number }) => id)
  }));

const HealthFacilitySummary = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { healthFacilityId, hfTenantId } = useParams<IMatchParams>();
  const healthFacility = useSelector(healthFacilitySelector);
  const loading = useSelector(healthFacilityLoadingSelector);
  const regionData = useSelector(userDataSelector).country;
  const role = useSelector(roleSelector);
  const email = useSelector(emailSelector);
  const hfUserDetailLoading = useSelector(userDetailLoadingSelector);

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
        value: healthFacility?.peerSupervisors,
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
    return () => {
      clearSupervisorList();
      clearVillageHFList();
    };
    // eslint-disable-next-line
  }, [listParams, hfTenantId, dispatch]);

  /*
   * Load initial health facility summary details
   */
  const refreshHFDetails = useCallback(() => {
    dispatch(
      fetchHFSummaryRequest({
        tenantId: Number(hfTenantId),
        id: Number(healthFacilityId),
        failureCb: (e) => {
          fetchFailure(e, APPCONSTANTS.HEALTH_FACILITY_LIST_FETCH_ERROR);
        }
      })
    );
  }, [dispatch, healthFacilityId, hfTenantId]);

  const fetchFailure = (e: Error, errorMessage: string) =>
    toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, errorMessage));

  const refreshHFUserList = () => {
    setHFUsers((prevState) => ({ ...prevState, loading: true }));
    dispatch(
      fetchHFUserListRequest({
        countryId: regionData.id,
        tenantId: hfTenantId,
        skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
        limit: listParams.rowsPerPage,
        searchTerm: listParams.searchTerm,
        userBased: !(role === APPCONSTANTS.ROLES.SUPER_ADMIN || role === APPCONSTANTS.ROLES.SUPER_USER),
        tenantBased: true,
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

  const editHFDetailsModalRender = (form: any, ref: HTMLDivElement | null | undefined) => {
    return (
      <HealthFacilityDetailsForm
        formName='healthFacility'
        form={form}
        modalRef={ref}
        isEdit={true}
        data={editHFDetailsModal.data}
      />
    );
  };

  const handleHFEditDetailsSubmit = ({ healthFacility: healthFacilityData }: { healthFacility: IHealthFacility }) => {
    const postData = formatHealthFacility(healthFacilityData, regionData.id);
    dispatch(
      updateHFDetailsRequest({
        data: postData,
        successCb: hfUpdateSuccess,
        failureCb: (e) => {
          fetchFailure(e, APPCONSTANTS.HEALTH_FACILITY_DETAILS_UPDATE_ERROR);
        }
      })
    );
  };

  const hfUpdateSuccess = () => {
    toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.HEALTH_FACILITY_DETAILS_UPDATE_SUCCESS);
    refreshHFDetails();
    refreshHFUserList();
    closeHFEditModal();
  };

  const handleEditUserClick = useCallback(
    (user: any) => {
      dispatch(
        fetchUserDetailRequest({
          id: Number(user?.id),
          successCb: (userData: any) => {
            setIsHFUserEdit(true);
            const postData = { ...userData };
            postData.suiteAccess = userData.roles[0] || [];
            postData.role = postData.roles.filter((r: IRoles) => r.groupName === postData.suiteAccess.groupName) || [];
            postData.supervisor = postData.supervisor && {
              ...postData.supervisor,
              name: `${postData.supervisor.firstName || ''} ${postData.supervisor.lastName || ''}`
            };
            hfUserForEdit.current = { users: [{ ...postData }] };
            setHFUserModal(true);
          },
          failureCb: (e) => {
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.USER_DETAIL_FETCH_FAIL));
          }
        })
      );
    },
    [dispatch]
  );

  const handleEditUserSubmit = ({ users }: { users: any[] }) => {
    const userObj = formatHFUserData(users, regionData.id, hfTenantId);
    const data: IHFUserPost = userObj[0];
    dispatch(
      updateHFUserRequest({
        data,
        successCb: siteUserSuccess,
        failureCb: (e) => {
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
    if (isHFUserEdit) {
      refreshHFUserList();
      refreshHFDetails();
    } else {
      handleSearch('');
    }
    setHFUserModal(false);
  };

  const handleAddUserClick = useCallback(() => {
    setIsHFUserEdit(false);
    hfUserForEdit.current = { users: [] };
    setHFUserModal(true);
  }, [hfUserForEdit]);

  const handleAddUserSubmit = ({ users }: { users: any[] }) => {
    const userObj = formatHFUserData(users, regionData.id, hfTenantId);
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

  const handleUserDelete = ({ data: { id } }: { data: { id: number } }) => {
    dispatch(
      deleteHFUserRequest({
        data: {
          id,
          tenantIds: [Number(hfTenantId)]
        },
        successCb: () => {
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.HEALTH_FACILITY_USER_DELETE_SUCCESS);
          refreshHFUserList();
          refreshHFDetails();
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

  const formatRoles = (user: IHFUserGet) =>
    `${(user.roles || []).map((userRole: IRoles) => userRole.displayName).join(',')}`;

  const userFormRender = (form?: FormApi<any>) => {
    return (
      <UserForm
        form={form as FormApi<any>}
        countryId={regionData.id}
        initialEditValue={hfUserForEdit.current.users[0]}
        disableOptions={true}
        isEdit={isHFUserEdit}
        isHF={true}
        entityName='healthFacility'
        enableAutoPopulate={true}
        hfTenantId={Number(hfTenantId)}
      />
    );
  };

  return (
    <>
      {(loading || hfUserDetailLoading) && <Loader />}
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
                      {(value || []).map((data: IPeerSupervisor | IVillages) => (
                        <li
                          key={subKey && (data as any)[subKey] ? (data as any)[subKey] : JSON.stringify(data)}
                          className={`${style?.subCol ? style?.subCol : 'col-3'}`}
                        >
                          {subKey && (data as any)[subKey] ? (data as any)[subKey] : JSON.stringify(data)}
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
              loading={hfUsers.loading && !(loading || hfUserDetailLoading)}
              columnsDef={[
                {
                  id: 1,
                  name: 'name',
                  label: 'ADMIN NAME',
                  width: '20%',
                  cellFormatter: formatName
                },
                { id: 2, name: 'role', label: 'ROLE', width: '20%', cellFormatter: formatRoles },
                { id: 3, name: 'username', label: 'EMAIL ID', width: '20%' },
                { id: 4, name: 'gender', label: 'GENDER', width: '9%' },
                {
                  id: 5,
                  name: 'phoneNumber',
                  label: 'CONTACT NUMBER',
                  width: '20',
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
              actionFormattor={{
                hideEditIcon: (rowData: any) => rowData.username === email,
                hideDeleteIcon: (rowData: any) => rowData.username === email
              }}
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
