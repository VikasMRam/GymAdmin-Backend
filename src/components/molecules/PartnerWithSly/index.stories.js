import React from 'react';
import { storiesOf } from '@storybook/react';

import PartnerWithSly from 'sly/components/molecules/PartnerWithSly';

storiesOf('Molecules|PartnerWithSly', module)
  .add('default', () => (
    <PartnerWithSly />
  ));