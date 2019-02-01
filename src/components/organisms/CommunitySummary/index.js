import React, { Fragment } from 'react';
import { object, bool, func, string } from 'prop-types';
import NumberFormat from 'react-number-format';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';

import { size } from 'sly/components/themes';
import { community as communityPropType } from 'sly/propTypes/community';
import { Link, Box, Heading, Hr, Icon, Button } from 'sly/components/atoms';
import CommunityPricingAndRating from 'sly/components/molecules/CommunityPricingAndRating';

const Address = styled(Heading)`
  margin-bottom: ${size('spacing.xLarge')};
`;

const StyledHeading = styled(Heading)`
  margin-bottom: ${size('spacing.regular')};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: space-between;
  > *:first-child {
    margin-bottom: ${size('spacing.xLarge')};
  }

  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    flex-direction: row;
    align-items: center;
    > *:first-child {
      margin-bottom: 0;
    }
  }
`;

const StyledButton = styled(Button)`
  margin-right: ${size('spacing.regular')};
`;

const CommunitySummary = ({
  community, innerRef, isAdmin, onConciergeNumberClicked, className,
  onFavouriteClick, isFavourited, onShareClick,
}) => {
  const {
    address, name, startingRate, propRatings, propInfo, twilioNumber,
  } = community;
  const {
    line1, line2, city, state, zip,
  } = address;
  const { communityPhone } = propInfo;
  const { reviewsValue } = propRatings;
  const formattedAddress = `${line1}, ${line2}, ${city},
    ${state}
    ${zip}`
    .replace(/\s/g, ' ')
    .replace(/, ,/g, ', ');
  let conciergeNumber = communityPhone;
  if (twilioNumber && twilioNumber.numbers && twilioNumber.numbers.length) {
    [conciergeNumber] = twilioNumber.numbers;
  }
  if (!conciergeNumber) {
    conciergeNumber = '8558664515';
  }

  return (
    <Box innerRef={innerRef} className={className}>
      <StyledHeading level="hero" size="title">
        {name}
        {isAdmin &&
          <Link
            to={`/mydashboard#/mydashboard/communities/${community.id}/about`}
          >
            &nbsp;(Edit)
          </Link>
        }
      </StyledHeading>
      <Address weight="regular" level="subtitle" size="body" palette="grey">{formattedAddress}</Address>
      {startingRate > 0 && reviewsValue > 0 && <Hr />}
      <Wrapper>
        <div>
          {conciergeNumber &&
            <Fragment>
              For pricing and availability, call&nbsp;
              <Link href={`tel:${conciergeNumber}`} onClick={onConciergeNumberClicked}>
                <NumberFormat
                  value={conciergeNumber}
                  format="###-###-####"
                  displayType="text"
                />
              </Link>
            </Fragment>
          }
        </div>
        <div>
          <StyledButton ghost palette="slate" onClick={onShareClick}>
            <Icon icon="share" size="regular" palette="slate" /> Share
          </StyledButton>
          {!isFavourited &&
            <Button ghost palette="slate" onClick={onFavouriteClick}>
              <Icon icon="favourite-empty" size="regular" palette="slate" /> Save
            </Button>
          }
          {isFavourited &&
            <Button ghost palette="slate" onClick={onFavouriteClick}>
              <Icon icon="favourite-light" size="regular" palette="primary" /> Save
            </Button>
          }
        </div>
      </Wrapper>
      <Hr />
      <CommunityPricingAndRating price={startingRate} rating={reviewsValue} />
    </Box>
  );
};

CommunitySummary.propTypes = {
  community: communityPropType.isRequired,
  innerRef: object,
  isAdmin: bool,
  onConciergeNumberClicked: func,
  className: string,
  onFavouriteClick: func,
  onShareClick: func,
  isFavourited: bool,
};

export default CommunitySummary;
