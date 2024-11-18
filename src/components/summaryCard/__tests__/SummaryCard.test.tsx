import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SummaryCard from '../SummaryCard';
import SUMMARY_CARD_CONSTANTS from '../../../tests/mockData/summaryCardConstants';

jest.mock('../../../assets/images/arrow-right-small.svg', () => ({
  ReactComponent: 'ArrowRight'
}));

describe('SummaryCard component', () => {
  const props = SUMMARY_CARD_CONSTANTS.SUMMARY_CARD_PROPS;

  const renderSummaryCard = (componentProps = props) => {
    return render(
      <Router>
        <SummaryCard {...componentProps} />
      </Router>
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
});
