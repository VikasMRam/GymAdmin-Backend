import React from 'react';
import { func, bool, string, shape } from 'prop-types';
import { Field } from 'redux-form';
import styled from 'styled-components';

import { size } from 'sly/components/themes';
import ReduxField from 'sly/components/organisms/ReduxField';

import { Heading, Button, Block } from 'sly/components/atoms';

const Form = styled.form`
  width: 100%;
`;

const StyledButton = styled(Button)`
  width: 100%;
  margin-bottom: ${size('spacing.regular')};
`;

const typeOfCareOptions = [
  { value: 'low', label: 'Low' },
  { value: 'med', label: 'Med' },
  { value: 'high', label: 'High' },
];

const typeOfRoomOptions = [
  { value: 'studio', label: 'Studio' },
  { value: 'shared', label: 'Shared' },
  { value: 'bedroom', label: '1 bedroom' },
];

const timeToMoveOptions = [
  { value: 0, label: 'Now' },
  { value: 3, label: '1-3 Months' },
  { value: 6, label: '3-6 Months' },
  { value: 12, label: '12+ Months' },
];

const moneyValue = val => `$${val}K`;
const messageRecipient = (user, community) =>
  [(user && user.name) || 'the agent', community && community.name].join(' of ');

const AdvancedInfoForm = ({
  handleSubmit, submitting, user, community,
}) => (
  <Form onSubmit={handleSubmit}>
    <Heading>Contact {community.name}</Heading>
    <Block>{community.description}</Block>
    <Block>We will send this message to the community and the local senior living expert in the area</Block>
    <Field
      name="type_of_care"
      label="What type of care do you need?"
      type="multiplechoice"
      options={typeOfCareOptions}
      width="75%"
      component={ReduxField}
    />
    <Field
      name="type_of_room"
      label="What type of room are you looking for?"
      type="multiplechoice"
      options={typeOfRoomOptions}
      width="75%"
      component={ReduxField}
    />
    <Field
      name="time_to_move"
      label="When would you/your loved one want to move in?"
      type="singlechoice"
      options={timeToMoveOptions}
      width="100%"
      component={ReduxField}
    />
    <Field
      name="budget"
      label="What is your budget?"
      type="slider"
      responsive
      min={0}
      max={11}
      step={0.5}
      valueWidth="regular"
      valueParse={moneyValue}
      component={ReduxField}
    />
    <Field
      name="message"
      label={`Message ${messageRecipient(user, community)}`}
      type="textarea"
      component={ReduxField}
    />
    <StyledButton type="submit" kind="jumbo" disabled={submitting}>
      Send Message
    </StyledButton>
  </Form>
);

AdvancedInfoForm.propTypes = {
  handleSubmit: func.isRequired,
  submitting: bool,
  user: shape({ name: string.isRequired }),
  community: shape({ name: string.isRequired }).isRequired,
};

export default AdvancedInfoForm;
