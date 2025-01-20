import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ReactComponent as FilterListIcon } from '../../assets/images/filter-icon.svg';
import { ReactComponent as Close } from '../../assets/images/close.svg';
import styles from './Filter.module.scss';
import { IHFUserGet } from '../../store/healthFacility/types';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';

interface IFilteredData {
  isShow: any;
  name: string;
  key?: string;
  isSearchable: boolean;
  data: any[];
}

interface ITableFilterProps {
  filterData: IFilteredData;
  isFacility: boolean;
  isGeneric?: boolean;
  setSelectedRole: any;
  setSelectedFacility: any;
  onChange?: any;
  filterCount?: number;
  placeholder?: string;
  updatedFilterData?: any;
}

interface IOption {
  id: string;
  name: string;
  tenantId: string;
}

const TableFilter: React.FC<ITableFilterProps> = ({
  filterData,
  isFacility,
  isGeneric,
  setSelectedFacility,
  setSelectedRole,
  onChange,
  filterCount,
  placeholder,
  updatedFilterData
}: ITableFilterProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedOptionsIds, setSelectedOptionsIds] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    filterComponent: {
      filterIcon: { available: showCountIcon }
    }
  } = useAppTypeConfigs();

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

  useEffect(() => {
    if (filterData.name === 'Chiefdom') {
      if (updatedFilterData?.chiefdomIds && updatedFilterData?.chiefdomIds?.length > 0) {
        setSelectedOptions(updatedFilterData.chiefdomIds);
        setSelectedOptionsIds(updatedFilterData.chiefdomIds);
      } else {
        setSelectedOptions([]);
        setSelectedOptionsIds([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedFilterData?.districtIds]);

  useEffect(() => {
    if (filterData.name === 'Brand') {
      if (updatedFilterData?.brandIds && updatedFilterData?.brandIds?.length > 0) {
        setSelectedOptions(updatedFilterData.brandIds);
        setSelectedOptionsIds(updatedFilterData.brandIds);
      } else {
        setSelectedOptions([]);
        setSelectedOptionsIds([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedFilterData?.classificationIds]);

  /**
   * Handles the change of selected options.
   * @param {IOption} option - The selected option object.
   */
  const handleSelectChange = (option: IOption) => {
    if (isGeneric) {
      if (option.name === selectAllLabel) {
        if (isAllSelected.current) {
          onChange([], filterData.key);
        } else {
          onChange(
            filteredOptions.map((opt) => opt.id),
            filterData.key
          );
        }
      } else {
        const selectedFilterOptions = selectedOptions.includes(option.name)
          ? selectedOptions.filter((name: string) => name !== option.name)
          : [...selectedOptions, option.name];
        const selectedData = filterData.data
          .filter((data: any) => selectedFilterOptions.includes(data.name))
          .map((data: any) => data?.id);
        onChange(selectedData, filterData.key);
      }
    } else if (isFacility) {
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
          setSelectedRole(() => filteredOptions.map((opt) => opt.name));
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

    // Update the selected options state
    if (option.name === selectAllLabel) {
      if (isAllSelected.current) {
        isAllSelected.current = false;
        setSelectedOptions([]);
        setSelectedOptionsIds([]);
      } else {
        isAllSelected.current = true;
        setSelectedOptions(() => {
          return [selectAllOption, ...filteredOptions].map((opt) => opt.name);
        });
        setSelectedOptionsIds(() => {
          return [selectAllOption, ...filteredOptions].map((opt) => opt.id);
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
      setSelectedOptionsIds((prev: any) => {
        const selectedFilterOptions = prev.includes(option.id)
          ? prev.filter((id: any) => id !== option.id)
          : [...prev, option.id];
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
   * @param {Function} func - The function to be debounced.
   * @param {number} wait - The debounce wait time in milliseconds.
   * @returns {Function} A debounced version of the input function.
   */
  const debounce = <T extends unknown[]>(func: (...args: T) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: T) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  /**
   * Toggles the dropdown open/close state.
   */
  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
    setSearchTerm('');
  };

  /**
   * Effect hook to hide or show the "Select All" option based on search term.
   */
  useEffect(() => {
    if (searchTerm.length) {
      setSelectAllOption(null);
    } else {
      setSelectAllOption(selectAllOptionData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  /**
   * Handles changes in the search input with debounce.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchChange = useCallback(
    debounce((inputValue: string) => {
      setSearchTerm(inputValue);
    }, 300),
    [debounce, setSearchTerm]
  );

  /**
   * Handles click outside the dropdown to close it.
   * @param {MouseEvent} event - The mouse event object.
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

  /**
   * Effect hook to add and remove click outside event listener.
   */
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Filters options based on the search term.
   */
  const filteredOptions = filterData?.data
    .filter((option) => {
      return option?.name?.toLowerCase().includes(searchTerm?.toLowerCase());
    })
    .sort((a: any, b: any) => (a.name.trim() > b.name.trim() ? 1 : -1));
  /**
   * Formats health facility data into a string.
   * @param {IHFUserGet} user - The health facility user data.
   * @returns {string} A formatted string of health facility names.
   */
  const formatHealthFacility = (user: IHFUserGet): string =>
    `${(user.organizations || []).map((org) => org.name).join(', ')}`;

  const getSelectValueFn = () => {
    return selectedOptions.length >= filteredOptions.length ? filteredOptions.length : selectedOptions.length;
  };
  return (
    <>
      {filterData.isShow && (
        <div>
          <div
            className={`${styles.selectHeader} ${styles.container} d-flex align-items-center justify-content-between px-0dot5 border rounded border-secondary mx-0dot5 position-relative filter-container`}
            onClick={handleDropdownToggle}
            ref={dropdownContainerRef}
          >
            <div className='d-flex align-items-center'>
              {selectedOptions.length && showCountIcon && getSelectValueFn() > 0 ? (
                <span className='  badge rounded-pill bg-primary'>{getSelectValueFn()}</span>
              ) : (
                <FilterListIcon />
              )}
              <span className={`text-secondary py-0dot25 px-1 filter-placeholder ${styles.placeholder}`}>
                {filterData.name}
              </span>
            </div>
            <div className={`text-secondary ${styles.arrow} ${isOpen ? styles.open : ''}`} />
          </div>
          {isOpen && (
            <div ref={dropdownRef} className={`${styles.selectDropdown} border rounded p-0dot5`}>
              {filterData.isSearchable && (
                <input
                  type='text'
                  placeholder={placeholder ?? 'Search Facility'}
                  className='form-control mb-1'
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              )}
              {
                <ul className='list-unstyled mb-0'>
                  {[...(selectAllOption ? [selectAllOption] : []), ...(filteredOptions || [undefined])].map((option) =>
                    filteredOptions.length ? (
                      <li
                        key={option.id}
                        className={`${styles.selectOption} ${
                          option.value === '*' ? styles.selectAllLi : ''
                        } px-1 py-0dot5 d-flex ${selectedOptionsIds.includes(option.id) && styles.selectedDropdown}`}
                      >
                        <label className='d-flex align-items-center fs-6'>
                          <input
                            type='checkbox'
                            value={option.id}
                            checked={selectedOptionsIds.includes(option.id)}
                            onChange={() => handleSelectChange(option)}
                            ref={(input) => {
                              if (input) {
                                input.indeterminate =
                                  option.value === '*' &&
                                  !!selectedOptions.length &&
                                  selectedOptions.length < filteredOptions.length;
                              }
                            }}
                            className='mr-2'
                          />
                          {(!isFacility ? option.displayName : option.name) || option.name}{' '}
                          {formatHealthFacility(option)}
                        </label>
                        {option.value === '*' && !!selectedOptions.length && (
                          <label
                            className={` ${styles.closeIcon}`}
                            onClick={() => {
                              isAllSelected.current = true;
                              handleSelectChange(selectAllOptionData as any);
                            }}
                          >
                            {/* <Close aria-label='close' /> */}
                            Reset All
                          </label>
                        )}
                      </li>
                    ) : (
                      <li>No results found</li>
                    )
                  )}
                </ul>
              }
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TableFilter;
