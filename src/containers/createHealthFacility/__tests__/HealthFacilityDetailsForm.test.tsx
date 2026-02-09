import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import HealthFacilityDetailsForm from '../HealthFacilityDetailsForm';

const mockStore = configureStore([]);

jest.mock('react-router', () => ({
  useParams: () => ({ regionId: undefined, districtId: undefined, chiefdomId: undefined, tenantId: '1' })
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
  ReactComponent: () => <span data-testid="site-details-icon" />
}));

jest.mock('../../../components/formContainer/FormContainer', () => ({
  __esModule: true,
  default: ({ label, children }: any) => (
    <div data-testid="form-container">
      <span>{label}</span>
      {children}
    </div>
  )
}));

jest.mock('../../../components/formFields/TextInput', () => ({
  __esModule: true,
  default: ({ label, input }: any) => (
    <div data-testid="text-input">
      <label>{label}</label>
      <input {...input} />
    </div>
  )
}));

jest.mock('../../../components/formFields/SelectInput', () => ({
  __esModule: true,
  default: ({ label }: any) => (
    <div data-testid="select-input">
      <span>{label}</span>
    </div>
  )
}));

jest.mock('../../../components/multiSelect/MultiSelect', () => ({
  __esModule: true,
  default: ({ label }: any) => (
    <div data-testid="multi-select">
      <span>{label}</span>
    </div>
  )
}));

jest.mock('../../../components/map/MapContainer', () => ({
  __esModule: true,
  default: () => <div data-testid="map-container" />
}));

jest.mock('../../healthFacility/Workflows', () => ({
  __esModule: true,
  default: () => <div data-testid="workflows">Workflows</div>
}));

jest.mock('../HealthFacilityDetails.scss', () => ({}));

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
    loading: false,
    chiefdomDetail: null
  },
  district: {
    districtList: [],
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
    }> = {},
    initialValues: Record<string, unknown> = defaultInitialValues
  ) => {
    return render(
      <Provider store={store}>
        <Form onSubmit={() => {}} initialValues={initialValues}>
          {({ form }) => (
            <HealthFacilityDetailsForm
              form={form}
              formName="healthFacility"
              isEdit={false}
              isNextClicked={false}
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
    expect(screen.getByText('Facility ID (Postal Code)')).toBeInTheDocument();
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

  it('does not render map container when latitude and longitude are empty', () => {
    renderWithForm();
    expect(screen.queryByTestId('map-container')).not.toBeInTheDocument();
  });

  it('renders City field when isCityVillage is false from app type config', () => {
    renderWithForm();
    expect(screen.getByText('City')).toBeInTheDocument();
  });
});
