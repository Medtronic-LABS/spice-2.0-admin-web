import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import DistrictChiefdomVillageFields from '../DistrictChiefdomVillageFields';
import * as HF_ACTION_TYPES from '../../../../store/healthFacility/actionTypes';
import { foRole, poRole, areaManagerRole, divisionalManagerRole } from '../../../../constants/roleConstants';

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
    index: 0
  };

  const renderWithForm = (
    props: Partial<React.ComponentProps<typeof DistrictChiefdomVillageFields>> = {},
    storeState = baseStore,
    initialValues: Record<string, unknown> = { users: [{ role: [{ name: poRole }] }] }
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
            role: [{ name: poRole }],
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
    let formApi: any;
    render(
      <Provider store={store}>
        <Form
          onSubmit={jest.fn()}
          initialValues={{
            users: [
              {
                role: [{ name: poRole }],
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
    let formApi: any;
    render(
      <Provider store={store}>
        <Form
          onSubmit={jest.fn()}
          initialValues={{
            users: [
              {
                role: [{ name: poRole }],
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
    renderWithForm({}, baseStore, { users: [{ role: [{ name: foRole }] }] });
    expect(screen.queryByTestId('trigger-select-County')).not.toBeInTheDocument();
    expect(screen.queryByTestId('trigger-select-Chiefdom')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('multi-select').length).toBe(3);
  });

  it('calls isError with meta and passes result to SelectInput as error prop', () => {
    const customError = 'District is required';
    const isError = jest.fn(() => customError);
    renderWithForm({ isError });
    expect(isError).toHaveBeenCalled();
    const selectProps = mockSelectInput.mock.calls[0][0];
    expect(selectProps.error).toBe(customError);
  });

  it('fetches branches with unionIds when PO/FO (organizer) selects villages', () => {
    const { store } = renderWithForm(
      {},
      baseStore,
      {
        users: [
          {
            role: [{ name: poRole }],
            districts: { id: 5, name: 'D' },
            chiefdoms: { id: 7, name: 'C' },
            villages: [{ id: 100 }, { id: 200 }]
          }
        ]
      }
    );
    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'FETCH_BRANCHES_BY_UNION_REQUEST',
          payload: {
            unionIds: [100, 200]
          }
        })
      ])
    );
  });

  it('does not fetch branches when organizer (PO/FO) has no villages selected', () => {
    const { store } = renderWithForm(
      {},
      baseStore,
      {
        users: [
          {
            role: [{ name: poRole }],
            districts: { id: 5, name: 'D' },
            chiefdoms: { id: 7, name: 'C' },
            villages: []
          }
        ]
      }
    );
    const branchActions = store.getActions().filter(
      (action: any) => action.type === 'FETCH_BRANCHES_BY_UNION_REQUEST'
    );
    expect(branchActions.length).toBe(0);
  });

  it('fetches branches with districtIds for divisional manager (manager role)', () => {
    const { store } = renderWithForm(
      {},
      baseStore,
      {
        users: [
          {
            role: [{ name: divisionalManagerRole }],
            districts: [{ id: 1 }, { id: 2 }],
            chiefdoms: { id: 7, name: 'C' },
            villages: []
          }
        ]
      }
    );
    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'FETCH_BRANCHES_BY_UNION_REQUEST',
          payload: {
            districtIds: [1, 2]
          }
        })
      ])
    );
  });

  it('fetches branches with chiefdomIds for area manager role', () => {
    const { store } = renderWithForm(
      {},
      baseStore,
      {
        users: [
          {
            role: [{ name: areaManagerRole }],
            districts: [{ id: 5 }],
            chiefdoms: [{ id: 10 }, { id: 20 }],
            villages: []
          }
        ]
      }
    );
    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'FETCH_BRANCHES_BY_UNION_REQUEST',
          payload: expect.objectContaining({
            chiefdomIds: [10, 20],
            districtIds: [5]
          })
        })
      ])
    );
  });

  it('does not fetch branches when manager has no districts selected', () => {
    const { store } = renderWithForm(
      {},
      baseStore,
      {
        users: [
          {
            role: [{ name: divisionalManagerRole }],
            districts: [],
            chiefdoms: { id: 7, name: 'C' }
          }
        ]
      }
    );
    const branchActions = store.getActions().filter(
      (action: any) => action.type === 'FETCH_BRANCHES_BY_UNION_REQUEST'
    );
    expect(branchActions.length).toBe(0);
  });

  it('still fetches branches for area manager with districts but no chiefdoms', () => {
    const { store } = renderWithForm(
      {},
      baseStore,
      {
        users: [
          {
            role: [{ name: areaManagerRole }],
            districts: [{ id: 5 }],
            chiefdoms: []
          }
        ]
      }
    );
    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'FETCH_BRANCHES_BY_UNION_REQUEST',
          payload: {
            districtIds: [5]
          }
        })
      ])
    );
  });

  it('includes both chiefdomIds and districtIds when area manager has both districts and chiefdoms', () => {
    const { store } = renderWithForm(
      {},
      baseStore,
      {
        users: [
          {
            role: [{ name: areaManagerRole }],
            districts: [{ id: 1 }],
            chiefdoms: [{ id: 10 }]
          }
        ]
      }
    );
    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'FETCH_BRANCHES_BY_UNION_REQUEST',
          payload: {
            districtIds: [1],
            chiefdomIds: [10]
          }
        })
      ])
    );
  });

  it('includes only unionIds when FO (organizer) selects villages', () => {
    const { store } = renderWithForm(
      {},
      baseStore,
      {
        users: [
          {
            role: [{ name: foRole }],
            districts: [{ id: 1 }, { id: 2 }],
            chiefdoms: [{ id: 7 }],
            villages: [{ id: 100 }]
          }
        ]
      }
    );
    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'FETCH_BRANCHES_BY_UNION_REQUEST',
          payload: {
            unionIds: [100]
          }
        })
      ])
    );
  });

  it('correctly extracts and memoizes multiple village IDs from selectedVillages', () => {
    const { store } = renderWithForm(
      {},
      baseStore,
      {
        users: [
          {
            role: [{ name: poRole }],
            districts: { id: 5, name: 'D' },
            chiefdoms: { id: 7, name: 'C' },
            villages: [{ id: 50 }, { id: 60 }, { id: 70 }]
          }
        ]
      }
    );
    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'FETCH_BRANCHES_BY_UNION_REQUEST',
          payload: {
            unionIds: [50, 60, 70]
          }
        })
      ])
    );
  });

  it('handles single village object (not array) correctly', () => {
    const { store } = renderWithForm(
      {},
      baseStore,
      {
        users: [
          {
            role: [{ name: poRole }],
            districts: { id: 5, name: 'D' },
            chiefdoms: { id: 7, name: 'C' },
            villages: { id: 88, name: 'SingleVillage' }
          }
        ]
      }
    );
    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'FETCH_BRANCHES_BY_UNION_REQUEST',
          payload: {
            unionIds: [88]
          }
        })
      ])
    );
  });

  it('clears branches when villages are changed via MultiSelect onChange', async () => {
    mockMultiSelect.mockClear();
    const store = mockStore(baseStore);
    let formApi: any;
    render(
      <Provider store={store}>
        <Form
          onSubmit={jest.fn()}
          initialValues={{
            users: [
              {
                role: [{ name: poRole }],
                districts: { id: 5, name: 'D' },
                chiefdoms: { id: 7, name: 'C' },
                villages: [{ id: 3, name: 'V1' }],
                branches: [{ id: 101, name: 'B1' }]
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
    // Find the last villages MultiSelect call after render is complete
    const villagesMultiSelectProps = mockMultiSelect.mock.calls
      .filter((call) => call[0].label === 'Villages')
      .pop()?.[0];

    expect(villagesMultiSelectProps).toBeDefined();
    expect(villagesMultiSelectProps?.onChange).toBeDefined();

    await act(async () => {
      villagesMultiSelectProps?.onChange?.([{ id: 4, name: 'V2' }]);
    });

    expect(changeSpy).toHaveBeenCalledWith('users.0.branches', undefined);
    changeSpy.mockRestore();
  });

  it('renders villages MultiSelect only when organizer (PO/FO) is selected', () => {
    mockMultiSelect.mockClear();
    renderWithForm({}, baseStore, {
      users: [{ role: [{ name: poRole }] }]
    });
    const villagesCalls = mockMultiSelect.mock.calls.filter((call) => call[0].label === 'Villages');
    expect(villagesCalls.length).toBeGreaterThanOrEqual(1);
    const villagesProps = villagesCalls[villagesCalls.length - 1][0];
    expect(villagesProps).toMatchObject({
      label: 'Villages',
      labelKey: 'name',
      valueKey: 'id',
      isMulti: true,
      isSelectAll: true,
      isShowLabel: true,
      required: true
    });
  });

  it('does not render villages field when organizer role is not selected', () => {
    renderWithForm({}, baseStore, {
      users: [{ role: [{ name: divisionalManagerRole }] }]
    });
    const villagesCalls = mockMultiSelect.mock.calls.filter((call) => call[0].label === 'Villages');
    expect(villagesCalls.length).toBe(0);
  });
});
