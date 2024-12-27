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

/**
 * Converts options to the specified type
 * @param {string | string[]} labelKey - The key for the label
 * @param {string | string[]} valueKey - The key for the value
 * @param {any} options - The options to convert
 * @returns {any[]} The converted options
 */
const convertOptionType = (labelKey: string | string[], valueKey: string | string[], options: any): any[] =>
  labelKey && valueKey
    ? (options || []).map((option: any) => {
        return {
          ...option,
          label: Array.isArray(labelKey) ? option[labelKey[0]] + ' ' + option[labelKey[1]] : option?.[labelKey] || '',
          value: Array.isArray(valueKey) ? option[valueKey[0]] + ' ' + option[valueKey[1]] : option?.[valueKey] || ''
        };
      })
    : options;

/**
 * MultiSelect component
 * Renders a multi-select dropdown
 * @param {any} props - Component props
 * @returns {React.ReactElement} The rendered MultiSelect component
 */
const MultiSelect = (props: any): React.ReactElement => {
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

  /**
   * Filters options based on the input
   * @param {IOption[]} filters - The options to filter
   * @param {string} input - The input to filter by
   * @returns {IOption[]} The filtered options
   */
  const filterOptions = (filters: IOption[] = [], input: string): IOption[] =>
    filters &&
    filters
      ?.filter(({ label }: IOption) => label?.toLowerCase().includes(input?.toLowerCase()))
      .sort((a: any, b: any) => a.value - b.value);

  /**
   * Compares two options based on their values
   * @param {IOption} v1 - The first option
   * @param {IOption} v2 - The second option
   * @returns {number} The comparison result
   */
  const comparator = (v1: IOption, v2: IOption): number => (v1.value as number) - (v2.value as number);

  /**
   * Filters the options based on the input
   */
  const filteredOptions = filterOptions(newProps.options, selectInput);
  const filteredSelectedOptions = filterOptions(
    newProps?.value.filter((o: any) => filteredOptions.some((f) => f.value === o.id)),
    selectInput
  );

  // To auto select if only 1 option is available
  useEffect(() => {
    if (props.options?.length === 1 && props.required && props.isDefaultSelected) {
      setTimeout(() => {
        change(props.name, props.options);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.name, props.options, props.required]);

  /**
   * Renders the multi-select option
   * @param {any} multiSelectprops - The props for the multi-select option
   * @returns {React.ReactElement} The rendered multi-select option
   */
  const multiOption = (multiSelectprops: any): React.ReactElement => {
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

  /**
   * Renders the multi-select input
   * @param {any} selectProps - The props for the multi-select input
   * @returns {React.ReactElement} The rendered multi-select input
   */
  const multiSelectInput = ({ selectProps, children, ...inputProps }: any): React.ReactElement => (
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

  /**
   * Handles the input change
   * @param {string} inputValue - The input value
   * @param {any} event - The event object
   */
  const onInputChange = (inputValue: string, event: { action: InputAction }) => {
    if (event.action === 'set-value') {
      setSelectInput('');
    } else if (event.action === 'input-change') {
      setSelectInput(inputValue);
    } else if (event.action === 'menu-close' && selectInput !== '') {
      setSelectInput('');
    }
  };

  /**
   * Handles the key down event
   * @param {React.KeyboardEvent<HTMLElement>} e - The keyboard event
   */
  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((e.key === ' ' || e.key === 'Enter' || e.key === 'Space') && !selectInput) {
      e.preventDefault();
    }
  };

  /**
   * Filters the final options
   * @param {any} options - The options to filter
   * @returns {any[]} The filtered options
   */
  const filteredFinalOptions = (options: any): any[] =>
    [...options].filter((opt) =>
      (newProps.disabledOptions || []).length
        ? !newProps.disabledOptions.some((dOptions: any) => dOptions.id === opt.value)
        : true
    );
  /**
   * Handles the change event
   * @param {IOption[]} selected - The selected options
   * @param {any} actionMeta - The action meta
   */
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

  /**
   * Custom filter option
   * @param {IOption} value - The value of the option
   * @param {string} input - The input to filter by
   * @returns {boolean} Whether the option matches the input
   */
  const customFilterOption = ({ value, label }: IOption, input: string): boolean => {
    return (
      (value !== '*' && label.toLowerCase().includes(input.toLowerCase())) ||
      (newProps.selectAll !== false && value === '*' && filteredFinalOptions(filteredOptions)?.length > 0)
    );
  };

  /**
   * Multi-select styles
   */
  const multiSelectStyles = {
    multiValueRemove: (base: CSSObjectWithLabel, removeProps: any) => {
      if (props.mandatoryOptions) {
        const newOptions = props.mandatoryOptions.map((v: any) => v?.id);
        return newOptions.includes(removeProps.data.id) ? { ...base, display: 'none' } : base;
      } else if (props.optionsDisabled) {
        return { ...base, display: 'none' };
      } else {
        return removeProps.data.isFixed || props.isDisabled ? { ...base, display: 'none' } : base;
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

  /**
   * Renders the multi-select component
   */
  if (newProps.isSelectAll && newProps.options.length !== 0) {
    const newFilteredOptionsLength = (newProps.disabledOptions || []).length
      ? filteredOptions.length - newProps.disabledOptions.length
      : filteredOptions.length;
    isAllSelected.current =
      !!filteredSelectedOptions.length &&
      !!newFilteredOptionsLength &&
      filteredSelectedOptions.length === newFilteredOptionsLength;
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
      <div className={`d-flex flex-column ${styles.selectInputContainer}`} data-testid='multi-select'>
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
    <div className={`d-flex flex-column `} data-testid='multi-select'>
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
        isClearable={newProps.isClearable}
      />
      <div className={styles.error}>
        {newProps.error} {newProps.error && newProps.errorLabel}
      </div>
    </div>
  );
};

export default MultiSelect;
