import React from 'react';
import { mount } from 'enzyme';

import IconButton from 'sly/web/components/molecules/IconButton';
import Notification from 'sly/web/components/molecules/Notification';

const wrap = (props = {}) => mount(<Notification {...props} />);

describe('Notification', () => {
  it('renders with default status', () => {
    const wrapper = wrap({ status: 'default', children: 'test children' });
    expect(wrapper.text()).toContain('test children');
  });

  it('renders with error status', () => {
    const wrapper = wrap({ status: 'error', children: 'test children' });
    expect(wrapper.text()).toContain('test children');
  });

  it('does not render close button for not closeable', () => {
    const wrapper = wrap({ status: 'default', closeable: false, children: 'test children' });
    expect(wrapper.find(IconButton)).toHaveLength(0);
  });

  it('onClose is called', () => {
    const onCloseSpy = jest.fn();
    const wrapper = wrap({ status: 'default', children: '', onClose: onCloseSpy });
    wrapper.find(IconButton).simulate('click');
    expect(onCloseSpy).toHaveBeenCalled();
  });
});