import React, { Fragment } from 'react';
import styled from 'styled-components';
import { string, array, func } from 'prop-types';

import { size } from 'sly/components/themes';
import CommunityBookATourAcknowledgement from 'sly/components/organisms/CommunityBookATourAcknowledgement/index';
import Hr from 'sly/components/atoms/Hr/index';
import Heading from 'sly/components/atoms/Heading/index';
import SimilarCommunityNearbyTile from 'sly/components/molecules/SimilarCommunityNearbyTile/index';
import { Link } from 'sly/components/atoms/index';

const CommunityBookATourAcknowledgementWrapper = styled.div`
  margin-bottom: ${size('spacing.xxxLarge')};
`;

const StyledHr = styled(Hr)`
  margin-bottom: ${size('spacing.xxxLarge')};
`;

const StyledHeading = styled(Heading)`
  text-align: center;
  margin-bottom: ${size('spacing.xLarge')};
`;

const SimilarCommunityTileWrapper = styled.div`
  margin-bottom: ${size('spacing.xLarge')};

  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    margin-bottom: initial;
  }
`;

const SimilarCommunitiesWrapper = styled.div`
  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    display: grid;
    grid-gap: 1.500rem;
    grid-template-columns: repeat(auto-fit, 252px);
    justify-content: center;
  }
`;

const CommunityBookATourConfirmationPopup = ({
  similarCommunititesHref, similarCommunities, heading, subheading, onTileClick,
}) => {
  const similarCommunitiesComponent = similarCommunities.map(community => (
    <SimilarCommunityTileWrapper key={community.id}>
      <Link to={community.url} onClick={onTileClick}>
        <SimilarCommunityNearbyTile
          image={community.imageUrl}
          name={community.name}
          estimatedRate={community.estimated || 0}
          startingRate={community.startingRate}
          reviewsValue={community.reviewsValue}
          numReviews={community.numReviews}
        />
      </Link>
    </SimilarCommunityTileWrapper>
  ));

  return (
    <Fragment>
      <CommunityBookATourAcknowledgementWrapper>
        <CommunityBookATourAcknowledgement similarCommunititesHref={similarCommunititesHref} heading={heading} subheading={subheading} />
      </CommunityBookATourAcknowledgementWrapper>
      <StyledHr />
      <StyledHeading level="title">Explore communities nearby</StyledHeading>
      <SimilarCommunitiesWrapper>{similarCommunitiesComponent}</SimilarCommunitiesWrapper>
    </Fragment>
  );
};

CommunityBookATourConfirmationPopup.propTypes = {
  similarCommunititesHref: string.isRequired,
  similarCommunities: array.isRequired,
  onTileClick: func.isRequired,
  heading: string,
  subheading: string,
};

export default CommunityBookATourConfirmationPopup;

