import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, RouteComponentProps } from 'react-router-dom';
import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import {
  fetchAccountDetailReq,
  updateAccountDetail,
  updateAccountAdmin,
  createAccountAdmin,
  deleteAccountAdmin,
  decactivateAccountReq
} from '../../store/account/actions';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import Loader from '../../components/loader/Loader';
import Modal from '../../components/modal/ModalForm';
import AccountForm from '../createAccount/AccountForm';
import sessionStorageServices from '../../global/sessionStorageServices';
import Deactivation from '../../components/deactivate/Deactivation';
import { PROTECTED_ROUTES } from '../../constants/route';
import UserForm from '../../components/userForm/UserForm';
import AccountConsentForm from './AccountConsentForm';
import {
  IAccountAdmin,
  IAccountDetail,
  IAdminEditFormValues,
  IAccountDeactivateFormValues,
  IClinicalWorkflow
} from '../../store/account/types';
import arrayMutators from 'final-form-arrays';
import IconLegal from '../../assets/images/icon-legal.svg';
import { convertToCaptilize } from '../../utils/validation';
import { accountsLoadingSelector, accountSelector } from '../../store/account/selectors';
import { roleSelector } from '../../store/user/selectors';
import { workflowLoadingSelector } from '../../store/healthFacility/selectors';
import { getRegionDetailsSelector } from '../../store/region/selectors';

interface IMatchParams {
  accountId: string;
  tenantId: string;
}

const AccountSummary: React.FC<RouteComponentProps<IMatchParams>> = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { accountId, tenantId } = useParams<IMatchParams>();

  const loading = useSelector(accountsLoadingSelector);
  const workflowLoading = useSelector(workflowLoadingSelector);
  const account = useSelector(accountSelector);
  const role = useSelector(roleSelector);
  const regionDetails = useSelector(getRegionDetailsSelector);
  const countryId = Number(regionDetails.id);

  const [isOpenAdminModal, setIsOpenAdminModal] = useState(false);
  const [isOpenAccountModal, setIsOpenAccountModal] = useState(false);
  const [adminInitialValues, setAdminInitialValues] = useState<IAccountAdmin>({} as IAccountAdmin);
  const [isAdd, setIsAdd] = useState(false);
  const [isOpenDeactivateModal, setIsOpenDeactivateModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>({});
  const [openConsentForm, setOpenConsentForm] = useState(false);

  const isReadOnly = role === APPCONSTANTS.ROLES.ACCOUNT_ADMIN;

  const moduleName = NAME_CONSTANTS.county;

  useEffect(() => {
    getAccountDetail();
  }, []);

  const getAccountDetail = useCallback(
    (search?: string) => {
      dispatch(
        fetchAccountDetailReq({
          tenantId,
          id: accountId,
          searchTerm: search,
          failureCb: (e: Error) =>
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.ACCOUNT_DETAIL_FETCH_ERROR)),
          successCb: (res: any) => {
            if (!res?.id) {
              toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.ACCOUNT_DETAIL_FETCH_ERROR);
              handleNavigation();
            }
          }
        })
      );
    },
    [dispatch, accountId, tenantId]
  );

  const editDeactivateModalRender = (form: any) => {
    return isOpenDeactivateModal ? <Deactivation formName={moduleName.toLowerCase()} /> : <AccountForm form={form} />;
  };

  const handleConsentFormOpen = (data: any) => {
    setSelectedAccount({ ...data, regionId: countryId || sessionStorageServices.getItem(APPCONSTANTS.FORM_ID) });
    setOpenConsentForm(true);
  };

  const handleConsentFormClose = () => {
    setSelectedAccount({});
    setOpenConsentForm(false);
  };

  const handleSearch = (search: string) => {
    getAccountDetail(search);
  };

  const formatName = (user: IAccountAdmin) => {
    return `${user.firstName} ${user.lastName}`;
  };

  const formatPhone = (user: IAccountAdmin) => {
    return user.countryCode ? '+ ' + user.countryCode + ' ' + user.phoneNumber : user.phoneNumber;
  };

  const openEditModal = (values: IAccountAdmin) => {
    setIsOpenAdminModal(true);
    setAdminInitialValues(values);
    setIsAdd(false);
  };

  const openAccountEditModal = () => {
    setIsOpenAccountModal(true);
  };

  const handleAccountFormSubmit = (values: IAccountDetail) => {
    const data = JSON.parse(JSON.stringify(values));
    data.account.maxNoOfUsers = data.account.maxNoOfUsers ? Number(data.account.maxNoOfUsers) : 0;
    data.account.countryId = countryId || Number(sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID));
    delete data.account.users;
    delete data.account.country;

    dispatch(
      updateAccountDetail({
        data: data.account,
        successCb: () => {
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.ACCOUNT_UPDATE_SUCCESS);
          getAccountDetail();
          handleCancelClick();
        },
        failureCb: (e: Error) =>
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.ACCOUNT_UPDATE_FAIL))
      })
    );
  };

  const handleAdminSubmit = ({ users }: { users: IAdminEditFormValues[] }) => {
    const admin: any = users[0];
    delete admin.index;
    admin.countryCode = admin.countryCode.countryCode;

    if (isAdd) {
      createAccountAdmin({
        data: {
          ...admin,
          firstName: admin.firstName.trim(),
          lastName: admin.lastName.trim(),
          username: admin.email,
          tenantId,
          timezone: { id: admin.timezone.id },
          country: { id: countryId || sessionStorageServices.getItem(APPCONSTANTS.FORM_ID) }
        } as IAccountAdmin,
        successCb: () => {
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.ACCOUNT_ADMIN_CREATE_SUCCESS);
          handleCancelClick();
          getAccountDetail();
        },
        failureCb: (e) =>
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.ACCOUNT_ADMIN_CREATE_FAIL))
      });
    } else {
      admin.tenantId = tenantId;
      updateAccountAdmin({
        data: {
          ...(admin as IAccountAdmin),
          firstName: admin.firstName.trim(),
          lastName: admin.lastName.trim(),
          country: { id: countryId || sessionStorageServices.getItem(APPCONSTANTS.FORM_ID) }
        },
        successCb: () => {
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.ACCOUNT_ADMIN_UPDATE_SUCCESS);
          handleCancelClick();
          getAccountDetail();
        },
        failureCb: (e) =>
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.ACCOUNT_ADMIN_UPDATE_FAIL))
      });
    }
  };

  const handleCancelClick = () => {
    setIsOpenAdminModal(false);
    setIsOpenAccountModal(false);
    setAdminInitialValues({} as IAccountAdmin);
    setIsOpenDeactivateModal(false);
  };

  const openAddModal = () => {
    setIsOpenAdminModal(true);
    setIsAdd(true);
    setAdminInitialValues({} as IAccountAdmin);
  };

  const editModalRender = (form: any) => {
    return (
      <UserForm
        form={form}
        initialEditValue={adminInitialValues}
        disableOptions={true}
        isEdit={!isAdd}
        countryId={countryId}
      />
    );
  };

  const handleAdminDeleteClick = (values: { data: IAccountDetail; index: number }) => {
    dispatch(
      deleteAccountAdmin({
        data: { id: values.data.id, tenantId: account.tenantId },
        successCb: () => {
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.ACCOUNT_ADMIN_DELETE_SUCCESS);
          getAccountDetail();
        },
        failureCb: (e: Error) =>
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.ACCOUNT_ADMIN_DELETE_FAIL))
      })
    );
  };

  const showDeactivateModal = () => {
    setIsOpenDeactivateModal(true);
  };

  const handleNavigation = () => {
    let redirectTo: string;
    if (role === APPCONSTANTS.ROLES.REGION_ADMIN) {
      redirectTo = PROTECTED_ROUTES.accountDashboard;
    } else {
      redirectTo = PROTECTED_ROUTES.accountByRegion
        .replace(':regionId', sessionStorageServices.getItem(APPCONSTANTS.FORM_ID))
        .replace(':tenantId', sessionStorageServices.getItem(APPCONSTANTS.ID));
    }
    history.push(redirectTo);
    history.push(PROTECTED_ROUTES.dashboard);
  };

  const handleDeactivate = (values: IAccountDeactivateFormValues) => {
    const status = values.status.value;
    const { reason } = values;

    dispatch(
      decactivateAccountReq({
        data: { tenantId: Number(tenantId), status, reason },
        successCb: () => {
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.ACCOUNT_DEACTIVATE_SUCCESS);
          handleNavigation();
        },
        failureCb: (e) =>
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.ACCOUNT_DEACTIVATE_FAIL))
      })
    );
  };

  const getSummaryDetails = () => {
    const { name } = account;
    return [
      { label: `${moduleName} Name`, value: name }
    ];
  };

  return (
    <>
      {(loading || workflowLoading) && <Loader />}
      <div className='row g-0dot625'>
        <div className='col-12'>
          <DetailCard
            buttonLabel={isReadOnly ? undefined : `Edit ${moduleName}`}
            customLabel={isReadOnly ? '' : 'Consent form'}
            onCustomClick={() => (isReadOnly ? null : handleConsentFormOpen(account))}
            customButtonIcon={isReadOnly ? '' : IconLegal}
            isEdit={true}
            header={`${moduleName} Summary`}
            onButtonClick={openAccountEditModal}
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
            buttonLabel={isReadOnly ? undefined : `Add ${moduleName} Admin`}
            header={`${moduleName} Admin`}
            searchPlaceholder={APPCONSTANTS.SEARCH_BY_NAME_EMAIL}
            isSearch={true}
            onSearch={handleSearch}
            onButtonClick={openAddModal}
          >
            <CustomTable
              rowData={account.users || []}
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
              confirmationTitle={APPCONSTANTS.ACCOUNT_ADMIN_DELETE_CONFIRMATION}
              deleteTitle={APPCONSTANTS.ACCOUNT_ADMIN_DELETE_TITLE}
            />
          </DetailCard>
        </div>
        <AccountConsentForm
          isOpen={openConsentForm}
          consentFormConfig={selectedAccount}
          handleConsentFormClose={handleConsentFormClose}
        />
        <Modal
          show={isOpenAdminModal}
          title={`${isAdd ? 'Add' : 'Edit'} ${moduleName} Admin`}
          cancelText='Cancel'
          submitText='Submit'
          handleCancel={handleCancelClick}
          handleFormSubmit={handleAdminSubmit}
          initialValues={{ users: adminInitialValues }}
          mutators={arrayMutators}
          render={editModalRender}
        />
        <Modal
          show={isOpenAccountModal}
          title={isOpenDeactivateModal ? `Deactivate ${moduleName}` : `Edit ${moduleName}`}
          cancelText='Cancel'
          submitText='Submit'
          handleCancel={handleCancelClick}
          handleFormSubmit={!isOpenDeactivateModal ? handleAccountFormSubmit : handleDeactivate}
          initialValues={!isOpenDeactivateModal ? { account } : {}}
          deactivateLabel={!isOpenDeactivateModal ? `Deactivate ${moduleName}` : ''}
          handleDeactivate={showDeactivateModal}
          isDeactivateModal={isOpenDeactivateModal}
          render={editDeactivateModalRender}
        />
      </div>
    </>
  );
};

export default AccountSummary;
