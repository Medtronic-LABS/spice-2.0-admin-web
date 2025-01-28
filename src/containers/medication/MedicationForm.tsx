import { FormApi } from 'final-form';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { IMedicationFormValues } from './AddMedication';
import TextInput from '../../components/formFields/TextInput';
import { composeValidators, required, validateEntityName } from '../../utils/validation';
import PlusIcon from '../../assets/images/plus_blue.svg';
import BinIcon from '../../assets/images/bin.svg';
import CloseIcon from '../../assets/images/close-red.svg';
import TickIcon from '../../assets/images/tick.svg';
import SelectInput from '../../components/formFields/SelectInput';

import styles from './AddMedication.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import CustomTooltip from '../../components/tooltip';
import Loader from '../../components/loader/Loader';
import {
  getCategoryLoadingSelector,
  getClassificationsLoadingSelector,
  getDosageFormsLoadingSelector,
  getMedicationCategorySelector,
  getMedicationClassificationsSelector,
  getMedicationDosageFormsSelector,
  getMedicationLoadingSelector
} from '../../store/medication/selectors';
import { fetchCategoryForms, fetchClassifications, fetchDosageForms } from '../../store/medication/actions';
import { IList } from '../../store/medication/types';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';

export interface IMedicationDataFormValues {
  id?: number;
  name: string;
  brand: IList;
  classification: IList;
  codeDetails: ICodeDetails;
  dosage_form: IList;
  category: IList;
  country: string | IList;
}

export interface ICodeDetails {
  code: string;
  url: string;
}

export interface ICheckDuplicateValidation {
  fields: any;
  index: number;
  isFirstChild: boolean;
  initialValue?: Partial<IMedicationDataFormValues>;
  isUpdate?: boolean;
  isSubmitted?: boolean;
  submitCb?: () => void;
}

interface IMedicationFormProps {
  form: FormApi<IMedicationFormValues>;
  initialEditValue?: any;
  disableOptions?: boolean;
  checkDuplicateValidation?: (data: ICheckDuplicateValidation) => void;
  previousFieldValue?: IMedicationDataFormValues[];
  internalFormState?: Array<{ isValueChanged: boolean; isValid: boolean }>;
  setPreviousFieldValue?: (value: IMedicationDataFormValues | null, index: number, isRemove?: boolean) => void;
  setInternalFormState?: (
    value: { isValueChanged: boolean; isValid: boolean } | null,
    index: number,
    isRemove?: boolean
  ) => void;
}

/**
 * Form for medication creation
 * @param {IMedicationFormProps} props - The component props
 * @returns {React.ReactElement}
 */
const MedicationForm = ({
  form,
  initialEditValue,
  disableOptions,
  checkDuplicateValidation,
  previousFieldValue,
  internalFormState,
  setPreviousFieldValue,
  setInternalFormState
}: IMedicationFormProps): React.ReactElement => {
  const formName = 'medication';
  const { regionId: countryId }: { regionId: string } = useParams();
  const [brandOptions, setBrandOptions] = useState([] as Array<Partial<IList[]>>);

  const dispatch = useDispatch();
  const classificationOptions = useSelector(getMedicationClassificationsSelector);
  const dosageFormOptions = useSelector(getMedicationDosageFormsSelector);
  const categoryList = useSelector(getMedicationCategorySelector);
  const isLoading = useSelector(getMedicationLoadingSelector);
  const isClassificationsLoading = useSelector(getClassificationsLoadingSelector);
  const isDosageFormsLoading = useSelector(getDosageFormsLoadingSelector);
  const isCategoryFormOptionsLoading = useSelector(getCategoryLoadingSelector);
  const {
    medication: {
      categories: { available: isCategories }
    }
  } = useAppTypeConfigs();

  const initialValue = useMemo<Array<Partial<IMedicationDataFormValues>>>(
    () => [
      {
        name: '',
        country: countryId
      }
    ],
    [countryId]
  );

  /**
   * initial value for Medication edit
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialEditData = useMemo<Array<Partial<IMedicationDataFormValues>>>(() => [{ ...initialEditValue }], []);
  useEffect(() => {
    dispatch(fetchClassifications({ countryId: Number(countryId) }));
    if (dosageFormOptions && !dosageFormOptions.length) {
      dispatch(fetchDosageForms());
    }
    if (isCategories) {
      dispatch(fetchCategoryForms());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, countryId, dosageFormOptions && dosageFormOptions.length]);

  /**
   * Resets the brand field when classification changes
   * @param {any} fields - The form fields
   * @param {number} index - The index of the current field
   */
  const resetBrandField = useCallback(
    (fields: any, index: number) => {
      form.mutators?.resetFields?.(`${formName}[${index}].brand`);
      fields.update(index, { ...form.getState().values.medication[index], brand: undefined });
    },
    [form]
  );

  /**
   * Sets brand options in the state
   * @param {IList[]} brands - The list of brands
   * @param {number} index - The index of the current field
   */
  const setBrandOptionsToState = useCallback(
    (brands: IList[], index = 0) => {
      const brandValues = [...brandOptions];
      brandValues[index] = brands;
      setBrandOptions(brandValues);
    },
    [brandOptions]
  );

  /**
   * Detects changes in existing field values and updates internal form state
   * @param {any} value - The new field value
   * @param {number} index - The index of the current field
   */
  const detectFieldChange = useCallback(
    (value: any, index: number) => {
      if (previousFieldValue?.[index] !== undefined) {
        const isValueChanged = !Object.values(previousFieldValue[index]).includes(value);
        setInternalFormState?.({ isValueChanged, isValid: !isValueChanged }, index);
      } else {
        setInternalFormState?.({ isValueChanged: false, isValid: false }, index);
      }
    },
    [previousFieldValue, setInternalFormState]
  );

  /**
   * Checks if the current row has any form validation errors
   * @param {number} index - The index of the current field
   * @returns {boolean}
   */
  const checkIfFieldValid = (index: number) => form.getState().errors?.medication?.[index] === undefined;

  /**
   * Removes the current row by index
   * @param {any} fields - The form fields
   * @param {number} index - The index of the field to remove
   */
  const onRemoveFormRow = useCallback(
    (fields: any, index: number) => {
      setPreviousFieldValue?.(null, index, true);
      setInternalFormState?.(null, index, true);
      fields.remove(index);
    },
    [setInternalFormState, setPreviousFieldValue]
  );

  /**
   * Reverts changes made on existing field values
   * @param {any} fields - The form fields
   * @param {number} index - The index of the field to reset
   */
  const onResetEditChanges = useCallback(
    (fields: any, index: number) => {
      form.mutators?.resetFields?.(`${formName}[${index}]`);
      fields.update(index, { ...previousFieldValue?.[index] });
      setInternalFormState?.({ isValueChanged: false, isValid: true }, index);
    },
    [form.mutators, previousFieldValue, setInternalFormState]
  );

  /**
   * Handles adding another medication row
   * @param {boolean} addNewRowEnabled - Whether adding a new row is enabled
   * @param {any} fields - The form fields
   * @param {number} index - The index of the current field
   * @param {boolean} isFirstChild - Whether this is the first child in the form
   */
  const handleAddAnotherMedication = (addNewRowEnabled: boolean, fields: any, index: number, isFirstChild: boolean) => {
    if (addNewRowEnabled && checkDuplicateValidation) {
      checkDuplicateValidation({
        fields,
        index,
        isFirstChild,
        initialValue: initialValue[0],
        isUpdate: false
      });
    }
  };

  /**
   * Renders action icons for each medication row
   * @param {any} fields - The form fields
   * @param {number} index - The index of the current field
   * @param {boolean} isFirstChild - Whether this is the first child in the form
   * @param {boolean} isLastChild - Whether this is the last child in the form
   * @returns {React.ReactNode}
   */
  const renderActionIcons = (
    fields: any,
    index: number,
    isFirstChild: boolean,
    isLastChild: boolean
  ): React.ReactNode => {
    const isFieldValueChanged = internalFormState?.[index] && internalFormState[index]?.isValueChanged;
    const addNewRowEnabled = form.getState().valid && !isFieldValueChanged;
    return (
      !disableOptions && (
        <div className={`d-flex  align-items-center ${styles.actionIconContainer} ps-lg-0dot5`}>
          {/* plus icon to add a new field row and checks for duplicate validation */}
          {isLastChild && (
            <div className={` ${styles.actionIcons} ${isFirstChild ? styles.actionIconTop : ''}`}>
              <div
                className={`theme-text lh-1dot25 pb-lg-1 ${addNewRowEnabled ? 'pointer' : 'not-allowed'}`}
                onClick={() => handleAddAnotherMedication(addNewRowEnabled, fields, index, isFirstChild)}
              >
                <CustomTooltip title='Add'>
                  <img
                    className={`me-0dot5 ${addNewRowEnabled ? '' : 'no-pointer-events'}`}
                    src={PlusIcon}
                    alt='plus-icon'
                  />
                </CustomTooltip>
              </div>
              {!isFirstChild && (
                <div className={`danger-text lh-1dot25 pointer pb-lg-1`} onClick={() => onRemoveFormRow(fields, index)}>
                  <CustomTooltip title='Delete'>
                    <img className='me-0dot5' src={BinIcon} alt='delete-icon' />
                  </CustomTooltip>
                </div>
              )}
            </div>
          )}{' '}
          {!isLastChild && isFieldValueChanged && (
            // shows update and reset action icons if existing field value changes
            <div className={`${styles.updateIcons}`}>
              {/* Reset icon: resets the existing field value changes */}
              <div className='danger-text lh-1dot25 pb-lg-1 pointer' onClick={() => onResetEditChanges(fields, index)}>
                <CustomTooltip title='Reset'>
                  <img className='me-0dot5 no-pointer-events' src={CloseIcon} alt='close-icon' />
                </CustomTooltip>
              </div>
              {/* Update icon: updates the existing field value changes */}
              <div
                className={`danger-text lh-1dot25 pb-lg-1 ${checkIfFieldValid(index) ? 'pointer' : 'not-allowed'}`}
                onClick={() => {
                  if (checkIfFieldValid(index) && checkDuplicateValidation) {
                    checkDuplicateValidation({
                      fields,
                      index,
                      isFirstChild,
                      initialValue: initialValue[0],
                      isUpdate: true
                    });
                  }
                }}
              >
                <CustomTooltip title='Update'>
                  <img
                    className={`me-0dot5  ${checkIfFieldValid(index) ? '' : 'no-pointer-events'}`}
                    src={TickIcon}
                    alt='tick-icon'
                  />
                </CustomTooltip>
              </div>
            </div>
          )}{' '}
          {!isLastChild && !isFieldValueChanged && (
            // Delete icon: removes the current field row
            <div
              className={`danger-text lh-1dot25 pointer pb-lg-1 ${styles.actionIcons} ${styles.actionIconTop}`}
              onClick={() => onRemoveFormRow(fields, index)}
            >
              <CustomTooltip title='Delete'>
                <img className='me-0dot5' src={BinIcon} alt='delete-icon' />
              </CustomTooltip>
            </div>
          )}
        </div>
      )
    );
  };

  /**
   * Renders the Medication Name input field
   * @param {string} name
   * @param {number} index - The index of the current medication form in the array of forms
   * @returns {React.ReactNode} The rendered Medication Name input field
   */
  const renderMedicationName = (name: string, index: number): React.ReactNode => {
    return (
      <div className={`${disableOptions ? 'col-6' : 'col-12 col-sm-6 col-lg-3'}`}>
        <Field
          name={`${name}.name`}
          type='text'
          validate={composeValidators(required, validateEntityName)}
          render={({ input, meta }) => (
            <TextInput
              {...input}
              label='Medication Name'
              errorLabel='medication name'
              disabled={disableOptions}
              error={(meta.touched && meta.error) || undefined}
              capitalize={true}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                input.onChange(event);
                const timerId = 0;
                clearTimeout(timerId);
                setTimeout(() => detectFieldChange(event.target.value, index), 500);
              }}
            />
          )}
        />
      </div>
    );
  };

  /**
   * Renders the Code input field for medication
   * @param {string} name
   * @param {number} index - The index of the current medication form in the array of forms
   * @returns {React.ReactNode} The rendered Code input field
   */
  const renderCode = (name: string, index: number): React.ReactNode => {
    return (
      <div className={`${disableOptions ? 'col-6' : 'col-12 col-sm-6 col-lg-3'}`}>
        <Field
          name={`${name}.codeDetails.code`}
          type='text'
          parse={(value) => value.replace(/[^0-9a-zA-Z-_/, ]/g, '')}
          validate={composeValidators(required)}
          render={({ input, meta }) => (
            <TextInput
              {...input}
              label='Code'
              errorLabel='code'
              error={(meta.touched && meta.error) || undefined}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                input.onChange(event);
                const timerId = 0;
                clearTimeout(timerId);
                setTimeout(() => detectFieldChange(event.target.value, index), 500);
              }}
            />
          )}
        />
      </div>
    );
  };

  /**
   * Renders the URL input field for medication
   * @param {string} name
   * @param {number} index - The index of the current medication form in the array of forms
   * @returns {React.ReactNode} The rendered URL input field
   */
  const renderUrl = (name: string, index: number): React.ReactNode => {
    return (
      <div className={`${disableOptions ? 'col-6' : 'col-12 col-sm-6 col-lg-3'}`}>
        <Field
          name={`${name}.codeDetails.url`}
          type='text'
          validate={composeValidators(required)}
          render={({ input, meta }) => (
            <TextInput
              {...input}
              label='URL'
              errorLabel='url'
              error={(meta.touched && meta.error) || undefined}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                input.onChange(event);
                const timerId = 0;
                clearTimeout(timerId);
                setTimeout(() => detectFieldChange(event.target.value, index), 500);
              }}
            />
          )}
        />
      </div>
    );
  };

  /**
   * Renders the Classification select input field for medication
   * @param {string} name
   * @param {any} fields - The form fields object
   * @param {number} index - The index of the current medication form in the array of forms
   * @returns {React.ReactNode} The rendered Classification select input field
   */
  const renderClassification = (name: string, fields: any, index: number): React.ReactNode => {
    return (
      <div className={`${disableOptions ? 'col-6' : 'col-12 col-sm-6 col-lg-3'}`}>
        <Field
          name={`${name}.classification`}
          type='text'
          validate={required}
          render={(props) => (
            <SelectInput
              {...(props as any)}
              label='Classification'
              errorLabel='classification'
              labelKey='name'
              valueKey='id'
              options={classificationOptions}
              loadingOptions={isClassificationsLoading}
              error={(props.meta.touched && props.meta.error) || undefined}
              onChange={(value) => {
                detectFieldChange(value, index);
                if (fields.value[index].brand) {
                  resetBrandField(fields, index);
                }
                setBrandOptionsToState(value?.brands, index);
              }}
              isModel={initialEditValue ? true : false}
            />
          )}
        />
      </div>
    );
  };

  /**
   * Renders the Brand select input field for medication
   * @param {string} name - The base name for the field, used to construct the full field name
   * @param {number} index - The index of the current medication form in the array of forms
   * @returns {React.ReactNode} The rendered Brand select input field
   */
  const renderBrand = (name: string, index: number): React.ReactNode => {
    return (
      <div className={`${disableOptions ? 'col-6' : 'col-12 col-sm-6 col-lg-3'}`}>
        <Field
          name={`${name}.brand`}
          type='text'
          validate={required}
          render={(props) => (
            <SelectInput
              {...(props as any)}
              label='Brand'
              errorLabel='brand'
              labelKey='name'
              valueKey='id'
              options={brandOptions[index]}
              loadingOptions={isClassificationsLoading}
              error={(props.meta.touched && props.meta.error) || undefined}
              onChange={(value) => detectFieldChange(value, index)}
              isModel={initialEditValue ? true : false}
            />
          )}
        />
      </div>
    );
  };

  /**
   * Renders the Dosage Form select input field
   * @param {string} name - The base name for the field, used to construct the full field name
   * @param {number} index - The index of the current medication form in the array of forms
   * @returns {React.ReactNode} The rendered Dosage Form select input field
   */
  const renderDosageForm = (name: string, index: number): React.ReactNode => {
    return (
      <div className={`${disableOptions ? 'col-6' : 'col-12 col-sm-6 col-lg-3'}`}>
        <Field
          name={`${name}.dosage_form`}
          type='text'
          validate={required}
          render={(props) => (
            <SelectInput
              {...(props as any)}
              label='Dosage Form'
              errorLabel='dosage form'
              labelKey='name'
              valueKey='id'
              options={dosageFormOptions}
              loadingOptions={isDosageFormsLoading}
              error={(props.meta.touched && props.meta.error) || undefined}
              onChange={(value) => detectFieldChange(value, index)}
              isModel={initialEditValue ? true : false}
            />
          )}
        />
      </div>
    );
  };

  /**
   * Renders the Category Form select input field
   * @param {string} name - The base name for the field, used to construct the full field name
   * @param {number} index - The index of the current medication form in the array of forms
   * @returns {React.ReactNode} The rendered Category Form select input field
   */
  const renderCategoryForm = (name: string, index: number): React.ReactNode => {
    return (
      <div className={`${disableOptions ? 'col-6' : 'col-12 col-sm-6 col-lg-3'}`}>
        <Field
          name={`${name}.category`}
          type='text'
          validate={required}
          render={(props) => (
            <SelectInput
              {...(props as any)}
              label='Category'
              errorLabel='category'
              labelKey='name'
              valueKey='id'
              options={categoryList}
              loadingOptions={isCategoryFormOptionsLoading}
              error={(props.meta.touched && props.meta.error) || undefined}
              onChange={(value) => detectFieldChange(value, index)}
              isModel={initialEditValue ? true : false}
            />
          )}
        />
      </div>
    );
  };

  /**
   * Effect hook to set brand options when classification options or initial edit data change
   */
  useEffect(() => {
    if (classificationOptions && classificationOptions.length && initialEditData[0]?.id) {
      if (initialEditData[0]?.classification?.id) {
        const selectedClassification = classificationOptions.find(
          (option) => option.id === initialEditData[0].classification?.id
        );
        if (selectedClassification && selectedClassification.brands.length) {
          setBrandOptionsToState(selectedClassification.brands, 0);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classificationOptions, initialEditData]);

  return (
    <>
      {isLoading && !initialEditValue && <Loader />}
      <FieldArray name={formName} initialValue={initialEditValue?.id ? initialEditData : initialValue}>
        {({ fields }) =>
          fields.map((name, index) => {
            const isLastChild = (fields?.length || 0) === index + 1;
            const isFirstChild = !index;
            return (
              <span key={`form_${name}`}>
                <div
                  className={`position-relative w-100 d-flex flex-column flex-lg-row align-items-center  ${
                    isLastChild ? '' : styles.borderBottom
                  }`}
                >
                  <div
                    className={`row w-100 gx-1dot25 ${disableOptions ? 'pe-0 pb-0' : 'pe-lg-1 pb-1 pb-lg-1 pb-lg-0'} ${
                      isFirstChild ? '' : 'mt-1dot5'
                    }`}
                  >
                    {renderMedicationName(name, index)}
                    {renderCode(name, index)}
                    {renderUrl(name, index)}
                    {renderClassification(name, fields, index)}
                    {renderBrand(name, index)}
                    {renderDosageForm(name, index)}
                    {isCategories && renderCategoryForm(name, index)}
                  </div>
                  {renderActionIcons(fields, index, isFirstChild, isLastChild)}
                </div>
                {isLastChild ? null : <div className='divider mx-neg-1dot25' />}
              </span>
            );
          })
        }
      </FieldArray>
    </>
  );
};

export default MedicationForm;
