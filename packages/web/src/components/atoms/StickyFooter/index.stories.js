import React from 'react';
import { storiesOf } from '@storybook/react';

import StickyFooter from 'sly/web/components/atoms/StickyFooter';

storiesOf('Atoms|StickyFooter', module)
  .add('default', () => <StickyFooter showInBigScreen>StickyFooter</StickyFooter>);