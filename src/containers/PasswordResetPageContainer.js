import React, { Component } from 'react';
import { reduxForm, SubmissionError, clearSubmitErrors } from 'redux-form';
import { func } from 'prop-types';
import { connect } from 'react-redux';

import { createValidator, required } from 'sly/services/validation';
import { resourceCreateRequest } from 'sly/store/resource/actions';

import PasswordResetPage from 'sly/components/pages/PasswordResetPage';

const validate = createValidator({
  password: [required],
});
const ReduxForm = reduxForm({
  form: 'PasswordResetForm',
  validate,
})(PasswordResetPage);

class PasswordResetPageContainer extends Component {
  static propTypes = {
    resetPassword: func,
    clearSubmitErrors: func,
    onSubmitSuccess: func,
  };

  handleOnSubmit = (values) => {
    const { resetPassword, onSubmitSuccess, clearSubmitErrors } = this.props;
    const { password } = values;
    const payload = { password };

    clearSubmitErrors();
    return resetPassword(payload).then(onSubmitSuccess).catch((r) => {
      // TODO: Need to set a proper way to handle server side errors
      const { response } = r;
      return response.json().then((data) => {
        const errorMessage = Object.values(data.errors).join('. ');
        throw new SubmissionError({ _error: errorMessage });
      });
    });
  }

  render() {
    return (
      <ReduxForm
        onSubmit={this.handleOnSubmit}
        {...this.props}
      />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  resetPassword: data => dispatch(resourceCreateRequest('passwordReset', data)),
  clearSubmitErrors: () => dispatch(clearSubmitErrors('PasswordResetForm')),
});

export default connect(null, mapDispatchToProps)(PasswordResetPageContainer);
