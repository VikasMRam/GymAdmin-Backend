import React from 'react';
import { shallow } from 'enzyme';

import CommunityPricing from 'sly/web/components/molecules/CommunityPricing';

const defaultProps = {
  id: 'abc',
  estimated: false,
  price: 4300,
};

const wrap = (props = {}) =>
  shallow(<CommunityPricing {...defaultProps} {...props} />);

describe('CommunityPricing', () => {
  it('does not renders children when passed in', () => {
    const wrapper = wrap();

    expect(wrapper.contains('test')).toBeFalsy();
  });

  it('renders price and fixed rating', () => {
    const wrapper = wrap();

    expect(wrapper.find('StyledCommunityPricingWrapper Block').text()).toEqual('$4,300/month');
  });
});