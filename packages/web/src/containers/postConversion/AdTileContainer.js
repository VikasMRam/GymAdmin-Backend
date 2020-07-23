import React, { Component } from 'react';
import { func, oneOf, string } from 'prop-types';
import styled from 'styled-components';

import { size } from 'sly/common/components/themes';
import { assetPath } from 'sly/web/components/themes';
import SlyEvent from 'sly/web/services/helpers/events';
import { hcaAdEnabled } from 'sly/web/services/helpers/tileAds';
import { HOME_CARE_REQUESTED } from 'sly/web/services/api/constants';
import withNotification from 'sly/web/controllers/withNotification';
import AdTile from 'sly/web/components/organisms/AdTile';
import { ResponsiveImage } from 'sly/web/components/atoms';
import Modal, { HeaderWithClose, PaddedHeaderWithCloseBody } from 'sly/web/components/atoms/NewModal';
import AskQuestionToAgentFormContainer from 'sly/web/containers/AskQuestionToAgentFormContainer';
import { community as communityProptype } from 'sly/common/propTypes/community';

const StyledResponsiveImage = styled(ResponsiveImage)`
  vertical-align: middle;
  margin-left: ${size('spacing.regular')};
  margin-right: ${size('spacing.regular')};
`;

@withNotification

export default class PostConversionAdTileContainer extends Component {
  static propTypes = {
    notifyInfo: func.isRequired,
    type: oneOf(['askAgent', 'homeCare', 'getOffer']).isRequired,
    community: communityProptype,
    tocLabel: string,
  };

  static defaultProps = {
    type: 'homeCare',
  };

  state = {
    isModalOpen: false,
    modalMessagePrompt: '',
    modalHeading: '',
    modalAction: HOME_CARE_REQUESTED,
  };

  componentDidMount() {
    const { type } = this.props;
    SlyEvent.getInstance().sendEvent({
      action: 'view',
      category: `PostConversionAdTile-${type}`,
      nonInteraction: true,
    });
  }

  handleGetInstantOfferClick = () => {
    SlyEvent.getInstance().sendEvent({
      action: 'click-get-instant-offer-button',
      category: 'PostConversionAdTile',
    });
  };

  handleUseHomecareClick = () => {
    SlyEvent.getInstance().sendEvent({
      action: 'click-use-homecare-button',
      category: 'PostConversionAdTile',
    });
    this.setState({
      isModalOpen: true,
      modalMessagePrompt: 'Please give us a little more information on what services you are currently looking for?',
      modalHeading: 'In-home caregivers can serve as a vital support system to keep seniors cared for and safe.',
      modalMessagePlaceholder: 'Type your care needs here',
      modalAction: HOME_CARE_REQUESTED,
    });
  };

  handleClose = () => {
    SlyEvent.getInstance().sendEvent({
      action: 'close-ask-agent-question-modal',
      category: 'PostConversionAdTile',
    });
    this.setState({
      isModalOpen: false,
    });
  };

  handleComplete = () => {
    const { notifyInfo } = this.props;

    notifyInfo('We have received your request and we will get back to you soon.');
    this.handleClose();
  };

  render() {
    const { type, community } = this.props;
    const { isModalOpen, modalHeading, modalMessagePrompt, modalAction, modalMessagePlaceholder } = this.state;
    let zip;
    let isHCA = false;
    if (community) {
      ({ address: { zip } } = community);
      (isHCA = hcaAdEnabled({ zip }));
    }

    return (
      <>
        {type === 'getOffer' &&
        <AdTile
          title="Moving into senior living and selling your home?"
          buttonText="Find out if my home is eligible"
          layout="row"
          image={assetPath('vectors/house-sold.svg')}
          buttonProps={{
            target: '_blank',
            href: 'https://www.zillow.com/offers/?t=seniorly-0220',
            onClick: this.handleGetInstantOfferClick,
          }}
          {...this.props}
        >
          Check out <StyledResponsiveImage src={assetPath('vectors/zillow.svg')} /> Offers for a no obligation cash offer.
        </AdTile>
        }
        {type === 'homeCare' && isHCA &&
        <AdTile
          title="During Covid-19 In-Home Care can be a safe temporary option."
          buttonText="Get Free Consultation"
          buttonPosition="left"
          image={assetPath('images/homecare-2.png')}
          buttonProps={{ onClick: this.handleUseHomecareClick }}
          showSecondary
          linkProps={{href:"tel:+18558668719"}}
          linkText="(855) 866-8719"
          {...this.props}
        >
          Have pre-screened caregivers at your home
        </AdTile>
        }
        {type === 'homeCare' && !isHCA &&
        <AdTile
          title="During Covid-19 In-Home Care can be a safe temporary option."
          buttonText="Get Free Consultation"
          buttonPosition="left"
          image={assetPath('images/homecare-ad.png')}
          buttonProps={{ onClick: this.handleUseHomecareClick }}
          {...this.props}
        >
          Have pre-screened caregivers at your home
        </AdTile>
        }
        {isModalOpen &&
        <Modal onClose={this.handleClose}>
          <HeaderWithClose onClose={this.handleClose} />
          <PaddedHeaderWithCloseBody>
            <AskQuestionToAgentFormContainer
              heading={modalHeading}
              messagePrompt={modalMessagePrompt}
              messagePlaceholder={modalMessagePlaceholder}
              image={assetPath('images/agents.png')}
              buttonKind="regular"
              postSubmit={this.handleComplete}
              actionType={modalAction}
              showMessageFieldFirst
              hideMessage
            />
          </PaddedHeaderWithCloseBody>
        </Modal>
        }
      </>
    );
  }
}
