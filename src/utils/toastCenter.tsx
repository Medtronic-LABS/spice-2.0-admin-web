import { toast } from 'react-toastify';

import { ReactComponent as WarningIcon } from '../assets/images/info-orange.svg';
import { ReactComponent as SuccessIcon } from '../assets/images/Info-green.svg';
import { ReactComponent as InfoIcon } from '../assets/images/Info-blue.svg';
import ERRORS from '../constants/errors';

/**
 * Shows the warning toast
 * @param brief short message
 * @param body description
 */
export const error = async (
  brief: string,
  body?: string,
  { preventDuplicate = true, animateIfActive = true }: any = {}
) => {
  dismissAllToast();
  const toastId = `${brief}_${body || ''}`;
  if (preventDuplicate && animateIfActive && toast.isActive(toastId)) {
    toast.update(toastId, {
      className: 'shake'
    });
    setTimeout(() => {
      toast.update(toastId, {
        className: undefined
      });
    }, 500);
  } else {
    toast.warning(messageFormatter(brief, body), {
      icon: <WarningIcon />,
      closeButton: true,
      hideProgressBar: true,
      closeOnClick: true,
      position: 'bottom-right',
      autoClose: 10000,
      toastId: preventDuplicate ? toastId : undefined
    });
  }
  return toastId;
};

/**
 * Shows the success toast
 * @param brief short message
 * @param body description
 */
export const success = (brief: string, body?: string) => {
  dismissAllToast();
  toast.success(messageFormatter(brief, body), {
    icon: <SuccessIcon />,
    closeButton: false,
    closeOnClick: true,
    hideProgressBar: true,
    position: 'bottom-right'
  });
};

/**
 * Shows the info toast
 * @param brief short message
 * @param body description
 */
export const info = (brief: string, body?: string) => {
  dismissAllToast();
  toast.info(messageFormatter(brief, body), {
    icon: <InfoIcon />,
    closeButton: false,
    closeOnClick: true,
    hideProgressBar: true,
    position: 'bottom-right'
  });
};

export const destroyToastById = (toastId: string) => {
  toast.dismiss(toastId);
};

export const dismissAllToast = () => {
  toast.dismiss();
};

export const getErrorToastArgs = (e: Error, altName: string, altMessage: string) => {
  const name = altName ? altName : e?.name;
  const message = !!e.message && e.message !== ERRORS.SERVER_ERROR.message ? e.message : altMessage;
  return [name, message, { animateIfActive: message !== 'SESSION_TIMEDOUT' }] as [string, string, any];
};

/**
 * Formats the message strings into JSX elements and applies styles
 * @param brief short message
 * @param body description
 * @returns Formatted toast message element
 */
const messageFormatter = (brief: string, body?: string) => {
  return (
    <div>
      <div className='Toast_message'>{brief}</div>
      {body && <div className='Toast_body'>{body}</div>}
    </div>
  );
};

const toastCenter = { info, success, error, destroyToastById, dismissAllToast };

export default toastCenter;
