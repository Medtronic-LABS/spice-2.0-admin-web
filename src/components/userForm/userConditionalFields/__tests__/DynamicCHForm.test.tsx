import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import { DynamicCHForm } from '../DynamicCHForm';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch
}));

const mockIsCHPCHWSelected = jest.fn();
jest.mock('../../userFormUtils', () => ({
  __esModule: true,
  default: () => ({ isCHPCHWSelected: mockIsCHPCHWSelected })
}));

jest.mock('react-router-dom', () => ({
  useParams: () => ({ healthFacilityId: '1' })
}));

jest.mock('../../../../hooks/appTypeBasedConfigs', () => ({
  __esModule: true,
  default: () => ({ village: { p: 'Villages' } })
}));

const mockFetchSubVillagesRequest = jest.fn((payload: any) => ({ type: 'FETCH_SUB_VILLAGES', payload }));
jest.mock('../../../../store/region/actions', () => ({
  fetchSubVillagesRequest: (payload: any) => mockFetchSubVillagesRequest(payload)
}));

jest.mock('../../../formFields/SelectInput', () => ({
  __esModule: true,
  default: ({ label }: any) => <div data-testid="select-input">{label}</div>
}));

const defaultInitialValues = {
  users: [
    {
      existingVillages: [],
      selectedVillages: [],
      healthfacility: {},
      selectedRoles: []
    }
  ]
};

const defaultProps = {
  index: 0,
  name: 'users[0]',
  isHF: false,
  isEdit: false,
  isProfile: false,
  autoFetched: [false],
  villagesLoading: false,
  villages: [[]],
  isError: () => '',
  isChaUser: false,
  isChpUser: false,
  isActivating: false,
  communityList: [],
  isHFCreate: false,
  showVillages: true
};

const renderWithForm = (
  props: Partial<typeof defaultProps> = {},
  initialValues: Record<string, unknown> = defaultInitialValues
) => {
  return render(
    <Form onSubmit={() => {}} initialValues={initialValues}>
      {({ form }) => <DynamicCHForm {...defaultProps} {...props} form={form} />}
    </Form>
  );
};

describe('DynamicCHForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsCHPCHWSelected.mockReturnValue(false);
    mockDispatch.mockImplementation((action: any) => action);
  });

  it('returns null when showVillages is false', () => {
    const { container } = renderWithForm({ showVillages: false });
    expect(container.firstChild).toBeNull();
  });

  it('renders Assigned Villages field when showVillages is true', () => {
    renderWithForm();
    expect(screen.getByText('Assigned Villages')).toBeInTheDocument();
  });

  it('does not render Existing Villages when mandatoryVillages is empty', () => {
    renderWithForm();
    expect(screen.queryByText('Existing Villages')).not.toBeInTheDocument();
  });

  it('renders Existing Villages when autoFetched[index] is true and mandatoryVillages has items', () => {
    const initialValues = {
      users: [
        {
          existingVillages: [{ id: 1, name: 'Village A' }],
          selectedVillages: [],
          healthfacility: {},
          selectedRoles: []
        }
      ]
    };
    renderWithForm({ autoFetched: [true] }, initialValues);
    expect(screen.getByText('Existing Villages')).toBeInTheDocument();
  });

  it('renders Existing Villages when isEdit and isHF are true and mandatoryVillages has items', () => {
    const initialValues = {
      users: [
        {
          existingVillages: [{ id: 1, name: 'Village A' }],
          selectedVillages: [],
          healthfacility: {},
          selectedRoles: []
        }
      ]
    };
    renderWithForm({ isEdit: true, isHF: true }, initialValues);
    expect(screen.getByText('Existing Villages')).toBeInTheDocument();
  });

  it('does not render Community Unit when isChaUser is false', () => {
    renderWithForm();
    expect(screen.queryByText('Community Unit')).not.toBeInTheDocument();
  });

  it('renders Community Unit when isChaUser is true', () => {
    renderWithForm({ isChaUser: true });
    expect(screen.getByText('Community Unit')).toBeInTheDocument();
  });

  it('uses HFCreate column classes when isHFCreate is true', () => {
    const { container } = renderWithForm({ isHFCreate: true });
    const cols = container.querySelectorAll('.col-12.col-sm-6.col-lg-4');
    expect(cols.length).toBeGreaterThanOrEqual(1);
  });

  it('uses default column classes when isHFCreate is false', () => {
    const { container } = renderWithForm({ isHFCreate: false });
    const cols = container.querySelectorAll('.col-sm-6.col-12');
    expect(cols.length).toBeGreaterThanOrEqual(1);
  });

  it('renders both Assigned Villages and Community Unit when isChaUser is true', () => {
    renderWithForm({ isChaUser: true });
    expect(screen.getByText('Assigned Villages')).toBeInTheDocument();
    expect(screen.getByText('Community Unit')).toBeInTheDocument();
  });

  it('does not render Existing Villages when only isEdit is true but isHF is false and no mandatory villages', () => {
    renderWithForm({ isEdit: true, isHF: false });
    expect(screen.queryByText('Existing Villages')).not.toBeInTheDocument();
  });

  it('renders with correct index for form values', () => {
    const initialValues = {
      users: [
        { existingVillages: [], selectedVillages: [], healthfacility: {}, selectedRoles: [] },
        {
          existingVillages: [{ id: 2, name: 'Village B' }],
          selectedVillages: [],
          healthfacility: {},
          selectedRoles: []
        }
      ]
    };
    renderWithForm({ index: 1, name: 'users[1]', autoFetched: [false, true] }, initialValues);
    expect(screen.getByText('Assigned Villages')).toBeInTheDocument();
    expect(screen.getByText('Existing Villages')).toBeInTheDocument();
  });

  it('dispatches fetchSubVillagesRequest when there is exactly one village option (auto-fill case)', () => {
    const oneVillage = [{ id: 42, name: 'Single Village' }];
    renderWithForm(
      {
        villages: [oneVillage] as any,
        autoFetched: [false],
        isEdit: false,
        isHF: false
      },
      defaultInitialValues
    );
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockFetchSubVillagesRequest).toHaveBeenCalledWith(
      expect.objectContaining({ villageIds: [42] })
    );
  });

  it('renders Assigned Villages when isHFCreate is true and form has healthFacility.linkedVillages', () => {
    const linkedVillages = [{ id: 10, name: 'Linked Village A' }];
    const initialValues = {
      users: [
        {
          existingVillages: [],
          selectedVillages: [],
          healthfacility: {},
          selectedRoles: []
        }
      ],
      healthFacility: { linkedVillages }
    };
    renderWithForm(
      { isHFCreate: true, showVillages: true, villages: [[]] },
      initialValues as any
    );
    expect(screen.getByText('Assigned Villages')).toBeInTheDocument();
  });

  it('does not cause infinite re-renders when isHFCreate is false (uses stable EMPTY_VILLAGES)', () => {
    const initialValues = {
      users: [
        {
          existingVillages: [],
          selectedVillages: [],
          healthfacility: {},
          selectedRoles: []
        }
      ]
    };
    const { unmount } = renderWithForm(
      { isHFCreate: false, showVillages: true },
      initialValues as any
    );
    expect(screen.getByText('Assigned Villages')).toBeInTheDocument();
    unmount();
  });
});
