import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import Router, { MemoryRouter, useParams } from 'react-router';
import userEvent from '@testing-library/user-event';
import SubCountyForm from '../SubCountyForm';
import { fetchAccountDetailReq, fetchAccountOptionsRequest } from '../../../store/account/actions';
import {
  accountOptionsLoadingSelector,
  accountOptionsSelector,
  accountSelector,
  accountsLoadingSelector
} from '../../../store/account/selectors';
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
    useParamsMock.mockReturnValue({ regionId: '1', accountId: '1', tenantId: '1' });
    useSelectorMock.mockImplementation((selector: any) => {
      if (selector === accountOptionsSelector) {
        return [{ id: 1, name: 'Account 1' }];
      }
      if (selector === accountOptionsLoadingSelector) {
        return false;
      }
      if (selector === accountSelector) {
        return { id: 1, name: 'Account 1' };
      }
      if (selector === accountsLoadingSelector) {
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
            render={() => <SubCountyForm nestingKey='operatingUnit' />}
          />
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders SubCountyForm without errors and dispatches fetchAccountOptionsRequest', async () => {
    const input = screen.getByRole('textbox', { name: 'operatingUnit.name' });
    expect(input).toBeInTheDocument();
    dispatchMock(fetchAccountOptionsRequest('3'));
    jest.spyOn(Router, 'useParams').mockReturnValue({ regionId: '1', accountId: '1', tenantId: '1' });
    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(fetchAccountOptionsRequest('3'));
    });
  });

  it('user event for input', () => {
    const input = screen.getByRole('textbox', { name: 'operatingUnit.name' });
    userEvent.type(input, 'Sample Text');
    expect(input).toHaveValue('Sample Text');
  });

  it('dispatch fetchAccountDetailReq', async () => {
    dispatchMock(fetchAccountDetailReq({ tenantId: '1', id: '2' }));
    jest.spyOn(Router, 'useParams').mockReturnValue({ regionId: '1', accountId: '1', tenantId: '1' });
    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(fetchAccountDetailReq({ tenantId: '1', id: '2' }));
    });
  });
});
