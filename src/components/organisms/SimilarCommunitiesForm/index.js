import React from 'react';
import { func, bool, number, string, shape, arrayOf } from 'prop-types';
import { Field } from 'redux-form';
import styled from 'styled-components';

import { size } from 'sly/components/themes';
import ReduxField from 'sly/components/organisms/ReduxField';

import { Heading, Button, Block } from 'sly/components/atoms';

const makeOptions = communities => communities
  .map(community => ({
    value: community.id,
    label: community.name,
    community,
  }));

const Form = styled.form`
  width: 100%;
  box-sizing: border-box;
`;

const StyledButton = styled(Button)`
  width: 100%;
  margin-bottom: ${size('spacing.regular')};
`;

const SimilarCommunitiesForm = ({ handleSubmit, submitting, communities }) => (
  <Form onSubmit={handleSubmit}>
    <Field
      name="similar_communities"
      type="communitychoice"
      options={makeOptions(communities)}
      component={ReduxField}
    />
    <StyledButton type="submit" disabled={submitting}>
      Send Message
    </StyledButton>
  </Form>
);

SimilarCommunitiesForm.propTypes = {
  handleSubmit: func.isRequired,
  submitting: bool,
  communities: arrayOf(shape({ id: string.isRequired, name: string.isRequired, rating: number })).isRequired,
};

export default SimilarCommunitiesForm;
