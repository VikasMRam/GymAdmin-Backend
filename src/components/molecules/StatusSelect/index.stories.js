import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';

import StatusSelect from '.';

const Wrapper = styled.div`
  margin: 10px;
  width: 300px;
`;

storiesOf('Molecules|StatusSelect', module)
  .add('default', () => (
    <Fragment>
      <Wrapper>
        <StatusSelect value="On Pause" />
      </Wrapper>
      <Wrapper>
        <StatusSelect value="Archived" menuIsOpen />
      </Wrapper>
    </Fragment>
  ));
