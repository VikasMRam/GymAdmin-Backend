import React, { Component } from 'react';
import { oneOf, object } from 'prop-types';
import styled from 'styled-components';

import Modal from 'sly/components/molecules/Modal';
import AdvancedInfoContainer from 'sly/containers/AdvancedInfoContainer';
import SimilarCommunitiesContainer from 'sly/containers/SimilarCommunitiesContainer';
import Thankyou from 'sly/components/molecules/Thankyou';

const appElement = document.querySelector('#app');

const steps = {
  advancedInfo: {
    content: AdvancedInfoContainer,
    layout: 'single'
  },
  similarCommunities: {
    content: SimilarCommunitiesContainer,
    layout: 'single'
  },
  thankyou: {
    content: Thankyou
  },
};

export default class RCBModal extends Component {
  static propTypes = {
    community: object.isRequired,
  };

  state = {
    currentStep: 'advancedInfo',
  };

  nextStep = (...args) => {
    const { currentStep } = this.state;
    const stepKeys = Object.keys(steps);
    const stepIndex = stepKeys.indexOf(currentStep);
    const nextStepIndex = stepIndex + 1;
    if(nextStepIndex < stepKeys.length) {
      this.setState({ currentStep: stepKeys[nextStepIndex] });
    }
  };

  onSubmit = (...args) => {
    const { onSubmit } = this.props;
    console.log('submitting', args);
    onSubmit(...args);
  };

  render() {
    const { onClose, isOpen, community, ...props } = this.props;
    const { currentStep } = this.state;
    const layout = steps[currentStep].layout;
    const StepComponent = steps[currentStep].content;

    return (
      <Modal appElement={appElement} onClose={onClose} isOpen={isOpen} layout={layout} closeable {...props}>
        <StepComponent community={community} next={this.nextStep} {...props} />
      </Modal>
    );
  }
}

