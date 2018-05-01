import React from 'react';
import { storiesOf } from '@storybook/react';
import Tag from '.';

storiesOf('Atoms|Tag', module)
  .add('default', () => (
    <Tag>
      assisted living
    </Tag>
  ))
  .add('palette', () => (
    <Tag palette="primary">
      assisted living
    </Tag>
  ))
  .add('palette opaque', () => (
    <Tag palette="primary" opaque>
      assisted living
    </Tag>
  ));
