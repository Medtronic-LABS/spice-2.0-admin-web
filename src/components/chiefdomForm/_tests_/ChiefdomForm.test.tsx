import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import Router, { MemoryRouter, useParams } from 'react-router';
import userEvent from '@testing-library/user-event';
import ChiefdomForm from '../ChiefdomForm';
import { fetchDistrictDetailReq, fetchDistrictOptionsRequest } from '../../../store/district/actions';
import {
  districtOptionsLoadingSelector,
  districtOptionsSelector,
  districtSelector,
  districtLoadingSelector
} from '../../../store/district/selectors';
import { roleSelector } from '../../../store/user/selectors';
import '@testing-library/jest-dom/extend-expect';
import { Form } from 'react-final-form';
import '@testing-library/jest-dom/extend-expect';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/chiefdomDataConstants';

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

describe('ChiefdomForm', () => {
  const dispatchMock = jest.fn();
  const useSelectorMock = jest.fn();
  let useParamsMock = jest.fn();

  beforeEach(() => {
    (useDispatch as any).mockReturnValue(dispatchMock);
    (useSelector as any).mockImplementation(useSelectorMock);
    useParamsMock = useParams as jest.Mock;
    useParamsMock.mockReturnValue({ regionId: '1', districtId: '1', tenantId: '1' });
    useSelectorMock.mockImplementation((selector: any) => {
      if (selector === districtOptionsSelector) {
        return [{ id: 1, name: 'District 1' }];
      }
      if (selector === districtOptionsLoadingSelector) {
        return false;
      }
      if (selector === districtSelector) {
        return { id: 1, name: 'District 1' };
      }
      if (selector === districtLoadingSelector) {
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
            render={() => <ChiefdomForm nestingKey='chiefdom' />}
          />
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders ChiefdomForm without errors and dispatches fetchDistrictOptionsRequest', async () => {
    const input = screen.getByRole('textbox', { name: 'chiefdom.name' });
    expect(input).toBeInTheDocument();
    dispatchMock(fetchDistrictOptionsRequest('3'));
    jest.spyOn(Router, 'useParams').mockReturnValue({ regionId: '1', districtId: '1', tenantId: '1' });
    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(fetchDistrictOptionsRequest('3'));
    });
  });

  it('user event for input', () => {
    const input = screen.getByRole('textbox', { name: 'chiefdom.name' });
    userEvent.type(input, 'Sample Text');
    expect(input).toHaveValue('Sample Text');
  });

  it('dispatch fetchDistrictDetailReq', async () => {
    dispatchMock(fetchDistrictDetailReq({ tenantId: '1', id: '2' }));
    jest.spyOn(Router, 'useParams').mockReturnValue({ regionId: '1', districtId: '1', tenantId: '1' });
    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(fetchDistrictDetailReq({ tenantId: '1', id: '2' }));
    });
  });
});
