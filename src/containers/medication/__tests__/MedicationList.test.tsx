import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import MedicationList from '../MedicationList';
import { APP_TYPE } from '../../../constants/appConstants';

// Mock the required modules
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: () => ({
    regionId: '123',
    tenantId: '456'
  }),
  useHistory: () => ({
    push: jest.fn()
  })
}));

const mockStore = configureStore([]);

describe('MedicationList Component', () => {
  let store: any;
  let history: any;

  beforeEach(() => {
    history = createMemoryHistory();
    store = mockStore({
      medication: {
        list: [
          {
            id: 1,
            name: 'Test Medication',
            brandId: 1,
            brandName: 'Test Brand',
            classificationId: 1,
            classificationName: 'Test Classification',
            dosageFormId: 1,
            dosageFormName: 'Test Dosage'
          }
        ],
        loading: false,
        listCount: 1
      },
      user: {
        appTypes: [APP_TYPE.COMMUNITY]
      }
    });
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <Router history={history}>
          <MedicationList />
        </Router>
      </Provider>
    );
  };

  it('displays loader when loading is true', () => {
    store = mockStore({
      medication: {
        list: [],
        loading: true,
        listCount: 0
      },
      user: {
        appTypes: [APP_TYPE.COMMUNITY]
      }
    });
    renderComponent();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
