import APPCONSTANTS from '../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../types/BaseFieldMeta';
import { IBaseFields } from '../../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../../types/ComponentConfig';

export interface IInformationLabelFields extends IBaseFields {
  isNotDefault?: boolean;
}

const getEmptyData = (): IInformationLabelFields => ({
  id: new Date().getTime().toString() + 'InformationLabel',
  viewType: 'InformationLabel',
  title: '',
  fieldName: '',
  family: '',
  isSummary: false,
  isMandatory: false,
  isEnabled: true,
  visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
  isNotDefault: true
});

const customizableFieldMeta: IBaseFieldMeta = {
  title: {},
  fieldName: {},
  isMandatory: {},
  isEnabled: {},
  visibility: {}
};

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
