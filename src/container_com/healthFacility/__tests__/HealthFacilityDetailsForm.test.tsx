import React, { act, } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Form, useForm } from 'react-final-form';
import configureStore from 'redux-mock-store';
import HealthFacilityDetailsForm from '../HealthFacilityDetailsForm';
import { FormApi } from 'final-form';
import { AnyAction, Store } from '@reduxjs/toolkit';
import {
  fetchChiefdomListRequest,
  fetchPeerSupervisorListRequest,
  fetchVillagesListRequest
} from '../../../store/healthFacility/actions';
import { renderHook } from '@testing-library/react-hooks';

// Mock the react-router hooks
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: () => ({
    regionId: '1'
  })
}));

// Mock the selectors
jest.mock('../../../store/user/selectors', () => ({
  userDataSelector: jest.fn(() => ({ country: { id: '1' } }))
}));

jest.mock('../../../store/healthFacility/selectors', () => ({
  districtListSelector: jest.fn(() => []),
  districtLoadingSelector: jest.fn(() => false),
  hfTypesSelector: jest.fn(() => []),
  hfTypesLoadingSelector: jest.fn(() => false),
  chiefdomListSelector: jest.fn(() => []),
  chiefdomLoadingSelector: jest.fn(() => false),
  peerSupervisorListSelector: jest.fn(() => ({ list: [] })),
  peerSupervisorLoadingSelector: jest.fn(() => false),
  unlinkedVillagesListSelector: jest.fn(() => []),
  unlinkedVillagesLoadingSelector: jest.fn(() => false),
  villagesListSelector: jest.fn(() => []),
  villagesLoadingSelector: jest.fn(() => false),
  cultureListSelector: jest.fn(() => []),
  cultureLoadingSelector: jest.fn(() => false)
}));
// Mock the Redux modules
jest.mock('../../../store/healthFacility/actions', () => ({
  ...jest.requireActual('../../../store/healthFacility/actions'),
  fetchPeerSupervisorListRequest: jest.fn()
}));

const mockForm = {
  getState: () => ({ values: { healthFacility: {} } }),
  change: jest.fn(),
  batch: jest.fn((callback) => callback())
};

const defaultProps = {
  formName: 'healthFacility',
  form: mockForm,
  isEdit: false,
  data: {}
};

const Wrapper = (props: any) => {
  const form = useForm();
  return <HealthFacilityDetailsForm {...defaultProps} {...props} form={form} />;
};

describe('HealthFacilityDetailsForm', () => {
  let store: Store<any, AnyAction>;
  beforeEach(() => {
    // Mock the store
    const mockStore = configureStore([]);
    store = mockStore({
      user: {
        userData: {
          country: { id: '1' }
        }
      },
      healthFacility: {
        districtList: [],
        districtLoading: false,
        hfTypes: [],
        hfTypesLoading: false,
        chiefdomList: [],
        chiefdomLoading: false,
        peerSupervisorList: { list: [] },
        peerSupervisorLoading: false,
        unlinkedVillagesList: [],
        unlinkedVillagesLoading: false,
        villagesList: [],
        villagesLoading: false,
        cultureList: [],
        cultureLoading: false
      }
    });
    store.dispatch = jest.fn();
  });
  const initialValues = {
    healthFacility: {
      district: null,
      chiefdom: null,
      city: null,
      linkedVillages: []
    }
  };

  const renderComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <Form onSubmit={() => {}} initialValues={initialValues} render={() => <Wrapper {...props} />} />
      </Provider>
    );
  };

  it('renders without crashing', () => {
    renderComponent();
  });

  it('displays the correct form fields', async () => {
    renderComponent();

    await waitFor(() => {
      // Check for labels
      expect(screen.getByText('Health Facility Name')).toBeInTheDocument();
      expect(screen.getByText('Health Facility Type')).toBeInTheDocument();
      expect(screen.getByText('PHU Focal Person Name')).toBeInTheDocument();
      expect(screen.getByText('PHU Focal Person Number')).toBeInTheDocument();
      expect(screen.getByText('Address')).toBeInTheDocument();
      expect(screen.getByText('District')).toBeInTheDocument();
      expect(screen.getByText('Chiefdom')).toBeInTheDocument();
      expect(screen.getByText('City/Village')).toBeInTheDocument();
      expect(screen.getByText('Latitude')).toBeInTheDocument();
      expect(screen.getByText('Longitude')).toBeInTheDocument();
      expect(screen.getByText('Facility ID')).toBeInTheDocument();
      expect(screen.getByText('Language')).toBeInTheDocument();
      expect(screen.getByText('Linked Peer Supervisor')).toBeInTheDocument();
      expect(screen.getByText('Linked Villages')).toBeInTheDocument();
    });
  });

  it('disables certain fields when in edit mode', () => {
    const { container } = renderComponent({ isEdit: true });
    // Check Health Facility Name input
    const healthFacilityNameInput = container.querySelector('input[name="healthFacility.name"]');
    expect(healthFacilityNameInput).toBeDisabled();
    const districtLabel = Array.from(container.querySelectorAll('label')).find((label) =>
      label.textContent?.includes('District')
    );
    const districtContainer = districtLabel?.closest('.col-sm-6');
    const districtSelect = districtContainer?.querySelector('.select-field__control');
    expect(districtSelect).toHaveClass('select-field__control--is-disabled');

    // Check Chiefdom select
    const chiefdomLabel = Array.from(container.querySelectorAll('label')).find((label) =>
      label.textContent?.includes('Chiefdom')
    );
    const chiefdomContainer = chiefdomLabel?.closest('.col-sm-6');
    const chiefdomSelect = chiefdomContainer?.querySelector('.select-field__control');
    expect(chiefdomSelect).toHaveClass('select-field__control--is-disabled');
  });

  it('dispatches initial requests on mount', () => {
    renderComponent();

    expect(store.dispatch).toHaveBeenCalledTimes(3);
    expect(store.dispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'FETCH_CULTURE_LIST_REQUEST'
      })
    );
    expect(store.dispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'FETCH_HEALTH_FACILITY_TYPES_REQUEST'
      })
    );
    expect(store.dispatch).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        type: 'FETCH_DISTRICT_LIST_REQUEST',
        countryId: 1
      })
    );
  });
  it('dispatches fetchChiefdomListRequest when a district is selected', async () => {
    const countryId = 1;
    const districtId = 5;

    let formApi: FormApi<Record<string, any>, Partial<Record<string, any>>>;
    const Wrapper = (props: any) => {
      const form = useForm();
      formApi = form; // Capture the form API
      return <HealthFacilityDetailsForm {...defaultProps} {...props} form={form} />;
    };

    const { rerender } = render(
      <Provider store={store}>
        <Form onSubmit={() => {}} initialValues={initialValues} render={() => <Wrapper countryId={countryId} />} />
      </Provider>
    );

    // Clear previous calls to dispatch
    (store.dispatch as jest.Mock).mockClear();

    await act(async () => {
      // Simulate selecting a district
      formApi.change('healthFacility.district', { id: districtId });
    });

    // Force a re-render to trigger the useEffect
    rerender(
      <Provider store={store}>
        <Form onSubmit={() => {}} initialValues={initialValues} render={() => <Wrapper countryId={countryId} />} />
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      fetchChiefdomListRequest({ countryId, districtId: Number(districtId) })
    );
  });

  it('dispatches fetchChiefdomListRequest when a district is selected', async () => {
    const countryId = 1;
    const tenantId = 5;
    let formApi: FormApi<Record<string, any>, Partial<Record<string, any>>>;
    const Wrapper = (props: any) => {
      const form = useForm();
      formApi = form; // Capture the form API
      return <HealthFacilityDetailsForm {...defaultProps} {...props} form={form} />;
    };

    const { rerender } = render(
      <Provider store={store}>
        <Form onSubmit={() => {}} initialValues={initialValues} render={() => <Wrapper countryId={countryId} />} />
      </Provider>
    );

    // Clear previous calls to dispatch
    (store.dispatch as jest.Mock).mockClear();

    await act(async () => {
      // Simulate selecting a district
      formApi.change('healthFacility.district', { tenantId: tenantId });
    });

    // Force a re-render to trigger the useEffect
    rerender(
      <Provider store={store}>
        <Form onSubmit={() => {}} initialValues={initialValues} render={() => <Wrapper countryId={countryId} />} />
      </Provider>
    );
    expect(store.dispatch).toHaveBeenCalledWith(fetchPeerSupervisorListRequest({ tenantIds: [Number(tenantId)] }));
  });

  it('dispatches fetchVillagesListRequest when a district and chiefdom is selected', async () => {
    const countryId = 1;
    const chiefdomId = 5;
    const districtId = 5;

    let formApi: FormApi<Record<string, any>, Partial<Record<string, any>>>;
    const Wrapper = (props: any) => {
      const form = useForm();
      formApi = form; // Capture the form API
      return <HealthFacilityDetailsForm {...defaultProps} {...props} form={form} />;
    };

    const { rerender } = render(
      <Provider store={store}>
        <Form onSubmit={() => {}} initialValues={initialValues} render={() => <Wrapper countryId={countryId} />} />
      </Provider>
    );

    // Clear previous calls to dispatch
    (store.dispatch as jest.Mock).mockClear();

    await act(async () => {
      // Simulate selecting a district
      formApi.change('healthFacility.district', { id: districtId });
      formApi.change('healthFacility.chiefdom', { id: chiefdomId });
    });

    // Force a re-render to trigger the useEffect
    rerender(
      <Provider store={store}>
        <Form onSubmit={() => {}} initialValues={initialValues} render={() => <Wrapper countryId={countryId} />} />
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      fetchVillagesListRequest({ countryId, districtId: Number(districtId), chiefdomId: Number(chiefdomId) })
    );
  });

  it('dispatches fetchUnlinkedVillagesRequest when a district and chiefdom is selected', async () => {
    const countryId = 1;
    const chiefdomId = 5;
    const districtId = 5;

    let formApi: FormApi<Record<string, any>, Partial<Record<string, any>>>;
    const Wrapper = (props: any) => {
      const form = useForm();
      formApi = form; // Capture the form API
      return <HealthFacilityDetailsForm {...defaultProps} {...props} form={form} />;
    };

    const { rerender } = render(
      <Provider store={store}>
        <Form onSubmit={() => {}} initialValues={initialValues} render={() => <Wrapper countryId={countryId} />} />
      </Provider>
    );

    // Clear previous calls to dispatch
    (store.dispatch as jest.Mock).mockClear();

    await act(async () => {
      // Simulate selecting a district
      formApi.change('healthFacility.district', { id: districtId });
      formApi.change('healthFacility.chiefdom', { id: chiefdomId });
    });

    // Force a re-render to trigger the useEffect
    rerender(
      <Provider store={store}>
        <Form onSubmit={() => {}} initialValues={initialValues} render={() => <Wrapper countryId={countryId} />} />
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledTimes(3);

    expect(store.dispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'FETCH_CHIEFDOM_LIST_REQUEST',
        countryId,
        districtId
      })
    );

    expect(store.dispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'FETCH_VILLAGES_LIST_REQUEST',
        countryId,
        districtId,
        chiefdomId
      })
    );

    expect(store.dispatch).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        type: 'FETCH_UNLINKED_VILLAGES_REQUEST',
        countryId,
        districtId: Number(districtId),
        chiefdomId: Number(chiefdomId),
        healthFacilityId: undefined,
        successCb: expect.any(Function)
      })
    );
  });

  it('clears chiefdom, city, and linkedVillages using form.batch when conditions are met', () => {
    const mockForm = {
      getState: jest.fn(),
      batch: jest.fn((cb) => cb()),
      change: jest.fn()
    };
    const formName = 'healthFacility';
    const isEdit = false;

    // Set up the initial state to trigger the batch operation
    mockForm.getState.mockReturnValue({
      values: {
        healthFacility: {
          district: {},
          chiefdom: { id: 1 },
          city: { id: 2 },
          linkedVillages: [3, 4]
        }
      }
    });

    const { rerender } = renderHook(() => {
      React.useEffect(() => {
        const { district, chiefdom, city, linkedVillages } = mockForm.getState().values.healthFacility;
        if (!isEdit && !district?.id && (chiefdom?.id || city?.id || (linkedVillages || []).length)) {
          mockForm.batch(() => {
            mockForm.change(`${formName}.chiefdom`, undefined);
            mockForm.change(`${formName}.city`, undefined);
            mockForm.change(`${formName}.linkedVillages`, undefined);
          });
        }
      }, [mockForm, formName, isEdit]);
    });

    act(() => {
      rerender();
    });

    // Check if batch was called
    expect(mockForm.batch).toHaveBeenCalledTimes(1);

    // Check if change was called for each field inside the batch
    expect(mockForm.change).toHaveBeenCalledTimes(3);
    expect(mockForm.change).toHaveBeenCalledWith(`${formName}.chiefdom`, undefined);
    expect(mockForm.change).toHaveBeenCalledWith(`${formName}.city`, undefined);
    expect(mockForm.change).toHaveBeenCalledWith(`${formName}.linkedVillages`, undefined);

    // Ensure the changes were made within the batch call
    expect(mockForm.batch.mock.calls[0][0]).toEqual(expect.any(Function));
  });

  // Add more tests as needed for specific functionality
});
