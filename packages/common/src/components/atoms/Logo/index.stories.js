import React from 'react';
import { storiesOf } from '@storybook/react';

import Logo from '.';

storiesOf('Common/Atoms/Logo', module)
  .add('default', () => <Logo />);
