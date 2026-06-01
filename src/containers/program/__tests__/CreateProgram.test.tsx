import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import configureMockStore from 'redux-mock-store';

import CreateProgram from '../CreateProgram';
import { HistoryRouter as Router } from '../../../tests/routerTestUtils';

jest.mock('../ProgramForm', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', { 'data-testid': 'program-form' }, 'Program form')
}));

const mockStore = configureMockStore();

describe('CreateProgram', () => {
  let store: any;

  const props: any = {
    role: 'admin',
    countryId: '1',
    match: {
      params: {
        regionId: '1',
        tenantId: '1',
        accountId: '1'
      }
    },
    history: {
      push: jest.fn()
    }
  };

  beforeEach(() => {
    store = mockStore({
      program: {
        loading: false
      },
      site: {
        siteDropdownOptions: {}
      },
      user: {
        user: {
          country: { id: 1, name: 'Test', appTypes: [] },
          appTypes: []
        }
      },
      healthFacility: {
        healthFacilityList: []
      },
      common: {
        labelName: null
      }
    });
  });

  it('should render the component without errors', () => {
    const history = createMemoryHistory({ initialEntries: ['/create-program'] });

    render(
      <Provider store={store}>
        <Router history={history}>
          <CreateProgram {...props} />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId('program-form')).toBeInTheDocument();
  });

  it('renders the program form and handles cancel navigation', async () => {
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: ['/create-program'] });

    render(
      <Provider store={store}>
        <Router history={history}>
          <CreateProgram {...props} />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId('program-form')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(history.location.pathname).toBe('/region/1/1/program');
  });
});
