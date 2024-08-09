import { ICardViewFields } from '../config/fieldGroups/CardView';
import { ICheckBoxFields } from '../config/fieldGroups/creatableViews/CheckBox';
import { IEditTextFields } from '../config/fieldGroups/creatableViews/EditText';
import { IRadioGroupFields } from '../config/fieldGroups/creatableViews/RadioGroup';
import { ISpinnerFields } from '../config/fieldGroups/creatableViews/Spinner';
import { IInformationLabelFields } from '../config/fieldGroups/creatableViews/InformationLabel';
import { ITimeViewFields } from '../config/fieldGroups/creatableViews/TimeView';
import { IMentalHealthViewFields } from '../config/fieldGroups/MentalHealthView';
import { ITextLabelFields } from '../config/fieldGroups/TextLabel';

import { IBaseFieldMeta } from './BaseFieldMeta';
import { IDialogCheckboxFields } from '../config/fieldGroups/creatableViews/DialogCheckbox';
import { IDatePickerFields } from '../config/fieldGroups/creatableViews/DatePickerView';

export type IFieldViewType =
  | IEditTextFields
  | IRadioGroupFields
  | IDropdownFields
  | IDropdownFields
  | ICheckBoxFields
  | ICardViewFields
  | IMentalHealthViewFields
  | ITextLabelFields
  | IInformationLabelFields
  | IDialogCheckboxFields
  | IDatePickerFields;

export interface IComponentConfig {
  getEmptyData: () => IFieldViewType;
  customizableFieldMeta: IBaseFieldMeta;
  getJSON?: (json: any) => IFieldViewType;
}
