import React from 'react';
import styled, { css } from 'styled-components';
import { string, node, bool } from 'prop-types';
import { ifProp } from 'styled-tools';

import { size, palette } from 'sly/components/themes';
import { Heading, Hr } from 'sly/components/atoms';

const StyledSection = styled.section`
  border: ${size('border.regular')} ${ifProp('hasNoBorder', 'none', 'solid')} ${palette('slate', 'stroke')};
  border-radius: ${ifProp('hasNoBorder', null, size('border.xLarge'))};
  background-color: ${palette('white.base')};
  padding: ${size('spacing.xLarge')};
  padding-left: ${ifProp('hasNoBodyPadding', 0, null)};
  padding-right: ${ifProp('hasNoBodyPadding', 0, null)};
  padding-bottom: ${ifProp('hasNoBodyPadding', 0, null)};
`;

const HeadingBlock = styled(Heading)`
  padding-left: ${ifProp('hasNoBodyPadding', size('spacing.xLarge'), 0)};
  padding-right: ${ifProp('hasNoBodyPadding', size('spacing.xLarge'), 0)};
  padding-bottom: ${ifProp('hasNoHr', size('spacing.xLarge'), 0)};
`;

const StyledHr = styled(Hr)`
  margin-left: ${ifProp('hasNoBodyPadding', 0, css`-${size('spacing.xLarge')}`)};
  margin-right: ${ifProp('hasNoBodyPadding', 0, css`-${size('spacing.xLarge')}`)};
  margin-bottom: ${ifProp('hasNoBodyPadding', 0, null)};
`;

const HeadingBoxSection = ({
  id, heading, children, className, hasNoBodyPadding, hasNoBorder, hasNoHr,
}) => (
  <StyledSection id={id} className={className} hasNoBodyPadding={hasNoBodyPadding} hasNoBorder={hasNoBorder}>
    <HeadingBlock level="subtitle" hasNoBodyPadding={hasNoBodyPadding} hasNoHr={hasNoHr}>{heading}</HeadingBlock>
    { !hasNoHr && <StyledHr hasNoBodyPadding={hasNoBodyPadding} /> }
    {children}
  </StyledSection>
);

HeadingBoxSection.propTypes = {
  id: string,
  className: string,
  heading: node.isRequired,
  children: node,
  hasNoBodyPadding: bool,
  hasNoBorder: bool,
  hasNoHr: bool,
};

export default HeadingBoxSection;
