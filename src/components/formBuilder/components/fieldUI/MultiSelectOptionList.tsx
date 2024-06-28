import React, { useEffect, useState } from 'react';
import Select, { ActionMeta } from 'react-select';
import { Field } from 'react-final-form'; // Import Field
import styles from './../../styles/FormBuilder.module.scss';

interface Option {
  key: string;
  label: string;
}

interface MultiSelectOptionListProps {
  field: string;
  name: string;
  obj: any;
  form: any;
  inputProps: any;
  targetIds?: any;
  label?: string;
}

const MultiSelectOptionList: React.FC<MultiSelectOptionListProps> = ({ field, name, obj, form, inputProps, targetIds, label }) => {
  const [selectedValues, setSelectedValues] = useState<Option[]>(obj[field] || []);
  const options: Option[] = (targetIds || []).map((item: { key: string, label: string }) => ({
    value: item.key,
    label: item.label
  }));

  const handleChange = (selectedOptions: any, actionMeta: ActionMeta<Option>) => {
    const updatedSelectedValues = selectedOptions as Option[];
    setSelectedValues(updatedSelectedValues);
    form.mutators.setValue(name, updatedSelectedValues);
  };

  // Remove selected values that are no longer present in targetIds
  useEffect(() => {
    setSelectedValues((prevSelectedValues) => {
      return prevSelectedValues.filter((selectedValue: any) =>
        targetIds.find((targetId: { key: string }) => targetId.key === selectedValue.value)
      )
    });
  }, [targetIds.length, targetIds]);

  const validateSelectedValues = (value: Option[], selectedFields: any) => { // Pass selectedFields as an argument
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
                  border: meta.error ? '1px solid red': '1px solid grey',
                  boxShadow: 'none',
                  '&:hover': {
                      border: meta.error ? '1px solid red':'1px solid black',
                  }
              }),
              placeholder: (base) => ({
                ...base,
                fontSize: '14px',
              }),
              }}
            {...input}
            isMulti
            options={options}
            value={selectedValues}
            onChange={handleChange}
            placeholder="Select Fields to add to Collapsible"
          />
          {meta.error && <div className={styles.error}>{meta.error}</div>}
        </div>
      )}
    </Field>
  );
};

export default MultiSelectOptionList;
