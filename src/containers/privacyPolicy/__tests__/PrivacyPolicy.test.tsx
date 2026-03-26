import { shallow } from 'enzyme';
import PrivacyPolicy from '../PrivacyPolicy';
import styles from './PrivacyPolicy.module.scss';

describe('PrivacyPolicy', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallow(<PrivacyPolicy />);
  });

  it('should render a div with the correct class name', () => {
    expect(wrapper.find('div').at(0).hasClass(styles.privacyContainer)).toBe(false);
  });

  it('should render a container div', () => {
    expect(wrapper.find('div.container').length).toBe(1);
  });

  it('should render a logo image with the correct props', () => {
    const logo = wrapper.find('img[alt="Medtronics"]');
    expect(logo.length).toBe(1);
    expect(logo.prop('alt')).toBe('Medtronics');
    expect(logo.prop('className')).toBe(styles.logo);
  });

  it('should render an h1 element with the correct class name and text', () => {
    const title = wrapper.find('h1');
    expect(title.hasClass(styles.privacyTitle)).toBe(false);
    expect(title.text()).toBe('Privacy Statement');
  });

  it('should render two h3 elements with the correct class name and text', () => {
    const headers = wrapper.find('h3');
    expect(headers.length).toBe(11);

    const firstHeader = headers.at(0);
    expect(firstHeader.hasClass(styles.privacyHeader)).toBe(false);
    expect(firstHeader.text()).toBe('Please read this privacy statement carefully.');

    const secondHeader = headers.at(1);
    expect(secondHeader.hasClass(styles.privacyHeader)).toBe(false);
    expect(secondHeader.text()).toBe('INTRODUCTION');
  });
});
