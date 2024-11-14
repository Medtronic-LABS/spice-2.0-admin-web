import { render, screen } from '@testing-library/react';
import CustomTooltip from '../index';

describe('CustomTooltip', () => {
  it('renders children', () => {
    render(<CustomTooltip title='test tooltip'>Test Content</CustomTooltip>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
