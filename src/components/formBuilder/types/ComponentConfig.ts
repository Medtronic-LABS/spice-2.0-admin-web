import { ICardViewFields } from '../config/fieldGroups/CardView';
import { ICheckBoxFields } from '../config/fieldGroups/creatableViews/CheckBox';
import { IEditTextFields } from '../config/fieldGroups/creatableViews/EditText';
import { IRadioGroupFields } from '../config/fieldGroups/creatableViews/RadioGroup';
import { IDropdownFields } from '../config/fieldGroups/creatableViews/Dropdown';
import { ITextLabelFields } from '../config/fieldGroups/TextLabel';

import { IBaseFieldMeta } from './BaseFieldMeta';
import { IDialogCheckboxFields } from '../config/fieldGroups/creatableViews/DialogCheckbox';
import { IDatePickerFields } from '../config/fieldGroups/creatableViews/DatePickerView';

export type IFieldViewType =
  | IEditTextFields
  | IRadioGroupFields
  | IDropdownFields
  | ICheckBoxFields
  | ICardViewFields
  | IMentalHealthViewFields
  | ITextLabelFields
  | IDatePickerFields;

export interface IComponentConfig {
  getEmptyData: () => IFieldViewType;
  customizableFieldMeta: IBaseFieldMeta;
  getJSON?: (json: any) => IFieldViewType;
}
