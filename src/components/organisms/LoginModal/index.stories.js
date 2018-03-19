import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { LoginModal } from 'sly/components';

storiesOf('Organisms|LoginModal', module).add('default', () => (
  <LoginModal
    onFacebookLogin={action('facebook')}
    onGoogleLogin={action('google')}
    onClose={action('closed')}
    isOpen
  />
));
