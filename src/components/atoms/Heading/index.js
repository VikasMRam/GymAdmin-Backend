import React from 'react';
import { string, node, bool, oneOf } from 'prop-types';
import styled, { css } from 'styled-components';
import { font, palette } from 'styled-theme';
import { prop } from 'styled-tools';

import { size } from 'sly/components/themes';

const fontSize = p => size('text', prop('size')(p))(p);
const lineHeight = p => size('lineHeight', prop('size')(p))(p);

const level = size => {
  switch(size) {
    case 'hero': return 1;
    case 'title': return 1;
    case 'subtitle': return 2;
  }
};

const styles = css`
  font-family: ${font('primary')};
  font-weight: 700;
  font-size: ${fontSize};
  line-height: ${lineHeight};
  margin: 0;
  margin-top: 0.85714em;
  margin-bottom: 0.57142em;
  color: ${palette({ grayscale: 0 }, 1)};
`;

const Heading = styled(({
  size, children, reverse, palette, theme, ...props
}) =>
  React.createElement(`h${level(size)}`, props, children))`
  ${styles};
`;

Heading.propTypes = {
  size: oneOf(['hero', 'title', 'subtitle']),
  children: node,
  palette: string,
  reverse: bool,
};

Heading.defaultProps = {
  size: 'title',
  palette: 'grayscale',
};

export default Heading;
