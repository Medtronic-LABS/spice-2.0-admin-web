import arrayMutators from 'final-form-arrays';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory, useParams } from 'react-router-dom';
import IconLegal from '../../assets/images/icon-legal.svg';
import CustomTable from '../../components/customTable/CustomTable';
import Deactivation from '../../components/deactivate/Deactivation';
import DetailCard from '../../components/detailCard/DetailCard';
import Loader from '../../components/loader/Loader';
import Modal from '../../components/modal/ModalForm';
import UserForm, { IUserFormValues } from '../../components/userForm/UserForm';
import APPCONSTANTS from '../../constants/appConstants';
import { PROTECTED_ROUTES } from '../../constants/route';
import sessionStorageServices from '../../global/sessionStorageServices';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import useCountryId from '../../hooks/useCountryId';
import { decactivateDistrictReq, fetchDistrictDetailReq, updateDistrictDetail } from '../../store/district/actions';
import { districtLoadingSelector, districtSelector } from '../../store/district/selectors';
import { IDistrict, IDistrictAdmin, IDistrictDeactivateFormValues, IDistrictDetail } from '../../store/district/types';
import {
  createHFUserRequest as createAdminRequest,
  deleteHFUserRequest as deleteAdminRequest,
  updateHFUserRequest as updateAdminRequest
} from '../../store/healthFacility/actions';
import { healthFacilityLoadingSelector, workflowLoadingSelector } from '../../store/healthFacility/selectors';
import { roleSelector } from '../../store/user/selectors';
import { IRoles } from '../../store/user/types';
import { formatUserToastMsg } from '../../utils/commonUtils';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import DistrictForm from '../createDistrict/DistrictForm';
import DistrictConsentForm from './DistrictConsentForm';
import { getAdminPayload } from '../../utils/formatObjectUtils';

interface IMatchParams {
  districtId: string;
  tenantId: string;
}

/**
 * Component for displaying the district summary page.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.match - The match object containing route parameters.
 * @param {IMatchParams} props.match.params - The route parameters passed to the component.
 * @param {string} props.match.params.districtId - The ID of the district from the route.
 * @param {string} props.match.params.tenantId - The tenant ID from the route.
 *
 */
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
  const [searchTerm, setSearchTerm] = useState('');

  const isReadOnly = role === APPCONSTANTS.ROLES.DISTRICT_ADMIN;

  const {
    appTypes,
    district: { s: districtSName }
  } = useAppTypeConfigs();

  /**
   * useEffect for to get district detail
   */
  useEffect(() => {
    getDistrictDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  /**
   * Function to get district detail
   * @param {string}: search
   */
  const getDistrictDetail = useCallback(
    (search: string = searchTerm) => {
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
    [dispatch, districtId, tenantId, district?.countryId, searchTerm]
  );

  /**
   * Handler for edit button click
   * @param {any} form - Form object for edit district form
   */
  const editDeactivateModalRender = (form: any) => {
    return isOpenDeactivateModal ? <Deactivation formName={districtSName.toLowerCase()} /> : <DistrictForm />;
  };

  /**
   * Handler function for open consent form
   * @param {IDistrict} data - District data for consent form
   */

  const handleConsentFormOpen = (data: IDistrict) => {
    setSelectedDistrict({ ...data, regionId: countryId || sessionStorageServices.getItem(APPCONSTANTS.FORM_ID) });
    setOpenConsentForm(true);
  };

  /**
   * Handler function for consent form close
   */
  const handleConsentFormClose = () => {
    setSelectedDistrict({});
    setOpenConsentForm(false);
  };

  /**
   * Handler function for search text
   * @param {string} search - search text
   */
  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  /**
   * Function for format name
   * @param {IDistrictAdmin} user - Admin data
   */
  const formatName = (user: IDistrictAdmin) => {
    return `${user.firstName} ${user.lastName}`;
  };

  /**
   * Function for format phonenumber
   * @param {IDistrictAdmin} user - Admin data
   */
  const formatPhone = (user: IDistrictAdmin) => {
    return user.countryCode ? '+ ' + user.countryCode + ' ' + user.phoneNumber : user.phoneNumber;
  };

  /**
   * Handler function for district admin edit button click
   * @param {IDistrictAdmin} values - District admin data
   */
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
      reports: values.roles.filter((r: IRoles) => r.groupName === APPCONSTANTS.spiceRoleGrouped.reports) || []
    };

    setIsOpenAdminModal(true);
    setAdminInitialValues(valuesWithRole);
    setIsAdd(false);
  };

  /**
   * Handler function for district edit button click
   */
  const openDistrictEditModal = () => {
    setIsOpenDistrictModal(true);
  };

  /**
   * Handler for district edit form
   * @param {IDistrictDetail} values - district details
   */
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

  /**
   * Description
   * @param {IUserFormValues[]} users - user data from user form as an array
   */
  const handleAdminSubmit = ({ users }: { users: IUserFormValues[] }) => {
    const userObj = getAdminPayload({
      appTypes,
      userFormData: users,
      countryId: countryId || sessionStorageServices.getItem(APPCONSTANTS.FORM_ID),
      tenantId: Number(tenantId),
      isFromList: false,
      isFromSummaryOrProfilePage: true
    });
    const payload = userObj[0];

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

  /**
   * Handler function for close edit modal for both district and admin
   */
  const handleCancelClick = () => {
    setIsOpenAdminModal(false);
    setIsOpenDistrictModal(false);
    setAdminInitialValues({} as IDistrictAdmin);
    setIsOpenDeactivateModal(false);
  };

  /**
   * Handler function admin add modal for open
   */
  const openAddModal = () => {
    setIsOpenAdminModal(true);
    setIsAdd(true);
    setAdminInitialValues({} as IDistrictAdmin);
  };

  /**
   * Renders the UserForm inside an edit modal
   * @param {any} form - The form API instance used to manage the form's state and submissions.
   */
  const editModalRender = (form: any) => {
    return (
      <UserForm
        form={form}
        initialEditValue={adminInitialValues}
        disableOptions={true}
        isEdit={!isAdd}
        countryId={countryId}
        defaultSelectedRole={APPCONSTANTS.ROLES.DISTRICT_ADMIN}
        enableAutoPopulate={true}
        userFormParams={{ isAdminForm: true }}
      />
    );
  };

  /**
   * Handler for admin delete button click
   * @param {object} values - Admin values
   * @param {IDistrictDetail} values.data - District Detail value
   * @param {number} values.index - Index value from the table
   */
  const handleAdminDeleteClick = (values: { data: IDistrictDetail; index: number }) => {
    dispatch(
      deleteAdminRequest({
        data: { id: Number(values.data.id), appTypes, countryId, tenantIds: [Number(district.tenantId)] },
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

  /**
   * Handler for open deactivate modal for district
   */
  const showDeactivateModal = () => {
    setIsOpenDeactivateModal(true);
  };

  /**
   * Handler for handle navigation once deactivated the district
   */
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

  /**
   * Handler for deactivate district
   * @param {IDistrictDeactivateFormValues} values - deactivate form field values
   */
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

  /**
   * Global function to show all fields in summary page
   */
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
