
import React from 'react';
import { storiesOf } from '@storybook/react';
import CollapsibleSection from '.';

storiesOf('Molecules|CollapsibleSection', module)
  .add('default', () => (
    <CollapsibleSection title="Section title">
      { 'Officia aliqua reprehenderit fugiat occaecat quis non eiusmod. '.repeat(25) }
    </CollapsibleSection>
  ))
  .add('small', () => (
    <CollapsibleSection title="Section title">
      { 'Officia aliqua reprehenderit fugiat occaecat quis non eiusmod. '.repeat(25) }
    </CollapsibleSection>
  ))
  .add('large', () => (
    <CollapsibleSection title="Section title">
      { 'Officia aliqua reprehenderit fugiat occaecat quis non eiusmod. '.repeat(25) }
    </CollapsibleSection>
  ))
  .add('splicit minHeight', () => (
    <CollapsibleSection title="Section title">
      { 'Officia aliqua reprehenderit fugiat occaecat quis non eiusmod. '.repeat(25) }
    </CollapsibleSection>
  ));
