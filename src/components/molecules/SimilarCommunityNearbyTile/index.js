import React from 'react';
import styled, { css } from 'styled-components';
import { string, number } from 'prop-types';
import NumberFormat from 'react-number-format';

import { size } from 'sly/components/themes';

import { Image, Block, Icon } from 'sly/components/atoms';

const clamp = css`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;

const Wrapper = styled.div`

`;

const ImageWrapper = styled(Image)`
  margin-bottom: ${size('spacing.regular')};

  > img {
    border-radius: ${size('border.xxLarge')};
  }
`;
ImageWrapper.displayName = 'ImageWrapper';

const Name = styled(Block)`
  ${clamp};
  margin-bottom: ${size('spacing.small')};
`;
Name.displayName = 'Name';

const TypeOfCare = styled(Block)`
  text-transform: uppercase;
  margin-bottom: ${size('spacing.small')};
`;

const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
`;
RatingWrapper.displayName = 'RatingWrapper';

const RateBlock = styled(Block)`
  margin-right: ${size('spacing.large')};
`;

const PriceAndRatingWrapper = styled.div`
  display: flex;
`;

const StyledIcon = styled(Icon)`
  padding-top: ${size('spacing.small')};
  margin-right: ${size('spacing.regular')};
`;

const renderEstimatedRate = startingRate => startingRate ? (
  <RateBlock size="caption">
    Estimated <NumberFormat value={startingRate} displayType="text" thousandSeparator prefix="$" /> per month
  </RateBlock>
) : null;

const renderProviderRate = startingRate => startingRate ? (
  <RateBlock size="caption">
    <NumberFormat value={startingRate} displayType="text" thousandSeparator prefix="$" /> per month
  </RateBlock>
) : null;

const renderRate = (estimated, startingRate) =>
  estimated ? renderEstimatedRate(startingRate) : renderProviderRate(startingRate);

const SimilarCommunityNearbyTile = ({
  image, name, typeOfCare, estimatedRate, startingRate, reviewsValue,
}) => (
  <Wrapper>
    <ImageWrapper src={image} aspectRatio="3:2" />
    <TypeOfCare size="tiny" palette="primary" weight="bold">{typeOfCare}</TypeOfCare>
    <Name size="body" weight="medium">{name}</Name>
    <PriceAndRatingWrapper>
      {renderRate(estimatedRate, startingRate)}
      {reviewsValue !== 0 &&
      <Block size="caption">
        <StyledIcon icon="star" palette="primary" size="small" />
        {reviewsValue}
      </Block>
      }
    </PriceAndRatingWrapper>
  </Wrapper>
);

SimilarCommunityNearbyTile.propTypes = {
  image: string.isRequired,
  name: string.isRequired,
  typeOfCare: string,
  estimatedRate: number.isRequired,
  startingRate: number.isRequired,
  reviewsValue: number,
};

SimilarCommunityNearbyTile.defaultProps = {
  reviewsValue: 0,
};

export default SimilarCommunityNearbyTile;
