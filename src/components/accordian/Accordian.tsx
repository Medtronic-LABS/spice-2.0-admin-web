import { useLayoutEffect, useState } from 'react';
import styles from './Accordian.module.scss';

interface IAccordianProps {
  header: React.ReactElement[] | React.ReactElement | string;
  body: React.ReactElement[] | React.ReactElement | string;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onToggle?: () => void;
}

/**
 * Accordian component for displaying collapsible content.
 * @param {IAccordianProps} props - The props for the Accordian component.
 * @param {React.ReactElement[] | React.ReactElement | string} props.header
 * The content to display in the accordion header.
 * @param {React.ReactElement[] | React.ReactElement | string} props.body
 * The content to display in the accordion body.
 * @param {boolean} [props.collapsed] - Whether the accordion is collapsed (controlled).
 * @param {boolean} [props.defaultCollapsed] - The default collapsed state (uncontrolled).
 * @param {() => void} [props.onToggle] - Callback function to be called when the accordion is toggled.
 */
const Accordian = ({ header, body, collapsed, defaultCollapsed, onToggle: onToggleProps }: IAccordianProps) => {
  const [show, setShow] = useState(defaultCollapsed || collapsed || false);
  useLayoutEffect(() => {
    if (typeof collapsed === 'boolean' && collapsed !== show) {
      setShow(collapsed);
    }
  }, [collapsed, show]);
  /**
   * Handles the toggle action for the accordion.
   */
  const handleToggle = () => {
    if (typeof collapsed !== 'boolean') {
      setShow((prev) => !prev);
    }
    onToggleProps?.();
  };
  return (
    <div className='accordion' data-testid='accordian'>
      <div className='accordion-item'>
        <div
          className={`accordion-header ${show ? styles.headerBorder : styles.headerBorderonHide}`}
          onClick={handleToggle}
        >
          <div className={`accordion-button bg-light ${show ? 'collapsed' : ''}`}>{header}</div>
        </div>
        <div className={`accordion-collapse collapse ${show ? 'show' : ''}`}>
          <div className='accordion-body'>{body}</div>
        </div>
      </div>
    </div>
  );
};

export default Accordian;
