import React, { Fragment } from 'react';
import { any, bool } from 'prop-types';
import styled from 'styled-components';

import { size } from 'sly/components/themes';
import ChatBoxContainer from 'sly/containers/ChatBoxContainer';

const Content = styled.main`
  width: 100%;
  margin: 0 auto;
  padding: 0 ${size('spacing.large')};
  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    padding: 0;
    width: ${size('layout.mainColumn')};
  }
  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    width: ${size('maxWidth')};
  }
`;

const StyledHeader = styled.header`
  margin-bottom: ${size('spacing.large')};
  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    margin-bottom: ${size('spacing.xLarge')};
  }
`;

const BasePageTemplate = ({
  header, children, footer, hasStickyFooter,
}) => (
  <Fragment>
    {/* TODO: replace with <> </> after upgrading to babel 7 & when eslint adds support for jsx fragments */}
    <StyledHeader>{header}</StyledHeader>
    <Content>{children}</Content>
    <footer>{footer}</footer>
    <ChatBoxContainer pageWithStickyFooter={hasStickyFooter} />
  </Fragment>
);

BasePageTemplate.propTypes = {
  header: any.isRequired,
  footer: any.isRequired,
  children: any.isRequired,
  hasStickyFooter: bool,
};

export default BasePageTemplate;
