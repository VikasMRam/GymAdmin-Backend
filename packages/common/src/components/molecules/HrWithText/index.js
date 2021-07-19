import React from 'react';
import { string, object } from 'prop-types';
import styled from 'styled-components';

import { size, getKey } from 'sly/common/components/themes';
import { palette as palettePropType } from 'sly/common/propTypes/palette';
import { variation as variationPropType } from 'sly/common/propTypes/variation';
import { Hr, Badge, Block } from 'sly/common/components/atoms';

const StyledBlock = styled(Block)`
  top: ${size('spacing.large')};
`;

const HrWithText = ({
  children, badgeText, palette, variation, badgeTextpalette, ...props
}) => (
  <Block {...props} height={getKey('sizes.spacing.xxxLarge')}>
    <Hr palette={palette} variation={variation} margin="0" />
    <StyledBlock
      display="flex"
      direction="row"
      align="center"
      verticalAlign="middle"
      position="absolute"
      width="100%"
    >
      {children && (
        <Block
          display="flex"
          align="center"
          verticalAlign="middle"
          flex={1}
        >
          <Block
            background="white"
            padding={[0, 'large']}
          >
            {children}
          </Block>
        </Block>
      )}
      {badgeText && (
        <Block marginLeft="auto" lineHeight="0">
          <Badge
            background={palette}
            backgroundVariation={variation}
            palette={badgeTextpalette}
          >
            {badgeText}
          </Badge>
        </Block>
      )}
    </StyledBlock>
  </Block>
);

HrWithText.propTypes = {
  palette: palettePropType,
  badgeTextpalette: palettePropType,
  variation: variationPropType,
  children: string,
  badgeText: string,
  hrRef: object,
};

HrWithText.defaultProps = {
  display: 'flex',
  direction: 'column',
  position: 'relative',
  paddingTop: 'xLarge',
};

export default HrWithText;
