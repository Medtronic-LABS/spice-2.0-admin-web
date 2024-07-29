import { ICondition } from './ConditionTypes';

export interface IBaseFields {
  id: string;
  viewType: string;
  title: string;
  fieldName: string;
  family: string;
  isEnabled?: boolean;
  isEnrollment?: boolean;
  visibility: string;
  isMandatory?: boolean;
  condition?: ICondition[];
  isNeededDefault?: string;
  totalCount?: number;
  isEditable?: boolean;
}
