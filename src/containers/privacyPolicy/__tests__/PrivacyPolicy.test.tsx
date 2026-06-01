import React from 'react';
import { render, screen } from '@testing-library/react';
import PrivacyPolicy from '../PrivacyPolicy';
import styles from './PrivacyPolicy.module.scss';

describe('PrivacyPolicy', () => {
  it('should render a div with the correct class name', () => {
    const { container } = render(<PrivacyPolicy />);

    expect(container.firstChild).toHaveClass(styles.privacyContainer);
  });

  it('should render a container div', () => {
    const { container } = render(<PrivacyPolicy />);

    expect(container.querySelector('div.container')).toBeInTheDocument();
  });

  it('should render a logo image with the correct props', () => {
    render(<PrivacyPolicy />);

    const logo = screen.getByAltText('Medtronics');

    expect(logo.tagName).toBe('IMG');
    expect(logo).toHaveClass(styles.logo);
  });

  it('should render an h1 element with the correct class name and text', () => {
    render(<PrivacyPolicy />);

    const title = screen.getByRole('heading', { level: 1, name: 'Privacy Statement' });

    expect(title).toHaveClass(styles.privacyTitle);
  });

  it('should render two h3 elements with the correct class name and text', () => {
    render(<PrivacyPolicy />);

    const headers = screen.getAllByRole('heading', { level: 3 });

    expect(headers).toHaveLength(11);
    expect(headers[0]).toHaveClass(styles.privacyHeader);
    expect(headers[0]).toHaveTextContent('Please read this privacy statement carefully.');
    expect(headers[1]).toHaveClass(styles.privacyHeader);
    expect(headers[1]).toHaveTextContent('INTRODUCTION');
  });
});
