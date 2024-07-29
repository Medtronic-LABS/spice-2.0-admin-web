import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DatePickerComponent from '../DatePicker';
import { mount } from 'enzyme';

jest.mock('../../../assets/images/calendar-icon.svg', () => ({
  ReactComponent: 'CalendarIcon'
}));

describe('DatePickerComponent', () => {
  test('renders the component', () => {
    render(<DatePickerComponent label='Test Label' isShowLabel={true} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  test('renders label when isShowLabel is true', () => {
    render(<DatePickerComponent label='Test Label' isShowLabel={true} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  test('does not render label when isShowLabel is false', () => {
    render(<DatePickerComponent label='Test Label' isShowLabel={false} />);
    expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
  });

  test('shows required asterisk when required is true', () => {
    render(<DatePickerComponent label='Test Label' isShowLabel={true} required={true} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  // test('selects a date and triggers onChange', () => {
  //   const handleChange = jest.fn();
  //   render(<DatePickerComponent label='Test Label' isShowLabel={true} onChange={handleChange} />);
  //   fireEvent.click(screen.getByRole('button', { name: /calendaricon/i }));
  //   fireEvent.click(screen.getByText('15'));
  //   expect(handleChange).toHaveBeenCalledTimes(1);
  // });

  it('renders today button if todayButton is true', async () => {
    const wrapper = mount(<DatePickerComponent label='Test Label' isShowLabel={true} todayButton={true} />);
    // fireEvent.click(screen.getByRole('button', { name: /calendaricon/i }));
    const popUpProps = wrapper.find('WithFloating');
    expect(popUpProps.prop('todayButton')).toEqual('Today');
    // await waitFor(() => expect(screen.getByText(/Today/)).toBeInTheDocument());
  });
  // it('renders today button if todayButton is true', async () => {
  //   const wrapper = render(<DatePickerComponent label='Test Label' isShowLabel={true} todayButton={true} />);
  //   fireEvent.click(screen.getByRole('button', { name: /CalendarIcon/i }));
  //   // console.log(wrapper.debug());
  //   screen.debug();
  //   await waitFor(() => expect(screen.getByText(/Today/)).toBeInTheDocument());
  // });

  test('shows error message', () => {
    render(
      <DatePickerComponent label='Test Label' isShowLabel={true} error='Error message' errorLabel='Error label' />
    );
    expect(screen.getByText(/Error message/)).toBeInTheDocument();
    expect(screen.getByText(/Error label/)).toBeInTheDocument();
  });
});
