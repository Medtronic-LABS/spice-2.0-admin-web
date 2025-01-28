import { Fragment, useEffect } from 'react';
import { FieldArray } from 'react-final-form-arrays';
import BinIcon from '../../../../assets/images/bin.svg';
import PlusIcon from '../../../../assets/images/plus_blue.svg';
import CustomTooltip from '../../../tooltip';
import { required } from '../../../../utils/validation';
import styles from '../../styles/FormBuilder.module.scss';
import SelectFieldWrapper from './SelectFieldWrapper';
import TextFieldWrapper from './TextFieldWrapper';
import { filterUnitsandGender, IUnit } from '../../utils/FieldUtils';
import { InputTypes } from '../../labTestConfig/BaseFieldConfig';

/**
 * Renders the select input component based on the provided configuration.
 * @param {any} props - The props for the SelectInputComponent component
 */
const SelectInputComponent = ({ form, name, fieldName, item, obj, config, index }: any) => {
  let options: any = config?.options || [];
  let parseFn = (val: any) => val;
  let value = item[fieldName] || null;
  let disabledUnits: IUnit[] = [];
  let disabledGenders: IUnit[] = [];

  if (fieldName === 'unitType') {
    const { removedUnits } = filterUnitsandGender(obj?.ranges, obj?.unitList);
    const { units: removedUnit } = removedUnits;
    disabledUnits = removedUnit;
    options = obj?.unitList?.filter((optionItem: any) => optionItem.name !== '');
    parseFn = (val) => val?.name;
    value = options?.find(({ name: optionName }: any) => item[fieldName] === optionName) || null;
  }
  if (fieldName === 'gender') {
    const { removedUnits } = filterUnitsandGender(obj?.ranges, obj?.unitList);
    const { genders } = removedUnits;
    disabledGenders = genders[item.unitType] || [];
    options = config?.options?.filter((optionItem: any) => optionItem.name !== '');
    parseFn = (val) => val?.id;
    value = options?.find(({ id: gender }: any) => item[fieldName] === gender) || null;
  }

  return (
    <div className={config.colSize}>
      <SelectFieldWrapper
        name={`${name}[${index}]${config?.name}`}
        autoSelect={false}
        customValue={value}
        customError={config.error}
        customOptions={options}
        customParseFn={parseFn}
        inputProps={config}
        isOptionDisabled={(option: any) => {
          const existing = (config.name === 'gender' ? disabledGenders : disabledUnits).findIndex(
            (optionItem: any) => optionItem.name === option.name
          );
          return existing >= 0;
        }}
        onChange={(event: any, input: any) => {
          const newItem = { ...item };
          if (newItem.unitType !== event?.name) {
            form.mutators.setValue(`${name}[${index}].gender`, '');
          }
          input.onChange(event);
        }}
      />
    </div>
  );
};

/**
 * Renders the text input component based on the provided configuration.
 * @param {any} props - The props for the TextInputComponent component
 */
const TextInputComponent = ({ name, fieldName, item, config, index }: any) => {
  let parseFn = (parseValue: any) => parseValue;
  const value = item[fieldName] || null;
  if (config?.type === 'number') {
    parseFn = (newParseValue: any) => (!!Number(newParseValue) ? Number(newParseValue) : null);
  }
  return (
    <div className={config.colSize}>
      <TextFieldWrapper
        name={`${name}[${index}].${config.name}`}
        customValue={value}
        formError={config.error}
        customParseFn={parseFn}
        inputProps={config}
        obj={config}
      />
    </div>
  );
};

/**
 * Renders the ranges fields component based on the provided configuration.
 * @param {any} props - The props for the RangesFieldsComponent component
 */
const RangesFieldsComponent = ({ form, item, name, obj, index, rangesFieldConfigs }: any) => {
  useEffect(() => {
    const unitExists = (obj.unitList || []).find((unit: any) => item.unitType === unit.name);
    if (!unitExists?.name) {
      form.mutators.setValue(`${name}[${index}].unitType`, '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obj.unitList]);

  return Object.keys(item)
    .sort((a, b) => rangesFieldConfigs?.[a]?.order - rangesFieldConfigs?.[b]?.order)
    .map((fieldName: any) => {
      if (fieldName in rangesFieldConfigs) {
        const config = rangesFieldConfigs[fieldName];
        switch (config?.component) {
          case 'SELECT_INPUT': {
            return (
              <Fragment key={fieldName}>
                <SelectInputComponent
                  form={form}
                  name={name}
                  key={fieldName}
                  fieldName={fieldName}
                  item={item}
                  obj={obj}
                  config={config}
                  index={index}
                />
              </Fragment>
            );
          }
          case 'TEXT_INPUT':
          default: {
            return (
              <Fragment key={fieldName}>
                <TextInputComponent
                  name={name}
                  key={fieldName}
                  fieldName={fieldName}
                  item={item}
                  config={config}
                  index={index}
                />
              </Fragment>
            );
          }
        }
      } else {
        return <></>;
      }
    });
};

/**
 * Renders the ranges config component based on the provided configuration.
 * @param {any} props - The props for the RangesConfig component
 */
const RangesConfig = ({ name, obj, field, form }: any) => {
  const rangesFieldConfigs: any = {
    unitType: {
      name: 'unitType',
      label: 'Unit',
      labelKey: 'name',
      valueKey: 'id',
      options: obj.unitList || [],
      required: true,
      disabledValidation: true,
      error: 'Please select the unit',
      component: 'SELECT_INPUT',
      colSize: 'col-6 col-md-4 col-lg-3'
    },
    gender: {
      name: 'gender',
      label: 'Gender',
      labelKey: 'name',
      valueKey: 'id',
      options: [
        { name: 'Male', id: 'Male' },
        { name: 'Female', id: 'Female' }
      ],
      required: true,
      disabledValidation: true,
      error: 'Please select the gender',
      component: 'SELECT_INPUT',
      colSize: 'col-6 col-md-4 col-lg-2'
    },
    minRange: {
      name: 'minRange',
      type: 'number',
      inputType: InputTypes.DECIMAL,
      label: 'Min Value',
      required: true,
      disabledValidation: true,
      error: 'Please enter a valid number',
      component: 'TEXT_INPUT',
      colSize: 'col-6 col-md-4 col-lg-2'
    },
    maxRange: {
      name: 'maxRange',
      type: 'number',
      inputType: InputTypes.DECIMAL,
      label: 'Max Value',
      required: true,
      disabledValidation: true,
      component: 'TEXT_INPUT',
      error: 'Please enter a valid number',
      colSize: 'col-6 col-md-4 col-lg-2'
    },
    displayRange: {
      name: 'displayRange',
      type: 'text',
      label: 'Display Range',
      required: true,
      disabledValidation: true,
      component: 'TEXT_INPUT',
      error: 'Please enter a valid display range',
      colSize: 'col-6 col-md-4 col-lg-3'
    }
  };

  const initialValue = {
    unitType: '',
    gender: '',
    minRange: '',
    maxRange: '',
    displayRange: ''
  };

  /**
   * Handles the addition of a new range based on the provided configuration.
   */
  const onAddNewRange = () => {
    form.mutators.setValue(`${name}`, [initialValue]);
  };

  return (
    <div className='col-4 col-12' data-testid='ranges-config-wrapper'>
      <div className='d-flex align-items-center '>
        <div
          className={`d-flex mt-1 mb-0dot5 theme-text lh-1dot25 ${!!obj.fieldName ? 'pointer' : 'not-allowed'}`}
          onClick={!!obj.fieldName && !(obj[field] || []).length ? onAddNewRange : () => null}
        >
          <CustomTooltip title={`${!!obj.fieldName ? 'Add' : 'Please select a field name'}`}>
            <span className={`${styles.label} m-0 `}>Ranges</span>
            <img
              className={`ms-0dot5 ${!!obj.fieldName ? '' : 'no-pointer-events'} ${
                !(obj[field] || []).length ? 'visible' : 'invisible'
              }`}
              src={PlusIcon}
              alt='plus-icon'
            />
          </CustomTooltip>
        </div>
      </div>
      {(obj[field] || []).length ? (
        <div className={`${styles.rangesContainer}`}>
          <FieldArray
            name={name}
            validate={(values) => {
              // custom validation to check all fields are valid
              const ranges: any = [];
              (values || []).forEach((item: any, index: number) => {
                const errors: any = {};
                Object.keys(item).forEach((key: any) => {
                  const error = required(item[key]);
                  if (error) {
                    errors[key] = error + rangesFieldConfigs[key]?.label?.toLowerCase();
                  }
                });
                if (!errors.maxRange && Number(values[index]?.minRange) >= Number(values[index]?.maxRange)) {
                  errors.maxRange = 'Max value should be greater than min value';
                }
                ranges.push(Object.keys(errors).length ? errors : null);
              });
              if (ranges.every((element: any) => element === null)) {
                return;
              }
              return ranges;
            }}
          >
            {({ fields, meta }) =>
              obj[field].map((item: any, index: any) => {
                return (
                  <Fragment key={index}>
                    <div className='row position-relative ' key={`${obj.family}_${obj.id}_${name}`}>
                      <div className='col-11 row d-flex gx-1 pe-lg-1'>
                        <RangesFieldsComponent
                          form={form}
                          item={item}
                          name={name}
                          obj={obj}
                          index={index}
                          rangesFieldConfigs={rangesFieldConfigs}
                        />
                      </div>
                      <div className={`col-1 d-flex align-items-center ${styles.actionIcons}`}>
                        <div
                          className='danger-text lh-1dot25 pointer m-0dot5'
                          onClick={() => {
                            fields?.value?.length > 1
                              ? fields.remove(index)
                              : form.mutators.setValue(`${obj.family}.${obj.id}`, {
                                  ...obj,
                                  ranges: []
                                });
                          }}
                        >
                          <CustomTooltip title='Delete'>
                            <img className='me-0dot5' src={BinIcon} alt='delete-icon' />
                          </CustomTooltip>
                        </div>
                        {obj[field].length - 1 === index && !meta.error && (
                          <div
                            className={`theme-text lh-1dot25 pointer m-0dot5`}
                            onClick={() => {
                              fields.push(initialValue);
                            }}
                            data-testid='add-new-range-plus-icon'
                          >
                            <CustomTooltip title='Add'>
                              <img className={`me-0dot5`} src={PlusIcon} alt='plus-icon' />
                            </CustomTooltip>
                          </div>
                        )}
                      </div>
                    </div>
                  </Fragment>
                );
              })
            }
          </FieldArray>
        </div>
      ) : null}
    </div>
  );
};

export default RangesConfig;
