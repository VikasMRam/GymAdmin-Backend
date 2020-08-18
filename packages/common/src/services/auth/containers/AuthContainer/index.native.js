// todo: temp file
import React, { Component } from 'react';
import { object, func, oneOf, string, bool } from 'prop-types';
import { connect } from 'react-redux';
import CookieManager from '@react-native-community/cookies';

import Wizard from './Wizard';

import { apiUrl } from 'sly/mobile/config';
import { authenticateCancel, authenticateSuccess } from 'sly/web/store/authenticated/actions';
import { withAuth } from 'sly/web/services/api';
import { Box, Block } from 'sly/common/components/atoms';
import { Wrapper } from 'sly/common/services/auth/components/Template';

const mapStateToProps = state => ({
  authenticated: state.authenticated,
});

@withAuth
@connect(mapStateToProps, {
  authenticateCancel,
  authenticateSuccess,
})

export default class AuthContainer extends Component {
  static propTypes = {
    authenticated: object,
    authenticateCancel: func.isRequired,
    authenticateSuccess: func.isRequired,
    onAuthenticateSuccess: func,
    onSignupSuccess: func,
    sendOtpCode: func.isRequired,
    type: oneOf(['modal', 'inline']).isRequired,
    initialStep: string.isRequired,
    signUpHeading: string,
    signUpSubmitButtonText: string,
    signUpHasPassword: bool.isRequired,
    hasProviderSignup: bool.isRequired,
    formName: string.isRequired,
  };

  static defaultProps = {
    type: 'modal',
    initialStep: 'Login',
    formName: 'AuthForm',
    signUpHasPassword: true,
    hasProviderSignup: true,
  };

  state = { isOpen: false };

  componentDidMount() {
    this.shouldAuth();
  }

  componentDidUpdate() {
    this.shouldAuth();
  }

  shouldAuth = () => {
    const {
      authenticated,
    } = this.props;

    if (!this.state.isOpen && authenticated.loggingIn) {
      this.setState({ isOpen: true });
    } else if (this.state.isOpen && !authenticated.loggingIn) {
      this.setState({ isOpen: false });
    }
  };

  handleAuthenticateSuccess = ({ headers }) => {
    const { onAuthenticateSuccess, authenticateSuccess } = this.props;

    if (headers['set-cookie']) {
      CookieManager.setFromResponse(
        apiUrl,
        headers['set-cookie'])
        .catch((error) => {
          console.log('Failed to set cookie.', error);
        });
    }

    // authenticateSuccess is not a promise, hence call success event callback immediately
    authenticateSuccess();
    if (onAuthenticateSuccess) {
      onAuthenticateSuccess();
    }
  };

  render() {
    const {
      authenticated, type, signUpHeading, signUpSubmitButtonText, signUpHasPassword, onSignupSuccess,
      hasProviderSignup, formName,
    } = this.props;
    let { initialStep } = this.props;

    if (authenticated.options && authenticated.options.register) {
      initialStep = 'Signup';
    }
    if (authenticated.options && authenticated.options.provider) {
      initialStep = 'ProviderSignup';
    }

    if (type === 'inline') {
      return (
        <Wrapper>
          <Box>
            <Wizard
              initialStep={initialStep}
              formName={formName}
              handleAuthenticateSuccess={this.handleAuthenticateSuccess}
              authenticated={authenticated}
              onSignupSuccess={onSignupSuccess}
              signUpHeading={signUpHeading}
              signUpSubmitButtonText={signUpSubmitButtonText}
              signUpHasPassword={signUpHasPassword}
              hasProviderSignup={hasProviderSignup}
            />
          </Box>
        </Wrapper>
      );
    }

    return (
      <Block paddingLeft="xLarge" paddingRight="xLarge" paddingBottom="xLarge">
        <Wizard
          initialStep={initialStep}
          formName={formName}
          handleAuthenticateSuccess={this.handleAuthenticateSuccess}
          authenticated={authenticated}
          onSignupSuccess={onSignupSuccess}
          signUpHeading={signUpHeading}
          signUpSubmitButtonText={signUpSubmitButtonText}
          signUpHasPassword={signUpHasPassword}
          hasProviderSignup={hasProviderSignup}
        />
      </Block>
    );
  }
}
