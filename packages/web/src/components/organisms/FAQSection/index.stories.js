import React from 'react';
import { storiesOf } from '@storybook/react';

import FAQSection from 'sly/web/components/organisms/FAQSection';
import { partnerFAQs } from 'sly/web/constants/agents';

storiesOf('Organisms|FAQSection', module)
  .add('default', () => (
    <FAQSection
      faqs={partnerFAQs}
    />
  ))
  .add('with one faq', () => (
    <FAQSection
      faqs={[partnerFAQs[0]]}
    />
  ));
