import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import Router, { MemoryRouter, useParams } from 'react-router';
import userEvent from '@testing-library/user-event';
import SubCountyForm from '../SubCountyForm';
import { fetchCountyListDetailReq, fetchCountyOptionsRequest } from '../../../store/county/actions';
import {
  countyOptionsLoadingSelector,
  countyOptionsSelector,
  countySelector,
  countyLoadingSelector
} from '../../../store/county/selectors';
import { roleSelector } from '../../../store/user/selectors';
import '@testing-library/jest-dom/extend-expect';
import { Form } from 'react-final-form';
import '@testing-library/jest-dom/extend-expect';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/subCountyDataConstants';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn()
}));

const mockStore = configureMockStore();
const initialValues = MOCK_DATA_CONSTANTS.TEST_FORM_INITIAL_VALUES;
const store = mockStore(MOCK_DATA_CONSTANTS.TEST_STORE_INITIAL_VALUES);

describe('SubCountyForm', () => {
  const dispatchMock = jest.fn();
  const useSelectorMock = jest.fn();
  let useParamsMock = jest.fn();

  beforeEach(() => {
    (useDispatch as any).mockReturnValue(dispatchMock);
    (useSelector as any).mockImplementation(useSelectorMock);
    useParamsMock = useParams as jest.Mock;
    useParamsMock.mockReturnValue({ regionId: '1', countyId: '1', tenantId: '1' });
    useSelectorMock.mockImplementation((selector: any) => {
      if (selector === countyOptionsSelector) {
        return [{ id: 1, name: 'Account 1' }];
      }
      if (selector === countyOptionsLoadingSelector) {
        return false;
      }
      if (selector === countySelector) {
        return { id: 1, name: 'Account 1' };
      }
      if (selector === countyLoadingSelector) {
        return false;
      }
      if (selector === roleSelector) {
        return 'SUPER_ADMIN';
      }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Form
            onSubmit={() => {
              // form submission logic
            }}
            initialValues={initialValues}
            render={() => <SubCountyForm nestingKey='subCounty' />}
          />
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders SubCountyForm without errors and dispatches fetchAccountOptionsRequest', async () => {
    const input = screen.getByRole('textbox', { name: 'subCounty.name' });
    expect(input).toBeInTheDocument();
    dispatchMock(fetchCountyOptionsRequest('3'));
    jest.spyOn(Router, 'useParams').mockReturnValue({ regionId: '1', countyId: '1', tenantId: '1' });
    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(fetchCountyOptionsRequest('3'));
    });
  });

  it('user event for input', () => {
    const input = screen.getByRole('textbox', { name: 'subCounty.name' });
    userEvent.type(input, 'Sample Text');
    expect(input).toHaveValue('Sample Text');
  });

  it('dispatch fetchAccountDetailReq', async () => {
    dispatchMock(fetchCountyListDetailReq({ tenantId: '1', id: '2' }));
    jest.spyOn(Router, 'useParams').mockReturnValue({ regionId: '1', countyId: '1', tenantId: '1' });
    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(fetchCountyListDetailReq({ tenantId: '1', id: '2' }));
    });
  });
});
