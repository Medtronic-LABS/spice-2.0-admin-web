import APPCONSTANTS from '../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../types/BaseFieldMeta';
import { IBaseFields } from '../../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../../types/CustomizationComponentConfig';
import { unitMeasurementFields } from '../../../utils/CustomizationFieldUtils';

export interface IEditTextFields extends IBaseFields {
  hint?: string;
  maxLength?: number;
  minLength?: number;
  contentLength?: number;
  errorMessage?: string;
  inputType?: number;
  defaultValue?: string;
  minValue?: number;
  maxValue?: number;
  isNeedAction?: boolean;
  isNotDefault?: boolean;
}

/**
 * Retrieves the empty data for the edit text fields based on the provided configuration.
 * @returns {IEditTextFields} The empty data for the edit text fields
 */
const getEmptyData = (): IEditTextFields => ({
  id: new Date().getTime().toString() + 'EditText',
  viewType: 'EditText',
  title: '',
  fieldName: '',
  family: '',
  isSummary: false,
  isMandatory: false,
  isEnabled: true,
  isEnrollment: true,
  visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
  condition: [],
  hint: '',
  errorMessage: '',
  inputType: -1,
  isNotDefault: true,
  minLength: undefined,
  maxLength: undefined
});

const customizableFieldMeta: IBaseFieldMeta = {
  visibility: {},
  isEnabled: {},
  isEnrollment: {},
  isMandatory: {},
  isNeedAction: { disabled: true },
  maxLength: {},
  minLength: {},
  contentLength: {},
  startsWith: {},
  defaultValue: { disabled: true },
  hint: {},
  errorMessage: {},
  minValue: {},
  maxValue: {},
  inputType: {},
  title: {},
  condition: {},
  fieldName: {},
  unitMeasurement: {},
  isEditable: {}
};

/**
 * Retrieves the JSON data for the edit text fields based on the provided configuration.
 * @param {any} json - The JSON data for the edit text fields
 * @returns {IFieldViewType} The JSON data for the edit text fields
 */
const getJSON = (json: any): IFieldViewType => {
  if (json.id && !unitMeasurementFields.includes(json.id)) {
    delete json.unitMeasurement;
  }
  if (json.inputType === 0) {
    delete json.inputType;
  }
  json.fieldName = json.fieldName?.label ? json.fieldName.label : json.fieldName;
  json.condition = json.condition?.filter((val: any) => !!val);
  if (json.minValue) {
    json.minValue = Number(json.minValue);
  }
  if (json.maxValue) {
    json.maxValue = Number(json.maxValue);
  }
  return json;
};

const EDIT_TEXT_CONFIG: IComponentConfig = {
  getEmptyData,
  customizableFieldMeta,
  getJSON
};

export default EDIT_TEXT_CONFIG;
