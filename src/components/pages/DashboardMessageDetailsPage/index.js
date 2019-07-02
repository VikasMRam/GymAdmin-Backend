import React, { Fragment } from 'react';
import { arrayOf, bool } from 'prop-types';
// import { Redirect } from 'react-router-dom'; todo: uncomment after isLoading is fixed
import styled from 'styled-components';

import { size } from 'sly/components/themes';
import {
  AGENT_DASHBOARD_MESSAGES_PATH,
  FAMILY_DASHBOARD_MESSAGES_PATH,
//  DASHBOARD_PATH, todo: uncomment after isLoading is fixed
} from 'sly/constants/dashboardAppPaths';
import { CUSTOMER_ROLE, AGENT_ROLE } from 'sly/constants/roles';
import messagePropType from 'sly/propTypes/conversation/conversationMessage';
import conversationPropType from 'sly/propTypes/conversation/conversation';
import userPropType from 'sly/propTypes/user';
import Role from 'sly/components/common/Role';
import textAlign from 'sly/components/helpers/textAlign';
import fullWidth from 'sly/components/helpers/fullWidth';
import pad from 'sly/components/helpers/pad';
import DashboardPageTemplate from 'sly/components/templates/DashboardPageTemplate';
import { Block } from 'sly/components/atoms';
import ConversationMessages from 'sly/components/organisms/ConversationMessages';
import HeadingBoxSection from 'sly/components/molecules/HeadingBoxSection';
import BackLink from 'sly/components/molecules/BackLink';
import SendMessageFormContainer from 'sly/containers/SendMessageFormContainer';

const TextCenterBlock = styled(textAlign(Block))`
  height: 100%;
`;

const FullWidthTextCenterBlock = fullWidth(TextCenterBlock);

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledHeadingBoxSection = styled(HeadingBoxSection)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledSendMessageFormContainer = pad(styled(SendMessageFormContainer)`
  margin-left: ${size('spacing.xLarge')};
  margin-right: ${size('spacing.xLarge')};
  margin-top: ${size('spacing.xLarge')};
  flex-grow: 0;
`, 'large');

const StyledConversationMessages = styled(ConversationMessages)`
  flex-grow: 1;
  overflow: auto;
`;

const DashboardMessageDetailsPage = ({
  user, conversation, isLoading, messages,
}) => {
  let heading = '';
  let conversationParticipants = [];
  let viewingAsParticipant;
  let otherParticipant;

  // todo: remove && conversation after isLoading is fixed
  if (!isLoading && conversation) {
    ({ conversationParticipants } = conversation);
    const { id } = user;
    viewingAsParticipant = conversationParticipants.find(p => p.participantID === id);
    (otherParticipant = conversationParticipants.find(p => p.participantID !== id));
    const name = otherParticipant && otherParticipant.participantInfo ? otherParticipant.participantInfo.name : '';

    heading = (
      <HeaderWrapper>
        <Role is={CUSTOMER_ROLE}>
          <BackLink to={FAMILY_DASHBOARD_MESSAGES_PATH} />
        </Role>
        <Role is={AGENT_ROLE}>
          <BackLink to={AGENT_DASHBOARD_MESSAGES_PATH} />
        </Role>
        <FullWidthTextCenterBlock size="subtitle" palette="primary">{name}</FullWidthTextCenterBlock>
      </HeaderWrapper>
    );
  }

  return (
    <DashboardPageTemplate activeMenuItem="Messages" bodyHasOverflow>
      {/* todo: uncomment after isLoading is fixed
      !isLoading && !viewingAsParticipant && <Redirect to={DASHBOARD_PATH} /> */}
      {viewingAsParticipant &&
        <StyledHeadingBoxSection heading={heading} hasNoBodyPadding>
          {isLoading &&
            <Block size="caption">Loading...</Block>
          }
          {!isLoading &&
            <Fragment>
              {(messages.length ? (
                <StyledConversationMessages
                  viewingAsParticipant={viewingAsParticipant}
                  messages={messages}
                  participants={conversationParticipants}
                />
              ) : <Fragment><br /><TextCenterBlock size="caption">No messages</TextCenterBlock></Fragment>)}
              <StyledSendMessageFormContainer otherParticipant={otherParticipant} />
            </Fragment>
          }
        </StyledHeadingBoxSection>
      }
    </DashboardPageTemplate>
  );
};

DashboardMessageDetailsPage.propTypes = {
  messages: arrayOf(messagePropType),
  conversation: conversationPropType,
  user: userPropType,
  isLoading: bool,
};

export default DashboardMessageDetailsPage;
