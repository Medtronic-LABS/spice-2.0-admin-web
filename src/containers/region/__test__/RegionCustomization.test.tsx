import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import RegionCustomization, { findCurrentFormType, FormTypes } from '../RegionCustomization';

jest.mock('../../../assets/images/edit.svg', () => ({
  ReactComponent: () => <svg data-testid='edit-icon' />
}));

const mockStore = configureStore([]);

describe('RegionCustomization', () => {
  const store = mockStore({
    user: {
      user: {
        country: { id: 1, appTypes: [] },
        appTypes: []
      }
    },
    common: {
      labelName: null
    }
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <Router>
          <RegionCustomization />
        </Router>
      </Provider>
    );
  it('should render the RegionCustomization component', () => {
    renderComponent();
    expect(screen.getByText('Region Customization')).toBeInTheDocument();
  });
  it('should return FormTypes.Screening for index 0', () => {
    expect(findCurrentFormType(0)).toBe(FormTypes.Screening);
  });

  it('should return FormTypes.Enrollment for index 1', () => {
    expect(findCurrentFormType(1)).toBe(FormTypes.Enrollment);
  });

  it('should return FormTypes.Assessment for index 2', () => {
    expect(findCurrentFormType(2)).toBe(FormTypes.Assessment);
  });

  it('should return an empty string for any other index', () => {
    expect(findCurrentFormType(-1)).toBe('');
    expect(findCurrentFormType(3)).toBe('');
    expect(findCurrentFormType(100)).toBe('');
  });
});
