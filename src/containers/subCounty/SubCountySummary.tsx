import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { FormApi } from 'final-form';
import arrayMutators from 'final-form-arrays';

import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import Loader from '../../components/loader/Loader';
import ModalForm from '../../components/modal/ModalForm';
import { fetchSubCountyDetail, updateSubCountyReq } from '../../store/subCounty/actions';
import {
  getSubCountyDetailSelector,
  getOuAdminsSelector,
  subCountyLoadingSelector
} from '../../store/subCounty/selectors';
import { ISubCountyAdmin, ISubCountyDetail } from '../../store/subCounty/types';
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
  deleteHFUserRequest as deleteAdminRequest,
  updateHFUserRequest as updateAdminRequest
} from '../../store/healthFacility/actions';
import { IHFUserPost } from '../../store/healthFacility/types';
import { healthFacilityLoadingSelector } from '../../store/healthFacility/selectors';

export interface IAdminEditFormValues {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  gender: string;
  countryCode: string;
  timezone: ITimezone;
  country: { countryCode?: string; phoneNumberCode: string };
  tenantId?: string;
  roles: IRoles[];
  role?: IRoles[];
}

const SubCountySummary = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch();
  const SubCountyDetail = useSelector(getSubCountyDetailSelector);
  const subCountyAdmins = useSelector(getOuAdminsSelector);
  const loading = useSelector(subCountyLoadingSelector);
  const currentRole = useSelector(roleSelector);
  const adminLoading = useSelector(healthFacilityLoadingSelector);
  const isReadOnly = currentRole === APPCONSTANTS.ROLES.SUB_COUNTY_ADMIN;
  const { subCountyId, tenantId }: { subCountyId: string; tenantId: string } = useParams();
  const { county: countyModuleName, subCounty: subCountyModuleName } = NAME_CONSTANTS;
  const countryIdValue = useCountryId();

  // Edit Sub County
  const [showSubCountyEditModal, setShowSubCountyEditModal] = useState(false);
  const openSubCountyEditModal = useCallback(() => {
    setShowSubCountyEditModal(true);
  }, []);
  const handleSubCountyEdit = ({ name, county, id, tenantId: tenantIdFromEdit }: ISubCountyDetail) => {
    dispatch(
      updateSubCountyReq({
        payload: {
          name,
          countryId: countryIdValue,
          countyId: Number(county?.id),
          id,
          tenantId: tenantIdFromEdit
        },
        isSuccessPayloadNeeded: true,
        successCb: () => {
          setShowSubCountyEditModal(false);
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

  // Sub County Admin Form
  const [showSubCountyAdminModal, setShowSubCountyAdminModal] = useState(false);
  const [isSubCountyAdminEdit, setIsSubCountyAdminEdit] = useState(false);
  const subCountyAdminForEdit = useRef<{ users: IAdminEditFormValues[] }>({ users: [] });

  const handleEditSubCountyAdminClick = useCallback(
    (subCountyAdmin: IAdminEditFormValues) => {
      subCountyAdmin.role = subCountyAdmin.roles;
      subCountyAdmin.country = { phoneNumberCode: subCountyAdmin.countryCode };
      setIsSubCountyAdminEdit(true);
      subCountyAdminForEdit.current = { users: [subCountyAdmin] };
      setShowSubCountyAdminModal(true);
    },
    [subCountyAdminForEdit]
  );

  const getSubCountyDetails = useCallback(
    (search: string = searchTerm) => {
      dispatch(
        fetchSubCountyDetail({
          tenantId,
          id: subCountyId,
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
    [subCountyId, dispatch, searchTerm, tenantId]
  );

  const handleAddSubCountyAdminClick = useCallback(() => {
    setIsSubCountyAdminEdit(false);
    subCountyAdminForEdit.current = { users: [] };
    setShowSubCountyAdminModal(true);
  }, [subCountyAdminForEdit]);

  const handleSubCountyAdminEdit = ({ users }: { users: IAdminEditFormValues[] }) => {
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
      updateAdminRequest({
        data: {
          id: Number(id),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          gender,
          username: email || username,
          timezone: { id: Number(timezone?.id) },
          phoneNumber,
          roleIds: [roleId?.id],
          countryCode: country.phoneNumberCode,
          country: { id: countryIdValue },
          tenantId: Number(tenantId)
        },
        successCb: () => {
          getSubCountyDetails(searchTerm);
          setShowSubCountyAdminModal(false);
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
  const handleSubCountyAdminCreate = ({
    users: [{ firstName, lastName, phoneNumber, timezone, gender, email, id, country, username, role = [] }]
  }: typeof subCountyAdminForEdit.current) => {
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
          setShowSubCountyAdminModal(false);
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

  const handleSubCountyAdminDelete = ({ data: { id } }: { data: ISubCountyAdmin }) => {
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

  const renderSubCountyAdminForm = useCallback(
    (form: any) => (
      <UserForm
        form={form as FormApi<any>}
        initialEditValue={subCountyAdminForEdit.current.users[0]}
        disableOptions={true}
        isEdit={isSubCountyAdminEdit}
        countryId={countryIdValue}
        isAdminForm={true}
        defaultSelectedRole={APPCONSTANTS.ROLES.SUB_COUNTY_ADMIN}
        enableAutoPopulate={true}
      />
    ),
    [isSubCountyAdminEdit]
  );

  return (
    <>
      {(loading || adminLoading) && <Loader />}
      <div className='row g-0dot625'>
        <div className='col-12'>
          <DetailCard
            buttonLabel={isReadOnly ? undefined : `Edit ${subCountyModuleName}`}
            isEdit={true}
            header={`${subCountyModuleName} Summary`}
            onButtonClick={openSubCountyEditModal}
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
            onButtonClick={handleAddSubCountyAdminClick}
          >
            <CustomTable
              columnsDef={columnsDef}
              rowData={subCountyAdmins || []}
              isEdit={!isReadOnly}
              isDelete={!isReadOnly}
              onRowEdit={handleEditSubCountyAdminClick}
              onDeleteClick={handleSubCountyAdminDelete}
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
        show={showSubCountyEditModal}
        handleCancel={() => setShowSubCountyEditModal(false)}
        handleFormSubmit={handleSubCountyEdit}
        initialValues={SubCountyDetail}
      >
        <SubCountyForm isEdit={true} />
      </ModalForm>
      <ModalForm
        title={`${isSubCountyAdminEdit ? 'Edit' : 'Add'} ${subCountyModuleName} Admin`}
        cancelText='Cancel'
        submitText='Submit'
        show={showSubCountyAdminModal}
        handleCancel={() => setShowSubCountyAdminModal(false)}
        handleFormSubmit={isSubCountyAdminEdit ? handleSubCountyAdminEdit : handleSubCountyAdminCreate}
        initialValues={subCountyAdminForEdit.current}
        mutators={arrayMutators}
        render={renderSubCountyAdminForm}
      />
    </>
  );
};

export default SubCountySummary;
