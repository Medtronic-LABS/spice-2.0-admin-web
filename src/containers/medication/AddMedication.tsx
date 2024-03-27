import styles from './AddMedication.module.scss';
import { RouteComponentProps } from 'react-router';
import MedicationForm, { ICheckDuplicateValidation, IMedicationDataFormValues } from './MedicationForm';
import { Form, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import FormContainer from '../../components/formContainer/FormContainer';
import { Tools } from 'final-form';
import toastCenter from '../../utils/toastCenter';
import APPCONSTANTS from '../../constants/appConstants';
import { useState } from 'react';
import MedicationFormIcon from '../../assets/images/info-grey.svg';
import { PROTECTED_ROUTES } from '../../constants/route';

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

// interface IAddMedicationState {
//   previousFieldValue: IMedicationDataFormValues[];
//   internalFormState: Array<{ isValueChanged: boolean; isValid: boolean }>;
// }

interface IMatchProps extends RouteComponentProps<IMatchParams> {}

type Props = IStateProps & IDispatchProps & IRouteProps & IMatchProps;

const AddMedication = (props: Props) => {
  const [newState, SetState] = useState({
    previousFieldValue: [] as IMedicationDataFormValues[],
    internalFormState: [] as Array<{ isValueChanged: boolean; isValid: boolean }>
  });

  /**
   * This function checks for duplicate data validation with existing form values and existing values in database
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
          record.classification.classification.id === currentRecord.classification.classification.id &&
          record.brand.brand.id === currentRecord.brand.brand.id &&
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
      // if all the form row values are unique then check if the current row values exists in the database
      // Validate medication API
    }
  };

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
   */
  const setPreviousFieldValue = (value: IMedicationDataFormValues | null, index: number, isRemove = false) => {
    const newFieldValues = [...newState.previousFieldValue];
    if (isRemove) {
      newFieldValues.splice(index, 1);
    } else if (!isRemove && value) {
      newFieldValues[index] = value;
    }
    SetState({ ...newState, previousFieldValue: newFieldValues });
  };

  /**
   * Sets the new form state for value changes and validation or Removes the specific state by index
   */
  const setInternalFormState = (
    value: { isValueChanged: boolean; isValid: boolean } | null,
    index: number,
    isRemove = false
  ) => {
    const valueUpdates = [...newState.internalFormState];
    if (isRemove) {
      valueUpdates.splice(index, 1);
      valueUpdates[valueUpdates.length - 1].isValid = false;
    } else if (!isRemove && value) {
      valueUpdates[index] = value;
    }
    SetState({ ...newState, internalFormState: valueUpdates });
  };

  /**
   * Handler for form cancel
   */
  const onCancel = () => {
    goBackToMedication();
  };

  const goBackToMedication = () => {
    const url = PROTECTED_ROUTES.medicationByRegion;
    const { regionId, tenantId } = props.match.params;
    const medicationURL = url.replace(':regionId', regionId).replace(':tenantId', tenantId);
    props.history.push(medicationURL);
  };

  const onSubmit = () => {
    //
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
            const { previousFieldValue, internalFormState } = newState;
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
