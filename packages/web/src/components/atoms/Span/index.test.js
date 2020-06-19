import React from 'react';
import { shallow } from 'enzyme';

import Span from 'sly/web/components/atoms/Span';

const wrap = (props = {}) => shallow(<Span {...props} />);

describe('Span', () => {
  it('renders children when passed in', () => {
    const wrapper = wrap({ children: 'test' });
    expect(wrapper.contains('test')).toBe(true);
  });

  it('renders props when passed in', () => {
    const wrapper = wrap({ id: 'foo' });
    expect(wrapper.find({ id: 'foo' })).toHaveLength(1);
  });
});