import React, { Component } from 'react';
import { reduxForm, SubmissionError, clearSubmitErrors } from 'redux-form';
import { connect } from 'react-redux';
import { func, bool } from 'prop-types';

import { withUser } from 'sly/services/newApi';
import { createValidator, required, email, minLength } from 'sly/services/validation';
import SignupForm from 'sly/components/organisms/SignupForm';

const validate = createValidator({
  email: [required, email],
  password: [required, minLength(8)],
});

const ReduxForm = reduxForm({
  form: 'SignupForm',
  validate,
})(SignupForm);

const mapDispatchToProps = dispatch => ({
  clearSubmitErrors: () => dispatch(clearSubmitErrors('SignupForm')),
});

@withUser()

@connect(null, mapDispatchToProps)

export default class SignupFormContainer extends Component {
  static propTypes = {
    registerUser: func,
    clearSubmitErrors: func,
    submitFailed: bool,
    onSubmitSuccess: func,
  };

  handleSubmit = (data) => {
    const { registerUser, clearSubmitErrors, onSubmitSuccess } = this.props;
    clearSubmitErrors();
    return registerUser(data).then(onSubmitSuccess).catch((data) => {
      // TODO: Need to set a proper way to handle server side errors
      const errorMessage = Object.values(data.body.errors).join('. ');
      throw new SubmissionError({ _error: errorMessage });
    });
  };

  render() {
    return <ReduxForm onSubmit={this.handleSubmit} {...this.props} />;
  }
}
