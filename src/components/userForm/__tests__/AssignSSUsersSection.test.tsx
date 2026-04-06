import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Form, FormSpy } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import AssignSSUsersSection, { DEFAULT_SS_USER_ROW, getFilteredSubVillageOptionsForIndex } from '../AssignSSUsersSection';

jest.mock('../../assets/images/bin.svg', () => ({ ReactComponent: () => <span data-testid='bin-icon' /> }));
jest.mock('../../assets/images/plus_blue.svg', () => ({ ReactComponent: () => <span data-testid='plus-icon' /> }));

const defaultMockState = {
  region: {
    subVillages: [] as any[],
    subVillagesLoading: false
  },
  healthFacility: {
    ssPrefixList: [
      { id: 1, name: 'SS01', displayOrder: 1 },
      { id: 2, name: 'SS02', displayOrder: 2 }
    ] as any[],
    ssPrefixLoading: false,
    shasthyaShebikaByKormiId: {} as Record<string, any[]>
  }
};

jest.mock('react-redux', () => ({
  useSelector: jest.fn((selector: (state: any) => any) => selector(defaultMockState))
}));

jest.mock('../../../hooks/appTypeBasedConfigs', () => ({
  __esModule: true,
  default: () => ({
    subVillage: { s: 'Sub Village', p: 'Sub Villages' }
  })
}));

jest.mock('../../formFields/SelectInput', () => ({
  __esModule: true,
  default: ({ label, disabled, placeholder }: any) => (
    <div data-testid='select-input' data-disabled={disabled}>
      {label}
      {placeholder && <span data-testid='select-placeholder'>{placeholder}</span>}
    </div>
  )
}));

jest.mock('../../formFields/TextInput', () => ({
  __esModule: true,
  default: ({ label, disabled }: any) => (
    <div data-testid='text-input' data-disabled={disabled}>
      {label}
    </div>
  )
}));

jest.mock('../../formFields/PhoneNumber', () => ({
  __esModule: true,
  default: ({ disabled }: any) => (
    <div data-testid='phone-number-field' data-disabled={disabled}>
      Phone Number
    </div>
  )
}));

jest.mock('../../formFields/Checkbox', () => ({
  __esModule: true,
  default: ({ disabled, switchCheckbox, ...props }: any) => (
    <input data-testid='active-switch' type='checkbox' disabled={disabled} {...props} />
  )
}));

const mockMultiSelectCalls: any[] = [];
jest.mock('../../multiSelect/MultiSelect', () => ({
  __esModule: true,
  default: (props: any) => {
    mockMultiSelectCalls.push(props);
    const { label, isDisabled, placeholder } = props;
    return (
      <div data-testid='multi-select' data-disabled={isDisabled}>
        {label}
        {placeholder && <span data-testid='multi-select-placeholder'>{placeholder}</span>}
      </div>
    );
  }
}));

const initialValuesWithShastiyaKormi = {
  users: [
    {
      id: 100,
      role: { id: 81, name: 'SHASTIYA_KORMI', displayName: 'Shastiya Kormi' }
    }
  ],
  ssUsers: [{ ...DEFAULT_SS_USER_ROW }]
};

const initialValuesWithoutShastiyaKormi = {
  users: [
    {
      id: 1,
      role: { id: 2, name: 'CHW', displayName: 'Community Health Worker' }
    }
  ]
};

const FormValuesProbe = () => {
  return (
    <FormSpy subscription={{ values: true }}>
      {({ values }) => {
        const firstSSUser = (values as any)?.ssUsers?.[0] ?? {};
        return (
          <div data-testid='form-values-probe'>
            <span data-testid='first-ss-user-ss-id'>{firstSSUser.ssId?.name ?? ''}</span>
            <span data-testid='first-ss-user-ss-id-value'>{firstSSUser.ssId?.id ?? ''}</span>
            <span data-testid='first-ss-user-sub-village-count'>{String((firstSSUser.subVillages ?? []).length)}</span>
            <span data-testid='first-ss-user-is-active'>{String(firstSSUser.isActive)}</span>
          </div>
        );
      }}
    </FormSpy>
  );
};

const renderWithForm = (
  initialValues: Record<string, unknown> = initialValuesWithShastiyaKormi,
  isEdit = false
) => {
  return render(
    <Form onSubmit={jest.fn()} initialValues={initialValues} mutators={{ ...arrayMutators }}>
      {() => (
        <>
          <AssignSSUsersSection isEdit={isEdit} />
          <FormValuesProbe />
        </>
      )}
    </Form>
  );
};

const resetMockState = () => {
  defaultMockState.region.subVillages = [];
  defaultMockState.region.subVillagesLoading = false;
  defaultMockState.healthFacility.ssPrefixList = [
    { id: 1, name: 'SS01', displayOrder: 1 },
    { id: 2, name: 'SS02', displayOrder: 2 }
  ];
  defaultMockState.healthFacility.ssPrefixLoading = false;
  defaultMockState.healthFacility.shasthyaShebikaByKormiId = {};
};

describe('AssignSSUsersSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetMockState();
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector: (state: any) => any) => selector(defaultMockState));
  });

  describe('DEFAULT_SS_USER_ROW', () => {
    it('should have expected shape with ssId, name, phoneNumber, subVillages and isActive', () => {
      expect(DEFAULT_SS_USER_ROW).toEqual({
        ssId: null,
        name: '',
        phoneNumber: '',
        subVillages: null,
        isActive: true
      });
    });
  });

  describe('visibility based on role', () => {
    it('should return null when users[0].role is not SHASTIYA_KORMI', () => {
      const { container } = renderWithForm(initialValuesWithoutShastiyaKormi);
      expect(screen.queryByText('Assign Shasthya Shebika Users')).not.toBeInTheDocument();
      expect(container.querySelector('[data-testid="select-input"]')).not.toBeInTheDocument();
    });

    it('should render section when users[0].role is SHASTIYA_KORMI (single role object)', () => {
      renderWithForm(initialValuesWithShastiyaKormi);
      expect(screen.getByText('Assign Shasthya Shebika Users')).toBeInTheDocument();
    });

    it('should render section when users[0].role is array containing SHASTIYA_KORMI', () => {
      const initialValues = {
        users: [
          {
            id: 1,
            role: [
              { id: 2, name: 'CHW' },
              { id: 81, name: 'SHASTIYA_KORMI' }
            ]
          }
        ],
        ssUsers: []
      };
      renderWithForm(initialValues);
      expect(screen.getByText('Assign Shasthya Shebika Users')).toBeInTheDocument();
    });

    it('should not render when users[0].role is null', () => {
      const initialValues = {
        users: [{ id: 1, role: null }],
        ssUsers: []
      };
      const { container } = renderWithForm(initialValues);
      expect(screen.queryByText('Assign Shasthya Shebika Users')).not.toBeInTheDocument();
    });
  });

  describe('field rendering', () => {
    it('should render SS ID field when section is visible', () => {
      renderWithForm(initialValuesWithShastiyaKormi);
      expect(screen.getByText('SS ID')).toBeInTheDocument();
    });

    it('should render Name field when section is visible', () => {
      renderWithForm(initialValuesWithShastiyaKormi);
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('should render Phone Number field when section is visible', () => {
      renderWithForm(initialValuesWithShastiyaKormi);
      expect(screen.getByText('Phone Number')).toBeInTheDocument();
    });

    it('should render Sub Village label when section is visible', () => {
      renderWithForm(initialValuesWithShastiyaKormi);
      expect(screen.getByText('Sub Village')).toBeInTheDocument();
    });

    it('should render Sub Village field as optional (required=false)', () => {
      mockMultiSelectCalls.length = 0;
      renderWithForm(initialValuesWithShastiyaKormi);
      const subVillageMultiSelectCall = mockMultiSelectCalls.find((c: any) => c.label === 'Sub Village');
      expect(subVillageMultiSelectCall).toBeDefined();
      expect(subVillageMultiSelectCall.required).toBe(false);
    });

    it('should render at least one row of fields by default', () => {
      renderWithForm(initialValuesWithShastiyaKormi);
      expect(screen.getByText('SS ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('should show Add row control (plus icon) when section is visible', () => {
      renderWithForm(initialValuesWithShastiyaKormi);
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
    });
  });

  describe('structure', () => {
    it('should render section with expected heading class', () => {
      renderWithForm(initialValuesWithShastiyaKormi);
      const heading = screen.getByText('Assign Shasthya Shebika Users');
      expect(heading).toHaveClass('fw-bold', 'theme-text');
    });
  });

  describe('add/remove row and field state', () => {
    it('should show Add row control when section is visible', () => {
      renderWithForm(initialValuesWithShastiyaKormi);
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
    });

    it('should not disable SS ID, Name, Phone Number, and Sub-village by default', () => {
      renderWithForm(initialValuesWithShastiyaKormi);
      const selectInput = screen.getByTestId('select-input');
      const textInput = screen.getByTestId('text-input');
      const phoneField = screen.getByTestId('phone-number-field');
      const multiSelect = screen.getByTestId('multi-select');
      expect(selectInput).not.toHaveAttribute('data-disabled', 'true');
      expect(textInput).not.toHaveAttribute('data-disabled', 'true');
      expect(phoneField).not.toHaveAttribute('data-disabled', 'true');
      expect(multiSelect).not.toHaveAttribute('data-disabled', 'true');
    });
  });

  describe('add / remove row', () => {
    it('should add a second row when Add row (plus icon) is clicked', async () => {
      renderWithForm(initialValuesWithShastiyaKormi);
      expect(screen.getAllByTestId('select-input')).toHaveLength(1);

      await act(async () => {
        fireEvent.click(screen.getByTestId('plus-icon'));
      });

      expect(screen.getAllByTestId('select-input')).toHaveLength(2);
      expect(screen.getAllByTestId('text-input')).toHaveLength(2);
    });

    it('should show Remove row control when there are multiple rows', async () => {
      renderWithForm(initialValuesWithShastiyaKormi);
      await act(async () => {
        fireEvent.click(screen.getByTestId('plus-icon'));
      });
      const removeButtons = screen.getAllByTitle('Remove row');
      expect(removeButtons.length).toBeGreaterThanOrEqual(1);
    });

    it('should remove a row when Remove row is clicked', async () => {
      renderWithForm(initialValuesWithShastiyaKormi);
      await act(async () => {
        fireEvent.click(screen.getByTestId('plus-icon'));
      });
      expect(screen.getAllByTestId('select-input')).toHaveLength(2);

      const removeButtons = screen.getAllByTitle('Remove row');
      await act(async () => {
        fireEvent.click(removeButtons[0]);
      });

      expect(screen.getAllByTestId('select-input')).toHaveLength(1);
    });
  });

  describe('loading states', () => {
    it('should pass loading state to SS ID field when ssPrefixLoading is true', () => {
      const useSelectorMock = require('react-redux').useSelector;
      useSelectorMock.mockImplementation((selector: (state: any) => any) => {
        const loadingState = {
          ...defaultMockState,
          healthFacility: { ...defaultMockState.healthFacility, ssPrefixLoading: true }
        };
        return selector(loadingState);
      });
      renderWithForm(initialValuesWithShastiyaKormi);
      expect(screen.getByText('Loading SS IDs...')).toBeInTheDocument();
    });

    it('should pass loading state to Sub Village field when subVillagesLoading is true', () => {
      const useSelectorMock = require('react-redux').useSelector;
      useSelectorMock.mockImplementation((selector: (state: any) => any) => {
        const loadingState = {
          ...defaultMockState,
          region: { ...defaultMockState.region, subVillagesLoading: true }
        };
        return selector(loadingState);
      });
      renderWithForm(initialValuesWithShastiyaKormi);
      expect(screen.getByText('Loading Sub Village...')).toBeInTheDocument();
    });
  });

  describe('sub-village filtering by active rows', () => {
    it('should ignore inactive rows when filtering sub-village options', () => {
      mockMultiSelectCalls.length = 0;
      defaultMockState.region.subVillages = [
        { id: 1, name: 'Village 1', assignedShasthyaShebikaId: null },
        { id: 2, name: 'Village 2', assignedShasthyaShebikaId: null }
      ];
      const initialValues = {
        users: initialValuesWithShastiyaKormi.users,
        ssUsers: [
          { ...DEFAULT_SS_USER_ROW, isActive: true, subVillages: [{ id: 1, name: 'Village 1' }] },
          { ...DEFAULT_SS_USER_ROW, isActive: false, subVillages: [{ id: 2, name: 'Village 2' }] }
        ]
      };

      renderWithForm(initialValues, true);

      const firstRowCall = mockMultiSelectCalls[0];
      const firstRowOptionIds = firstRowCall.options.map((opt: any) => opt.id);
      expect(firstRowOptionIds).toContain(2);
    });

    it('should include sub-villages assigned to SS users mapped for selected kormi', () => {
      const subVillagesList = [
        { id: 10, name: 'Unassigned Village', assignedShasthyaShebikaId: null },
        { id: 11, name: 'Assigned To Allowed SS', assignedShasthyaShebikaId: 602 },
        { id: 12, name: 'Assigned To Other SS', assignedShasthyaShebikaId: 700 }
      ];
      const filtered = getFilteredSubVillageOptionsForIndex(
        0,
        [{ ...DEFAULT_SS_USER_ROW, isActive: true, subVillages: [] }],
        subVillagesList,
        new Set([602])
      );
      const optionIds = filtered.map((opt: any) => opt.id);
      expect(optionIds).toContain(10);
      expect(optionIds).toContain(11);
      expect(optionIds).not.toContain(12);
    });

    it('should exclude assigned sub-villages when assigned SS is not in mapped set', () => {
      const subVillagesList = [
        { id: 21, name: 'Unassigned Village', assignedShasthyaShebikaId: null },
        { id: 22, name: 'Assigned To Unmapped SS', assignedShasthyaShebikaId: 999 }
      ];
      const filtered = getFilteredSubVillageOptionsForIndex(
        0,
        [{ ...DEFAULT_SS_USER_ROW, isActive: true, subVillages: [] }],
        subVillagesList,
        new Set([603])
      );
      const optionIds = filtered.map((opt: any) => opt.id);
      expect(optionIds).toContain(21);
      expect(optionIds).not.toContain(22);
    });
  });

  describe('isActive switch state', () => {
    it('should keep switch enabled even when SS ID and Name are empty', () => {
      renderWithForm(initialValuesWithShastiyaKormi, true);
      expect(screen.getByTestId('active-switch')).not.toBeDisabled();
    });

    it('should disable all row fields and action buttons when isActive is false', async () => {
      const initialValues = {
        users: initialValuesWithShastiyaKormi.users,
        ssUsers: [{ ...DEFAULT_SS_USER_ROW, isActive: false }]
      };
      renderWithForm(initialValues, true);

      const selectInputs = screen.getAllByTestId('select-input');
      const textInputs = screen.getAllByTestId('text-input');
      const phoneFields = screen.getAllByTestId('phone-number-field');
      const multiSelects = screen.getAllByTestId('multi-select');
      const addButtons = screen.getAllByTitle('Add row');

      expect(selectInputs[0]).toHaveAttribute('data-disabled', 'true');
      expect(textInputs[0]).toHaveAttribute('data-disabled', 'true');
      expect(phoneFields[0]).toHaveAttribute('data-disabled', 'true');
      expect(multiSelects[0]).toHaveAttribute('data-disabled', 'true');
      expect(addButtons[0]).toBeInTheDocument();
      expect(screen.queryByTitle('Remove row')).not.toBeInTheDocument();
      expect(screen.getByTestId('active-switch')).not.toBeDisabled();
    });

  });

  describe('initialization from shasthyaShebikaByKormiId', () => {
    it('should render section when user has shasthyaShebika list and form initializes ssUsers', () => {
      defaultMockState.healthFacility.shasthyaShebikaByKormiId = {
        '100': [
          {
            id: 555,
            ssId: 'SS01',
            name: 'Test SS User',
            phoneNumber: '+1234567890',
            subVillages: []
          }
        ]
      };
      const initialValues = {
        users: [{ id: 100, role: { id: 81, name: 'SHASTIYA_KORMI' } }],
        ssUsers: []
      };
      expect(() => renderWithForm(initialValues)).not.toThrow();
      expect(screen.getByText('Assign Shasthya Shebika Users')).toBeInTheDocument();
    });
  });
});
