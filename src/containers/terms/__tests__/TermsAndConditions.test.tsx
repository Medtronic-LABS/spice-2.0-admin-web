import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TermsAndConditions from '../TermsAndConditions';
import localStorageService from '../../../global/localStorageServices';
import APPCONSTANTS from '../../../constants/appConstants';
import * as userActions from '../../../store/user/actions';

// Mock dependencies
jest.mock('../../../global/localStorageServices');
jest.mock('../../../components/editor/WysiwygEditor', () => ({
  __esModule: true,
  default: () => <div data-testid='text-editor'>Mock Editor</div>
}));

// Mock react-leaflet and leaflet CSS to avoid ESM issues
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid='map-container'>{children}</div>,
  TileLayer: () => <div data-testid='tile-layer' />,
  Marker: ({ children }: any) => <div data-testid='marker'>{children}</div>,
  Popup: ({ children }: any) => <div data-testid='popup'>{children}</div>,
  useMap: () => ({ setView: jest.fn(), getCenter: () => ({ lat: 0, lng: 0 }) }),
  useMapEvent: jest.fn(),
  useMapEvents: jest.fn()
}));
jest.mock('leaflet/dist/leaflet.css', () => ({}));

const mockStore = configureStore();

const defaultState = {
  user: {
    user: {
      role: 'USER',
      countryId: { id: 1 },
      country: { id: 1, appTypes: [] },
      userId: '123',
      appTypes: [],
      termsAndConditions: {
        formInput: '<p>Test Terms</p>',
        countryId: 1
      },
      isTACLoading: false,
      suiteAccess: [APPCONSTANTS.SUITE_ACCESS.ADMIN]
    },
    termsAndConditions: {
      formInput: '<p>Test Terms</p>',
      countryId: 1
    }
  },
  district: { loading: false },
  region: { loading: false },
  chiefdom: { loading: false },
  healthFacility: { loading: false },
  common: {
    labelName: null
  }
};
describe('TermsAndConditions', () => {
  const store = mockStore(defaultState);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render terms and conditions modal when conditions are met', () => {
    (localStorageService.getItem as jest.Mock)
      .mockReturnValueOnce(false) // IS_TERMS_CONDITIONS_DISMISSED
      .mockReturnValueOnce(false); // TAC_STATUS

    render(
      <Provider store={store}>
        <TermsAndConditions />
      </Provider>
    );

    expect(screen.getByText('Terms and Conditions')).toBeInTheDocument();
    expect(screen.getByTestId('text-editor')).toBeInTheDocument();
  });

  it('should not render modal when terms are dismissed', () => {
    (localStorageService.getItem as jest.Mock)
      .mockReturnValueOnce(true) // IS_TERMS_CONDITIONS_DISMISSED
      .mockReturnValueOnce(false); // TAC_STATUS

    render(
      <Provider store={store}>
        <TermsAndConditions />
      </Provider>
    );

    expect(screen.queryByText('Terms and Conditions')).not.toBeInTheDocument();
  });

  it('should handle accept terms and conditions', async () => {
    (localStorageService.getItem as jest.Mock)
      .mockReturnValueOnce(false) // IS_TERMS_CONDITIONS_DISMISSED
      .mockReturnValueOnce(false); // TAC_STATUS

    const updateTermsSpy = jest.spyOn(userActions, 'updateTermsAndConditionsRequest');

    render(
      <Provider store={store}>
        <TermsAndConditions />
      </Provider>
    );

    fireEvent.click(screen.getByText('Accept'));

    expect(updateTermsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 123,
        isTermsAndConditionAccepted: true
      })
    );
  });

  it('should handle decline terms and conditions', () => {
    (localStorageService.getItem as jest.Mock)
      .mockReturnValueOnce(false) // IS_TERMS_CONDITIONS_DISMISSED
      .mockReturnValueOnce(false); // TAC_STATUS

    const logoutSpy = jest.spyOn(userActions, 'logoutRequest');

    render(
      <Provider store={store}>
        <TermsAndConditions />
      </Provider>
    );

    fireEvent.click(screen.getByText('Decline'));

    expect(logoutSpy).toHaveBeenCalled();
  });

  it('should show loader when terms are loading', () => {
    const loadingState = {
      ...defaultState,
      user: {
        ...defaultState.user,
        isTermsConditionsLoading: true
      },
      district: { loading: false },
      region: { loading: false },
      chiefdom: { loading: false },
      healthFacility: { loading: false }
    };
    const localStore = mockStore(loadingState);

    (localStorageService.getItem as jest.Mock)
      .mockReturnValueOnce(false) // IS_TERMS_CONDITIONS_DISMISSED
      .mockReturnValueOnce(false); // TAC_STATUS

    render(
      <Provider store={localStore}>
        <TermsAndConditions />
      </Provider>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
