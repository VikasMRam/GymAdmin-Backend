import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { array, bool, func, object } from 'prop-types';
import { palette } from 'styled-theme';

import { size } from 'sly/components/themes';

import { titleize } from 'sly/services/helpers/strings';
import { getHelmetForSearchPage } from 'sly/services/helpers/html_headers';

import CommunitySearchPageTemplate from 'sly/components/templates/CommunitySearchPageTemplate';
import { Heading, Button } from 'sly/components/atoms';
import CommunitySearchList from 'sly/components/organisms/CommunitySearchList';
import CommunityFilterList from 'sly/components/organisms/CommunityFilterList';
import SeoLinks from 'sly/components/organisms/SeoLinks';

import { getTocSearchLabel } from 'sly/services/helpers/search';
import SearchMap from 'sly/components/organisms/SearchMap';
import IconButton from 'sly/components/molecules/IconButton';

const TopWrapper = styled.div`
  padding-bottom: ${size('spacing.xLarge')};
  margin-bottom: ${size('spacing.xLarge')};
  border-bottom: ${size('border.regular')} solid ${palette('grayscale', 2)};

  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    display: none;
  }

  > button {
    margin-right: ${size('spacing.large')};
  }
`;
const SearchMapContainer = styled(SearchMap)`
  width: 100%;
  height: 100%;
`;

export default class StateSearchPage extends Component {
  static propTypes = {
    communityList: array.isRequired,
    geoGuide: object,
    requestMeta: object.isRequired,
    isMapView: bool,
    toggleMap: func,
    onParamsChange: func,
    onParamsRemove: func,
    onAdTileClick: func,
    location: object,
    searchParams: object,
  };



  render() {
    const {
      isMapView,
      toggleMap,
      onAdTileClick,
      searchParams,
      onParamsChange,
      onParamsRemove,
      requestMeta,
      communityList,
      geoGuide,
      location,
    } = this.props;
    const listSize = requestMeta['filtered-count'];
    const state = titleize(searchParams.state);
    const tocLabel = getTocSearchLabel(searchParams.toc);

    let latitude = 0;
    let longitude = 0;
    if (communityList.length > 0) {
      ([{ latitude, longitude }] = communityList);
    }
    if (searchParams.searchOnMove && searchParams.latitude && searchParams.longitude) {
      latitude = parseFloat(searchParams.latitude);
      longitude = parseFloat(searchParams.longitude);
    }

    const TopContent = () => {
      if (geoGuide && geoGuide.guideContent) {
        let gg = geoGuide.guideContent;
        if (gg.autoDescription) {
          return (<Fragment>
            <Heading level="hero" size="title">
              {listSize} {tocLabel} in {state}
            </Heading>
            <div dangerouslySetInnerHTML={{__html: gg.autoDescription}}/>
          </Fragment>);
        }

      }

      return (
        <Fragment>
          <Heading level="hero" size="title">
            {listSize} {tocLabel} in {state}
          </Heading>
        </Fragment>);
    };


    const ListContent = ()=> {
      /**
       * Order of appearance as in editor :
       * description, <p>1</p>
       guide, <p>2</p>
       hospitals, <p>3</p>
       resources, <p>4</p>
       neighborhoods, <p>5</p>
       hospitals, <p>6</p>
       reviews, <p>7</p>
       */
      if (geoGuide && geoGuide.guideContent) {
        const additionalDivs = [];
        const gg = geoGuide.guideContent;
        ['description', 'guide', 'hospitals', 'transportation',
          'sports', 'cultural', 'weather', 'reviews'].forEach((p) => {
          if (gg[p]){
            additionalDivs.push(<div dangerouslySetInnerHTML={{ __html: gg[p] }} key={p} />);
          }
        });
        if (gg.seoLinks) {
          additionalDivs.push(<SeoLinks title="Assisted Living in Nearby Cities" links={gg.seoLinks} />);
        }

        return <Fragment>
          <CommunitySearchList
            communityList={communityList}
            onParamsChange={onParamsChange}
            onParamsRemove={onParamsRemove}
            searchParams={searchParams}
            requestMeta={requestMeta}
            onAdTileClick={onAdTileClick}
          />
          {additionalDivs}

        </Fragment>

      }
      //If No Geo Content just return same
      return (<CommunitySearchList
        communityList={communityList}
        onParamsChange={onParamsChange}
        onParamsRemove={onParamsRemove}
        searchParams={searchParams}
        requestMeta={requestMeta}
        onAdTileClick={onAdTileClick}
      />);
    };


    return (
      <Fragment>
        {/* TODO: replace with <> </> after upgrading to babel 7 & when eslint adds support for jsx fragments */}
        {getHelmetForSearchPage({ ...searchParams, url: location, communityList })}
        <CommunitySearchPageTemplate
          column={<div></div>}
        >
          {!isMapView && (
            TopContent()
          )}

          <TopWrapper>
            {isMapView && (
              <IconButton icon="list" ghost transparent onClick={toggleMap}>
                View List
              </IconButton>
            )}
            {!isMapView && (
              <IconButton icon="map" ghost transparent onClick={toggleMap}>
                View Map
              </IconButton>
            )}
          </TopWrapper>

          {!isMapView && (
            ListContent()
          )}
          {isMapView && (
            <SearchMapContainer
              latitude={latitude}
              longitude={longitude}
              communityList={communityList}
              searchParams={searchParams}
              onParamsChange={onParamsChange}
            />
          )}
        </CommunitySearchPageTemplate>
      </Fragment>
    );
  }
}
