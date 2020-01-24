import React from 'react';
import { shallow } from 'enzyme';

import LoginWithPasswordForm from 'sly/components/organisms/LoginWithPasswordForm';

const emailOrPhone = 'test@test.com';
const handleSubmit = jest.fn();
const defaultProps = {
  handleSubmit,
  emailOrPhone,
};

const wrap = (props = {}) => shallow(<LoginWithPasswordForm {...defaultProps} {...props} />);

describe('LoginWithPasswordForm', () => {
  it('does not render children when passed in', () => {
    const wrapper = wrap({ childred: 'test' });
    expect(wrapper.contains('test')).toBe(false);
  });

  it('renders', () => {
    const wrapper = wrap();
    const otpBlock = wrapper.find('PaddedBlock');

    expect(wrapper.find('Field').filter({ name: 'password' })).toHaveLength(1);
    expect(wrapper.find('FullWidthButton')).toHaveLength(2);
    expect(otpBlock).toHaveLength(1);
    expect(otpBlock.contains(emailOrPhone)).toBeTruthy();
  });

  it('renders error', () => {
    const error = 'error';
    const wrapper = wrap({ error });
    const errors = wrapper.find('Block');

    expect(wrapper.find('LargePaddedFullWidthButton')).toHaveLength(1);
    expect(errors).toHaveLength(1);
    expect(errors.at(0).dive().render().text()).toBe(error);
  });

  it('handles submit', () => {
    const handleSubmit = jest.fn();
    const wrapper = wrap({ handleSubmit });

    wrapper.find('form').simulate('submit');
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('handles onLoginWithOtpClick', () => {
    const onLoginWithOtpClick = jest.fn();
    const wrapper = wrap({ onLoginWithOtpClick });

    wrapper.find('FullWidthButton').at(1).simulate('click');
    expect(onLoginWithOtpClick).toHaveBeenCalled();
  });
});