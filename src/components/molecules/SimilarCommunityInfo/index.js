import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { palette } from 'styled-theme';
import { prop } from 'styled-tools';
import Dotdotdot from 'react-dotdotdot';

import { size } from 'sly/components/themes';
import { Heading, Block } from 'sly/components/atoms';
import Rating from 'sly/components/molecules/Rating';
import NumberFormat from 'react-number-format';

const clamp = css`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;

const Wrapper = styled.div`
  color: ${palette('slate', 0)};
  font-size: ${size('text.body')};
  box-sizing: border-box;
  min-width: 0;
  padding: ${size('spacing.large')};
  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    padding: 0;
    padding-top: ${size('spacing.regular')};
  }
`;

const StyledHeading = styled(Heading)`
  ${clamp};
  margin-bottom: 0;
`;

const RatingWrapper = styled.div`
  display: flex;
  margin-top:${size('spacing.small')};
  margin-bottom: ${size('spacing.small')};
  > * {
    ${clamp};
    width: unset;
  }
`;

const Rate = styled.span`
  margin-right: ${size('spacing.regular')};
`;

const StyledRating = styled(Rating)`
  display: inline-flex;
  vertical-align: top;
`;

const ClampedLine = styled.div`
  ${clamp};
  font-size: ${size('text.caption')};
`;

const Description = styled.div`
  color: ${palette(0)};
  font-size: ${size('text.caption')};
  margin-top: ${size('spacing.small')};
`;

export default class SimilarCommunityInfo extends Component {
  static propTypes = {
    similarProperty: PropTypes.object.isRequired,
  };

  renderEstimatedRate = startingRate => startingRate ? (
    <Rate>
      {'Estimated '}
      <NumberFormat value={startingRate} displayType="text" thousandSeparator prefix="$" />
      {'/mo'}
    </Rate>
  ) : null;

  renderProviderRate = startingRate  => startingRate ? (
    <Rate>
      <NumberFormat value={startingRate} displayType="text" thousandSeparator prefix="$" />
      {' per month'}
    </Rate>
  ) : null;

  renderRate = ({ estimated, startingRate }) => estimated ? (
    this.renderEstimatedRate(startingRate)
  ) : (
    this.renderProviderRate(startingRate)
  )

  renderReviews = ({ numReviews, reviewsValue }) => {
    if (numReviews > 0) {
      return (
        <span>
          <StyledRating value={reviewsValue || 0} size="regular" />
          {' '}{numReviews }
        </span>
      );
    }

    return (
      <span>
        {' Not Yet Rated'}
      </span>
    );
  }

  render() {
    const { similarProperty: community, ...props } = this.props;

    const {
      name,
      estimated,
      startingRate,
      reviewsValue,
      numReviews,
      addressString,
      description,
      webViewInfo,
    } = community;

    const {
      firstLineValue,
      secondLineValue,
    } = webViewInfo;

    // TODO : Get the following values from API Response
    return (
      <Wrapper {...props}>
        <StyledHeading level="subtitle" size="subtitle">{name}</StyledHeading>
        <ClampedLine>
          {addressString}
        </ClampedLine>
        <RatingWrapper>
          {this.renderRate(community)}
          {this.renderReviews(community)}
        </RatingWrapper>

        <ClampedLine>{firstLineValue}</ClampedLine>

        <ClampedLine>Floor Plans: {secondLineValue}</ClampedLine>

        <Description palette="grayscale">
          <Dotdotdot clamp={2}>
            {description}
          </Dotdotdot>
        </Description>
      </Wrapper>
    );
  }
}
