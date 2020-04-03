import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import agent from 'sly/../private/storybook/sample-data/agent-linda-iwamota.json';
import AgentRowCard from 'sly/components/organisms/AgentRowCard';

storiesOf('Organisms|CommunityRowCard', module)
  .add('default', () => (
    <AgentRowCard
      agent={agent}
      onAgentClick={action('onAgentClick')}
    />
  ));