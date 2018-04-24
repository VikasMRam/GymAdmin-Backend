import React from 'react';
import styled from 'styled-components';
import { string, object } from 'prop-types';

import { size } from 'sly/components/themes';
import PropertyDetail from 'sly/components/organisms/PropertyDetail';
import ConciergeContainer from 'sly/containers/ConciergeContainer';

const PageWrapper = styled.div`
  display: flex;
  margin: 0 auto;
  width: 100%;
  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    width: ${size('layout.mainColumn')};  
  }
  @media screen and (min-width: ${size('breakpoint.laptopLarge')}) {
    width: calc(${size('layout.mainColumn')} + ${size('layout.sideColumn')} + ${size('spacing.xLarge')});
  }
`;

const Main = styled(PropertyDetail)`
  width: 100%;
  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    width: ${size('layout.mainColumn')};  
  }
  @media screen and (min-width: ${size('breakpoint.laptopLarge')}) {
    margin-right: ${size('spacing.xLarge')};
  }
`;

const Column = styled(ConciergeContainer)`
  display: none;
  @media screen and (min-width: ${size('breakpoint.laptopLarge')}) {
    width: ${size('layout.sideColumn')}; 
    display: block;
  }
`;

const PropertyDetailPage = ({ property, userActions }) => {  
  return (
    <PageWrapper>
      <Main key="main" property={property} />
      <Column key="column" community={property} userActions={userActions} />
    </PageWrapper>
  );
};

PropertyDetailPage.propTypes = {
  property: object.isRequired,
  userActions: object.isRequired,
};

export default PropertyDetailPage;
