import { IResourceOptions } from '../labTestConfig/BaseFieldConfig';

interface IAttributeProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  visible?: boolean;
  order?: number;
  component?: string;
}

export interface ITextAttributeProps extends IAttributeProps {
  type?: string;
  maxLength?: string;
  minLength?: number;
}

export interface ISelectAttributeProps extends IAttributeProps {
  options?: any[];
  labelKey?: string;
  valueKey?: string;
  isMulti?: boolean;
}

export interface IResourceSelectAttributeProps extends IAttributeProps {
  options?: IResourceOptions;
  labelKey?: string;
  valueKey?: string;
  isMulti?: boolean;
}

export interface IBaseFieldMeta {
  title?: ITextAttributeProps;
  action?: ITextAttributeProps;
  minValue?: ITextAttributeProps;
  maxValue?: ITextAttributeProps;
  minLength?: ITextAttributeProps;
  maxLength?: ITextAttributeProps;
  startValue?: ITextAttributeProps;
  endValue?: ITextAttributeProps;
  interval?: ITextAttributeProps;
  contentLength?: ITextAttributeProps;
  pulseMinValue?: ITextAttributeProps;
  pulseMaxValue?: ITextAttributeProps;
  dependentID?: ITextAttributeProps;
  selectAll?: IAttributeProps;
  isNeededDefault?: ITextAttributeProps;
  localDataCache?: ITextAttributeProps;
  hint?: ITextAttributeProps;
  errorMessage?: ITextAttributeProps;
  familyOrder?: ITextAttributeProps;
  fieldName?: ITextAttributeProps;
  inputType?: ISelectAttributeProps;
  orientation?: ISelectAttributeProps;
  defaultValue?: ISelectAttributeProps;
  minDays?: ITextAttributeProps;
  maxDays?: ITextAttributeProps;
  unitList?: ISelectAttributeProps;
  code?: ITextAttributeProps;
  url?: ITextAttributeProps;
  resource?: IResourceSelectAttributeProps;
  isResult?: IAttributeProps;
  totalCount?: ISelectAttributeProps;
  mandatoryCount?: ISelectAttributeProps;
  visibility?: ISelectAttributeProps;
  targetViews?: IAttributeProps;
  family?: ISelectAttributeProps;
  isMandatory?: IAttributeProps;
  isEnabled?: IAttributeProps;
  isAboveUpperLimit?: IAttributeProps;
  disableFutureDate?: IAttributeProps;
  isNeedAction?: IAttributeProps;
  isNew?: IAttributeProps;
  isEditable?: IAttributeProps;
  instructions?: IAttributeProps;
  optionType?: IAttributeProps;
  optionsList?: IAttributeProps;
  startsWith?: IAttributeProps;
  condition?: IAttributeProps;
  ranges?: IAttributeProps;
  startDate?: IAttributeProps;
  endDate?: IAttributeProps;
  isEnrollment?: IAttributeProps;
  unitMeasurement?: ISelectAttributeProps;
  isSummary?: IAttributeProps;
  readOnly?: IAttributeProps;
}
