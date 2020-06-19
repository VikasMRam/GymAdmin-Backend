import React from 'react';
import { number, string, node } from 'prop-types';
import styled from 'styled-components';
import isString from 'lodash/isString';

import { size } from 'sly/web/components/themes';
import { Bar, Block, ClampedText } from 'sly/web/components/atoms';
import { palette as palettePropType } from 'sly/web/propTypes/palette';
import { variation as variationPropType } from 'sly/web/propTypes/variation';
import { formatMoney } from 'sly/web/services/helpers/numbers';

const StyledBlock = styled(Block)`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 ${size('spacing.regular')};
`;

const Label = styled(ClampedText)`
  margin-left: ${size('spacing.regular')};
  margin-right: ${size('spacing.large')};
`;

const StyledBar = styled(Bar)`
  margin-right: ${size('spacing.regular')};
  display: flex;
  align-items: center;
`;

const PriceBar = ({
  width, price, children, palette, variation, className,
}) => {
  let title = '';
  if (isString(children)) {
    title = children;
  } else if (children) {
    ([title] = children);
  }

  const barWidth = Math.round(width * 0.8);

  return (
    <StyledBlock size="caption" className={className}>
      <StyledBar width={barWidth} palette={palette} variation={variation}>
        <Label size="caption" title={title}>{children}</Label>
      </StyledBar>
      {formatMoney(price)}
    </StyledBlock>
  );
};

PriceBar.propTypes = {
  width: number.isRequired,
  price: number.isRequired,
  children: node,
  palette: palettePropType,
  variation: variationPropType,
  className: string,
};

export default PriceBar;