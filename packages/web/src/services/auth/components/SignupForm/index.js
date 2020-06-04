import React from 'react';
import { func, bool, string } from 'prop-types';
import { Field } from 'redux-form';
import styled from 'styled-components';

import { size, palette } from 'sly/web/components/themes';
import pad from 'sly/web/components/helpers/pad';
import textAlign from 'sly/web/components/helpers/textAlign';
import ReduxField from 'sly/web/components/organisms/ReduxField';
import { Heading, Button, Block, Link } from 'sly/web/components/atoms';

const StyledHeading = pad(Heading);
StyledHeading.displayName = 'StyledHeading';

const StyledButton = styled(Button)`
  width: 100%;
  margin-bottom: ${size('spacing.small')};
`;

const StyledBlock = styled(Block)`
  color: ${palette('slate', 'filler')};
  font-size: ${size('text.tiny')};
  margin-bottom: ${size('spacing.large')};
`;

const StyledBlock2 = styled(Block)`
  margin-bottom: ${size('spacing.large')};
`;

const Login = textAlign(StyledBlock2);
Login.displayName = 'Log in';

const Provider = textAlign(StyledBlock2);
Provider.displayName = 'Provider';

const SignupForm = ({
  handleSubmit, submitting, error, onLoginClicked, onProviderClicked, heading,
}) => (
  <form onSubmit={handleSubmit}>
    <StyledHeading size="subtitle">{heading}</StyledHeading>
    <Field
      name="name"
      label="Full Name"
      type="text"
      placeholder="First and Last Name"
      component={ReduxField}
    />
    <Field
      name="email"
      label="Email Address"
      type="email"
      placeholder="Email Address"
      component={ReduxField}
    />
    <Field
      name="phone_number"
      label="Phone"
      type="phone"
      parens
      placeholder="(415) 555-5555"
      component={ReduxField}
    />
    <Field
      name="password"
      label="Password"
      type="password"
      placeholder="Password"
      component={ReduxField}
    />
    <StyledButton type="submit"  disabled={submitting}>
      Sign Up
    </StyledButton>
    <StyledBlock error={error}>By continuing, you agree to Seniorly&apos;s Terms of Use and Privacy Policy.</StyledBlock>
    {error && <Block palette="danger">{error}</Block>}
    <Login size="caption">
      Already have an account?{' '}
      <Link onClick={onLoginClicked}>Log in</Link>
    </Login>
    <Provider size="caption">
      Are you a community manager?{' '}
      <Link onClick={onProviderClicked}>Click here</Link>
    </Provider>
  </form>
);

SignupForm.propTypes = {
  handleSubmit: func.isRequired,
  submitting: bool,
  error: string,
  onLoginClicked: func,
  onProviderClicked: func,
  heading: string,
};

SignupForm.defaultProps = {
  heading: 'Sign Up',
};

export default SignupForm;
