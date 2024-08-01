import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ReactComponent as FilterListIcon } from '../../assets/images/filter-icon.svg';
import styles from './Filter.module.scss';
import { IHFUserGet } from '../../store/healthFacility/types';

interface IFilteredData {
  name: string;
  isSearchable: boolean;
  data: any[];
}

interface FacilitySelectProps {
  filterData: IFilteredData;
  onFilter: (selectedIds: { roleNameList: string[]; facilityTenantIds: string[] }) => void;
  isFacility: boolean;
}

interface Option {
  name: string;
  tenantId: string
}

interface SelectedIds {
  roleNameList: string[];
  facilityTenantIds: string[];
}

const FacilitySelect: React.FC<FacilitySelectProps> = ({ filterData, onFilter, isFacility }: FacilitySelectProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [roleNameList, setRoleNameList] = useState<string[]>([]);
  const [facilityTenantIds, setFacilityTenantIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Handles the change of selected options.
   * @param {Object} option - The option object.
   * @param {string} option.name - The name of the selected option.
   */

  const handleSelectChange = (option: Option) => {
    setSelectedOptions((prev) => {
      if (prev.includes(option.name)) {
        return prev.filter((item) => item !== option.name);
      } else {
        return [...prev, option.name];
      }
    });
    if (isFacility) {
      setFacilityTenantIds((prev) => {
        const updatedOptions = prev.includes(option.tenantId)
          ? prev.filter((item) => item !== option.tenantId)
          : [...prev, option.tenantId];
        onFilter({ roleNameList, facilityTenantIds: updatedOptions });
        return updatedOptions;
      });
    } else {
      setRoleNameList((prev) => {
        const updatedOptions = prev.includes(option.name)
          ? prev.filter((item) => item !== option.name)
          : [...prev, option.name];
        onFilter({ roleNameList: updatedOptions, facilityTenantIds });
        return updatedOptions;
      });
    }
  };

  /**
   * Debounces a function call.
   * @param func The function to be debounced.
   * @param wait The debounce wait time in milliseconds.
   */
  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  /**
   * Toggles the dropdown open/close.
   */
  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchChange = useCallback(
    debounce((inputValue: string) => {
      setSearchTerm(inputValue);
    }, 300),
    [debounce, setSearchTerm]
  );

  /**
   * Handles click outside the dropdown to close it.
   * @param event The MouseEvent object.
   */
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = filterData?.data.filter((option) => {
    return option?.name?.toLowerCase().includes(searchTerm?.toLowerCase());
  });

  /**
   * Formats health facility data into a string.
   * @param user The health facility user data.
   * @returns A formatted string of health facility names.
   */
  const formatHealthFacility = (user: IHFUserGet) => `${(user.organizations || []).map((org) => org.name).join(', ')}`;
  return (
    <div className={styles.selectHeader}>
      <div
        className={`${styles.selectHeader} d-flex align-items-center justify-content-between px-1 border rounded border-secondary mx-1`}
        onClick={handleDropdownToggle}
      >
        <div className='d-flex align-items-center'>
          <FilterListIcon />
          <span className='text-secondary py-0dot25 px-1'>{filterData.name}</span>
        </div>
        <div className={`text-secondary ${styles.arrow} ${isOpen ? 'open' : ''}`} />
      </div>
      {isOpen && (
        <div ref={dropdownRef} className={`${styles.selectDropdown} border rounded p-0dot5`}>
          {filterData.isSearchable && (
            <input
              type='text'
              placeholder='Search Facility'
              className='form-control mb-1'
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          )}
          <ul className='list-unstyled mb-0'>
            {filteredOptions.map((option) => (
              <li
                key={option.id}
                className={`${styles.selectOption} px-1 py-0dot5 ${
                  selectedOptions.includes(option.name) && styles.selectedDropdown
                }`}
              >
                <label className='d-flex align-items-center fs-6'>
                  <input
                    type='checkbox'
                    value={option.id}
                    checked={selectedOptions.includes(option.name)}
                    onChange={() => handleSelectChange(option)}
                    className='mr-2'
                  />
                  {!isFacility ? option.displayName : option.name} {formatHealthFacility(option)}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FacilitySelect;
