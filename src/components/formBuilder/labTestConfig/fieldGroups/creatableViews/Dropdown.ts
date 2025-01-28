import APPCONSTANTS from '../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../types/BaseFieldMeta';
import { IBaseFields } from '../../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../../types/ComponentConfig';

export interface IDropdownFields extends IBaseFields {
  hint?: string;
  visibility: string;
  isNew?: boolean;
  optionsList?: Array<{ name: string; id: string }>;
  errorMessage?: string;
  isDefault?: boolean;
  isResult?: boolean;
}

/**
 * Retrieves the empty data for the dropdown fields based on the provided configuration.
 * @returns {IDropdownFields} The empty data for the dropdown fields
 */
const getEmptyData = (): IDropdownFields => ({
  id: new Date().getTime().toString() + 'Spinner',
  viewType: 'Spinner',
  title: '',
  fieldName: '',
  family: '',
  isMandatory: false,
  isEnabled: true,
  visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
  hint: '',
  optionsList: [],
  errorMessage: '',
  isDefault: false,
  isResult: true
});

const customizableFieldMeta: IBaseFieldMeta = {
  isMandatory: {},
  title: {},
  fieldName: {},
  optionsList: {},
  isEditable: {},
  isResult: {},
  code: {},
  url: {},
  resource: {}
};

/**
 * Retrieves the JSON data for the dropdown fields based on the provided configuration.
 * @param {any} json - The JSON data for the dropdown fields
 * @returns {IFieldViewType} The JSON data for the dropdown fields
 */
const getJSON = (json: any): IFieldViewType => {
  json.fieldName = json.fieldName?.label ? json.fieldName.label : json.fieldName;
  return json;
};

const DROPDOWN_CONFIG: IComponentConfig = {
  getEmptyData,
  customizableFieldMeta,
  getJSON
};

export default DROPDOWN_CONFIG;
