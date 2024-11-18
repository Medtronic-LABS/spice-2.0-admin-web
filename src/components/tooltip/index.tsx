import { Tooltip } from 'bootstrap';
import { useEffect, useRef } from 'react';

interface ICustomTooltipProps {
  children: React.ReactNode;
  title: string;
}

/**
 * CustomTooltip component that wraps its children with a Bootstrap tooltip.
 *
 * @param {CustomTooltipProps} props - The component props
 * @returns {JSX.Element} A div element with tooltip functionality
 */
const CustomTooltip = ({ children, title }: ICustomTooltipProps) => {
  /** Reference to the tooltip's container element */
  const tooltipNode = useRef<HTMLDivElement>(null);

  /**
   * Effect hook to initialize and clean up the Bootstrap Tooltip
   */
  useEffect(() => {
    // Initialize the Bootstrap Tooltip
    const tooltip = new Tooltip(tooltipNode.current as HTMLDivElement, {
      container: 'body',
      trigger: 'hover'
    });

    // Clean up function to hide the tooltip when the component unmounts
    return () => tooltip.hide();
  }, [title]);

  return (
    <div
      ref={tooltipNode}
      data-bs-toggle='tooltip'
      data-bs-placement='top'
      data-bs-original-title={title}
      title={title}
      data-testid='tooltip'
    >
      {children}
    </div>
  );
};

export default CustomTooltip;
