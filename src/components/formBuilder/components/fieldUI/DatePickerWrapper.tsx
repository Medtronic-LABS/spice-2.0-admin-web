import { Field } from 'react-final-form';
import { composeValidators, formValidators } from '../../../../utils/validation';
import DatePickerComponent from '../../../datePicker/DatePicker';
import { convertDate } from '../../../../utils/commonUtils';

/**
 * Renders the date picker wrapper component based on the provided configuration.
 * @param {any} props - The props for the DatePickerWrapper component
 */
const DatePickerWrapper = ({
  name,
  inputProps,
  customParseFn,
  customValue,
  customError,
  customOnBlurFn,
  fieldName,
  obj,
  capitalize = false
}: any) => {
  const parseFn = customParseFn ? customParseFn : (val: any) => val;
  const value = customValue ? customValue : null;
  return (
    <Field
      name={name || 'date'}
      parse={parseFn}
      type='date'
      value={value}
      validate={inputProps?.disabledValidation ? () => null : composeValidators(...formValidators(inputProps || {}))}
    >
      {({ input, meta }) => (
        <>
          <DatePickerComponent
            {...(input as any)}
            label={inputProps?.label}
            isShowLabel={true}
            errorLabel={inputProps?.label?.toLowerCase()}
            onChange={(date: Date) => {
              const selectedDate = convertDate(date);
              input.onChange(selectedDate);
            }}
            todayButton={true}
            error={meta.error && meta.touched && !!new Date(input.value)}
          />
        </>
      )}
    </Field>
  );
};

export default DatePickerWrapper;
