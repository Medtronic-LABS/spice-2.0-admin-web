import APPCONSTANTS from '../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../types/BaseFieldMeta';
import { IBaseFields } from '../../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../../types/CustomizationComponentConfig';

export interface IDialogCheckboxFields extends IBaseFields {
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
 * Retrieves the empty data for the dialog checkbox fields based on the provided configuration.
 * @returns {IDialogCheckboxFields} The empty data for the dialog checkbox fields
 */
const getEmptyData = (): IDialogCheckboxFields => ({
  id: new Date().getTime().toString() + 'DialogCheckbox',
  viewType: 'DialogCheckbox',
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
  isNotDefault: true,
  minLength: undefined,
  maxLength: undefined
});

const customizableFieldMeta: IBaseFieldMeta = {
  visibility: {},
  isEnabled: {},
  isEnrollment: {},
  isMandatory: {},
  maxLength: {},
  minLength: {},
  errorMessage: {},
  title: {},
  condition: {},
  fieldName: {}
};

/**
 * Retrieves the JSON data for the dialog checkbox fields based on the provided configuration.
 * @param {any} json - The JSON data for the dialog checkbox fields
 * @returns {IFieldViewType} The JSON data for the dialog checkbox fields
 */
const getJSON = (json: any): IFieldViewType => {
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

const DIALOG_CHECKBOX_CONFIG: IComponentConfig = {
  getEmptyData,
  customizableFieldMeta,
  getJSON
};

export default DIALOG_CHECKBOX_CONFIG;
