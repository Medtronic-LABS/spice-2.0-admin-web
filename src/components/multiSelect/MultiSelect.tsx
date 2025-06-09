import {
  default as ReactSelect,
  components,
  InputAction,
  ControlProps,
  GroupBase,
  OptionProps,
  CSSObjectWithLabel
} from 'react-select';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import styles from './MultiSelect.module.scss';
import { useForm } from 'react-final-form';

// Interface for select options
export interface IOption {
  value: number | string;
  label: string;
}

// Converts raw options to standardized {label, value} format for react-select
const convertOptionType = (labelKey: string | string[], valueKey: string | string[], options: any): any[] =>
  labelKey && valueKey
    ? (options || []).map((option: any) => ({
        ...option,
        label: Array.isArray(labelKey) ? option[labelKey[0]] + ' ' + option[labelKey[1]] : option?.[labelKey] || '',
        value: Array.isArray(valueKey) ? option[valueKey[0]] + ' ' + option[valueKey[1]] : option?.[valueKey] || ''
      }))
    : options;

/**
 * MultiSelect - A performant, feature-rich multi-select dropdown with "Select All" support.
 * - Memoizes props, options, callbacks, and derived state to prevent infinite renders.
 * - Integrates with react-final-form.
 * - Supports filtering, disabling, and custom rendering of options.
 */
const MultiSelect = (props: any): React.ReactElement => {
  const { change } = useForm();
  const menuPortalTargetRef = useRef<HTMLElement | null>(null);

  // Memoize props and derived options/values for performance and to prevent infinite renders
  const newProps = useMemo(
    () => ({
      ...props,
      value: convertOptionType(props.labelKey, props.valueKey, Array.isArray(props.value) ? props.value : []),
      options: convertOptionType(props.labelKey, props.valueKey, Array.isArray(props.options) ? props.options : [])
    }),
    [props]
  );

  const [selectInput, setSelectInput] = useState<string>('');

  // Set menu portal target to modal if in modal context (for correct dropdown rendering)
  useEffect(() => {
    if (props.isModel && !menuPortalTargetRef.current) {
      const modalElement = document.body.getElementsByClassName('modal-show')[0];
      if (modalElement instanceof HTMLElement) {
        menuPortalTargetRef.current = modalElement;
      }
    }
  }, [props.isModel]);

  // Filters options by input value (case-insensitive, sorted numerically by value)
  const filterOptions = useCallback(
    (filters: IOption[] = [], input: string): IOption[] =>
      filters &&
      filters
        ?.filter(({ label }: IOption) => label?.toLowerCase().includes(input?.toLowerCase()))
        .sort((a: any, b: any) => (a.value as number) - (b.value as number)),
    []
  );

  // Numeric comparator for option values
  const comparator = useCallback((v1: IOption, v2: IOption): number => (v1.value as number) - (v2.value as number), []);

  // Memoized filtered options based on input
  const memoizedFilteredOptions = useMemo(
    () => filterOptions(newProps.options, selectInput),
    [newProps.options, selectInput, filterOptions]
  );

  // Memoized filtered selected options (selected options that are also in filtered options)
  const memoizedFilteredSelectedOptions = useMemo(
    () =>
      filterOptions(
        newProps?.value.filter((o: any) => memoizedFilteredOptions.some((f) => f.value === o.id)),
        selectInput
      ),
    [newProps.value, memoizedFilteredOptions, selectInput, filterOptions]
  );

  // Number of selectable (not disabled) filtered options
  const newFilteredOptionsLength = useMemo(
    () =>
      (newProps.disabledOptions || []).length
        ? memoizedFilteredOptions.length - newProps.disabledOptions.length
        : memoizedFilteredOptions.length,
    [newProps.disabledOptions, memoizedFilteredOptions.length]
  );

  // True if all filtered options are selected
  const isAllSelectedValue = useMemo(
    () =>
      !!memoizedFilteredSelectedOptions.length &&
      !!newFilteredOptionsLength &&
      memoizedFilteredSelectedOptions.length === newFilteredOptionsLength,
    [memoizedFilteredSelectedOptions.length, newFilteredOptionsLength]
  );

  // Dynamic label for the "Select All" option
  const selectAllLabelValue = useMemo(() => {
    if (!newProps.isSelectAll || newProps.options.length === 0) {
      return 'Select all';
    }
    if (memoizedFilteredSelectedOptions?.length > 0) {
      if (memoizedFilteredSelectedOptions?.length === newFilteredOptionsLength) {
        return `All (${newFilteredOptionsLength}) selected`;
      }
      return `${memoizedFilteredSelectedOptions?.length} / ${newFilteredOptionsLength} selected`;
    }
    return 'Select all';
  }, [
    newProps.isSelectAll,
    newProps.options.length,
    memoizedFilteredSelectedOptions?.length,
    newFilteredOptionsLength
  ]);

  // Memoized "Select All" option object
  const allOption = useMemo(
    () => ({
      value: '*',
      label: selectAllLabelValue
    }),
    [selectAllLabelValue]
  );

  // Auto-select the only option if required (for required fields with a single option)
  useEffect(() => {
    if (props.options?.length === 1 && props.required && props.isDefaultSelected) {
      setTimeout(() => {
        change(props.name, props.options);
      }, 0);
    }
  }, [props.name, props.options, props.required, props.isDefaultSelected, change]);

  // Custom option rendering: handles checkboxes for multi-select and "Select All"
  const multiOption = useCallback(
    (multiSelectprops: any): React.ReactElement => {
      const isChecked = !(newProps.disabledOptions || []).some((v: any) => v.id === multiSelectprops.value);
      const isDisabled = !![...(newProps.disabledOptions || [])].some((v: any) => v.id === multiSelectprops.value);
      return (
        <components.Option {...multiSelectprops}>
          <div className='d-flex align-items-baseline h-100'>
            {multiSelectprops.value === '*' && !isAllSelectedValue && memoizedFilteredSelectedOptions?.length > 0 ? (
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
                checked={isChecked && (multiSelectprops.isSelected || isAllSelectedValue)}
                onChange={() => {
                  /* No action needed */
                }}
              />
            )}
            <label style={{ marginLeft: '5px' }}>{multiSelectprops.label}</label>
          </div>
        </components.Option>
      );
    },
    [newProps.disabledOptions, isAllSelectedValue, memoizedFilteredSelectedOptions?.length]
  );

  // Custom input rendering for multi-select (handles input height for filtering)
  const multiSelectInput = useCallback(
    ({ selectProps, children, ...inputProps }: any): React.ReactElement => (
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
    ),
    [selectInput.length]
  );

  // Handles input changes for filtering
  const onInputChange = useCallback(
    (inputValue: string, event: { action: InputAction }) => {
      if (event.action === 'set-value') {
        setSelectInput('');
      } else if (event.action === 'input-change') {
        setSelectInput(inputValue);
      } else if (event.action === 'menu-close' && selectInput !== '') {
        setSelectInput('');
      }
    },
    [selectInput]
  );

  // Handles keyboard navigation (prevents default on space/enter if no input)
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if ((e.key === ' ' || e.key === 'Enter' || e.key === 'Space') && !selectInput) {
        e.preventDefault();
      }
    },
    [selectInput]
  );

  // Returns options excluding disabled ones
  const filteredFinalOptions = useCallback(
    (optionsToFilter: any): any[] =>
      [...optionsToFilter].filter((opt) =>
        (newProps.disabledOptions || []).length
          ? !newProps.disabledOptions.some((dOptions: any) => dOptions.id === opt.value)
          : true
      ),
    [newProps.disabledOptions]
  );

  // Handles selection changes, including "Select All" logic
  const handleChange = useCallback(
    (selected: IOption[], actionMeta: any) => {
      // If "Select All" is clicked or all filtered options are selected
      if (
        selected.length > 0 &&
        !isAllSelectedValue &&
        (selected[selected.length - 1]?.value === allOption.value ||
          JSON.stringify(filteredFinalOptions(memoizedFilteredOptions)) === JSON.stringify(selected.sort(comparator)))
      ) {
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
        JSON.stringify(selected.sort(comparator)) !== JSON.stringify(filteredFinalOptions(memoizedFilteredOptions))
      ) {
        // Regular multi-select
        return newProps.onChange(selected, actionMeta);
      } else {
        // "Select All" unclicked (deselect all except mandatory)
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
    },
    [
      isAllSelectedValue,
      allOption.value,
      filteredFinalOptions,
      memoizedFilteredOptions,
      newProps,
      props?.mandatoryOptions,
      selectInput,
      comparator
    ]
  );

  // Custom filter for react-select (handles "Select All" and regular filtering)
  const customFilterOption = useCallback(
    ({ value, label }: IOption, input: string): boolean =>
      (value !== '*' && label.toLowerCase().includes(input.toLowerCase())) ||
      (newProps.isSelectAll !== false && value === '*' && filteredFinalOptions(memoizedFilteredOptions)?.length > 0),
    [newProps.isSelectAll, filteredFinalOptions, memoizedFilteredOptions]
  );

  // Memoized react-select styles (handles disabled, error, and custom styles)
  const multiSelectStyles = useMemo(
    () => ({
      multiValueRemove: (base: CSSObjectWithLabel, removeProps: any) => {
        if (props.mandatoryOptions) {
          const newMandatoryOptions = props.mandatoryOptions.map((v: any) => v?.id);
          return newMandatoryOptions.includes(removeProps.data.id) ? { ...base, display: 'none' } : base;
        }
        if (props.optionsDisabled) {
          return { ...base, display: 'none' };
        }
        return removeProps.data.isFixed || props.isDisabled ? { ...base, display: 'none' } : base;
      },
      control: (baseStyles: any, state: ControlProps<unknown, false, GroupBase<unknown>>) => ({
        ...baseStyles,
        ...newProps.controlStyles,
        backgroundColor: props.isDisabled ? '#fcfbf8' : baseStyles.backgroundColor,
        boxShadow: state.isFocused ? 'inset 0px 4px 8px rgba(0,0,0, 0.1) !important' : 'none',
        borderColor: newProps.error ? 'red !important' : state.isFocused ? '#595959' : '#8c8c8c',
        '&:hover': { borderColor: '#595959' },
        '&:focus': { borderColor: newProps.error ? 'red !important' : '#8c8c8c' },
        overflow: 'auto',
        maxHeight: '5.875rem',
        minHeight: '2.5rem'
      }),
      option: (optionStyles: CSSObjectWithLabel, optionProps: OptionProps<unknown, false, GroupBase<unknown>>) => ({
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
      })
    }),
    [
      props.mandatoryOptions,
      props.optionsDisabled,
      props.isDisabled,
      newProps.controlStyles,
      newProps.error,
      newProps.optionStyles,
      newProps.disabledOptions
    ]
  );

  // Prepares options for react-select, including "Select All" if enabled
  const optionsForReactSelect = useMemo(
    () => (newProps.isSelectAll && newProps.options.length !== 0 ? [allOption, ...newProps.options] : newProps.options),
    [newProps.isSelectAll, newProps.options, allOption]
  );

  // Main select input (react-select with all customizations)
  const mainContent = (
    <ReactSelect
      {...newProps}
      className={`multi-select ${newProps.error ? 'danger' : ''}`}
      classNamePrefix='multi-select'
      inputValue={selectInput}
      onInputChange={onInputChange}
      onKeyDown={onKeyDown}
      required={false}
      isDisabled={props.isDisabled}
      options={optionsForReactSelect}
      placeholder={newProps.placeholder || ''}
      menuPortalTarget={menuPortalTargetRef.current}
      menuPosition='fixed'
      menuPlacement={newProps.menuPlacement || 'auto'}
      menuShouldScrollIntoView={false}
      onChange={handleChange}
      components={{
        Option: multiOption,
        Input: multiSelectInput,
        ...newProps.components
      }}
      styles={{
        ...multiSelectStyles,
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999
        })
      }}
      filterOption={customFilterOption}
      isMulti={true}
      isClearable={newProps.isClearable === undefined ? false : newProps.isClearable}
      closeMenuOnSelect={false}
      tabSelectsValue={true}
      backspaceRemovesValue={false}
      hideSelectedOptions={false}
      blurInputOnSelect={false}
    />
  );

  // Main render: label, select, and error display
  return (
    <div
      className={`d-flex flex-column ${newProps.showOnlyDropdown ? '' : styles.selectInputContainer}`}
      data-testid='multi-select'
    >
      {newProps.isShowLabel && !newProps.showOnlyDropdown && (
        <label className={`mb-0dot5 fs-0dot875 lh-1dot25 ${styles.labelCSS}`}>
          <span className={styles.labelCSS}>{newProps.label}</span>
          {newProps.required && <span className='input-asterisk'>*</span>}
        </label>
      )}
      {mainContent}
      <div className={styles.error}>
        {newProps.error} {newProps.error && newProps.errorLabel}
      </div>
    </div>
  );
};

export default MultiSelect;
