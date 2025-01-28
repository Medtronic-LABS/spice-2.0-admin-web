import React, { useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { ReactComponent as ArrowRight } from '../../assets/images/arrow-right-small.svg';
import APPCONSTANTS, { APP_TYPE } from '../../constants/appConstants';
import sessionStorageServices from '../../global/sessionStorageServices';
import { convertToCaptilize } from '../../utils/validation';

import styles from './SummaryCard.module.scss';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';

export type IAppType = keyof typeof APP_TYPE;
export interface ISummaryInfo {
  label: string;
  value: string | number;
  type?: 'number' | 'string';
  route: string;
  appType?: IAppType[];
  disableEllipsis?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export interface ISummaryCardProps {
  title: string;
  subTitle?: string;
  sub?: string;
  img?: string;
  data: ISummaryInfo[];
  detailRoute?: string;
  disableImg?: boolean;
  titleClassName?: string;
  formId?: string;
  tenantId?: string;
  linkStyle?: object;
  setBreadcrumbDetails: () => void;
}

/**
 * SummaryCard component displays a summary of information with navigation capabilities.
 * @param {ISummaryCardProps} props - The component props
 * @returns {JSX.Element} The rendered SummaryCard component
 */
const SummaryCard = ({
  data,
  subTitle = '',
  title = '',
  img,
  detailRoute,
  setBreadcrumbDetails,
  disableImg,
  titleClassName,
  tenantId,
  formId,
  linkStyle = {}
}: ISummaryCardProps) => {
  const history = useHistory();
  /**
   * Handles the hover effect on the navigation link.
   * @param {React.MouseEvent<HTMLDivElement>} e - The mouse event
   */
  const handleLinkHover = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // this classname is added only after mouse enters the element
    // this is to prevent the animation to be shown during component mount
    try {
      (e.target as HTMLAnchorElement)?.classList?.add(styles.animationEnabled);
    } catch (error) {
      console.error(error);
    }
  }, []);

  /**
   * Handles navigation to the detail route.
   */
  const handleNavigation = () => {
    sessionStorageServices.setItem(APPCONSTANTS.ID, tenantId);
    sessionStorageServices.setItem(APPCONSTANTS.FORM_ID, formId);
    setBreadcrumbDetails?.();
    history.push({ pathname: detailRoute });
  };

  const {
    isCommunity,
    healthFacility: { s: healthFacilitySName }
  } = useAppTypeConfigs();

  return (
    <div
      className={`${styles.summaryCard} px-1dot25 d-flex mw-0 \
      align-items-sm-center align-items-start \
      flex-sm-row flex-column
      flex-sm-nowrap flex-wrap \
      justify-content-sm-between justify-content-start \
      `}
      data-testid='summary-card'
    >
      {title && (
        <div className={`d-flex align-items-center align-self-center mw-0 py-0dot5 ${styles.titleContainer}`}>
          {img ? <img src={img} alt='more' className={`me-0dot625 rounded-circle ${styles.countryLogo}`} /> : null}
          {!img && !disableImg ? (
            <div
              className={`me-0dot625 rounded-circle d-flex align-items-center justify-content-center fw-bold ${styles.countryLogo}`}
            >
              {title.charAt(0).toUpperCase()}
            </div>
          ) : null}
          <div className='d-flex flex-column mw-0'>
            <div className={`primary-title fw-bold text-ellipsis ${styles.title} ${titleClassName}`} title={title}>
              {title}
            </div>
            {subTitle && <span className={`fs-0dot75 ${styles.subTitle}`}>{convertToCaptilize(subTitle)}</span>}
          </div>
        </div>
      )}
      {data.map(({ label, value, route, disableEllipsis, onClick, appType }, i) =>
        appType?.includes(APP_TYPE.NON_COMMUNITY as IAppType) || label === healthFacilitySName || !isCommunity ? (
          <Link
            className={`${styles.summaryElement} py-sm-1dot125 py-0dot5 px-sm-1 px-0dot5 d-flex flex-column mw-0`}
            style={linkStyle}
            key={`${label}_${i}`}
            to={route}
            onClick={(event: React.MouseEvent) => {
              sessionStorageServices.setItem(APPCONSTANTS.ID, tenantId);
              sessionStorageServices.setItem(APPCONSTANTS.FORM_ID, formId);
              onClick?.(event);
            }}
            data-testid='summary-elements'
          >
            <div className='primary-title lh-1dot375'>{value}</div>
            <div className={`subtle-small-text ${disableEllipsis ? '' : 'text-ellipsis'}`}>{label}</div>
          </Link>
        ) : (
          <div
            className={`${styles.summaryElement} py-sm-1dot125 py-0dot5 px-sm-1 px-0dot5 d-flex flex-column mw-0`}
            data-testid='summary-elements'
            key={i}
          >
            <div className='primary-title lh-1dot375'>{value}</div>
            <div className={`subtle-small-text ${disableEllipsis ? '' : 'text-ellipsis'}`}>{label}</div>
          </div>
        )
      )}
      <div
        className={`align-self-center ${styles.moveForward} my-0dot5`}
        onMouseLeave={handleLinkHover}
        onClick={handleNavigation}
        data-testid='move-forward'
      >
        <ArrowRight aria-labelledby='arrow-right' />
      </div>
    </div>
  );
};

export default SummaryCard;
