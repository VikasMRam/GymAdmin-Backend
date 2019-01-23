import React, { Fragment } from 'react';
import styled from 'styled-components';
import { bool, node } from 'prop-types';

import { size } from 'sly/components/themes';

const Main = styled.main`
  width: 100%;
  margin: 0 auto;
  padding: 0 ${size('spacing.large')};
  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    padding: 0;
    width: ${size('layout.col8')};
  }
  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    width: ${size('layout.col12')};
  }
`;

export const TemplateContent = ({ children }) => (
  <Fragment>
    <Main>{children}</Main>
  </Fragment>
);
TemplateContent.propTypes = {
  children: node,
};

export const TemplateHeader = styled.header`
  margin-bottom: ${size('spacing.large')};
`;
