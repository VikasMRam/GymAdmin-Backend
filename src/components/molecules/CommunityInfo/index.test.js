import React from 'react';
import { shallow } from 'enzyme';
import NumberFormat from 'react-number-format';

import { formatRating } from 'sly/services/helpers/rating';
import CommunityInfo from 'sly/components/molecules/CommunityInfo';
import { ClampedText } from 'sly/components/atoms';

import RhodaGoldmanPlaza from 'sly/../private/storybook/sample-data/property-rhoda-goldman-plaza.json';

const wrap = (props = {}) => shallow(<CommunityInfo community={RhodaGoldmanPlaza} {...props} />);
const palette = 'danger';

describe('CommunityInfo', () => {
  const verifyData = (wrapper, community) => {
    const {
      webViewInfo, startingRate, estimated, propRatings,
    } = community;
    let { reviewsValue } = community;
    if (propRatings) {
      ({ reviewsValue } = propRatings);
    }
    if (webViewInfo) {
      const {
        firstLineValue,
        secondLineValue,
      } = webViewInfo;
      if (firstLineValue) {
        const livingTypes = firstLineValue.split(',');
        livingTypes.forEach((livingType) => {
          expect(wrapper.find('LastIconTextWrapper').at(0).find(ClampedText).dive()
            .contains(livingType)).toBe(true);
        });
      } else {
        expect(wrapper.find('LastIconTextWrapper')).toHaveLength(0);
      }
      if (secondLineValue) {
        const roomTypes = secondLineValue.split(',');
        roomTypes.forEach((roomType) => {
          expect(wrapper.find('IconTextWrapper').at(0).find(ClampedText).dive()
            .contains(roomType)).toBe(true);
        });
      } else {
        expect(wrapper.find('IconTextWrapper')).toHaveLength(0);
      }
    }
    const rateRendered = wrapper.find('RatingWrapper').find('Rate').dive().dive();
    expect(rateRendered.find(NumberFormat)
      .dive()
      .text()
      .replace(',', '')).toContain(startingRate);
    if (estimated) {
      expect(rateRendered.text()).toContain('Estimated');
    }
    if (reviewsValue) {
      const reviewsValueFixed = formatRating(reviewsValue);
      expect(wrapper.find('Rating').contains(reviewsValueFixed)).toBe(true);
    } else {
      expect(wrapper.find('Rating').contains('Not Yet Rated')).toBe(true);
    }
  };

  it('renders', () => {
    const wrapper = wrap();
    verifyData(wrapper, RhodaGoldmanPlaza);
  });

  it('renders with palette', () => {
    const wrapper = wrap({ palette });
    expect(wrapper.instance().props.palette).toBe(palette);
    verifyData(wrapper, RhodaGoldmanPlaza);
  });

  it('renders with estimated price', () => {
    const newRhodaGoldmanPlaza = { ...RhodaGoldmanPlaza };
    newRhodaGoldmanPlaza.estimated = true;
    const wrapper = wrap({ community: newRhodaGoldmanPlaza });
    verifyData(wrapper, newRhodaGoldmanPlaza);
  });

  it('renders without reviews', () => {
    const newRhodaGoldmanPlaza = { ...RhodaGoldmanPlaza };
    newRhodaGoldmanPlaza.reviewsValue = null;
    const wrapper = wrap({ community: newRhodaGoldmanPlaza });
    verifyData(wrapper, newRhodaGoldmanPlaza);
  });

  it('renders without FloorPlans & LivingTypes', () => {
    const newRhodaGoldmanPlaza = { ...RhodaGoldmanPlaza };
    newRhodaGoldmanPlaza.webViewInfo = undefined;
    const wrapper = wrap({ community: newRhodaGoldmanPlaza });
    verifyData(wrapper, newRhodaGoldmanPlaza);
  });
});