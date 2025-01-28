import APPCONSTANTS from '../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../types/BaseFieldMeta';
import { IBaseFields } from '../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../types/CustomizationComponentConfig';

export interface ITextLabelFields extends IBaseFields {
  viewType: string;
  id: string;
  title: string;
  family: string;
  fieldName: string;
  isNew?: boolean;
  isMandatory?: boolean;
  isEnabled?: boolean;
  isEnrollment?: boolean;
  isNotDefault?: boolean;
}

/**
 * Retrieves the empty data for the text label fields based on the provided configuration.
 * @returns {ITextLabelFields} The empty data for the text label fields
 */
const getEmptyData = (): ITextLabelFields => ({
  id: new Date().getTime().toString() + 'TextLabel',
  viewType: 'TextLabel',
  title: '',
  fieldName: '',
  family: '',
  isSummary: false,
  isMandatory: false,
  isEnabled: true,
  isEnrollment: true,
  visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
  isNotDefault: true
});

const customizableFieldMeta: IBaseFieldMeta = {
  title: {},
  isMandatory: {},
  isEnabled: {},
  isEnrollment: {},
  visibility: {},
  fieldName: {},
  isEditable: {},
  unitMeasurement: {}
};

/**
 * Retrieves the JSON data for the text label fields based on the provided configuration.
 * @param {any} json - The JSON data for the text label fields
 * @returns {IFieldViewType} The JSON data for the text label fields
 */
const getJSON = (json: any): IFieldViewType => {
  json.fieldName = json.fieldName?.label ? json.fieldName.label : json.fieldName;
  return json;
};

const TEXT_LABEL_CONFIG: IComponentConfig = {
  getEmptyData,
  customizableFieldMeta,
  getJSON
};

export default TEXT_LABEL_CONFIG;
