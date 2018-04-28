import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette, key } from 'styled-theme';

import { size } from 'sly/components/themes';
import { Block, Link } from 'sly/components/atoms';
import Heading from "sly/components/atoms/Heading";

const Wrapper = styled(Link)`
    display: inline-block;
    border: ${size('border.regular')} solid ${palette('grayscale', 2)};
    width: 100%;
    transition: box-shadow ${key('transitions.default')}, opacity ${key('transitions.default')};
    margin-bottom: ${size('spacing.regular')};
    &:hover {
      cursor: pointer;
      box-shadow: 0 ${size('spacing.small')} ${size('spacing.regular')} ${palette('grayscale', 1, true)};
      opacity: 0.75;
      background: ${palette('white',0)};
    }
`;

const StyledHeading = styled(Heading)`
  margin-bottom: ${size('spacing.small')};
`;

const ItemDescription = styled.div`
  padding: 0 ${size('spacing.large')};
  padding-bottom: ${size('spacing.large')};
`;

const ImageWrapper = styled.div`
  position: relative;
  height: 0;
  width: 100%;
  padding-top: 75%;
`;

const Image = styled.img`
  position: absolute;
  top: 0px;
  left: 0px;
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const ReasonTile = ({
  image, title, text, to, ...props
}) => (
  <Wrapper to={to} {...props}>
    <ImageWrapper>
      <Image src={image} />
    </ImageWrapper>
    <ItemDescription>
      <StyledHeading level="subtitle">{title}</StyledHeading>
      <Block>{text}</Block>
    </ItemDescription>
  </Wrapper>
);

ReasonTile.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  to: PropTypes.string
};

export default ReasonTile;
