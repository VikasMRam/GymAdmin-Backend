import React from 'react';
import { string, number } from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

import { size } from 'sly/components/themes';
import Rating from 'sly/components/molecules/Rating';
import { Hr, Block } from 'sly/components/atoms';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${size('spacing.regular')};
`;

const RatingIconDiv = styled.div`
  margin-bottom: ${size('spacing.regular')};
`;

const ReviewHeadingText = styled(Block)`
  margin-right: ${size('spacing.large')};
`;

const BottomSection = styled.div`
  display: flex;
`;

const CommentBlock = styled(Block)`
  margin-bottom: ${size('spacing.regular')};
`;

const EntityReview = ({
  value, author, createdAt, comments,
}) => (
  <Wrapper>
    <RatingIconDiv>
      <Rating value={value} palette="secondary" />
    </RatingIconDiv>
    <CommentBlock>{comments}</CommentBlock>
    <BottomSection>
      <ReviewHeadingText size="caption" palette="grey">{`By ${author}`}</ReviewHeadingText>
      <ReviewHeadingText size="caption" palette="grey">{moment(createdAt).format('MMMM YYYY')}</ReviewHeadingText>
    </BottomSection>
    <Hr />
  </Wrapper>
);

EntityReview.propTypes = {
  value: number.isRequired,
  author: string.isRequired,
  createdAt: string.isRequired,
  comments: string.isRequired,
};

export default EntityReview;
