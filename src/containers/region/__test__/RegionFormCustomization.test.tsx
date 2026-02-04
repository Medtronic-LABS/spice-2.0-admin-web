import { screen } from '@testing-library/react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import RegionFormCustomization from '../RegionFormCustomization';

const mockStore = configureMockStore([]);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    tenantId: '123',
    regionId: '456',
    form: 'test'
  }),
  useHistory: () => ({
    push: jest.fn()
  })
}));

describe('RegionFormCustomization', () => {
  let store: any;

  const initialState = {
    workflow: {
      loading: false,
      formJSON: {
        id: 1,
        formInput: JSON.stringify({
          formLayout: [
            { id: 'field1', name: 'Field 1', family: 'Family1' },
            { id: 'field2', name: 'Field 2', family: 'Family1' }
          ]
        })
      },
      formMeta: [
        { id: 1, name: 'Field1' },
        { id: 2, name: 'Field2' }
      ]
    },
    user: {
      user: {
        country: { id: 1, appTypes: [] },
        appTypes: []
      },
      cultureList: [
        { id: 1, name: 'English', appTypes: ['NON_COMMUNITY'] },
        { id: 2, name: 'Spanish', appTypes: ['COMMUNITY'] }
      ],
      cultureListLoading: false
    },
    common: {
      labelName: null
    }
  };

  const renderComponent = (customState = {}) => {
    store = mockStore({ ...initialState, ...customState });
    store.dispatch = jest.fn();
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <RegionFormCustomization />
        </BrowserRouter>
      </Provider>
    );
  };

  it('should render loader when loading is true', () => {
    renderComponent({
      workflow: {
        ...initialState.workflow,
        loading: true
      }
    });
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
