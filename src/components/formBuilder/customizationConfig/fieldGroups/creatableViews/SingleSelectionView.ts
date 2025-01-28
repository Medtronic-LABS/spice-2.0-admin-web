import APPCONSTANTS from '../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../types/BaseFieldMeta';
import { IBaseFields } from '../../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../../types/CustomizationComponentConfig';

export interface ISingleSelectionFields extends IBaseFields {
  orientation: number;
  visibility: string;
  defaultValue?: string;
  optionsList: Array<{ name: string; id: string }>;
  errorMessage?: string;
  isNotDefault?: boolean;
}

/**
 * Retrieves the empty data for the single selection fields based on the provided configuration.
 * @returns {ISingleSelectionFields} The empty data for the single selection fields
 */
const getEmptyData = (): ISingleSelectionFields => ({
  id: new Date().getTime().toString() + 'SingleSelectionView',
  viewType: 'SingleSelectionView',
  title: '',
  fieldName: '',
  family: '',
  isSummary: false,
  isMandatory: false,
  isEnabled: true,
  isEnrollment: true,
  visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
  condition: [],
  optionsList: [],
  orientation: 0,
  errorMessage: '',
  isNotDefault: true
});

const customizableFieldMeta: IBaseFieldMeta = {
  orientation: {},
  visibility: {},
  title: {},
  fieldName: {},
  isMandatory: {},
  optionsList: {},
  condition: {},
  errorMessage: {},
  isEnabled: {},
  isEditable: {},
  isEnrollment: {}
};

/**
 * Retrieves the JSON data for the single selection fields based on the provided configuration.
 * @param {any} json - The JSON data for the single selection fields
 * @returns {IFieldViewType} The JSON data for the single selection fields
 */
const getJSON = (json: any): IFieldViewType => {
  json.fieldName = json.fieldName?.label ? json.fieldName.label : json.fieldName;
  json.condition = json.condition?.filter((val: any) => !!val);
  return json;
};

const SINGLE_SELECTION_VIEW_CONFIG: IComponentConfig = {
  getEmptyData,
  customizableFieldMeta,
  getJSON
};

export default SINGLE_SELECTION_VIEW_CONFIG;
