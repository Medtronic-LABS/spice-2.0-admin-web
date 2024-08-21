import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ReactComponent as FilterListIcon } from '../../assets/images/filter-icon.svg';
import styles from './Filter.module.scss';
import { IHFUserGet } from '../../store/healthFacility/types';

interface IFilteredData {
  name: string;
  isSearchable: boolean;
  data: any[];
}

interface ITableFilterProps {
  filterData: IFilteredData;
  isFacility: boolean;
  setSelectedRole: any;
  setSelectedFacility: any;
}

interface IOption {
  name: string;
  tenantId: string;
}

const TableFilter: React.FC<ITableFilterProps> = ({
  filterData,
  isFacility,
  setSelectedFacility,
  setSelectedRole
}: ITableFilterProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Handles the change of selected options.
   * @param {Object} option - The option object.
   * @param {string} option.name - The name of the selected option.
   */

  const handleSelectChange = (option: IOption) => {
    if (isFacility) {
      setSelectedFacility((prev: string[]) => {
        const updatedFacilityTenantIds = prev?.includes(option?.tenantId)
          ? prev.filter((tenantId) => tenantId !== option?.tenantId)
          : [...(prev || []), option?.tenantId];
        return updatedFacilityTenantIds;
      });
    } else {
      setSelectedRole((prev: string[]) => {
        const updatedRoleNameList = prev?.includes(option?.name)
          ? prev.filter((name) => name !== option?.name)
          : [...(prev || []), option?.name];
        return updatedRoleNameList;
      });
    }

    // Update the selected options state for UI purposes
    setSelectedOptions((prev) => {
      return prev.includes(option.name) ? prev.filter((name) => name !== option.name) : [...prev, option.name];
    });
  };

  /**
   * Debounces a function call.
   * @param func The function to be debounced.
   * @param wait The debounce wait time in milliseconds.
   */
  const debounce = <T extends unknown[]>(func: (...args: T) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: T) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

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

export default TableFilter;
