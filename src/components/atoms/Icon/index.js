// https://github.com/diegohaz/arc/wiki/Example-components#icon
import React from 'react';
import { string, number, bool, oneOf } from 'prop-types';
import styled from 'styled-components';
import { ifProp, prop } from 'styled-tools';

import { variation as variationPropType } from 'sly/propTypes/variation';
import { palette as palettePropType } from 'sly/propTypes/palette';
import { size, palette, key } from 'sly/components/themes';

const fontSize = props => size('icon', props.size);
const getColor = ({ palette: paletteProp, variation }) => palette(paletteProp, variation);
const getTransform = ({ rotate, flip }) => `transform: rotate(${rotate * 90}deg)${flip ? ' scaleX(-1) scaleY(-1)' : ''}`;

const Wrapper = styled.span`
  display: inline-block;
  vertical-align: top;
  font-size: ${fontSize};
  color: ${getColor};
  // sizes relative to set font-size
  width: ${fontSize};
  height: ${fontSize};
  ${ifProp('flip', 'transform: scaleY(-1)')};
  ${getTransform};
  transition: transform ${key('transitions.fast')};
  & > svg {
    font-size: ${fontSize};
    min-width: ${fontSize};
    display: block;
    fill: currentColor;
    stroke: ${prop('stroke', 'none')};
  }
`;

const Icon = styled(({ icon, size, ...props }) => {
  let svg;
  try {
    svg = require(`!raw-loader!./icons/${icon}-regular.svg`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Icon not found:', `${icon}-regular`);
    svg = '<span>x</span>';
  }
  return (
    <Wrapper size={size} {...props} dangerouslySetInnerHTML={{ __html: svg }} />
  );
})`
`;

Icon.displayName = 'Icon';

Icon.propTypes = {
  icon: string.isRequired,
  width: number,
  size: oneOf(['tiny', 'small', 'regular', 'caption', 'large', 'xLarge', 'xxLarge']),
  palette: palettePropType,
  variation: variationPropType,
  stroke: string,
  flip: bool,
  rotate: number,
};

Icon.defaultProps = {
  flip: false,
  rotate: 0,
  size: 'regular',
  palette: 'secondary',
  variation: 'base',
};

export default Icon;
