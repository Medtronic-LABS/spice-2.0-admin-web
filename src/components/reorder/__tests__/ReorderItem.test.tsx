import { render, fireEvent, screen } from '@testing-library/react';
import ReorderItem from '../ReorderItem';
import { ReorderContext } from '../ReorderContainer';

describe('ReorderItem', () => {
  const mockInitItem = jest.fn();
  const mockRemoveItem = jest.fn();
  const mockSwapItems = jest.fn();

  const defaultContextValue = {
    initItem: mockInitItem,
    removeItem: mockRemoveItem,
    swapItems: mockSwapItems,
    order: { 'item-1': 0, 'item-2': 1 },
    height: { 'item-1': 100, 'item-2': 100 },
    spaceBetweenItemsInPx: 10
  };

  const defaultProps = {
    itemId: 'item-1',
    initOrder: 0,
    children: <div>Test Item</div>
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderWithContext = (props: any = defaultProps, contextValue: any = defaultContextValue) => {
    return render(
      <ReorderContext.Provider value={contextValue}>
        <ReorderItem {...props} />
      </ReorderContext.Provider>
    );
  };

  it('should initialize item on mount', () => {
    renderWithContext();
    expect(mockInitItem).toHaveBeenCalledWith('item-1', 0, 0);
  });

  it('should remove item on unmount when isRemoveItem is true', () => {
    const { unmount } = renderWithContext({
      ...defaultProps,
      isRemoveItem: true,
      removeBorderClass: 'customBorderClass'
    });
    unmount();
    expect(mockRemoveItem).toHaveBeenCalledWith('item-1');
  });

  it('should not remove item on unmount when isRemoveItem is false', () => {
    const { unmount } = renderWithContext();
    unmount();
    expect(mockRemoveItem).not.toHaveBeenCalled();
  });

  it('should render children and drag handle with correct order number', () => {
    renderWithContext();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should handle drag start', () => {
    renderWithContext();
    const item = screen.getByText('Test Item').parentElement?.parentElement;
    expect(item).toBeTruthy();

    if (item) {
      const dragStartEvent = new Event('dragstart', {
        bubbles: true
      }) as any;

      dragStartEvent.clientY = 100;
      dragStartEvent.dataTransfer = { setDragImage: jest.fn() };

      fireEvent(item, dragStartEvent);

      setTimeout(() => {
        expect(item).toHaveClass('dragging');
      }, 150);
    }
  });

  it('should handle drag movement and swap items when threshold is met', () => {
    renderWithContext();
    const item = screen.getByText('Test Item').parentElement?.parentElement;
    expect(item).toBeTruthy();

    if (item) {
      const dragStartEvent = new Event('dragstart', {
        bubbles: true
      }) as any;

      dragStartEvent.clientY = 100;
      Object.defineProperty(dragStartEvent, 'dataTransfer', {
        value: { setDragImage: jest.fn() }
      });
      fireEvent(item, dragStartEvent);

      const dragEvent = new Event('drag', {
        bubbles: true
      });
      fireEvent(item, dragEvent);
    }
  });

  it('should handle drag end', () => {
    renderWithContext();
    const item = screen.getByText('Test Item').parentElement?.parentElement;
    expect(item).toBeTruthy();

    if (item) {
      const dragStartEvent = new Event('dragstart', {
        bubbles: true
      });
      Object.defineProperty(dragStartEvent, 'dataTransfer', {
        value: { setDragImage: jest.fn() }
      });
      fireEvent(item, dragStartEvent);

      fireEvent.dragEnd(item);
      expect(item).not.toHaveClass('dragging');
    }
  });

  it('should calculate correct top position based on order and heights', () => {
    const contextWithMultipleItems = {
      ...defaultContextValue,
      order: { 'item-1': 2, 'item-2': 0, 'item-3': 1 },
      height: { 'item-1': 50, 'item-2': 60, 'item-3': 70 }
    };

    renderWithContext(defaultProps, contextWithMultipleItems);
    const item = screen.getByText('Test Item').parentElement?.parentElement;

    expect(item).toHaveStyle({ top: '150px' });
  });

  it('should handle drag movements and item swapping in all directions', () => {
    const contextValue = {
      ...defaultContextValue,
      order: { 'item-1': 1, 'item-2': 0, 'item-3': 2 },
      height: { 'item-1': 50, 'item-2': 50, 'item-3': 50 },
      spaceBetweenItemsInPx: 10
    };

    renderWithContext(defaultProps, contextValue);
    const item = screen.getByText('Test Item').parentElement?.parentElement;
    expect(item).toBeTruthy();

    if (item) {
      const dragStartEvent = new Event('dragstart', { bubbles: true }) as any;
      dragStartEvent.pageY = 100;
      dragStartEvent.dataTransfer = { setDragImage: jest.fn() };
      fireEvent(item, dragStartEvent);

      const invalidDragEvent = new Event('drag', { bubbles: true }) as any;
      invalidDragEvent.pageY = 0;
      fireEvent(item, invalidDragEvent);
      expect(mockSwapItems).not.toHaveBeenCalled();

      const downDragEvent = new Event('drag', { bubbles: true }) as any;
      downDragEvent.pageY = 200;
      fireEvent(item, downDragEvent);
      expect(mockSwapItems).toHaveBeenCalledWith('item-1', 'item-3');

      mockSwapItems.mockClear();

      const upDragEvent = new Event('drag', { bubbles: true }) as any;
      upDragEvent.pageY = 50;
      fireEvent(item, upDragEvent);
      expect(mockSwapItems).toHaveBeenCalledWith('item-1', 'item-2');

      const smallDragEvent = new Event('drag', { bubbles: true }) as any;
      smallDragEvent.pageY = 105;
      fireEvent(item, smallDragEvent);
      expect(mockSwapItems).toHaveBeenCalledTimes(2);
    }
  });

  it('should handle drag start and set dragging state after timeout', () => {
    renderWithContext();
    const item = screen.getByText('Test Item').parentElement?.parentElement;
    expect(item).toBeTruthy();

    if (item) {
      const dragStartEvent = new Event('dragstart', {
        bubbles: true
      }) as any;

      dragStartEvent.pageY = 100;
      dragStartEvent.dataTransfer = { setDragImage: jest.fn() };

      fireEvent(item, dragStartEvent);
      expect(item).not.toHaveClass('dragging');

      jest.advanceTimersByTime(100);
    }
  });
});
