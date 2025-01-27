import React from 'react';
import './ConfirmationModalPopup.scss';
import ModalForm, { IModalSize } from '../modal/ModalForm';

interface ISyncDateDisplayProps {
  syncDate: string;
  warningDays?: number;
}

const SyncDateDisplay: React.FC<ISyncDateDisplayProps> = ({ syncDate, warningDays = 7 }) => {
  /**
   * Formats the time difference into a human-readable string
   * @param {number} daysDifference - Number of days between now and sync date
   * @returns {string} Formatted time ago string
   */
  const getTimeAgoText = (daysDifference: number): string => {
    const weeks = Math.floor(daysDifference / 7);
    const months = Math.floor(daysDifference / 30);
    const years = Math.floor(daysDifference / 365);

    if (years > 0) {
      const yearText = years === 1 ? 'year' : 'years';
      const monthsRemaining = Math.floor((daysDifference % 365) / 30);
      if (monthsRemaining > 0) {
        return `${years} ${yearText}, ${monthsRemaining} months ago`;
      }
      return `${years} ${yearText} ago`;
    }

    if (months > 0) {
      const monthText = months === 1 ? 'month' : 'months';
      const weeksRemaining = Math.floor((daysDifference % 30) / 7);
      if (weeksRemaining > 0) {
        return `${months} ${monthText}, ${weeksRemaining} weeks ago`;
      }
      return `${months} ${monthText} ago`;
    }

    if (weeks > 0) {
      const weekText = weeks === 1 ? 'week' : 'weeks';
      const daysRemaining = daysDifference % 7;
      if (daysRemaining > 0) {
        const dayText = daysRemaining === 1 ? 'day' : 'days';
        return `${weeks} ${weekText}, ${daysRemaining} ${dayText} ago`;
      }
      return `${weeks} ${weekText} ago`;
    }

    if (daysDifference === 0) {
      return 'Today';
    }
    if (daysDifference === 1) {
      return 'Yesterday';
    }
    return `${daysDifference} days ago`;
  };

  /**
   * Calculates the sync status and formats display information
   * @param {string} dateString - The date string to process
   * @returns {Object} Formatted status information and display text
   * @property {string} statusClass - CSS class for status styling
   * @property {string} statusIcon - Emoji icon for status
   * @property {string} dateText - Formatted date text
   * @property {string} timeAgo - Human-readable time ago text
   * @property {boolean} showWarning - Whether to show warning message
   * @property {string} syncFullDate - Formatted full date
   * @property {string} detailedTimeAgo - Detailed time ago text
   */
  const calculateSyncStatus = (
    dateString: string
  ): {
    statusClass: string;
    dateText: string;
    timeAgo: string;
    showWarning: boolean;
    syncFullDate: string;
    detailedTimeAgo: string;
  } => {
    // Handle invalid date
    if (!dateString || dateString === 'Invalid Date' || isNaN(new Date(dateString).getTime())) {
      return {
        statusClass: 'sync-status sync-danger',
        dateText: '',
        timeAgo: 'Never synced',
        showWarning: true,
        syncFullDate: '',
        detailedTimeAgo: ''
      };
    }

    const now = new Date();
    const lastSync = new Date(dateString);
    const daysDifference = Math.floor((now.getTime() - lastSync.getTime()) / (1000 * 60 * 60 * 24));
    const detailedLastSyncTimeAgo = getTimeAgoText(daysDifference);

    // Format date and time
    const lastSyncFullDate = lastSync.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    // Determine status and set display text
    let lastSyncStatusClass = 'sync-status';

    try {
      if (daysDifference === 0) {
        lastSyncStatusClass += ' sync-recent';
      } else if (daysDifference === 1) {
        lastSyncStatusClass += ' sync-recent';
      } else if (daysDifference <= warningDays) {
        lastSyncStatusClass += ' sync-warning';
      } else {
        lastSyncStatusClass += ' sync-danger';
      }
    } catch (error) {
      return {
        statusClass: 'sync-status sync-danger',
        dateText: 'Error',
        timeAgo: 'Could not process sync date',
        showWarning: true,
        syncFullDate: '',
        detailedTimeAgo: ''
      };
    }

    return {
      statusClass: lastSyncStatusClass,
      dateText: detailedLastSyncTimeAgo,
      timeAgo: `Last synced ${detailedLastSyncTimeAgo}`,
      showWarning: daysDifference > warningDays,
      syncFullDate: lastSyncFullDate,
      detailedTimeAgo: detailedLastSyncTimeAgo
    };
  };

  const { statusClass, dateText, timeAgo, showWarning, syncFullDate } = calculateSyncStatus(syncDate);

  return (
    <div className='sync-date-container'>
      {Boolean(dateText) && (
        <div className='sync-date-content'>
          <span className={statusClass}>{dateText}</span>
        </div>
      )}
      {syncFullDate && (
        <div className='sync-full-date'>
          <div className='sync-date-details'>
            <span className='sync-label'>Last sync Date: {syncFullDate} </span>
          </div>
        </div>
      )}
      {showWarning && (
        <div className='sync-warning-alert'>
          {timeAgo === 'Never synced' && (
            <div className='warning-content'>
              <span className='warning-icon warning-text'>⚠️ Warning: </span>
              <span className='warning-text'>No last sync details available for this user</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface IModalPopupTypes {
  isOpen: boolean;
  popupTitle: string;
  cancelText: string;
  submitText: string;
  submitTestId?: string;
  handleCancel: () => void;
  handleSubmit: () => void;
  popupSize: IModalSize;
  confirmationMessage: string | undefined;
  deactivateLabel?: string;
  customButtonLabel?: string;
  handleCustomButton?: () => void;
  WarningMessage?: string;
  syncDate?: string;
}

const ConfirmationModalPopup: React.FC<IModalPopupTypes> = ({
  isOpen,
  popupTitle,
  confirmationMessage,
  cancelText,
  submitText,
  handleCancel,
  handleSubmit,
  popupSize,
  submitTestId,
  customButtonLabel,
  handleCustomButton,
  WarningMessage,
  syncDate
}) => {
  return (
    <ModalForm
      show={isOpen}
      title={popupTitle}
      cancelText={cancelText}
      submitText={submitText}
      handleCancel={handleCancel}
      handleFormSubmit={handleSubmit}
      size={popupSize}
      submitTestId={submitTestId}
      customButtonLabel={customButtonLabel}
      handleCustomButton={handleCustomButton}
    >
      <div>
        {Boolean(WarningMessage) && (
          <>
            <SyncDateDisplay syncDate={syncDate || ''} />
            <hr />
          </>
        )}
        <p className='text-center'>{confirmationMessage}</p>
      </div>
    </ModalForm>
  );
};

export default ConfirmationModalPopup;
