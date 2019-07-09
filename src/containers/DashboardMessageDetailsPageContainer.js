import React, { Component } from 'react';
import { arrayOf, object, func } from 'prop-types';
import dayjs from 'dayjs';

import { prefetch, withUser, query } from 'sly/services/newApi';
import userPropType from 'sly/propTypes/user';
import messagePropType from 'sly/propTypes/conversation/conversationMessage';
import conversationPropType from 'sly/propTypes/conversation/conversation';
import { CONVERSTION_PARTICIPANT_RESOURCE_TYPE } from 'sly/constants/resourceTypes';
import { MESSAGES_UPDATE_LAST_READ_TIMEOUT } from 'sly/constants/conversations';
import DashboardMessageDetailsPage from 'sly/components/pages/DashboardMessageDetailsPage';
import withWS from 'sly/services/ws/withWS';
import { NOTIFY_MESSAGE_NEW } from 'sly/constants/notifications';

@prefetch('messages', 'getConversationMessages', (req, { match }) => req({
  'filter[conversationID]': match.params.id,
  sort: '-created_at',
}))

@prefetch('conversation', 'getConversation', (req, { match }) => req({
  id: match.params.id,
}))

@query('updateConversationParticipant', 'updateConversationParticipant')

@withUser

@withWS

export default class DashboardMessageDetailsPageContainer extends Component {
  static propTypes = {
    ws: object.isRequired,
    match: object.isRequired,
    messages: arrayOf(messagePropType),
    conversation: conversationPropType,
    user: userPropType,
    status: object,
    updateConversationParticipant: func.isRequired,
  };

  componentDidMount() {
    const { updateLastReadMessageAt } = this;
    const {
      ws, messages, conversation, user,
    } = this.props;
    ws.on(NOTIFY_MESSAGE_NEW, this.onMessage, { capture: true });

    if (messages && messages.length) {
      const parsedLastestMessageCreatedAt = dayjs(messages[0].createdAt).utc();
      const { conversationParticipants } = conversation;
      const { id: userId } = user;
      const viewingAsParticipant = conversationParticipants.find(p => p.participantID === userId);
      const parsedViewedCreatedAt = dayjs(viewingAsParticipant.stats.lastReadMessageAt).utc();
      if (parsedLastestMessageCreatedAt.isAfter(parsedViewedCreatedAt)) {
        setTimeout(updateLastReadMessageAt, MESSAGES_UPDATE_LAST_READ_TIMEOUT);
      }
    }
  }

  componentWillUnmount() {
    const { ws } = this.props;
    ws.off(NOTIFY_MESSAGE_NEW, this.onMessage);
  }

  onMessage = (message) => {
    const { match, status } = this.props;
    if (message.payload.conversationId === match.params.id) {
      status.messages.refetch();
      // prevent more handlers to be called if page is visible
      return document.hidden;
    }
    return true;
  };

  updateLastReadMessageAt = () => {
    const {
      updateConversationParticipant, conversation, user,
    } = this.props;
    const { conversationParticipants } = conversation;
    const { id: userId } = user;
    const viewingAsParticipant = conversationParticipants.find(p => p.participantID === userId);
    const { id } = viewingAsParticipant;
    const payload = {
      type: CONVERSTION_PARTICIPANT_RESOURCE_TYPE,
      attributes: viewingAsParticipant,
    };
    payload.attributes.stats.unreadMessageCount = 0;
    payload.attributes.stats.lastReadMessageAt = dayjs().utc().format();

    return updateConversationParticipant({ id }, payload)
      .catch((r) => {
        // TODO: Need to set a proper way to handle server side errors
        const { body } = r;
        const errorMessage = body.errors.map(e => e.title).join('. ');
        console.error(errorMessage);
      });
  };

  computeIsStarted = () => {
    const { status } = this.props;
    const { hasStarted: userHasStarted } = status.user;
    const { hasStarted: messagesHasStarted } = status.messages;
    const { hasStarted: conversationHasStarted } = status.conversation;

    return userHasStarted && messagesHasStarted && conversationHasStarted;
  };

  computeIsLoading = () => {
    const { status } = this.props;
    const { isLoading: userIsLoading } = status.user;
    const { isLoading: messagesIsLoading } = status.messages;
    const { isLoading: conversationIsLoading } = status.conversation;
    const isStarted = this.computeIsStarted();

    return !isStarted || userIsLoading || messagesIsLoading || conversationIsLoading;
  };

  render() {
    const { messages, conversation, user } = this.props;
    const isLoading = !this.computeIsStarted() || this.computeIsLoading();
    if (!isLoading && !this.pageLoaded) {
      this.pageLoaded = true;
    }

    return (
      <DashboardMessageDetailsPage
        messages={messages}
        conversation={conversation}
        user={user}
        isLoading={isLoading && !this.pageLoaded}
      />
    );
  }
}
