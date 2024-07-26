import { NavLink, useLocation } from 'react-router-dom';
import APPCONSTANTS from '../../constants/appConstants';
import styles from './Header.module.scss';
import IconProfile from '../../assets/images/icon-profile.svg';
import IconDeactivated from '../../assets/images/icon-deactivated.svg';
import LockedUserIcon from '../../assets/images/user-lock.svg';
import IconLegal from '../../assets/images/icon-legal.svg';
import IconDeactivated from '../../assets/images/icon-deactivated.svg';
import LockedUserIcon from '../../assets/images/user-lock.svg';
import IconLegal from '../../assets/images/icon-legal.svg';
import { PROTECTED_ROUTES } from '../../constants/route';
import PasswordChangeIcon from '../../assets/images/reset-password.svg';
import ResetPasswordFields, { generatePassword } from '../../containers/authentication/ResetPasswordFields';
import { useDispatch, useSelector } from 'react-redux';
import { changeOwnPassword } from '../../store/user/actions';
import { emailSelector, getUserSuiteAccessSelector, userIdSelector } from '../../store/user/selectors';
import { emailSelector, getUserSuiteAccessSelector, userIdSelector } from '../../store/user/selectors';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import ModalForm from '../modal/ModalForm';
import { useState } from 'react';
import { SU_SA_RA, SU_SA_RA_AA, SU_SA_RA_AA_OUA_SIA } from '../../routes';

interface IUserMenuItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
}

const { ROLES, SUITE_ACCESS } = APPCONSTANTS;

const UserMenu = ({ role }: any) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const email = useSelector(emailSelector);
  const userId = useSelector(userIdSelector);
  const userSuiteAccess = useSelector(getUserSuiteAccessSelector);
  const [passwordModal, setPasswordModal] = useState(false);
  const [submitEnable, setSubmitEnabled] = useState(false);
  const menus = userSuiteAccess.includes(SUITE_ACCESS.ADMIN)
    ? [
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
          roles: SU_SA_RA_AA_OUA_SIA
        },
        {
          label: 'Legal Terms',
          icon: IconLegal,
          route: PROTECTED_ROUTES.legalTerms,
          roles: SU_SA_RA_AA
        },
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
      ]
    : [];

  const permittedMenus = menus.filter(({ roles }) => roles?.includes(role));
  const handleClick = (modalcheck: any, event: any) => {
    if (modalcheck.label === 'Change Password') {
      setPasswordModal(true);
    } else {
      setPasswordModal(false);
    }
    event.preventDefault();
  };

  const onModalCancel = () => {
    setPasswordModal(false);
  };

  const handleFormSubmit = (data: any) => {
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
        failureCb: (e) => {
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
