import React from 'react';
import { shallow } from 'enzyme';

import MarketplaceResourceTile from '.';

// import ALArticle from 'sly/storybook/sample-data/marketplace-resource-al-article.json';
import MPOffer from 'sly/storybook/sample-data/marketplace-resource-mp-offer.json';


const wrap = (props = {}) => shallow(<MarketplaceResourceTile marketplaceResource={MPOffer} {...props} />);

describe('Content', () => {
  it('renders', () => {
    const wrapper = wrap();
    expect(wrapper.find('ResponsiveImage')).toHaveLength(1);
    expect(wrapper.find('Button')).toHaveLength(1);
  });
});