import APPCONSTANTS from '../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../types/BaseFieldMeta';
import { IBaseFields } from '../../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../../types/ComponentConfig';

export interface IRadioGroupFields extends IBaseFields {
  orientation: number;
  visibility: string;
  defaultValue?: string;
  optionsList: Array<{ name: string; id: string }>;
  errorMessage?: string;
  isDefault?: boolean;
}

const getEmptyData = (): IRadioGroupFields => ({
  id: new Date().getTime().toString() + 'RadioGroup',
  viewType: 'RadioGroup',
  title: '',
  fieldName: '',
  family: '',
  isMandatory: false,
  isEnabled: true,
  isEnrollment: true,
  visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
  optionsList: [],
  orientation: 0,
  errorMessage: '',
  isDefault: false
});

const customizableFieldMeta: IBaseFieldMeta = {
  orientation: {},
  visibility: {},
  title: {},
  fieldName: {},
  isMandatory: {},
  optionsList: {},
  errorMessage: {},
  isEnabled: {},
  isEditable: {}
};

const getJSON = (json: any): IFieldViewType => {
  json.fieldName = json.fieldName?.label ? json.fieldName.label : json.fieldName;
  return json;
};

const RADIO_GROUP_CONFIG: IComponentConfig = {
  getEmptyData,
  customizableFieldMeta,
  getJSON
};

export default RADIO_GROUP_CONFIG;
