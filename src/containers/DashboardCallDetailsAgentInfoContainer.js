import React, { Fragment, Component } from 'react';
import { string } from 'prop-types';
import { prefetch, query } from 'sly/services/newApi';
import AgentSummary from 'sly/components/molecules/AgentSummary';


@prefetch('communities', 'getCommunities', (getCommunities, { callNumber }) => {
  const filters = {
    'filter[phone]': callNumber,
  };
  return getCommunities(filters);
})

export default class DashboardCallDetailsAgentInfoContainer extends Component {
  static propTypes = {
    callNumber: string,
  };
  render() {
    const { communities, callNumber } = this.props;

    console.log('Seeing Communities inside agent info',communities);
    const meta = { lookingFor: [], gender: [], timeToMove:[], monthlyBudget:[] };
    const possibleAgents = [];

    return (
      <div>
        <h2> The number was from ${callNumber} </h2>
        <hr />
        <possibleAgents />
      </div>

    );
  }
}
