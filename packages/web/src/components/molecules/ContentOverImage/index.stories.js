import React from 'react';
import { storiesOf } from '@storybook/react';

import { assetPath } from 'sly/web/components/themes';
import ContentOverImage from 'sly/web/components/molecules/ContentOverImage';

storiesOf('Molecules|ContentOverImage', module)
  .add('default', () => (
    <ContentOverImage image={assetPath('images/curtainup/hero.png')}>
      test
    </ContentOverImage>
  ));