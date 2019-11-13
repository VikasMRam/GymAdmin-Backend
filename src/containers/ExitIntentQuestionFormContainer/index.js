import React, { PureComponent } from 'react';
import { func, object } from 'prop-types';
import { clearSubmitErrors, reduxForm, reset } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { createValidator, email, required } from 'sly/services/validation';
import { resourceCreateRequest, resourceDetailReadRequest } from 'sly/store/resource/actions';
import { EXIT_INTENT_ASK_QUESTIONS } from 'sly/services/newApi/constants';
import ExitIntentQuestionForm from 'sly/components/organisms/ExitIntentQuestionForm';
import Thankyou from 'sly/components/molecules/Thankyou';
import { getUserDetailsFromUAAndForm } from 'sly/services/helpers/userDetails';
import { query } from 'sly/services/newApi';
import withServerState from 'sly/store/withServerState';
import SlyEvent from 'sly/services/helpers/events';

const formName = 'ExitIntentQuestionForm';
const validate = createValidator({
  name: [required],
  email: [required, email],
  question: [required],
});

const sendEvent = (action, label) => SlyEvent.getInstance().sendEvent({
  category: 'exit-intent',
  action,
  label,
});
const afterSubmit = (result, dispatch) => dispatch(reset(formName));

const ReduxForm = reduxForm({
  form: formName,
  validate,
  onSubmitSuccess: afterSubmit,
})(ExitIntentQuestionForm);

const mapDispatchToProps = dispatch => ({
  postUserAction: data => dispatch(resourceCreateRequest('userAction', data)),
  clearSubmitErrors: () => dispatch(clearSubmitErrors(formName)),
});

const mapPropsToActions = () => ({
  userDetails: resourceDetailReadRequest('userAction'),
});

@withRouter
@withServerState(mapPropsToActions)
@connect(null, mapDispatchToProps)
@query('createAction', 'createUuidAction')
export default class ExitIntentQuestionFormContainer extends PureComponent {
  static propTypes = {
    createAction: func.isRequired,
    userDetails: object,
    postUserAction: func.isRequired,
    location: object,
    showModal: func.isRequired,
  };

  componentDidMount() {
    sendEvent('question-form-open', this.props.location.pathname);
  }

  componentWillUnmount() {
    sendEvent('question-form-close', this.props.location.pathname);
  }

  handleSubmit = (data) => {
    const {
      createAction, userDetails, location: { pathname }, showModal,
    } = this.props;
    const { question } = data;
    const user = getUserDetailsFromUAAndForm({ userDetails, formData: data });

    clearSubmitErrors();

    createAction({
      type: 'UUIDAction',
      attributes: {
        actionType: EXIT_INTENT_ASK_QUESTIONS,
        actionPage: pathname,
        actionInfo: {
          question,
          name: user.full_name,
          email: user.email,
        },
      },
    }).then(() => {
      sendEvent('question-form-send', pathname);
      showModal(<Thankyou />);
    });
  };

  render() {
    const initialValues = {
      question: '',
    };

    return (
      <ReduxForm
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        {...this.props}
      />
    );
  }
}
