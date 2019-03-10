import React from 'react';
import styled from 'styled-components';
import { func, bool } from 'prop-types';

import { Button } from 'sly/components/atoms/index';

const MainButton = styled(Button)`
  width: 100%;
`;
MainButton.displayName = 'MainButton';


const CommunityActions = ({ onGCPClick, isAlreadyPricingRequested }) => (
  <div>
    {!isAlreadyPricingRequested &&
    <MainButton kind="jumbo" onClick={onGCPClick}>Get custom pricing</MainButton>}
    {isAlreadyPricingRequested &&
    <MainButton ghost kind="jumbo" onClick={onGCPClick}>Pricing requested</MainButton>}
  </div>
);

CommunityActions.propTypes = {
  onBookATourClick: func,
  onGCPClick: func,
  onAQClick: func,
  isAlreadyTourScheduled: bool,
  isAlreadyPricingRequested: bool,
};

export default CommunityActions;
