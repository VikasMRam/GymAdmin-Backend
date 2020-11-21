import React, { useCallback, useMemo, useState, createRef } from 'react';
import { arrayOf, func, string, object, number } from 'prop-types';

import {
  getBoundsForSearchResults,
  findOptimalZoomForBounds,
  findOptimalZoomForResults, getBoundsCenter,
} from './maps';
import ExploreContainer from './ExploreContainer';

import { getHelmetForSearchPage } from 'sly/web/services/helpers/html_headers';
import { getKey } from 'sly/common/components/themes';
import {
  TemplateHeader,
} from 'sly/web/components/templates/BasePageTemplate';
import HeaderContainer from 'sly/web/containers/HeaderContainer';
import Footer from 'sly/web/components/organisms/Footer';
import Map from 'sly/web/components/search/Map';
import coordPropType from 'sly/common/propTypes/coordPropType';
import Block from 'sly/common/components/atoms/Block';
import Icon from 'sly/common/components/atoms/Icon';
import Link from 'sly/common/components/atoms/Link';
import Heading from 'sly/common/components/atoms/Heading';
import CommunityTile from 'sly/web/components/organisms/CommunityTile';
import Filters from 'sly/web/components/search/Filters';
import { LIST, MAP, PAGE_SIZE, SHOW_OPTIONS } from 'sly/web/components/search/constants';
import FilterButton from 'sly/web/components/search/Filters/FilterButton';
import useDimensions from 'sly/common/components/helpers/useDimensions';
import SearchPagination from 'sly/web/components/search/SearchPagination';
import { tocs, getTocSeoLabel } from 'sly/web/components/search/helpers';
import { titleize } from 'sly/web/services/helpers/strings';
import { getStateAbbr } from 'sly/web/services/helpers/url';



const Search = ({
  currentFilters,
  onFilterChange,
  onClearFilters,
  communities,
  meta,
  pagination,
  location
}) => {
  const [headerRef, {
    height: headerHeight = 80,
  }] = useDimensions();

  const [filtersRef, {
    height: filtersHeight = 84,
  }] = useDimensions();

  const { upToLaptopOffset, startingWithLaptopOffset } = useMemo(() => ({
    upToLaptopOffset: filtersHeight + headerHeight,
    startingWithLaptopOffset: headerHeight,
  }), [filtersHeight, headerHeight]);

  const [show, setShow] = useState(LIST);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [hoveredCommunity, setHoveredCommunity] = useState(null);
  const [communityIndex, setCommunityIndex] = useState(null);

  const page = currentFilters['page-number'] || 0;

  const listSize = meta['filtered-count'];

  const nextShow = useMemo(() => {
    const showOptions = Object.keys(SHOW_OPTIONS);
    const current = showOptions.indexOf(show);
    return showOptions[Number(!current)];
  }, [show]);

  const toggleShow = useCallback(() => {
    setShow(nextShow);
  }, [nextShow]);

  // console.log('bounds', { zoom, center, boundsCenter, bounds })

  const onMarkerClick = (key, index) => {
    setSelectedCommunity(key);
    setCommunityIndex(parseInt(index)+1);
  };


  const stateStr = titleize(currentFilters.state);
  const cityStr = titleize(currentFilters.city);
  const tocLabel = getTocSeoLabel(currentFilters.toc);
  const locationStr = cityStr ? `${cityStr}, ${stateStr}` : `${stateStr}`;

  const title = `${tocLabel} in ${locationStr}`;


  return (
    <>
    {getHelmetForSearchPage({
      ...currentFilters, url: location, communityList: communities, listSize,
    })}
      <TemplateHeader
        ref={headerRef}
        noBottomMargin
        css={{
          position: 'fixed',
          zIndex: 1000,
          width: '100%',
        }}
      >
        <HeaderContainer />
          { /*<BannerNotificationAdContainer
          type="wizardSearch"
          {...currentFilters}
        /> */}
      </TemplateHeader>

      {/* SEARCH */}
      <Block
        flexDirection="column"
        css={{
          paddingTop: headerHeight,
        }}
        upToLaptop={{
          display: 'flex',
        }}
        startingWithLaptop={{
          display: 'grid',
          gridTemplateRows: 'auto auto',
          gridTemplateColumns: '684px auto',
          gridTemplateAreas: '"filters map" "list  map"',
        }}
      >
        <Block
          gridArea="filters"
          padding="xLarge"
        >

          {listSize &&
          <Block size="caption">
            {listSize} results
          </Block>
          }
          <Heading level="hero" size="subtitle">{title}</Heading>
          <Filters
            ref={filtersRef}
            currentFilters={currentFilters}
            onFilterChange={onFilterChange}
            onClearFilters={onClearFilters}
          >

            <FilterButton
              upTo="laptop"
              marginLeft="auto"
              onClick={toggleShow}
            >
              <Icon icon={nextShow} />&nbsp;{SHOW_OPTIONS[nextShow]}
            </FilterButton>
          </Filters>
        </Block>

        <Block
          gridArea="list"
          upToTablet={{
            paddingBottom: getKey('sizes.spacing.xxLarge'),
          }}
          upToLaptop={{
            display: show === LIST ? 'block' : 'none',
          }}
        >
          {communities.map((community, i) => (
            <Link
              key={community.id}
              to={community.url}
              onMouseEnter={() => setHoveredCommunity(community)}
              onMouseLeave={() => setHoveredCommunity(null)}
              event={{
                category: 'SearchPage',
                action: 'communityClick',
                label: i,
                value: community.id,
              }}
              block
            >
              <CommunityTile
                noGallery
                community={community}
                margin="0 xLarge xLarge"
                layout="column"
                index={(page*PAGE_SIZE)+(i+1)}
                event={{
                  category: 'SearchPage',
                  action: 'communityClick',
                  label: i,
                  value: community.id,
                }}
              />
            </Link>
          ))}
          <SearchPagination
            currentFilters={currentFilters}
            pagination={pagination}
          />
          <ExploreContainer filters={currentFilters} />
        </Block>
        <Block
          gridArea="map"
        >
          <Map
            communities={communities}
            page={page}
            pageSize = {PAGE_SIZE}
            meta={meta}
            onFilterChange={onFilterChange}
            onMarkerClick={onMarkerClick}
            selectedCommunity={selectedCommunity}
            communityIndex={communityIndex}
            hoveredCommunity={hoveredCommunity}
            width="100%"
            upToLaptop={{
              display: show === MAP ? 'block' : 'none',
              paddingTop: `${upToLaptopOffset}px`,
              marginTop: `-${upToLaptopOffset}px`,
              height: '100vh',
            }}
            startingWithLaptop={{
              position: 'sticky',
              top: '0px !important',
              paddingTop: `${startingWithLaptopOffset}px`,
              marginTop: `-${startingWithLaptopOffset}px`,
              height: '100vh',
            }}
          />
        </Block>
      </Block>
      {/* SEARCH_END */}
      <Footer
        upToLaptop={{
          display: show === LIST ? 'block' : 'none',
        }}
      />
    </>
  );
};

Search.propTypes = {
  show: string,
  setShow: func,
  setClickedMarker: func,
  center: coordPropType,
  defaultCenter: coordPropType,
  onSearchSubmit: func,
  onFilterChange: func,
  onClearFilters: func,
  communities: arrayOf(coordPropType),
  onMapChange: func,
  selectedCommunity: coordPropType,
  currentFilters: object,
  current: number,
  total: number,
  start: number,
  end: number,
  count: number,
  basePath: string,
};

export default Search;
