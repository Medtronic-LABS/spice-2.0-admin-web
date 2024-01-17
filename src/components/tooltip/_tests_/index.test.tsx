import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import CustomTooltip from '../index';

describe('CustomTooltip', () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(<CustomTooltip title='test tooltip'>Test Content</CustomTooltip>);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders children', () => {
    expect(wrapper.find('div').text()).toBe('Test Content');
  });
});
