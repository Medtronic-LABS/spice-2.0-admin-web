import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import DistrictChiefdomVillageFields from '../DistrictChiefdomVillageFields';
import * as HF_ACTION_TYPES from '../../../../store/healthFacility/actionTypes';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ tenantId: '10', regionId: '99' })
}));

jest.mock('../../../../global/sessionStorageServices', () => ({
  __esModule: true,
  default: { getItem: jest.fn(() => null) }
}));

jest.mock('../../../../hooks/appTypeBasedConfigs', () => ({
  __esModule: true,
  default: () => ({
    district: { s: 'County' },
    chiefdom: { s: 'Chiefdom' },
    village: { p: 'Villages' }
  })
}));

const mockSelectInput = jest.fn();
jest.mock('../../../formFields/SelectInput', () => ({
  __esModule: true,
  default: (props: any) => {
    mockSelectInput(props);
    return (
      <div data-testid='select-input'>
        <span>{props.label}</span>
        <button
          type='button'
          data-testid={`trigger-select-${props.label}`}
          onClick={() => {
            if (props.label === 'County') {
              props.onChange?.({ id: 10, tenantId: '55', name: 'Dist A' });
            } else {
              props.onChange?.({ id: 20, name: 'Chief B' });
            }
          }}
        >
          trigger
        </button>
      </div>
    );
  }
}));

const mockMultiSelect = jest.fn();
jest.mock('../../../multiSelect/MultiSelect', () => ({
  __esModule: true,
  default: (props: any) => {
    mockMultiSelect(props);
    return (
      <div data-testid='multi-select'>
        <span>{props.label}</span>
      </div>
    );
  }
}));

const mockStore = configureStore([]);

const baseStore = {
  user: {
    user: { country: { id: 55 } },
    userRoles: {},
    isRolesLoading: false
  },
  district: {
    districtList: [{ id: 1, name: 'D1' }],
    loading: false
  },
  healthFacility: {
    chiefdomList: [{ id: 2, name: 'C1' }],
    chiefdomLoading: false,
    villagesList: [{ id: 3, name: 'V1' }],
    villagesLoading: false
  }
};

describe('DistrictChiefdomVillageFields', () => {
  const defaultProps = {
    name: 'users.0',
    isError: jest.fn((meta: any) => meta?.error),
    index: 0,
    isFoSelected: false
  };

  const renderWithForm = (
    props: Partial<React.ComponentProps<typeof DistrictChiefdomVillageFields>> = {},
    storeState = baseStore,
    initialValues: Record<string, unknown> = { users: [{}] }
  ) => {
    const store = mockStore(storeState);
    const view = render(
      <Provider store={store}>
        <Form onSubmit={jest.fn()} initialValues={initialValues}>
          {({ form }) => (
            <DistrictChiefdomVillageFields form={form} {...defaultProps} {...props} />
          )}
        </Form>
      </Provider>
    );
    return { ...view, store };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSelectInput.mockClear();
    mockMultiSelect.mockClear();
  });

  it('renders district, chiefdom, and village fields with configured labels', () => {
    renderWithForm();
    expect(screen.getAllByTestId('select-input').length).toBe(2);
    expect(screen.getByText('County')).toBeInTheDocument();
    expect(screen.getByText('Chiefdom')).toBeInTheDocument();
    expect(screen.getByTestId('multi-select')).toBeInTheDocument();
    expect(screen.getByText('Villages')).toBeInTheDocument();
  });

  it('dispatches fetch district list when countryId is available from route', () => {
    const { store } = renderWithForm();
    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'FETCH_DISTRICT_LIST_REQUEST',
          countryId: 99,
          tenantId: '10',
          isActive: true
        })
      ])
    );
  });

  it('dispatches fetch chiefdom list when selected district is present', () => {
    const { store } = renderWithForm(
      {},
      baseStore,
      {
        users: [{ districts: { id: 1, tenantId: '88', name: 'D' } }]
      }
    );
    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: HF_ACTION_TYPES.FETCH_CHIEFDOM_LIST_REQUEST_FOR_HF,
          countryId: 99,
          districtIds: [1]
        })
      ])
    );
  });

  it('dispatches fetch villages when chiefdom id and countryId are set', () => {
    const { store } = renderWithForm(
      {},
      baseStore,
      {
        users: [
          {
            districts: { id: 5, tenantId: '88', name: 'D' },
            chiefdoms: { id: 7, name: 'C' }
          }
        ]
      }
    );
    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: HF_ACTION_TYPES.FETCH_VILLAGES_LIST_REQUEST_FOR_HF,
          countryId: 99,
          chiefdomIds: [7]
        })
      ])
    );
  });

  it('passes list options and loading flags from Redux into SelectInput and MultiSelect', () => {
    renderWithForm();
    const districtCall = mockSelectInput.mock.calls.find((c) => c[0].label === 'County');
    const chiefdomCall = mockSelectInput.mock.calls.find((c) => c[0].label === 'Chiefdom');
    expect(districtCall?.[0].options).toEqual(baseStore.district.districtList);
    expect(districtCall?.[0].loadingOptions).toBe(false);
    expect(chiefdomCall?.[0].options).toEqual(baseStore.healthFacility.chiefdomList);
    expect(mockMultiSelect.mock.calls[0][0].options).toEqual(baseStore.healthFacility.villagesList);
    expect(mockMultiSelect.mock.calls[0][0].loadingOptions).toBe(false);
  });

  it('clears chiefdoms and villages when district changes', async () => {
    const store = mockStore(baseStore);
    let formApi: { change: (...args: unknown[]) => void };
    render(
      <Provider store={store}>
        <Form
          onSubmit={jest.fn()}
          initialValues={{
            users: [
              {
                districts: { id: 1, tenantId: '1', name: 'Old' },
                chiefdoms: { id: 2, name: 'C' },
                villages: [{ id: 3 }]
              }
            ]
          }}
        >
          {({ form }) => {
            formApi = form;
            return <DistrictChiefdomVillageFields form={form} {...defaultProps} />;
          }}
        </Form>
      </Provider>
    );
    const changeSpy = jest.spyOn(formApi!, 'change');
    await act(async () => {
      screen.getByTestId('trigger-select-County').click();
    });
    expect(changeSpy).toHaveBeenCalledWith('users.0.chiefdoms', undefined);
    expect(changeSpy).toHaveBeenCalledWith('users.0.villages', undefined);
    changeSpy.mockRestore();
  });

  it('clears villages when chiefdom changes', async () => {
    const store = mockStore(baseStore);
    let formApi: { change: (...args: unknown[]) => void };
    render(
      <Provider store={store}>
        <Form
          onSubmit={jest.fn()}
          initialValues={{
            users: [
              {
                districts: { id: 1, tenantId: '1', name: 'D' },
                chiefdoms: { id: 2, name: 'C' },
                villages: [{ id: 3 }]
              }
            ]
          }}
        >
          {({ form }) => {
            formApi = form;
            return <DistrictChiefdomVillageFields form={form} {...defaultProps} />;
          }}
        </Form>
      </Provider>
    );
    const changeSpy = jest.spyOn(formApi!, 'change');
    await act(async () => {
      screen.getByTestId('trigger-select-Chiefdom').click();
    });
    expect(changeSpy).toHaveBeenCalledWith('users.0.villages', undefined);
    changeSpy.mockRestore();
  });

  it('applies col-sm-6 col-12 when isHFCreate is false or undefined', () => {
    const { container } = renderWithForm();
    const cols = container.querySelectorAll('.col-sm-6.col-12');
    expect(cols.length).toBe(3);
  });

  it('applies col-12 col-sm-6 col-lg-4 when isHFCreate is true', () => {
    const { container } = renderWithForm({ isHFCreate: true });
    const cols = container.querySelectorAll('.col-12.col-sm-6.col-lg-4');
    expect(cols.length).toBe(3);
  });

  it('renders district and chiefdom as multiselect when FO is selected', () => {
    renderWithForm({ isFoSelected: true });
    expect(screen.queryByTestId('trigger-select-County')).not.toBeInTheDocument();
    expect(screen.queryByTestId('trigger-select-Chiefdom')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('multi-select').length).toBe(3);
  });
});
