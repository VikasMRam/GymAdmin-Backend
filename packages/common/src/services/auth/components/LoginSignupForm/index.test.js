import React from 'react';
import { shallow } from 'enzyme';

import LoginForm from '.';

import { AGENT_ND_ROLE } from 'sly/common/constants/roles';

const handleSubmit = jest.fn();
const onFacebookLoginClick = jest.fn();
const onGoogleLoginClick = jest.fn();
const defaultProps = {
  handleSubmit,
  onFacebookLoginClick,
  onGoogleLoginClick,
};
const wrap = (props = {}) => shallow(<LoginForm {...defaultProps} {...props} />);

describe('LoginSignupForm|Web', () => {
  it('does not render children when passed in', () => {
    const wrapper = wrap({ childred: 'test' });
    expect(wrapper.contains('test')).toBeFalsy();
  });

  it('renders', () => {
    const wrapper = wrap();

    expect(wrapper.find('Field').filter({ name: 'email' })).toHaveLength(1);
    expect(wrapper.find('Button')).toHaveLength(1);
    expect(wrapper.find('Block[direction="row"]')).toHaveLength(1);
  });


  it('renders error', () => {
    const error = 'error';
    const wrapper = wrap({ error });
    const errors = wrapper.find('Block').first();

    expect(wrapper.find('Button')).toHaveLength(1);
    expect(wrapper.find('IconButton')).toHaveLength(2);
    expect(errors.contains(error)).toBeTruthy();
  });

  it('handles submit', () => {
    const handleSubmit = jest.fn();
    const wrapper = wrap({ handleSubmit });

    wrapper.find('Form').simulate('submit');
    expect(handleSubmit).toHaveBeenCalled();
  });


  // No longer applicable
  // it('handles onRegisterClick', () => {
  //   const onRegisterClick = jest.fn();
  //   const wrapper = wrap({ onRegisterClick });

  //   wrapper.find('Block').find('ButtonLink').simulate('click');
  //   expect(onRegisterClick).toHaveBeenCalled();
  // });

  // No long applicable
  // it('renders correct footer for CUSTOMER_ROLE', () => {
  //   const wrapper = wrap();

  //   expect(wrapper.find('Block').find('Block').contains("Don't have an account?")).toBeTruthy();
  //   expect(wrapper.find('Block').find('ButtonLink').contains('Sign up')).toBeTruthy();
  // });

  it('handles google signup', () => {
    const onGoogleLoginClick = jest.fn();
    const wrapper = wrap({ onGoogleLoginClick });
    wrapper.find('IconButton').at(1).simulate('click');
    expect(onGoogleLoginClick).toHaveBeenCalled();
  });


  it('handles facebook signup', () => {
    const onFacebookLoginClick = jest.fn();
    const wrapper = wrap({ onFacebookLoginClick });
    wrapper.find('IconButton').at(0).simulate('click');
    expect(onFacebookLoginClick).toHaveBeenCalled();
  });

  it('renders correct footer for AGENT_ND_ROLE', () => {
    const wrapper = wrap({
      role: AGENT_ND_ROLE,
    });

    expect(wrapper.find('Block').children()).toHaveLength(1);
    expect(wrapper.find('Block').find('ButtonLink').contains('Register for an account')).toBeTruthy();
  });
});