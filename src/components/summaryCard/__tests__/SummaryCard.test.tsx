import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SummaryCard from '../SummaryCard';
import SUMMARY_CARD_CONSTANTS from '../../../tests/mockData/summaryCardConstants';
import configureStore from 'redux-mock-store';
import APPCONSTANTS, { APP_TYPE } from '../../../constants/appConstants';
import { Provider } from 'react-redux';

jest.mock('../../../assets/images/arrow-right-small.svg', () => ({
  ReactComponent: 'ArrowRight'
}));

const { SUITE_ACCESS } = APPCONSTANTS;

const mockStore = configureStore();

const initialState = {
  user: {
    user: {
      email: 'test@example.com',
      userId: '123',
      suiteAccess: [SUITE_ACCESS.ADMIN],
      formDataId: '456',
      tenantId: '789',
      appTypes: [APP_TYPE.NON_COMMUNITY]
    }
  },
  common: {
    defaultValues: {
      region: {
        s: 'Region',
        p: 'Regions'
      },
      healthFacility: {
        s: 'Health Facility',
        p: 'Health Facilities'
      },
      district: {
        s: 'County',
        p: 'Counties'
      },
      chiefdom: { s: 'Sub County', p: 'Sub Counties' }
    }
  }
};
describe('SummaryCard component', () => {
  const props = SUMMARY_CARD_CONSTANTS.SUMMARY_CARD_PROPS;
  const store = mockStore(initialState);

  const renderSummaryCard = (componentProps = props, componentStore = store) => {
    return render(
      <Provider store={componentStore}>
        <Router>
          <SummaryCard {...componentProps} />
        </Router>
      </Provider>
    );
  };

  it('should render without errors', () => {
    const { container } = renderSummaryCard();
    expect(container).toBeInTheDocument();
  });

  it('should render a title and subtitle', () => {
    renderSummaryCard();
    expect(screen.getByText('Example Title')).toBeInTheDocument();
    expect(screen.getByText(/example subtitle/i)).toBeInTheDocument();
  });

  it('should render data elements', () => {
    renderSummaryCard();
    const summaryElements = screen.getAllByTestId('summary-elements');
    expect(summaryElements).toHaveLength(2);
  });

  it('should call onClick when data element is clicked', () => {
    renderSummaryCard();
    const summaryElement = screen.getAllByTestId('summary-elements')[0];

    fireEvent.click(summaryElement);
    expect(props.data[0].onClick).toHaveBeenCalled();
  });

  it('should call handleNavigation when move forward element is clicked', () => {
    renderSummaryCard();
    const moveForwardButton = screen.getByTestId('move-forward');

    fireEvent.click(moveForwardButton);
    expect(props.setBreadcrumbDetails).toHaveBeenCalled();
  });

  it('should call handleNavigation when move forward element is mouse leaved', () => {
    renderSummaryCard();
    const moveForwardButton = screen.getByTestId('move-forward');

    fireEvent.mouseLeave(moveForwardButton);
  });

  it('should render with img', () => {
    const { container } = renderSummaryCard({ ...props, img: 'test.png' });
    expect(container).toBeInTheDocument();
  });

  it('should render with isRegionDashboard', () => {
    const { container } = renderSummaryCard({ ...props, isRegionDashboard: true });
    expect(container).toBeInTheDocument();
  });

  it('should render with community appType', () => {
    const localStore = mockStore({
      ...initialState,
      user: {
        ...initialState.user,
        user: {
          ...initialState.user.user,
          appTypes: [APP_TYPE.COMMUNITY]
        }
      }
    });
    const { container } = renderSummaryCard(props, localStore);
    expect(container).toBeInTheDocument();
  });
});
