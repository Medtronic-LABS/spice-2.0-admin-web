import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import './DatePicker.scss';
import 'react-datepicker/dist/react-datepicker.css';
import { getYear, getMonth } from 'date-fns';
import range from 'lodash/range';
import APPCONSTANTS from '../../constants/appConstants';
import { ReactComponent as CalendarIcon } from '../../assets/images/calendar-icon.svg';
import { formatDate } from '../../utils/commonUtils';

interface IDatePickerProps {
  label: string;
  isShowLabel?: boolean;
  todayButton?: boolean;
  required?: boolean;
  value?: Date | string | null;
  error?: string;
  errorLabel?: string;
  onChange?: (date: any) => void;
}

/**
 * DatePickerComponent for selecting dates with custom styling and functionality
 * @param {IDatePickerProps} props - The component props
 * @returns {React.ReactElement} The DatePickerComponent
 */
const DatePickerComponent = ({
  label,
  isShowLabel = false,
  required = false,
  value,
  error,
  errorLabel,
  todayButton,
  onChange
}: IDatePickerProps): React.ReactElement => {
  /**
   * Formats the input value to a date string
   */
  const dateValue = value ? formatDate(typeof value === 'string' ? value : '', 'YYYY-MM-DD') : '';
  const [dateInput, setDate] = useState<Date | null>(dateValue ? new Date(dateValue) : null);

  /**
   * Array of years for the year dropdown
   */
  const years = range(1990, getYear(new Date()) + 11, 1);
  const months = APPCONSTANTS.MONTHS;

  /**
   * Handles date selection
   * @param {Date} newDate - The newly selected date
   */
  const handleDateSelect = (newDate: any) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  return (
    <div className='datePicker'>
      {isShowLabel && (
        <>
          <label className='mb-0dot5 fs-0dot875 lh-1dot25'>
            {label}
            {required && <span className='input-asterisk'>*</span>}
          </label>
        </>
      )}
      <DatePicker
        dateFormat='dd/MM/yyyy'
        calendarClassName='datePickerInput'
        icon={<CalendarIcon aria-labelledby={'calendar-icon'} />}
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled
        }: {
          date: Date;
          changeYear: (year: number) => void;
          changeMonth: (month: number) => void;
          decreaseMonth: () => void;
          increaseMonth: () => void;
          prevMonthButtonDisabled: boolean;
          nextMonthButtonDisabled: boolean;
        }) => (
          <div className='datePickerHeader'>
            <button
              className={`monthBtn decreaseBtn`}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                decreaseMonth();
              }}
              disabled={prevMonthButtonDisabled}
            >
              {'<'}
            </button>
            <div className='selectElements'>
              <select
                className='yearSelect'
                value={getYear(date)}
                onChange={({ target: { value: newDate } }) => changeYear(Number(newDate))}
              >
                {years.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <select
                className='monthSelect'
                value={months[getMonth(date)]}
                onChange={({ target: { value: newDate } }) => changeMonth(months.indexOf(newDate))}
              >
                {months.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <button
              className='increaseBtn'
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                increaseMonth();
              }}
              disabled={nextMonthButtonDisabled}
            >
              {'>'}
            </button>
          </div>
        )}
        toggleCalendarOnIconClick={true}
        showIcon={true}
        selected={dateInput}
        onSelect={handleDateSelect}
        onChange={(newDate: Date | null) => {
          if (newDate) {
            setDate(newDate);
            if (onChange) {
              onChange(newDate);
            }
          }
        }}
        excludeScrollbar={false}
        todayButton={todayButton ? 'Today' : ''}
      />
      <div className='error'>
        {error} {error && errorLabel}
      </div>
    </div>
  );
};

export default DatePickerComponent;
