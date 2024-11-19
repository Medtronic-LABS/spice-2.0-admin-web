import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import RegionCustomization, { findCurrentFormType, FormTypes } from '../RegionCustomization';

jest.mock('../../assets/images/edit.svg', () => ({
  ReactComponent: 'editSvg'
}));

describe('RegionCustomization', () => {
  const renderComponent = () =>
    render(
      <Router>
        <RegionCustomization />
      </Router>
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
