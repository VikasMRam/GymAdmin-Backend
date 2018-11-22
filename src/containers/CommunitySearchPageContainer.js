import React, { Component } from 'react';
import { object, number, array, bool, func } from 'prop-types';
import queryString from 'query-string';

import withServerState from 'sly/store/withServerState';
import SlyEvent from 'sly/services/helpers/events';

import { resourceListReadRequest } from 'sly/store/resource/actions';
import ErrorPage from 'sly/components/pages/Error';
import CommunitySearchPage from 'sly/components/pages/CommunitySearchPage';
import { toggleModalFilterPanel } from 'sly/store/communitySearchPage/actions';

import {
  getList,
  getListMeta,
  isCommunitySearchPageModalFilterPanelActive,
  isResourceListRequestInProgress,
} from 'sly/store/selectors';

import {
  filterLinkPath,
  getSearchParams,
} from 'sly/services/helpers/search';

class CommunitySearchPageContainer extends Component {
  static propTypes = {
    searchParams: object.isRequired,
    history: object.isRequired,
    location: object.isRequired,
    communityList: array.isRequired,
    geoGuide: array,
    requestMeta: object.isRequired,
    errorCode: number,
    isModalFilterPanelVisible: bool,
    toggleModalFilterPanel: func,
    isFetchingResults: bool,
  };

  // TODO Define Search Parameters
  toggleMap = () => {
    const event = {
      changedParams: {
        view: 'map', 'page-number': 0, 'page-size': 50, searchOnMove: true, radius: '10',
      },
    };
    if (this.props.searchParams && this.props.searchParams.view === 'map') {
      event.changedParams = { view: 'list', 'page-size': 15 };
    }
    this.changeSearchParams(event);
  };

  changeSearchParams = ({ changedParams }) => {
    const { searchParams, history } = this.props;
    const { path } = filterLinkPath(searchParams, changedParams);
    const event = {
      action: 'search', category: searchParams.toc, label: queryString.stringify(searchParams),
    };
    SlyEvent.getInstance().sendEvent(event);

    history.push(path);
  };

  removeSearchFilters = ({ paramsToRemove }) => {
    const { searchParams, history } = this.props;

    const changedParams = paramsToRemove.reduce((cumul, param) => {
      cumul[param] = undefined;
      return cumul;
    }, {});

    const { path } = filterLinkPath(searchParams, changedParams);

    history.push(path);
  };

  handleToggleModalFilterPanel = () => {
    const { toggleModalFilterPanel } = this.props;
    toggleModalFilterPanel();
  };

  handleOnAdTileClick = () => {
    this.changeSearchParams({ changedParams: { modal: 'cawWizard' } });
  };

  render() {
    const {
      searchParams,
      errorCode,
      communityList,
      geoGuide,
      requestMeta,
      location,
      history,
      isModalFilterPanelVisible,
      isFetchingResults,
    } = this.props;

    // TODO Add Error Page
    if (errorCode) {
      return <ErrorPage errorCode={errorCode} history={history} />;
    }

    const isMapView = searchParams.view === 'map';
    const gg = geoGuide && geoGuide.length > 0 ? geoGuide[0] : {};
    return (
      <CommunitySearchPage
        isMapView={isMapView}
        requestMeta={requestMeta}
        toggleMap={this.toggleMap}
        searchParams={searchParams}
        onParamsChange={this.changeSearchParams}
        onParamsRemove={this.removeSearchFilters}
        communityList={communityList}
        geoGuide={gg}
        location={location}
        isModalFilterPanelVisible={isModalFilterPanelVisible}
        onToggleModalFilterPanel={this.handleToggleModalFilterPanel}
        onAdTileClick={this.handleOnAdTileClick}
        isFetchingResults={isFetchingResults}
      />
    );
  }
}

const mapStateToProps = (state, { match, location }) => {
  const searchParams = getSearchParams(match, location);
  const isModalFilterPanelVisible = isCommunitySearchPageModalFilterPanelActive(state);
  return {
    searchParams,
    communityList: getList(state, 'searchResource', searchParams),
    isFetchingResults: isResourceListRequestInProgress(state, 'searchResource'),
    requestMeta: getListMeta(state, 'searchResource', searchParams),
    geoGuide: getList(state, 'geoGuide', searchParams),
    isModalFilterPanelVisible,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    toggleModalFilterPanel: () => dispatch(toggleModalFilterPanel()),
  };
};

const fetchData = (dispatch, { match, location }) => {
  const searchParams = getSearchParams(match, location);
  return Promise.all([
    dispatch(resourceListReadRequest('searchResource', searchParams)),
    dispatch(resourceListReadRequest('geoGuide', searchParams)),
  ]);
  // return dispatch(resourceListReadRequest('searchResource', searchParams));
};

const handleError = (err) => {
  if (err.response) {
    if (err.response.url && err.response.url.match(/geo-guide/)) {
      // Ignore
      return;
    }
    if (err.response.status !== 200) {
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
})(CommunitySearchPageContainer);
