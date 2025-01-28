import { IBaseFieldMeta } from '../../types/BaseFieldMeta';
import { IComponentConfig, IFieldViewType } from '../../types/CustomizationComponentConfig';

export interface ICardViewFields {
  viewType: string;
  id: string;
  title: string;
  familyOrder?: number;
}

/**
 * Retrieves the empty data for the card view fields based on the provided configuration.
 * @returns {ICardViewFields} The empty data for the card view fields
 */
const getEmptyData = (): ICardViewFields => ({
  id: new Date().getTime().toString() + 'CardView',
  viewType: 'CardView',
  title: '',
  familyOrder: -1
});

const customizableFieldMeta: IBaseFieldMeta = {
  title: {}
};

/**
 * Retrieves the JSON data for the card view fields based on the provided configuration.
 * @param {any} json - The JSON data for the card view fields
 * @returns {IFieldViewType} The JSON data for the card view fields
 */
const getJSON = (json: any): IFieldViewType => {
  return json;
};

const CARD_VIEW_CONFIG: IComponentConfig = {
  getEmptyData,
  customizableFieldMeta,
  getJSON
};

export default CARD_VIEW_CONFIG;
