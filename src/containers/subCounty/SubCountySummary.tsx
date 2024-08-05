import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { FormApi } from 'final-form';
import arrayMutators from 'final-form-arrays';

import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import Loader from '../../components/loader/Loader';
import ModalForm from '../../components/modal/ModalForm';
import {
  fetchSubCountyDetail,
  updateSubCountyAdminReq,
  updateSubCountyReq
} from '../../store/subCounty/actions';
import {
  getSubCountyDetailSelector,
  getOuAdminsSelector,
  subCountyLoadingSelector
} from '../../store/subCounty/selectors';
import {
  ISubCountyAdminFormvalue,
  ISubCountyAdmin,
  ISubCountyDetail
} from '../../store/subCounty/types';
import SubCountyForm from '../../components/subCountyForm/SubCountyForm';
import UserForm from '../../components/userForm/UserForm';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import { roleSelector } from '../../store/user/selectors';

import { IRoles, ITimezone } from '../../store/user/types';
import { formatUserToastMsg } from '../../utils/commonUtils';
import useCountryId from '../../hooks/useCountryId';
import {
  createHFUserRequest as createAdminRequest,
  deleteHFUserRequest as deleteAdminRequest
} from '../../store/healthFacility/actions';
import { IHFUserPost } from '../../store/healthFacility/types';

export interface IAdminEditFormValues {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  gender: string;
  countryCode: { countryCode: string };
  timezone: ITimezone;
  country: { countryCode: string; phoneNumberCode: string };
  tenantId?: string;
  roles: IRoles[];
  role?: IRoles[];
}

const SubCountySummary = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch();
  const SubCountyDetail = useSelector(getSubCountyDetailSelector);
  const OUAdmins = useSelector(getOuAdminsSelector);
  const loading = useSelector(subCountyLoadingSelector);
  const currentRole = useSelector(roleSelector);
  const isReadOnly = currentRole === APPCONSTANTS.ROLES.SUB_COUNTY_ADMIN;
  const { OUId, tenantId }: { OUId: string; tenantId: string } = useParams();
  const { county: countyModuleName, subCounty: subCountyModuleName } = NAME_CONSTANTS;
  const countryIdValue = useCountryId();

  // Edit OU
  const [showOUEditModal, setShowOUEditModal] = useState(false);
  const openOUEditModal = useCallback(() => {
    setShowOUEditModal(true);
  }, []);
  const handleOUEdit = ({ name, account, id, tenantId: tenantIdFromEdit }: ISubCountyDetail) => {
    dispatch(
      updateSubCountyReq({
        payload: {
          name,
          countryId: countryIdValue,
          countyId: Number(account?.id),
          id,
          tenantId: tenantIdFromEdit
        },
        isSuccessPayloadNeeded: true,
        successCb: () => {
          setShowOUEditModal(false);
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_UPDATE_SUCCESS, subCountyModuleName)
          );
        },
        failureCb: (e: Error) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_UPDATE_FAIL, subCountyModuleName)
            )
          )
      })
    );
  };

  // OU Admin Form
  const [showOUAdminModal, setShowOUAdminModal] = useState(false);
  const [isOUAdminEdit, setIsOUAdminEdit] = useState(false);
  const OUAdminForEdit = useRef<{ users: IAdminEditFormValues[] }>({ users: [] });

  const handleEditOUAdminClick = useCallback(
    (subCountyAdmin: IAdminEditFormValues) => {
      subCountyAdmin.role = subCountyAdmin.roles;
      setIsOUAdminEdit(true);
      OUAdminForEdit.current = { users: [subCountyAdmin] };
      setShowOUAdminModal(true);
    },
    [OUAdminForEdit]
  );

  const getSubCountyDetails = useCallback(
    (search: string = searchTerm) => {
      dispatch(
        fetchSubCountyDetail({
          tenantId,
          id: OUId,
          searchTerm: search,
          failureCb: (e) =>
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_DETAIL_FETCH_ERROR, subCountyModuleName)
              )
            )
        })
      );
    },
    [OUId, dispatch, searchTerm, tenantId]
  );

  const handleAddOUAdminClick = useCallback(() => {
    setIsOUAdminEdit(false);
    OUAdminForEdit.current = { users: [] };
    setShowOUAdminModal(true);
  }, [OUAdminForEdit]);

  const handleOUAdminEdit = ({ users }: { users: IAdminEditFormValues[] }) => {
    const {
      firstName,
      lastName,
      timezone,
      gender,
      username: email,
      phoneNumber,
      id,
      country,
      username,
      role = []
    } = users[0];
    const [roleId] = role;
    dispatch(
      updateSubCountyAdminReq({
        payload: {
          id,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          gender,
          username: email || username,
          timezone: { id: Number(timezone?.id) },
          email,
          phoneNumber,
          roleIds: [roleId?.id],
          countryCode: country.phoneNumberCode,
          country: { id: countryIdValue },
          tenantId
        },
        successCb: () => {
          getSubCountyDetails(searchTerm);
          setShowOUAdminModal(false);
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_ADMIN_UPDATE_SUCCESS, subCountyModuleName)
          );
        },
        failureCb: (e: Error) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_ADMIN_UPDATE_FAIL, subCountyModuleName)
            )
          )
      })
    );
  };
  const handleOUAdminCreate = ({
    users: [{ firstName, lastName, phoneNumber, timezone, gender, email, id, country, username, role = [] }]
  }: typeof OUAdminForEdit.current) => {
    const [roleId] = role;
    const payload: IHFUserPost = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      username: email || username,
      timezone: { id: Number(timezone?.id) },
      phoneNumber,
      countryCode: country.phoneNumberCode,
      country: { id: countryIdValue },
      tenantId: Number(SubCountyDetail.tenantId),
      roleIds: [roleId?.id]
    };
    if (id) {
      payload.id = Number(id);
    }
    dispatch(
      createAdminRequest({
        data: payload,
        successCb: () => {
          setShowOUAdminModal(false);
          getSubCountyDetails(searchTerm);
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_ADMIN_CREATE_SUCCESS, subCountyModuleName)
          );
        },
        failureCb: (e: Error) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_ADMIN_CREATE_FAIL, subCountyModuleName)
            )
          )
      })
    );
  };

  const handleOUAdminDelete = ({ data: { id } }: { data: ISubCountyAdmin }) => {
    dispatch(
      deleteAdminRequest({
        data: { id: Number(id), tenantIds: [Number(tenantId)] },
        successCb: () => {
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_ADMIN_DELETE_SUCCESS, subCountyModuleName)
          );
          getSubCountyDetails(searchTerm);
        },
        failureCb: (e: Error) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_ADMIN_DELETE_FAIL, subCountyModuleName)
            )
          )
      })
    );
  };

  useEffect(() => {
    getSubCountyDetails();
  }, [getSubCountyDetails]);

  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
  }, []);

  const data = useMemo(
    () => [
      { label: `${subCountyModuleName} Name`, value: SubCountyDetail.name },
      { label: countyModuleName, value: SubCountyDetail.countyName }
    ],
    [SubCountyDetail]
  );

  const formatName = (user: ISubCountyAdmin) => `${user.firstName} ${user.lastName}`;
  const formatPhone = (user: ISubCountyAdmin) => {
    return `${user.countryCode ? '+ ' + user.countryCode : ''} ${user.phoneNumber}`;
  };

  const columnsDef = [
    { id: 1, name: 'firstName', label: 'ADMIN NAME', cellFormatter: formatName },
    { id: 2, name: 'username', label: 'EMAIL ID', width: '250px' },
    { id: 3, name: 'gender', label: 'GENDER' },
    { id: 5, name: 'phoneNumber', label: 'CONTACT NUMBER', cellFormatter: formatPhone }
  ];

  const renderOUAdminForm = useCallback(
    (form: any) => (
      <UserForm
        form={form as FormApi<any>}
        initialEditValue={OUAdminForEdit.current.users[0]}
        disableOptions={true}
        isEdit={isOUAdminEdit}
        countryId={countryIdValue}
        isAdminForm={true}
        defaultSelectedRole={APPCONSTANTS.ROLES.SUB_COUNTY_ADMIN}
      />
    ),
    [isOUAdminEdit]
  );

  return (
    <>
      {loading && <Loader />}
      <div className='row g-0dot625'>
        <div className='col-12'>
          <DetailCard
            buttonLabel={isReadOnly ? undefined : `Edit ${subCountyModuleName}`}
            isEdit={true}
            header={`${subCountyModuleName} Summary`}
            onButtonClick={openOUEditModal}
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
            buttonLabel={isReadOnly ? undefined : `Add ${subCountyModuleName} Admin`}
            header={`${subCountyModuleName} Admin`}
            isSearch={true}
            onSearch={handleSearch}
            searchPlaceholder={APPCONSTANTS.SEARCH_BY_NAME_EMAIL}
            onButtonClick={handleAddOUAdminClick}
          >
            <CustomTable
              columnsDef={columnsDef}
              rowData={OUAdmins || []}
              isEdit={!isReadOnly}
              isDelete={!isReadOnly}
              onRowEdit={handleEditOUAdminClick}
              onDeleteClick={handleOUAdminDelete}
              deleteTitle={formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_ADMIN_DELETE_TITLE, subCountyModuleName)}
              confirmationTitle={formatUserToastMsg(
                APPCONSTANTS.SUB_COUNTY_ADMIN_DELETE_CONFIRMATION,
                subCountyModuleName
              )}
            />
          </DetailCard>
        </div>
      </div>
      <ModalForm
        title={`Edit ${subCountyModuleName}`}
        cancelText='Cancel'
        submitText='Submit'
        show={showOUEditModal}
        handleCancel={() => setShowOUEditModal(false)}
        handleFormSubmit={handleOUEdit}
        initialValues={SubCountyDetail}
      >
        <SubCountyForm isEdit={true} />
      </ModalForm>
      <ModalForm
        title={`${isOUAdminEdit ? 'Edit' : 'Add'} ${subCountyModuleName} Admin`}
        cancelText='Cancel'
        submitText='Submit'
        show={showOUAdminModal}
        handleCancel={() => setShowOUAdminModal(false)}
        handleFormSubmit={isOUAdminEdit ? handleOUAdminEdit : handleOUAdminCreate}
        initialValues={OUAdminForEdit.current}
        mutators={arrayMutators}
        render={renderOUAdminForm}
      />
    </>
  );
};

export default SubCountySummary;
