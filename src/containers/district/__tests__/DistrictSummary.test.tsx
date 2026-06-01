import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import DistrictSummary from '../DistrictSummary';

jest.mock('../../../components/detailCard/DetailCard', () => ({
  __esModule: true,
  default: ({ header, buttonLabel, customLabel, onButtonClick, onCustomClick, onSearch, children }: any) =>
    require('react').createElement(
      'div',
      { 'data-testid': 'detail-card' },
      require('react').createElement('div', null, header),
      buttonLabel
        ? require('react').createElement(
            'button',
            { type: 'button', onClick: () => onButtonClick?.({}) },
            buttonLabel
          )
        : null,
      customLabel
        ? require('react').createElement(
            'button',
            { type: 'button', onClick: () => onCustomClick?.() },
            customLabel
          )
        : null,
      onSearch
        ? require('react').createElement('input', {
            'data-testid': `${header}-search`,
            onChange: (event: any) => onSearch(event.target.value)
          })
        : null,
      children
    )
}));

jest.mock('../../../components/customTable/CustomTable', () => ({
  __esModule: true,
  default: ({ onRowEdit, onDeleteClick }: any) =>
    require('react').createElement(
      'div',
      { 'data-testid': 'custom-table' },
      require('react').createElement(
        'button',
        {
          type: 'button',
          onClick: () =>
            onRowEdit?.({
              roles: [],
              countryCode: '',
              phoneNumber: '',
              firstName: 'Admin',
              lastName: 'User'
            })
        },
        'Edit row'
      ),
      require('react').createElement(
        'button',
        {
          type: 'button',
          onClick: () =>
            onDeleteClick?.({
              data: {
                id: '1',
                tenantId: '1'
              },
              index: 0
            })
        },
        'Delete row'
      )
    )
}));

jest.mock('../../../components/modal/ModalForm', () => ({
  __esModule: true,
  default: ({ show, title, handleDeactivate, render }: any) => {
    if (!show) {
      return null;
    }

    return require('react').createElement(
      'div',
      { 'data-testid': 'modal' },
      require('react').createElement('div', null, title),
      render ? render({}) : null,
      handleDeactivate
        ? require('react').createElement(
            'button',
            { type: 'button', onClick: () => handleDeactivate() },
            'Open deactivate'
          )
        : null
    );
  }
}));

jest.mock('../../../components/userForm/UserForm', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', { 'data-testid': 'user-form' }, 'User form')
}));

jest.mock('../../createDistrict/DistrictForm', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', { 'data-testid': 'district-form' }, 'District form')
}));

jest.mock('../../../components/deactivate/Deactivation', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', { 'data-testid': 'deactivation-form' }, 'Deactivate form')
}));

jest.mock('../DistrictConsentForm', () => ({
  __esModule: true,
  default: ({ isOpen }: any) =>
    isOpen ? require('react').createElement('div', { 'data-testid': 'district-consent-form' }) : null
}));

jest.mock('../../../hooks/useCountryId', () => ({
  __esModule: true,
  default: () => 1
}));

const mockPush = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({
      districtId: '1',
      tenantId: '2'
    })
  };
});

jest.mock('../../../utils/routerCompat', () => ({
  ...jest.requireActual('../../../utils/routerCompat'),
  useHistoryCompat: () => ({
    location: { pathname: '/', search: '', hash: '', state: null, key: 'district-summary' },
    push: mockPush,
    replace: jest.fn(),
    goBack: jest.fn()
  })
}));

const mockStore = configureMockStore();

describe('District Summary', () => {
  let store: any;

  beforeEach(() => {
    mockPush.mockClear();
    store = mockStore({
      district: {
        district: {
          id: '1',
          countryId: 1,
          clinicalWorkflow: [1],
          users: [
            {
              id: '1',
              firstName: 'John',
              lastName: 'Doe',
              username: 'john@example.com',
              phoneNumber: '1234567890',
              countryCode: '91',
              roles: [],
              tenantId: '1'
            }
          ],
          name: 'DistrictOne',
          maxNoOfUsers: '22',
          tenantId: '1'
        },
        loading: false,
        clinicalWorkflows: []
      },
      workflow: {
        loading: false
      },
      user: {
        user: {
          role: 'SUPER_ADMIN',
          countryId: '1',
          country: { id: 1, tenantId: 1, appTypes: [] },
          appTypes: []
        }
      },
      healthFacility: {
        loading: false,
        workflowLoading: false
      },
      common: {
        labelName: null
      }
    });
  });

  it('should render CustomTable and two DetailCard components', () => {
    render(
      <Provider store={store}>
        <DistrictSummary />
      </Provider>
    );

    expect(screen.getByTestId('custom-table')).toBeInTheDocument();
    expect(screen.getAllByTestId('detail-card')).toHaveLength(2);
  });

  it('should open the consent form from the district summary card', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <DistrictSummary />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: 'Consent form' }));

    expect(screen.getByTestId('district-consent-form')).toBeInTheDocument();
  });

  it('should open the add district admin modal from the admin card', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <DistrictSummary />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: 'Add District Admin' }));

    expect(screen.getByTestId('modal')).toHaveTextContent('Add District Admin');
    expect(screen.getByTestId('user-form')).toBeInTheDocument();
  });

  it('should open the edit district admin modal from the table', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <DistrictSummary />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: 'Edit row' }));

    expect(screen.getByText('Edit District Admin')).toBeInTheDocument();
    expect(screen.getByTestId('user-form')).toBeInTheDocument();
  });

  it('should dispatch delete admin request from the table', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <DistrictSummary />
      </Provider>
    );

    store.clearActions();
    await user.click(screen.getByRole('button', { name: 'Delete row' }));

    expect(store.getActions()).toContainEqual(expect.objectContaining({ type: 'DELETE_HEALTH_FACILITY_USER_REQUEST' }));
  });

  it('should open the district edit modal and switch to deactivate mode', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <DistrictSummary />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: 'Edit District' }));

    expect(screen.getByTestId('modal')).toHaveTextContent('Edit District');
    expect(screen.getByTestId('district-form')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open deactivate' }));

    expect(screen.getByText('Deactivate District')).toBeInTheDocument();
    expect(screen.getByTestId('deactivation-form')).toBeInTheDocument();
  });
});
