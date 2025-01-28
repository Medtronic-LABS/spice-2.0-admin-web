import React, { useCallback, useState } from 'react';

interface IReorderContainerProps {
  children: React.ReactNode;
  onReorder: (order: { [k: string]: number }) => void;
}

interface IReorderContext {
  initItem: (itemsId: string, itemOrder: number, heightInPx: number) => void;
  removeItem: (itemId: string) => void;
  swapItems: (itemIdOne: string, itemIdTwo: string) => void;
  order: { [key: string]: number };
  height: { [key: string]: number };
  spaceBetweenItemsInPx: number;
}

export const ReorderContext = React.createContext<IReorderContext>({} as IReorderContext);

/**
 * Props for the ReorderContainer component.
 */
interface IReorderContainerProps {
  /** The child components to be reordered. */
  children: React.ReactNode;
  /** Callback function to handle reordering. */
  onReorder: (order: { [k: string]: number }) => void;
}

/**
 * Context for reordering functionality.
 */
interface IReorderContext {
  initItem: (itemsId: string, itemOrder: number, heightInPx: number) => void;
  removeItem: (itemId: string) => void;
  swapItems: (itemIdOne: string, itemIdTwo: string) => void;
  order: { [key: string]: number };
  height: { [key: string]: number };
  spaceBetweenItemsInPx: number;
}

/**
 * A container component that allows its children to be reordered.
 * @param {IReorderContainerProps} props - The component props.
 * @returns {JSX.Element} The ReorderContainer component.
 */
const ReorderContainer = ({ children, onReorder }: IReorderContainerProps) => {
  const spaceBetweenItemsInPx = 2;
  const [order, setOrder] = useState<{ [key: string]: number }>({});
  const [height, setHeight] = useState<{ [key: string]: number }>({});

  /**
   * Initializes a new item in the reorder list.
   * @param {string} itemsId - The ID of the item.
   * @param {number} itemOrder - The initial order of the item.
   * @param {number} heightInPx - The height of the item in pixels.
   */
  const initItem = useCallback((itemsId: string, itemOrder: number, heightInPx: number) => {
    setOrder((prevOrder) => ({ ...prevOrder, [itemsId]: itemOrder }));
    setHeight((prevHeight) => ({ ...prevHeight, [itemsId]: heightInPx }));
  }, []);

  /**
   * Swaps the positions of two items in the reorder list.
   * @param {string} itemIdOne
   * @param {string} itemIdTwo
   */
  const swapItems = (itemIdOne: string, itemIdTwo: string) => {
    const nxtOrder = { ...order, [itemIdOne]: order[itemIdTwo], [itemIdTwo]: order[itemIdOne] };
    setOrder(nxtOrder);
    onReorder(nxtOrder);
  };

  /**
   * Removes an item from the reorder list.
   * @param {string} itemsId - The ID of the item to remove.
   */
  const removeItem = useCallback(
    (itemsId: string) => {
      setOrder((prevOrder) => {
        prevOrder = { ...prevOrder };
        const targetItemOrder = prevOrder[itemsId];
        delete prevOrder[itemsId];
        Object.keys(prevOrder).forEach((currItemId) => {
          if (prevOrder[currItemId] > targetItemOrder) {
            prevOrder[currItemId]--;
          }
        });
        onReorder(prevOrder);
        return prevOrder;
      });
      setHeight((prevHeight) => {
        prevHeight = { ...prevHeight };
        delete prevHeight[itemsId];
        return prevHeight;
      });
    },
    [onReorder]
  );
  const contentHeight = Object.values(height).reduce((acc, itemHeight) => acc + itemHeight, 0);
  const contextValue = {
    order,
    swapItems,
    initItem,
    removeItem,
    height,
    spaceBetweenItemsInPx
  };
  return (
    <ReorderContext.Provider value={contextValue}>
      <div
        className='position-relative'
        style={{
          height: `${contentHeight + (Object.keys(order).length - 1) * spaceBetweenItemsInPx}px`
        }}
      >
        {children}
      </div>
    </ReorderContext.Provider>
  );
};

export default ReorderContainer;
