import { NavLink } from 'react-router-dom';
import APPCONSTANTS from '../../constants/appConstants';
import styles from './Header.module.scss';

interface IUserMenuItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
}

const { ROLES } = APPCONSTANTS;

const UserMenu = ({ role }: any) => {
  const menus = [
    {
      label: 'My Profile',
      icon: 'IconProfile',
      route: '',
      roles: Object.values(ROLES)
    }
  ];

  const permittedMenus = menus.filter(({ roles }) => roles?.includes(role));
  const handleClick = (modalcheck: any, event: any) => {
    //
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
    </>
  );
};

export default UserMenu;
