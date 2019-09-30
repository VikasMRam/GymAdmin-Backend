/* eslint-disable react/self-closing-comp */
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { object, arrayOf, func } from 'prop-types';
import queryString from 'query-string';

import theme from 'sly/components/themes/default';
import { size, gridColumns, assetPath } from 'sly/components/themes';
import { getPaginationData } from 'sly/services/helpers/pagination';
import pad from 'sly/components/helpers/pad';
import shadow from 'sly/components/helpers/shadow';
import { Image, Centered, Link, Block } from 'sly/components/atoms';
import Pagination from 'sly/components/molecules/Pagination';
import Heading from 'sly/components/atoms/Heading';
import CommunityFilterBar from 'sly/components/organisms/CommunityFilterBar';
import CommunityTile from 'sly/components/organisms/CommunityTile';

const CommunityFilterBarWrapper = styled.div`
  display: none;

  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    display: block;
  }
`;
const StyledLink = pad(styled(Link)`
  display: block;
`, 'xLarge');

const StyledHeading = styled(Heading)`
  margin-bottom: ${size('spacing.large')};
`;

const MSCColumnWrapper = styled.div`
  margin-bottom: ${size('spacing.xLarge')};
  ${gridColumns(1, size('spacing.xLarge'))};

  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    ${gridColumns(2, size('spacing.xLarge'))};
  }

  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    ${gridColumns(3, size('spacing.xLarge'))};
  }
`;

const PaddedPagination = pad(Pagination, 'small');

const ShadowCommunityTile = shadow(styled(CommunityTile)`
  position: relative;
`);

const mostSearchedCities = [
  {
    to: '/assisted-living/california/san-francisco',
    image: assetPath('images/cities/SanFrancisco.jpeg'),
    subtitle: 'San Francisco, CA',
    title: '95+ communities',
  },
  {
    to: '/assisted-living/california/los-angeles',
    image: assetPath('images/cities/LosAngeles.jpeg'),
    subtitle: 'Los Angeles, CA',
    title: '105+ communities',
  },
  {
    to: '/assisted-living/california/san-diego',
    image: assetPath('images/cities/SanDiego.jpeg'),
    subtitle: 'San Diego, CA',
    title: '75+ communities',
  },
];

const usefulInformationTiles = [
  {
    to: '/independent-living',
    image: assetPath('images/home/useful-info/independent-living.jpg'),
    title: 'Independent Living',
  },
  {
    to: '/assisted-living',
    image: assetPath('images/home/useful-info/assisted-living.jpg'),
    title: 'Assisted Living',
  },
  {
    to: '/memory-care',
    image: assetPath('images/home/useful-info/memory-care.jpg'),
    title: 'Memory Care',
  },
];

const CommunitySearchList = ({
  communityList, requestMeta, searchParams, onAdTileClick, onCommunityClick, location, ...props
}) => {
  let mostSearchedCitiesComponents = null;
  let usefulInformationTilesComponents = null;

  if (communityList.length < 1) {
    mostSearchedCitiesComponents = mostSearchedCities.map(mostSearchedCity => (
      <StyledLink key={mostSearchedCity.title} to={mostSearchedCity.to}>
        <Image src={mostSearchedCity.image} aspectRatio="4:3">
          <Centered>
            <Heading palette="white" size="subtitle" level="subtitle">{mostSearchedCity.subtitle}</Heading>
            <Block palette="white">{mostSearchedCity.title}</Block>
          </Centered>
        </Image>
      </StyledLink>
    ));
    usefulInformationTilesComponents = usefulInformationTiles.map(usefulInformation => (
      <StyledLink key={usefulInformation.title} to={usefulInformation.to}>
        <Image src={usefulInformation.image} aspectRatio="4:3">
          <Centered>
            <Heading size="subtitle" palette="white">{usefulInformation.title}</Heading>
          </Centered>
        </Image>
      </StyledLink>
    ));
  }

  const components = communityList.map((similarProperty, index) => {
    const target = global.innerWidth && global.innerWidth >= parseInt(theme.sizes.breakpoint.laptop, 10)
      ? `community_profile_${similarProperty.id}`
      : '_self';
    return (
      <StyledLink
        target={target}
        key={similarProperty.id}
        to={similarProperty.url}
        rel="noopener"
        onClick={() => onCommunityClick(index, similarProperty.id)}

      >
        <ShadowCommunityTile community={similarProperty} layout="column" imageSize="regular" noGallery showDescription showSeeMoreButtonOnHover />
      </StyledLink>
    );
  });
  // components.splice(adIndex, 0, <AdTileWrapper key="ad" ><AdTile {...searchAdProps} onClick={() => onAdTileClick()} /></AdTileWrapper>);
  const { current, total } = getPaginationData(requestMeta);
  const count = requestMeta['filtered-count'];
  const present = (requestMeta['page-number'] * requestMeta['page-size']);
  const start = present + 1;
  const end = (present + requestMeta['page-size']  > count ? count : present);

  // pagination pathname
  let params = {};
  if (location.search) {
    params = queryString.parse(location.search);
  }
  if (params['page-number']) {
    delete params['page-number'];
  }
  const qs = queryString.stringify(params);
  let basePath = location.pathname;
  if (qs.length > 0) {
    basePath = `${basePath}?${qs}`;
  }

  return (
    <Fragment>
      {/* TODO: replace with <> </> after upgrading to babel 7 & when eslint adds support for jsx fragments */}
      <CommunityFilterBarWrapper>
        <CommunityFilterBar searchParams={searchParams} {...props} />
      </CommunityFilterBarWrapper>
      {components}
      {communityList.length < 1 &&
        <Fragment>
          {/* TODO: replace with <> </> after upgrading to babel 7 & when eslint adds support for jsx fragments */}
          <StyledHeading size="subtitle">Explore homes in popular cities</StyledHeading>
          <MSCColumnWrapper>
            {mostSearchedCitiesComponents}
          </MSCColumnWrapper>
          <StyledHeading size="subtitle">Learn more about senior care</StyledHeading>
          <MSCColumnWrapper>
            {usefulInformationTilesComponents}
          </MSCColumnWrapper>
        </Fragment>
      }
      <Fragment>
        {`Showing ${start} to ${end} of ${count}`}
      </Fragment>
      {communityList.length > 0 &&
        <Fragment>
          <PaddedPagination basePath={basePath} pageParam="page-number" current={current} total={total} />
        </Fragment>
      }
    </Fragment>
  );
};

CommunitySearchList.propTypes = {
  requestMeta: object.isRequired,
  searchParams: object.isRequired,
  onParamsChange: func.isRequired,
  onAdTileClick: func.isRequired,
  communityList: arrayOf(object).isRequired,
  location: object.isRequired,
  onCommunityClick: func.isRequired,
};

export default CommunitySearchList;
