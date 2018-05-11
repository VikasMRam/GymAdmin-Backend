import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Pagination from '.';

const firstFive = {
  current: 0,
  total: 5,
  onChange: action('change'),
};

const firstLarge = {
  current: 0,
  total: 100,
  onChange: action('change'),
};

storiesOf('Molecules|Pagination', module)
  .add('default', () => (
    <Pagination {...firstFive} />
  ))
  .add('second', () => (
    <Pagination {...firstFive} current={1} />
  ))
  .add('large first', () => (
    <Pagination {...firstLarge} />
  ))
;
