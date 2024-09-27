import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { FormApi } from 'final-form';
import arrayMutators from 'final-form-arrays';

import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import Loader from '../../components/loader/Loader';
import ModalForm from '../../components/modal/ModalForm';
import { fetchChiefdomDetail, updateChiefdomReq } from '../../store/chiefdom/actions';
import {
  getChiefdomDetailSelector,
  getOuAdminsSelector,
  chiefdomLoadingSelector
} from '../../store/chiefdom/selectors';
import { IChiefdomAdmin, IChiefdomDetail } from '../../store/chiefdom/types';
import ChiefdomForm from '../../components/chiefdomForm/ChiefdomForm';
import UserForm from '../../components/userForm/UserForm';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import { roleSelector } from '../../store/user/selectors';

import { IRoles, ITimezone } from '../../store/user/types';
import { formatUserToastMsg } from '../../utils/commonUtils';
import useCountryId from '../../hooks/useCountryId';
import {
  createHFUserRequest as createAdminRequest,
  deleteHFUserRequest as deleteAdminRequest,
  updateHFUserRequest as updateAdminRequest
} from '../../store/healthFacility/actions';
import { IHFUserPost } from '../../store/healthFacility/types';
import { healthFacilityLoadingSelector } from '../../store/healthFacility/selectors';

export interface IAdminEditFormValues {
  spiceInsightsRole: IRoles[];
  suiteAccess: Array<{ groupName: string; id: string }>;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  gender: string;
  countryCode: { phoneNumberCode: string; id: string };
  timezone: ITimezone;
  tenantId?: string;
  roles: IRoles[];
  role?: IRoles[];
}

const ChiefdomSummary = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch();
  const ChiefdomDetail = useSelector(getChiefdomDetailSelector);
  const chiefdomAdmins = useSelector(getOuAdminsSelector);
  const loading = useSelector(chiefdomLoadingSelector);
  const currentRole = useSelector(roleSelector);
  const adminLoading = useSelector(healthFacilityLoadingSelector);
  const isReadOnly = currentRole === APPCONSTANTS.ROLES.CHIEFDOM_ADMIN;
  const { chiefdomId, tenantId }: { chiefdomId: string; tenantId: string } = useParams();
  const {
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName }
  } = NAME_CONSTANTS;
  const countryIdValue = useCountryId();

  // Edit Chiefdom
  const [showChiefdomEditModal, setShowChiefdomEditModal] = useState(false);
  const openChiefdomEditModal = useCallback(() => {
    setShowChiefdomEditModal(true);
  }, []);
  const handleChiefdomEdit = ({ name, district, id, tenantId: tenantIdFromEdit }: IChiefdomDetail) => {
    dispatch(
      updateChiefdomReq({
        payload: {
          name,
          countryId: countryIdValue,
          districtId: Number(district?.id),
          id,
          tenantId: tenantIdFromEdit
        },
        isSuccessPayloadNeeded: true,
        successCb: () => {
          setShowChiefdomEditModal(false);
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.CHIEFDOM_UPDATE_SUCCESS, chiefdomSName)
          );
        },
        failureCb: (e: Error) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.CHIEFDOM_UPDATE_FAIL, chiefdomSName)
            )
          )
      })
    );
  };

  // Chiefdom Admin Form
  const [showChiefdomAdminModal, setShowChiefdomAdminModal] = useState(false);
  const [isChiefdomAdminEdit, setIsChiefdomAdminEdit] = useState(false);
  const chiefdomAdminForEdit = useRef<{ users: IAdminEditFormValues[] }>({ users: [] });

  const handleEditChiefdomAdminClick = useCallback(
    (chiefdomAdmin: IAdminEditFormValues) => {
      const allSuiteAccess = chiefdomAdmin.roles.map((r: IRoles) => ({
        groupName: r.groupName,
        id: r.groupName
      }));
      chiefdomAdmin.suiteAccess = [...new Map(allSuiteAccess.map((item: any) => [item.groupName, item])).values()];
      chiefdomAdmin.role =
        chiefdomAdmin.roles.filter((r: IRoles) => r.groupName === APPCONSTANTS.spiceRoleGrouped.spice) || [];
      chiefdomAdmin.spiceInsightsRole =
        chiefdomAdmin.roles.filter((r: IRoles) => r.groupName === APPCONSTANTS.spiceRoleGrouped.spiceInsights) || [];
      setIsChiefdomAdminEdit(true);
      chiefdomAdminForEdit.current = { users: [chiefdomAdmin] };
      setShowChiefdomAdminModal(true);
    },
    [chiefdomAdminForEdit]
  );

  const getChiefdomDetails = useCallback(
    (search: string = searchTerm) => {
      dispatch(
        fetchChiefdomDetail({
          tenantId,
          id: chiefdomId,
          searchTerm: search,
          countryId: Number(ChiefdomDetail?.countryId) || null,
          failureCb: (e) =>
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.CHIEFDOM_DETAIL_FETCH_ERROR, chiefdomSName)
              )
            )
        })
      );
    },
    [ChiefdomDetail?.countryId, chiefdomId, chiefdomSName, dispatch, searchTerm, tenantId]
  );

  const handleAddChiefdomAdminClick = useCallback(() => {
    setIsChiefdomAdminEdit(false);
    chiefdomAdminForEdit.current = { users: [] };
    setShowChiefdomAdminModal(true);
  }, [chiefdomAdminForEdit]);

  const handleChiefdomAdminEdit = ({ users }: { users: IAdminEditFormValues[] }) => {
    const {
      firstName,
      lastName,
      timezone,
      gender,
      username: email,
      phoneNumber,
      id,
      username,
      countryCode,
      roles
    } = users[0];
    const flattenMap = (arr: any) => arr?.flatMap((item: any) => (Array.isArray(item) ? item : [item]));
    const roleIds = flattenMap(roles)?.map((role: any) => role?.id);
    dispatch(
      updateAdminRequest({
        data: {
          id: Number(id),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          gender,
          username: email || username,
          timezone: { id: Number(timezone?.id) },
          phoneNumber,
          roleIds,
          countryCode: countryCode.phoneNumberCode,
          country: { id: countryIdValue },
          tenantId: Number(tenantId)
        },
        successCb: () => {
          getChiefdomDetails(searchTerm);
          setShowChiefdomAdminModal(false);
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.CHIEFDOM_ADMIN_UPDATE_SUCCESS, chiefdomSName)
          );
        },
        failureCb: (e: Error) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.CHIEFDOM_ADMIN_UPDATE_FAIL, chiefdomSName)
            )
          )
      })
    );
  };
  const handleChiefdomAdminCreate = ({
    users: [{ firstName, lastName, phoneNumber, timezone, gender, email, id, countryCode, username, roles, role = [] }]
  }: typeof chiefdomAdminForEdit.current) => {
    const flattenMap = (arr: any) => arr?.flatMap((item: any) => (Array.isArray(item) ? item : [item]));
    const roleIds = flattenMap(roles)?.map((roleList: any) => roleList?.id);
    const payload: IHFUserPost = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      username: email || username,
      timezone: { id: Number(timezone?.id) },
      phoneNumber,
      countryCode: countryCode?.phoneNumberCode,
      country: { id: countryIdValue },
      tenantId: Number(ChiefdomDetail.tenantId),
      roleIds
    };
    if (id) {
      payload.id = Number(id);
    }
    dispatch(
      createAdminRequest({
        data: payload,
        successCb: () => {
          setShowChiefdomAdminModal(false);
          getChiefdomDetails(searchTerm);
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.CHIEFDOM_ADMIN_CREATE_SUCCESS, chiefdomSName)
          );
        },
        failureCb: (e: Error) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.CHIEFDOM_ADMIN_CREATE_FAIL, chiefdomSName)
            )
          )
      })
    );
  };

  const handleChiefdomAdminDelete = ({ data: { id } }: { data: IChiefdomAdmin }) => {
    dispatch(
      deleteAdminRequest({
        data: { id: Number(id), tenantIds: [Number(tenantId)] },
        successCb: () => {
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.CHIEFDOM_ADMIN_DELETE_SUCCESS, chiefdomSName)
          );
          getChiefdomDetails(searchTerm);
        },
        failureCb: (e: Error) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.CHIEFDOM_ADMIN_DELETE_FAIL, chiefdomSName)
            )
          )
      })
    );
  };

  useEffect(() => {
    getChiefdomDetails();
  }, [getChiefdomDetails]);

  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
  }, []);

  const data = useMemo(
    () => [
      { label: `${chiefdomSName} Name`, value: ChiefdomDetail.name },
      { label: districtSName, value: ChiefdomDetail.districtName }
    ],
    [ChiefdomDetail]
  );

  const formatName = (user: IChiefdomAdmin) => `${user.firstName} ${user.lastName}`;
  const formatPhone = (user: IChiefdomAdmin) => {
    return `${user.countryCode ? '+ ' + user.countryCode : ''} ${user.phoneNumber}`;
  };

  const columnsDef = [
    { id: 1, name: 'firstName', label: 'ADMIN NAME', cellFormatter: formatName },
    { id: 2, name: 'username', label: 'EMAIL ID', width: '250px' },
    { id: 3, name: 'gender', label: 'GENDER' },
    { id: 5, name: 'phoneNumber', label: 'CONTACT NUMBER', cellFormatter: formatPhone }
  ];

  const renderChiefdomAdminForm = useCallback(
    (form: any) => (
      <UserForm
        form={form as FormApi<any>}
        initialEditValue={chiefdomAdminForEdit.current.users[0]}
        disableOptions={true}
        isEdit={isChiefdomAdminEdit}
        countryId={countryIdValue}
        isAdminForm={true}
        defaultSelectedRole={APPCONSTANTS.ROLES.CHIEFDOM_ADMIN}
        enableAutoPopulate={true}
      />
    ),
    [isChiefdomAdminEdit]
  );

  return (
    <>
      {(loading || adminLoading) && <Loader />}
      <div className='row g-0dot625'>
        <div className='col-12'>
          <DetailCard
            buttonLabel={isReadOnly ? undefined : `Edit ${chiefdomSName}`}
            isEdit={true}
            header={`${chiefdomSName} Summary`}
            onButtonClick={openChiefdomEditModal}
          >
            <div className='row gy-1 mt-0dot25 mb-1dot25 mx-0dot5'>
              {data.map(({ label, value }) => (
                <div key={label} className={'col-lg-4 col-sm-6'}>
                  <div className='fs-0dot875 charcoal-grey-text'>{label}</div>
                  <div className='primary-title text-ellipsis'>{value || '--'}</div>
                </div>
              ))}
            </div>
          </DetailCard>
        </div>
        <div className='col-12'>
          <DetailCard
            buttonLabel={isReadOnly ? undefined : `Add ${chiefdomSName} Admin`}
            header={`${chiefdomSName} Admin`}
            isSearch={true}
            onSearch={handleSearch}
            searchPlaceholder={APPCONSTANTS.SEARCH_BY_NAME_EMAIL}
            onButtonClick={handleAddChiefdomAdminClick}
          >
            <CustomTable
              columnsDef={columnsDef}
              rowData={chiefdomAdmins || []}
              isEdit={!isReadOnly}
              isDelete={!isReadOnly}
              onRowEdit={handleEditChiefdomAdminClick}
              onDeleteClick={handleChiefdomAdminDelete}
              deleteTitle={formatUserToastMsg(APPCONSTANTS.CHIEFDOM_ADMIN_DELETE_TITLE, chiefdomSName)}
              confirmationTitle={formatUserToastMsg(APPCONSTANTS.CHIEFDOM_ADMIN_DELETE_CONFIRMATION, chiefdomSName)}
            />
          </DetailCard>
        </div>
      </div>
      <ModalForm
        title={`Edit ${chiefdomSName}`}
        cancelText='Cancel'
        submitText='Submit'
        show={showChiefdomEditModal}
        handleCancel={() => setShowChiefdomEditModal(false)}
        handleFormSubmit={handleChiefdomEdit}
        initialValues={ChiefdomDetail}
      >
        <ChiefdomForm isEdit={true} />
      </ModalForm>
      <ModalForm
        title={`${isChiefdomAdminEdit ? 'Edit' : 'Add'} ${chiefdomSName} Admin`}
        cancelText='Cancel'
        submitText='Submit'
        show={showChiefdomAdminModal}
        handleCancel={() => setShowChiefdomAdminModal(false)}
        handleFormSubmit={isChiefdomAdminEdit ? handleChiefdomAdminEdit : handleChiefdomAdminCreate}
        initialValues={chiefdomAdminForEdit.current}
        mutators={arrayMutators}
        render={renderChiefdomAdminForm}
      />
    </>
  );
};

export default ChiefdomSummary;
