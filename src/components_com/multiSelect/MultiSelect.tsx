import {
  default as ReactSelect,
  components,
  InputAction,
  ControlProps,
  GroupBase,
  OptionProps,
  CSSObjectWithLabel
} from 'react-select';
import { useState, useRef, useEffect } from 'react';
import styles from './MultiSelect.module.scss';
import { useForm } from 'react-final-form';

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
  const { change } = useForm();
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
  const filteredSelectedOptions = filterOptions(
    newProps?.value.filter((o: any) => filteredOptions.some((f) => f.value === o.id)),
    selectInput
  );

  // To auto select if only 1 option is available
  useEffect(() => {
    if (props.options.length === 1 && props.required && props.isDefaultSelected) {
      setTimeout(() => {
        change(props.name, props.options);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.name, props.options, props.required]);

  const multiOption = (multiSelectprops: any) => {
    const isChecked = !(newProps.disabledOptions || []).some((v: any) => v.id === multiSelectprops.value);
    const isDisabled = !![...(newProps.disabledOptions || [])].some((v: any) => v.id === multiSelectprops.value);
    return (
      <components.Option {...multiSelectprops}>
        <div className='d-flex align-items-baseline h-100'>
          {multiSelectprops.value === '*' && !isAllSelected.current && filteredSelectedOptions?.length > 0 ? (
            <input
              key={multiSelectprops.value}
              type='checkbox'
              disabled={isDisabled}
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
              disabled={isDisabled}
              checked={isChecked && (multiSelectprops.isSelected || isAllSelected.current)}
              onChange={() => {
                /* No action needed */
              }}
            />
          )}
          <label style={{ marginLeft: '5px' }}>{multiSelectprops.label}</label>
        </div>
      </components.Option>
    );
  };

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

  const filteredFinalOptions = (options: any) =>
    [...options].filter((opt) =>
      (newProps.disabledOptions || []).length
        ? !newProps.disabledOptions.some((dOptions: any) => dOptions.id === opt.value)
        : true
    );
  const handleChange = (selected: IOption[], actionMeta: any) => {
    if (
      selected.length > 0 &&
      !isAllSelected.current &&
      (selected[selected.length - 1]?.value === allOption.value ||
        JSON.stringify(filteredFinalOptions(filteredOptions)) === JSON.stringify(selected.sort(comparator)))
    ) {
      // Select All clicked
      return newProps.onChange(
        [
          ...(newProps.value || []),
          ...filteredFinalOptions(newProps.options || [])?.filter(
            ({ label }: IOption) =>
              label.toLowerCase().includes(selectInput?.toLowerCase()) &&
              (newProps.value || []).filter((opt: IOption) => opt.label === label).length === 0
          )
        ].sort(comparator),
        actionMeta
      );
    } else if (
      selected.length > 0 &&
      selected[selected.length - 1].value !== allOption.value &&
      JSON.stringify(selected.sort(comparator)) !== JSON.stringify(filteredFinalOptions(filteredOptions))
    ) {
      // Each role selected
      return newProps.onChange(selected, actionMeta);
    } else {
      // Select All unclicked
      return newProps.onChange(
        [
          ...(props?.mandatoryOptions || []),
          ...(newProps.value || [])?.filter(
            ({ label }: IOption) => !label?.toLowerCase().includes(selectInput?.toLowerCase())
          )
        ],
        actionMeta
      );
    }
  };

  const customFilterOption = ({ value, label }: IOption, input: string) => {
    return (
      (value !== '*' && label.toLowerCase().includes(input.toLowerCase())) ||
      (newProps.selectAll !== false && value === '*' && filteredFinalOptions(filteredOptions)?.length > 0)
    );
  };

  const multiSelectStyles = {
    multiValueRemove: (base: CSSObjectWithLabel, removeProps: any) => {
      if (props.mandatoryOptions) {
        const newOptions = props.mandatoryOptions.map((v: any) => v.id);
        return newOptions.includes(removeProps.data.id) ? { ...base, display: 'none' } : base;
      } else if (props.optionsDisabled) {
        return { ...base, display: 'none' };
      } else {
        return props.isDisabled ? { ...base, display: 'none' } : base;
      }
    },
    control: (baseStyles: any, state: ControlProps<unknown, false, GroupBase<unknown>>) => ({
      ...baseStyles,
      ...newProps.controlStyles,
      boxShadow: state.isFocused ? 'inset 0px 4px 8px rgba(0,0,0, 0.1) !important' : 'none',
      borderColor: newProps.error ? 'red !important' : state.isFocused ? '#595959' : '#8c8c8c',
      '&:hover': {
        borderColor: '#595959'
      },
      '&:focus': {
        borderColor: newProps.error ? 'red !important' : '#8c8c8c'
      },
      overflow: 'auto',
      maxHeight: '5.875rem',
      minHeight: '2.5rem'
    }),
    option: (optionStyles: CSSObjectWithLabel, optionProps: OptionProps<unknown, false, GroupBase<unknown>>) => {
      return {
        ...optionStyles,
        ...newProps.optionStyles,
        disabled: true,
        fontSize: '14px',
        backgroundColor:
          optionProps.isDisabled &&
          (newProps.disabledOptions || []).some((v: any) => v.id === (optionProps as any).value)
            ? '#e6e6e6'
            : optionProps.isFocused
            ? '#DEEBFF'
            : 'white',
        color: optionProps.isDisabled ? 'grey' : '#212529'
      };
    }
  };

  if (newProps.isSelectAll && newProps.options.length !== 0) {
    const newFilteredOptionsLength = (newProps.disabledOptions || []).length
      ? filteredOptions.length - newProps.disabledOptions.length
      : filteredOptions.length;
    isAllSelected.current = filteredSelectedOptions.length === newFilteredOptionsLength;
    if (filteredSelectedOptions?.length > 0) {
      if (filteredSelectedOptions?.length === newFilteredOptionsLength) {
        selectAllLabel.current = `All (${newFilteredOptionsLength}) selected`;
      } else {
        selectAllLabel.current = `${filteredSelectedOptions?.length} / ${newFilteredOptionsLength} selected`;
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
          required={null}
          options={[allOption, ...newProps.options]}
          placeholder={newProps.placeholder || ''}
          menuPortalTarget={props.isModel ? document.body.getElementsByClassName('modal-show')[0] : false}
          onChange={handleChange}
          components={{
            Option: multiOption,
            Input: multiSelectInput,
            ...newProps.components
          }}
          styles={multiSelectStyles}
          filterOption={customFilterOption}
          menuPlacement={newProps.menuPlacement || 'auto'}
          isMulti={true}
          isClearable={false}
          closeMenuOnSelect={false}
          tabSelectsValue={true}
          backspaceRemovesValue={false}
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
        menuPortalTarget={props.isModel ? document.body.getElementsByClassName('modal-show')[0] : false}
        onKeyDown={onKeyDown}
        tabSelectsValue={false}
        hideSelectedOptions={true}
        backspaceRemovesValue={false}
        blurInputOnSelect={true}
        styles={multiSelectStyles}
      />
      <div className={styles.error}>
        {newProps.error} {newProps.error && newProps.errorLabel}
      </div>
    </div>
  );
};

export default MultiSelect;
