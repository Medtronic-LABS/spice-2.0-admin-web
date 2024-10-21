import APPCONSTANTS from '../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../types/BaseFieldMeta';
import { IBaseFields } from '../../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../../types/CustomizationComponentConfig';

export interface ISpinnerFields extends IBaseFields {
  hint?: string;
  visibility: string;
  defaultValue?: string;
  isNew?: boolean;
  optionsList?: Array<{ name: string; id: string }>;
  errorMessage?: string;
  isNotDefault?: boolean;
}

/**
 * Retrieves the empty data for the spinner fields based on the provided configuration.
 * @returns {ISpinnerFields} The empty data for the spinner fields
 */
const getEmptyData = (): ISpinnerFields => ({
  id: new Date().getTime().toString() + 'Spinner',
  viewType: 'Spinner',
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
  optionsList: [],
  errorMessage: '',
  defaultValue: '',
  isNotDefault: true
});

const customizableFieldMeta: IBaseFieldMeta = {
  visibility: {},
  isEnabled: {},
  isEnrollment: {},
  isMandatory: {},
  defaultValue: {},
  title: {},
  fieldName: {},
  optionsList: {},
  condition: {},
  errorMessage: {},
  isEditable: {},
  unitMeasurement: {}
};

/**
 * Retrieves the JSON data for the spinner fields based on the provided configuration.
 * @param {any} json - The JSON data for the spinner fields
 * @returns {IFieldViewType} The JSON data for the spinner fields
 */
const getJSON = (json: any): IFieldViewType => {
  json.fieldName = json.fieldName?.label ? json.fieldName.label : json.fieldName;
  json.condition = json.condition?.filter((val: any) => !!val);
  return json;
};

const SPINNER_CONFIG: IComponentConfig = {
  getEmptyData,
  customizableFieldMeta,
  getJSON
};

export default SPINNER_CONFIG;
