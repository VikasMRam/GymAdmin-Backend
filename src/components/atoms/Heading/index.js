import React from 'react';
import { string, node, bool, oneOf } from 'prop-types';
import styled, { css } from 'styled-components';

import { prop } from 'styled-tools';

import { size, font, palette } from 'sly/components/themes';

const fontSize = p => size('text', p.size || p.level);
const lineHeight = p => size('lineHeight', p.size || p.level);

const getTag = level => {
  switch(level) {
    case 'hero': return 1;
    case 'title': return 2;
    case 'subtitle': return 3;
  }
};

const styles = css`
  font-size: ${fontSize};
  line-height: ${lineHeight};
  // TODO: review this with @jared,
  // for now let's make margin-bottom relative to font-size
  margin: 0 0 calc(${fontSize} * 0.25) 0;
  color: ${palette(0)};
`;

const Heading = styled(({
  level, children, palette, theme, ...props
}) =>
  React.createElement(`h${getTag(level)}`, props, children))`
  ${styles};
`;

Heading.propTypes = {
  level: oneOf(['hero', 'title', 'subtitle']).isRequired,
  size: oneOf(['hero', 'title', 'subtitle']),
  children: node,
  palette: string,
};

Heading.defaultProps = {
  level: 'title',
  palette: 'slate',
};

export default Heading;
