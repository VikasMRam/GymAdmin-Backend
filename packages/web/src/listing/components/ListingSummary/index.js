import React from 'react';
import { object, bool, func, string } from 'prop-types';
import styled, { css } from 'styled-components';
import ReactTooltip from 'react-tooltip';

import Tag  from 'sly/web/components/atoms/Tag/newSystem';
import ListItem from 'sly/web/components/molecules/ListItem/newSystem';
import { AVAILABLE_TAGS, PERSONAL_CARE_HOME, ASSISTED_LIVING, PERSONAL_CARE_HOME_STATES, CONTINUING_CARE_RETIREMENT_COMMUNITY, CCRC, ACTIVE_ADULT } from 'sly/web/constants/tags';
import { listing as listingPropType } from 'sly/common/propTypes/listing';
import { Heading, Block, Span, color, Hr, space, Link, sx$laptop, Button, sx$tablet, Grid, Paragraph } from 'sly/common/system';
import CommunityRating from 'sly/web/components/molecules/CommunityRating';
import { isBrowser } from 'sly/web/config';
import { tocPaths } from 'sly/web/services/helpers/url';
import { phoneFormatter } from 'sly/web/services/helpers/phone';
import { showFafNumber, getFafNumber } from 'sly/web/services/helpers/community';
import { Money, Help, Community, SqFt, Bed, Garage, Bathroom, Beds, Favorite, Share } from 'sly/common/icons';
// import Paragraph from 'sly/common/components/atoms/Paragraph';


const overridePosition = ({ left, top }) => ({
  top,
  left: left < 5 ? 5 : left,
});

const StyledHelpIcon = styled(Help)`
  margin-left: ${space('spacing.xxs')};
  color: ${color('slate.lighter-60')};
  vertical-align: text-top;
`;

const TooltipContent = styled(ReactTooltip)`
  padding: ${space('xs')}!important;
  color: ${color('slate')}!important;
  background-color: ${color('white')}!important;
  box-shadow: 0 0 ${space('m')} ${color('slate.lighter-80')}80;
`;

const OverlayTwoColumnListWrapper = styled.div`
  margin-bottom: ${space('m')};
  display: grid;
  grid-template-columns: 100%;
  grid-row-gap: ${space('m')};
  ${sx$laptop({
    gridTemplateColumns: '50% 50%',
  })}
`;


const MobileListingRating = styled(CommunityRating)`
  margin-bottom: ${space('s')};
`;

const getCareTypes = (address, careTypes) => {
  const updatedCareTypes = [];

  const { state, country } = address;

  careTypes.forEach((careType) => {
    const tocBc = tocPaths([careType]);

    const availableTags = AVAILABLE_TAGS[country] || [];

    if (availableTags.includes(careType)) {
      const isPersonalCareHome = PERSONAL_CARE_HOME_STATES.includes(state) && careType === ASSISTED_LIVING;
      let tag = careType;

      if (isPersonalCareHome) {
        tag = PERSONAL_CARE_HOME;
      } else if (careType === CONTINUING_CARE_RETIREMENT_COMMUNITY) {
        tag = CCRC;
      }

      updatedCareTypes.push({ tag, path: tocBc.path });
    }
  });
  return updatedCareTypes;
};

const makeNewTags = (tags) => {
  const tagsMap = {
    Plus: 'harvest.base',
    Verified: 'green',
  };
  const newTags = [];
  tags.forEach(({ id, name }) => {
    if (name === 'Plus' || name === 'Verified') {
      newTags.push({
        name,
        id,
        path: `${name}`,
        background: tagsMap[name],
      });
    }
  });
  return newTags;
};

const ListingSummary = ({
  listing, innerRef, isAdmin, className,
  goToReviews, searchParams, formattedAddress, onSaveClick, onShareClick, isFavorited, onListingNumberClicked,
}) => {
  const {
    address, name, info, twilioNumber, partnerAgents, tags, community,
  } = listing;

  const { phoneNumber, care, startingRate, floorPlan } = info;
  const { ratingValue, numRatings } = info.ratingInfo;


  let conciergeNumber = phoneNumber;

  if (twilioNumber && twilioNumber.numbers && twilioNumber.numbers.length) {
    [conciergeNumber] = twilioNumber.numbers;
  }
  if (!conciergeNumber) {
    conciergeNumber = '8558664515';
  }

  let careTypes = [];
  if (care) {
    careTypes = getCareTypes(address, care);
  }

  const newTags = !!tags && !!tags.length ? makeNewTags(tags) : [];
  console.log('tags', newTags);


  const partnerAgent = partnerAgents && partnerAgents.length > 0 ? partnerAgents[0] : null;

  return (
    <Block pb="l" px="m" sx$laptop={{ px: '0' }} ref={innerRef} className={className}>
      <Heading
        font="title-xl"
        pad="xs"
      >
        {name}
        {isAdmin &&
          <Link
            to={`/dashboard/listings/${listing.id}`}
          >
            &nbsp;(Edit)
          </Link>
        }
      </Heading>

      <Block font="body-s" pad="xs">
        {formattedAddress}
      </Block>


      {ratingValue > 0 &&
        <MobileListingRating
          rating={ratingValue}
          numReviews={numRatings}
          goToReviews={goToReviews}
          reviewsText
        />
      }

      <Block>
        {!!newTags && !!newTags.length &&
          newTags.map(({ name, id, path, background }) => {
            return (
              <Tag
                key={id}
                marginRight="xs"
                background={background}
                color="white"
              >
                <Link
                  color="white"
                  to={path}
                  target="_blank"
                  event={{
                  category: 'new-tags',
                  action: 'tag-click',
                  label: name,
                }}
                >
                  {name}
                </Link>
              </Tag>
            );
          })
        }
        {careTypes.map(careType => (
          <Tag
            key={careType.path}
            marginRight="xs"
          >
            <Link
              color="white"
              to={`${careType.path}/${address.state}/${address.city}`}
              target="_blank"
              event={{
                category: 'care-type-tags',
                action: 'tag-click',
                label: careType.tag,
              }}
            >
              {careType.tag}
            </Link>
          </Tag>
        ))}
      </Block>
      <Block
        padding="m m"
        marginTop="m"
        display="flex"
        background="#e8f1f1"
        flexDirection="column"
        borderRadius="xs"
        sx={{
          gap: '1rem',
        }}
        sx$tablet={{
          padding: 'l l',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '2rem',
        }}
      >
        <Block as="span">
          <Block
            as="span"
            display="flex"
            flexDirection="row"
            alignItems="center"
            css={css`
                gap: 0.2em
              `}
          >
            <Span
              palette="stale"
              pad="small"
              font="body-s"
            >Exclusive Seniorly Price
            </Span>
            <StyledHelpIcon  size="s" data-tip data-for="seniorlyPrice" />
            {isBrowser &&
            <TooltipContent overridePosition={overridePosition} id="seniorlyPrice" type="light" effect="solid" multiline>
              This is special discouted price offered only through Seniorly.
            </TooltipContent>
          }
          </Block>
          <Paragraph
            color="viridian.base"
            pad="small"
          >${startingRate}/month + care fees
          </Paragraph>

        </Block>
        {floorPlan.bedroomCount && (
          <Block as="span">
            <Paragraph
              palette="stale"
              pad="small"
              font="body-s"
            >Bedrooms
            </Paragraph>
            <Paragraph
              color="viridian.base"
              pad="small"
            >{floorPlan.bedroomCount} bd
            </Paragraph>
          </Block>
        )}
        {floorPlan.bathroomCount && (
          <Block as="span">
            <Paragraph
              palette="stale"
              pad="small"
              font="body-s"
            >Bathroom
            </Paragraph>
            <Paragraph
              color="viridian.base"
              pad="small"
            >{floorPlan.bathroomCount} ba
            </Paragraph>
          </Block>
        )}
        {floorPlan.area && (
          <Block as="span">
            <Paragraph
              palette="stale"
              pad="small"
              font="body-s"
            >Square feet
            </Paragraph>
            <Paragraph
              color="viridian.base"
              pad="small"
            >{floorPlan.area}
            </Paragraph>
          </Block>
        )}

      </Block>
      <Hr mt="l" mb="l" />
      <Grid
        gridTemplateColumns="auto"
        sx$tablet={{
        gridTemplateColumns: !phoneNumber && !partnerAgent ? 'auto' : '35% 1fr',
        gridGap: !phoneNumber && !partnerAgent ? '0' : 'xl' }}
      >
        <Grid gridTemplateColumns="1fr 1fr" gridGap="s">
          <Button sx$tablet={{ paddingX: 's' }} onClick={onSaveClick}  variant="neutral"><Favorite active={isFavorited} color={isFavorited && 'red.lighter-20'} mr="xs" />Save</Button>
          <Button sx$tablet={{ paddingX: 's' }} onClick={onShareClick} variant="neutral" ><Share mr="xs" />Share</Button>
        </Grid>
        <Hr mt="l" mb="l" sx$tablet={{ display: 'none' }} />
      </Grid>
      <Hr mt="l" display="none" sx$tablet={{ display: 'block' }} />
      {
        phoneNumber &&
        <Block
          display="flex"
          flexDirection="column"
          sx$tablet={{
            display: 'none',
          }}
        >
          <Span
            display="flex"
            alignItems="center"
            css={css`
            gap: 0.2em
            `}
          >
            <Span font="body-s">Contact us about this room</Span>
            <StyledHelpIcon  size="s" data-tip data-for="fafPhone" />
            {isBrowser &&
            <TooltipContent overridePosition={overridePosition} id="fafPhone" type="light" effect="solid" multiline>
              This phone number may connect you to the listing front desk.
            </TooltipContent>
          }
          </Span>
          <Link href={`tel:${phoneNumber}`} onClick={onListingNumberClicked}>
            {phoneFormatter(phoneNumber, true)}
          </Link>
          <Hr mt="l" display="block" />
        </Block>
      }
    </Block>
  );
};

ListingSummary.propTypes = {
  listing: listingPropType.isRequired,
  innerRef: object,
  isAdmin: bool,
  className: string,
  goToReviews: func,
  searchParams: object,
  formattedAddress: string,
  onSaveClick: func,
  onShareClick: func,
  isFavorited: bool,
};

export default ListingSummary;
