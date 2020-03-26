import React, { Component } from 'react';
import { func, bool, object } from 'prop-types';
import styled from 'styled-components';
import { Field as RFField } from 'redux-form';

import { size, palette, columnWidth } from 'sly/components/themes';
import pad from 'sly/components/helpers/pad';
import { Button } from 'sly/components/atoms';
import ReduxField from 'sly/components/organisms/ReduxField';
import communityPropType from 'sly/propTypes/community';

const nonCareServicesOptions = [
  { value: 'Community Operated Transportation', label: 'Community operated transportation' },
  { value: 'Scheduled Daily Activities', label: 'Scheduled daily activities' },
];

const StyledButton = pad(Button, 'regular');
StyledButton.displayName = 'StyledButton';

const Form = styled.form``;
Form.displayName = 'Form';

const FormScrollSection = styled.div`
  // max-height: calc(100vh - 240px);
`;

const FormBottomSection = styled.div`
  margin-top: ${size('spacing.xLarge')};
`;

const Field = ({ canEdit, ...props }) => <RFField component={ReduxField} readOnly={!canEdit} wideWidth {...props} />;

export default class DashboardCommunityServicesForm extends Component {
  static propTypes = {
    currentValues: object,
    community: communityPropType,
    invalid: bool,
    canEdit: bool,
    submitting: bool,
    handleSubmit: func.isRequired,
  };

  render() {
    const {
      handleSubmit, invalid, submitting, canEdit,
    } = this.props;

    return (
      <Form onSubmit={handleSubmit}>
        <FormScrollSection>
          <Field
            name="propInfo.nonCareServices"
            type="checkbox"
            options={nonCareServicesOptions}
            canEdit={canEdit}
          />

          <Field
            name="propInfo.nonCareServicesOther"
            label="Other"
            type="textarea"
            placeholder="More useful information about the community services"
            canEdit={canEdit}
          />
        </FormScrollSection>

        {canEdit && (
          <FormBottomSection>
            <StyledButton type="submit" disabled={invalid || submitting}>
              Save changes
            </StyledButton>
          </FormBottomSection>
        )}
      </Form>
    );
  }
}

