import React, { Dispatch, SetStateAction } from 'react';
import APPCONSTANTS from '../../constants/appConstants';
import IconButton from '../button/IconButton';
import Searchbar from '../searchbar/Searchbar';
import CustomTooltip from '../tooltip';
import styles from './DetailCard.module.scss';
import Filter from '../tableFilter/Filter';

// Type for the setter functions
type SetSelectedState = Dispatch<SetStateAction<string[] | undefined>>;
interface IDetailCardProps {
  header: string;
  buttonIcon?: string | React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  buttonCustomStyle?: React.CSSProperties;
  buttonCustomClass?: string;
  buttonLabel?: string;
  customLabel?: string;
  customIcon?: string | React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  customButtonIcon?: string | React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  isEdit?: boolean;
  children: React.ReactElement;
  onSearch?: (searchStr: string) => void;
  searchPlaceholder?: string;
  isSearch?: boolean;
  onButtonClick?: () => void;
  onCustomClick?: (data: any) => void;
  isFilter?: boolean;
  onFilterData?: IFilteredData[];
  className?: string;
  bodyClassName?: string;
  setSelectedRole?: SetSelectedState;
  setSelectedFacility?: SetSelectedState;
}

interface IFilteredData {
  id: number;
  name: string;
  isSearchable: boolean;
  isFacility: boolean;
  data: any[];
  isShow: boolean;
  filterCount?: number;
}

/**
 * The component for card detail with searchbar, filter, and buttons.
 * @param props - Props for the DetailCard component.
 * @returns React.ReactElement
 */
const DetailCard = ({
  header,
  buttonLabel,
  customLabel,
  buttonIcon = '',
  customIcon,
  buttonCustomStyle = {},
  buttonCustomClass = '',
  customButtonIcon,
  isEdit,
  children,
  onSearch,
  searchPlaceholder = APPCONSTANTS.SEARCH_BY_NAME,
  isSearch = false,
  onButtonClick,
  onCustomClick,
  isFilter,
  onFilterData,
  className = '',
  bodyClassName = '',
  setSelectedRole,
  setSelectedFacility
}: IDetailCardProps): React.ReactElement => {
  const buttonClass = `${
    buttonLabel && onButtonClick ? (isFilter ? 'me-lg-0 me-xxl-1 mt-1' : 'me-1 mt-1') : 'mt-0'
  } mt-lg-0`;
  const searchClass = `${isSearch ? 'mt-1' : ''} mt-lg-0`;

  /**
   * Renders the search bar if isSearch is true and onSearch is provided.
   * @returns React.ReactElement | null
   */
  const renderSearchBar = () => {
    return isSearch && onSearch ? (
      <div className={buttonClass}>
        <Searchbar placeholder={searchPlaceholder} onSearch={onSearch} />
      </div>
    ) : null;
  };

  /**
   * Renders the filter component if isFilter is true.
   * @param filteredData - Data for the filter component.
   * @returns React.ReactElement | null
   */
  const renderFilter = (isFacility: boolean, filteredData: IFilteredData) => {
    return isFilter ? (
      <Filter
        filterData={filteredData}
        isFacility={isFacility}
        setSelectedRole={setSelectedRole}
        setSelectedFacility={setSelectedFacility}
        filterCount={filteredData.filterCount}
        key={filteredData?.id}
      />
    ) : null;
  };

  /**
   * Renders the custom icon if customLabel and onCustomClick are provided.
   * @returns React.ReactElement | null
   */
  const renderCustomIcon = () => {
    return customLabel && onCustomClick ? (
      <div className={`${customIcon ? styles.customIcon : searchClass} me-1`} onClick={onCustomClick}>
        {customIcon ? (
          <CustomTooltip title={customLabel}>
            {typeof customIcon === 'string' ? <img src={customIcon} alt='custom-icon' /> : <></>}
          </CustomTooltip>
        ) : (
          <IconButton
            buttonCustomStyle={buttonCustomStyle}
            buttonCustomClass={buttonCustomClass}
            customIcon={customButtonIcon}
            label={customLabel}
            handleClick={() => null}
          />
        )}
      </div>
    ) : null;
  };

  return (
    <div className={`card ${styles.detail} ${className}`}>
      <div className={`card-header bg-transparent flex-wrap flex-lg-nowrap ${styles.header}`}>
        <span className={`${styles.headerLabel} ${isSearch && buttonLabel && onButtonClick ? '' : 'w-auto'}`}>
          {header}
        </span>
        <div
          className={`d-flex justify-content-between  ${
            buttonLabel && onButtonClick ? 'justify-content-lg-end' : ''
          }  ${isSearch && buttonLabel ? 'flex-grow-1' : 'flex-grow-0'} flex-grow-md-0 ${styles.buttonContainer}`}
        >
          {renderSearchBar()}
          {onFilterData?.map((data: IFilteredData) => data.data && renderFilter(data.isFacility, data))}
          <div className='d-flex'>
            {renderCustomIcon()}
            {buttonLabel && onButtonClick ? (
              <div className={`${searchClass}`}>
                <IconButton customIcon={buttonIcon} label={buttonLabel} isEdit={isEdit} handleClick={onButtonClick} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className={`card-body p-0 ${bodyClassName}`}>{children}</div>
    </div>
  );
};

export default DetailCard;
