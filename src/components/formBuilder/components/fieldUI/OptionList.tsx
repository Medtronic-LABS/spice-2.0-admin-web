import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import TextInput from '../../../../components/formFields/TextInput';
import { required } from '../../../../utils/validation';
import styles from '../../styles/FormBuilder.module.scss';
import TagInput from './TagInput';

const BooleanOptionsRender = ({ name, obj, field }: any) => {
  const booleanFieldConfig = [
    { id: true, label: 'Positive Label', className: styles.trueLabel, error: 'Please add the positive value' },
    { id: false, label: 'Negative Label', className: 'falseLabel', error: 'Please add the negative value' }
  ];

  const parseValue = (item: any, value: any) => {
    // reset eq condition field on remove options list value
    if ('condition' in obj) {
      obj.condition.forEach((condition: any, ind: number) => {
        if ('eq' in condition) {
          if (condition.eq === item.name) {
            obj.condition[ind].eq = '';
          }
        }
      });
    }
    return value;
  };

  return (
    <div className='d-flex'>
      {obj[field] && (
        <FieldArray name={name}>
          {(_props) =>
            obj[field].map((item: any, index: any) => (
              <div key={index} className='col'>
                <Field parse={(value) => parseValue(item, value)} name={`${name}[${index}].name`} validate={required}>
                  {({ input, meta }) => {
                    const config = booleanFieldConfig.find((fieldConfig: any) => fieldConfig.id === item.id);
                    return (
                      <div key={index} className='d-flex flex-row boolean-options'>
                        <div className={config?.className}>
                          <TextInput
                            {...input}
                            label={config?.label}
                            required={true}
                            error={meta?.error ? config?.error : ''}
                          />
                        </div>
                      </div>
                    );
                  }}
                </Field>
              </div>
            ))
          }
        </FieldArray>
      )}
    </div>
  );
};

const StringOptionsRender = ({ name, obj, field, inputProps }: any) => {
  return (
    <Field
      validate={required}
      name={name}
      type='text'
      parse={(value: string[]) => {
        if (field === 'startsWith') {
          return value;
        } else {
          // reset default value on remove options list value
          if ('defaultValue' in obj && !value.includes(obj.defaultValue)) {
            obj.defaultValue = null;
          }
          // reset eq condition field on remove options list value
          if ('condition' in obj) {
            obj.condition.forEach((item: any, index: number) => {
              if ('eq' in item && !value.includes(item.eq)) {
                obj.condition[index].eq = '';
              }
            });
          }
          const existingOptions: { [key: string]: object } = {};
          obj.optionsList.forEach((opt: { [key: string]: string }) => (existingOptions[opt.id] = opt));
          return value.map((option: string) => {
            return {
              ...(existingOptions[option] || {}),
              ...{
                name: option,
                id: option
              }
            };
          });
        }
      }}
      render={({ input }) => (
        <div className='mb-0dot5'>
          <TagInput
            {...input}
            defaultValue={
              Array.isArray(obj[field])
                ? obj[field]?.map((value: any) => (value?.name ? value.name : value)) || []
                : obj[field]
            }
            label={inputProps?.label}
            disabled={!!inputProps.disabled}
            error={!(obj[field] || []).length ? 'Please add the ' + inputProps?.label.toLowerCase() : ''}
            classChange={'optionsList'}
            allowOnlyNumbers={field === 'startsWith'}
          />
        </div>
      )}
    />
  );
};

const OptionList = ({ name, obj, field, inputProps }: any) => {
  const formGetMeta = [] as any[];
  const optionType = formGetMeta.find((item: any) => obj.id === item.key)?.type || 'radio';
  if (obj.viewType === 'RadioGroup' && optionType === 'checkbox') {
    const booleanDefaultValue = [
      { id: true, name: '' },
      { id: false, name: '' }
    ];
    if (obj.optionsList && !obj.optionsList.length) {
      obj.optionsList = booleanDefaultValue;
    }
    return <BooleanOptionsRender name={name} obj={obj} field={field} />;
  } else {
    return <StringOptionsRender name={name} obj={obj} field={field} inputProps={inputProps} />;
  }
};

export default OptionList;
