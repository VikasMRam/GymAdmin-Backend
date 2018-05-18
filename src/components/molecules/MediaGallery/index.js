import React, { Component, Fragment } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { palette } from 'styled-theme';
import { ifProp } from 'styled-tools';

import { size } from 'sly/components/themes';
import { Icon, Image } from 'sly/components/atoms';
import ThumbnailScroller from 'sly/components/molecules/ThumbnailScroller';

const videoMimeTypes = {
  mp4: 'video/mp4',
  webm: 'video/webm',
};

const CarouselWrapper = styled.div`
  position: relative;
  background: ${ifProp('transparent', 'transparent', palette('grayscale', 1))};
  text-align: center;
  margin-bottom: ${size('spacing.large')};
  ${props =>
    !props.autoHeight &&
    css`
      height: ${size('carousel.mobile')};
      @media screen and (min-width: ${size('breakpoint.tablet')}) {
        height: ${size('carousel.tablet')};
      }
    `};
`;
const StyledImg = styled(Image)`
  width: 100%;
  object-fit: cover;
  ${props =>
    !props.autoHeight &&
    css`
      max-height: ${size('carousel.mobile')};
      @media screen and (min-width: ${size('breakpoint.tablet')}) {
        max-height: ${size('carousel.tablet')};
      }
    `};
`;
const StyledVideo = styled.video`
  width: 100%;
  object-fit: fill;
  ${props =>
    !props.autoHeight &&
    css`
      max-height: ${size('carousel.mobile')};
      @media screen and (min-width: ${size('breakpoint.tablet')}) {
        max-height: ${size('carousel.tablet')};
      }
    `};
`;
const StyledIcon = styled(Icon)`
  position: absolute;
  z-index: 100;
  margin: auto;
  top: 0;
  bottom: 0;

  :hover {
    cursor: pointer;
  }
`;
const PrevSlide = styled(StyledIcon)`
  left: ${size('spacing.large')};
`;
const NextSlide = styled(StyledIcon)`
  right: ${size('spacing.large')};
`;
const TopRightWrapper = styled.span`
  right: ${size('spacing.large')};
  top: ${size('spacing.xLarge')};
  position: absolute;
  z-index: 1;
`;
const BottomLeftWrapper = styled.span`
  left: ${size('spacing.large')};
  bottom: ${size('spacing.large')};
  position: absolute;
  z-index: 1;
`;
const sliderComponentStyle = {
  alignItems: 'center',
};
const slideStyle = {
  position: 'relative',
  overflow: 'initial',
};
const PlayIcon = styled(Icon)`
  position: absolute;
  top: 44%;
  left: 50%;
  font-size: ${size('icon.xLarge')};

  :hover {
    cursor: pointer;
  }
`;
const StyledSlide = styled.span`
  :hover {
    cursor: ${ifProp('hasOnSlideClick', 'pointer', 'initial')};
  }
`;

export default class MediaGallery extends Component {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
      thumb: PropTypes.string.isRequired,
      ofVideo: PropTypes.number,
    })),
    videos: PropTypes.arrayOf(PropTypes.shape({
      src: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      })),
      name: PropTypes.string.isRequired,
      thumb: PropTypes.string.isRequired,
      alt: PropTypes.string,
    })),
    showThumbnails: PropTypes.bool,
    autoHeight: PropTypes.bool,
    currentSlide: PropTypes.number,
    topRightSection: PropTypes.func,
    bottomLeftSection: PropTypes.func,
    transparent: PropTypes.bool,
    onSlideClick: PropTypes.func,
    onSlideChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    images: [],
    videos: [],
    showThumbnails: false,
    autoHeight: false,
    currentSlide: 0,
  };

  setLoadedImages(index) {
    if (index - 1 >= 0) {
      this.mediaLoaded.add(index - 1);
    }
    if (index === 0) {
      this.mediaLoaded.add(this.allMedia.length - 1);
    }
    this.mediaLoaded.add(index);
    if (index < this.allMedia.length) {
      this.mediaLoaded.add(index + 1);
    }
    if (index === this.allMedia.length - 1) {
      this.mediaLoaded.add(0);
    }
  }

  thumbnailRefs = [];
  mediaRefs = [];
  allMedia = [];
  mediaLoaded = new Set();

  handleChangeIndex = (index) => {
    // pause playing videos
    this.mediaRefs.forEach((mediaRef) => {
      if (mediaRef.pause) {
        mediaRef.pause();
      }
    });
    // chrome and firefox does not respect video autoplay attribute
    if (this.mediaRefs[index] && this.mediaRefs[index].play) {
      this.mediaRefs[index].play();
    }

    this.props.onSlideChange(index);
  };

  nextSlide = () => {
    const { currentSlide } = this.props;
    const numItems = this.allMedia.length;
    this.handleChangeIndex(currentSlide === numItems - 1 ? 0 : currentSlide + 1);
  };

  prevSlide = () => {
    const { currentSlide } = this.props;
    const numItems = this.allMedia.length;
    this.handleChangeIndex(currentSlide === 0 ? numItems - 1 : currentSlide - 1);
  };

  shouldLoadMedia = (i) => {
    const { currentSlide } = this.props;
    const numItems = this.allMedia.length;
    // media can be loaded if:
    // - it's already loaded(user viewed the slide)
    // - it's current slide
    // - it's one before current slide
    // - it's one after current slide
    return this.mediaLoaded.has(i) || (Math.abs(i - currentSlide) < 2) ||
      // if the current slide is last slide then also load first slide
      // if the current slide is first slide then also load last slide
      (currentSlide === 0 && i === numItems - 1) || (currentSlide === numItems - 1 && i === 0);
  };

  generateSlideContent = (media, index) => {
    const { autoHeight, currentSlide } = this.props;
    const playIcon = (
      <PlayIcon
        key="media-gallery-play-button"
        icon="play"
        size="large"
        palette="white"
      />
    );
    const slide = [];

    switch (media.type) {
      case 'image': {
        if (media.ofVideo !== undefined) {
          slide.push(playIcon);
        }
        slide.push((
          <StyledImg
            key="media-gallery-slide"
            autoHeight={autoHeight}
            src={this.shouldLoadMedia(index) ? media.src : ''}
            data-src={media.src}
            alt={media.alt}
            innerRef={(c) => { this.mediaRefs[index] = c; }}
          />
        ));
        break;
      }
      case 'video':
        slide.push((
          <StyledVideo
            key="media-gallery-slide"
            autoPlay={index === currentSlide}
            controls
            controlsList="nodownload"
            innerRef={(c) => { this.mediaRefs[index] = c; }}
          >
            {media.src.map((src, i) => (
              <source
                key={i}
                src={this.shouldLoadMedia(index) ? src.url : ''}
                type={videoMimeTypes[src.type]}
              />
            ))}
          </StyledVideo>
        ));
        break;
      default: break;
    }
    return slide;
  };

  render() {
    const {
      currentSlide, videos, images, topRightSection, bottomLeftSection, showThumbnails, onSlideClick, onSlideChange, autoHeight,
    } = this.props;
    const thumbnails = [];
    const formattedVideos = videos.map((video) => {
      thumbnails.push({
        src: video.thumb,
        alt: `${video.alt} thumbnail`,
      });
      return { ...video, type: 'video' };
    });
    const formattedImages = images.map((image) => {
      thumbnails.push({
        src: image.thumb,
        alt: `${image.alt} thumbnail`,
      });
      return { ...image, type: 'image' };
    });
    this.allMedia = formattedVideos.concat(formattedImages);
    /* load only media before and after current slide. Also keep track of media that was loaded once so that it won't
      be inserted and removed from dom when user switch slides */
    this.setLoadedImages(currentSlide);
    const slideViews = this.allMedia.map((media, i) => (
      <StyledSlide
        key={i}
        autoHeight={autoHeight}
        hasOnSlideClick={onSlideClick}
        onClick={() => onSlideClick && onSlideClick(i)}
      >
        {this.generateSlideContent(media, i)}
      </StyledSlide>
    ));

    return (
      <Fragment>
        {/* TODO: replace with <> </> after upgrading to babel 7 & when eslint adds support for jsx fragments */}
        <CarouselWrapper {...this.props}>
          <PrevSlide
            className="media-carousel-control-prev"
            icon="chevron-left"
            size="large"
            palette="white"
            onClick={this.prevSlide}
          />
          {topRightSection &&
            <TopRightWrapper>
              {topRightSection(this.allMedia[currentSlide])}
            </TopRightWrapper>
          }
          <SwipeableViews
            containerStyle={sliderComponentStyle}
            slideStyle={slideStyle}
            onChangeIndex={onSlideChange}
            enableMouseEvents
            index={currentSlide}
          >
            {slideViews}
          </SwipeableViews>
          <NextSlide
            className="media-carousel-control-next"
            icon="chevron-right"
            size="large"
            palette="white"
            onClick={this.nextSlide}
          />
          {bottomLeftSection &&
            <BottomLeftWrapper>
              {bottomLeftSection(this.allMedia[currentSlide])}
            </BottomLeftWrapper>
          }
        </CarouselWrapper>
        {showThumbnails &&
          <ThumbnailScroller
            palette="white"
            thumbnails={thumbnails}
            selected={currentSlide}
            onClick={this.handleChangeIndex}
          />
        }
      </Fragment>
    );
  }
}
