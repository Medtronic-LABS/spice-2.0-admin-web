import { useState, useRef } from 'react';
import { default as ReactSelect, components, InputAction } from 'react-select';

import styles from './MultiSelect.module.scss';

export interface IOption {
  value: number | string;
  label: string;
}

const MultiSelect = (props: any) => {
  const options =
    props.labelKey && props.valueKey
      ? props.options.map((option: any) => ({
          ...option,
          label: option[props.labelKey],
          value: option[props.valueKey]
        }))
      : props.options;
  const [selectInput, setSelectInput] = useState<string>('');
  const isAllSelected = useRef<boolean>(false);
  const selectAllLabel = useRef<string>('Select all');
  const allOption = { value: '*', label: selectAllLabel.current };
  const filterOptions = (filters: IOption[], input: string) =>
    filters &&
    filters
      ?.filter(({ label }: IOption) => label?.toLowerCase().includes(input?.toLowerCase()))
      .sort((a: any, b: any) => a.value - b.value);

  const comparator = (v1: IOption, v2: IOption) => (v1.value as number) - (v2.value as number);

  const filteredOptions = filterOptions(options, selectInput);
  const filteredSelectedOptions = filterOptions(props?.value, selectInput);

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
      // e.preventDefault();
    }
  };

  const handleChange = (selected: IOption[]) => {
    if (
      selected.length > 0 &&
      !isAllSelected.current &&
      (selected[selected.length - 1].value === allOption.value ||
        JSON.stringify(filteredOptions) === JSON.stringify(selected.sort(comparator)))
    ) {
      return props.onChange(
        [
          ...(props.value || []),
          ...options?.filter(
            ({ label }: IOption) =>
              label.toLowerCase().includes(selectInput?.toLowerCase()) &&
              (props.value || []).filter((opt: IOption) => opt.label === label).length === 0
          )
        ].sort(comparator)
      );
    } else if (
      selected.length > 0 &&
      selected[selected.length - 1].value !== allOption.value &&
      JSON.stringify(selected.sort(comparator)) !== JSON.stringify(filteredOptions)
    ) {
      return props.onChange(selected);
    } else {
      return props.onChange([
        ...props.value?.filter(({ label }: IOption) => !label?.toLowerCase().includes(selectInput?.toLowerCase()))
      ]);
    }
  };

  const customFilterOption = ({ value, label }: IOption, input: string) => {
    return (
      (value !== '*' && label.toLowerCase().includes(input.toLowerCase())) ||
      (props.selectAll !== false && value === '*' && filteredOptions?.length > 0)
    );
  };

  if (props.isSelectAll && options.length !== 0) {
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
        {props.isShowLabel && !props.showOnlyDropdown && (
          <label className='mb-0dot5 fs-0dot875 lh-1dot25'>
            {props.label}
            {props.required && <span className='input-asterisk'>*</span>}
          </label>
        )}
        <ReactSelect
          {...props}
          className={`multi-select ${props.error ? 'danger' : ''}`}
          classNamePrefix='multi-select'
          inputValue={selectInput}
          onInputChange={onInputChange}
          onKeyDown={onKeyDown}
          options={[allOption, ...options]}
          placeholder={props.placeholder || ''}
          onChange={handleChange}
          components={{
            Option: multiOption,
            Input: multiSelectInput,
            ...props.components
          }}
          styles={{
            control: (baseStyles, state) => {
              return {
                ...baseStyles,
                ...props.controlStyles,
                borderColor: props.error ? 'red !important' : props?.controlStyles?.borderColor || '#8c8c8c',
                '&:focus': {
                  borderColor: props.error ? 'red !important' : '#8c8c8c'
                },
                overflow: 'auto',
                maxHeight: '5.875rem',
                minHeight: '0.875rem'
              };
            },
            option: (optionStyles) => ({
              ...optionStyles,
              backgroundColor: 'white',
              color: 'black',
              ...props.optionStyles
            })
          }}
          filterOption={customFilterOption}
          menuPlacement={props.menuPlacement || 'auto'}
          isMulti={true}
          isClearable={false}
          closeMenuOnSelect={false}
          tabSelectsValue={true}
          backspaceRemovesValue={true}
          hideSelectedOptions={false}
          blurInputOnSelect={false}
        />
        {
          <div className={styles.error}>
            {props.error} {props.error && props.errorLabel}
          </div>
        }
      </div>
    );
  }

  return (
    <div className={`d-flex flex-column `}>
      {props.isShowLabel && !props.showOnlyDropdown && (
        <label className={`mb-0dot5 fs-0dot875 lh-1dot25 ${styles.labelCSS}`}>
          <span className={styles.labelCSS}>{props.label}</span>
          {props.required && <span className='input-asterisk'>*</span>}
        </label>
      )}
      <ReactSelect
        {...props}
        inputValue={selectInput}
        onInputChange={onInputChange}
        components={{
          Input: multiSelectInput,
          ...props.components
        }}
        menuPlacement={props.menuPlacement ?? 'auto'}
        onKeyDown={onKeyDown}
        tabSelectsValue={false}
        hideSelectedOptions={true}
        backspaceRemovesValue={false}
        blurInputOnSelect={true}
      />
    </div>
  );
};

export default MultiSelect;
