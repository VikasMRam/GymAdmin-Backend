import React from 'react';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';

import TableRowCard from 'sly/components/molecules/TableRowCard';

const defaultProps = {
  heading: 'Amanda Appleseed',
  href: '/',
  id: '1',
  rowItems: [
    { type: 'doubleLine', data: { firstLine: 'Amanda is looking for Assisted Living for her mother  in Saratoga', secondLine: '10/10/2019' } },
    { type: 'stage', data: { text: 'New', currentStage: 1 } },
  ],
};

storiesOf('Molecules|TableRowCard', module)
  .add('default', () => (
    <TableRowCard {...defaultProps} />
  )).add('disabled', () => (
    <TableRowCard {...defaultProps} disabled icon="pause" iconPalette="danger" />
  ));