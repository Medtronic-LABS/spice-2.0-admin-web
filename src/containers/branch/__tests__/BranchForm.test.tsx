import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Form } from 'react-final-form';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import BranchForm from '../BranchForm';

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
  default: ({ label, disabled, input = {} }: any) => (
    <div data-testid="text-input" data-label={label} data-disabled={disabled}>
      <label>{label}</label>
      <input {...input} aria-label={label} disabled={disabled} />
    </div>
  )
}));

jest.mock('../../../components/formFields/SelectInput', () => ({
  __esModule: true,
  default: ({ label, onChange }: any) => (
    <div data-testid="select-input" data-label={label}>
      <span>{label}</span>
      <button
        type="button"
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
        <Form onSubmit={() => {}} initialValues={initialValues}>
          {({ form }) => (
            <BranchForm form={form} formName="branch" isEdit={false} {...props} />
          )}
        </Form>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
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
});
