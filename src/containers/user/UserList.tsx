import { FormApi } from 'final-form';
import arrayMutators from 'final-form-arrays';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import { ReactComponent as PasswordChangeIcon } from '../../assets/images/reset-password.svg';
import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import Loader from '../../components/loader/Loader';
import ModalForm from '../../components/modal/ModalForm';
import UserForm, { ModuleNames } from '../../components/userForm/UserForm';
import APPCONSTANTS from '../../constants/appConstants';
import { villageBasedRoles } from '../../constants/roleConstants';
import sessionStorageServices from '../../global/sessionStorageServices';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import { useRoleOptions } from '../../hooks/roleOptionsHook';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import { CHIEFDOM_ADMIN, HEALTH_FACILITY_ADMIN } from '../../routes';
import {
  clearHFList,
  clearSupervisorList,
  clearVillageHFList,
  createHFUserRequest,
  deleteHFUserRequest,
  fetchHFListRequest,
  fetchHFUserListRequest,
  fetchPeerSupervisorListRequest,
  fetchUserDetailRequest,
  updateHFUserRequest
} from '../../store/healthFacility/actions';
import {
  healthFacilityListSelector,
  healthFacilityListUsersTotalSelector,
  healthFacilityLoadingSelector,
  healthFacilityUserListSelector,
  peerSupervisorListSelector,
  userDetailLoadingSelector,
  healthFacilityUsersLoadingSelector,
  peerSupervisorLoadingSelector
} from '../../store/healthFacility/selectors';
import { IHFUserGet, IHFUserPost, IPeerSupervisor, IUserRole } from '../../store/healthFacility/types';
import {
  changePassword,
  fetchCHWListRequest,
  fetchUserRolesAction,
  forgotPasswordRequest,
  updateUserStatus,
  reassignCHWRequest,
  offlineSyncRequest
} from '../../store/user/actions';
import {
  countryIdSelector,
  emailSelector,
  roleSelector,
  userRolesSelector,
  chwListSelector
} from '../../store/user/selectors';
import { IRoles } from '../../store/user/types';
import { getUserPayload } from '../../utils/formatObjectUtils';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import ResetPasswordFields, { generatePassword } from '../authentication/ResetPasswordFields';
import { chwColumnDef, columnDef } from './userListMeta';
import { filterHFByAppTypes, formatUserToastMsg } from '../../utils/commonUtils';
import Radio from '../../components/formFields/Radio';
import { Field } from 'react-final-form';
import './UserList.scss';
import ConfirmationModalPopup from '../../components/customTable/ConfirmationModalPopup';

export interface IMatchParams {
  tenantId: string;
  regionId: string;
  districtId: string;
  chiefdomId: string;
  healthFacilityId: string;
}
export interface IUserModalState {
  isOpen: boolean;
  isEdit: boolean;
  isSupervisor?: boolean;
  isActivating?: boolean;
}

// Separate states for each modal
interface IPeerSupervisorModal {
  isOpen: boolean;
  isEdit: boolean;
}

interface ICHWListModal {
  isOpen: boolean;
  userData?: any;
}

/**
 * Component for User List
 * @returns {React.ReactElement}
 */
const UserList = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { tenantId, healthFacilityId, districtId, chiefdomId } = useParams<IMatchParams>();
  const healthFacilityUserListLoading = useSelector(healthFacilityUsersLoadingSelector);
  const { SEND_EMAIL, CHANGE_PASSWORD } = APPCONSTANTS.PASSWORD_VALUES;
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const [isOpenUserModal, setIsOpenUserModal] = useState<IUserModalState>({
    isOpen: false,
    isEdit: false,
    isSupervisor: false
  });
  const [isOpenPeerSupervisorModal, setIsOpenPeerSupervisorModal] = useState<IPeerSupervisorModal>({
    isOpen: false,
    isEdit: false
  });
  const [isOpenCHWListModal, setIsOpenCHWListModal] = useState<ICHWListModal>({
    isOpen: false
  });
  const [selectedOption, setSelectedOption] = useState('');
  const countryId = useSelector(countryIdSelector);
  const countryIdValue = countryId?.id || sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID);
  const role = useSelector(roleSelector);
  const email = useSelector(emailSelector);
  const rolesGrouped = useSelector(userRolesSelector);
  const hfUserList = useSelector(healthFacilityUserListSelector);
  const loading = useSelector(healthFacilityLoadingSelector);
  const hfUserCount = useSelector(healthFacilityListUsersTotalSelector);
  const hfUserDetailLoading = useSelector(userDetailLoadingSelector);
  const healthFacilityList = useSelector(healthFacilityListSelector);
  const chwList = useSelector(chwListSelector);
  const peerSupervisorLoading = useSelector(peerSupervisorLoadingSelector);
  const isSuperUser = [APPCONSTANTS.ROLES.SUPER_ADMIN, APPCONSTANTS.ROLES.SUPER_USER].includes(role);
  const userForEdit = useRef<{ users: any[] }>({ users: [] });
  const [selectedFacility, setSelectedFacility] = useState<string[]>();
  const [selectedRole, setSelectedRole] = useState<string[]>();
  const [changePasswordLoading, setChangePasswordLoading] = useState<boolean>(false);
  const [peerSupervisors, setPeerSupervisors] = useState<IPeerSupervisor[]>([]);
  const [isOpenCHWUserModal, setIsOpenCHWUserModal] = useState<IUserModalState>({
    isOpen: false,
    isEdit: false,
    isSupervisor: false,
    isActivating: false
  });

  const { pathname } = useLocation();
  const currentModule: ModuleNames = pathname.split('/')[1];

  const [allRoles, setAllRoles] = useState([] as IRoles[]);

  // State management for user activation/deactivation
  const [openConfirmationModal, setOpenConfirmationModal] = useState<{
    isOpen: boolean;
    isActivating: boolean;
    userData: any;
    roleId?: number;
    title?: string;
    message?: string;
    cancelText?: string;
    submitText?: string;
    customButtonLabel?: string;
    handleCustomButton?: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
    WarningMessage?: string;
    syncDate?: string | null;
  }>({ isOpen: false, isActivating: false, userData: {} });
  const {
    appTypes,
    userList: {
      filters: { available: showFilters },
      activeToogle: { available: showActiveToggle },
      passwordPreference: { available: showPasswordPreference }
    },
    healthFacility: { s: healthFacilitySname, p: healthFacilityPname },
    isCommunity
  } = useAppTypeConfigs();

  /**
   * useCallback hook to refresh the user list.
   */
  const refreshHFUserList = useCallback(() => {
    return dispatch(
      fetchHFUserListRequest({
        countryId: countryIdValue,
        skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
        limit: listParams.rowsPerPage,
        searchTerm: listParams.searchTerm,
        roleNames: selectedRole || [],
        isSiteUsers: true,
        isFacilityUsersOnly: healthFacilityId || districtId || chiefdomId ? true : false,
        tenantBased: role === HEALTH_FACILITY_ADMIN,
        tenantId,
        tenantIds: role === HEALTH_FACILITY_ADMIN || role === CHIEFDOM_ADMIN ? [tenantId] : selectedFacility || [],
        failureCb: (e: Error) => {
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.USERS_LIST_FETCH_ERROR));
        }
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    countryIdValue,
    listParams.page,
    listParams.rowsPerPage,
    listParams.searchTerm,
    selectedRole,
    tenantId,
    selectedFacility
  ]);

  /**
   * useEffect for refrech the list whenever filter gets changed
   */
  useEffect(() => {
    refreshHFUserList();
    return () => {
      dispatch(clearSupervisorList());
      dispatch(clearVillageHFList());
    };
  }, [dispatch, refreshHFUserList, selectedFacility, selectedRole]);

  /**
   * useEffect for fetch roles whenever countryId or rolesGrouped gets changed
   */
  useEffect(() => {
    if (!rolesGrouped?.hasOwnProperty('SPICE') && showFilters) {
      dispatch(
        fetchUserRolesAction({
          countryId: countryIdValue,
          failureCb: (_) => toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.USER_ROLES_FETCH_ERROR)
        })
      );
    }
  }, [countryIdValue, dispatch, rolesGrouped, showFilters]);

  /**
   * Handler function for user delete
   * @param {object} data
   * @param {number} data.id - User id for user to delete
   * @param {any[]} data.organizations - user organization for user to delete
   */
  const handleUserDelete = useCallback(
    ({ data: { id, organizations = [] } }: { data: { id: number; organizations: any[] } }) => {
      dispatch(
        deleteHFUserRequest({
          data: {
            id,
            appTypes,
            countryId: countryIdValue,
            tenantIds: organizations.map((s) => Number(s.id))
          },
          successCb: () => {
            toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.USER_DELETE_SUCCESS);
            refreshHFUserList();
          },
          failureCb: (e) => {
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.USER_DELETE_FAIL));
          }
        })
      );
    },
    [appTypes, countryIdValue, dispatch, refreshHFUserList]
  );

  /**
   * Handler to open user edit modal
   * @param value
   */
  const openEditModal = (value: any) => {
    if ((value.roles || []).some((userRole: IUserRole) => villageBasedRoles.includes(userRole.name))) {
      dispatch(
        fetchUserDetailRequest({
          id: Number(value?.id),
          successCb: (user: any) => {
            const postData = { ...user };
            userForEdit.current = { users: [{ ...postData }] };
            setIsOpenUserModal({ isOpen: true, isEdit: true });
          },
          failureCb: (e) => {
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.USER_DETAIL_FETCH_FAIL));
          }
        })
      );
    } else {
      const postData = { ...value };
      userForEdit.current = { users: [{ ...postData }] };
      setIsOpenUserModal({ isOpen: true, isEdit: true });
    }
  };

  /**
   * Handler for add user button click
   */
  const handleAddUserClick = () => {
    userForEdit.current = { users: [] as IHFUserGet[] };
    setIsOpenUserModal({ isOpen: true, isEdit: false });
  };

  /**
   * Handler for modal cancel
   */
  const handleCancelClick = () => {
    setIsOpenUserModal({ isOpen: false, isEdit: true });
    setIsOpenCHWUserModal({ isOpen: false, isEdit: false, isActivating: false });
    userForEdit.current = { users: [] as IHFUserGet[] };
    fetchList(); // get list of HF for filter dropdown, while closing the modal
  };

  /**
   * Handler function for success callback for add user and edit user
   */
  const siteUserSuccess = useCallback(() => {
    const successMessage = isOpenUserModal.isEdit
      ? APPCONSTANTS.USER_DETAILS_UPDATE_SUCCESS
      : APPCONSTANTS.USER_DETAILS_CREATE_SUCCESS;

    if (!openConfirmationModal.userData.id) {
      toastCenter.success(APPCONSTANTS.SUCCESS, successMessage);
    }
    refreshHFUserList();
    setIsOpenUserModal({ isOpen: false, isEdit: isOpenUserModal.isEdit });
    setOpenConfirmationModal({ isOpen: false, isActivating: false, userData: {} });
    setIsOpenPeerSupervisorModal({ isOpen: false, isEdit: false });
    setIsOpenCHWListModal({ isOpen: false });
    handlePeerSupervisorModalCancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenUserModal.isEdit, refreshHFUserList, isOpenPeerSupervisorModal.isEdit]);

  /**
   * Handler function for success callback for add user and edit user
   */
  const siteActivateUserSuccess = useCallback(() => {
    const successMessage = 'User Reassigned Successfully';

    if (!openConfirmationModal.userData.id) {
      toastCenter.success(APPCONSTANTS.SUCCESS, successMessage);
    }
    refreshHFUserList();
    setIsOpenUserModal({ isOpen: false, isEdit: isOpenUserModal.isEdit });
    setOpenConfirmationModal({ isOpen: false, isActivating: false, userData: {} });
    setIsOpenPeerSupervisorModal({ isOpen: false, isEdit: false });
    setIsOpenCHWListModal({ isOpen: false });
    handlePeerSupervisorModalCancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenUserModal.isEdit, refreshHFUserList, isOpenPeerSupervisorModal.isEdit]);

  /**
   * Common submit handler for user add and edit
   * @param {IHFUserPost} data - API Payload data
   * @param {any} actionFn - redux action function
   * @param {any} successCB - callback for api success
   * @param {any} failureCB - callback for api failure
   */
  const onSubmitHandler = useCallback(
    (data: IHFUserPost, actionFn: any, successCB: (data: any) => void, failureCB: (error: any) => void) => {
      dispatch(actionFn({ data, successCb: successCB, failureCb: failureCB }));
    },
    [dispatch]
  );

  const peerSupervisorList = useSelector(peerSupervisorListSelector);

  const fetchSupervisorList = useCallback(
    (tenantIds: number[], index: number) => {
      const uniqueTenantIds = tenantIds.reduce(
        (unique: number[], id) => (unique.includes(id) ? unique : [...unique, id]),
        []
      );
      dispatch(
        fetchPeerSupervisorListRequest({
          tenantIds: uniqueTenantIds,
          appTypes: appTypes || [''],
          successCb: ({ list }: { list: IPeerSupervisor[] }) => {
            setPeerSupervisors(list);
          }
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appTypes, dispatch, peerSupervisors]
  );

  const handleSync = (user: any) => {
    const payload = {
      data: {
        userId: user.id
      },
      successCb: (syncData: { lastSyncDate: string }) => {
        handleActivateClick(user, [], syncData?.lastSyncDate);
      },
      failureCb: (error: Error) => {
        toastCenter.error(...getErrorToastArgs(error, APPCONSTANTS.ERROR, 'Failed to sync data'));
      }
    };

    dispatch(offlineSyncRequest(payload as any));
  };

  /**
   * Handler for edit user form submit.
   */
  const handleEditSubmit = useCallback(
    ({ users }: { users: IHFUserGet[] }) => {
      const userObj = getUserPayload({
        userFormData: users,
        countryId: countryIdValue,
        tenantId: tenantId && healthFacilityId ? tenantId : undefined,
        spiceRolesGroup: rolesGrouped?.SPICE,
        appTypes
      });

      const data: IHFUserPost = userObj[0];

      // If we're assigning a peer supervisor
      if (openConfirmationModal.userData.id && openConfirmationModal.roleId) {
        const payload: any = {
          ...data,
          deactivateUserId: openConfirmationModal.userData.id,
          roleIds: [getPeerSupervisorRoleId(openConfirmationModal.userData) || 0],
          tenantId: openConfirmationModal.userData.tenantId
        };
        onSubmitHandler(payload, reassignCHWRequest, siteActivateUserSuccess, (e) => {
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.HEALTH_FACILITY_USER_UPDATE_ERROR));
        });
      } else {
        // Regular user update/create
        onSubmitHandler(
          { ...data },
          isOpenUserModal.isEdit || data.id ? updateHFUserRequest : createHFUserRequest,
          siteUserSuccess,
          (e) => {
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                isOpenUserModal.isEdit || data.id
                  ? APPCONSTANTS.HEALTH_FACILITY_USER_UPDATE_ERROR
                  : APPCONSTANTS.HEALTH_FACILITY_USER_CREATE_ERROR
              )
            );
          }
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      countryIdValue,
      tenantId,
      healthFacilityId,
      rolesGrouped?.SPICE,
      appTypes,
      openConfirmationModal.userData,
      openConfirmationModal.roleId,
      onSubmitHandler,
      isOpenUserModal.isEdit,
      siteUserSuccess
    ]
  );

  /**
   * Renders the UserForm inside an edit modal
   * @param {any} form - The form API instance used to manage the form's state and submissions.
   */
  const userFormRenderer = (form?: FormApi<any>) => {
    /*
     * Find if the user is report super admin to
     * disable reports role to prevent further edit
     * This is temporary solution, until reports and insights have dedicated screen
     */
    const isReportSuperAdmin = userForEdit.current.users[0]?.roles.some(
      (r: { name: string; suiteAccessName: string }) =>
        r.name === APPCONSTANTS.ALL_ROLES.REPORT_SUPER_ADMIN && r.suiteAccessName === APPCONSTANTS.SUITE_ACCESS.CFR
    );
    return (
      <UserForm
        form={form as FormApi<any>}
        initialEditValue={userForEdit.current.users[0] ?? openConfirmationModal.userData}
        disableOptions={true}
        isEdit={isOpenUserModal.isEdit || isOpenCHWUserModal.isEdit}
        countryId={countryIdValue}
        enableAutoPopulate={true}
        hfTenantId={Number(tenantId)}
        isSiteUser={true}
        appTypes={appTypes}
        userFormParams={{
          isReportSuperAdmin
        }}
        isActivating={openConfirmationModal.isActivating || isOpenCHWUserModal.isActivating}
      />
    );
  };

  const CHWListFormRenderer = () => {
    const filteredPeerSupervisorList =
      peerSupervisorList.list?.filter((supervisor) => supervisor.id !== openConfirmationModal.userData.id) || [];
    return (
      <CustomTable
        columnsDef={chwColumnDef}
        rowData={chwList}
        isEdit={false}
        isDelete={false}
        isAssignSupervisor={true}
        peerSupervisorList={filteredPeerSupervisorList || []}
      />
    );
  };
  // State management for change password
  const [openModal, setOpenModal] = useState({ isOpen: false, userData: {} as IHFUserGet });
  const [submitEnabled, setSubmitEnabled] = useState(false);

  /**
   * Handler function for close modal
   */
  const onModalCancel = () => {
    setOpenModal({ isOpen: false, userData: {} as IHFUserGet });
    setSelectedOption('');
    setSubmitEnabled(false);
  };

  /**
   * Handler function for change password button click
   * @param {IHFUserGet} userData - user data values
   */
  const handleChangePassword = (userData: IHFUserGet) => {
    setOpenModal({ isOpen: true, userData });
  };

  /**
   * Password change form UI Component
   */
  const userPasswordChangeUI = () => {
    return (
      <>
        {showPasswordPreference && (
          <div className='col-12'>
            <Field
              name='userPreference.passwordChange'
              render={(props) => (
                <Radio
                  {...props}
                  isRadioSquare={true}
                  fieldLabel='Select Action'
                  errorLabel='option'
                  options={APPCONSTANTS.PASSWORD_OPTIONS}
                  onChange={(value: string) => {
                    props.input.onChange(value);
                    setSelectedOption(value);
                    if (value === SEND_EMAIL) {
                      setSubmitEnabled(true);
                    }
                  }}
                />
              )}
            />
          </div>
        )}
        <div
          className={`password-fields-wrapper ${
            selectedOption === CHANGE_PASSWORD || !showPasswordPreference ? 'show' : ''
          }`}
        >
          <ResetPasswordFields
            email={openModal.userData.username}
            setSubmitEnabled={setSubmitEnabled}
            adminPasswordChange={false}
          />
        </div>
        <div className={`email-message ${selectedOption === SEND_EMAIL ? 'show' : ''}`}>
          A password reset link will be sent to this email:{' '}
          <span className='email-address'>{openModal.userData.username}</span>
        </div>
      </>
    );
  };

  /**
   * Handles the submission of password reset/change form
   * This function manages two scenarios:
   * 1. Change Password: Directly changes the user's password
   * 2. Send Email: Sends a password reset link to user's email
   *
   * @param {Object} formValues - The values from the form submission
   * @param {Object} formValues.userPreference - User preferences object
   * @param {string} formValues.userPreference.passwordChange - Selected option ('Change Password' or 'Send Email')
   * @param {string} [formValues.newPassword] - New password (required only for Change Password option)
   *
   */
  const handleResetPasswordSubmit = (formValues: {
    userPreference: { passwordChange: string };
    newPassword?: string;
  }) => {
    setChangePasswordLoading(true);

    if (formValues?.userPreference?.passwordChange === CHANGE_PASSWORD || !showPasswordPreference) {
      if (!formValues.newPassword) {
        setChangePasswordLoading(false);
        return;
      }
      const password = generatePassword(formValues.newPassword);
      dispatch(
        changePassword({
          userId: Number(openModal.userData?.id),
          password,
          successCB: () => {
            setChangePasswordLoading(false);
            toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.PASSWORD_CHANGE_SUCCESS);
            onModalCancel();
          },
          failureCb: (e) => {
            setChangePasswordLoading(false);
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.PASSWORD_CHANGE_FAILED));
          }
        })
      );
    } else if (formValues?.userPreference?.passwordChange === SEND_EMAIL) {
      dispatch(
        forgotPasswordRequest({
          email: openModal.userData.username,
          successCB: () => {
            setChangePasswordLoading(false);
            onModalCancel();
          }
        })
      );
    }
  };

  /**
   * Function to fetch list
   */
  const fetchList = useCallback(() => {
    if (showFilters) {
      dispatch(
        fetchHFListRequest({
          countryId: countryIdValue,
          skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
          limit: null,
          userBased: !isSuperUser,
          tenantIds: [tenantId],
          failureCb: (e: Error) => {
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.ERROR,
                formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_LIST_FETCH_ERROR, healthFacilityPname)
              )
            );
          }
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isSuperUser, countryIdValue, showFilters]);

  /**
   * useEffect to invoke fetchlist function when component mounts
   */
  useEffect(() => {
    fetchList();
    return () => {
      dispatch(clearHFList());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Icon Handler for edit, password reset and delete
   * Don't show icons if user has admin roles in it
   * Don't show icon for logged in user
   */
  const handleIconHandler = ({ username, active }: { username: string; active: boolean }) =>
    username === email || (isCommunity && !active);

  /**
   * Calls Hook to get SPICE, REPORTS and INSIGHTS user roles based on certain conditions for filter dropdown
   */
  const { getRoleOptions } = useRoleOptions({
    isHF: false,
    isHFCreate: false,
    isEdit: false,
    isSiteUser: true,
    forFilter: true,
    appTypes,
    allRoles: rolesGrouped,
    currentModule,
    roleOptionsFn: ({ spiceRoleOptions, reportRoleOptions: newReportRoles, insightRoleOptions }) => {
      const allNewRoles = [...spiceRoleOptions, ...newReportRoles, ...insightRoleOptions].sort((a: any, b: any) =>
        a.displayName > b.displayName ? 1 : -1
      );
      setAllRoles(allNewRoles);
    }
  });

  useEffect(() => {
    if (!allRoles.length) {
      getRoleOptions();
    }
  }, [getRoleOptions, allRoles]);

  const getParentOrganizationId = (user: { tenantId: number; organizations: any[] }): number => {
    const matchedOrganization = user.organizations.find((org: any) => org.id === user.tenantId);
    return matchedOrganization?.parentOrganizationId;
  };

  const PEER_SUPERVISOR_ROLE_NAME = 'PEER_SUPERVISOR';

  const getPeerSupervisorRoleId = (userData: any): number | undefined => {
    const peerSupervisorRole = userData.roles?.find(
      (userDataRole: { name: string }) => userDataRole.name === PEER_SUPERVISOR_ROLE_NAME
    );
    return peerSupervisorRole?.id;
  };

  const getCHWList = useCallback(
    (userData: any) => {
      dispatch(
        fetchCHWListRequest({
          limit: 10,
          skip: 0,
          userId: userData.id,
          successCb: (CHWData: any) => {
            handleActivateClick(userData, CHWData.entityList, null);
          }
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );

  const handleActivateToggle = (data: any) => {
    const isCHW = data?.roles?.some((ischwRole: { name: string }) => ischwRole.name === 'CHW');
    const isPeerSupervisor = getPeerSupervisorRoleId(data);
    const isDeactivatingPeerSupervisor = data.active && isPeerSupervisor;
    const isChwActivate = isCHW && !data.active;
    if (isCHW && data.active) {
      handleSync(data);
    } else if (isChwActivate || isDeactivatingPeerSupervisor) {
      getCHWList(data);
    } else {
      handleActivateClick(data, [], null);
    }
  };

  const activeCHWList = (data: any) => {
    dispatch(
      updateUserStatus({
        ...data.users[0],
        id: data.users[0].id,
        tenantId: data.users[0].tenantId,
        isActive: true,
        countryId: countryIdValue,
        villageIds: data?.users[0]?.villages?.map((village: any) => village.id),
        peerSupervisorId: data?.users[0]?.supervisor?.id,
        appTypes,
        successCb: () => {
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.USER_ACTIVATED);
          setOpenConfirmationModal({ isOpen: false, isActivating: false, userData: {} });
          handleCancelClick();
          refreshHFUserList();
        },
        failureCb: (e) => {
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.USER_STATUS_UPDATE_FAILED));
        }
      })
    );
  };
  /**
   * Handles user activation/deactivation with special handling for Peer Supervisors
   *
   * @param {Object} data - User data with activation status and role information
   * @param {number} data.id - User ID
   * @param {boolean} data.isActive - Current activation status (true for active)
   * @param {number} data.tenantId - Tenant ID
   * @param {Array<{name: string}>} data.roles - Array of user roles
   *
   * Special behavior:
   * - For Peer Supervisors being deactivated: Shows reassignment warning
   * - For regular users: Shows standard activation/deactivation confirmation
   */
  const handleActivateClick = useCallback(
    (
      data: {
        id: number;
        active: boolean;
        tenantId: number;
        roles: [{ name: string; id: number }];
        organizations: any[];
      },
      CHWData: any,
      lastSyncDate: string | null
    ) => {
      const isCHW = data.roles.some((ischwRole: { name: string }) => ischwRole.name === 'CHW');
      const isChwActivate = isCHW && !data.active;
      const peerSupervisorRoleId = getPeerSupervisorRoleId(data);
      const isPeerSupervisor = Boolean(peerSupervisorRoleId); // will be true if role ID is found

      const isDeactivatingPeerSupervisor = data.active && isPeerSupervisor && CHWData.length;
      const MESSAGES = {
        PEER_SUPERVISOR_DEACTIVATION: APPCONSTANTS.PEER_SUPERVISOR_DEACTIVATION,
        STANDARD_CONFIRMATION: (willActivate: boolean) =>
          `Are you sure you want to ${willActivate ? 'deactivate' : 'activate'} this user?`,
        OFFLINE_SYNC_MESSAGE: `Are you sure you want to deactivate this user?`
      };

      const BUTTON_TEXT = {
        PEER_SUPERVISOR: {
          cancel: '',
          submit: 'Reassign',
          customButtonLabel: 'Add Peer Supervisor',
          handleCustomButton: () => {
            setIsOpenPeerSupervisorModal({ isOpen: true, isEdit: false });
          }
        },
        STANDARD: {
          cancel: 'Cancel',
          submit: 'Yes'
        }
      };
      const deactivationMessage =
        isCHW && data.active
          ? MESSAGES.OFFLINE_SYNC_MESSAGE
          : isDeactivatingPeerSupervisor
          ? MESSAGES.PEER_SUPERVISOR_DEACTIVATION
          : MESSAGES.STANDARD_CONFIRMATION(data.active);

      const { cancel: cancelText, submit: submitText } = isDeactivatingPeerSupervisor
        ? BUTTON_TEXT.PEER_SUPERVISOR
        : BUTTON_TEXT.STANDARD;
      setOpenConfirmationModal({
        isOpen: true,
        isActivating: !data.active,
        userData: data,
        roleId: getPeerSupervisorRoleId(data),
        title: `${data.active ? 'Deactivate' : 'Activate'} User`,
        cancelText,
        submitText,
        customButtonLabel: isDeactivatingPeerSupervisor ? BUTTON_TEXT.PEER_SUPERVISOR.customButtonLabel : '',
        handleCustomButton: BUTTON_TEXT.PEER_SUPERVISOR.handleCustomButton,
        message: deactivationMessage,
        WarningMessage: isCHW && data.active ? deactivationMessage : '',
        syncDate: lastSyncDate,
        onConfirm: () => {
          if (isDeactivatingPeerSupervisor) {
            handleReassignClick(data);
            if (!peerSupervisorList.list.length) {
              const parentOrganizationId: number = getParentOrganizationId(data);
              fetchSupervisorList([parentOrganizationId], 0);
            }
            // setOpenConfirmationModal({ isOpen: false, userData: data });
          } else if (isChwActivate) {
            setOpenConfirmationModal({ isOpen: false, isActivating: false, userData: data });
            setIsOpenCHWUserModal({ isOpen: true, isEdit: true, isActivating: true });
          } else {
            dispatch(
              updateUserStatus({
                id: data.id,
                isActive: !data.active,
                tenantId: data.tenantId,
                countryId: countryIdValue,
                appTypes,
                successCb: () => {
                  toastCenter.success(
                    APPCONSTANTS.SUCCESS,
                    !data.active ? APPCONSTANTS.USER_ACTIVATED : APPCONSTANTS.USER_DEACTIVATED
                  );
                  userForEdit.current = { users: [] };
                  setOpenConfirmationModal({ isOpen: false, isActivating: false, userData: {} });
                  refreshHFUserList();
                },
                failureCb: (e) => {
                  toastCenter.error(
                    ...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.USER_STATUS_UPDATE_FAILED)
                  );
                }
              })
            );
          }
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, refreshHFUserList, getCHWList]
  );

  // Add handler for peer supervisor modal cancel
  const handlePeerSupervisorModalCancel = () => {
    setIsOpenPeerSupervisorModal({ isOpen: false, isEdit: false });
  };

  // Add peer supervisor form renderer
  const peerSupervisorFormRenderer = (form?: FormApi<any>) => {
    return (
      <UserForm
        form={form as FormApi<any>}
        initialEditValue={openConfirmationModal.userData}
        disableOptions={true}
        defaultSelectedRole={APPCONSTANTS.ROLES.PEER_SUPERVISOR}
        isEdit={isOpenPeerSupervisorModal.isEdit}
        countryId={countryIdValue}
        enableAutoPopulate={true}
        hfTenantId={Number(tenantId)}
        isSiteUser={true}
        appTypes={appTypes}
        isPeerSupervisor={true} // Add this prop to UserForm to handle peer supervisor specific fields
      />
    );
  };

  // Handler for reassign button click
  const handleReassignClick = (userData: any) => {
    setIsOpenCHWListModal({
      isOpen: true,
      userData
    });
  };

  // Handler for CHW list modal cancel
  const handleCHWListModalCancel = () => {
    setIsOpenCHWListModal({
      isOpen: false
    });
  };

  const handleReassignSubmit = (formData: any) => {
    /**
     * Transforms form data into the required API payload format
     * @param formData - Object containing peer supervisor assignments
     * @returns Formatted payload for the API
     */
    const constructReassignPayload = () => {
      // Extract assignments from form data
      const reassignUserList = Object.keys(formData)
        .filter((key) => key.startsWith('peersupervisor-'))
        .map((key) => {
          const chwId = key.split('peersupervisor-')[1]; // Extract CHW ID from field name
          const peerSupervisor = formData[key]; // Get selected peer supervisor data

          return {
            chwId: Number(chwId),
            peerSupervisorId: peerSupervisor.id
          };
        });

      return {
        reassignUserList,
        deactivateUserId: openConfirmationModal.userData.id
      };
    };
    // Construct and validate payload
    const payload = constructReassignPayload();
    // Validate if we have any assignments
    if (!payload.reassignUserList.length || chwList.length !== payload.reassignUserList.length) {
      toastCenter.error(APPCONSTANTS.ERROR, 'Please select peer supervisors for All CHWs');
      return;
    }
    // Dispatch reassign action
    dispatch(
      reassignCHWRequest(
        payload,
        () => {
          toastCenter.success(APPCONSTANTS.SUCCESS, 'CHWs Reassigned successfully');
          setOpenConfirmationModal({ isOpen: false, isActivating: false, userData: {} });
          setIsOpenCHWListModal({ isOpen: false });
          handlePeerSupervisorModalCancel();
          setIsOpenPeerSupervisorModal({ isOpen: false, isEdit: false });
          refreshHFUserList();
        },
        (error) => {
          toastCenter.error(...getErrorToastArgs(error, APPCONSTANTS.ERROR, 'Failed to reassign CHWs'));
        }
      )
    );
  };

  return (
    <>
      {(hfUserDetailLoading ||
        loading ||
        changePasswordLoading ||
        healthFacilityUserListLoading ||
        peerSupervisorLoading) && <Loader />}
      <div className='col-12'>
        <DetailCard
          buttonLabel='Add User'
          header='Users'
          isSearch={true}
          onSearch={handleSearch}
          searchPlaceholder={APPCONSTANTS.SEARCH_BY_NAME_EMAIL_PHONE}
          onButtonClick={handleAddUserClick}
          setSelectedRole={(filterRole: any) => {
            setSelectedRole(filterRole);
            handlePage(1);
          }}
          setSelectedFacility={(filterHf: any) => {
            setSelectedFacility(filterHf);
            handlePage(1);
          }}
          isFilter={showFilters}
          onFilterData={[
            {
              id: 1,
              name: `Filter by ${isCommunity ? 'Facility' : healthFacilitySname}`,
              placeholder: `Search ${isCommunity ? 'Facility' : healthFacilitySname}`,
              isFacility: true,
              isSearchable: true,
              data: filterHFByAppTypes(appTypes, healthFacilityList)?.sort((a: any, b: any) =>
                a.name.localeCompare(b.name)
              ),
              isShow: role !== HEALTH_FACILITY_ADMIN,
              filterCount: selectedFacility?.length
            },
            {
              id: 2,
              name: 'Filter by Role',
              isFacility: false,
              isSearchable: false,
              data: [...(allRoles || [])],
              isShow: true,
              filterCount: selectedRole?.length
            }
          ]}
        >
          <CustomTable
            rowData={hfUserList}
            columnsDef={columnDef({ healthFacilityModuleName: healthFacilitySname, isCommunity }).filter(
              (column) => !column.isHideColumn
            )}
            isDelete={true}
            isEdit={true}
            onRowEdit={openEditModal}
            onDeleteClick={handleUserDelete}
            page={listParams.page}
            rowsPerPage={listParams.rowsPerPage}
            handlePageChange={handlePage}
            count={hfUserCount}
            confirmationTitle={APPCONSTANTS.USER_DELETE_CONFIRMATION}
            deleteTitle={APPCONSTANTS.USER_DELETE_TITLE}
            onCustomConfirmed={handleChangePassword}
            CustomIcon={PasswordChangeIcon}
            customTitle='Change Password'
            isCustom={true}
            customIconStyle={{ width: 18 }}
            isActiveToggle={showActiveToggle} // show activate/deactivate toggle only for community
            actionFormatter={{
              hideEditIcon: (rowData: any) => handleIconHandler(rowData),
              hideDeleteIcon: (rowData: any) => handleIconHandler(rowData),
              hideCustomIcon: (rowData: any) => handleIconHandler(rowData),
              hideActiveToggle: (rowData: any) => rowData.username === email
            }}
            // onActivateClick={(rowData: any) => getCHWList(rowData)}
            onActivateClick={(rowData: any) => handleActivateToggle(rowData)}
            handleCustomIconClicked={handleReassignSubmit}
          />
        </DetailCard>
        <ModalForm
          show={isOpenUserModal.isOpen}
          title={`${isOpenUserModal.isEdit ? 'Edit' : 'Add'} User`}
          cancelText='Cancel'
          submitText='Submit'
          handleCancel={handleCancelClick}
          handleFormSubmit={handleEditSubmit}
          initialValues={{ users: userForEdit.current }}
          render={userFormRenderer}
          mutators={{ ...arrayMutators }}
        />
        <ModalForm
          show={isOpenCHWUserModal.isOpen}
          title={`CHW Activate`}
          cancelText='Cancel'
          submitText='Submit'
          handleCancel={handleCancelClick}
          handleFormSubmit={activeCHWList}
          render={userFormRenderer}
          mutators={{ ...arrayMutators }}
        />
        <ModalForm
          show={openModal.isOpen}
          title={CHANGE_PASSWORD}
          cancelText={'Cancel'}
          submitText={selectedOption === SEND_EMAIL ? SEND_EMAIL : 'Submit'}
          handleCancel={onModalCancel}
          handleFormSubmit={handleResetPasswordSubmit}
          size={'modal-md'}
          submitDisabled={selectedOption === CHANGE_PASSWORD && !submitEnabled}
          handleForceSubmit={selectedOption === SEND_EMAIL}
        >
          {userPasswordChangeUI()}
        </ModalForm>
        <ConfirmationModalPopup
          isOpen={openConfirmationModal.isOpen}
          WarningMessage={openConfirmationModal?.WarningMessage || ''}
          syncDate={openConfirmationModal?.syncDate || ''}
          popupTitle={openConfirmationModal.title || ''}
          cancelText={openConfirmationModal.cancelText || ''}
          submitText={openConfirmationModal.submitText || ''}
          handleCancel={() => {
            setOpenConfirmationModal({ isOpen: false, isActivating: false, userData: {} });
            dispatch(clearSupervisorList());
          }}
          handleSubmit={() => {
            openConfirmationModal.onConfirm?.();
          }}
          customButtonLabel={openConfirmationModal.customButtonLabel || ''}
          handleCustomButton={
            openConfirmationModal.handleCustomButton ||
            (() => {
              //
            })
          }
          popupSize='modal-md'
          confirmationMessage={openConfirmationModal.message || ''}
        />
        <ModalForm
          show={isOpenPeerSupervisorModal.isOpen}
          title={`${isOpenPeerSupervisorModal.isEdit ? 'Edit' : 'Add'} Peer Supervisor`}
          cancelText='Cancel'
          submitText='Submit'
          handleCancel={handlePeerSupervisorModalCancel}
          handleFormSubmit={handleEditSubmit}
          initialValues={openConfirmationModal.userData.organizations}
          render={peerSupervisorFormRenderer}
          mutators={{ ...arrayMutators }}
        />
        <ModalForm
          show={isOpenCHWListModal.isOpen}
          title='CHW List'
          cancelText='Cancel'
          submitText='Submit'
          handleCancel={handleCHWListModalCancel}
          handleFormSubmit={handleReassignSubmit}
          initialValues={{}}
          render={CHWListFormRenderer}
          mutators={{ ...arrayMutators }}
        />
      </div>
    </>
  );
};

export default UserList;
