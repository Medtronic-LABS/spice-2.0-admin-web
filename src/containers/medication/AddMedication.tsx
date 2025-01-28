import styles from './AddMedication.module.scss';
import { RouteComponentProps } from 'react-router';
import MedicationForm, { ICheckDuplicateValidation, IMedicationDataFormValues } from './MedicationForm';
import { Form, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import FormContainer from '../../components/formContainer/FormContainer';
import { Tools } from 'final-form';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import APPCONSTANTS from '../../constants/appConstants';
import { useState } from 'react';
import MedicationFormIcon from '../../assets/images/info-grey.svg';
import { PROTECTED_ROUTES } from '../../constants/route';
import { createMedicationRequest, validateMedication } from '../../store/medication/actions';
import { useDispatch } from 'react-redux';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';

export interface IMedicationFormValues {
  medication: IMedicationDataFormValues[];
}

interface IDispatchProps {
  createMedicationRequest: (data: any) => void;
  validateMedication: (data: Omit<any, 'type'>) => void;
  removeMedicationBrands: () => void;
}

interface IRouteProps {
  history: History;
}

interface IStateProps {
  loading: boolean;
}

interface IMatchParams {
  regionId: string;
  tenantId: string;
}

interface IMatchProps extends RouteComponentProps<IMatchParams> {}

type Props = IStateProps & IDispatchProps & IRouteProps & IMatchProps;

const AddMedication = (props: Props): React.ReactElement => {
  const dispatch = useDispatch();

  const [previousFieldValue, setPreviousFieldValueState] = useState([] as IMedicationDataFormValues[]);
  const [internalFormState, setStateInternalFormState] = useState(
    [] as Array<{ isValueChanged: boolean; isValid: boolean }>
  );

  const {
    medication: {
      categories: { available: isCategories }
    }
  } = useAppTypeConfigs();

  /**
   * Checks for duplicate data validation with existing form values and existing values in database
   * @param {Object} params - The parameters object
   * @param {Array} params.fields - The form fields array
   * @param {number} params.index - The index of the current field
   * @param {boolean} params.isFirstChild - Whether this is the first child in the form
   * @param {Object} params.initialValue - The initial value of the field
   * @param {boolean} params.isUpdate - Whether this is an update operation
   * @param {boolean} params.isSubmitted - Whether the form has been submitted
   * @param {Function} params.submitCb - Callback function to be called on successful validation
   */
  const checkDuplicateValidation = ({
    fields,
    index,
    isFirstChild,
    initialValue,
    isUpdate = false,
    isSubmitted = false,
    submitCb
  }: ICheckDuplicateValidation): void => {
    const { regionId } = props.match.params;
    const currentRecord = fields.value[index];
    // contains all the field values except the value of current index to check for duplicates.
    const oldRecords = fields.value.filter(
      (_record: IMedicationDataFormValues, fieldIndex: number) => fieldIndex !== index
    );
    // checks if current row values exists in the previous row values in the form
    const isRecordExists = oldRecords.some((record: IMedicationDataFormValues) => {
      let result: boolean;
      try {
        result =
          record.classification.id === currentRecord.classification.id &&
          record.brand.id === currentRecord.brand.id &&
          record.name.toLowerCase() === currentRecord.name.toLowerCase() &&
          record.dosage_form.id === currentRecord.dosage_form.id;
      } catch {
        result = false;
      }
      return result;
    });

    if (isRecordExists) {
      // shows popup if duplicate values entered in the form
      toastCenter.error(
        APPCONSTANTS.OOPS,
        APPCONSTANTS.MEDICATION_REENTERED_ERROR.replace('this medication', `"${currentRecord.name}"`)
      );
    } else if (isFirstChild || !isRecordExists) {
      const { tenantId } = props.match.params;
      // if all the form row values are unique then check if the current row values exists in the database
      const postData = {
        countryId: Number(regionId),
        classificationId: currentRecord?.classification.id,
        classificationName: currentRecord?.classification.name,
        brandId: currentRecord?.brand.id,
        brandName: currentRecord?.brand.name,
        codeDetails: {
          code: currentRecord?.codeDetails?.code,
          url: currentRecord?.codeDetails?.url
        },
        name: currentRecord?.name,
        dosageFormId: currentRecord?.dosage_form.id,
        dosageFormName: currentRecord?.dosage_form.name,
        category: {
          id: currentRecord?.category?.id,
          name: currentRecord?.category?.name
        },
        tenantId
      };
      dispatch(
        validateMedication({
          data: postData,
          successCb: () => {
            // no duplicates found
            if (!isUpdate && !isSubmitted) {
              fields.push({ ...initialValue });
            }
            setPreviousFieldValue(fields.value[index], index);
            setInternalFormState({ isValueChanged: false, isValid: true }, index);
            submitCb?.();
          },
          failureCb: (e) => {
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.MEDICATION_EXISTS_ERROR));
          }
        })
      );
    }
  };

  /**
   * Resets fields in the form state based on a substring key
   * @param {string[]} subStrOfKey - Substring to match field keys
   * @param {Object} state - The current form state
   * @param {Object} utils - Form utility functions
   */
  const resetFields = ([subStrOfKey]: [string], state: any, utils: Tools<IMedicationFormValues>) => {
    try {
      Object.keys(state.fields).forEach((key: string) => {
        if (key.includes(subStrOfKey)) {
          utils.resetFieldState(key);
        }
      });
    } catch (e) {
      toastCenter.error(APPCONSTANTS.OOPS, 'Error removing form');
    }
  };

  /**
   * Sets the new field row value or Removes the specific field row values by index
   * @param {IMedicationDataFormValues | null} value - The new value to set
   * @param {number} index - The index of the field to update
   * @param {boolean} isRemove - Whether to remove the field
   */
  const setPreviousFieldValue = (value: IMedicationDataFormValues | null, index: number, isRemove: boolean = false) => {
    const newFieldValues = [...previousFieldValue];
    if (isRemove) {
      newFieldValues.splice(index, 1);
    } else if (!isRemove && value) {
      newFieldValues[index] = value;
    }
    setPreviousFieldValueState(newFieldValues);
  };

  /**
   * Sets the new form state for value changes and validation or Removes the specific state by index
   * @param {{ isValueChanged: boolean; isValid: boolean } | null} value - The new state to set
   * @param {number} index - The index of the state to update
   * @param {boolean} isRemove - Whether to remove the state
   */
  const setInternalFormState = (
    value: { isValueChanged: boolean; isValid: boolean } | null,
    index: number,
    isRemove: boolean = false
  ) => {
    const valueUpdates = [...internalFormState];
    if (isRemove) {
      valueUpdates.splice(index, 1);
      valueUpdates[valueUpdates.length - 1].isValid = false;
    } else if (!isRemove && value) {
      valueUpdates[index] = value;
    }
    setStateInternalFormState(valueUpdates);
  };

  /**
   * Handler for form cancel
   */
  const onCancel = () => {
    goBackToMedication();
  };

  /**
   * Navigates back to the medication list page
   */
  const goBackToMedication = () => {
    const url = PROTECTED_ROUTES.medicationByRegion;
    const { regionId, tenantId } = props.match.params;
    const medicationURL = url.replace(':regionId', regionId).replace(':tenantId', tenantId);
    props.history.push(medicationURL);
  };

  /**
   * Handles form submission
   * @param {IMedicationFormValues} formValues - The form values to submit
   */
  const onSubmit = ({ medication: medicationValues }: IMedicationFormValues) => {
    const medication = medicationValues.map((medicationData: IMedicationDataFormValues) => ({
      ...medicationData,
      name: medicationData.name.trim()
    }));

    const lastChildIndex = medication.length - 1;
    // contains the form state of all field rows except the last child
    const oldInternalFormState = internalFormState.filter((_value, index) => index !== lastChildIndex);
    // checks if any existing field value changed and not saved
    const isChangesNotConfirmed = oldInternalFormState.some((value) => value?.isValueChanged);
    if (isChangesNotConfirmed) {
      toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.UNSAVED_CHANGES_MESSAGE);
      return;
    }
    checkDuplicateValidation({
      fields: { value: medication },
      index: lastChildIndex,
      isFirstChild: medication.length === 1,
      initialValue: {},
      isUpdate: false,
      isSubmitted: true,
      submitCb: () => {
        // no duplicate data found so save to database
        saveMedication(medication);
      }
    });
  };

  /**
   * Saves medication data to the database
   * @param {IMedicationDataFormValues[]} medication - The medication data to save
   */
  const saveMedication = (medication: IMedicationDataFormValues[]) => {
    const { regionId } = props.match.params;

    const data = medication.map((medicationData: IMedicationDataFormValues) => ({
      countryId: Number(regionId),
      classificationId: medicationData.classification.id,
      classificationName: medicationData.classification.name,
      brandId: medicationData.brand.id,
      brandName: medicationData.brand.name,
      name: medicationData.name,
      codeDetails: {
        code: medicationData?.codeDetails?.code,
        url: medicationData?.codeDetails?.url
      },
      dosageFormId: medicationData.dosage_form.id,
      dosageFormName: medicationData.dosage_form.name,
      category: isCategories
        ? {
            id: medicationData?.category?.id,
            name: medicationData?.category?.name
          }
        : undefined
    }));

    dispatch(
      createMedicationRequest({
        data,
        successCb: () => {
          goBackToMedication();
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.MEDICATION_CREATION_SUCCESS);
        },
        failureCb: (e: Error) =>
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.MEDICATION_CREATION_ERROR))
      })
    );
  };

  return (
    <div className={styles.addMedicationContainer}>
      <div className={`${styles.addMedicationWrapper} mx-auto pb-3dot125`}>
        <Form
          onSubmit={onSubmit}
          mutators={{
            ...arrayMutators,
            resetFields
          }}
          render={({ handleSubmit, form }: FormRenderProps<IMedicationFormValues>) => {
            const formInstance = form;
            return (
              <form onSubmit={handleSubmit}>
                <div className='row g-1dot25'>
                  <div className='col-12'>
                    <FormContainer label='Medication Details' icon={MedicationFormIcon}>
                      <MedicationForm
                        form={formInstance}
                        checkDuplicateValidation={checkDuplicateValidation}
                        previousFieldValue={previousFieldValue}
                        internalFormState={internalFormState}
                        setPreviousFieldValue={setPreviousFieldValue}
                        setInternalFormState={setInternalFormState}
                      />
                    </FormContainer>
                  </div>
                </div>
                <div className='col-12 mt-1dot25 d-flex'>
                  <button type='button' className='btn secondary-btn me-0dot625 px-1dot125 ms-auto' onClick={onCancel}>
                    Cancel
                  </button>
                  <button type='submit' className='btn primary-btn px-1dot75'>
                    Submit
                  </button>
                </div>
              </form>
            );
          }}
        />
      </div>
    </div>
  );
};

export default AddMedication;
