import React, { Component } from 'react';

import { Redirect } from 'react-router';
import { object, number, func, bool, string } from 'prop-types';

import withServerState from 'sly/store/withServerState';

import {
  getDetail,
  getHomePageMediaGalleryCurrentSlideIndex,
  isHomePageMediaGalleryFullscreenActive,
  isCommunityDetailPageStickyHeaderActive,
} from 'sly/store/selectors';

import CommunityDetailPage from 'sly/components/pages/CommunityDetailPage';

import { resourceDetailReadRequest } from 'sly/store/resource/actions';
import { getSearchParamFromPlacesResponse, filterLinkPath } from 'sly/services/helpers/search';
import { gotoSlide, toggleFullscreenMediaGallery, toggleStickyHeader } from 'sly/store/communityDetailPage/actions';

import ErrorPage from 'sly/components/pages/Error';

class CommunityDetailPageContainer extends Component {
  static propTypes = {
    community: object,
    errorCode: number,
    history: object,
    mediaGallerySlideIndex: number,
    isMediaGalleryFullscreenActive: bool,
    gotoMediaGallerySlide: func,
    toggleFullscreenMediaGallery: func,
    isStickyHeaderVisible: bool,
    toggleStickyHeader: func,
    user: object,
    isQuestionModalOpenValue: bool,
    setIsQuestionModalOpenValue: func,
  };

  handleMediaGallerySlideChange = (slideIndex) => {
    const { gotoMediaGallerySlide } = this.props;
    gotoMediaGallerySlide(slideIndex);
  };

  handleToggleMediaGalleryFullscreen = () => {
    const { toggleFullscreenMediaGallery } = this.props;
    /*
    let event = {action:'show',category:'images',label:this.props.community.id};
    SlyEvent.getInstance().sendEvent(event);
    let event = {action:'submit',category:'requestavailability',label:this.props.community.id};
    SlyEvent.getInstance().sendEvent(event);
    let event = {action:'submit',category:'requestavailability',label:this.props.community.id};
    let event = {action:'contactCommunity',category:'requestCallback',label:this.props.community.id};
    SlyEvent.getInstance().sendEvent(event);
    */
    toggleFullscreenMediaGallery();
  };

  handleOnLocationSearch = (result) => {
    const { history } = this.props;
    const searchParams = getSearchParamFromPlacesResponse(result);
    const { path } = filterLinkPath(searchParams);
    history.push(path);
  };

  handleToggleStickyHeader = () => {
    const { toggleStickyHeader } = this.props;
    toggleStickyHeader();
  };

  render() {
    const {
      mediaGallerySlideIndex,
      isMediaGalleryFullscreenActive,
      user,
      community,
      errorCode,
      redirectUrl,
      history,
      isStickyHeaderVisible,
    } = this.props;

    if (errorCode) {

      if (redirectUrl) { /* Slug has Changed */
        const { location } = history;
        const { pathname } = location;
        //Replace last part of pathname
        let fullPaths = pathname.split('/');
        fullPaths[fullPaths.length - 1] = redirectUrl;
        return <Redirect to={fullPaths.join('/')}/>
      }
      if ( errorCode === 404) { /* Not found so redirect to city page */
        const { location } = history;
        const { pathname } = location;
        //Replace last part of pathname
        let lastIdx = pathname.lastIndexOf('/');
        return <Redirect to={pathname.substring(0,lastIdx)} state={{status:302}}/>
      }

      return <ErrorPage errorCode={errorCode} history={history} />;
    }

    if (!community) {
      return <div />;
    }

    // If request url does not match resource url from api, perform 302 redirect
    const { location } = history;
    const { pathname } = location;
    const { url } = community;
    if (pathname !== url) {
      history.push(url);
    }

    return (
      <CommunityDetailPage
        user={user}
        community={community}
        mediaGallerySlideIndex={mediaGallerySlideIndex}
        onLocationSearch={this.handleOnLocationSearch}
        onMediaGallerySlideChange={this.handleMediaGallerySlideChange}
        onMediaGalleryToggleFullscreen={this.handleToggleMediaGalleryFullscreen}
        isMediaGalleryFullscreenActive={isMediaGalleryFullscreenActive}
        isStickyHeaderVisible={isStickyHeaderVisible}
        onToggleStickyHeader={this.handleToggleStickyHeader}
      />
    );
  }
}

const getCommunitySlug = match => match.params.communitySlug;
const mapStateToProps = (state, { match }) => {
  const communitySlug = getCommunitySlug(match);
  const mediaGallerySlideIndex = getHomePageMediaGalleryCurrentSlideIndex(state);
  const isMediaGalleryFullscreenActive = isHomePageMediaGalleryFullscreenActive(state);
  const isStickyHeaderVisible = isCommunityDetailPageStickyHeaderActive(state);
  return {
    user: getDetail(state, 'user', 'me'),
    community: getDetail(state, 'community', communitySlug),
    mediaGallerySlideIndex,
    isMediaGalleryFullscreenActive,
    isStickyHeaderVisible,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    gotoMediaGallerySlide: slideIndex => dispatch(gotoSlide(slideIndex)),
    toggleFullscreenMediaGallery: () => dispatch(toggleFullscreenMediaGallery()),
    toggleStickyHeader: () => dispatch(toggleStickyHeader()),
  };
};

const fetchData = (dispatch, { match }) =>
  Promise.all([
    dispatch(resourceDetailReadRequest('community', getCommunitySlug(match), {
      include: 'similar-communities,questions,agents',
    })),
    dispatch(resourceDetailReadRequest('userAction')),
  ]);

const handleError = (err) => {

  if (err.response) {

    if (err.response.status !== 200) {

      if (err.location) {
        let redUrl = err.location.split('/');
        return { errorCode: err.response.status,
          redirectUrl:redUrl[redUrl.length - 1]
        };

      }
      return { errorCode: err.response.status };
    }
    return { errorCode: null };
  }
  throw err;
};

export default withServerState({
  mapStateToProps,
  mapDispatchToProps,
  fetchData,
  handleError,
})(CommunityDetailPageContainer);
