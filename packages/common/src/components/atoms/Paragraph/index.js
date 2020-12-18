import React from 'react';
import styled from 'styled-components';

import {
  withDisplay,
  withText,
  withColor,
  withSpacing,
  withCursor,
  withAlign,
} from 'sly/common/components/helpers';

const StyledP = styled.p`
  ${withColor}
  ${withText}
  ${withSpacing}
  ${withCursor}
  ${withAlign}
  ${withDisplay}
`;

const Paragraph = props => <StyledP {...props} />;

Paragraph.displayName = 'Paragraph';

Paragraph.defaultProps = {
  palette: 'slate',
  font: 'body-regular',
  margin: '0',
  pad: 'large',
};

export default Paragraph;
