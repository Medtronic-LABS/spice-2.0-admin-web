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
  hint: '',
  optionsList: [],
  errorMessage: '',
  isDefault: false,
  isResult: true
});

const customizableFieldMeta: IBaseFieldMeta = {
  visibility: {},
  isEnabled: {},
  isEnrollment: {},
  isMandatory: {},
  title: {},
  fieldName: {},
  optionsList: {},
  errorMessage: {},
  isEditable: {},
  isResult: {},
  code: {},
  url: {},
  resource: {}
};

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
