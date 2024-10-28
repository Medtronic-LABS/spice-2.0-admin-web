// src/utils/__tests__/commonUtils.test.tsx
import {destroyToastById, dismissAllToast, error, getErrorToastArgs, info, success} from '../toastCenter';
import { toast } from 'react-toastify';
import { ReactComponent as WarningIcon } from '../assets/images/info-orange.svg';
import { ReactComponent as SuccessIcon } from '../assets/images/Info-green.svg';
import { ReactComponent as InfoIcon } from '../assets/images/Info-blue.svg';

jest.mock('react-toastify', () => ({
  toast: {
    warning: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
    dismiss: jest.fn(),
    update: jest.fn(),
    isActive: jest.fn(),
  },
}));
jest.mock('react-toastify', () => ({
    toast: {
      dismiss: jest.fn(),
    },
  }));

describe('Toast Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe('error', () => {
    it('should show a warning toast with the correct parameters', async () => {
      const brief = 'Warning!';
      const body = 'This is a warning message.';
      const toastId = await error(brief, body);

      expect(toast.dismiss).toHaveBeenCalled(); // Check if all toasts are dismissed
      expect(toast.isActive).toHaveBeenCalledWith(`${brief}_${body}`);
      expect(toast.warning).toHaveBeenCalledWith(
        expect.anything(), // Check the messageFormatter output
        {
          icon: <WarningIcon />,
          closeButton: true,
          hideProgressBar: true,
          closeOnClick: true,
          position: 'bottom-right',
          autoClose: 10000,
          toastId: toastId,
        }
      );
    });

    it('should update an active toast with shake class if preventDuplicate is true', async () => {
      const brief = 'Warning!';
      const body = 'This is a warning message.';
      const toastId = `${brief}_${body}`;

      (toast.isActive as jest.Mock).mockReturnValue(true); // Mocking isActive to return true

      await error(brief, body);

      expect(toast.update).toHaveBeenCalledWith(toastId, {
        className: 'shake',
      });
    });
  });

  describe('success', () => {
    it('should show a success toast with the correct parameters', () => {
      const brief = 'Success!';
      const body = 'This is a success message.';
      success(brief, body);

      expect(toast.dismiss).toHaveBeenCalled(); // Check if all toasts are dismissed
      expect(toast.success).toHaveBeenCalledWith(
        expect.anything(), // Check the messageFormatter output
        {
          icon: <SuccessIcon />,
          closeButton: false,
          closeOnClick: true,
          hideProgressBar: true,
          position: 'bottom-right',
        }
      );
    });
  });

  describe('info', () => {
    it('should show an info toast with the correct parameters', () => {
      const brief = 'Info!';
      const body = 'This is an info message.';
      info(brief, body);

      expect(toast.dismiss).toHaveBeenCalled(); // Check if all toasts are dismissed
      expect(toast.info).toHaveBeenCalledWith(
        expect.anything(), // Check the messageFormatter output
        {
          icon: <InfoIcon />,
          closeButton: false,
          closeOnClick: true,
          hideProgressBar: true,
          position: 'bottom-right',
        }
      );
    });
  });

  describe('dismissAllToast', () => {
    it('should dismiss all toasts', () => {
      dismissAllToast();
      expect(toast.dismiss).toHaveBeenCalled();
    });
  });
  it('should return error name and message from Error object', () => {
    const error = new Error('Test error message');
    const [name, message, options] = getErrorToastArgs(error, '', '');
    
    expect(name).toBe('Error'); // Default name
    expect(message).toBe('Test error message');
    expect(options).toEqual({ animateIfActive: true });
  });
  it('should return alternative name and message when provided', () => {
    const error = new Error('Test error message');
    const [name, message, options] = getErrorToastArgs(error, 'CustomName', 'Custom message');
    
    expect(name).toBe('CustomName');
    expect(message).toBe('Test error message');
    expect(options).toEqual({ animateIfActive: true });
  });
  

  it('should handle SESSION_TIMEDOUT case', () => {
    const error = new Error('Some error');
    const [ options] = getErrorToastArgs(error, '', '');
    
    expect(options).toEqual('Error'); // Should not animate
  });
  it('should call toast.dismiss with the correct toastId', () => {
    const toastId = 'test-toast-id';
    
    destroyToastById(toastId);
    
    expect(toast.dismiss).toHaveBeenCalledWith(toastId);
  });
});


