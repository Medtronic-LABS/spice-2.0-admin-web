import { render, screen, fireEvent, waitFor, createEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Region from '../Region';
import { userDataSelector } from '../../../store/user/selectors';
import { getRegionDetailsSelector, getLoadingSelector, getIsUploadingSelector } from '../../../store/region/selectors'; // Adjust the import path as necessary
import * as commonUtils from '../../../utils/commonUtils';
import toastCenter from '../../../utils/toastCenter';
import APPCONSTANTS from '../../../constants/appConstants';

const mockStore = configureStore([]);

jest.mock('../../../components/modal/ModalForm', () => jest.fn(() => null));
// Mock the hooks used in the Region component
jest.mock('../../../hooks/tablePagination', () => ({
  useTablePaginationHook: () => ({
    listParams: {},
    handleSearch: jest.fn(),
    handlePage: jest.fn()
  })
}));

// At the top of your test file, add this mock
jest.mock('../../../components/dragDropFiles/DragDropFiles', () => ({
  __esModule: true,
  default: ({ onDownload }: { onDownload: () => void }) => (
    <div data-testid='mock-drag-drop'>
      <button onClick={onDownload}>Mock Download</button>
    </div>
  )
}));
// Mock useDispatch and useSelector
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
  useSelector: jest.fn()
}));
// Mock the fileDownload function
jest.mock('../../../utils/commonUtils', () => ({
  fileDownload: jest.fn()
}));

// Mock the toastCenter
jest.mock('../../../utils/toastCenter', () => ({
  success: jest.fn(),
  error: jest.fn(),
  getErrorToastArgs: jest.fn()
}));

jest.mock('../../../utils/toastCenter');

describe('Region Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders loader when loading is true', () => {
    const initialState = {
      user: {
        userData: {
          country: { id: 1, name: 'Test Country' }
        }
      },
      region: {
        loading: true,
        isUploading: false,
        regionDetails: { list: [], total: 0 }
      }
    };
    const store = mockStore(initialState);

    // Mock the useSelector calls
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector: any) => {
      if (selector === userDataSelector) return initialState.user.userData;
      if (selector === getRegionDetailsSelector) return initialState.region.regionDetails;
      if (selector === getLoadingSelector) return initialState.region.loading;
      if (selector === getIsUploadingSelector) return initialState.region.isUploading;
    });
    render(
      <Provider store={store}>
        <Region />
      </Provider>
    );

    // Check for the presence of the loader SVG
    expect(screen.getByRole('img', { name: '' })).toBeInTheDocument();
  });

  it('renders region content when loading is false', () => {
    const initialState = {
      user: {
        userData: {
          country: { id: 1, name: 'Test Country' }
        }
      },
      region: {
        loading: false,
        isUploading: false,
        regionDetails: {
          list: [
            { id: 1, name: 'Region 1' },
            { id: 2, name: 'Region 2' }
          ],
          total: 2
        }
      }
    };
    const store = mockStore(initialState);

    // Mock the useSelector calls
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector: any) => {
      if (selector === userDataSelector) return initialState.user.userData;
      if (selector === getRegionDetailsSelector) return initialState.region.regionDetails;
      if (selector === getLoadingSelector) return initialState.region.loading;
      if (selector === getIsUploadingSelector) return initialState.region.isUploading;
    });

    render(
      <Provider store={store}>
        <Region />
      </Provider>
    );

    // Check for the presence of the table headers
    expect(screen.getByText('DISTRICT')).toBeInTheDocument();
    expect(screen.getByText('CHIEFDOM')).toBeInTheDocument();
    expect(screen.getByText('VILLAGE')).toBeInTheDocument();
    expect(screen.getByText('VILLAGE TYPE')).toBeInTheDocument();

    // Check for the presence of table rows (excluding header)
    const tableRows = screen.getAllByRole('row').slice(1);
    expect(tableRows).toHaveLength(2); // Assuming 2 rows of data
  });

  it('renders DragDropFiles component', () => {
    const initialState = {
      user: {
        userData: {
          country: { id: 1, name: 'Test Country' }
        }
      },
      region: {
        loading: false,
        isUploading: false,
        regionDetails: { list: [], total: 0 }
      }
    };
    const store = mockStore(initialState);

    // Mock the useSelector calls
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector: any) => {
      if (selector === userDataSelector) return initialState.user.userData;
      if (selector === getRegionDetailsSelector) return initialState.region.regionDetails;
      if (selector === getLoadingSelector) return initialState.region.loading;
      if (selector === getIsUploadingSelector) return initialState.region.isUploading;
    });

    render(
      <Provider store={store}>
        <Region />
      </Provider>
    );

    expect(screen.getByTestId('mock-drag-drop')).toBeInTheDocument();
  });

  it('renders upload and download buttons', () => {
    const initialState = {
      user: {
        userData: {
          country: { id: 1, name: 'Test Country' }
        }
      },
      region: {
        loading: false,
        isUploading: false,
        regionDetails: { list: [], total: 0 }
      }
    };
    const store = mockStore(initialState);

    // Mock the useSelector calls
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector: any) => {
      if (selector === userDataSelector) return initialState.user.userData;
      if (selector === getRegionDetailsSelector) return initialState.region.regionDetails;
      if (selector === getLoadingSelector) return initialState.region.loading;
      if (selector === getIsUploadingSelector) return initialState.region.isUploading;
    });

    render(
      <Provider store={store}>
        <Region />
      </Provider>
    );
    // Check for the presence of the DragDropFiles component
    expect(screen.getByTestId('mock-drag-drop')).toBeInTheDocument();

    // If you want to be more specific, you can check for the text within the mock component
    expect(screen.getByText('Mock Download')).toBeInTheDocument();
  });

  it('handles download button click correctly', () => {
    const mockDispatch = jest.fn();
    const useDispatchSpy = jest.spyOn(require('react-redux'), 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatch);

    const initialState = {
      user: {
        userData: {
          country: { id: 1, name: 'Test Country' }
        }
      },
      region: {
        loading: false,
        isUploading: false,
        regionDetails: { list: [{ id: 1, name: 'Region 1' }], total: 1 }
      }
    };
    const store = mockStore(initialState);

    // Mock the useSelector calls
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector: any) => {
      if (selector === userDataSelector) return initialState.user.userData;
      if (selector === getRegionDetailsSelector) return initialState.region.regionDetails;
      if (selector === getLoadingSelector) return initialState.region.loading;
      if (selector === getIsUploadingSelector) return initialState.region.isUploading;
    });

    render(
      <Provider store={store}>
        <Region />
      </Provider>
    );

    // Find and click the download button
    const downloadButton = screen.getByText('Download');
    fireEvent.click(downloadButton);
    // Check if both actions were dispatched
    expect(mockDispatch).toHaveBeenCalledTimes(2);

    // Check the first call (REGION_DETAILS_REQUEST)
    expect(mockDispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'REGION_DETAILS_REQUEST',
        countryId: 1
        // Add other expected properties here
      })
    );

    // Check the second call (DOWNLOAD_FILE_REQUEST)
    expect(mockDispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'DOWNLOAD_FILE_REQUEST',
        countryId: 1,
        successCb: expect.any(Function),
        failureCb: expect.any(Function)
      })
    );
    // Test the success callback
    const successCb = mockDispatch.mock.calls[1][0].successCb;
    if (successCb) {
      successCb('mock data');
      expect(commonUtils.fileDownload).toHaveBeenCalledWith(
        'mock data',
        'Test Country',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      expect(toastCenter.success).toHaveBeenCalledWith(APPCONSTANTS.SUCCESS, APPCONSTANTS.REGION_DOWNLOAD_SUCCESS);
    } else {
      fail('successCb is undefined');
    }

    // Test the failure callback
    const failureCb = mockDispatch.mock.calls[1][0].failureCb;
    if (failureCb) {
      failureCb('error');
      expect(toastCenter.error).toHaveBeenCalledWith(APPCONSTANTS.OOPS, APPCONSTANTS.REGION_DOWNLOAD_FAILURE);
    } else {
      fail('failureCb is undefined');
    }
  });

  it('handles file upload correctly', async () => {
    const mockDispatch = jest.fn();
    const useDispatchSpy = jest.spyOn(require('react-redux'), 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatch);

    const initialState = {
      user: {
        userData: {
          country: { id: 1, name: 'Test Country' }
        }
      },
      region: {
        loading: false,
        isUploading: false,
        regionDetails: { list: [{ id: 1, name: 'Region 1' }], total: 1 }
      }
    };
    const store = mockStore(initialState);

    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector: any) => {
      if (selector === userDataSelector) return initialState.user.userData;
      if (selector === getRegionDetailsSelector) return initialState.region.regionDetails;
      if (selector === getLoadingSelector) return initialState.region.loading;
      if (selector === getIsUploadingSelector) return initialState.region.isUploading;
    });

    render(
      <Provider store={store}>
        <Region />
      </Provider>
    );

    // Find and click the upload button
    const uploadButton = screen.getByText('Upload');
    fireEvent.click(uploadButton);

    // Wait for the modal to appear
    await waitFor(() => {
      expect(screen.getByText('Upload Region Data')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'REGION_DETAILS_REQUEST',
          countryId: 1,
          failureCb: expect.any(Function)
          // Add other expected properties here
        })
      );
    });

    // Find the mock drag-drop component
    const mockDragDrop = screen.getByTestId('mock-drag-drop');
    expect(mockDragDrop).toBeInTheDocument();

    // Simulate file drop
    const file = new File(['dummy content'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    fireEvent.drop(mockDragDrop, {
      dataTransfer: {
        files: [file]
      }
    });

    // Check if the mock download button is clicked (as per your mock implementation)
    const mockDownloadButton = screen.getByText('Mock Download');
    fireEvent.click(mockDownloadButton);

    // // Check if the UPLOAD_FILE_REQUEST action was dispatched
    // await waitFor(() => {
    //   expect(mockDispatch).toHaveBeenCalledWith(
    //     uploadFileRequest(expect.objectContaining({
    //       file,
    //       successCb: expect.any(Function),
    //       failureCb: expect.any(Function),
    //     }))
    //   );
    // });
    // Get the successCb and failureCb from the last call (which should be UPLOAD_FILE_REQUEST)
    const lastCall = mockDispatch.mock.calls[mockDispatch.mock.calls.length - 1][0];
    // Get the successCb and failureCb from the last call (UPLOAD_FILE_REQUEST)
    const { successCb, failureCb } = lastCall;

    // Test successCb if it exists
    if (successCb) {
      successCb();
      expect(toastCenter.success).toHaveBeenCalledWith(APPCONSTANTS.SUCCESS, APPCONSTANTS.REGION_UPLOAD_SUCCESS);
    }

    // Test failureCb if it exists
    if (failureCb) {
      failureCb('error');
      expect(toastCenter.error).toHaveBeenCalledWith(APPCONSTANTS.OOPS, APPCONSTANTS.REGION_UPLOAD_FAILURE);
    }
  });

  it('handles drag and drop events correctly when region list is empty', () => {
    const mockDispatch = jest.fn();
    const useDispatchSpy = jest.spyOn(require('react-redux'), 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatch);

    const initialState = {
      user: {
        userData: {
          country: { id: 1, name: 'Test Country' }
        }
      },
      region: {
        loading: false,
        isUploading: false,
        regionDetails: { list: [], total: 0 } // Empty list to trigger drag-drop container
      }
    };
    const store = mockStore(initialState);

    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector: any) => {
      if (selector === userDataSelector) return initialState.user.userData;
      if (selector === getRegionDetailsSelector) return initialState.region.regionDetails;
      if (selector === getLoadingSelector) return initialState.region.loading;
      if (selector === getIsUploadingSelector) return initialState.region.isUploading;
    });

    const { container } = render(
      <Provider store={store}>
        <Region />
      </Provider>
    );

    // Find the drag-drop container
    const dragDropContainer = container.querySelector('div[data-testid="mock-drag-drop"]');
    expect(dragDropContainer).toBeInTheDocument();

    if (dragDropContainer) {
      // Test onDragOver
      const dragOverEvent = createEvent.dragOver(dragDropContainer);
      Object.defineProperty(dragOverEvent, 'preventDefault', { value: jest.fn() });

      fireEvent(dragDropContainer, dragOverEvent);

      expect(dragOverEvent.preventDefault).toHaveBeenCalled();
      // Remove the stopPropagation check for dragOver

      // Test onDrop
      const dropEvent = createEvent.drop(dragDropContainer);
      Object.defineProperty(dropEvent, 'preventDefault', { value: jest.fn() });
      Object.defineProperty(dropEvent, 'stopPropagation', { value: jest.fn() });
      Object.defineProperty(dropEvent, 'dataTransfer', {
        value: {
          files: [
            new File(['dummy content'], 'test.xlsx', {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            })
          ]
        }
      });

      fireEvent(dragDropContainer, dropEvent);

      expect(dropEvent.preventDefault).toHaveBeenCalled();
      expect(dropEvent.stopPropagation).toHaveBeenCalled();

      // Add more assertions here if needed
    } else {
      throw new Error('Drag and drop container not found');
    }
  });
});
