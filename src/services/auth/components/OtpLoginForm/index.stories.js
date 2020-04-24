import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { reduxForm } from 'redux-form';

import OtpLoginForm from 'sly/services/auth/components/OtpLoginForm/index';
import { withPreventDefault } from 'sly/services/helpers/forms';

const OtpLoginFormContainer = reduxForm({
  form: 'OtpLoginForm',
})(OtpLoginForm);

storiesOf('Organisms|OtpLoginForm', module)
  .add('default', () => (
    <OtpLoginFormContainer
      handleSubmit={withPreventDefault(action('form submitted'))}
      onResendCodeClick={action('onResendCodeClick clicked')}
      emailOrPhone="test@test.com"
    />
  ))
  .add('with phone', () => (
    <OtpLoginFormContainer
      handleSubmit={withPreventDefault(action('form submitted'))}
      onResendCodeClick={action('onResendCodeClick clicked')}
      emailOrPhone="12345678901"
    />
  ));