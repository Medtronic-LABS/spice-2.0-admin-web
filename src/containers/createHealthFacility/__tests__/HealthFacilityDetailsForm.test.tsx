import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import HealthFacilityDetailsForm from '../HealthFacilityDetailsForm';
import * as healthFacilityAPI from '../../../services/healthFacilityAPI';

const mockStore = configureStore([]);

jest.mock('react-router', () => ({
  useParams: () => ({ regionId: undefined, districtId: undefined, chiefdomId: undefined, tenantId: '1' })
}));

jest.mock('../../../services/healthFacilityAPI', () => ({
  ...jest.requireActual('../../../services/healthFacilityAPI'),
  checkFacilityNameUnique: jest.fn(() => Promise.resolve({ data: { unique: true } })),
  checkPostalCodeUnique: jest.fn(() => Promise.resolve({ data: { unique: true } }))
}));

jest.mock('../../../hooks/appTypeBasedConfigs', () => ({
  __esModule: true,
  default: () => ({
    appTypes: [],
    district: { s: 'County', p: 'Counties' },
    chiefdom: { s: 'Sub County', p: 'Sub Counties' },
    village: { s: 'Village', p: 'Villages' },
    hfDetails: {
      map: { available: true },
      language: { disabled: false },
      linkedVillages: { required: false },
      city: { isCityVillage: false, isRequired: false }
    },
    healthFacility: { s: 'Health Facility', p: 'Health Facilities' },
    isCommunity: false
  })
}));

jest.mock('../../../global/sessionStorageServices', () => ({
  getItem: jest.fn(() => '1')
}));

jest.mock('../../../utils/toastCenter', () => ({
  __esModule: true,
  default: { error: jest.fn() },
  getErrorToastArgs: jest.fn(() => [])
}));

jest.mock('../../../assets/images/info-grey.svg', () => ({
  ReactComponent: () => <span data-testid='site-details-icon' />
}));

jest.mock('../../../components/formContainer/FormContainer', () => ({
  __esModule: true,
  default: ({ label, children }: any) => (
    <div data-testid='form-container'>
      <span>{label}</span>
      {children}
    </div>
  )
}));

jest.mock('../../../components/formFields/TextInput', () => ({
  __esModule: true,
  default: ({ label, input = {}, onBlur, onChange }: any) => {
    const id = input?.name?.replace(/\./g, '-') || `input-${label.replace(/\s/g, '-')}`;
    return (
      <div data-testid='text-input' data-label={label}>
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          {...input}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            input?.onBlur?.(e);
            onBlur?.(e);
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            input?.onChange?.(e.target.value);
            onChange?.(e);
          }}
        />
      </div>
    );
  }
}));

jest.mock('../../../components/formFields/SelectInput', () => ({
  __esModule: true,
  default: ({ label }: any) => (
    <div data-testid='select-input'>
      <span>{label}</span>
    </div>
  )
}));

jest.mock('../../../components/multiSelect/MultiSelect', () => ({
  __esModule: true,
  default: ({ label }: any) => (
    <div data-testid='multi-select'>
      <span>{label}</span>
    </div>
  )
}));

jest.mock('../../../components/map/MapContainer', () => ({
  __esModule: true,
  default: () => <div data-testid='map-container' />
}));

jest.mock('../../healthFacility/Workflows', () => ({
  __esModule: true,
  default: () => <div data-testid='workflows'>Workflows</div>
}));

jest.mock('../HealthFacilityDetails.scss', () => ({}));

jest.mock('../../../components/formFields/TextInput.module.scss', () => ({
  validateErrorText: 'validateErrorText'
}));

const defaultStoreState = {
  healthFacility: {
    hfTypes: [],
    hfTypesLoading: false,
    unlinkedVillagesList: [],
    unlinkedVillagesLoading: false,
    districtList: [],
    districtLoading: false,
    chiefdomList: [],
    chiefdomLoading: false,
    villagesList: [],
    villagesLoading: false,
    cultureList: [],
    cultureListLoading: false
  },
  chiefdom: {
    chiefdomList: [],
    taggedChiefdomList: [],
    taggedChiefdomTotal: 0,
    loadingTaggedChiefdoms: false,
    loading: false,
    chiefdomDetail: null
  },
  district: {
    districtList: [],
    taggedDistrictList: [],
    taggedDistrictTotal: 0,
    loadingTaggedDistricts: false,
    loading: false,
    district: {}
  },
  user: {
    user: {
      country: { id: 1 }
    }
  },
  region: {
    detail: {}
  }
};

const defaultInitialValues = {
  healthFacility: {
    name: '',
    type: null,
    address: '',
    district: null,
    chiefdom: null,
    city: null,
    postalCode: '',
    language: null,
    linkedVillages: [],
    latitude: '',
    longitude: '',
    clinicalWorkflows: [],
    customizedWorkflows: []
  }
};

describe('HealthFacilityDetailsForm', () => {
  const store = mockStore(defaultStoreState);

  const renderWithForm = (
    props: Partial<{
      formName: string;
      isEdit: boolean;
      isNextClicked: boolean;
      isActivating: boolean;
      isHFCreate: boolean;
      data: Record<string, unknown>;
    }> = {},
    initialValues: Record<string, unknown> = defaultInitialValues,
    localStore: ReturnType<typeof mockStore> = store
  ) => {
    return render(
      <Provider store={localStore}>
        <Form onSubmit={jest.fn()} initialValues={initialValues}>
          {({ form }) => (
            <HealthFacilityDetailsForm
              form={form}
              formName='healthFacility'
              isEdit={false}
              isNextClicked={false}
              data={{}}
              {...props}
            />
          )}
        </Form>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields when isNextClicked is false', () => {
    renderWithForm();
    expect(screen.getByText('Health Facility Name')).toBeInTheDocument();
    expect(screen.getByText('Health Facility Type')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('County')).toBeInTheDocument();
    expect(screen.getByText('Sub County')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('Facility ID')).toBeInTheDocument();
    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Linked Villages')).toBeInTheDocument();
    expect(screen.getByText('Latitude')).toBeInTheDocument();
    expect(screen.getByText('Longitude')).toBeInTheDocument();
  });

  it('renders Workflows section when isNextClicked is true', () => {
    renderWithForm({ isNextClicked: true });
    expect(screen.getByText('Workflows Involved')).toBeInTheDocument();
    expect(screen.getByTestId('workflows')).toBeInTheDocument();
  });

  it('does not render detail fields when isNextClicked is true', () => {
    renderWithForm({ isNextClicked: true });
    expect(screen.queryByText('Health Facility Name')).not.toBeInTheDocument();
  });

  it('uses edit column style when isEdit is true', () => {
    const { container } = renderWithForm({ isEdit: true });
    const editCols = container.querySelectorAll('.col-sm-6.col-md-4.col-12');
    expect(editCols.length).toBeGreaterThanOrEqual(1);
  });

  it('uses create column style when isEdit is false', () => {
    const { container } = renderWithForm({ isEdit: false });
    const createCols = container.querySelectorAll('.col-md-6.col-lg-3.col-12');
    expect(createCols.length).toBeGreaterThanOrEqual(1);
  });

  it('dispatches clearHFFormData on unmount', () => {
    const { unmount } = renderWithForm();
    unmount();
    const actions = store.getActions();
    expect(actions.some((a: { type: string }) => a.type === 'CLEAR_HF_FORM_DATA')).toBe(true);
  });

  it('dispatches fetchTaggedDistrictsRequest on mount when not in edit mode', () => {
    const localStore = mockStore(defaultStoreState);
    renderWithForm({ isEdit: false }, defaultInitialValues, localStore);
    const actions = localStore.getActions();
    expect(actions.some((a: { type: string }) => a.type === 'FETCH_TAGGED_DISTRICTS_REQUEST')).toBe(true);
    expect(actions.some((a: { type: string }) => a.type === 'FETCH_DISTRICT_LIST_REQUEST')).toBe(false);
  });

  it('does not dispatch fetchTaggedDistrictsRequest on mount in edit mode', () => {
    const localStore = mockStore(defaultStoreState);
    renderWithForm({ isEdit: true }, defaultInitialValues, localStore);
    const actions = localStore.getActions();
    expect(actions.some((a: { type: string }) => a.type === 'FETCH_TAGGED_DISTRICTS_REQUEST')).toBe(false);
  });

  it('dispatches fetchTaggedChiefdomsRequest when a district is selected', () => {
    const localStore = mockStore(defaultStoreState);
    renderWithForm(
      { isEdit: false },
      {
        healthFacility: {
          ...defaultInitialValues.healthFacility,
          district: { id: 10, name: 'District 10', tenantId: '100' }
        }
      },
      localStore
    );
    const actions = localStore.getActions();
    expect(actions.some((a: any) => a.type === 'CLEAR_TAGGED_CHIEFDOM_LIST')).toBe(true);
    const fetchTaggedChiefdomsAction = actions.find((a: any) => a.type === 'FETCH_TAGGED_CHIEFDOMS_REQUEST');
    expect(fetchTaggedChiefdomsAction).toBeDefined();
    expect(fetchTaggedChiefdomsAction.districtIds).toEqual([10]);
    expect(actions.some((a: { type: string }) => a.type === 'FETCH_CHIEFDOM_LIST_REQUEST')).toBe(false);
  });

  it('does not fetch tagged chiefdoms when no district is selected', () => {
    const localStore = mockStore(defaultStoreState);
    renderWithForm({ isEdit: false }, defaultInitialValues, localStore);
    const actions = localStore.getActions();
    expect(actions.some((a: { type: string }) => a.type === 'FETCH_TAGGED_CHIEFDOMS_REQUEST')).toBe(false);
  });

  it('does not render map container when latitude and longitude are empty', () => {
    renderWithForm();
    expect(screen.queryByTestId('map-container')).not.toBeInTheDocument();
  });

  it('renders map container when latitude and longitude are provided in initial values', () => {
    renderWithForm(
      {},
      {
        healthFacility: {
          ...defaultInitialValues.healthFacility,
          latitude: '12.34',
          longitude: '56.78'
        }
      }
    );
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  it('renders City field when isCityVillage is false from app type config', () => {
    renderWithForm();
    expect(screen.getByText('City')).toBeInTheDocument();
  });

  it('renders with data prop for edit mode', () => {
    renderWithForm({
      isEdit: true,
      data: { type: { id: 1, name: 'Type A' }, name: 'Test HF' }
    });
    expect(screen.getByText('Health Facility Name')).toBeInTheDocument();
    expect(screen.getByText('Health Facility Type')).toBeInTheDocument();
  });

  it('renders with isActivating true without crashing', () => {
    renderWithForm({ isActivating: true });
    expect(screen.getByText('Health Facility Name')).toBeInTheDocument();
  });

  it('renders with isHFCreate true without crashing', () => {
    renderWithForm({ isHFCreate: true });
    expect(screen.getByText('Health Facility Name')).toBeInTheDocument();
  });

  it('calls checkFacilityNameUnique on blur when health facility name has at least 2 characters', async () => {
    const checkFacilityNameUniqueMock = healthFacilityAPI.checkFacilityNameUnique as jest.Mock;
    checkFacilityNameUniqueMock.mockResolvedValue({ data: { unique: true } });
    renderWithForm();
    const nameInput = screen.getByLabelText('Health Facility Name');
    fireEvent.change(nameInput, { target: { value: 'Test Facility' } });
    fireEvent.blur(nameInput);
    await screen.findByText('Health Facility Name');
    expect(checkFacilityNameUniqueMock).toHaveBeenCalledWith('Test Facility');
  });

  it('does not call checkFacilityNameUnique when isEdit is true', () => {
    const checkFacilityNameUniqueMock = healthFacilityAPI.checkFacilityNameUnique as jest.Mock;
    checkFacilityNameUniqueMock.mockClear();
    renderWithForm({ isEdit: true });
    const nameInput = screen.queryByLabelText('Health Facility Name');
    if (nameInput) {
      fireEvent.change(nameInput, { target: { value: 'Test Facility' } });
      fireEvent.blur(nameInput);
    }
    expect(checkFacilityNameUniqueMock).not.toHaveBeenCalled();
  });

  it('calls checkPostalCodeUnique on blur when postal code has at least 3 characters', async () => {
    const checkPostalCodeUniqueMock = healthFacilityAPI.checkPostalCodeUnique as jest.Mock;
    checkPostalCodeUniqueMock.mockResolvedValue({ data: { unique: true } });
    renderWithForm();
    const postalInput = screen.getByLabelText('Facility ID');
    fireEvent.change(postalInput, { target: { value: '123' } });
    fireEvent.blur(postalInput);
    await screen.findByText('Facility ID');
    expect(checkPostalCodeUniqueMock).toHaveBeenCalled();
    expect(checkPostalCodeUniqueMock.mock.calls[0][0].replace(/\D/g, '').length).toBeGreaterThanOrEqual(3);
  });

  it('does not call checkPostalCodeUnique in edit mode when value matches initial postal code', () => {
    const checkPostalCodeUniqueMock = healthFacilityAPI.checkPostalCodeUnique as jest.Mock;
    checkPostalCodeUniqueMock.mockClear();
    renderWithForm(
      { isEdit: true, data: { postalCode: '12345' } },
      {
        healthFacility: {
          ...defaultInitialValues.healthFacility,
          postalCode: '12345'
        }
      }
    );
    const postalInput = screen.getByLabelText('Facility ID');
    fireEvent.change(postalInput, { target: { value: '12345' } });
    fireEvent.blur(postalInput);
    expect(checkPostalCodeUniqueMock).not.toHaveBeenCalled();
  });

  it('calls checkPostalCodeUnique in edit mode when value differs from initial postal code', async () => {
    const checkPostalCodeUniqueMock = healthFacilityAPI.checkPostalCodeUnique as jest.Mock;
    checkPostalCodeUniqueMock.mockResolvedValue({ data: { unique: true } });
    renderWithForm(
      { isEdit: true, data: { postalCode: '12345' } },
      {
        healthFacility: {
          ...defaultInitialValues.healthFacility,
          postalCode: '12345'
        }
      }
    );
    const postalInput = screen.getByLabelText('Facility ID');
    fireEvent.change(postalInput, { target: { value: '67890' } });
    fireEvent.blur(postalInput);
    await screen.findByText('Facility ID');
    expect(checkPostalCodeUniqueMock).toHaveBeenCalled();
  });
});
