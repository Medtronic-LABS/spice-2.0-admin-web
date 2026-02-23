import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import AssignSSUsersSection, { DEFAULT_SS_USER_ROW } from '../AssignSSUsersSection';

jest.mock('../../assets/images/bin.svg', () => ({ ReactComponent: () => <span data-testid="bin-icon" /> }));
jest.mock('../../assets/images/plus_blue.svg', () => ({ ReactComponent: () => <span data-testid="plus-icon" /> }));

jest.mock('react-redux', () => ({
  useSelector: jest.fn((selector: (state: any) => any) => {
    const mockState = {
      region: { 
        subVillages: [],
        subVillagesLoading: false
      },
      healthFacility: {
        ssPrefixList: [
          { id: 1, name: 'SS01', displayOrder: 1 },
          { id: 2, name: 'SS02', displayOrder: 2 }
        ],
        ssPrefixLoading: false,
        shasthyaShebikaByKormiId: {}
      }
    };
    return selector(mockState);
  })
}));

jest.mock('../../../hooks/appTypeBasedConfigs', () => ({
  __esModule: true,
  default: () => ({
    subVillage: { s: 'Sub Village', p: 'Sub Villages' }
  })
}));

jest.mock('../../formFields/SelectInput', () => ({
  __esModule: true,
  default: ({ label, disabled }: any) => (
    <div data-testid="select-input" data-disabled={disabled}>
      {label}
    </div>
  )
}));

jest.mock('../../formFields/TextInput', () => ({
  __esModule: true,
  default: ({ label, disabled }: any) => (
    <div data-testid="text-input" data-disabled={disabled}>
      {label}
    </div>
  )
}));

jest.mock('../../formFields/PhoneNumber', () => ({
  __esModule: true,
  default: ({ disabled }: any) => (
    <div data-testid="phone-number-field" data-disabled={disabled}>
      Phone Number
    </div>
  )
}));

jest.mock('../../multiSelect/MultiSelect', () => ({
  __esModule: true,
  default: ({ label, isDisabled }: any) => (
    <div data-testid="multi-select" data-disabled={isDisabled}>
      {label}
    </div>
  )
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

const renderWithForm = (
  initialValues: Record<string, unknown> = initialValuesWithShastiyaKormi,
  isEdit?: boolean
) => {
  return render(
    <Form onSubmit={() => {}} initialValues={initialValues} mutators={{ ...arrayMutators }}>
      {() => <AssignSSUsersSection isEdit={isEdit} />}
    </Form>
  );
};

describe('AssignSSUsersSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('DEFAULT_SS_USER_ROW', () => {
    it('should have expected shape with ssId, name, phoneNumber and subVillages', () => {
      expect(DEFAULT_SS_USER_ROW).toEqual({
        ssId: null,
        name: '',
        phoneNumber: '',
        subVillages: null
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

  describe('isEdit mode', () => {
    it('should not show Add row or Remove row controls when isEdit is true', () => {
      renderWithForm(initialValuesWithShastiyaKormi, true);
      expect(screen.queryByTestId('plus-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('bin-icon')).not.toBeInTheDocument();
    });

    it('should show Add row control when isEdit is false', () => {
      renderWithForm(initialValuesWithShastiyaKormi, false);
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
    });

    it('should show Add row control when isEdit is omitted (default)', () => {
      renderWithForm(initialValuesWithShastiyaKormi);
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
    });

    it('should disable SS ID, Name, Phone Number, and Sub-village when isEdit is true', () => {
      renderWithForm(initialValuesWithShastiyaKormi, true);
      const selectInputs = screen.getAllByTestId('select-input');
      const textInputs = screen.getAllByTestId('text-input');
      const phoneFields = screen.getAllByTestId('phone-number-field');
      const multiSelects = screen.getAllByTestId('multi-select');
      selectInputs.forEach(el => expect(el).toHaveAttribute('data-disabled', 'true'));
      textInputs.forEach(el => expect(el).toHaveAttribute('data-disabled', 'true'));
      phoneFields.forEach(el => expect(el).toHaveAttribute('data-disabled', 'true'));
      multiSelects.forEach(el => expect(el).toHaveAttribute('data-disabled', 'true'));
    });

    it('should not disable fields when isEdit is false', () => {
      renderWithForm(initialValuesWithShastiyaKormi, false);
      const selectInput = screen.getByTestId('select-input');
      const textInput = screen.getByTestId('text-input');
      const phoneField = screen.getByTestId('phone-number-field');
      const multiSelect = screen.getByTestId('multi-select');
      expect(selectInput).toHaveAttribute('data-disabled', 'false');
      expect(textInput).toHaveAttribute('data-disabled', 'false');
      expect(phoneField).toHaveAttribute('data-disabled', 'false');
      expect(multiSelect).toHaveAttribute('data-disabled', 'false');
    });
  });
});
