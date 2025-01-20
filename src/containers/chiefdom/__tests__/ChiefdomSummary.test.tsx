import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import ChiefdomSummary from '../ChiefdomSummary';
import { fetchChiefdomDetail } from '../../../store/chiefdom/actions';
import { ReactNode } from 'react';
import { JSX } from 'react/jsx-runtime';

jest.mock('../../../store/chiefdom/actions', () => ({
  fetchChiefdomDetail: jest.fn(),
  updateChiefdomReq: jest.fn()
}));
jest.mock('../../../store/healthFacility/actions', () => ({
  createHFUserRequest: jest.fn(),
  deleteHFUserRequest: jest.fn(),
  updateHFUserRequest: jest.fn()
}));

jest.mock('../../../components/userForm/UserForm', () => () => {
  return <div data-testid='mock-userForm'>userForm</div>;
});

jest.mock('../../assets/images/edit.svg', () => ({
  ReactComponent: () => <svg data-testid='edit-icon' />
}));

const mockStore = configureStore([]);
const renderWithProviders = (
  ui: string | number | boolean | JSX.Element | Iterable<ReactNode> | null | undefined,
  { store }: any = {}
) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

const mockChiefdomAdmin: any = {
  id: '1',
  tenantId: '100',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  gender: 'Male',
  countryCode: '+1',
  phoneNumber: '1234567890',
  username: 'johndoe',
  timezone: {
    id: '1',
    description: 'America/New_York'
  },
  country: 'United States',
  organizationName: 'Health Department',
  roles: [{ groupName: 'SPICE', id: 'SPICE' }]
};

describe('ChiefdomSummary Component', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      chiefdom: {
        chiefdomDetail: { name: 'Test Chiefdom', districtName: 'Test District' },
        admins: [mockChiefdomAdmin],
        loading: false
      },
      user: {
        role: [{ groupName: 'ADMIN', id: 'ADMIN' }]
      },
      healthFacility: {
        peerSupervisorList: { list: [] },
        villagesList: { list: [] },
        loading: false
      },
      district: {
        loading: false
      },
      common: {
        labelName: null
      }
    });
    store.dispatch = jest.fn();
  });

  it('renders the chiefdom details', () => {
    renderWithProviders(<ChiefdomSummary />, { store });
    expect(screen.getByText('Test Chiefdom')).toBeInTheDocument();
    expect(screen.getByText('Test District')).toBeInTheDocument();
  });

  it('opens edit modal for Chiefdom when Edit button is clicked', async () => {
    const { getAllByTestId } = renderWithProviders(<ChiefdomSummary />, { store });
    const [editButton] = getAllByTestId('edit-icon');
    fireEvent.click(editButton);
    await waitFor(() => expect(screen.getByText('Edit Chiefdom', { selector: 'span' })).toBeInTheDocument());
  });

  it('opens add admin modal when Add Chiefdom Admin button is clicked', async () => {
    const { getAllByTestId } = renderWithProviders(<ChiefdomSummary />, { store });
    const [addButton] = getAllByTestId('detail-card-button');
    fireEvent.click(addButton);
    const [expectedTitle] = screen.getAllByText('Chiefdom Admin');
    await waitFor(() => expect(expectedTitle).toBeInTheDocument());
  });

  it('fetches chiefdom details on component mount', () => {
    renderWithProviders(<ChiefdomSummary />, { store });
    expect(fetchChiefdomDetail).toHaveBeenCalled();
  });

  it('handles search functionality', async () => {
    renderWithProviders(<ChiefdomSummary />, { store });
    const searchInput = screen.getByTestId('table-search-input');
    // Simulate typing in the search box
    fireEvent.change(searchInput, { target: { value: 'John' } });

    // Ensure search triggers an expected dispatch action
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalled();
    });
  });

  it('handles admin delete action', async () => {
    // mock chiefdom admin for delete functionality
    const { getAllByTestId } = renderWithProviders(<ChiefdomSummary />, { store });

    const [deleteButton] = getAllByTestId('delete-icon');
    fireEvent.click(deleteButton);
    await waitFor(() =>
      expect(screen.getByText('Are you sure want to delete the chiefdom admin?')).toBeInTheDocument()
    );
    // Confirm deletion
    const [confirmButton] = getAllByTestId('delete-ok-button');
    fireEvent.click(confirmButton);
    await waitFor(() => expect(store.dispatch).toHaveBeenCalled());
  });
});
