import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDispatch, useSelector } from 'react-redux';

import DistrictConsentForm from '../DistrictConsentForm';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

jest.mock('../../ConsentForm/ConsentForm', () => ({
  __esModule: true,
  default: ({ submitConsentForm }: any) =>
    require('react').createElement(
      'button',
      {
        type: 'button',
        'data-testid': 'consent-form',
        onClick: () => submitConsentForm('test content')
      },
      'Submit consent form'
    )
}));

jest.mock('../../../components/customTable/ConfirmationModalPopup', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', { 'data-testid': 'confirmation-modal' })
}));

jest.mock('../../../hooks/appTypeBasedConfigs', () => ({
  __esModule: true,
  default: () => ({
    district: {
      s: 'District'
    }
  })
}));

describe('DistrictConsentForm', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(dispatch);
    (useSelector as jest.Mock).mockReturnValue({ id: '1' });
    jest.clearAllMocks();
  });

  it('renders ConsentForm and ConfirmationModalPopup components', () => {
    render(<DistrictConsentForm isOpen={true} consentFormConfig={{}} handleConsentFormClose={jest.fn()} />);

    expect(screen.getByTestId('consent-form')).toBeInTheDocument();
    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
  });

  it('calls customizeFormRequest on submitConsentForm', async () => {
    const user = userEvent.setup();

    render(<DistrictConsentForm isOpen={true} consentFormConfig={{}} handleConsentFormClose={jest.fn()} />);

    await user.click(screen.getByTestId('consent-form'));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'CUSTOMIZE_FORM_REQUEST' }));
  });
});
