import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import RhodaGoldmanPlaza from 'sly/../private/storybook/sample-data/property-rhoda-goldman-plaza.json';
import PostConversionGreeting from 'sly/components/organisms/PostConversionGreetingForm';

const onReject = action('onReject');

storiesOf('Organisms|PostConversionGreeting', module)
  .add('default', () => (
    <PostConversionGreeting onReject={onReject} community={RhodaGoldmanPlaza} />
  ));
