import APPCONSTANTS from '../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../types/BaseFieldMeta';
import { IBaseFields } from '../../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../../types/CustomizationComponentConfig';

export interface IInformationLabelFields extends IBaseFields {
  isNotDefault?: boolean;
}

/**
 * Retrieves the empty data for the information label fields based on the provided configuration.
 * @returns {IInformationLabelFields} The empty data for the information label fields
 */
const getEmptyData = (): IInformationLabelFields => ({
  id: new Date().getTime().toString() + 'InformationLabel',
  viewType: 'InformationLabel',
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
  fieldName: {},
  isMandatory: {},
  isEnabled: {},
  isEnrollment: {},
  visibility: {}
};

/**
 * Retrieves the JSON data for the information label fields based on the provided configuration.
 * @param {any} json - The JSON data for the information label fields
 * @returns {IFieldViewType} The JSON data for the information label fields
 */
const getJSON = (json: any): IFieldViewType => {
  json.fieldName = json.fieldName?.label ? json.fieldName.label : json.fieldName;
  return json;
};

const INFORMATION_LABEL_CONFIG: IComponentConfig = {
  getEmptyData,
  customizableFieldMeta,
  getJSON
};

export default INFORMATION_LABEL_CONFIG;
