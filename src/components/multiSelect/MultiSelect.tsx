import { useState, useRef } from 'react';
import { default as ReactSelect, components, InputAction } from 'react-select';

import styles from './MultiSelect.module.scss';

export interface IOption {
  value: number | string;
  label: string;
}

const convertOptionType = (labelKey: string | string[], valueKey: string | string[], options: any) =>
  labelKey && valueKey
    ? (options || []).map((option: any) => {
        return {
          ...option,
          label: Array.isArray(labelKey) ? option[labelKey[0]] + ' ' + option[labelKey[1]] : option?.[labelKey] || '',
          value: Array.isArray(valueKey) ? option[valueKey[0]] + ' ' + option[valueKey[1]] : option?.[valueKey] || ''
        };
      })
    : options;

const MultiSelect = (props: any) => {
  const newProps = {
    ...props,
    value: convertOptionType(props.labelKey, props.valueKey, Array.isArray(props.value) ? props.value : []),
    options: convertOptionType(props.labelKey, props.valueKey, Array.isArray(props.options) ? props.options : [])
  };
  const [selectInput, setSelectInput] = useState<string>('');
  const isAllSelected = useRef<boolean>(false);
  const selectAllLabel = useRef<string>('Select all');
  const allOption = { value: '*', label: selectAllLabel.current };
  const filterOptions = (filters: IOption[] = [], input: string) =>
    filters &&
    filters
      ?.filter(({ label }: IOption) => label?.toLowerCase().includes(input?.toLowerCase()))
      .sort((a: any, b: any) => a.value - b.value);

  const comparator = (v1: IOption, v2: IOption) => (v1.value as number) - (v2.value as number);

  const filteredOptions = filterOptions(newProps.options, selectInput);
  const filteredSelectedOptions = filterOptions(newProps?.value, selectInput);

  const multiOption = (multiSelectprops: any) => (
    <components.Option {...multiSelectprops}>
      <div className='d-flex align-items-baseline h-100'>
        {multiSelectprops.value === '*' && !isAllSelected.current && filteredSelectedOptions?.length > 0 ? (
          <input
            key={multiSelectprops.value}
            type='checkbox'
            ref={(input) => {
              if (input) {
                input.indeterminate = true;
              }
            }}
          />
        ) : (
          <input
            key={multiSelectprops.value}
            type='checkbox'
            checked={multiSelectprops.isSelected || isAllSelected.current}
            onChange={() => {
              /* No action needed */
            }}
          />
        )}
        <label style={{ marginLeft: '5px' }}>{multiSelectprops.label}</label>
      </div>
    </components.Option>
  );

  const multiSelectInput = ({ selectProps, children, ...inputProps }: any) => (
    <>
      {selectInput.length === 0 ? (
        <components.Input autoFocus={selectProps.menuIsOpen} {...inputProps}>
          {children}
        </components.Input>
      ) : (
        <div style={{ maxHeight: '100px' }}>
          <components.Input autoFocus={selectProps.menuIsOpen} {...inputProps}>
            {children}
          </components.Input>
        </div>
      )}
    </>
  );

  const onInputChange = (inputValue: string, event: { action: InputAction }) => {
    if (event.action === 'set-value') {
      setSelectInput('');
    } else if (event.action === 'input-change') {
      setSelectInput(inputValue);
    } else if (event.action === 'menu-close' && selectInput !== '') {
      setSelectInput('');
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((e.key === ' ' || e.key === 'Enter' || e.key === 'Space') && !selectInput) {
      e.preventDefault();
    }
  };

  const handleChange = (selected: IOption[]) => {
    if (
      selected.length > 0 &&
      !isAllSelected.current &&
      (selected[selected.length - 1].value === allOption.value ||
        JSON.stringify(filteredOptions) === JSON.stringify(selected.sort(comparator)))
    ) {
      return newProps.onChange(
        [
          ...(newProps.value || []),
          ...newProps.options?.filter(
            ({ label }: IOption) =>
              label.toLowerCase().includes(selectInput?.toLowerCase()) &&
              (newProps.value || []).filter((opt: IOption) => opt.label === label).length === 0
          )
        ].sort(comparator)
      );
    } else if (
      selected.length > 0 &&
      selected[selected.length - 1].value !== allOption.value &&
      JSON.stringify(selected.sort(comparator)) !== JSON.stringify(filteredOptions)
    ) {
      return newProps.onChange(selected);
    } else {
      return newProps.onChange([
        ...props.mandatoryOptions,
        ...newProps.value?.filter(({ label }: IOption) => !label?.toLowerCase().includes(selectInput?.toLowerCase()))
      ]);
    }
  };

  const customFilterOption = ({ value, label }: IOption, input: string) => {
    return (
      (value !== '*' && label.toLowerCase().includes(input.toLowerCase())) ||
      (newProps.selectAll !== false && value === '*' && filteredOptions?.length > 0)
    );
  };

  if (newProps.isSelectAll && newProps.options.length !== 0) {
    isAllSelected.current = filteredSelectedOptions.length === filteredOptions.length;
    if (filteredSelectedOptions?.length > 0) {
      if (filteredSelectedOptions?.length === filteredOptions?.length) {
        selectAllLabel.current = `All (${filteredOptions.length}) selected`;
      } else {
        selectAllLabel.current = `${filteredSelectedOptions?.length} / ${filteredOptions.length} selected`;
      }
    } else {
      selectAllLabel.current = 'Select all';
    }
    allOption.label = selectAllLabel.current;

    return (
      <div className={`d-flex flex-column ${styles.selectInputContainer}`}>
        {newProps.isShowLabel && !newProps.showOnlyDropdown && (
          <label className='mb-0dot5 fs-0dot875 lh-1dot25'>
            {newProps.label}
            {newProps.required && <span className='input-asterisk'>*</span>}
          </label>
        )}
        <ReactSelect
          {...newProps}
          className={`multi-select ${newProps.error ? 'danger' : ''}`}
          classNamePrefix='multi-select'
          inputValue={selectInput}
          onInputChange={onInputChange}
          onKeyDown={onKeyDown}
          options={[allOption, ...newProps.options]}
          placeholder={newProps.placeholder || ''}
          onChange={handleChange}
          components={{
            Option: multiOption,
            Input: multiSelectInput,
            ...newProps.components
          }}
          styles={{
            multiValueRemove: (base: any, removeProps: any) => {
              if (props.mandatoryOptions) {
                const newOptions = props.mandatoryOptions.map((v: any) => v.id);
                return newOptions.includes(removeProps.data.id) ? { ...base, display: 'none' } : base;
              } else if (props.optionsDisabled) {
                return { ...base, display: 'none' };
              } else {
                return props.isDisabled ? { ...base, display: 'none' } : base;
              }
            },
            control: (baseStyles, state) => ({
              ...baseStyles,
              ...newProps.controlStyles,
              borderColor: newProps.error ? 'red !important' : newProps?.controlStyles?.borderColor || '#8c8c8c',
              '&:focus': {
                borderColor: newProps.error ? 'red !important' : '#8c8c8c'
              },
              overflow: 'auto',
              maxHeight: '5.875rem',
              minHeight: '0.875rem'
            }),
            option: (optionStyles) => ({
              ...optionStyles,
              disabled: true,
              backgroundColor: 'white',
              color: 'black',
              ...newProps.optionStyles
            })
          }}
          filterOption={customFilterOption}
          menuPlacement={newProps.menuPlacement || 'auto'}
          isMulti={true}
          isClearable={false}
          closeMenuOnSelect={false}
          tabSelectsValue={true}
          backspaceRemovesValue={true}
          hideSelectedOptions={false}
          blurInputOnSelect={false}
        />
        <div className={styles.error}>
          {newProps.error} {newProps.error && newProps.errorLabel}
        </div>
      </div>
    );
  }

  return (
    <div className={`d-flex flex-column `}>
      {newProps.isShowLabel && !newProps.showOnlyDropdown && (
        <label className={`mb-0dot5 fs-0dot875 lh-1dot25 ${styles.labelCSS}`}>
          <span className={styles.labelCSS}>{newProps.label}</span>
          {newProps.required && <span className='input-asterisk'>*</span>}
        </label>
      )}
      <ReactSelect
        {...newProps}
        required={null}
        inputValue={selectInput}
        onInputChange={onInputChange}
        components={{
          Input: multiSelectInput,
          ...newProps.components
        }}
        menuPlacement={newProps.menuPlacement ?? 'auto'}
        onKeyDown={onKeyDown}
        tabSelectsValue={false}
        hideSelectedOptions={true}
        backspaceRemovesValue={false}
        blurInputOnSelect={true}
        styles={{
          control: (baseStyles, state) => {
            return {
              ...baseStyles,
              ...newProps.controlStyles,
              borderColor: newProps.error ? 'red !important' : newProps?.controlStyles?.borderColor || '#8c8c8c',
              '&:focus': {
                borderColor: newProps.error ? 'red !important' : '#8c8c8c'
              },
              overflow: 'auto',
              maxHeight: '5.875rem',
              minHeight: '0.875rem'
            };
          },
          placeholder: (defaultStyles) => ({
            ...defaultStyles,
            fontSize: '0.875rem'
          }),
          option: (optionStyles) => ({
            ...optionStyles,
            backgroundColor: 'white',
            color: 'black',
            ...newProps.optionStyles
          })
        }}
      />
      <div className={styles.error}>
        {newProps.error} {newProps.error && newProps.errorLabel}
      </div>
    </div>
  );
};

export default MultiSelect;
