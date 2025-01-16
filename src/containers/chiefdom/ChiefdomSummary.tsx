import { FormApi } from 'final-form';
import arrayMutators from 'final-form-arrays';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import ChiefdomForm from '../../components/chiefdomForm/ChiefdomForm';
import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import Loader from '../../components/loader/Loader';
import ModalForm from '../../components/modal/ModalForm';
import UserForm from '../../components/userForm/UserForm';
import APPCONSTANTS from '../../constants/appConstants';
import { fetchChiefdomDetail, updateChiefdomReq } from '../../store/chiefdom/actions';
import {
  chiefdomLoadingSelector,
  getChiefdomDetailSelector,
  getOuAdminsSelector
} from '../../store/chiefdom/selectors';
import { IChiefdomAdmin, IChiefdomDetail } from '../../store/chiefdom/types';
import { roleSelector } from '../../store/user/selectors';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';

import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import useCountryId from '../../hooks/useCountryId';
import {
  createHFUserRequest as createAdminRequest,
  deleteHFUserRequest as deleteAdminRequest,
  updateHFUserRequest as updateAdminRequest
} from '../../store/healthFacility/actions';
import { healthFacilityLoadingSelector } from '../../store/healthFacility/selectors';
import { IRoles, ITimezone } from '../../store/user/types';
import { formatUserToastMsg } from '../../utils/commonUtils';
import { getAdminPayload } from '../../utils/formatObjectUtils';

interface IAdminEditFormValues {
  reports: IRoles[];
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

/**
 * Component for diaplaying chiefdom summary page
 */
const ChiefdomSummary = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch();
  const ChiefdomDetail = useSelector(getChiefdomDetailSelector);
  const chiefdomAdmins = useSelector(getOuAdminsSelector);
  const loading = useSelector(chiefdomLoadingSelector);
  const currentRole = useSelector(roleSelector);
  const adminLoading = useSelector(healthFacilityLoadingSelector);
  const isReadOnly = currentRole === APPCONSTANTS.ROLES.CHIEFDOM_ADMIN;
  const countryId = useCountryId();
  const { chiefdomId, tenantId }: { chiefdomId: string; tenantId: string } = useParams();
  const {
    appTypes,
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName }
  } = useAppTypeConfigs();
  const countryIdValue = useCountryId();

  // Edit Chiefdom
  const [showChiefdomEditModal, setShowChiefdomEditModal] = useState(false);
  /**
   * Handler function for open chiefdom edit modal
   */
  const openChiefdomEditModal = useCallback(() => {
    setShowChiefdomEditModal(true);
  }, []);

  /**
   * Handles the editing of a chiefdom's details.
   *
   * @param {Object} chiefdomDetail - The details of the chiefdom being edited.
   * @param {string} chiefdomDetail.name - The name of the chiefdom.
   * @param {Object} chiefdomDetail.district - The district to which the chiefdom belongs.
   * @param {string} chiefdomDetail.id - The ID of the chiefdom.
   * @param {string} chiefdomDetail.tenantId - The tenant ID of the chiefdom.
   */
  const handleChiefdomEdit = ({ name, district, id, tenantId: tenantIdFromEdit }: IChiefdomDetail) => {
    dispatch(
      updateChiefdomReq({
        payload: {
          name: name.trim(),
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

  /**
   * Handler for chiefdom admin edit button click
   * @param {IAdminEditFormValues} chiefdomAdmin - Chiefdom admin data
   */
  const handleEditChiefdomAdminClick = useCallback(
    (chiefdomAdmin: IAdminEditFormValues) => {
      const allSuiteAccess = chiefdomAdmin.roles.map((r: IRoles) => ({
        groupName: r.groupName,
        id: r.groupName
      }));
      chiefdomAdmin.suiteAccess = [...new Map(allSuiteAccess.map((item: any) => [item.groupName, item])).values()];
      chiefdomAdmin.role =
        chiefdomAdmin.roles.filter((r: IRoles) => r.groupName === APPCONSTANTS.spiceRoleGrouped.spice) || [];
      chiefdomAdmin.reports =
        chiefdomAdmin.roles.filter((r: IRoles) => r.groupName === APPCONSTANTS.spiceRoleGrouped.reports) || [];
      setIsChiefdomAdminEdit(true);
      chiefdomAdminForEdit.current = { users: [chiefdomAdmin] };
      setShowChiefdomAdminModal(true);
    },
    [chiefdomAdminForEdit]
  );

  /**
   * Function to get chiefdom detail
   * @param {string} search
   */
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

  /**
   * Handler function for add chiefdom admin button click
   */
  const handleAddChiefdomAdminClick = useCallback(() => {
    setIsChiefdomAdminEdit(false);
    chiefdomAdminForEdit.current = { users: [] };
    setShowChiefdomAdminModal(true);
  }, [chiefdomAdminForEdit]);

  /**
   * Handler function for chiefdom admin edit
   * @param {IAdminEditFormValues[]} users - user form value as an array
   */
  const handleChiefdomAdminEdit = ({ users }: { users: IAdminEditFormValues[] }) => {
    const userObj = getAdminPayload({
      appTypes,
      userFormData: users,
      countryId: countryIdValue,
      tenantId: Number(tenantId),
      isFromList: false,
      isFromSummaryOrProfilePage: true
    });
    const payload = userObj[0];
    dispatch(
      updateAdminRequest({
        data: payload,
        successCb: () => {
          getChiefdomDetails();
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

  /**
   * Handler function for chiefdom admin create
   * @param {IAdminEditFormValues[]} users - user form value as an array
   */
  const handleChiefdomAdminCreate = ({ users }: { users: IAdminEditFormValues[] }) => {
    const userObj = getAdminPayload({
      appTypes,
      userFormData: users,
      countryId: countryIdValue,
      tenantId: Number(ChiefdomDetail.tenantId),
      isFromList: false,
      isFromSummaryOrProfilePage: true
    });
    const payload = userObj[0];
    dispatch(
      createAdminRequest({
        data: payload,
        successCb: () => {
          setShowChiefdomAdminModal(false);
          getChiefdomDetails();
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

  /**
   * Handler function for chiefdom admin delete
   * @param {IChiefdomAdmin} data - Admin to delete
   * @param {number} data.id - id value of admin to delete
   */
  const handleChiefdomAdminDelete = ({ data: { id } }: { data: IChiefdomAdmin }) => {
    dispatch(
      deleteAdminRequest({
        data: { id: Number(id), countryId, appTypes, tenantIds: [Number(tenantId)] },
        successCb: () => {
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.CHIEFDOM_ADMIN_DELETE_SUCCESS, chiefdomSName)
          );
          getChiefdomDetails();
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

  /**
   * useEffect for get the chiefdom details
   */
  useEffect(() => {
    getChiefdomDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  /**
   * Handler function for search
   * @param {string} search - search value
   */
  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
  }, []);

  const data = useMemo(
    () => [
      { label: `${chiefdomSName} Name`, value: ChiefdomDetail.name },
      { label: districtSName, value: ChiefdomDetail.districtName }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ChiefdomDetail]
  );

  /**
   * Handler function for format name
   * @param {IChiefdomAdmin} user - Admin data
   */
  const formatName = (user: IChiefdomAdmin) => `${user.firstName} ${user.lastName}`;
  /**
   * Handler function for format phone
   * @param {IChiefdomAdmin} user - Admin data
   */
  const formatPhone = (user: IChiefdomAdmin) => {
    return `${user.countryCode ? '+ ' + user.countryCode : ''} ${user.phoneNumber}`;
  };

  const columnsDef = [
    { id: 1, name: 'firstName', label: 'ADMIN NAME', cellFormatter: formatName },
    { id: 2, name: 'username', label: 'EMAIL ID', width: '250px' },
    { id: 3, name: 'gender', label: 'GENDER' },
    { id: 5, name: 'phoneNumber', label: 'CONTACT NUMBER', cellFormatter: formatPhone }
  ];

  /**
   * Renders the UserForm inside an edit modal
   * @param {any} form - The form API instance used to manage the form's state and submissions.
   */
  const renderChiefdomAdminForm = useCallback(
    (form: any) => (
      <UserForm
        form={form as FormApi<any>}
        initialEditValue={chiefdomAdminForEdit.current.users[0]}
        disableOptions={true}
        isEdit={isChiefdomAdminEdit}
        countryId={countryIdValue}
        defaultSelectedRole={APPCONSTANTS.ROLES.CHIEFDOM_ADMIN}
        enableAutoPopulate={true}
        userFormParams={{ isChiefdom: true, isAdminForm: true }}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
