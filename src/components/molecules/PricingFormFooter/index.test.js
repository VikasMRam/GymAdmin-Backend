import React from 'react';
import { shallow } from 'enzyme';

import PricingFormFooter from 'sly/components/molecules/PricingFormFooter';

const price = 4200;
const renderedPrice = '$4,200';
const wrap = (props = {}) => shallow(<PricingFormFooter price={price} {...props} />);

describe('PricingFormFooter', () => {
  it('renders', () => {
    const wrapper = wrap();
    expect(wrapper.find('PreferenceWrapper').dive().find('Styled(NumberFormat)').dive()
      .dive()
      .text()).toContain(renderedPrice);
    expect(wrapper.find('Styled(Button)').dive().dive().dive()
      .text()).toContain('Continue');
  });

  it('renders with isFinalStep', () => {
    const wrapper = wrap({ isFinalStep: true });
    expect(wrapper.find('PreferenceWrapper').dive().find('Styled(NumberFormat)').dive()
      .dive()
      .text()).toContain(renderedPrice);
    expect(wrapper.find('Styled(Button)').dive().dive().dive()
      .text()).toContain('Send Pricing Request');
  });

  it('onProgressClick is called', () => {
    const onProgressClick = jest.fn();
    const wrapper = wrap({ onProgressClick });
    wrapper.find('Styled(Button)').simulate('click');
    expect(onProgressClick).toHaveBeenCalled();
  });

  it('renders when isButtonDisabled', () => {
    const wrapper = wrap({ isButtonDisabled: true });
    expect(wrapper.find('Styled(Button)').at(0).props().disabled).toBe(true);
  });
});
