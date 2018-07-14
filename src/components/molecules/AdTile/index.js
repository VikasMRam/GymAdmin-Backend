import React from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { size } from 'sly/components/themes';
import { Icon } from 'sly/components/atoms';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const AdImage = styled.div`
  background:  ${palette('secondary', 0)};
  height: ${size('tile', 'large', 'height')};
`;

const StyledLogo = styled(Icon)`
  margin: auto;
`;

const AdInfo = styled.div`
  border: ${size('border.regular')} solid ${palette('grayscale', 0)};
  border-top: 0;
`;

const AdInfoHeader = styled.div`
  font-size: ${size('text.subtitle')};
  font-weight: bold;
  margin: ${size('spacing.large')};
`;

const AdInfoUnorderedList = styled.div`
  margin: ${size('spacing.large')};
  margin-top: 0;
`;

const AdTile = () => {
  return (
    <Wrapper>
      <AdImage >
        <StyledLogo icon="seniorly-white" size="xxLarge" />
      </AdImage>
      <AdInfo>
        <AdInfoHeader>Let the Seniorly Team Find Your Room</AdInfoHeader>
        <AdInfoUnorderedList>
          <li>Get Special Pricing</li>
          <li>Access to communities not yet listed</li>
          <li>Concierge team ready to assist</li>
        </AdInfoUnorderedList>
      </AdInfo>
    </Wrapper>
  );
};

export default AdTile;
