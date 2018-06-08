import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Heading, Block } from 'sly/components/atoms';
import RoomTile from 'sly/components/molecules/RoomTile';
import PriceBar from 'sly/components/molecules/PriceBar';
import EstimatedCost from 'sly/components/molecules/EstimatedCost';
import { community as communityPropType } from 'sly/propTypes/community';
import { size } from 'sly/components/themes';
import ConciergeController from 'sly/controllers/ConciergeController';

const Item = styled.div`
  display: inline-block;
  margin-bottom: ${size('spacing.large')};
  width: 100%;
  @media screen and (min-width: ${size('breakpoint.mobile')}) {
    margin-right: ${size('spacing.large')};
    width: auto;
  }
`;

const StyledPriceBar = styled(PriceBar)`
  margin-bottom: ${size('spacing.small')};
`;

const StyledArticle = styled.article`
  margin-bottom: ${size('spacing.xLarge')};

  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    div:nth-child(3n) {
      margin-right: 0;
    }
  }
`;

const CompareHeading = styled(Heading)`
  margin-bottom: ${size('spacing.large')};
`;

const PriceLabel = styled.div`
  margin-bottom: ${size('spacing.small')};
`;

export const findPercentage = (price, maxPrice) => ((price / maxPrice) * 100).toFixed(2);

export const sortProperties = (obj) => {
  const sortable = [];
  Object.keys(obj).forEach((key) => {
    // each item is an array in format [key, value]
    sortable.push([key, obj[key]]);
  });

  // sort items by value
  sortable.sort((a, b) => a[1] - b[1]);
  // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
  return sortable;
};

export default class PricingAndAvailability extends Component {
    static propTypes = {
      community: communityPropType.isRequired,
      roomPrices: PropTypes.arrayOf(PropTypes.shape({
        roomType: PropTypes.string.isRequired,
        image: PropTypes.string,
        shareType: PropTypes.string.isRequired,
        price: PropTypes.number,
        priceShared: PropTypes.number,
        priceType: PropTypes.string.isRequired,
      })),
      address: PropTypes.shape({
        country: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
      }).isRequired,
      estimatedPrice: PropTypes.shape({
        providedAverage: PropTypes.number.isRequired,
        estimatedAverage: PropTypes.number.isRequired,
        cityAverage: PropTypes.number.isRequired,
        stateAverage: PropTypes.number.isRequired,
        nationalAverage: PropTypes.number.isRequired,
      }),
      getDetailedPricing: PropTypes.func,
      onInquireOrBookClicked: PropTypes.func,
    };

    static defaultProps = {
      roomPrices: [],
    };

    render() {
      const {
        community,
        roomPrices,
        address,
        estimatedPrice,
        getDetailedPricing,
        onInquireOrBookClicked,
      } = this.props;

      const estimatedPriceLabelMap = {
        providedAverage: community.name,
        estimatedAverage: community.name, // TODO: figure out correct label
        cityAverage: address.city,
        stateAverage: address.state,
        nationalAverage: address.country,
      };

      let sortedEstimatedPrice = [];
      let maxPrice = 0;
      let estimatedPriceBase = 0;
      if (estimatedPrice) {
        sortedEstimatedPrice = sortProperties(estimatedPrice);
        // remove items with 0 price
        sortedEstimatedPrice = sortedEstimatedPrice.filter(price => price[1] > 0);
        if (sortedEstimatedPrice.length) {
          // what if only providedAverage or estimatedAverage is non zero. just show nothing
          if (sortedEstimatedPrice.length === 1 &&
            (sortedEstimatedPrice[0][0] === 'providedAverage' || sortedEstimatedPrice[0][0] === 'estimatedAverage')) {
            sortedEstimatedPrice = [];
          } else {
            [, maxPrice] = sortedEstimatedPrice[sortedEstimatedPrice.length - 1];
          }
        }
        estimatedPriceBase = estimatedPrice.providedAverage || estimatedPrice.estimatedAverage;
      }

      roomPrices.sort((a, b) => a.price - b.price);

      return (
        <section id="pricing-and-floor-plans">
          <StyledArticle id="pricing-and-floor-plans-price-tiles">
            {!roomPrices.length && estimatedPriceBase &&
              <ConciergeController community={community}>
                {({ concierge }) =>
                  <EstimatedCost
                    getPricing={concierge.getPricing}
                    community={community}
                    price={estimatedPriceBase}
                  />
                }
              </ConciergeController>
            }
            {roomPrices.map((object, i) => (
              <Item key={i}>
                <RoomTile onInquireOrBookClicked={onInquireOrBookClicked} {...object} />
              </Item>
            ))}
          </StyledArticle>
          {sortedEstimatedPrice.length > 0 &&
            <article id="pricing-and-floor-plans-comparison">
              <CompareHeading level="subtitle" size="subtitle">Compare to Local Assisted Living Costs</CompareHeading>
              {sortedEstimatedPrice.map((object, i) => (
                <Fragment key={`${object[0]}_${i}`}>
                  <PriceLabel>{estimatedPriceLabelMap[object[0]]}</PriceLabel>
                  <StyledPriceBar 
                    width={findPercentage(object[1], maxPrice)} 
                    price={object[1]} 
                  />
                </Fragment>
              ))}
            </article>
          }
        </section>
      );
    }
}
