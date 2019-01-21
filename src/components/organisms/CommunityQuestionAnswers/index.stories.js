import React from 'react';
import { storiesOf } from '@storybook/react';

import CommunityQuestionAnswers from 'sly/components/organisms/CommunityQuestionAnswers';
import RhodaGoldmanPlaza from 'sly/../private/storybook/sample-data/property-rhoda-goldman-plaza.json';

const { questions } = RhodaGoldmanPlaza;
const communityName = 'Rhoda Goldman Plaza';

storiesOf('Organisms|CommunityQuestionAnswers', module).add('default', () => (
  <CommunityQuestionAnswers
    questions={questions}
    communityName={communityName}
  />
));
