import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette, key } from 'styled-theme';
import numeral from 'numeral';

import { size } from 'sly/components/themes';
import { Button, TileImage } from 'sly/components/atoms';

const priceTypeMap = {
  'Monthly Rate': 'month',
};
const defaultImage = '//d1qiigpe5txw4q.cloudfront.net/uploads/19898cec23e2a814366385f3488c29be/Vintage-Golden-Gate_San-Francisco_Assisted-Living_Original-16_hd.jpg';

const Wrapper = styled.div`
    display: inline-block;
    border: ${size('border')} solid ${palette('grayscale', 0, true)};
    width: 100%;
    transition: box-shadow ${key('transitions.default')}, opacity ${key('transitions.default')};
    @media screen and (min-width: ${size('breakpoint.mobile')}) {
      width: auto;
    }
    &:hover {
      cursor: default;
      box-shadow: 0 ${size('spacing.small')} ${size('spacing.regular')} ${palette('grayscale', 1, true)};
      opacity: 0.75;
      background: ${palette('white', 2)};

      Button {
        display: initial;
      }
    }
`;
const ItemDescription = styled.div`
  padding: ${size('spacing.large')};
`;
const ImageButtonContainer = styled.div`
    position: relative;

    Button {
      display: none;
      position: absolute;
      top: 70%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
`;

const RoomTile = ({
  image, roomType, shareType, price, priceShared, priceType, onInquireOrBookClicked,
}) => {
  let priceToShow = price;
  if (shareType === 'Shared') {
    priceToShow = priceShared;
  }

  return (
    <Wrapper>
      <ImageButtonContainer>
        <TileImage tileSize="small" src={image || defaultImage} />
        <Button onClick={onInquireOrBookClicked}>Inquire or book a tour</Button>
      </ImageButtonContainer>
      <ItemDescription>
        {roomType} {shareType}<br />${numeral(priceToShow).format('0,0')} per {priceTypeMap[priceType]}
      </ItemDescription>
    </Wrapper>
  );
};

RoomTile.propTypes = {
  image: PropTypes.string,
  roomType: PropTypes.string.isRequired,
  shareType: PropTypes.string.isRequired,
  price: PropTypes.number,
  priceShared: PropTypes.number,
  priceType: PropTypes.oneOf(Object.keys(priceTypeMap)).isRequired,
  onInquireOrBookClicked: PropTypes.func,
};

export default RoomTile;
