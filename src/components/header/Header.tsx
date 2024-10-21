import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as NavBarLogo } from '../../assets/images/nav-bar-logo.svg';
import LogoutIcon from '../../assets/images/power-switch.svg';
import CaretDownIcon from '../../assets/images/caret-down-grey.svg';
import UserMenu from './UserMenu';
import styles from './Header.module.scss';
import { logoutRequest } from '../../store/user/actions';
import { firstNameSelector, lastNameSelector, roleDetailSelector, roleSelector } from '../../store/user/selectors';
import { ROLE_LABELS } from '../../constants/appConstants';

/**
 * Header component
 * Renders the application header with user information and navigation menu
 * @returns {React.ReactElement} The rendered Header component
 */
export default function Header(): React.ReactElement {
  const dispatch = useDispatch();

  /**
   * User's first name
   * @type {string}
   */
  const firstName: string = useSelector(firstNameSelector) || '';

  /**
   * User's last name
   * @type {string}
   */
  const lastName: string = useSelector(lastNameSelector) || '';

  /**
   * User's role
   * @type {string}
   */
  const role = useSelector(roleSelector);

  /**
   * User's role details
   * @type {Object}
   */
  const roleDetail = useSelector(roleDetailSelector);

  /**
   * Display name for the user's role
   * @type {string}
   */
  const roleDisplayName = roleDetail?.displayName;

  /**
   * Handles the logout action
   * Dispatches the logout request
   */
  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  return (
    <div>
      <nav
        className={`navbar navbar-expand navbar-light bg-light ps-sm-3dot125 ps-1 pe-sm-1dot5 pe-1 ${styles.appNavbar}`}
      >
        <Link to='/' className={`${styles.navbarLogo} navbar-brand`}>
          <NavBarLogo aria-labelledby='navbar-logo' className={styles.navBarLogoImg} />
        </Link>
        <div className={`nav-item dropdown ms-auto`}>
          <div
            className={`nav-link dropdown-toggle light d-flex align-items-center ${styles.userOptions}`}
            id='navbarScrollingDropdown'
            role='button'
            data-bs-toggle='dropdown'
            aria-expanded='false'
          >
            <div className={`d-flex align-items-center justify-content-center me-0dot5 fw-bold ${styles.userLogo}`}>
              {`${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()}
            </div>
            <div>
              <div className={`lh-1dot375 text-capitalize ${styles.name}`}>
                {firstName || lastName ? `${firstName} ${lastName}` : 'Settings'}
              </div>
              <div className='subtle-small-text'>{roleDisplayName || ROLE_LABELS[role]}</div>
            </div>
            <img src={CaretDownIcon} alt='' className='ms-0dot625' />
          </div>
          <ul
            className={`dropdown-menu dropdown-menu-end highlight-small-text pt-0 ${styles.navbarDropdown}`}
            aria-labelledby='navbarScrollingDropdown'
          >
            <UserMenu role={role} />
            <li>
              <div
                className={`dropdown-item px-0dot875 py-0dot75 pointer d-flex align-items-center ${styles.navbarDropdownItem}`}
                onClick={handleLogout}
              >
                <div className={`${styles.iconWrapper} me-0dot75 d-flex align-items-center justify-content-center`}>
                  <img data-testid='logoutIcon' src={LogoutIcon} alt='' width={16} height={16} />
                </div>
                Logout
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
