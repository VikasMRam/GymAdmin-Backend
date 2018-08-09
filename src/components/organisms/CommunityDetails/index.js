import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { size } from 'sly/components/themes';
import CollapsibleBlock from 'sly/components/molecules/CollapsibleBlock';
import { Paragraph, Heading } from 'sly/components/atoms';

const StyledHeading = styled(Heading)`
  margin-bottom: ${size('spacing.large')}; 
`;

const StyledArticle = styled.article`
  margin-bottom: ${size('spacing.xLarge')};
  &:last-of-type {
    margin-bottom: 0;
    p {
      margin-bottom: ${size('spacing.regular')};
    }
  }
`;

const CommunityDetails = ({
  communityName, communityDescription, staffDescription, residentDescription, ownerExperience,
}) => {
  return (
    <CollapsibleBlock collapsedDefault={false}>
      {communityDescription ? (
        <StyledArticle>
          {communityDescription.split('\n\n')
            .map((paragraph, index) => <Paragraph>{paragraph}</Paragraph>)
          }
        </StyledArticle>
      ) : (
        'No details are available'
      )}
      {ownerExperience && (
        <StyledArticle>
          <StyledHeading level="subtitle" size="subtitle">
            Owners Story
          </StyledHeading>
          {ownerExperience.split('\n\n')
            .map((paragraph, index) => <Paragraph>{paragraph}</Paragraph>)
          }
        </StyledArticle>
      )}
      {staffDescription && (
        <StyledArticle>
          <StyledHeading level="subtitle" size="subtitle">
            About the Staff at {communityName}
          </StyledHeading>
          {staffDescription.split('\n\n')
            .map((paragraph, index) => <Paragraph>{paragraph}</Paragraph>)
          }
        </StyledArticle>
      )}
      {residentDescription && (
        <StyledArticle>
          <StyledHeading level="subtitle" size="subtitle">
            About the Residents at {communityName}
          </StyledHeading>
          {residentDescription.split('\n\n')
            .map((paragraph, index) => <Paragraph>{paragraph}</Paragraph>)
          }
        </StyledArticle>
      )}
    </CollapsibleBlock>
  );
};

CommunityDetails.propTypes = {
  communityName: PropTypes.string.isRequired,
  communityDescription: PropTypes.string,
  staffDescription: PropTypes.string,
  residentDescription: PropTypes.string,
  ownerExperience: PropTypes.string,
};

export default CommunityDetails;
