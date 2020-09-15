import React, { Component } from 'react';
import { object, func } from 'prop-types';

import SlyEvent from 'sly/web/services/helpers/events';
import withNotification from 'sly/web/controllers/withNotification';
import AgentsPage from 'sly/web/components/pages/AgentsPage';

@withNotification

export default class AgentsPageContainer extends Component {
  static propTypes = {
    history: object,
    notifyInfo: func,
  };

  handleLocationSearch = (result) => {
    const { history } = this.props;
    const event = {
      action: 'submit', category: 'agentsSearch', label: result.displayText,
    };
    SlyEvent.getInstance().sendEvent(event);

    history.push(result.url);
  };

  handleConsultationRequested = () => {
    const { notifyInfo } = this.props;

    notifyInfo('We have received your request and we will get back to you soon.');
  };

  render() {
    const { history } = this.props;
    const { location } = history;

    return (
      <AgentsPage
        onLocationSearch={this.handleLocationSearch}
        location={location}
        onConsultationRequested={this.handleConsultationRequested}
      />
    );
  }
}

