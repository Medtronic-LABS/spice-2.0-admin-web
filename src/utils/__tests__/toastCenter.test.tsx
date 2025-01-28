import { toast } from 'react-toastify';
import { error, success, info, destroyToastById, dismissAllToast, getErrorToastArgs } from '../toastCenter';
import ERRORS from '../../constants/errors';

jest.mock('react-toastify', () => ({
  toast: {
    warning: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
    dismiss: jest.fn(),
    isActive: jest.fn(),
    update: jest.fn()
  }
}));

describe('toastCenter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  describe('error', () => {
    it('should show warning toast with brief message only', async () => {
      const brief = 'Error occurred';
      await error(brief);

      expect(toast.warning).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          closeButton: true,
          hideProgressBar: true,
          position: 'bottom-right',
          autoClose: 10000,
          toastId: `${brief}_`
        })
      );
    });

    it('should show warning toast with brief and body', async () => {
      const brief = 'Error occurred';
      const body = 'Detailed error message';
      await error(brief, body);

      expect(toast.warning).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          toastId: `${brief}_${body}`
        })
      );
    });

    it('should animate existing toast when preventDuplicate and animateIfActive are true', async () => {
      const brief = 'Error occurred';
      (toast.isActive as jest.Mock).mockReturnValue(true);

      await error(brief, undefined, { preventDuplicate: true, animateIfActive: true });

      expect(toast.update).toHaveBeenCalledWith(`${brief}_`, {
        className: 'shake'
      });

      jest.advanceTimersByTime(500);

      expect(toast.update).toHaveBeenCalledWith(`${brief}_`, {
        className: 'shake'
      });
    });

    it('should animate existing toast when preventDuplicate as false and animateIfActive are true', async () => {
      const brief = 'Error occurred';
      (toast.isActive as jest.Mock).mockReturnValue(true);

      await error(brief, undefined, { preventDuplicate: false, animateIfActive: true });
    });
  });

  describe('success', () => {
    it('should show success toast with brief message only', () => {
      const brief = 'Operation successful';
      success(brief);

      expect(toast.success).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          closeButton: false,
          hideProgressBar: true,
          position: 'bottom-right'
        })
      );
    });

    it('should show success toast with brief and body', () => {
      const brief = 'Operation successful';
      const body = 'Your changes have been saved';
      success(brief, body);

      expect(toast.success).toHaveBeenCalled();
    });
  });

  describe('info', () => {
    it('should show info toast with brief message only', () => {
      const brief = 'Information';
      info(brief);

      expect(toast.info).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          closeButton: false,
          hideProgressBar: true,
          position: 'bottom-right'
        })
      );
    });

    it('should show info toast with brief and body', () => {
      const brief = 'Information';
      const body = 'Additional details';
      info(brief, body);

      expect(toast.info).toHaveBeenCalled();
    });
  });

  describe('destroyToastById', () => {
    it('should dismiss specific toast by id', () => {
      const toastId = 'test-toast';
      destroyToastById(toastId);

      expect(toast.dismiss).toHaveBeenCalledWith(toastId);
    });
  });

  describe('dismissAllToast', () => {
    it('should dismiss all toasts', () => {
      dismissAllToast();

      expect(toast.dismiss).toHaveBeenCalled();
    });
  });

  describe('getErrorToastArgs', () => {
    it('should return custom error name and message', () => {
      const localError = new Error('Custom error');
      localError.name = 'CustomError';
      const [name, message, options] = getErrorToastArgs(localError, '', '');

      expect(name).toBe('CustomError');
      expect(message).toBe('Custom error');
      expect(options.animateIfActive).toBe(true);
    });

    it('should return alternative name and message when provided', () => {
      const localError = new Error(ERRORS.SERVER_ERROR.message);
      const altName = 'Alternative Error';
      const altMessage = 'Alternative message';
      const [name, message, options] = getErrorToastArgs(localError, altName, altMessage);

      expect(name).toBe(altName);
      expect(message).toBe(altMessage);
      expect(options.animateIfActive).toBe(true);
    });

    it('should set animateIfActive to false for SESSION_TIMEDOUT', () => {
      const localError = new Error('SESSION_TIMEDOUT');
      const [, , options] = getErrorToastArgs(localError, '', 'SESSION_TIMEDOUT');

      expect(options.animateIfActive).toBe(false);
    });
  });
});
