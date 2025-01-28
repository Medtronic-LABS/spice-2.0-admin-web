import { useCallback, useEffect, useRef } from 'react';
import { Field } from 'react-final-form';
import { useParams } from 'react-router-dom';
import Checkbox from '../../../components/formFields/Checkbox';
import { camel2Title, containsOnlyLettersAndNumbers } from '../../../utils/validation';
import { InputTypes } from '../labTestConfig/BaseFieldConfig';
import { resultSwitch } from '../utils/FieldUtils';
import { isEditableFields, unitMeasurementFields } from '../utils/CustomizationFieldUtils';
import ConditionConfig from './fieldUI/ConditionConfig';
import RangesConfig from './fieldUI/RangesConfig';
import OptionList from './fieldUI/OptionList';
import SelectFieldWrapper from './fieldUI/SelectFieldWrapper';
import TextFieldWrapper from './fieldUI/TextFieldWrapper';
import MultiSelectOptionList from './fieldUI/MultiSelectOptionList';
import DatePickerWrapper from './fieldUI/DatePickerWrapper';
import { unitsSelector } from '../../../store/labTest/selectors';
import { useSelector } from 'react-redux';
import TextInputArray from './fieldUI/TextInputArray';
import Questionnaire from './fieldUI/Questionnaire';

interface IMatchParams {
  form: string;
}

const filterByGetMetaViewTypes: { [K: string]: string[] } = {
  RadioGroup: ['checkbox', 'radio']
};

/**
 * Gets the components by field name based on the provided configuration.
 * @param {string} fieldName - The name of the field
 * @param {any} obj - The object containing the field configuration
 * @param {boolean} [isNew] - Whether the field is new
 * @param {boolean} [isFieldNameChangable] - Whether the field name is changable
 * @param {boolean} [isCustomizationForm] - Whether the form is a customization form
 * @param {boolean} [isWorkFlowCustomization] - Whether the form is a workflow customization form
 */
const getComponentsByFieldName = (
  fieldName: string,
  obj: any,
  isNew?: boolean,
  isFieldNameChangable?: boolean,
  isCustomizationForm?: boolean,
  isWorkFlowCustomization?: boolean
) => {
  let inputProps = {};
  if (fieldName === 'fieldName') {
    inputProps = { ...inputProps, ...{ component: !isNew || isFieldNameChangable ? 'TEXT_FIELD' : 'SELECT_INPUT' } };
  }
  if (fieldName === 'isResult') {
    inputProps = { ...inputProps, ...{ disabled: true } };
    obj.isResult = true;
  }
  // disabled fields based on run time conditions
  if (!isNew && (fieldName === 'fieldName' || fieldName === 'inputType')) {
    inputProps = { ...inputProps, ...{ disabled: true } };
  }
  if (
    obj.fieldName === 'TestedOn' &&
    obj.orderId === 1 &&
    ['fieldName', 'isMandatory', 'isEnabled', 'visibility', 'title', 'maxDays', 'disableFutureDate'].includes(fieldName)
  ) {
    inputProps = { ...inputProps, ...{ disabled: true } };
  }
  if (['maxDays'].includes(fieldName) && obj?.disableFutureDate) {
    inputProps = { ...inputProps, disabled: true };
  }
  // disable fields for customization
  if (isCustomizationForm && !isWorkFlowCustomization) {
    if (
      (obj?.isNeededDefault && ['isMandatory', 'visibility', 'isEnabled'].includes(fieldName)) ||
      ['fieldName', 'title', 'optionsList', 'inputType'].includes(fieldName)
    ) {
      inputProps = { ...inputProps, ...{ disabled: true } };
    }
  }
  return inputProps;
};

interface IComponentProps {
  form?: any;
  name: string;
  fieldName: string;
  inputProps: any;
  obj?: any;
  targetIds?: any[];
  newlyAddedIds?: any[];
  unAddedFields?: any[];
  handleUpdateFieldName?: (
    familyName: string,
    currentFieldID: string,
    newFieldName: string,
    newFieldLabel: string,
    currentTitle: string,
    onlyCallBack: boolean,
    callBack?: (formValues: any) => void
  ) => void;
  hashFieldIdsWithTitle?: any;
  hashFieldIdsWithFieldName?: any;
  addNewFieldDisabled?: boolean;
  isFieldNameChangable?: boolean;
  codeRef?: React.MutableRefObject<string>;
  urlRef?: React.MutableRefObject<string>;
  input?: any;
  isCustomizationForm?: boolean;
}

/**
 * Renders a checkbox component.
 * @param {IComponentProps} props - The props for the CheckboxComponent
 */
export const CheckboxComponent = ({
  form,
  name,
  fieldName,
  inputProps = {},
  obj,
  isCustomizationForm
}: IComponentProps) => {
  const checkBoxChange = useCallback(
    (isChecked: boolean) => {
      if (fieldName === 'isResult') {
        resultSwitch(Number(obj.inputType), obj, isChecked);
      }
    },
    [fieldName, obj]
  );

  /**
   * Handles the disable future date logic
   */
  useEffect(() => {
    if (obj?.disableFutureDate) {
      // For old records
      if (!obj.minDays) {
        form.change(`${name}.minDays`, null);
      }
      form.change(`${name}.maxDays`, null);
    }
  }, [obj?.disableFutureDate, obj.minDays, form, name]);

  /**
   * Checks the checkbox change
   */
  useEffect(() => {
    checkBoxChange(obj?.isResult);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      data-testid='checkbox-component'
      className={`col-sm-4 ${
        fieldName === 'disableFutureDate'
          ? isCustomizationForm
            ? 'col-4'
            : 'col-12 col-md-6 col-lg-4 col-xl-3'
          : 'col-lg-2'
      }`}
    >
      <div className='h-100 d-flex align-item-center py-1'>
        <Field
          name={`${name}.${fieldName}`}
          type='checkbox'
          render={({ input }) => (
            <Checkbox
              disabled={inputProps?.disabled}
              readOnly={inputProps?.disabled}
              switchCheckbox={false}
              label={inputProps?.label}
              {...input}
              onChange={(e: any) => {
                if (fieldName === 'isResult') {
                  checkBoxChange(e.target.checked);
                }
                input.onChange(e);
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

/**
 * Renders a select input component.
 * @param {IComponentProps} props - The props for the SelectInputValues component
 */
export const SelectInputValues = ({
  name,
  fieldName,
  inputProps,
  obj,
  newlyAddedIds,
  unAddedFields,
  handleUpdateFieldName,
  isCustomizationForm
}: IComponentProps) => {
  const unitsList = useSelector(unitsSelector);
  let options: any = inputProps?.options || [];
  let parseFn = (val: any) => val;
  let value = obj[fieldName] || null;
  let autoSelectValue = null;

  // parse as number
  if (fieldName === 'orientation') {
    options = inputProps?.options;
    parseFn = (val: any) => Number(val?.key);
    value = options?.find(({ key }: any) => obj[fieldName] === Number(key)) || null;
  }
  // parse as string
  if (
    fieldName === 'visibility' ||
    fieldName === 'family' ||
    fieldName === 'totalCount' ||
    fieldName === 'mandatoryCount'
  ) {
    options = inputProps?.options;
    parseFn = (val: any) => val?.key;
    value = options?.find(({ key }: any) => obj[fieldName] === key) || null;
  }
  // parse with custom key
  if (fieldName === 'defaultValue') {
    options = obj.optionsList;
    parseFn = (val: any) => val?.id;
    value = options?.find(({ id }: any) => obj[fieldName] === id) || null;
  }
  if (fieldName === 'unitList') {
    options = unitsList || [];
    parseFn = (val: any) => {
      const units = val.map((unit: any) => ({ name: unit.name, id: unit.name }));
      return inputProps.isMulti ? units : val?.name;
    };
  }
  if (fieldName === 'resource') {
    options = inputProps?.options[obj?.viewType === 'Spinner' ? InputTypes.DEFAULT : obj?.inputType] || [];
    parseFn = (val: any) => val?.key;
    value = options?.find(({ key: resource }: any) => obj[fieldName] === resource) || null;
    autoSelectValue = options.length === 1 ? options[0]?.key : null;
  }
  // parse with custom logic
  if (fieldName === 'inputType') {
    options = inputProps?.options;
    parseFn = (val: any) => {
      resultSwitch(Number(val?.key), obj, obj.isResult);
      return Number(val?.key);
    };
    value = options?.find(({ key }: any) => obj[fieldName] === Number(key)) || {
      key: -1,
      label: 'Text'
    };
  }
  // parse with custom options list
  if (fieldName === 'fieldName') {
    const { customOptions, customParseFn, customValue } = customOptionsList(
      fieldName,
      obj,
      newlyAddedIds,
      unAddedFields,
      handleUpdateFieldName
    );
    options = customOptions;
    parseFn = customParseFn;
    value = customValue;
  }
  return (
    <div
      className={`${isCustomizationForm ? 'col-4' : 'col-12 col-md-6 col-lg-4 col-xl-3'}`}
      data-testid='select-field-wrapper'
    >
      <SelectFieldWrapper
        name={name}
        customValue={value}
        customOptions={options}
        customParseFn={parseFn}
        inputProps={inputProps}
        isMulti={inputProps?.isMulti}
        autoSelectValue={autoSelectValue}
      />
    </div>
  );
};

/**
 * Custom options list for the select input
 * @param {string} fieldName - The name of the field
 * @param {any} obj - The object containing the field configuration
 * @param {any[]} [newlyAddedIds] - The newly added ids
 * @param {any[]} [unAddedFields] - The unadded fields
 * @param {any} [handleUpdateFieldName] - The function to handle the update field name
 */
const customOptionsList = (
  fieldName: string,
  obj: any,
  newlyAddedIds?: any[],
  unAddedFields?: any[],
  handleUpdateFieldName?: any
) => {
  // Ignore current field id
  const newlyAddedFieldIds: any = (newlyAddedIds || []).filter((fieldId: string) => fieldId !== obj.id);
  // filter newly added fields from allowed fields
  const filteredOptions = (unAddedFields || []).filter((item: any) => !newlyAddedFieldIds.includes(item.key));
  // filter allowed fields based on getMeta types
  const customOptions = filteredOptions.filter(({ type }: { type: any }) =>
    Object.keys(filterByGetMetaViewTypes).includes(obj?.viewType)
      ? filterByGetMetaViewTypes[obj?.viewType].includes(type)
      : !([].concat(...(Object.values(filterByGetMetaViewTypes) as any[])) as any[]).includes(type)
  );
  /**
   * Custom parse function for the select input
   */
  const customParseFn = (val: any) => {
    if (val?.label && val?.label !== obj[fieldName] && handleUpdateFieldName) {
      handleUpdateFieldName(obj.family, obj.id, val.key, val.label);
    }
    return val?.label;
  };
  const customValue = customOptions?.find(({ label }: any) => obj[fieldName] === label);
  return { customOptions, customParseFn, customValue };
};

/**
 * Renders a text field component.
 * @param {IComponentProps} props - The props for the TextFieldComponent
 */
export const TextFieldComponent = ({
  form,
  name,
  fieldName,
  obj,
  inputProps,
  targetIds,
  handleUpdateFieldName,
  hashFieldIdsWithFieldName,
  hashFieldIdsWithTitle,
  isFieldNameChangable,
  isCustomizationForm
}: IComponentProps) => {
  /**
   * Parse function for the text field
   */
  let parseFn = (value: any) => value;
  let capitalize = false;
  /**
   * Custom on blur function for the text field
   */
  let customOnBlurFn = (value: any) => value;
  /**
   * Filters the duplicates for the field name
   */
  const filterDuplicates = () => {
    const otherFieldNames: any = [];
    Object.entries(hashFieldIdsWithFieldName).forEach(([key, value]) => {
      if (key !== obj.id) {
        otherFieldNames.push(value);
      }
    });
    return otherFieldNames;
  };
  /**
   * Filters the duplicates for the field title
   */
  const filterTitleDuplicates = () => {
    const otherTitles: any = [];
    Object.entries(hashFieldIdsWithTitle).forEach(([key, value]) => {
      if (key !== obj.id) {
        otherTitles.push(value);
      }
    });
    return otherTitles;
  };
  /**
   * Error reference for the text field
   */
  const errorRef = useRef('');
  if (fieldName === 'fieldName' || fieldName === 'title') {
    if (isFieldNameChangable) {
      inputProps.customValidator = (propsValue: any = []) => {
        const otherFieldNames = filterDuplicates();
        const otherTitleNames = filterTitleDuplicates();
        errorRef.current = '';
        if (fieldName === 'fieldName') {
          if (propsValue?.includes('.')) {
            errorRef.current = 'Cannot have "." in ';
          }
          if (!!containsOnlyLettersAndNumbers(propsValue)) {
            errorRef.current = 'Cannot have any special characters in ';
          }
          if (propsValue.length > 50) {
            errorRef.current = 'Maximum allowed characters is 50 for ';
          }
          if (otherFieldNames.includes(propsValue)) {
            errorRef.current = 'Cannot enter duplicate ';
          }
        }
        if (!isNaN(propsValue)) {
          errorRef.current = 'Invalid ';
        }
        if (isCustomizationForm && otherTitleNames.includes(propsValue) && fieldName === 'title') {
          errorRef.current = 'Cannot enter duplicate ';
        }
        return errorRef.current;
      };
      if (fieldName === 'fieldName' || fieldName === 'title') {
        customOnBlurFn = ({ target: { value: fieldNameValue } }: any) => {
          if (!!errorRef.current) {
            fieldNameValue = '';
          }
          const otherFieldNames =
            fieldName === 'fieldName' ? filterDuplicates() : isCustomizationForm ? filterTitleDuplicates() : [];
          let newFieldName = fieldNameValue;
          let newFieldLabel = fieldNameValue;
          if (otherFieldNames.includes(fieldNameValue) || !fieldNameValue) {
            newFieldName = new Date().getTime().toString() + 'FieldID';
            form.mutators.setValue(`${name}.${fieldName}`, '');
            newFieldLabel = '';
          }
          if ((fieldNameValue !== obj?.id || fieldName === 'title') && handleUpdateFieldName && targetIds) {
            handleUpdateFieldName(
              obj.family,
              obj.id,
              newFieldName,
              newFieldLabel,
              obj.title,
              fieldName === 'title',
              (formValues) => {
                const formData = { ...formValues[obj.family] };
                Object.values(formData)
                  .filter((v) => v && (v as any).viewType !== 'CardView')
                  .forEach((values: any, index) => {
                    targetIds[index] = { key: values.id, label: camel2Title(values.title) };
                  });
              }
            );
          }
        };
      }
    }
    capitalize = true;
  }

  if (fieldName === 'interval' && inputProps?.type === 'interval') {
    inputProps.customValidator = (propsValue: any) => {
      const intervalCount = (Number(obj.endValue) - Number(obj.startValue)) / 15;
      const showIntervalError =
        intervalCount <= 0 ||
        Number(propsValue) <= intervalCount ||
        Number(propsValue) >= obj.endValue ||
        Number(propsValue) <= 0;
      return showIntervalError
        ? `The interval value should be between ${intervalCount.toString().split('.')[0]} and ${obj.endValue}`
        : '';
    };
    parseFn = (value: any) => (value % 1 === 0 ? value : null);
  }
  const newInputProps = useRef(inputProps);

  if (inputProps?.type === 'sliderValue') {
    parseFn = (value: any) => {
      obj.interval = null;
      return value % 1 === 0 ? value : null;
    };
  }
  if (fieldName === 'fieldName') {
    capitalize = true;
  }
  if (inputProps?.type === 'number' && obj.inputType !== InputTypes.DECIMAL) {
    parseFn = (value: any) => (value !== '' ? parseInt(value, 10) : value);
  }
  if (
    ['minDays', 'maxDays', 'minValue', 'maxValue', 'minLength', 'maxLength', 'lengthGreaterThan'].includes(fieldName)
  ) {
    parseFn = (value: any) => (value > 0 ? value : null);
  }

  /**
   * Gets the asterisk for the text field
   */
  const getAsterisk = () => {
    const codeValue = form.getFieldState(`${name}.code`)?.value;
    const urlValue = form.getFieldState(`${name}.url`)?.value;
    return codeValue || urlValue;
  };
  /**
   * Gets the asterisk error for the text field
   */
  const getAsteriskError = (field: string, props?: any) => {
    const codeValue = form.getFieldState(`${name}.code`)?.value;
    const urlValue = form.getFieldState(`${name}.url`)?.value;
    if (field === 'code' && !codeValue && urlValue) {
      return 'Please enter the code';
    } else if (field === 'code' && codeValue && containsOnlyLettersAndNumbers(codeValue)) {
      return ' Please enter a valid code';
    } else if (field === 'code') {
      return '';
    }
    if (field === 'url' && !urlValue && codeValue) {
      return 'Please enter the url';
    } else if (field === 'url') {
      return '';
    }
  };

  return (
    <div
      className={`${isCustomizationForm ? 'col-4' : 'col-12 col-md-6 col-lg-4 col-xl-3'}`}
      data-testid='text-field-wrapper'
    >
      <TextFieldWrapper
        name={`${name}.${fieldName}`}
        customValue={obj.fieldName}
        customError={['code', 'url'].includes(fieldName) ? getAsteriskError(fieldName, inputProps) : ''}
        customParseFn={parseFn}
        inputProps={['code', 'url'].includes(fieldName) ? newInputProps.current : inputProps}
        onlyAsterisk={['code', 'url'].includes(fieldName) && getAsterisk()}
        customOnBlurFn={customOnBlurFn}
        obj={obj}
        fieldName={fieldName}
        capitalize={capitalize}
      />
    </div>
  );
};

/**
 * Renders the fields based on the provided configuration.
 * @param {any} props - The props for the RenderFields component
 */
const RenderFields = ({
  obj,
  name,
  fieldName,
  inputProps,
  form,
  unAddedFields,
  targetIds,
  isNew,
  newlyAddedIds,
  handleUpdateFieldName,
  addNewFieldDisabled,
  isFieldNameChangable,
  hashFieldIdsWithTitle,
  hashFieldIdsWithFieldName,
  input,
  isCustomizationForm,
  isWorkFlowCustomization,
  ...rest
}: any) => {
  const codeRef = useRef('');
  const urlRef = useRef('');
  const { form: formType } = useParams<IMatchParams>();
  // Toggle text field component to select component on disable mode
  inputProps = {
    ...inputProps,
    ...getComponentsByFieldName(
      fieldName,
      obj,
      isNew,
      isFieldNameChangable,
      isCustomizationForm,
      isWorkFlowCustomization
    )
  };

  if (isCustomizationForm) {
    if (fieldName === 'isEditable' && (!isEditableFields.includes(obj.id) || formType !== 'enrollment')) {
      return null;
    }
    if (fieldName === 'readOnly') {
      return null;
    }
    if (fieldName === 'unitMeasurement' && !unitMeasurementFields.includes(obj.id)) {
      return null;
    }

    if (fieldName === 'isEnrollment' && isCustomizationForm && formType !== 'assessment') {
      obj.isEnrollment = undefined;
      return null;
    }

    if (
      fieldName === 'condition' &&
      !['Spinner', 'RadioGroup', 'EditText', 'SingleSelectionView'].includes(obj.viewType)
    ) {
      return null;
    }
  }

  switch (inputProps?.component) {
    case 'CHECKBOX': {
      return (
        <CheckboxComponent
          form={form}
          name={name}
          fieldName={fieldName}
          inputProps={inputProps}
          obj={obj}
          isCustomizationForm={isCustomizationForm}
        />
      );
    }
    case 'SELECT_INPUT': {
      return (
        <SelectInputValues
          name={`${name}.${fieldName}`}
          fieldName={fieldName}
          inputProps={inputProps}
          obj={obj}
          newlyAddedIds={newlyAddedIds}
          unAddedFields={unAddedFields}
          handleUpdateFieldName={handleUpdateFieldName}
          isCustomizationForm={isCustomizationForm}
        />
      );
    }

    case 'INSTRUCTIONS': {
      const fieldVal = obj[fieldName]?.length ? obj[fieldName] : [''];
      return (
        <div className='col-12' data-testid='instructions-wrapper'>
          <Field name={`${name}.${fieldName}`}>
            {(_props) => (
              <>
                <TextInputArray
                  label={inputProps?.label || ''}
                  defaultValue={fieldVal as unknown as string[]}
                  required={false}
                  onChange={(value: string[]) => {
                    form.mutators.setValue(`${name}.${fieldName}`, value);
                  }}
                />
              </>
            )}
          </Field>
        </div>
      );
    }

    case 'OPTION_LIST': {
      return (
        <div
          className={`${isCustomizationForm ? 'col-4' : 'col-12 col-md-6 col-lg-4 col-xl-3'}`}
          data-testid='option-list-wrapper'
        >
          <OptionList field={fieldName} name={`${name}.${fieldName}`} obj={obj} form={form} inputProps={inputProps} />
        </div>
      );
    }
    case 'TARGET_VIEWS': {
      return (
        <div
          className={`${isCustomizationForm ? 'col-4' : 'col-12 col-md-6 col-lg-4 col-xl-3'}`}
          data-testid='multi-select-option-list-wrapper'
        >
          <MultiSelectOptionList
            label={'Target Views'}
            field={fieldName}
            name={`${name}.${fieldName}`}
            obj={obj}
            form={form}
            inputProps={inputProps}
            targetIds={targetIds}
          />
        </div>
      );
    }
    case 'QUESTIONNAIRE': {
      return (
        <Questionnaire
          label={'Questionnaire'}
          defaultValue={obj[fieldName]}
          required={false}
          onChange={(value: any) => {
            fieldName[fieldName] = value;
          }}
        />
      );
    }
    case 'CONDITION_CONFIG': {
      return (
        <ConditionConfig
          field={fieldName}
          name={`${name}.${fieldName}`}
          obj={obj}
          form={form}
          targetIds={targetIds}
          unAddedFields={unAddedFields}
          newlyAddedIds={newlyAddedIds}
        />
      );
    }
    case 'RANGES_CONFIG': {
      return (
        <RangesConfig
          field={fieldName}
          name={`${name}.${fieldName}`}
          obj={obj}
          form={form}
          targetIds={targetIds}
          unAddedFields={unAddedFields}
          newlyAddedIds={newlyAddedIds}
        />
      );
    }
    case 'DATE_PICKER': {
      const parseFn = (val: any) => val;
      const value = obj[fieldName] || null;
      return (
        <div
          className={`${isCustomizationForm ? 'col-4' : 'col-12 col-md-6 col-lg-4 col-xl-3'}`}
          data-testid='date-picker-wrapper'
        >
          <DatePickerWrapper
            fieldName={fieldName}
            name={`${name}.${fieldName}`}
            obj={obj}
            form={form}
            customValue={value}
            customParseFn={parseFn}
            inputProps={inputProps}
            targetIds={targetIds}
            unAddedFields={unAddedFields}
            newlyAddedIds={newlyAddedIds}
          />
        </div>
      );
    }
    case 'TEXT_FIELD':
    default: {
      return (
        <TextFieldComponent
          form={form}
          name={name}
          fieldName={fieldName}
          obj={obj}
          inputProps={inputProps}
          targetIds={targetIds}
          newlyAddedIds={newlyAddedIds}
          handleUpdateFieldName={handleUpdateFieldName}
          hashFieldIdsWithTitle={hashFieldIdsWithTitle}
          hashFieldIdsWithFieldName={hashFieldIdsWithFieldName}
          isFieldNameChangable={isFieldNameChangable}
          codeRef={codeRef}
          urlRef={urlRef}
          input={input}
          isCustomizationForm={isCustomizationForm}
        />
      );
    }
  }
};

export default RenderFields;
