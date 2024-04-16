import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import MyProfile from '../MyProfile';
import { REGION_LIST } from '../../../tests/mockData/healthFacilityConstants';

const mockStore = configureMockStore();
const regionList = REGION_LIST;

describe('MyProfile component', () => {
  it('should render user details', async () => {
    const store = mockStore({
      user: {
        user: {
          userId: 1
        }
      }
    });
    render(
      <Provider store={store}>
        <MyProfile />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email ID')).toBeInTheDocument();
      expect(screen.getByText('Mobile Number')).toBeInTheDocument();
      expect(screen.getByText('Gender')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
    });
  });

  it('should open edit modal on button click', () => {
    const store = mockStore({
      user: {
        user: {
          userId: 1
        },
        countryList: [
          { id: 1, countryCode: '91' },
          {
            id: 2,
            countryCode: '232'
          }
        ]
      },
      healthFacility: {
        healthFacilityList: regionList
      }
    });
    render(
      <Provider store={store}>
        <MyProfile />
      </Provider>
    );

    fireEvent.click(screen.getByText('Edit My Profile'));

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });
});
