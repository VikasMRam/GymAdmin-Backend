import React from 'react';
import { mount } from 'enzyme';

import Input from 'sly/web/components/atoms/Input';

const wrap = (props = {}) => mount(<Input {...props} />);

describe('Input', () => {
  it('renders props when passed in', () => {
    const wrapper = wrap({ type: 'text' });
    expect(wrapper.find('input[type="text"]')).toHaveLength(1);
  });

  it('renders input by default', () => {
    const wrapper = wrap();
    expect(wrapper.find('input')).toHaveLength(1);
  });

  it('renders select when type is select', () => {
    const wrapper = wrap({ type: 'select' });
    expect(wrapper.find('select')).toHaveLength(1);
  });

  it('renders textarea when type is textarea', () => {
    const wrapper = wrap({ type: 'textarea' });
    expect(wrapper.find('textarea')).toHaveLength(1);
  });
});