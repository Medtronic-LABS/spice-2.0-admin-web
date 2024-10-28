import React from 'react';
import {  render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter, Route } from 'react-router-dom';
import LabTestCustomizationLayout from '../LabTestCustomizationLayout';
import {
  fetchLabTestCustomizationRequest,
  fetchUnitListRequest,
} from '../../../store/labTest/actions';
import { clearFormJSON } from '../../../store/workflow/actions';
import { labTestJSONLoadingSelector } from '../../../store/labTest/selectors';
import { Store, AnyAction } from 'redux';

// Mock the necessary components and hooks
jest.mock('../../../components/loader/Loader', () => () => <div data-testid='loader'>Loading...</div>);
jest.mock('../../../components/formBuilder/components/accordian/AccordianView', () => () => <div>AccordianView</div>);
jest.mock('../../../components/formBuilder/components/reorder/ReorderView', () => () => <div>ReorderView</div>);
jest.mock('../../../utils/toastCenter');
// Mock the AccordianView component
jest.mock('../../../components/formBuilder/components/accordian/AccordianView', () => {
  return function MockAccordianView(props: any) {
    return (
      <div>
        <button onClick={() => props.onSubmit({ field1: [{ isMandatory: true }], field2: [{ isMandatory: true }] })}>
          Submit
        </button>
        <button onClick={props.onCancel}>Cancel</button>
      </div>
    );
  };
});
const formRef = {};

jest.mock('../../../components/formBuilder/hooks/useFormCustomization', () => {
  return jest.fn(() => ({
    formRef,
    formData: {
      field1: [{ isMandatory: true }],
      field2: [{ isMandatory: true }]
    },
    setFormData: jest.fn(),
    groupViewsByFamily: jest.fn(),
    addedFields: [],
    targetIdsForAccount: [],
    collapsedGroup: [],
    setCollapsedGroup: jest.fn(),
    resetCollapsedCalculation: jest.fn(),
    presentableJson: jest.fn(),
    hashFieldIdsWithTitle: {},
    hashFieldIdsWithFieldName: {},
    sethashFieldIdsWithFieldName: jest.fn(),
    isFamilyOrderModelOpen: false,
    setFamilyOrderModelOpen: jest.fn(),
    editGroupedFieldsOrder: [],
    setEditGroupedFieldsOrder: jest.fn()
  }));
});
// Mock useDispatch and useSelector
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
  useSelector: jest.fn()
}));
const mockStore = configureStore([]);
jest.mock('../../../store/labTest/actions', () => ({
  fetchLabTestCustomizationRequest: jest.fn(),
  fetchUnitListRequest: jest.fn(),
  labtestCustomization: jest.fn() // Mock the labtestCustomization action
}));

describe('LabTestCustomizationLayout', () => {
  let store: Store<any, AnyAction>;

  beforeEach(() => {
    store = mockStore({
      workflow: {
        formMeta: []
      },
      labTest: {
        labTestJSONLoading: false,
        customizationLoading: false,
        formData: {
          field1: [{ isMandatory: true }],
          field2: [{ isMandatory: true }]
        }
      }
    });

    jest.clearAllMocks();
  });

  it('renders loader when loading is true', () => {
    store = mockStore({
      workflow: {
        formMeta: []
      },
      labTest: {
        labTestJSONLoading: true,
        customizationLoading: false
      }
    });

    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector: any) => {
      if (selector === labTestJSONLoadingSelector) return true;
      //   if (selector === customizationLoadingSelector) return false; // Return false for customization loading
      return null; // Default case
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/test/1/2/TestName/Identifier/3']}>
          <Route path='/:tenantId/:regionId/:labTestName/:identifier/:testId'>
            <LabTestCustomizationLayout />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('dispatches fetchUnitListRequest and fetchLabTestCustomizationRequest on mount', async () => {
    const dispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(dispatch);

    const initialState = {
      workflow: {
        formMeta: []
      },
      labTest: {
        labTestJSONLoading: false,
        customizationLoading: false
      }
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/test/1/2/TestName/Identifier/3']}>
          <Route path='/:tenantId/:regionId/:labTestName/:identifier/:testId'>
            <LabTestCustomizationLayout />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(fetchUnitListRequest());
      expect(dispatch).toHaveBeenCalledWith(
        fetchLabTestCustomizationRequest({
          name: 'TestName', // Ensure this matches the expected value
          successCb: expect.any(Function),
          failureCb: expect.any(Function)
        })
      );
    });
  });

  it('clears form JSON on unmount', () => {
    const dispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(dispatch);

    const { unmount } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/test/1/2/TestName/Identifier/3']}>
          <Route path='/:tenantId/:regionId/:labTestName/:identifier/:testId'>
            <LabTestCustomizationLayout />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    unmount();

    expect(dispatch).toHaveBeenCalledWith(clearFormJSON());
  });

  it('should dispatch fetchLabTestCustomizationRequest on mount and clear form JSON on unmount', async () => {
    const dispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(dispatch);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/test/1/2/TestName/Identifier/3']}>
          <Route path='/:tenantId/:regionId/:labTestName/:identifier/:testId'>
            <LabTestCustomizationLayout />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    // Check if fetchLabTestCustomizationRequest was called
    expect(dispatch).toHaveBeenCalledWith(
      fetchLabTestCustomizationRequest({
        name: 'TestName', // Ensure this matches the expected value
        successCb: expect.any(Function),
        failureCb: expect.any(Function)
      })
    );

    // Unmount the component
    const { unmount } = render(
      <Provider store={store}>
        <MemoryRouter>
          <LabTestCustomizationLayout />
        </MemoryRouter>
      </Provider>
    );

    unmount();

    // Check if clearFormJSON was dispatched on unmount
    expect(dispatch).toHaveBeenCalledWith(clearFormJSON());
  });

 
});
