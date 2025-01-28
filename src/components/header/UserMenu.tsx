import { NavLink, useLocation } from 'react-router-dom';
import APPCONSTANTS, { APP_TYPE } from '../../constants/appConstants';
import styles from './Header.module.scss';
import IconProfile from '../../assets/images/icon-profile.svg';
import IconGlobal from '../../assets/images/icon-global.svg';
import IconDeactivated from '../../assets/images/icon-deactivated.svg';
import LockedUserIcon from '../../assets/images/user-lock.svg';
import IconLegal from '../../assets/images/icon-legal.svg';
import { PROTECTED_ROUTES } from '../../constants/route';
import PasswordChangeIcon from '../../assets/images/reset-password.svg';
import ResetPasswordFields, { generatePassword } from '../../containers/authentication/ResetPasswordFields';
import { useDispatch, useSelector } from 'react-redux';
import { changeOwnPassword } from '../../store/user/actions';
import {
  emailSelector,
  formDataIdSelector,
  tenantIdSelector,
  getUserSuiteAccessSelector,
  userIdSelector
} from '../../store/user/selectors';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import ModalForm from '../modal/ModalForm';
import { useState } from 'react';
import { CHIEFDOM_ADMIN, DISTRICT_ADMIN, REGION_ADMIN, SU_SA_RA, SU_SA_RA_DA, SU_SA_RA_DA_CDA_HFA } from '../../routes';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';

/**
 * Interface for user menu item
 */
interface IUserMenuItem {
  /** Label for the menu item */
  label: string;
  /** Icon for the menu item */
  icon: string;
  /** Route for the menu item */
  route: string;
  /** Roles that can access this menu item */
  roles: string[];
}

const { ROLES, SUITE_ACCESS } = APPCONSTANTS;

/**
 * UserMenu component
 * Renders the user menu with various options based on user role and permissions
 * @param {Object} props - Component props
 * @param {string} props.role - User's role
 * @returns {React.ReactElement} The rendered UserMenu component
 */
const UserMenu = ({ role }: { role: string }): React.ReactElement => {
  const dispatch = useDispatch();
  const location = useLocation();
  const email = useSelector(emailSelector);
  const userId = useSelector(userIdSelector);
  const userSuiteAccess = useSelector(getUserSuiteAccessSelector);
  const formDataId = useSelector(formDataIdSelector);
  const tenantId = useSelector(tenantIdSelector);
  const [passwordModal, setPasswordModal] = useState(false);
  const [submitEnable, setSubmitEnabled] = useState(false);

  const {
    appTypes,
    region: { s: regionSName },
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName }
  } = useAppTypeConfigs();

  const nonCommunityUserMenus = [
    {
      label: `${districtSName} Details`,
      icon: IconGlobal,
      route: PROTECTED_ROUTES.districtSummary.replace(':districtId', formDataId).replace(':tenantId', tenantId),
      roles: [DISTRICT_ADMIN]
    },
    {
      label: `${chiefdomSName} Details`,
      icon: IconGlobal,
      route: PROTECTED_ROUTES.chiefdomSummary.replace(':chiefdomId', formDataId).replace(':tenantId', tenantId),
      roles: [CHIEFDOM_ADMIN]
    },
    {
      label: `${regionSName} Details`,
      icon: IconGlobal,
      route: PROTECTED_ROUTES.region.replace(':regionId', formDataId).replace(':tenantId', tenantId),
      roles: [REGION_ADMIN]
    },
    {
      label: 'Deactivated Records',
      icon: IconDeactivated,
      route: PROTECTED_ROUTES.deactivatedRecords,
      roles: SU_SA_RA
    },
    {
      label: 'Locked Users',
      icon: LockedUserIcon,
      route: PROTECTED_ROUTES.lockedUsers,
      roles: SU_SA_RA_DA_CDA_HFA
    },
    {
      label: 'Legal Terms',
      icon: IconLegal,
      route: PROTECTED_ROUTES.legalTerms,
      roles: SU_SA_RA_DA
    }
  ];
  const commonUsermenus = [
    {
      label: 'My Profile',
      icon: IconProfile,
      route: PROTECTED_ROUTES.profile,
      roles: Object.values(ROLES)
    },
    {
      label: 'Change Password',
      icon: PasswordChangeIcon,
      route: location.pathname,
      roles: Object.values(ROLES)
    }
  ];

  /**
   * Generates the menu items based on user's suite access
   * @type {IUserMenuItem[]}
   */
  const menus: IUserMenuItem[] = userSuiteAccess.includes(SUITE_ACCESS.ADMIN)
    ? (Array.isArray(appTypes) && appTypes.length === 1 && appTypes[0] === APP_TYPE.COMMUNITY) || !appTypes.length
      ? [...commonUsermenus]
      : [...nonCommunityUserMenus, ...commonUsermenus]
    : [];

  /**
   * Filters the menu items based on user's role
   * @type {IUserMenuItem[]}
   */
  const permittedMenus = menus.filter(({ roles }) => roles?.includes(role));

  /**
   * Handles click on menu items
   * @param {Object} modalcheck - The clicked menu item
   * @param {Event} event - The click event
   */
  const handleClick = (modalcheck: { label: string; route?: string }, event: React.MouseEvent) => {
    if (modalcheck.label === 'Change Password') {
      setPasswordModal(true);
    } else {
      setPasswordModal(false);
    }
    event.preventDefault();
  };

  /**
   * Handles modal cancellation
   */
  const onModalCancel = () => {
    setPasswordModal(false);
  };

  /**
   * Handles form submission for password change
   * @param {Object} data - Form data
   * @param {string} data.oldPassword - Old password
   * @param {string} data.newPassword - New password
   */
  const handleFormSubmit = (data: { oldPassword: string; newPassword: string }) => {
    const oldPassword = generatePassword(data.oldPassword);
    const newPassword = generatePassword(data.newPassword);
    dispatch(
      changeOwnPassword({
        userId: Number(userId),
        oldPassword,
        newPassword,
        successCB: () => {
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.PASSWORD_CHANGE_SUCCESS);
          onModalCancel();
        },
        failureCB: (e) => {
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.PASSWORD_CHANGE_FAILED));
        }
      })
    );
  };

  return (
    <>
      {permittedMenus.map(({ label, icon, route }: IUserMenuItem, key) => (
        <NavLink
          to={route}
          key={`label_${key}`}
          activeClassName={label === 'Change Password' ? '' : 'no-pointer-events'}
          exact={true}
          onClick={(event) => label === 'Change Password' && handleClick({ label, route }, event)}
        >
          <div
            className={`dropdown-item px-0dot875 py-0dot75 pointer \
              d-flex align-items-center ${styles.navbarDropdownItem}`}
          >
            <div className={`${styles.iconWrapper} me-0dot75 d-flex align-items-center justify-content-center`}>
              <img src={icon} alt={label} width={16} height={16} />
            </div>
            {label}
          </div>
        </NavLink>
      ))}
      <ModalForm
        show={passwordModal}
        title={'Change Password'}
        cancelText={'Cancel'}
        submitText={'Submit'}
        handleCancel={onModalCancel}
        handleFormSubmit={handleFormSubmit}
        size={'modal-md'}
        submitDisabled={!submitEnable}
      >
        <ResetPasswordFields email={email} setSubmitEnabled={setSubmitEnabled} adminPasswordChange={true} />
      </ModalForm>
    </>
  );
};

export default UserMenu;
