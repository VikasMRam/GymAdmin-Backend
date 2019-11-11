import React, { Component } from 'react';
import { func } from 'prop-types';
import loadable from '@loadable/component';

import withModal from 'sly/controllers/withModal';
import CommunityAgentSection from 'sly/components/molecules/CommunityAgentSection';
import agentPropType from 'sly/propTypes/agent';

const AdvisorHelpPopup = loadable(() => import(/* webpackChunkName: "chunkAdvisorHelpPopup" */ 'sly/components/molecules/AdvisorHelpPopup'));

@withModal
export default class CommunityAgentSectionContainer extends Component {
  static typeHydrationId = 'CommunityAgentSectionContainer'
  static propTypes = {
    agent: agentPropType.isRequired,
    showModal: func,
    closeModal: func,
  };

  render() {
    const { agent, showModal, hideModal } = this.props;
    return (
      <CommunityAgentSection
        agent={agent}
        onAdvisorHelpClick={() =>
          showModal(<AdvisorHelpPopup onButtonClick={hideModal} />)
        }
      />
    );
  }
}
