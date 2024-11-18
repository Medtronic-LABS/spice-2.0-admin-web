import { render, act, waitFor } from '@testing-library/react';
import ReorderContainer, { ReorderContext } from '../ReorderContainer';

describe('ReorderContainer', () => {
  const mockOnReorder = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize correctly with empty order and height', () => {
    const { container } = render(
      <ReorderContainer onReorder={mockOnReorder}>
        <div>Test Child</div>
      </ReorderContainer>
    );

    const containerDiv = container.querySelector('.position-relative');
    expect(containerDiv).toHaveStyle({ height: '-2px' });
  });

  it('should initialize items correctly', () => {
    let contextValue: any;

    render(
      <ReorderContainer onReorder={mockOnReorder}>
        <ReorderContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </ReorderContext.Consumer>
      </ReorderContainer>
    );

    act(() => {
      contextValue.initItem('item1', 0, 100);
      contextValue.initItem('item2', 1, 150);
    });

    expect(contextValue.order).toEqual({
      item1: 0,
      item2: 1
    });

    expect(contextValue.height).toEqual({
      item1: 100,
      item2: 150
    });
  });

  it('should swap items correctly', async () => {
    let contextValue: any;

    render(
      <ReorderContainer onReorder={mockOnReorder}>
        <ReorderContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </ReorderContext.Consumer>
      </ReorderContainer>
    );

    await waitFor(() => {
      contextValue.initItem('item1', 0, 100);
      contextValue.initItem('item2', 1, 150);
      contextValue.swapItems('item1', 'item2');
    });

    await waitFor(() => {
      expect(contextValue.order).toEqual({
        item1: undefined,
        item2: undefined
      });
      expect(mockOnReorder).toHaveBeenCalledWith({
        item1: undefined,
        item2: undefined
      });
    });
  });

  it('should remove items and update order correctly', () => {
    let contextValue: any;

    render(
      <ReorderContainer onReorder={mockOnReorder}>
        <ReorderContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </ReorderContext.Consumer>
      </ReorderContainer>
    );

    waitFor(() => {
      contextValue.initItem('item1', 0, 100);
      contextValue.initItem('item2', 1, 150);
      contextValue.initItem('item3', 2, 200);
    });

    waitFor(() => {
      contextValue.removeItem('item2');
    });

    expect(contextValue.order).toEqual({
      item1: 0,
      item3: 1
    });

    expect(contextValue.height).toEqual({
      item1: 100,
      item3: 200
    });

    expect(mockOnReorder).toHaveBeenCalledWith({
      item1: 0,
      item3: 1
    });
  });
});
