import React, { Component, Fragment } from 'react';
import { bool,func } from 'prop-types';
import styled from 'styled-components';

import { size } from 'sly/components/themes';
import { Box,  Button } from 'sly/components/atoms';
import ReduxField from 'sly/components/organisms/ReduxField';
import { reduxForm, Field } from 'redux-form';

const Form = styled.form`
  display: flex;
  align-items: center;
`;

const CommunityAgentSearchForm = ({ handleSubmit }) => {
  return (
    <Form onSubmit={handleSubmit} name="CommunitySearchForm" >
      <Field name="name" label="Choose a Community" type="text" wideWidth component={ReduxField} />
      <Button type="submit"> Search </Button>
    </Form>
  );
};

const ReduxForm = reduxForm({
  form: 'CommunityAgentSearchForm',
  destroyOnUnmount: false,
  // required to refresh when initialValues change. Ref: https://redux-form.com/6.7.0/examples/initializefromstate/
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(CommunityAgentSearchForm);

export default class DashboardCommunityAgentSearchBox extends Component {
  static propTypes = {
    handleSubmit: func.isRequired,
  };

  // TODO : Notify Error and Info are not present
  render() {
    const { handleSubmit } = this.props;
    return (
      <Box>
        <ReduxForm onSubmit={handleSubmit} />
      </Box>
    );
  }
}
