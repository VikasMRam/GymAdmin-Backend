import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, SubmissionError, clearSubmitErrors } from 'redux-form';
import { func, string, object, shape } from 'prop-types';
import { withRouter } from 'react-router';

import SlyEvent from 'sly/services/helpers/events';
import { query, withUser } from 'sly/services/newApi';
import { ASK_QUESTION } from 'sly/services/api/actions';
import {
  createValidator,
  required,
  usPhone,
  email,
} from 'sly/services/validation';
import userPropType from 'sly/propTypes/user';
import { community as communityPropType } from 'sly/propTypes/community';
import CommunityAskQuestionAgentForm from 'sly/components/organisms/CommunityAskQuestionAgentForm';
import { getDetail } from 'sly/store/selectors';
import { AGENT_ASK_QUESTIONS } from 'sly/services/newApi/constants';

const validate = createValidator({
  full_name: [required],
  email: [required, email],
  phone: [required, usPhone],
  question: [required],
});
const formName = 'CommunityAskQuestionAgentForm';
const ReduxForm = reduxForm({
  form: formName,
  validate,
})(CommunityAskQuestionAgentForm);

const mapDispatchToProps = dispatch => ({
  clearSubmitErrors: () => dispatch(clearSubmitErrors(formName)),
});

@withUser

@withRouter

@connect(
  mapDispatchToProps,
)

@query('createAction', 'createUuidAction')

export default class CommunityAskQuestionAgentFormContainer extends Component {
  static propTypes = {
    notifyInfo: func.isRequired,
    clearSubmitErrors: func.isRequired,
    toggleAskAgentQuestionModal: func.isRequired,
    community: communityPropType,
    createAction: func.isRequired,
    match: shape({ url: string }),
    heading: string,
    description: string,
    agentImageUrl: string,
    placeholder: string,
    user: userPropType,
    question: string,
  };

  handleOnSubmit = (data) => {
    const {
      notifyInfo, clearSubmitErrors, toggleAskAgentQuestionModal,
      community, createAction, match,
    } = this.props;
    const { id } = community;

    clearSubmitErrors();

    return createAction({
      type: 'UUIDAction',
      attributes: {
        actionType: AGENT_ASK_QUESTIONS,
        actionPage: match.url,
        actionInfo: {
          slug: id,
          question: data.question,
          entityType: 'Property',
          name: data.full_name,
          phone: data.phone,
        },
      },
    }).then(() => {
      const event = {
        action: 'ask-question', category: 'BAT', label: id,
      };
      SlyEvent.getInstance().sendEvent(event);
      toggleAskAgentQuestionModal();
      notifyInfo('Question sent successfully.');
    }).catch(() => {
      throw new SubmissionError({ _error: 'Failed to send question. Please try again.' });
    });
  };

  render() {
    const {
      heading, description, agentImageUrl, placeholder, user, question,
    } = this.props;

    let initialValues = {
      question,
    };
    if (user) {
      initialValues = {
        ...initialValues,
        full_name: user.name,
        phone: user.phoneNumber,
      };
    }

    return (
      <ReduxForm
        initialValues={initialValues}
        user={user}
        onSubmit={this.handleOnSubmit}
        placeholder={placeholder}
        heading={heading}
        description={description}
        agentImageUrl={agentImageUrl}
      />
    );
  }
}

