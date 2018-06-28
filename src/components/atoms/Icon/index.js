// https://github.com/diegohaz/arc/wiki/Example-components#icon
import React from 'react';
import { string, number, bool, oneOf } from 'prop-types';
import styled from 'styled-components';
import { palette, key } from 'styled-theme';
import { ifProp, prop } from 'styled-tools';

import { size } from 'sly/components/themes';

const fontSize = props => size('icon', props.size);

const Wrapper = styled.span`
  display: inline-block;
  font-size: ${fontSize};
  color: ${prop('fill', palette(0))};
  // sizes relative to set font-size
  width: ${fontSize};
  height: ${fontSize};
  transform: ${ifProp('flip', 'rotate(180deg)', 'rotate(0deg)')};
  transition: transform ${key('transitions.fast')};
  & > svg {
    font-size: ${fontSize};
    display: block;
    fill: currentColor;
    stroke: ${prop('stroke', 'none')};
  }
`;

const Icon = ({ icon, size, ...props }) => {
  let svg;
  try {
    svg = require(`!raw-loader!./icons/${icon}-${size}.svg`);
  } catch (e) {
    console.error('Icon not found:', `${icon}-${size}`);
    svg = '<span>x</span>';
  }
  return (
    <Wrapper size={size} {...props} dangerouslySetInnerHTML={{ __html: svg }} />
  );
};

Icon.propTypes = {
  icon: string.isRequired,
  width: number,
  size: oneOf(['tiny', 'small', 'regular', 'large', 'xLarge', 'xxLarge']),
  palette: string,
  fill: string,
  stroke: string,
  flip: bool,
};

Icon.defaultProps = {
  flip: false,
  size: 'regular',
  palette: 'secondary',
};

export default Icon;
