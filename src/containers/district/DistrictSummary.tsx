import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, RouteComponentProps } from 'react-router-dom';
import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import { fetchDistrictDetailReq, updateDistrictDetail, decactivateDistrictReq } from '../../store/district/actions';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import Loader from '../../components/loader/Loader';
import Modal from '../../components/modal/ModalForm';
import DistrictForm from '../createDistrict/DistrictForm';
import sessionStorageServices from '../../global/sessionStorageServices';
import Deactivation from '../../components/deactivate/Deactivation';
import { PROTECTED_ROUTES } from '../../constants/route';
import UserForm, { IUserFormValues } from '../../components/userForm/UserForm';
import DistrictConsentForm from './DistrictConsentForm';
import { IDistrictAdmin, IDistrictDetail, IDistrictDeactivateFormValues } from '../../store/district/types';
import arrayMutators from 'final-form-arrays';
import IconLegal from '../../assets/images/icon-legal.svg';
import { districtLoadingSelector, districtSelector } from '../../store/district/selectors';
import { roleSelector } from '../../store/user/selectors';
import { healthFacilityLoadingSelector, workflowLoadingSelector } from '../../store/healthFacility/selectors';
import {
  createHFUserRequest as createAdminRequest,
  deleteHFUserRequest as deleteAdminRequest,
  updateHFUserRequest as updateAdminRequest
} from '../../store/healthFacility/actions';
import { formatUserToastMsg } from '../../utils/commonUtils';
import useCountryId from '../../hooks/useCountryId';
import { IRoles } from '../../store/user/types';

interface IMatchParams {
  districtId: string;
  tenantId: string;
}

const DistrictSummary: React.FC<RouteComponentProps<IMatchParams>> = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { districtId, tenantId } = useParams<IMatchParams>();

  const loading = useSelector(districtLoadingSelector);
  const adminLoading = useSelector(healthFacilityLoadingSelector);
  const workflowLoading = useSelector(workflowLoadingSelector);
  const district = useSelector(districtSelector);
  const role = useSelector(roleSelector);
  const countryId = useCountryId();

  const [isOpenAdminModal, setIsOpenAdminModal] = useState(false);
  const [isOpenDistrictModal, setIsOpenDistrictModal] = useState(false);
  const [adminInitialValues, setAdminInitialValues] = useState<IDistrictAdmin>({} as IDistrictAdmin);
  const [isAdd, setIsAdd] = useState(false);
  const [isOpenDeactivateModal, setIsOpenDeactivateModal] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<any>({});
  const [openConsentForm, setOpenConsentForm] = useState(false);

  const isReadOnly = role === APPCONSTANTS.ROLES.DISTRICT_ADMIN;

  const {
    district: { s: districtSName }
  } = NAME_CONSTANTS;

  useEffect(() => {
    getDistrictDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDistrictDetail = useCallback(
    (search?: string) => {
      dispatch(
        fetchDistrictDetailReq({
          tenantId,
          id: districtId,
          searchTerm: search,
          countryId: district?.countryId,
          failureCb: (e: Error) =>
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.DISTRICT_DETAIL_FETCH_ERROR, districtSName)
              )
            ),
          successCb: (res: any) => {
            if (!res?.id) {
              toastCenter.error(
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.DISTRICT_DETAIL_FETCH_ERROR, districtSName)
              );
              handleNavigation();
            }
          }
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, districtId, tenantId]
  );

  const editDeactivateModalRender = (form: any) => {
    return isOpenDeactivateModal ? (
      <Deactivation formName={districtSName.toLowerCase()} />
    ) : (
      <DistrictForm form={form} />
    );
  };

  const handleConsentFormOpen = (data: any) => {
    setSelectedDistrict({ ...data, regionId: countryId || sessionStorageServices.getItem(APPCONSTANTS.FORM_ID) });
    setOpenConsentForm(true);
  };

  const handleConsentFormClose = () => {
    setSelectedDistrict({});
    setOpenConsentForm(false);
  };

  const handleSearch = (search: string) => {
    getDistrictDetail(search);
  };

  const formatName = (user: IDistrictAdmin) => {
    return `${user.firstName} ${user.lastName}`;
  };

  const formatPhone = (user: IDistrictAdmin) => {
    return user.countryCode ? '+ ' + user.countryCode + ' ' + user.phoneNumber : user.phoneNumber;
  };

  const openEditModal = (values: IDistrictAdmin) => {
    const allSuiteAccess = values.roles.map((r: IRoles) => ({
      groupName: r.groupName,
      id: r.groupName
    }));

    const valuesWithRole = {
      ...values,
      suiteAccess: [...new Map(allSuiteAccess.map((item: any) => [item.groupName, item])).values()],
      country: { phoneNumberCode: values.countryCode },
      role: values.roles.filter((r: IRoles) => r.groupName === APPCONSTANTS.spiceRoleGrouped.spice) || [],
      spiceInsightsRole:
        values.roles.filter((r: IRoles) => r.groupName === APPCONSTANTS.spiceRoleGrouped.spiceInsights) || []
    };

    setIsOpenAdminModal(true);
    setAdminInitialValues(valuesWithRole);
    setIsAdd(false);
  };

  const openDistrictEditModal = () => {
    setIsOpenDistrictModal(true);
  };

  const handleDistrictFormSubmit = (values: IDistrictDetail) => {
    const data = JSON.parse(JSON.stringify(values));
    data.district.countryId = countryId || Number(sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID));

    dispatch(
      updateDistrictDetail({
        data: {
          id: data.district.id,
          name: data.district.name.trim(),
          tenantId: data.district.tenantId,
          countryId: countryId || Number(sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID))
        },
        successCb: () => {
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.DISTRICT_UPDATE_SUCCESS, districtSName)
          );
          getDistrictDetail();
          handleCancelClick();
        },
        failureCb: (e: Error) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.DISTRICT_UPDATE_FAIL, districtSName)
            )
          )
      })
    );
  };

  const handleAdminSubmit = ({ users }: { users: IUserFormValues[] }) => {
    const admin: any = users[0];
    const flattenMap = (arr: any) => arr?.flatMap((item: any) => (Array.isArray(item) ? item : [item]));
    const roleIds = flattenMap(admin?.roles)?.map((data: any) => data?.id);
    const payload = {
      firstName: admin.firstName.trim(),
      lastName: admin.lastName.trim(),
      gender: admin.gender,
      phoneNumber: admin.phoneNumber,
      username: admin.email,
      countryCode: admin.countryCode.phoneNumberCode,
      country: { id: countryId || sessionStorageServices.getItem(APPCONSTANTS.FORM_ID) },
      roleIds,
      timezone: { id: Number(admin.timezone.id) },
      tenantId: Number(tenantId)
    };
    if (isAdd) {
      dispatch(
        createAdminRequest({
          data: {
            ...payload
          },
          successCb: () => {
            toastCenter.success(
              APPCONSTANTS.SUCCESS,
              formatUserToastMsg(APPCONSTANTS.DISTRICT_ADMIN_CREATE_SUCCESS, districtSName)
            );
            handleCancelClick();
            getDistrictDetail();
          },
          failureCb: (e) =>
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.ERROR,
                formatUserToastMsg(APPCONSTANTS.DISTRICT_ADMIN_CREATE_FAIL, districtSName)
              )
            )
        })
      );
    } else {
      dispatch(
        updateAdminRequest({
          data: {
            ...(admin as IDistrictAdmin),
            id: admin.id,
            ...payload
          },
          successCb: () => {
            toastCenter.success(
              APPCONSTANTS.SUCCESS,
              formatUserToastMsg(APPCONSTANTS.DISTRICT_ADMIN_UPDATE_SUCCESS, districtSName)
            );
            handleCancelClick();
            getDistrictDetail();
          },
          failureCb: (e) =>
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.ERROR,
                formatUserToastMsg(APPCONSTANTS.DISTRICT_ADMIN_UPDATE_FAIL, districtSName)
              )
            )
        })
      );
    }
  };

  const handleCancelClick = () => {
    setIsOpenAdminModal(false);
    setIsOpenDistrictModal(false);
    setAdminInitialValues({} as IDistrictAdmin);
    setIsOpenDeactivateModal(false);
  };

  const openAddModal = () => {
    setIsOpenAdminModal(true);
    setIsAdd(true);
    setAdminInitialValues({} as IDistrictAdmin);
  };

  const editModalRender = (form: any) => {
    return (
      <UserForm
        form={form}
        initialEditValue={adminInitialValues}
        disableOptions={true}
        isEdit={!isAdd}
        countryId={countryId}
        isAdminForm={true}
        defaultSelectedRole={APPCONSTANTS.ROLES.DISTRICT_ADMIN}
        enableAutoPopulate={true}
      />
    );
  };

  const handleAdminDeleteClick = (values: { data: IDistrictDetail; index: number }) => {
    dispatch(
      deleteAdminRequest({
        data: { id: Number(values.data.id), tenantIds: [Number(district.tenantId)] },
        successCb: () => {
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.DISTRICT_ADMIN_DELETE_SUCCESS, districtSName)
          );
          getDistrictDetail();
        },
        failureCb: (e: Error) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.ERROR,
              formatUserToastMsg(APPCONSTANTS.DISTRICT_ADMIN_DELETE_FAIL, districtSName)
            )
          )
      })
    );
  };

  const showDeactivateModal = () => {
    setIsOpenDeactivateModal(true);
  };

  const handleNavigation = () => {
    let redirectTo: string;
    if (role === APPCONSTANTS.ROLES.REGION_ADMIN) {
      redirectTo = PROTECTED_ROUTES.districtDashboard;
    } else {
      redirectTo = PROTECTED_ROUTES.districtByRegion
        .replace(':regionId', sessionStorageServices.getItem(APPCONSTANTS.FORM_ID))
        .replace(':tenantId', sessionStorageServices.getItem(APPCONSTANTS.ID));
    }
    history.push(redirectTo);
  };

  const handleDeactivate = (values: IDistrictDeactivateFormValues) => {
    const status = values.status.value;
    const { reason } = values;

    dispatch(
      decactivateDistrictReq({
        data: { tenantId: Number(tenantId), status, reason },
        successCb: () => {
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.DISTRICT_DEACTIVATE_SUCCESS, districtSName)
          );
          handleNavigation();
        },
        failureCb: (e) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.ERROR,
              formatUserToastMsg(APPCONSTANTS.DISTRICT_DEACTIVATE_FAIL, districtSName)
            )
          )
      })
    );
  };

  const getSummaryDetails = () => {
    const { name } = district;
    return [{ label: `${districtSName} Name`, value: name }];
  };

  return (
    <>
      {(loading || workflowLoading || adminLoading) && <Loader />}
      <div className='row g-0dot625'>
        <div className='col-12'>
          <DetailCard
            buttonLabel={isReadOnly ? undefined : `Edit ${districtSName}`}
            customLabel={isReadOnly ? '' : 'Consent form'}
            onCustomClick={() => (isReadOnly ? null : handleConsentFormOpen(district))}
            customButtonIcon={isReadOnly ? '' : IconLegal}
            isEdit={true}
            header={`${districtSName} Summary`}
            onButtonClick={openDistrictEditModal}
          >
            <div className='row  gy-1 mt-0dot25 mb-1dot25 mx-0dot5'>
              {getSummaryDetails().map(({ label, value }) => (
                <div key={label} className='col-lg-4 col-sm-6'>
                  <div className='fs-0dot875 charcoal-grey-text'>{label}</div>
                  <div className='primary-title text-ellipsis'>{value || '--'}</div>
                </div>
              ))}
            </div>
          </DetailCard>
        </div>
        <div className='col-12'>
          <DetailCard
            buttonLabel={isReadOnly ? undefined : `Add ${districtSName} Admin`}
            header={`${districtSName} Admin`}
            searchPlaceholder={APPCONSTANTS.SEARCH_BY_NAME_EMAIL}
            isSearch={true}
            onSearch={handleSearch}
            onButtonClick={openAddModal}
          >
            <CustomTable
              rowData={district.users || []}
              columnsDef={[
                {
                  id: 1,
                  name: 'firstName',
                  label: 'Name',
                  width: '125px',
                  cellFormatter: formatName
                },
                { id: 2, name: 'username', label: 'Email ID', width: '220px' },
                {
                  id: 3,
                  name: 'gender',
                  label: 'Gender',
                  width: '110px'
                },
                {
                  id: 4,
                  name: 'phoneNumber',
                  label: 'Contact Number',
                  width: '140px',
                  cellFormatter: formatPhone
                }
              ]}
              isEdit={!isReadOnly}
              isDelete={!isReadOnly}
              onRowEdit={openEditModal}
              onDeleteClick={handleAdminDeleteClick}
              confirmationTitle={formatUserToastMsg(APPCONSTANTS.DISTRICT_ADMIN_DELETE_CONFIRMATION, districtSName)}
              deleteTitle={formatUserToastMsg(APPCONSTANTS.DISTRICT_ADMIN_DELETE_TITLE, districtSName)}
            />
          </DetailCard>
        </div>
        <DistrictConsentForm
          isOpen={openConsentForm}
          consentFormConfig={selectedDistrict}
          handleConsentFormClose={handleConsentFormClose}
        />
        <Modal
          show={isOpenAdminModal}
          title={`${isAdd ? 'Add' : 'Edit'} ${districtSName} Admin`}
          cancelText='Cancel'
          submitText='Submit'
          handleCancel={handleCancelClick}
          handleFormSubmit={handleAdminSubmit}
          initialValues={{ users: adminInitialValues }}
          mutators={arrayMutators}
          render={editModalRender}
        />
        <Modal
          show={isOpenDistrictModal}
          title={isOpenDeactivateModal ? `Deactivate ${districtSName}` : `Edit ${districtSName}`}
          cancelText='Cancel'
          submitText='Submit'
          handleCancel={handleCancelClick}
          handleFormSubmit={!isOpenDeactivateModal ? handleDistrictFormSubmit : handleDeactivate}
          initialValues={!isOpenDeactivateModal ? { district } : {}}
          deactivateLabel={!isOpenDeactivateModal ? `Deactivate ${districtSName}` : ''}
          handleDeactivate={showDeactivateModal}
          isDeactivateModal={isOpenDeactivateModal}
          render={editDeactivateModalRender}
        />
      </div>
    </>
  );
};

export default DistrictSummary;
