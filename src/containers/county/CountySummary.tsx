import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, RouteComponentProps } from 'react-router-dom';
import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import {
  fetchCountyListDetailReq,
  updateCountyDetail,
  updateCountyAdmin,
  decactivateCountyReq
} from '../../store/county/actions';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import Loader from '../../components/loader/Loader';
import Modal from '../../components/modal/ModalForm';
import CountyForm from '../createCounty/CountyForm';
import sessionStorageServices from '../../global/sessionStorageServices';
import Deactivation from '../../components/deactivate/Deactivation';
import { PROTECTED_ROUTES } from '../../constants/route';
import UserForm, { IUserFormValues } from '../../components/userForm/UserForm';
import CountyConsentForm from './CountyConsentForm';
import { ICountyAdmin, ICountyDetail, ICountyDeactivateFormValues } from '../../store/county/types';
import arrayMutators from 'final-form-arrays';
import IconLegal from '../../assets/images/icon-legal.svg';
import { countyLoadingSelector, countySelector } from '../../store/county/selectors';
import { roleSelector } from '../../store/user/selectors';
import { workflowLoadingSelector } from '../../store/healthFacility/selectors';
import { getRegionDetailsSelector } from '../../store/region/selectors';
import {
  createHFUserRequest as createAdminRequest,
  deleteHFUserRequest as deleteAdminRequest
} from '../../store/healthFacility/actions';
import { formatUserToastMsg } from '../../utils/commonUtils';

interface IMatchParams {
  accountId: string;
  tenantId: string;
}

const CountySummary: React.FC<RouteComponentProps<IMatchParams>> = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { accountId, tenantId } = useParams<IMatchParams>();

  const loading = useSelector(countyLoadingSelector);
  const workflowLoading = useSelector(workflowLoadingSelector);
  const county = useSelector(countySelector);
  const role = useSelector(roleSelector);
  const regionDetails = useSelector(getRegionDetailsSelector);
  const countryId = Number(regionDetails.id);

  const [isOpenAdminModal, setIsOpenAdminModal] = useState(false);
  const [isOpenCountyModal, setIsOpenCountyModal] = useState(false);
  const [adminInitialValues, setAdminInitialValues] = useState<ICountyAdmin>({} as ICountyAdmin);
  const [isAdd, setIsAdd] = useState(false);
  const [isOpenDeactivateModal, setIsOpenDeactivateModal] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState<any>({});
  const [openConsentForm, setOpenConsentForm] = useState(false);

  const isReadOnly = role === APPCONSTANTS.ROLES.ACCOUNT_ADMIN;

  const { county: countyModuleName } = NAME_CONSTANTS;

  useEffect(() => {
    getCountyDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCountyDetail = useCallback(
    (search?: string) => {
      dispatch(
        fetchCountyListDetailReq({
          tenantId,
          id: accountId,
          searchTerm: search,
          failureCb: (e: Error) =>
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.COUNTY_DETAIL_FETCH_ERROR, countyModuleName)
              )
            ),
          successCb: (res: any) => {
            if (!res?.id) {
              toastCenter.error(
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.COUNTY_DETAIL_FETCH_ERROR, countyModuleName)
              );
              handleNavigation();
            }
          }
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, accountId, tenantId]
  );

  const editDeactivateModalRender = (form: any) => {
    return isOpenDeactivateModal ? (
      <Deactivation formName={countyModuleName.toLowerCase()} />
    ) : (
      <CountyForm form={form} />
    );
  };

  const handleConsentFormOpen = (data: any) => {
    setSelectedCounty({ ...data, regionId: countryId || sessionStorageServices.getItem(APPCONSTANTS.FORM_ID) });
    setOpenConsentForm(true);
  };

  const handleConsentFormClose = () => {
    setSelectedCounty({});
    setOpenConsentForm(false);
  };

  const handleSearch = (search: string) => {
    getCountyDetail(search);
  };

  const formatName = (user: ICountyAdmin) => {
    return `${user.firstName} ${user.lastName}`;
  };

  const formatPhone = (user: ICountyAdmin) => {
    return user.countryCode ? '+ ' + user.countryCode + ' ' + user.phoneNumber : user.phoneNumber;
  };

  const openEditModal = (values: ICountyAdmin) => {
    setIsOpenAdminModal(true);
    setAdminInitialValues(values);
    setIsAdd(false);
  };

  const openCountyEditModal = () => {
    setIsOpenCountyModal(true);
  };

  const handleCountyFormSubmit = (values: ICountyDetail) => {
    const data = JSON.parse(JSON.stringify(values));
    data.county.countryId = countryId || Number(sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID));

    dispatch(
      updateCountyDetail({
        data: {
          id: data.county.id,
          name: data.county.name.trim(),
          tenantId: data.county.tenantId,
          countryId: countryId || Number(sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID))
        },
        successCb: () => {
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.COUNTY_UPDATE_SUCCESS, countyModuleName)
          );
          getCountyDetail();
          handleCancelClick();
        },
        failureCb: (e: Error) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.COUNTY_UPDATE_FAIL, countyModuleName)
            )
          )
      })
    );
  };

  const handleAdminSubmit = ({ users }: { users: IUserFormValues[] }) => {
    const admin: any = users[0];
    if (isAdd) {
      const [roleId] = admin.role;
      dispatch(
        createAdminRequest({
          data: {
            firstName: admin.firstName.trim(),
            lastName: admin.lastName.trim(),
            gender: admin.gender,
            phoneNumber: admin.phoneNumber,
            username: admin.email,
            countryCode: admin.country.phoneNumberCode,
            country: { id: countryId || sessionStorageServices.getItem(APPCONSTANTS.FORM_ID) },
            roleIds: [roleId?.id],
            timezone: { id: Number(admin.timezone.id) },
            tenantId: Number(tenantId)
          },
          successCb: () => {
            toastCenter.success(
              APPCONSTANTS.SUCCESS,
              formatUserToastMsg(APPCONSTANTS.COUNTY_ADMIN_CREATE_SUCCESS, countyModuleName)
            );
            handleCancelClick();
            getCountyDetail();
          },
          failureCb: (e) =>
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.ERROR,
                formatUserToastMsg(APPCONSTANTS.COUNTY_ADMIN_CREATE_FAIL, countyModuleName)
              )
            )
        })
      );
    } else {
      admin.tenantId = tenantId;
      dispatch(
        updateCountyAdmin({
          data: {
            ...(admin as ICountyAdmin),
            firstName: admin.firstName.trim(),
            lastName: admin.lastName.trim(),
            country: { id: countryId || sessionStorageServices.getItem(APPCONSTANTS.FORM_ID) }
          },
          successCb: () => {
            toastCenter.success(
              APPCONSTANTS.SUCCESS,
              formatUserToastMsg(APPCONSTANTS.COUNTY_ADMIN_UPDATE_SUCCESS, countyModuleName)
            );
            handleCancelClick();
            getCountyDetail();
          },
          failureCb: (e) =>
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.ERROR,
                formatUserToastMsg(APPCONSTANTS.COUNTY_ADMIN_UPDATE_FAIL, countyModuleName)
              )
            )
        })
      );
    }
  };

  const handleCancelClick = () => {
    setIsOpenAdminModal(false);
    setIsOpenCountyModal(false);
    setAdminInitialValues({} as ICountyAdmin);
    setIsOpenDeactivateModal(false);
  };

  const openAddModal = () => {
    setIsOpenAdminModal(true);
    setIsAdd(true);
    setAdminInitialValues({} as ICountyAdmin);
  };

  const editModalRender = (form: any) => {
    adminInitialValues.role = adminInitialValues.roles;
    return (
      <UserForm
        form={form}
        initialEditValue={adminInitialValues}
        disableOptions={true}
        isEdit={!isAdd}
        countryId={countryId}
        isAdminForm={true}
        defaultSelectedRole={APPCONSTANTS.ROLES.ACCOUNT_ADMIN}
        enableAutoPopulate={true}
      />
    );
  };

  const handleAdminDeleteClick = (values: { data: ICountyDetail; index: number }) => {
    dispatch(
      deleteAdminRequest({
        data: { id: Number(values.data.id), tenantIds: [Number(county.tenantId)] },
        successCb: () => {
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.COUNTY_ADMIN_DELETE_SUCCESS, countyModuleName)
          );
          getCountyDetail();
        },
        failureCb: (e: Error) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.ERROR,
              formatUserToastMsg(APPCONSTANTS.COUNTY_ADMIN_DELETE_FAIL, countyModuleName)
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
      redirectTo = PROTECTED_ROUTES.CountyDashboard;
    } else {
      redirectTo = PROTECTED_ROUTES.countyByRegion
        .replace(':regionId', sessionStorageServices.getItem(APPCONSTANTS.FORM_ID))
        .replace(':tenantId', sessionStorageServices.getItem(APPCONSTANTS.ID));
    }
    history.push(redirectTo);
    history.push(PROTECTED_ROUTES.dashboard);
  };

  const handleDeactivate = (values: ICountyDeactivateFormValues) => {
    const status = values.status.value;
    const { reason } = values;

    dispatch(
      decactivateCountyReq({
        data: { tenantId: Number(tenantId), status, reason },
        successCb: () => {
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.COUNTY_DEACTIVATE_SUCCESS, countyModuleName)
          );
          handleNavigation();
        },
        failureCb: (e) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.ERROR,
              formatUserToastMsg(APPCONSTANTS.COUNTY_DEACTIVATE_FAIL, countyModuleName)
            )
          )
      })
    );
  };

  const getSummaryDetails = () => {
    const { name } = county;
    return [{ label: `${countyModuleName} Name`, value: name }];
  };

  return (
    <>
      {(loading || workflowLoading) && <Loader />}
      <div className='row g-0dot625'>
        <div className='col-12'>
          <DetailCard
            buttonLabel={isReadOnly ? undefined : `Edit ${countyModuleName}`}
            customLabel={isReadOnly ? '' : 'Consent form'}
            onCustomClick={() => (isReadOnly ? null : handleConsentFormOpen(county))}
            customButtonIcon={isReadOnly ? '' : IconLegal}
            isEdit={true}
            header={`${countyModuleName} Summary`}
            onButtonClick={openCountyEditModal}
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
            buttonLabel={isReadOnly ? undefined : `Add ${countyModuleName} Admin`}
            header={`${countyModuleName} Admin`}
            searchPlaceholder={APPCONSTANTS.SEARCH_BY_NAME_EMAIL}
            isSearch={true}
            onSearch={handleSearch}
            onButtonClick={openAddModal}
          >
            <CustomTable
              rowData={county.users || []}
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
              confirmationTitle={formatUserToastMsg(APPCONSTANTS.COUNTY_ADMIN_DELETE_CONFIRMATION, countyModuleName)}
              deleteTitle={formatUserToastMsg(APPCONSTANTS.COUNTY_ADMIN_DELETE_TITLE, countyModuleName)}
            />
          </DetailCard>
        </div>
        <CountyConsentForm
          isOpen={openConsentForm}
          consentFormConfig={selectedCounty}
          handleConsentFormClose={handleConsentFormClose}
        />
        <Modal
          show={isOpenAdminModal}
          title={`${isAdd ? 'Add' : 'Edit'} ${countyModuleName} Admin`}
          cancelText='Cancel'
          submitText='Submit'
          handleCancel={handleCancelClick}
          handleFormSubmit={handleAdminSubmit}
          initialValues={{ users: adminInitialValues }}
          mutators={arrayMutators}
          render={editModalRender}
        />
        <Modal
          show={isOpenCountyModal}
          title={isOpenDeactivateModal ? `Deactivate ${countyModuleName}` : `Edit ${countyModuleName}`}
          cancelText='Cancel'
          submitText='Submit'
          handleCancel={handleCancelClick}
          handleFormSubmit={!isOpenDeactivateModal ? handleCountyFormSubmit : handleDeactivate}
          initialValues={!isOpenDeactivateModal ? { county } : {}}
          deactivateLabel={!isOpenDeactivateModal ? `Deactivate ${countyModuleName}` : ''}
          handleDeactivate={showDeactivateModal}
          isDeactivateModal={isOpenDeactivateModal}
          render={editDeactivateModalRender}
        />
      </div>
    </>
  );
};

export default CountySummary;
