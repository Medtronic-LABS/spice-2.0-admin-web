import APPCONSTANTS from '../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../types/BaseFieldMeta';
import { IBaseFields } from '../../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../../types/CustomizationComponentConfig';

export interface IDropdownFields extends IBaseFields {
  hint?: string;
  visibility: string;
  defaultValue?: string;
  isNew?: boolean;
  optionsList?: Array<{ name: string; id: string }>;
  errorMessage?: string;
  isDefault?: boolean;
  isResult?: boolean;
}

const getEmptyData = (): IDropdownFields => ({
  id: new Date().getTime().toString() + 'Spinner',
  viewType: 'Spinner',
  title: '',
  fieldName: '',
  family: '',
  isMandatory: false,
  isEnabled: true,
  isEnrollment: true,
  visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
  condition: [],
  hint: '',
  optionsList: [],
  errorMessage: '',
  defaultValue: '',
  isDefault: false,
  isResult: false
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
  isResult: {},
  unitList: {},
  code: {},
  url: {},
  resource: {}
};

const getJSON = (json: any): IFieldViewType => {
  json.fieldName = json.fieldName?.label ? json.fieldName.label : json.fieldName;
  json.condition = json.condition?.filter((val: any) => !!val);
  return json;
};

const DROPDOWN_CONFIG: IComponentConfig = {
  getEmptyData,
  customizableFieldMeta,
  getJSON
};

export default DROPDOWN_CONFIG;
