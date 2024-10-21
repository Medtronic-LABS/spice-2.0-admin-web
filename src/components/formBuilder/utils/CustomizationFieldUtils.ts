import { InputTypes } from '../customizationConfig/BaseFieldConfig';
import CARD_VIEW_CONFIG from '../customizationConfig/fieldGroups/CardView';
import AGE_CONFIG from '../customizationConfig/fieldGroups/creatableViews/Age';
import BP_CONFIG from '../customizationConfig/fieldGroups/creatableViews/BPInput';
import EDIT_TEXT_CONFIG from '../customizationConfig/fieldGroups/creatableViews/EditText';
import HEIGHT_CONFIG from '../customizationConfig/fieldGroups/creatableViews/Height';
import SCALE_INDICATOR_CONFIG from '../customizationConfig/fieldGroups/creatableViews/ScaleIndicator';
import INSTRUCTION_CONFIG from '../customizationConfig/fieldGroups/creatableViews/Instruction';
import RADIO_GROUP_CONFIG from '../customizationConfig/fieldGroups/creatableViews/RadioGroup';
import SPINNER_CONFIG from '../customizationConfig/fieldGroups/creatableViews/Spinner';
import COLLAPSIBLE_VIEW_CONFIG from '../customizationConfig/fieldGroups/creatableViews/CollapsibleView';
import CHECKBOX_CONFIG from '../customizationConfig/fieldGroups/creatableViews/CheckBox';
import TIME_VIEW_CONFIG from '../customizationConfig/fieldGroups/creatableViews/TimeView';
import TEXT_LABEL_CONFIG from '../customizationConfig/fieldGroups/TextLabel';
import INFORMATION_LABEL_CONFIG from '../customizationConfig/fieldGroups/creatableViews/InformationLabel';
import { IComponentConfig } from '../types/ComponentConfig';
import SINGLE_SELECTION_VIEW_CONFIG from '../customizationConfig/fieldGroups/creatableViews/SingleSelectionView';
import DATE_PICKER_CONFIG from '../customizationConfig/fieldGroups/creatableViews/DatePickerView';
import DIALOG_CHECKBOX_CONFIG from '../customizationConfig/fieldGroups/creatableViews/DialogCheckbox';
import MENTAL_HEALTH_CONFIG from '../customizationConfig/fieldGroups/MentalHealthView';

export const creatableViews = [
  { label: 'Radio Input', value: 'RadioGroup' },
  { label: 'Text Input', value: 'EditText' },
  { label: 'Select Input', value: 'Spinner' },
  { label: 'Slider', value: 'ScaleIndicator' },
  { label: 'Multi Select Input', value: 'CheckBox' },
  { label: 'Single Selection', value: 'SingleSelectionView' },
  { label: 'Instructions', value: 'Instruction' }
];

export const unitMeasurementFields = ['glucose', 'hba1c'];

export const isEditableFields = [
  'firstName',
  'middleName',
  'lastName',
  'phoneNumber',
  'phoneNumberCategory',
  'landmark',
  'occupation',
  'insuranceStatus',
  'insuranceType',
  'insuranceId',
  'otherInsurance'
];

/**
 * Retrieves the configuration for the provided view type.
 * @param {string} viewType - The view type to retrieve the configuration for
 * @returns {IComponentConfig} The configuration for the provided view type
 */
export const getConfigByViewType = (viewType: string): IComponentConfig => {
  switch (viewType) {
    case 'BP':
      return BP_CONFIG;
    case 'RadioGroup':
      return RADIO_GROUP_CONFIG;
    case 'SingleSelectionView':
      return SINGLE_SELECTION_VIEW_CONFIG;
    case 'Age':
      return AGE_CONFIG;
    case 'Height':
      return HEIGHT_CONFIG;
    case 'TimeView':
      return TIME_VIEW_CONFIG;
    case 'EditText':
      return EDIT_TEXT_CONFIG;
    case 'Spinner':
      return SPINNER_CONFIG;
    case 'CollapsibleView':
      return COLLAPSIBLE_VIEW_CONFIG;
    case 'CheckBox':
      return CHECKBOX_CONFIG;
    case 'DialogCheckbox':
      return DIALOG_CHECKBOX_CONFIG;
    case 'ScaleIndicator':
      return SCALE_INDICATOR_CONFIG;
    case 'Instruction':
      return INSTRUCTION_CONFIG;
    case 'MentalHealthView':
      return MENTAL_HEALTH_CONFIG;
    case 'TextLabel':
      return TEXT_LABEL_CONFIG;
    case 'InformationLabel':
      return INFORMATION_LABEL_CONFIG;
    case 'DatePicker':
      return DATE_PICKER_CONFIG;
    case 'CardView':
      return CARD_VIEW_CONFIG;
    default:
      return EDIT_TEXT_CONFIG;
  }
};

/**
 * Switches the input types related fields based on the provided field value.
 * @param {number} fieldValue - The field value to switch the input types related fields for
 * @param {any} obj - The object to switch the input types related fields for
 */
export const inputTypesSwitch = (fieldValue: number, obj: any) => {
  const inputTypeRelatedFields: any = {
    minValue: false,
    maxValue: false,
    maxLength: false,
    minLength: false,
    contentLength: false,
    startsWith: false
  };
  switch (fieldValue) {
    case InputTypes.NUMBER:
    case InputTypes.DECIMAL:
      inputTypeRelatedFields.minValue = true;
      inputTypeRelatedFields.maxValue = true;
      break;
    case InputTypes.PHONE_NUMBER:
      inputTypeRelatedFields.contentLength = true;
      inputTypeRelatedFields.startsWith = true;
      break;
    case InputTypes.DEFAULT:
    default:
      inputTypeRelatedFields.minLength = true;
      inputTypeRelatedFields.maxLength = true;
  }

  Object.keys(inputTypeRelatedFields).forEach((key: any) => {
    if (inputTypeRelatedFields[key]) {
      obj[key] = null;
    } else {
      if (key in obj) {
        delete obj[key];
      }
    }
  });
};
