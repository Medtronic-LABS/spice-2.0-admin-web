import React from 'react';
import { Form } from 'react-final-form';
import {
  Config,
  FieldConfig,
  FieldState,
  FieldSubscriber,
  FieldSubscription,
  FormApi,
  FormState,
  FormSubscriber,
  FormSubscription,
  Unsubscribe
} from 'final-form';
import ProgramForm from '../ProgramForm';
import { IProgramFormValues } from '../../../store/program/types';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { mount, ReactWrapper } from 'enzyme';

const mockStore = configureMockStore();

const mockFormApi: FormApi<{ program: IProgramFormValues }, Partial<{ program: IProgramFormValues }>> = {
  // tslint:disable-next-line:no-empty
  batch: () => {},
  // tslint:disable-next-line:no-empty
  blur: () => {},
  // tslint:disable-next-line:no-empty
  change: () => {},
  destroyOnUnregister: false,
  focus: (name: 'program'): void => {
    throw new Error('Function not implemented.');
  },
  initialize: (
    data:
      | Partial<{ program: IProgramFormValues }>
      | ((values: { program: IProgramFormValues }) => Partial<{ program: IProgramFormValues }>)
  ): void => {
    throw new Error('Function not implemented.');
  },
  isValidationPaused: (): boolean => {
    throw new Error('Function not implemented.');
  },
  getFieldState: <F extends 'program'>(field: F): FieldState<{ program: IProgramFormValues }[F]> | undefined => {
    throw new Error('Function not implemented.');
  },
  getRegisteredFields: (): string[] => {
    throw new Error('Function not implemented.');
  },
  getState: (): FormState<{ program: IProgramFormValues }, Partial<{ program: IProgramFormValues }>> => {
    throw new Error('Function not implemented.');
  },
  pauseValidation: (): void => {
    throw new Error('Function not implemented.');
  },
  registerField: <F extends 'program'>(
    name: F,
    subscriber: FieldSubscriber<{ program: IProgramFormValues }[F]>,
    subscription: FieldSubscription,
    config?: FieldConfig<{ program: IProgramFormValues }[F]> | undefined
  ): Unsubscribe => {
    throw new Error('Function not implemented.');
  },
  reset: (initialValues?: Partial<{ program: IProgramFormValues }> | undefined): void => {
    throw new Error('Function not implemented.');
  },
  resetFieldState: (name: 'program'): void => {
    throw new Error('Function not implemented.');
  },
  restart: (initialValues?: Partial<{ program: IProgramFormValues }> | undefined): void => {
    throw new Error('Function not implemented.');
  },
  resumeValidation: (): void => {
    throw new Error('Function not implemented.');
  },
  setConfig: <K extends keyof Config<object, object>>(
    name: K,
    value: Config<{ program: IProgramFormValues }, Partial<{ program: IProgramFormValues }>>[K]
  ): void => {
    throw new Error('Function not implemented.');
  },
  submit: (): Promise<{ program: IProgramFormValues } | undefined> | undefined => {
    throw new Error('Function not implemented.');
  },
  subscribe: (
    subscriber: FormSubscriber<{ program: IProgramFormValues }, Partial<{ program: IProgramFormValues }>>,
    subscription: FormSubscription
  ): Unsubscribe => {
    throw new Error('Function not implemented.');
  },
  mutators: {}
};
describe('ProgramForm', () => {
  const mockTenantId = 'mockTenantId';
  let wrapper: ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the form with the program name and site select fields', async () => {
    const store = mockStore({
      site: {
        siteDropdownOptions: {
          list: [
            {
              id: '12',
              name: 'name',
              tenantId: '1'
            }
          ],
          regionTenantId: '123'
        }
      },
      user: {
        user: { country: { id: 1, name: 'Test' } }
      },
      healthFacility: {
        healthFacilityList: []
      }
    });
    wrapper = mount(
      <Provider store={store}>
        <Form
          onSubmit={() => {
            //
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <ProgramForm form={mockFormApi} tenantId={mockTenantId} />
            </form>
          )}
        </Form>
      </Provider>
    );

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('input[name="program.name"]').exists()).toBe(true);
    expect(wrapper.find('[type="text"]').exists()).toBe(true);
  });
});
