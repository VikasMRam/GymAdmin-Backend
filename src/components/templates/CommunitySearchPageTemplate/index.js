import React from 'react';
import { any, func } from 'prop-types';
import styled from 'styled-components';

import { size } from 'sly/components/themes';

import BasePageTemplate from 'sly/components/templates/BasePageTemplate';
import DefaultHeaderTemplate from 'sly/components/templates/DefaultHeaderTemplate';
import Footer from 'sly/components/organisms/Footer';

const TwoColumnWrapper = styled.div`
  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    display: flex;
  }
`;

// min-width reset is required for changing default flex behaviour which prevents flex-boxes of becoming smaller than it's contents.
// Ref: https://stackoverflow.com/questions/38223879/white-space-nowrap-breaks-flexbox-layout
const MainWrapper = styled.section`
  min-width: 0;
  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    flex: 1;
  }
`;

const ColumnWrapper = styled.aside`
  display: none;
  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    display: block;
    margin-right: ${size('spacing.xLarge')};
    width: ${size('layout.sideColumnSmall')};
  }
`;

const CommunitySearchPageTemplate = ({
  children,
  column,
  onLocationSearch,
}) => (
  <BasePageTemplate
    header={<DefaultHeaderTemplate onLocationSearch={onLocationSearch} />}
    footer={<Footer />}
  >
    <TwoColumnWrapper>
      <ColumnWrapper>{column}</ColumnWrapper>
      <MainWrapper>{children}</MainWrapper>
    </TwoColumnWrapper>
  </BasePageTemplate>
);

CommunitySearchPageTemplate.propTypes = {
  children: any.isRequired,
  column: any.isRequired,
  onLocationSearch: func,
};

export default CommunitySearchPageTemplate;
