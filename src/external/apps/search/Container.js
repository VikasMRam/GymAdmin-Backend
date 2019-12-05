import React, { Component } from 'react';
import { object } from 'prop-types';
import { withRouter } from 'react-router-dom';

import { getSearchParamFromPlacesResponse } from 'sly/services/helpers/agents';
import { getSearchParams } from 'sly/services/helpers/search';
import { parseURLQueryParams, objectToURLQueryParams } from 'sly/services/helpers/url';
import { withProps } from 'sly/services/helpers/hocs';
import SearchComponent from 'sly/external/apps/search/Component';

@withRouter

@withProps(({ match, location }) => ({
  searchParams: getSearchParams(match, location),
  queryParams: parseURLQueryParams(location.search),
}))

export default class SearchContainer extends Component {
  static propTypes = {
    searchParams: object,
    queryParams: object,
    history: object,
  };

  state = {
    locationInfo: {
      city: null,
      state: null,
    },
  };

  onLocationSearch = (result) => {
    const { history, queryParams } = this.props;
    const searchParams = getSearchParamFromPlacesResponse(result);

    this.setState({
      locationInfo: searchParams,
    });
    queryParams['page-number'] = undefined;
    history.replace({
      search: objectToURLQueryParams(queryParams),
    });
  }

  render() {
    const { onLocationSearch } = this;
    const { locationInfo } = this.state;
    const { searchParams, queryParams } = this.props;
    const { palette } = queryParams;

    return (
      <SearchComponent
        onLocationSearch={onLocationSearch}
        locationInfo={locationInfo}
        pageNumber={searchParams['page-number']}
        palette={palette}
      />
    );
  }
}

