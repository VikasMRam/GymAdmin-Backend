import React, { Component } from 'react';
import { arrayOf, string } from 'prop-types';
import styled from 'styled-components';

import { size } from 'sly/components/themes';
import ListItem from 'sly/components/molecules/ListItem';

const CareServiceDiv = styled.div``;

const CareServiceTextDiv = styled.div`
  padding-top: ${size('spacing.large')};
  padding-bottom: ${size('spacing.large')};
`;

const TwoColumnListItemDiv = styled.div`
  @media screen and (max-width: ${size('breakpoint.doubleModal')}) {
    column-count: 2;
  }

  @media screen and (max-width: ${size('breakpoint.tablet')}) {
    column-count: 2;
  }

  @media screen and (max-width: ${size('breakpoint.mobile')}) {
    column-count: 1;
  }
`;

export default class CareServicesList extends Component {
  static propTypes = {
    propertyName: string.isRequired,
    careServices: arrayOf(string).isRequired,
    serviceHighlights: arrayOf(string).isRequired,
  };

  render() {
    const { propertyName, careServices, serviceHighlights } = this.props;
    const serviceHighlightsComponent = serviceHighlights.map((service, index) => {
      return <ListItem key={index} text={service} />;
    });
    const careServicesComponent = careServices.map((service, index) => {
      return <ListItem key={index} text={service} />;
    });
    return (
      <CareServiceDiv>
        <CareServiceTextDiv> {propertyName} is known for </CareServiceTextDiv>
        <TwoColumnListItemDiv>
          {serviceHighlightsComponent}
        </TwoColumnListItemDiv>
        <CareServiceTextDiv> {propertyName} also offers </CareServiceTextDiv>
        <TwoColumnListItemDiv>{careServicesComponent}</TwoColumnListItemDiv>
      </CareServiceDiv>
    );
  }
}
