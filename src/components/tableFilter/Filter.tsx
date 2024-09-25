import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ReactComponent as FilterListIcon } from '../../assets/images/filter-icon.svg';
import styles from './Filter.module.scss';
import { IHFUserGet } from '../../store/healthFacility/types';

interface IFilteredData {
  isShow: any;
  name: string;
  isSearchable: boolean;
  data: any[];
}

interface ITableFilterProps {
  filterData: IFilteredData;
  isFacility: boolean;
  setSelectedRole: any;
  setSelectedFacility: any;
  filterCount?: number;
}

interface IOption {
  name: string;
  tenantId: string;
}

const TableFilter: React.FC<ITableFilterProps> = ({
  filterData,
  isFacility,
  setSelectedFacility,
  setSelectedRole,
  filterCount
}: ITableFilterProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const selectAllLabel = 'Select all';
  const isAllSelected = useRef<boolean>(false);
  const selectAllOptionData = { id: 0, value: '*', name: selectAllLabel, displayName: selectAllLabel };
  const [selectAllOption, setSelectAllOption] = useState<{
    id: number;
    value: string;
    name: string;
    displayName: string;
  } | null>(selectAllOptionData);

  /**
   * Handles the change of selected options.
   * @param {Object} opt - The option object.
   * @param {string} opt.name - The name of the selected option.
   */

  const handleSelectChange = (option: IOption) => {
    if (isFacility) {
      if (option.name === selectAllLabel) {
        if (isAllSelected.current) {
          setSelectedFacility([]);
        } else {
          setSelectedFacility(() => {
            return filteredOptions.map((opt) => opt.tenantId);
          });
        }
      } else {
        setSelectedFacility((prev: string[]) => {
          const updatedFacilityTenantIds = prev?.includes(option?.tenantId)
            ? prev.filter((tenantId) => tenantId !== option?.tenantId)
            : [...(prev || []), option?.tenantId];
          return updatedFacilityTenantIds;
        });
      }
    } else {
      if (option.name === selectAllLabel) {
        if (isAllSelected.current) {
          setSelectedRole([]);
        } else {
          setSelectedRole(() => {
            return filteredOptions.map((opt) => opt.name);
          });
        }
      } else {
        setSelectedRole((prev: string[]) => {
          const updatedRoleNameList = prev?.includes(option?.name)
            ? prev.filter((name) => name !== option?.name)
            : [...(prev || []), option?.name];
          return updatedRoleNameList;
        });
      }
    }

    // Update the selected options state for UI purposes
    if (option.name === selectAllLabel) {
      if (isAllSelected.current) {
        isAllSelected.current = false;
        setSelectedOptions([]);
      } else {
        isAllSelected.current = true;
        setSelectedOptions(() => {
          return [selectAllOption, ...filteredOptions].map((opt) => opt.name);
        });
      }
    } else {
      setSelectedOptions((prev) => {
        const selectedFilterOptions = prev.includes(option.name)
          ? prev.filter((name) => name !== option.name)
          : [...prev, option.name];
        const selectedAllIndex = selectedFilterOptions?.indexOf(selectAllLabel);
        if (selectedFilterOptions?.length === filterData?.data?.length && selectedAllIndex === -1) {
          selectedFilterOptions.push(selectAllLabel);
          isAllSelected.current = true;
        } else if (selectedAllIndex > -1) {
          isAllSelected.current = false;
          selectedFilterOptions.splice(selectedAllIndex, 1);
        }
        return selectedFilterOptions;
      });
    }
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
    setSearchTerm('');
  };

  /**
   * Hide select all option when user type in search input
   */
  useEffect(() => {
    if (searchTerm.length) {
      setSelectAllOption(null);
    } else {
      setSelectAllOption(selectAllOptionData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

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
    if (
      dropdownContainerRef.current &&
      !dropdownContainerRef.current.contains(event.target as Node) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      setSearchTerm('');
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
    <>
      {filterData.isShow && (
        <div className={`${styles.selectHeader}`}>
          <div
            className={`${styles.selectHeader} ${styles.container} d-flex align-items-center justify-content-between px-1 border rounded border-secondary mx-1 position-relative filter-container`}
            onClick={handleDropdownToggle}
            ref={dropdownContainerRef}
          >
            {/* {!!filterCount && (
              <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary'>
                {filterCount}
              </span>
            )} */}
            <div className='d-flex align-items-center'>
              <FilterListIcon />
              <span className={`text-secondary py-0dot25 px-1 filter-placeholder ${styles.placeholder}`}>
                {filterData.name}
              </span>
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
              {!!filteredOptions.length ? (
                <ul className='list-unstyled mb-0'>
                  {[...(selectAllOption ? [selectAllOption] : []), ...filteredOptions].map((option) => (
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
              ) : (
                <p className='text-muted text-center mb-0 pe-none'>No results found</p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TableFilter;
