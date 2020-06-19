import React, { Component } from 'react';
import { object, string } from 'prop-types';
import { withRouter } from 'react-router';

import { query } from 'sly/web/services/api';

@query('createAction', 'createUuidAction')
@withRouter
export default class PageViewActionContainer extends Component {
  static typeHydrationId = 'PageViewActionContainer';
  static propTypes = {
    actionInfo: object.isRequired,
    actionType: string.isRequired,
  };

  componentDidMount() {
    const { match, createAction, actionType, actionInfo } = this.props;

    createAction({
      type: 'UUIDAction',
      attributes: {
        actionInfo,
        actionPage: match.url,
        actionType,
      },
    });
  }

  render() {
    return null;
  }
}