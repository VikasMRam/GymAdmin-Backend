import React from 'react';

import ButtonLink from '.';

import renderWithTheme from 'sly/mobile/private/jest/renderWithTheme';

const wrap = (props = {}) => renderWithTheme(<ButtonLink {...props} />);

describe('ButtonLink|Mobile', () => {
  it('renders children when passed in', () => {
    const wrapper = wrap({ children: 'test' });
    expect(wrapper.queryByText('test')).toBeTruthy();
  });

  it('renders props when passed in', () => {
    const wrapper = wrap({ id: 'foo' });
    expect(wrapper.UNSAFE_getByProps({ id: 'foo' })).toBeTruthy();
  });

  it('renders icon passed in', () => {
    const wrapper = wrap({ icon: 'foo' });
    expect(wrapper.queryByTestID('Icon')).toBeTruthy();
  });
});
