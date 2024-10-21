import APPCONSTANTS from '../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../types/BaseFieldMeta';
import { IBaseFields } from '../../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../../types/ComponentConfig';

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
  isDefault?: boolean;
  isResult?: boolean;
  unitList?: Array<{ name: string; id: string }>;
  code?: string;
  url?: string;
  resource?: string;
  ranges?: any[];
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
  isMandatory: false,
  isEnabled: true,
  isResult: true,
  visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
  hint: '',
  errorMessage: '',
  inputType: -1,
  isDefault: false,
  minLength: undefined,
  maxLength: undefined,
  ranges: []
});

const customizableFieldMeta: IBaseFieldMeta = {
  isMandatory: {},
  isNeedAction: { disabled: true },
  maxLength: {},
  minLength: {},
  contentLength: {},
  startsWith: {},
  defaultValue: { disabled: true },
  hint: {},
  isResult: {},
  unitList: {},
  code: {},
  url: {},
  resource: {},
  minValue: {},
  maxValue: {},
  inputType: {},
  title: {},
  ranges: {},
  fieldName: {},
  isEditable: {}
};

/**
 * Retrieves the JSON data for the edit text fields based on the provided configuration.
 * @param {any} json - The JSON data for the edit text fields
 * @returns {IFieldViewType} The JSON data for the edit text fields
 */
const getJSON = (json: any): IFieldViewType => {
  if (json.inputType === 0) {
    delete json.inputType;
  }
  json.fieldName = json.fieldName?.label ? json.fieldName.label : json.fieldName;
  json.ranges = json.ranges?.filter((val: any) => !!val);
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
