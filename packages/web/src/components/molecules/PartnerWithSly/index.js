import React from 'react';
import styled from 'styled-components';

import { size, palette } from 'sly/web/components/themes';
import { Block, Button } from 'sly/web/components/atoms';

const TitleBlock = styled(Block)`
  margin: auto;
  margin-bottom: ${size('spacing.regular')};
  max-width: ${size('layout.col5')};
`;

const StyledBlock = styled(Block)`
  margin-bottom: ${size('spacing.xLarge')};
`;

const Wrapper = styled.div`
  background: ${palette('white', 'base')}E6;
  border-radius: ${size('border.xLarge')};
  text-align: center;
  padding: ${size('spacing.xxxLarge')};
  width: 100%;
`;

const ContentWrapper = styled.div`
  margin: auto;
  text-align: center;
`;

const PartnerWithSly = () => (
  <Wrapper>
    <ContentWrapper>
      <TitleBlock size="hero">Partner with Seniorly, Expand Your Agency</TitleBlock>
      <StyledBlock>There’s no upfront cost to help qualified referrals</StyledBlock>
    </ContentWrapper>
    <Button href="https://docs.google.com/forms/d/1wMTmjC8RdS0lGYSBppTRYBBhJ0yd-P6SsTLtOinqMsA/viewform" kind="jumbo">Apply now</Button>
  </Wrapper>
);

export default PartnerWithSly;