import React from 'react';
import { storiesOf } from '@storybook/react';

import FamilyEntry from 'sly/web/components/molecules/FamilyEntry';
import PraneshKumar from 'sly/web/../private/storybook/sample-data/client-pranesh-kumar.json';

storiesOf('Molecules|FamilyEntry', module)
  .add('default', () => <FamilyEntry client={PraneshKumar} />)
  .add('with children', () => <FamilyEntry client={PraneshKumar}>Duplicate info here</FamilyEntry>);
