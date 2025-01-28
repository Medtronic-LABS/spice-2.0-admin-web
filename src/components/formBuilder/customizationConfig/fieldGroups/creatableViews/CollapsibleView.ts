import APPCONSTANTS from '../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../types/BaseFieldMeta';
import { IBaseFields } from '../../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../../types/CustomizationComponentConfig';

export interface ICollapsibleViewFields extends IBaseFields {
  hint?: string;
  visibility: string;
  defaultValue?: string;
  isNew?: boolean;
  optionsList?: Array<{ name: string; id: string }>;
  errorMessage?: string;
  isNotDefault?: boolean;
  targetViews: Array<{ name: string; id: string }>;
}

/**
 * Retrieves the empty data for the collapsible view fields based on the provided configuration.
 * @returns {ICollapsibleViewFields} The empty data for the collapsible view fields
 */
const getEmptyData = (): ICollapsibleViewFields => ({
  id: new Date().getTime().toString() + 'CollapsibleView',
  viewType: 'CollapsibleView',
  title: '',
  fieldName: '',
  family: '',
  isSummary: false,
  isMandatory: false,
  isEnabled: true,
  visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
  condition: [],
  hint: '',
  optionsList: [],
  targetViews: [],
  errorMessage: '',
  defaultValue: '',
  isNotDefault: true
});

const customizableFieldMeta: IBaseFieldMeta = {
  visibility: {},
  isEnabled: {},
  isMandatory: {},
  defaultValue: {},
  title: {},
  fieldName: {},
  optionsList: {},
  targetViews: {},
  condition: {},
  errorMessage: {},
  isEditable: {},
  unitMeasurement: {}
};

/**
 * Retrieves the JSON data for the collapsible view fields based on the provided configuration.
 * @param {any} json - The JSON data for the collapsible view fields
 * @returns {IFieldViewType} The JSON data for the collapsible view fields
 */
const getJSON = (json: any): IFieldViewType => {
  json.fieldName = json.fieldName?.label ? json.fieldName.label : json.fieldName;
  json.condition = json.condition?.filter((val: any) => !!val);
  return json;
};

const COLLAPSIBLE_VIEW_CONFIG: IComponentConfig = {
  getEmptyData,
  customizableFieldMeta,
  getJSON
};

export default COLLAPSIBLE_VIEW_CONFIG;
