import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import BranchForm, { validateNonNegative } from '../BranchForm';
import { errorMsgs } from '../../../constants/erroMsgs';

const mockStore = configureStore([]);

jest.mock('react-router', () => ({
  useParams: () => ({ regionId: '1', tenantId: '1' })
}));

jest.mock('../../../hooks/appTypeBasedConfigs', () => ({
  __esModule: true,
  default: () => ({
    district: { s: 'District', p: 'Districts' },
    chiefdom: { s: 'Chiefdom', p: 'Chiefdoms' }
  })
}));

jest.mock('../../../store/chiefdom/actions', () => ({
  fetchChiefdomDropdownRequest: jest.fn((payload: { tenantId: string }) => ({
    type: 'FETCH_CHIEFDOM_DROPDOWN_REQUEST',
    payload
  }))
}));

jest.mock('../../../components/formFields/TextInput', () => ({
  __esModule: true,
  default: ({ label, disabled, input = {}, error, onKeyDown }: any) => (
    <div data-testid='text-input' data-label={label} data-disabled={disabled}>
      <label>{label}</label>
      <input
        {...input}
        aria-label={label}
        disabled={disabled}
        onKeyDown={onKeyDown}
        data-testid={label ? `input-${label.replace(/\s/g, '-')}` : undefined}
      />
      {error && <span data-testid='field-error'>{error}</span>}
    </div>
  )
}));

jest.mock('../../../components/formFields/SelectInput', () => ({
  __esModule: true,
  default: ({ label, onChange }: any) => (
    <div data-testid='select-input' data-label={label}>
      <span>{label}</span>
      <button
        type='button'
        data-testid={`select-${label.toLowerCase()}`}
        onClick={() => onChange?.({ id: 1, tenantId: 100 })}
      >
        Select option
      </button>
    </div>
  )
}));

const defaultStoreState = {
  district: {
    districtList: [{ id: 1, name: 'District A', tenantId: 100 }],
    loading: false
  },
  chiefdom: {
    dropdownChiefdomList: [{ id: 1, name: 'Chiefdom A' }],
    dropdownChiefdomListLoading: false
  }
};

describe('BranchForm', () => {
  const store = mockStore(defaultStoreState);

  const renderWithForm = (
    props: Partial<{ formName: string; isEdit: boolean }> = {},
    initialValues: Record<string, unknown> = {}
  ) => {
    return render(
      <Provider store={store}>
        <Form onSubmit={jest.fn()} initialValues={initialValues}>
          {({ form }) => (
            <BranchForm form={form} formName='branch' isEdit={false} {...props} />
          )}
        </Form>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    store.clearActions();
  });

  it('renders all form fields', () => {
    renderWithForm();

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Code')).toBeInTheDocument();
    expect(screen.getByText('Current Account Code')).toBeInTheDocument();
    expect(screen.getByText('District')).toBeInTheDocument();
    expect(screen.getByText('Chiefdom')).toBeInTheDocument();
    expect(screen.getByText('SK Position Count')).toBeInTheDocument();
    expect(screen.getByText('SS Position Count')).toBeInTheDocument();
    expect(screen.getByText('PO Position Count')).toBeInTheDocument();
    expect(screen.getByText('FO Position Count')).toBeInTheDocument();
  });

  it('renders with default formName "branch"', () => {
    const { container } = renderWithForm();
    const textInputs = container.querySelectorAll('[data-testid="text-input"]');
    expect(textInputs.length).toBeGreaterThanOrEqual(1);
    expect(container.querySelector('.row.gx-1dot25')).toBeInTheDocument();
  });

  it('disables Code field when isEdit is true', () => {
    renderWithForm({ isEdit: true });
    const codeInput = screen.getByText('Code').closest('[data-testid="text-input"]');
    expect(codeInput).toHaveAttribute('data-disabled', 'true');
  });

  it('does not disable Code field when isEdit is false', () => {
    renderWithForm({ isEdit: false });
    const codeInput = screen.getByText('Code').closest('[data-testid="text-input"]');
    expect(codeInput).toHaveAttribute('data-disabled', 'false');
  });

  it('renders with custom formName when provided', () => {
    renderWithForm({ formName: 'customBranch' });
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('District')).toBeInTheDocument();
  });

  it('dispatches fetchChiefdomDropdownRequest when district is changed', async () => {
    const { getByTestId } = renderWithForm();
    const districtSelectButton = getByTestId('select-district');

    await act(async () => {
      districtSelectButton.click();
    });

    const actions = store.getActions();
    expect(actions).toContainEqual(
      expect.objectContaining({
        type: 'FETCH_CHIEFDOM_DROPDOWN_REQUEST',
        payload: { tenantId: '100' }
      })
    );
  });

  it('updates form when chiefdom is selected', async () => {
    const { getByTestId } = renderWithForm();
    const chiefdomSelectButton = getByTestId('select-chiefdom');

    await act(async () => {
      chiefdomSelectButton.click();
    });

    expect(chiefdomSelectButton).toBeInTheDocument();
  });

  it('renders district and chiefdom select options from store', () => {
    renderWithForm();
    expect(screen.getByText('District')).toBeInTheDocument();
    expect(screen.getByText('Chiefdom')).toBeInTheDocument();
  });

  it('renders position count fields with numeric input mode', () => {
    const { container } = renderWithForm();
    const positionLabels = ['SK Position Count', 'SS Position Count', 'PO Position Count', 'FO Position Count'];
    positionLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
    const textInputs = container.querySelectorAll('[data-testid="text-input"]');
    expect(textInputs.length).toBeGreaterThanOrEqual(4);
  });

  describe('validateNonNegative', () => {
    it('returns undefined for empty, undefined, or null', () => {
      expect(validateNonNegative('')).toBeUndefined();
      expect(validateNonNegative(undefined)).toBeUndefined();
      expect(validateNonNegative(null as any)).toBeUndefined();
    });
    it('returns INVALID_NO for NaN', () => {
      expect(validateNonNegative('abc')).toBe(errorMsgs.INVALID_NO);
      expect(validateNonNegative('12abc')).toBe(errorMsgs.INVALID_NO);
    });
    it('returns NEGATIVE_NO for negative numbers', () => {
      expect(validateNonNegative(-1)).toBe(errorMsgs.NEGATIVE_NO);
      expect(validateNonNegative('-5')).toBe(errorMsgs.NEGATIVE_NO);
    });
    it('returns LIMIT_NO for values greater than 999', () => {
      expect(validateNonNegative(1000)).toBe(errorMsgs.LIMIT_NO);
      expect(validateNonNegative('1000')).toBe(errorMsgs.LIMIT_NO);
    });
    it('returns undefined for valid 0-999', () => {
      expect(validateNonNegative(0)).toBeUndefined();
      expect(validateNonNegative(999)).toBeUndefined();
      expect(validateNonNegative('42')).toBeUndefined();
    });
  });

  it('uses default formName "branch" and default isEdit false when not provided', () => {
    render(
      <Provider store={store}>
        <Form onSubmit={jest.fn()} initialValues={{}}>
          {({ form }) => <BranchForm form={form} />}
        </Form>
      </Provider>
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('District')).toBeInTheDocument();
  });

  it('dispatches fetchChiefdomDropdownRequest on mount when district has tenantId', () => {
    renderWithForm(
      { isEdit: false },
      { branch: { district: { id: 1, name: 'District A', tenantId: 100 } } }
    );
    const actions = store.getActions();
    expect(actions).toContainEqual(
      expect.objectContaining({
        type: 'FETCH_CHIEFDOM_DROPDOWN_REQUEST',
        payload: { tenantId: '100' }
      })
    );
  });

  it('does not dispatch fetchChiefdomDropdownRequest on mount when district tenantId is missing', () => {
    renderWithForm(
      { isEdit: true },
      { branch: { district: { id: 1, name: 'District A' } } }
    );
    const actions = store.getActions();
    expect(actions).not.toContainEqual(
      expect.objectContaining({
        type: 'FETCH_CHIEFDOM_DROPDOWN_REQUEST'
      })
    );
  });

  const positionCountLabels = [
    'SK Position Count',
    'SS Position Count',
    'PO Position Count',
    'FO Position Count'
  ];

  positionCountLabels.forEach((label) => {
    it(`position count field "${label}" prevents non-digit key input`, () => {
      renderWithForm();
      const testId = `input-${label.replace(/\s/g, '-')}`;
      const input = screen.getByTestId(testId);
      const event = new KeyboardEvent('keydown', {
        key: 'a',
        keyCode: 65,
        bubbles: true,
        cancelable: true
      });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
      input.dispatchEvent(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });
});
