import { useState } from 'react';
import styles from './../../styles/FormBuilder.module.scss';

export interface ITagInputProps {
  onChange?: (value: string[]) => void;
  defaultValue?: string[];
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  classChange?: string;
  allowOnlyNumbers?: boolean;
  fromChiefDom?: boolean;
}

/**
 * Renders the tag input component based on the provided configuration.
 * @param {ITagInputProps} props - The props for the TagInput component
 */
const TagInput = ({
  defaultValue = [],
  onChange,
  label,
  disabled,
  error = '',
  classChange = '',
  allowOnlyNumbers = false,
  fromChiefDom,
  required = true,
  ...props
}: ITagInputProps) => {
  const [items, setItems] = useState<string[]>(defaultValue || []);
  const [inputValue, setInput] = useState<string>('');

  const handleInputChange = (evt: React.BaseSyntheticEvent) => {
    const filteredValue = evt.target.value.replace(/[^a-zA-Z0-9 ]/g, '');
    if (fromChiefDom) {
      setInput(filteredValue);
    } else {
      setInput(evt.target.value);
    }
  };

  /**
   * Handles the key down event for the tag input based on the provided configuration.
   */
  const handleInputKeyDown = (evt: any) => {
    if (evt.keyCode === 13) {
      const value = (evt.target.value || '').trim();
      const isOnlyNumber = allowOnlyNumbers ? Number.isInteger(Number(value)) : true;
      if (value && items.indexOf(value.trim()) === -1 && isOnlyNumber) {
        let newItems = [] as any[];
        setItems((prevItems) => {
          newItems = [...items, value];
          return [...prevItems, value];
        });
        setTimeout(() => {
          onChange?.(newItems);
        });
        setInput('');
      } else {
        setInput('');
      }
      evt.stopPropagation();
      evt.preventDefault();
    }
    if (items.length && evt.keyCode === 8 && !inputValue.length) {
      let updatedItems = [] as any[];
      setItems((prevItems: string[]) => {
        updatedItems = prevItems.slice(0, items.length - 1);
        return updatedItems;
      });
      setTimeout(() => {
        onChange?.(updatedItems);
      });
    }
  };

  /**
   * Handles the removal of an item from the tag input based on the provided configuration.
   */
  const handleRemoveItem = (index: number) => {
    let updatedItems = [] as any[];
    setItems((prevItems: string[]) => {
      updatedItems = prevItems.filter(
        (_item: string, i: number) => i !== index || _item === 'Gestational Diabetes(GDM)'
      );
      return updatedItems;
    });
    setTimeout(() => {
      onChange?.(updatedItems);
    });
  };

  const taginputClass = `${styles.items} ${disabled ? 'no-pointer-events ' + styles.disabledItems : ''}`;
  return (
    <div className={`${styles.tagInput} ${styles[classChange]}`} data-testid='tag-input'>
      {label && (
        <>
          <label>
            {label}
            {required && <span className='input-asterisk'>*</span>}
          </label>
          <br />
        </>
      )}
      <ul
        className={`${styles.taginputContainer} ${!!error ? styles.danger : ''} ${
          disabled ? styles.disabledContainer : ''
        } mb-0`}
      >
        {items.map((item: string, i: number) => (
          <li key={i} className={taginputClass}>
            {item}
            <span className={`ps-0dot75 ${styles.remove}`} onClick={() => handleRemoveItem(i)} data-testid='remove-tag'>
              x
            </span>
          </li>
        ))}
        {(!disabled || !items.length) && (
          <input
            {...props}
            className={styles.input}
            value={inputValue}
            disabled={disabled}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            data-testid='tag-input-field'
          />
        )}
      </ul>
      {!items.length && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default TagInput;
