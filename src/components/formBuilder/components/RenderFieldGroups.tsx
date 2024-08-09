import { baseFieldMeta } from '../labTestConfig/BaseFieldConfig';
import { IComponentConfig } from '../types/ComponentConfig';
import { getConfigByViewType } from '../utils/FieldUtils';
import { IBaseFieldMeta } from '../types/BaseFieldMeta';
import RenderFields from './RenderFields';
import { baseFieldMeta as regionBaseFieldMeta } from '../customizationConfig/BaseFieldConfig';
import { IComponentConfig as ICustomizationComponentConfig } from '../types/CustomizationComponentConfig';
import { getConfigByViewType as getCustomizationConfigViewType } from '../utils/CustomizationFieldUtils';

const RenderFieldGroups = ({
  obj,
  name,
  form,
  unAddedFields,
  targetIds,
  isNew,
  newlyAddedIds,
  handleUpdateFieldName,
  isFieldNameChangable,
  addNewFieldDisabled,
  hashFieldIdsWithTitle,
  hashFieldIdsWithFieldName,
  isRegionCustomizeForm = false
}: any) => {
  let componentConfig: IComponentConfig | ICustomizationComponentConfig;

  if (isCustomizationForm) {
    componentConfig = getCustomizationConfigViewType(obj?.viewType);
  } else {
    componentConfig = getConfigByViewType(obj?.viewType);
  }
  return (
    <>
      {Object.keys(obj)
        .sort((fieldA: string, fieldB: string) => {
          if (isCustomizationForm) {
            return (
              (regionBaseFieldMeta[fieldA as keyof IBaseFieldMeta]?.order || 0) -
              (regionBaseFieldMeta[fieldB as keyof IBaseFieldMeta]?.order || 0)
            );
          }
          return (
            (baseFieldMeta[fieldA as keyof IBaseFieldMeta]?.order || 0) -
            (baseFieldMeta[fieldB as keyof IBaseFieldMeta]?.order || 0)
          );
        })
        .map((field) => {
          if (componentConfig.customizableFieldMeta.hasOwnProperty(field)) {
            const inputProps = {
              ...baseFieldMeta[field as keyof IBaseFieldMeta],
              ...componentConfig.customizableFieldMeta[field as keyof IBaseFieldMeta],
              ...(isRegionCustomizeForm ? { disabled: obj.readOnly === true } : {})
            };
            return (
              <RenderFields
                key={field}
                obj={obj}
                name={name}
                form={form}
                fieldName={field}
                inputProps={inputProps}
                unAddedFields={unAddedFields}
                targetIds={targetIds}
                isNew={isNew}
                newlyAddedIds={newlyAddedIds}
                handleUpdateFieldName={handleUpdateFieldName}
                // isAccountCustomization={isAccountCustomization}
                isFieldNameChangable={isFieldNameChangable}
                addNewFieldDisabled={addNewFieldDisabled}
                hashFieldIdsWithTitle={hashFieldIdsWithTitle}
                hashFieldIdsWithFieldName={hashFieldIdsWithFieldName}
                isRegionCustomizeForm={isRegionCustomizeForm}
              />
            );
          } else {
            return null;
          }
        })}
    </>
  );
};

export default RenderFieldGroups;
