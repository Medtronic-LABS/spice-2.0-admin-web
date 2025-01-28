import { Field } from 'react-final-form';
import SelectInput, { ISelectFormOptions } from '../../../../components/formFields/SelectInput';
import { composeValidators, formValidators } from '../../../../utils/validation';

/**
 * Renders the select field wrapper component based on the provided configuration.
 * @param {any} props - The props for the SelectFieldWrapper component
 */
const SelectFieldWrapper = ({
  form,
  isMulti,
  obj,
  name,
  inputProps,
  customOptions,
  customParseFn,
  customFormatFn,
  customValue,
  customError,
  autoSelect,
  isOptionDisabled,
  onChange,
  autoSelectValue
}: any) => {
  const options: any = customOptions || inputProps?.options || [];
  const parseFn = customParseFn ? customParseFn : (val: any) => val;
  const value = customValue ? customValue : null;
  const formatFn = customFormatFn ? customFormatFn : (val: any) => val;
  let object = { ...obj };
  return (
    <Field
      name={name || 'select'}
      type='select'
      parse={parseFn}
      formatOnBlur={true}
      format={formatFn}
      validate={inputProps?.disabledValidation ? () => null : composeValidators(...formValidators(inputProps))}
      render={({ input, meta }) => (
        <SelectInput
          {...(input as any)}
          label={inputProps?.label || ''}
          labelKey={inputProps?.labelKey || 'label'}
          isLabelButton={inputProps?.isLabelButton || false}
          valueKey={inputProps?.valueKey || 'key'}
          disabled={inputProps?.disabled}
          required={inputProps?.required || false}
          options={options}
          isMulti={isMulti}
          autoSelect={autoSelect}
          autoSelectValue={autoSelectValue}
          isOptionDisabled={isOptionDisabled}
          error={
            (meta.error && customError && customError.toString()) ||
            (meta.error && inputProps.error && inputProps.error + ' ' + inputProps?.label.toLowerCase()) ||
            (meta.error && meta.error + ' ' + inputProps?.label.toLowerCase())
          }
          input={{
            value,
            onChange: (nxtvalue: ISelectFormOptions) => {
              object = nxtvalue || {};
              obj = object;
            }
          }}
          onChange={(event) => (onChange ? onChange(event, input) : input.onChange(event))}
        />
      )}
    />
  );
};

export default SelectFieldWrapper;
