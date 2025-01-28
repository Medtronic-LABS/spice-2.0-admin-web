import React, { useState, useRef } from 'react';
import { ReactComponent as EditIcon } from '../../assets/images/edit.svg';
import styles from './CustomTable.module.scss';
import Loader from '../loader/Loader';
import { ReactComponent as DeleteIcon } from '../../assets/images/bin.svg';
import { ReactComponent as ActivateIcon } from '../../assets/images/icon-activate.svg';
import APPCONSTANTS from '../../constants/appConstants';
import ConfirmationModalPopup from './ConfirmationModalPopup';
import Pagination from '../Pagination';
import CustomTooltip from '../tooltip';

export interface IAnyObject {
  [key: string]: any;
}

export interface IActionFormatter {
  hideEditIcon?: (rowData: any) => boolean;
  hideDeleteIcon?: (rowData: any) => boolean;
  hideCustomIcon?: (rowData: any) => boolean;
}

interface ICustomTableProps {
  handlePageChange?: (pageNo: number, rowsPerPage?: number) => void;
  columnsDef: IColumns[];
  rowData: any;
  isEdit: boolean;
  actionFormatter?: IActionFormatter;
  isDelete: boolean;
  isActivate?: boolean;
  isCustom?: boolean;
  customTitle?: string;
  CustomIcon?: any;
  customIconStyle?: any;
  page?: number;
  count?: number;
  isRowEdit?: boolean;
  onRowEdit?: (data: any) => void;
  onCustomConfirmed?: (data: any) => void;
  onActivateClick?: (data: any) => void;
  isPopupNeeded?: boolean;
  confirmationTitle?: string;
  customConfirmationTitle?: string;
  customPopupTitle?: string;
  activateConfirmationTitle?: string;
  loading?: boolean;
  onDeleteClick?: (deleteData: { data: any; index: number; pageNo: number }) => void;
  className?: string;
  isSearching?: boolean;
  noDataText?: string;
  orderBy?: string;
  order?: number;
  showRowHover?: boolean;
  rowsPerPage?: number;
  deleteTitle?: string;
  activateTitle?: string;
  handleRowClick?: (data: any) => void;
}

export interface IColumns {
  id: number;
  name: string;
  label: string;
  width?: string;
  cellFormatter?: (data: any, column: IColumns) => void;
  disableSort?: boolean;
  align?: 'center' | 'left';
}

/**
 * CustomTable component for displaying data in a table format with various features
 * @param {ICustomTableProps} props - The component props
 */
const CustomTable: React.FC<ICustomTableProps> = (props) => {
  const {
    handlePageChange,
    columnsDef,
    rowData,
    isEdit,
    actionFormatter,
    isDelete,
    isActivate = false,
    isCustom = false,
    customTitle = '',
    CustomIcon = null,
    customIconStyle,
    page,
    count,
    isRowEdit,
    onRowEdit,
    onCustomConfirmed,
    onActivateClick,
    isPopupNeeded,
    confirmationTitle,
    customConfirmationTitle,
    customPopupTitle,
    activateConfirmationTitle,
    loading,
    onDeleteClick,
    showRowHover,
    rowsPerPage,
    deleteTitle,
    activateTitle,
    handleRowClick
  } = props;

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteClicked, setDeleteClicked] = useState(false);
  const [activateClicked, setActivateClicked] = useState(false);
  const [customIconClicked, setCustomIconClicked] = useState(false);
  const [selectedData, setSelectedData] = useState<any>({});
  const tableRef = useRef<HTMLInputElement>(null);
  const currentDeleteObj = useRef<any>({});
  const currentActivateObj = useRef<any>({});

  /**
   * Handles page change and scrolls to top of table
   * @param {number} pageNo - The new page number
   * @param {number} rowsPerPageValue - The number of rows per page
   */

  const handlePageChangeWrapper = (pageNo: number, rowsPerPageValue: number) => {
    if (tableRef.current) {
      tableRef.current.scrollTo(0, 0);
    }
    if (handlePageChange) {
      handlePageChange(pageNo, rowsPerPageValue);
    }
  };

  /**
   * Handles delete action for a row
   * @param {React.MouseEvent<HTMLSpanElement, MouseEvent>} e - The click event
   * @param {IAnyObject} rowDataValue - The data of the clicked row
   * @param {number} rowIndex - The index of the clicked row
   * @param {number} [pageNo] - The current page number
   */
  const handleDelete = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    rowDataValue: IAnyObject,
    rowIndex: number,
    pageNo?: number
  ) => {
    e.stopPropagation();
    if (rowDataValue.length === 1 && pageNo) {
      currentDeleteObj.current = { data: rowDataValue, index: rowIndex, pageNo: pageNo - 1 };
    } else {
      currentDeleteObj.current = { data: rowDataValue, index: rowIndex, pageNo };
    }
    setOpenDialog(true);
    setDeleteClicked(true);
    setActivateClicked(false);
  };

  /**
   * Handles edit action for a row
   * @param {React.MouseEvent<HTMLSpanElement, MouseEvent>} e - The click event
   * @param {any} rowDataValue - The data of the clicked row
   * @param {number} rowIndex - The index of the clicked row
   */
  const handleEdit = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, rowDataValue: any, rowIndex: number) => {
    e.stopPropagation();
    if (onRowEdit) {
      onRowEdit({ ...rowDataValue, index: rowIndex });
    }
  };

  /**
   * Handles custom icon click action for a row
   * @param {React.MouseEvent<HTMLSpanElement, MouseEvent>} e - The click event
   * @param {any} rowDataValue - The data of the clicked row
   * @param {number} rowIndex - The index of the clicked row
   * @param {boolean} [isPopupNeededProp=false] - Whether a popup is needed
   */
  const handleCustomIconClick = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    rowDataValue: any,
    rowIndex: number,
    isPopupNeededProp: boolean = false
  ) => {
    e.stopPropagation();
    if (onCustomConfirmed && !isPopupNeededProp) {
      onCustomConfirmed({ ...rowDataValue, index: rowIndex });
    }
    if (isPopupNeeded) {
      setCustomIconClicked(true);
      setSelectedData({ ...rowDataValue, index: rowIndex });
    }
  };

  /**
   * Handles activate action for a row
   * @param {React.MouseEvent<HTMLSpanElement, MouseEvent>} e - The click event
   * @param {any} rowDataValue - The data of the clicked row
   * @param {number} rowIndex - The index of the clicked row
   */
  const handleActivate = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, rowDataValue: any, rowIndex: number) => {
    e.stopPropagation();
    currentActivateObj.current = { ...rowDataValue, index: rowIndex };
    setOpenDialog(true);
    setDeleteClicked(false);
    setActivateClicked(true);
  };

  /**
   * Closes the confirmation dialog
   */
  const handleConfirmationClose = () => {
    currentDeleteObj.current = {};
    setOpenDialog(false);
    setDeleteClicked(false);
    setActivateClicked(false);
  };

  /**
   * Closes the custom confirmation dialog
   */
  const handleCustomConfirmationClose = () => {
    setCustomIconClicked(false);
    setSelectedData({});
  };

  /**
   * Handles custom confirmation action
   */
  const handleCustomConfirmed = () => {
    if (onCustomConfirmed) {
      onCustomConfirmed(selectedData);
    }
    handleCustomConfirmationClose();
  };

  /**
   * Handles confirmation success action
   */
  const handleConfirmationSuccess = () => {
    setOpenDialog(false);
    if (deleteClicked && onDeleteClick) {
      onDeleteClick(currentDeleteObj.current);
    } else if (activateClicked && onActivateClick) {
      onActivateClick(currentActivateObj.current);
    }
    setDeleteClicked(false);
    setActivateClicked(false);
  };

  /**
   * Handles change in rows per page
   * @param {number} rowsPerPageValue - The new number of rows per page
   */
  const handleChangeRowsPerPage = (rowsPerPageValue: number) => {
    if (tableRef.current) {
      tableRef.current.scrollTo(0, 0);
    }
    if (handlePageChange) {
      handlePageChange(1, Number(rowsPerPageValue));
    }
  };

  /**
   * Navigates to detail view of a row
   * @param {IAnyObject} rowDataValue - The data of the clicked row
   */
  const navigateToDetail = (rowDataValue: IAnyObject) => {
    if (handleRowClick) {
      handleRowClick(rowDataValue);
    }
  };

  /**
   * Checks if any action is enabled
   * @returns {boolean} True if any action is enabled, false otherwise
   */
  const isAction = () => {
    return isEdit || isDelete || isActivate || isCustom;
  };

  /**
   * Gets the total number of columns including actions
   * @param {boolean} actions - Whether actions are enabled
   */
  const getActionsLength = (actions: boolean) => {
    return actions ? columnsDef.length + 1 : columnsDef.length;
  };

  /**
   * Determines if bottom padding should be applied
   */
  const handleApplyBorderBottom = () => {
    return count && count > 10 ? 'pb-1' : '';
  };

  /**
   * Renders column headers
   * @param {IColumns[]} columnsDefProp - The column definitions
   */
  const handleShowColumnHeaders = (columnsDefProp: IColumns[]) => {
    return (
      columnsDefProp &&
      columnsDefProp.map((column: IColumns, columnIndex: number) => (
        <th key={columnIndex} style={{ width: column.width }}>
          {column.label}
        </th>
      ))
    );
  };

  /**
   * Renders action header if actions are enabled
   * @param {boolean} actions - Whether actions are enabled
   */
  const handleShowActionHeader = (actions: boolean) => {
    return (
      actions && (
        <th className='text-center' style={{ width: '80px' }}>
          Actions
        </th>
      )
    );
  };

  /**
   * Determines the row style
   * @param {boolean} isLastChild - Whether the row is the last child
   */
  const handleRowStyle = (isLastChild: boolean) => {
    return `${showRowHover || handleRowClick ? styles.showRowHover : ''} ${
      count && count < (rowsPerPage || 10) && isLastChild ? '' : styles.showDivider
    }`;
  };

  /**
   * Determines if cursor should be pointer
   */
  const handleCursorPointerStyle = () => {
    return handleRowClick || isRowEdit ? 'pointer' : '';
  };

  /**
   * Renders edit icon if conditions are met
   * @param {IAnyObject} rowDataValue - The data of the row
   * @param {number} rowIndex - The index of the row
   */
  const handleShowEditIcon = (rowDataValue: IAnyObject, rowIndex: number) => {
    return (
      isEdit &&
      (!actionFormatter?.hideEditIcon ||
        (actionFormatter?.hideEditIcon && !actionFormatter?.hideEditIcon(rowDataValue))) && (
        <div className={styles.editIcon} data-testid='edit-icon' onClick={(e) => handleEdit(e, rowDataValue, rowIndex)}>
          <CustomTooltip title={'Edit'}>
            <EditIcon aria-labelledby={'edit-icon'} />
          </CustomTooltip>
        </div>
      )
    );
  };

  /**
   * Renders activate icon if conditions are met
   * @param {IAnyObject} rowDataValue - The data of the row
   * @param {number} rowIndex - The index of the row
   */
  const handleShowActivateIcon = (rowDataValue: IAnyObject, rowIndex: number) => {
    return (
      isActivate && (
        <div
          className={styles.activateIcon}
          data-testid='activate-icon'
          onClick={(e) => handleActivate(e, rowDataValue, rowIndex)}
        >
          <CustomTooltip title={'Activate'}>
            <ActivateIcon aria-labelledby={'activate-icon'} />
          </CustomTooltip>
        </div>
      )
    );
  };

  /**
   * Renders custom icon if conditions are met
   * @param {IAnyObject} rowDataValue - The data of the row
   * @param {number} rowIndex - The index of the row
   */
  const handleShowCustomIcon = (rowDataValue: IAnyObject, rowIndex: number) => {
    return isCustom &&
      (!actionFormatter?.hideCustomIcon ||
        (actionFormatter?.hideCustomIcon && !actionFormatter?.hideCustomIcon(rowDataValue))) ? (
      <div
        className={rowDataValue.isCustomIconInvisible ? `${styles.customIcon} invisible` : styles.customIcon}
        data-testid='custom-icon'
        onClick={(e) => handleCustomIconClick(e, rowDataValue, rowIndex, isPopupNeeded)}
      >
        <CustomTooltip title={customTitle}>
          <CustomIcon style={customIconStyle} aria-labelledby={'custom-icon'} />
        </CustomTooltip>
      </div>
    ) : (
      <></>
    );
  };

  /**
   * Renders delete icon if conditions are met
   * @param {IAnyObject} rowDataValue - The data of the row
   * @param {number} rowIndex - The index of the row
   */
  const handleShowDeleteIcon = (rowDataValue: IAnyObject, rowIndex: number) => {
    return (
      isDelete &&
      (!actionFormatter?.hideDeleteIcon ||
        (actionFormatter?.hideDeleteIcon && !actionFormatter?.hideDeleteIcon(rowDataValue))) && (
        <div
          data-testid='delete-icon'
          className={styles.deleteIcon}
          onClick={(e) => handleDelete(e, rowDataValue, rowIndex)}
        >
          <CustomTooltip title={'Delete'}>
            <DeleteIcon aria-labelledby={'delete-icon'} />
          </CustomTooltip>
        </div>
      )
    );
  };

  /**
   * Renders pagination component if conditions are met
   */
  const handleShowPagination = () => {
    return page && rowsPerPage && count && count > APPCONSTANTS.ROWS_PER_PAGE_OF_TABLE ? (
      <div className={styles.paginationWrapper}>
        <Pagination
          initialPage={page}
          total={count}
          length={rowsPerPage}
          currentPage={page}
          onChangePage={handlePageChangeWrapper}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
    ) : null;
  };

  /**
   * Renders activate confirmation popup if conditions are met
   */
  const handleActivateConfirmationPopup = () => {
    return (
      (confirmationTitle || activateConfirmationTitle) && (
        <ConfirmationModalPopup
          isOpen={openDialog}
          popupTitle={(activateClicked ? activateTitle : deleteTitle) || ''}
          cancelText='Cancel'
          submitText='Ok'
          submitTestId='delete-ok-button'
          handleCancel={handleConfirmationClose}
          handleSubmit={handleConfirmationSuccess}
          popupSize='modal-md'
          confirmationMessage={activateClicked ? activateConfirmationTitle : confirmationTitle}
        />
      )
    );
  };

  /**
   * Renders custom popup if conditions are met
   */
  const handleCustomPopup = () => {
    return (
      (customConfirmationTitle || customPopupTitle) && (
        <ConfirmationModalPopup
          isOpen={customIconClicked}
          popupTitle={customPopupTitle || ''}
          cancelText='Cancel'
          submitText='Ok'
          handleCancel={handleCustomConfirmationClose}
          handleSubmit={handleCustomConfirmed}
          popupSize='modal-md'
          confirmationMessage={customConfirmationTitle}
        />
      )
    );
  };

  return (
    <div className={`${styles.customTable} ${handleApplyBorderBottom()}`}>
      <table>
        <thead>
          <tr>
            {handleShowColumnHeaders(columnsDef)}
            {handleShowActionHeader(isAction())}
          </tr>
        </thead>
        <tbody className={handleCursorPointerStyle()}>
          {rowData?.length && !loading ? (
            <>
              {rowData.map((rowDataItem: IAnyObject, rowIndex: number) => {
                const isLastChild = (rowData.length || 0) === rowIndex + 1;
                return (
                  <tr
                    key={rowDataItem.id || rowIndex}
                    onClick={() => navigateToDetail(rowDataItem)}
                    className={handleRowStyle(isLastChild)}
                    data-testid={`row-${rowDataItem.id || rowIndex}`}
                  >
                    {columnsDef &&
                      columnsDef.map((column: IColumns, columnIndex: number) => (
                        <td key={column.id || columnIndex}>
                          {column.cellFormatter ? column.cellFormatter(rowDataItem, column) : rowDataItem[column.name]}
                        </td>
                      ))}
                    {isAction() && (
                      <td key={rowIndex} className='text-center'>
                        <div className='d-inline-flex'>
                          {handleShowEditIcon(rowDataItem, rowIndex)}
                          {handleShowActivateIcon(rowDataItem, rowIndex)}
                          {handleShowCustomIcon(rowDataItem, rowIndex)}
                          {handleShowDeleteIcon(rowDataItem, rowIndex)}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </>
          ) : (
            <tr className='cursor-default'>
              <td colSpan={getActionsLength(isAction())}>
                {loading && <Loader isFullScreen={false} />}
                {!loading && <div className='text-center'>{APPCONSTANTS.NO_RECORDS_FOUND}</div>}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {handleCustomPopup()}
      {handleActivateConfirmationPopup()}
      {handleShowPagination()}
    </div>
  );
};

export default CustomTable;
