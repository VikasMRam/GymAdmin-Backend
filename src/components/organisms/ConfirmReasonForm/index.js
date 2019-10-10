import React, { Fragment } from 'react';
import { string, func, bool, object } from 'prop-types';
import { Field } from 'redux-form';

import { Span } from 'sly/components/atoms';
import ReduxField from 'sly/components/organisms/ReduxField';
import ThreeSectionFormTemplate from 'sly/components/molecules/ThreeSectionFormTemplate';

const getLabel = label => (
  <Fragment>
    {label || 'Reason'} <Span palette="danger">*</Span>
  </Fragment>
);

const ConfirmReasonForm = ({
  message, title, label, handleSubmit, onCancel, extraFieldProps = null, ...props
}) => (
  <ThreeSectionFormTemplate {...props} onSubmit={handleSubmit} hasCancel hasSubmit heading={title} onCancelClick={onCancel}>
    {extraFieldProps && <Field {...extraFieldProps} component={ReduxField} />}
    <Field
      name="reason"
      label={getLabel(label)}
      type="textarea"
      placeholder={message}
      component={ReduxField}
    />
  </ThreeSectionFormTemplate>
);

ConfirmReasonForm.propTypes = {
  message: string,
  title: string,
  extraFieldProps: object,
  label: string,
  withReason: bool,
  onAgree: func,
  onCancel: func,
  handleSubmit: func,
};

export default ConfirmReasonForm;