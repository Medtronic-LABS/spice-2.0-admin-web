import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import DetailCard from '../DetailCard';

jest.mock('../../button/IconButton.svg', () => ({
  ReactComponent: 'IconButton'
}));

const mockStore = configureStore([]);
const defaultStoreState = {
  user: { user: { appTypes: [], country: {} } },
  common: { labelName: {} }
};

describe('DetailCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders header and children', () => {
    const headerText = 'Test Header';
    const childText = 'Test Child';
    const { unmount, getByText } = render(
      <DetailCard header={headerText}>
        <div>{childText}</div>
      </DetailCard>
    );
    expect(getByText(headerText)).toBeInTheDocument();
    expect(getByText(childText)).toBeInTheDocument();
    unmount();
  });

  it('renders searchbar and button', () => {
    const headerText = 'Test Header';
    const buttonLabel = 'Test Button';
    const onButtonClick = jest.fn();
    const onSearch = jest.fn();
    const onCustomClick = jest.fn();
    const customLabel = 'Test Custom Label';
    const { unmount, getByText, getByPlaceholderText } = render(
      <DetailCard
        header={headerText}
        buttonLabel={buttonLabel}
        onButtonClick={onButtonClick}
        onSearch={onSearch}
        isSearch={true}
        searchPlaceholder='Search Name'
        onCustomClick={onCustomClick}
        customLabel={customLabel}
      >
        <div>Test Child</div>
      </DetailCard>
    );
    const searchbar = getByPlaceholderText('Search Name');
    const button = getByText(buttonLabel);
    userEvent.type(searchbar, 'Test');
    userEvent.click(button);
    expect(onButtonClick).toHaveBeenCalled();
    unmount();
  });

  it('renders custom icon and label', () => {
    const headerText = 'Test Header';
    const customLabel = 'Test Custom Label';
    const customIcon = 'test-icon.png';
    const onCustomClick = jest.fn();
    const { unmount, getByAltText } = render(
      <DetailCard header={headerText} customLabel={customLabel} customIcon={customIcon} onCustomClick={onCustomClick}>
        <div>Test Child</div>
      </DetailCard>
    );
    const icon = getByAltText('custom-icon');
    userEvent.click(icon);
    expect(onCustomClick).toHaveBeenCalled();
    unmount();
  });

  it('renders custom icon button with null handler', () => {
    const headerText = 'Test Header';
    const customLabel = 'Test Custom Label';
    const onCustomClick = jest.fn();
    const { unmount, getByText } = render(
      <DetailCard header={headerText} customLabel={customLabel} onCustomClick={onCustomClick}>
        <div>Test Child</div>
      </DetailCard>
    );

    const customButton = getByText(customLabel);
    userEvent.click(customButton);
    expect(onCustomClick).toHaveBeenCalled();
    unmount();
  });

  it('renders filter component with onFilterData and isFilter false ', () => {
    const headerText = 'Test Header';
    const onFilterData = [
      {
        id: 1,
        name: 'Test Name',
        isSearchable: true,
        isFacility: true,
        data: [],
        isShow: true,
        filterCount: 1
      }
    ];
    const { unmount, getByText } = render(
      <DetailCard header={headerText} isFilter={false} onFilterData={onFilterData}>
        <div>Test Child</div>
      </DetailCard>
    );
    expect(getByText('Test Child')).toBeInTheDocument();
    unmount();
  });

  it('accepts updatedFilterData with number arrays for districtIds and chiefdomIds', () => {
    const store = mockStore(defaultStoreState);
    const headerText = 'Test Header';
    const updatedFilterData = {
      districtIds: [1, 2],
      chiefdomIds: [10, 20]
    };
    const onFilterData = [
      {
        id: 1,
        name: 'District',
        key: 'districtIds',
        isSearchable: true,
        isFacility: false,
        isGeneric: true,
        data: [],
        isShow: true
      },
      {
        id: 2,
        name: 'Chiefdom',
        key: 'chiefdomIds',
        isSearchable: true,
        isFacility: false,
        isGeneric: true,
        data: [],
        isShow: true
      }
    ];
    const onChange = jest.fn();
    const { unmount, getByText } = render(
      <Provider store={store}>
        <DetailCard
          header={headerText}
          isFilter={true}
          onFilterData={onFilterData}
          updatedFilterData={updatedFilterData}
          onChange={onChange}
        >
          <div>Test Child</div>
        </DetailCard>
      </Provider>
    );
    expect(getByText('Test Child')).toBeInTheDocument();
    unmount();
  });

  it('wraps search bar and filters in a flex container when both are present', () => {
    const store = mockStore(defaultStoreState);
    const headerText = 'Test Header';
    const { unmount, container } = render(
      <Provider store={store}>
        <DetailCard
          header={headerText}
          isSearch={true}
          isFilter={true}
          onSearch={jest.fn()}
          searchPlaceholder='Search'
          onFilterData={[{ id: 1, name: 'Filter', isSearchable: false, isFacility: false, data: [], isShow: true }]}
        >
          <div>Test Child</div>
        </DetailCard>
      </Provider>
    );
    const flexDiv = container.querySelector('.d-flex');
    expect(flexDiv).toBeInTheDocument();
    unmount();
  });
});
