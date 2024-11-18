import React, { useEffect, useState } from 'react';
import Select, { ActionMeta } from 'react-select';
import { Field } from 'react-final-form'; // Import Field
import styles from './../../styles/FormBuilder.module.scss';

interface IOption {
  key: string;
  label: string;
}

interface IMultiSelectOptionListProps {
  field: string;
  name: string;
  obj: any;
  form: any;
  inputProps: any;
  targetIds?: any;
  label?: string;
}

/**
 * Renders the multi-select option list component based on the provided configuration.
 * @param {any} props - The props for the MultiSelectOptionList component
 */
const MultiSelectOptionList: React.FC<IMultiSelectOptionListProps> = ({
  field,
  name,
  obj,
  form,
  inputProps,
  targetIds,
  label
}) => {
  const [selectedValues, setSelectedValues] = useState<IOption[]>(obj[field] || []);
  const options: IOption[] = (targetIds || []).map((item: { key: string; label: string }) => ({
    value: item.key,
    label: item.label
  }));

  /**
   * Handles the change in the selected values based on the provided configuration.
   */
  const handleChange = (selectedOptions: any, actionMeta: ActionMeta<IOption>) => {
    const updatedSelectedValues = selectedOptions as IOption[];
    setSelectedValues(updatedSelectedValues);
    form.mutators.setValue(name, updatedSelectedValues);
  };

  /**
   * Removes the selected values that are no longer present in targetIds based on the provided configuration.
   */
  useEffect(() => {
    setSelectedValues((prevSelectedValues) => {
      return prevSelectedValues.filter((selectedValue: any) =>
        targetIds?.find((targetId: { key: string }) => targetId.key === selectedValue.value)
      );
    });
  }, [targetIds?.length, targetIds]);

  const validateSelectedValues = (value: IOption[], selectedFields: any) => {
    // Pass selectedFields as an argument
    if (!value || value.length === 0) {
      // All selected options are removed
      return 'Please select at least one option.';
    }
    return undefined; // No error
  };

  return (
    <Field
      name={name}
      validate={(value) => validateSelectedValues(value, targetIds)} // Pass targetIds as well
    >
      {({ input, meta }) => (
        <div className={styles.multiSelect}>
          {label && <label htmlFor={name}>{label}</label>}
          {<span className='input-asterisk'>*</span>}
          <Select
            styles={{
              control: (base) => ({
                ...base,
                border: meta.error ? '1px solid red' : '1px solid grey',
                boxShadow: 'none',
                '&:hover': {
                  border: meta.error ? '1px solid red' : '1px solid black'
                }
              }),
              placeholder: (base) => ({
                ...base,
                fontSize: '14px'
              })
            }}
            {...input}
            isMulti={true}
            options={options}
            value={selectedValues}
            onChange={handleChange}
            placeholder='Select Fields to add to Collapsible'
          />
          {meta.error && <div className={styles.error}>{meta.error}</div>}
        </div>
      )}
    </Field>
  );
};

export default MultiSelectOptionList;
