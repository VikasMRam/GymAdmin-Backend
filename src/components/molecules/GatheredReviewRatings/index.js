import React, { Component } from 'react';
import { arrayOf, shape, string, number, func } from 'prop-types';
import styled from 'styled-components';
import Link from 'react-router-dom/Link';

import { size } from 'sly/components/themes';
import { Button, Hr } from 'sly/components/atoms';
import Rating from 'sly/components/atoms/Rating';

const ReviewHeadingDiv = styled.div`
  padding-top: ${size('spacing.xLarge')};
`;

const ReviewDiv = styled.div`
  padding-top: ${size('spacing.large')};
  padding-right: ${size('spacing.large')};
  display: flex;
`;

const ReviewProviderDiv = styled.div`
  display: flex;
  padding-top: ${size('spacing.small')};
  padding-left: ${size('spacing.large')};
  > a {
    text-decoration: none;
  }
`;

const LeaveAReviewTextDiv = styled.div`
  padding-top: ${size('spacing.xLarge')};
`;

const LeaveAReviewButtonDiv = styled.div`
  padding-top: ${size('spacing.large')};
  padding-bottom: ${size('spacing.xLarge')};
`;

const HRDiv = styled.div`
  padding-top: ${size('spacing.xLarge')};
`;

export default class GatheredReviewRatings extends Component {
  static propTypes = {
    reviewRatings: arrayOf(shape({
      providerDisplayText: string.isRequired,
      url: string.isRequired,
      rating: number.isRequired,
    })).isRequired,
    onLeaveReview: func.isRequired,
  };
  render() {
    const { reviewRatings, onLeaveReview } = this.props;
    const ratings = reviewRatings.map((review) => {
      return (
        <ReviewDiv key={review.provider}>
          <Rating value={review.rating} />
          <ReviewProviderDiv>
            <Link to={review.url}>{review.providerDisplayText}</Link>
          </ReviewProviderDiv>
        </ReviewDiv>
      );
    });
    return (
      <div>
        <ReviewHeadingDiv>
          Reviews gathered from across the web
        </ReviewHeadingDiv>
        {ratings}
        <HRDiv>
          <Hr />
        </HRDiv>
        <LeaveAReviewTextDiv>
          If you are familiar with this community, your review will help other
          families in a similar situation make a more informed decision.
        </LeaveAReviewTextDiv>
        <LeaveAReviewButtonDiv>
          <Button onClick={onLeaveReview}>Leave a Review</Button>
        </LeaveAReviewButtonDiv>
        <Hr />
      </div>
    );
  }
}
