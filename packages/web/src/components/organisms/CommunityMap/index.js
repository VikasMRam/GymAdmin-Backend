import React, { Component } from 'react';
import { string, number, shape, arrayOf, object } from 'prop-types';
import styled from 'styled-components';
import { Marker, InfoWindow } from 'react-google-maps';

import { assetPath } from 'sly/web/components/themes';
import { size } from 'sly/common/components/themes';
import Map from 'sly/web/components/atoms/Map';
import MapTile from 'sly/web/components/molecules/MapTile';

const RedMarker = assetPath('icons/redmarker.png');
const GreenMarker = assetPath('icons/greenmarker.png');

const Wrapper = styled.article`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: ${size('picture.ratios', '4:3')};
  margin-bottom: ${size('spacing.regular')};

  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    height: unset;
    padding-top: unset;
  }
`;

const MapContainerElement = styled.div`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;

  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    position: unset;
    height: ${size('map.propertyDetail.regular.height')};
  }

  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    height: ${size('map.propertyDetail.large.height')};
  }
`;

const iconMap = {
  blue: GreenMarker,
  red: RedMarker,
};

class CommunityMap extends Component {
  static propTypes = {
    community: shape({
      id: string.isRequired,
      name: string.isRequired,
      url: string.isRequired,
      address: shape({
        latitude: number.isRequired,
        longitude: number.isRequired,
      }).isRequired,
    }),
    similarCommunities: object,
    className: string,
  };

  state = {
    activeInfoWindowId: null,
  };

  onMarkerClick = marker => () => {
    this.setState({
      activeInfoWindowId: marker.id,
    });
  };

  onInfoWindowCloseClick = () => {
    this.setState({
      activeInfoWindowId: null,
    });
  };

  render() {
    const {
      community,
      similarCommunities,
      className,
    } = this.props;
    const { latitude, longitude } = community.address;
    const markers = [
      {
        community,
        latitude,
        longitude,
        icon: 'red',
        clickable: false,
      },
    ];

    similarCommunities?.similar?.forEach((prop) => {
      const {
        id,
        imageUrl,
        name,
        startingRate,
        reviewsValue,
        numReviews,
        latitude,
        longitude,
        url,
      } = prop;
      markers.push({
        id,
        community: {
          id,
          mainImage: imageUrl,
          name,
          startingRate,
          propRatings: { reviewsValue, numReviews },
          url,
        },
        latitude,
        longitude,
        icon: 'blue',
        clickable: true,
      });
    });

    const markerComponents = markers.map((marker) => {
      const {
        community,
      } = marker;
      const infoWindowTile = (
        <MapTile tileInfo={community} borderless />
      );
      return (
        <Marker
          key={community.id}
          position={{ lat: marker.latitude, lng: marker.longitude }}
          defaultIcon={iconMap[marker.icon]}
          onClick={this.onMarkerClick(marker)}
        >
          {this.state.activeInfoWindowId === marker.id && (
            <InfoWindow
              key={community.id}
              onCloseClick={this.onInfoWindowCloseClick}
            >
              {infoWindowTile}
            </InfoWindow>
          )}
        </Marker>
      );
    });

    const isMobile = window.innerWidth < 768;
    const defaultZoom = isMobile ? 12 : 13;

    return (
      <Wrapper className={className}>
        <Map
          defaultCenter={{ lat: latitude, lng: longitude }}
          defaultZoom={defaultZoom}
          containerElement={<MapContainerElement />}
        >
          {markerComponents}
        </Map>
      </Wrapper>
    );
  }
}

export default CommunityMap;
