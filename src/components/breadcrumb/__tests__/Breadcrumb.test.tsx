import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Breadcrumb from '../Breadcrumb';
import { PROTECTED_ROUTES } from '../../../constants/route';
import APPCONSTANTS from '../../../constants/appConstants';
import { CLEAR_REGION_DETAIL } from '../../../store/region/actionTypes';
import { CLEAR_CHIEFDOM_DETAIL } from '../../../store/chiefdom/actionTypes';
import { CLEAR_DISTRICT_DETAILS } from '../../../store/district/actionTypes';
import { CLEAR_HF_SUMMARY } from '../../../store/healthFacility/actionTypes';
import { SET_REGION_DETAILS } from '../../../store/region/actionTypes';
import { SET_DISTRICT_DETAILS } from '../../../store/district/actionTypes';
import { SET_CHIEFDOM_DETAILS } from '../../../store/chiefdom/actionTypes';
import { SET_HF_SUMMARY } from '../../../store/healthFacility/actionTypes';

jest.mock('../../../assets/images/home.svg', () => ({
  ReactComponent: 'HomeIcon'
}));

const mockStore = configureStore([]);
const initialState = {
  region: {
    detail: {
      id: '1',
      name: 'Test Region',
      tenantId: '123'
    }
  },
  district: {
    district: {
      id: '2',
      name: 'Test District',
      tenantId: '123'
    }
  },
  chiefdom: {
    chiefdomDetail: {
      id: '3',
      name: 'Test Chiefdom',
      tenantId: '123'
    }
  },
  healthFacility: {
    healthFacility: {
      id: '4',
      name: 'Test Health Facility',
      tenantId: '123'
    }
  },
  user: {
    user: {
      role: APPCONSTANTS.ROLES.SUPER_ADMIN,
      suiteAccess: [APPCONSTANTS.SUITE_ACCESS]
    }
  },
  common: {
    labelName: {
      region: {
        s: 'Region',
        p: 'Regions'
      },
      healthFacility: {
        s: 'Health Facility',
        p: 'Health Facilities'
      },
      district: {
        s: 'County',
        p: 'Counties'
      },
      chiefdom: { s: 'Sub County', p: 'Sub Counties' }
    }
  }
};

describe('Breadcrumb Component', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore(initialState);
    sessionStorage.clear();
  });

  const renderComponent = (initialPath = '/') => {
    window.history.pushState({}, '', initialPath);
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Breadcrumb />
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders home icon', () => {
    const { getByTestId, unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Breadcrumb />
        </BrowserRouter>
      </Provider>
    );
    expect(getByTestId('Home')).toBeInTheDocument();
    unmount();
  });

  it('displays region name in breadcrumb when on region route', () => {
    const { unmount } = renderComponent(
      PROTECTED_ROUTES.regionSummary.replace(':regionId', '1').replace(':tenantId', '123')
    );
    expect(screen.getByText('Test Region')).toBeInTheDocument();
    unmount();
  });

  it('displays district name in breadcrumb when on district route', () => {
    const { unmount } = renderComponent(
      PROTECTED_ROUTES.districtSummary.replace(':districtId', '2').replace(':tenantId', '123')
    );
    expect(screen.getByText('Test District')).toBeInTheDocument();
    unmount();
  });

  it('clears data when clicking home icon with single suite access', () => {
    const localStore = mockStore(initialState);
    const { getByLabelText, unmount } = render(
      <Provider store={localStore}>
        <BrowserRouter>
          <Breadcrumb />
        </BrowserRouter>
      </Provider>
    );
    expect(getByLabelText('Home')).toBeInTheDocument();
    waitFor(() => {
      fireEvent.click(getByLabelText('Home'));
    });
    unmount();
    const actions = localStore.getActions();
    const mockClearRegionType = actions.find((action) => action.type === CLEAR_REGION_DETAIL);
    expect(mockClearRegionType).toBeTruthy();

    const mockClearDistrictType = actions.find((action) => action.type === CLEAR_DISTRICT_DETAILS);
    expect(mockClearDistrictType).toBeTruthy();

    const mockClearChiefdomType = actions.find((action) => action.type === CLEAR_CHIEFDOM_DETAIL);
    expect(mockClearChiefdomType).toBeTruthy();

    const mockClearHfSummaryType = actions.find((action) => action.type === CLEAR_HF_SUMMARY);
    expect(mockClearHfSummaryType).toBeTruthy();
  });

  it('clears data when clicking home icon with multiple suite access', () => {
    const localStore = mockStore({
      ...initialState,
      user: {
        user: {
          suiteAccess: [APPCONSTANTS.SUITE_ACCESS.ADMIN, APPCONSTANTS.SUITE_ACCESS.CFR]
        }
      }
    });
    const { getByLabelText, unmount } = render(
      <Provider store={localStore}>
        <BrowserRouter>
          <Breadcrumb />
        </BrowserRouter>
      </Provider>
    );
    expect(getByLabelText('Home')).toBeInTheDocument();
    waitFor(() => {
      fireEvent.click(getByLabelText('Home'));
    });
    unmount();
    const actions = localStore.getActions();
    const mockClearRegionType = actions.find((action) => action.type === CLEAR_REGION_DETAIL);
    expect(mockClearRegionType).toBeTruthy();

    const mockClearDistrictType = actions.find((action) => action.type === CLEAR_DISTRICT_DETAILS);
    expect(mockClearDistrictType).toBeTruthy();

    const mockClearChiefdomType = actions.find((action) => action.type === CLEAR_CHIEFDOM_DETAIL);
    expect(mockClearChiefdomType).toBeTruthy();

    const mockClearHfSummaryType = actions.find((action) => action.type === CLEAR_HF_SUMMARY);
    expect(mockClearHfSummaryType).toBeTruthy();
  });

  it('displays custom breadcrumb for special routes', () => {
    const { unmount } = renderComponent(PROTECTED_ROUTES.createMedication);
    expect(screen.getByText('Add Medication')).toBeInTheDocument();
    unmount();
  });

  it('shows correct separator between breadcrumb items', () => {
    const { unmount } = renderComponent(
      PROTECTED_ROUTES.districtSummary.replace(':districtId', '2').replace(':tenantId', '123')
    );
    const separators = screen.getAllByText('/');
    expect(separators.length).toBeGreaterThan(0);
    unmount();
  });

  it('persists breadcrumb data in session storage before unload', () => {
    const mockSetItem = jest.spyOn(Storage.prototype, 'setItem');
    const { unmount } = renderComponent();

    window.dispatchEvent(new Event('beforeunload'));

    expect(mockSetItem).toHaveBeenCalledWith('breadCrumbs', expect.any(String));
    mockSetItem.mockRestore();
    unmount();
  });

  it('dispatches region details when region route is restored', () => {
    const localStore = mockStore(initialState);
    const mockBreadcrumbs = [
      {
        label: 'Test Region',
        route: `/region/${initialState.region.detail.id}/${initialState.region.detail.tenantId}`
      }
    ];

    sessionStorage.setItem('breadCrumbs', JSON.stringify(mockBreadcrumbs));

    const { unmount } = render(
      <Provider store={localStore}>
        <BrowserRouter>
          <Breadcrumb />
        </BrowserRouter>
      </Provider>
    );

    const actions = localStore.getActions();
    const setRegionAction = actions.find((action) => action.type === SET_REGION_DETAILS);

    waitFor(() => {
      expect(setRegionAction).toBeTruthy();
      expect(setRegionAction.payload).toEqual({
        id: initialState.region.detail.id,
        tenantId: initialState.region.detail.tenantId,
        name: 'Test Region'
      });
    });
    unmount();
  });

  it('dispatches region details when region route is restored for region admin', () => {
    const localStore = mockStore({
      ...initialState,
      user: {
        user: {
          ...initialState.user.user,
          role: APPCONSTANTS.ROLES.REGION_ADMIN
        }
      }
    });
    const mockBreadcrumbs = [
      {
        label: 'Test Region',
        route: `/region/${initialState.region.detail.id}/${initialState.region.detail.tenantId}`
      }
    ];

    sessionStorage.setItem('breadCrumbs', JSON.stringify(mockBreadcrumbs));

    const { unmount } = render(
      <Provider store={localStore}>
        <BrowserRouter>
          <Breadcrumb />
        </BrowserRouter>
      </Provider>
    );

    const actions = localStore.getActions();
    const setRegionAction = actions.find((action) => action.type === SET_REGION_DETAILS);

    waitFor(() => {
      expect(setRegionAction).toBeTruthy();
      expect(setRegionAction.payload).toEqual({
        id: initialState.region.detail.id,
        tenantId: initialState.region.detail.tenantId,
        name: 'Test Region'
      });
    });
    unmount();
  });

  it('dispatches district details when district route is restored', () => {
    const localStore = mockStore(initialState);
    const mockBreadcrumbs = [
      {
        label: 'Test District',
        route: `/district/${initialState.district.district.id}/${initialState.district.district.tenantId}`
      }
    ];

    sessionStorage.setItem('breadCrumbs', JSON.stringify(mockBreadcrumbs));

    const { unmount } = render(
      <Provider store={localStore}>
        <BrowserRouter>
          <Breadcrumb />
        </BrowserRouter>
      </Provider>
    );

    const actions = localStore.getActions();
    const setDistrictAction = actions.find((action) => action.type === SET_DISTRICT_DETAILS);

    waitFor(() => {
      expect(setDistrictAction).toBeTruthy();
      expect(setDistrictAction.payload).toEqual({
        id: initialState.district.district.id,
        tenantId: initialState.district.district.tenantId,
        name: 'Test District'
      });
    });
    unmount();
  });

  it('dispatches district details when district route is restored for district admin', () => {
    const localStore = mockStore({
      ...initialState,
      user: {
        user: {
          ...initialState.user.user,
          role: APPCONSTANTS.ROLES.DISTRICT_ADMIN
        }
      }
    });
    const mockBreadcrumbs = [
      {
        label: 'Test District',
        route: `/district/${initialState.district.district.id}/${initialState.district.district.tenantId}`
      }
    ];

    sessionStorage.setItem('breadCrumbs', JSON.stringify(mockBreadcrumbs));

    const { unmount } = render(
      <Provider store={localStore}>
        <BrowserRouter>
          <Breadcrumb />
        </BrowserRouter>
      </Provider>
    );

    const actions = localStore.getActions();
    const setDistrictAction = actions.find((action) => action.type === SET_DISTRICT_DETAILS);

    waitFor(() => {
      expect(setDistrictAction).toBeTruthy();
      expect(setDistrictAction.payload).toEqual({
        id: initialState.district.district.id,
        tenantId: initialState.district.district.tenantId,
        name: 'Test District'
      });
    });
    unmount();
  });

  it('dispatches chiefdom details when chiefdom route is restored', () => {
    const localStore = mockStore(initialState);
    const mockBreadcrumbs = [
      {
        label: 'Test Chiefdom',
        route: `/chiefdom/${initialState.chiefdom.chiefdomDetail.id}/${initialState.chiefdom.chiefdomDetail.tenantId}`
      }
    ];

    sessionStorage.setItem('breadCrumbs', JSON.stringify(mockBreadcrumbs));

    window.history.pushState(
      {},
      '',
      PROTECTED_ROUTES.chiefdomSummary
        .replace(':chiefdomId', initialState.chiefdom.chiefdomDetail.id)
        .replace(':tenantId', initialState.chiefdom.chiefdomDetail.tenantId)
    );
    const { unmount } = render(
      <Provider store={localStore}>
        <BrowserRouter>
          <Breadcrumb />
        </BrowserRouter>
      </Provider>
    );

    const actions = localStore.getActions();
    const setChiefdomAction = actions.find((action) => action.type === SET_CHIEFDOM_DETAILS);
    waitFor(() => {
      expect(setChiefdomAction).toBeTruthy();
      expect(setChiefdomAction.payload).toEqual({
        id: initialState.chiefdom.chiefdomDetail.id,
        tenantId: initialState.chiefdom.chiefdomDetail.tenantId,
        name: 'Test Chiefdom'
      });
    });
    unmount();
  });

  it('dispatches chiefdom details when chiefdom route is restored for chiefdom admin', () => {
    const localStore = mockStore({
      ...initialState,
      user: {
        user: {
          ...initialState.user.user,
          role: APPCONSTANTS.ROLES.CHIEFDOM_ADMIN
        }
      }
    });
    const mockBreadcrumbs = [
      {
        label: 'Test Chiefdom',
        route: `/chiefdom/${initialState.chiefdom.chiefdomDetail.id}/${initialState.chiefdom.chiefdomDetail.tenantId}`
      }
    ];

    sessionStorage.setItem('breadCrumbs', JSON.stringify(mockBreadcrumbs));

    window.history.pushState(
      {},
      '',
      PROTECTED_ROUTES.chiefdomSummary
        .replace(':chiefdomId', initialState.chiefdom.chiefdomDetail.id)
        .replace(':tenantId', initialState.chiefdom.chiefdomDetail.tenantId)
    );
    const { unmount } = render(
      <Provider store={localStore}>
        <BrowserRouter>
          <Breadcrumb />
        </BrowserRouter>
      </Provider>
    );

    const actions = localStore.getActions();
    const setChiefdomAction = actions.find((action) => action.type === SET_CHIEFDOM_DETAILS);
    waitFor(() => {
      expect(setChiefdomAction).toBeTruthy();
      expect(setChiefdomAction.payload).toEqual({
        id: initialState.chiefdom.chiefdomDetail.id,
        tenantId: initialState.chiefdom.chiefdomDetail.tenantId,
        name: 'Test Chiefdom'
      });
    });
    unmount();
  });

  it('dispatches health facility details when health facility route is restored', () => {
    const localStore = mockStore(initialState);
    const mockBreadcrumbs = [
      {
        label: 'Test Health Facility',
        route: `/health-facility/${initialState.healthFacility.healthFacility.id}/${initialState.healthFacility.healthFacility.tenantId}`
      }
    ];

    sessionStorage.setItem('breadCrumbs', JSON.stringify(mockBreadcrumbs));

    window.history.pushState(
      {},
      '',
      PROTECTED_ROUTES.healthFacilitySummary
        .replace(':healthFacilityId', initialState.healthFacility.healthFacility.id)
        .replace(':tenantId', initialState.healthFacility.healthFacility.tenantId)
    );
    const { unmount } = render(
      <Provider store={localStore}>
        <BrowserRouter>
          <Breadcrumb />
        </BrowserRouter>
      </Provider>
    );

    const actions = localStore.getActions();
    const setHFAction = actions.find((action) => action.type === SET_HF_SUMMARY);
    waitFor(() => {
      expect(setHFAction).toBeTruthy();
      expect(setHFAction.payload).toEqual({
        id: initialState.healthFacility.healthFacility.id,
        tenantId: initialState.healthFacility.healthFacility.tenantId,
        name: 'Test Health Facility'
      });
    });
    unmount();
  });

  it('should render form name for customizations', () => {
    const path = PROTECTED_ROUTES.accordianViewRegionCustomizationForm
      .replace(':regionId', '1')
      .replace(':tenantId', '123')
      .replace(':form', 'medication');
    const { unmount } = renderComponent(path);
    expect(screen.getByText('Medication Form')).toBeInTheDocument();
    unmount();
  });

  it('does not dispatch when route arrays have different lengths', () => {
    const localStore = mockStore(initialState);
    const mockBreadcrumbs = [
      {
        label: 'Invalid Route',
        route: '/invalid/route'
      }
    ];

    sessionStorage.setItem('breadCrumbs', JSON.stringify(mockBreadcrumbs));

    const { unmount } = render(
      <Provider store={localStore}>
        <BrowserRouter>
          <Breadcrumb />
        </BrowserRouter>
      </Provider>
    );

    const actions = localStore.getActions();
    const dispatchedActions = actions.filter((action) =>
      [SET_REGION_DETAILS, SET_DISTRICT_DETAILS, SET_CHIEFDOM_DETAILS, SET_HF_SUMMARY].includes(action.type)
    );

    expect(dispatchedActions).toHaveLength(0);
    unmount();
  });
});
