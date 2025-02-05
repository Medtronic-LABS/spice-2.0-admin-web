import React, { useEffect } from 'react';
import Select, { CSSObjectWithLabel, GroupBase, OptionProps } from 'react-select';
import Async from 'react-select/async';

import InfoIcon from '../../assets/images/info-grey.svg';
import CustomTooltip from '../tooltip';
import styles from './SelectInput.module.scss';
import { useForm } from 'react-final-form';

export interface ISelectOption {
  label: string;
  value: string;
}

export interface ISelectFormOptions {
  label: string;
  key: string;
}

export interface IDefaultValueOption {
  name: string;
  id: string;
}

interface ISelectBoxProps {
  id?: string;
  label: string;
  placeholder?: string;
  error?: string;
  errorLabel?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: any) => void;
  onInput?: (e: any) => void;
  isOptionDisabled?: (data: any) => boolean;
  value?: { value: string; label: string };
  options: any;
  showOnlyDropdown?: boolean;
  defaultValue?: any;
  optionPropStyles?: any;
  loadingOptions?: boolean;
  nestedObject?: boolean;
  labelKey?: string | string[];
  valueKey?: string | string[];
  required?: boolean;
  disabled?: boolean;
  input: any;
  loadInputOptions?: (value: string) => Promise<any>;
  appendPlus?: boolean;
  isModel?: boolean;
  isShowLabel?: boolean;
  isMulti?: boolean;
  autoSelect?: boolean;
  name?: string;
  menuPlacement?: string;
  autoSelectValue?: any;
  isMandatoryAutoPopulate?: boolean;
}

export const handleChange = (input: any, onChange: (e: any) => void, value: any) => {
  if (input) {
    input.onChange(value);
  }
  if (onChange) {
    onChange(value);
  }
};

/**
 * Standard select input component for forms
 * wrapped around react-select
 * @param param0
 * @returns {React.ReactElement}
 */
const SelectInput = ({
  id,
  label,
  onFocus,
  onBlur,
  onChange,
  onInput,
  placeholder,
  error = '',
  errorLabel = '',
  options,
  loadingOptions,
  valueKey,
  nestedObject,
  labelKey,
  showOnlyDropdown = false,
  defaultValue,
  required = true,
  input,
  disabled = false,
  appendPlus = false,
  isModel = false,
  isShowLabel = true,
  isMulti = false,
  menuPlacement = 'auto',
  autoSelect = true,
  autoSelectValue = '',
  optionPropStyles,
  isOptionDisabled,
  isMandatoryAutoPopulate = false,
  name = '',
  ...rest
}: ISelectBoxProps): React.ReactElement => {
  const { change } = useForm();

  // To auto select if only 1 option is available
  useEffect(() => {
    if (options && options.length === 1 && name && (required || isMandatoryAutoPopulate) && autoSelect) {
      const value = isMulti ? (autoSelectValue ? [autoSelectValue] : [options[0]]) : autoSelectValue || options[0];
      setTimeout(() => {
        change(name, value);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, options, options?.length, required]);

  const getOptionLabel = (option: any) => {
    if (labelKey && nestedObject) {
      return option[labelKey[0]][labelKey[1]];
    } else if (labelKey && typeof labelKey === 'string') {
      return appendPlus && option[labelKey] ? `+${option[labelKey]}` : option[labelKey];
    } else {
      return option.label;
    }
  };

  const getOptionValue = (option: any) => {
    if (valueKey && nestedObject) {
      return option[valueKey[0]][valueKey[1]];
    } else if (valueKey && typeof valueKey === 'string') {
      return option[valueKey];
    } else {
      return option.value;
    }
  };

  const defaultStyles = () => {
    return {
      valueContainer: (base: CSSObjectWithLabel) => ({ ...base, maxHeight: '200px', overflowY: 'auto' }),
      option: (optionStyles: CSSObjectWithLabel, optionProps: OptionProps<unknown, false, GroupBase<unknown>>) => {
        return {
          ...optionStyles,
          ...optionPropStyles,
          fontSize: '14px',
          pointer: 'none',
          color: optionProps.isDisabled
            ? '#e6e6e6 !important'
            : optionProps.isFocused
            ? '#e6e6e6 !important'
            : '#212529',
          backgroundColor: optionProps.isDisabled ? '#e6e6e6 !important' : optionProps.isFocused ? '#DEEBFF' : 'white',
          '&:focus': {
            color: optionProps.isDisabled ? '#e6e6e6 !important' : '#212529',
            backgroundColor: optionProps.isDisabled ? '#e6e6e6 !important' : '#deebff'
          }
        };
      }
    };
  };

  return (
    <div className={`d-flex flex-column ${styles.selectInputContainer}`} data-testid='select-input'>
      {isShowLabel && !showOnlyDropdown && (
        <label className='mb-0dot5 fs-0dot875 lh-1dot25'>
          {label}
          {required && <span className='input-asterisk'>*</span>}
        </label>
      )}
      <Select
        {...rest}
        {...input}
        id={id}
        options={options}
        styles={
          isModel
            ? {
                ...defaultStyles(),
                menuPortal: (base) => ({ ...base, zIndex: 9999 })
              }
            : defaultStyles()
        }
        menuPortalTarget={isModel ? document.body : false}
        className={`select-field ${error ? 'danger' : ''}`}
        classNamePrefix='select-field'
        defaultValue={defaultValue}
        onFocus={onFocus}
        isMulti={isMulti}
        onBlur={onBlur}
        onChange={(value) => handleChange(input, onChange as (e: any) => void, value)}
        onInputChange={onInput}
        placeholder={placeholder || ''}
        openMenuOnFocus={true}
        isLoading={loadingOptions}
        menuPlacement={menuPlacement}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        isDisabled={disabled}
        isOptionDisabled={isOptionDisabled}
        aria-label={label}
      />
      {!showOnlyDropdown && (
        <div className={styles.error}>
          {error} {error && errorLabel}
        </div>
      )}
    </div>
  );
};

export default SelectInput;

export const AsyncSelectInput = ({
  label,
  onChange,
  placeholder,
  error = '',
  errorLabel = '',
  required = true,
  valueKey,
  nestedObject,
  labelKey,
  appendPlus,
  input,
  disabled = false,
  loadInputOptions,
  isModel = false,
  ...rest
}: ISelectBoxProps) => {
  const getOptionLabel = (option: any) => {
    if (labelKey && nestedObject) {
      return option[labelKey[0]][labelKey[1]];
    } else if (labelKey && typeof labelKey === 'string') {
      return appendPlus ? `+${option[labelKey]}` : option[labelKey];
    } else {
      return option.label;
    }
  };

  const getOptionValue = (option: any) => {
    if (valueKey && nestedObject) {
      return option[valueKey[0]][valueKey[1]];
    } else if (valueKey && typeof valueKey === 'string') {
      return option[valueKey];
    } else {
      return option.value;
    }
  };

  let timeoutId: ReturnType<typeof setTimeout>;
  const loadOptions = (inputValue: string, callback: any) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(async () => {
      let response = [];
      if (loadInputOptions && inputValue.length > 2) {
        response = await loadInputOptions(inputValue);
        callback(response);
      } else {
        callback([]);
      }
    }, 500);
  };

  return (
    <div className={`d-flex flex-column ${styles.selectInputContainer}`} data-testid='async-select-input'>
      <label className='mb-0dot5 fs-0dot875 lh-1dot25 d-inline-flex'>
        {label}
        {required && <span className='input-asterisk'>*</span>}
        <CustomTooltip title='Type 3 characters to search'>
          <img src={InfoIcon} alt='Type 3 letters' className={styles.infoIcon} />
        </CustomTooltip>
      </label>
      <Async
        {...input}
        {...rest}
        styles={
          isModel
            ? {
                menuPortal: (base) => ({ ...base, zIndex: 9999 })
              }
            : {}
        }
        className={`select-field ${error ? 'danger' : ''}`}
        classNamePrefix='select-field'
        placeholder={placeholder || ''}
        label={label}
        isClearable={true}
        onChange={(value) => handleChange(input, onChange as (e: any) => void, value)}
        menuPortalTarget={isModel ? document.body : false}
        cacheOptions={false}
        loadOptions={loadOptions}
        defaultOptions={[]}
        isDisabled={disabled}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
      />
      <div className={styles.error}>
        {error} {error && errorLabel}
      </div>
    </div>
  );
};
