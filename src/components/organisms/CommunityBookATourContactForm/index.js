import React, { Fragment } from 'react';
import { string, object, func } from 'prop-types';
import { Field } from 'redux-form';
import styled from 'styled-components';

import { size, assetPath } from 'sly/components/themes';
import ReduxField from 'sly/components/organisms/ReduxField/index';
import { Heading, Block, Image } from 'sly/components/atoms';
import Link from 'sly/components/atoms/Link/index';
import { CONTACT_BY_TEXT_MSG_OPTIONS } from 'sly/constants/pricingForm';

const SubheadingWrapper = styled.div`
  display: flex;
`;

const HeadingSection = styled(Heading)`
  margin-bottom: ${size('spacing.large')};
`;

const SubHeading = styled(Block)`
  margin-right: ${size('spacing.xLarge')};
  margin-bottom: ${size('spacing.xLarge')};
`;

const AgentImage = styled(Image)`
  display: block;
  align-self: baseline;

  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    display: none;
  }
`;

const StyledBlock = styled(Block)`
  margin-bottom: ${size('spacing.regular')};
`;

const StyledField = styled(Field)`
  display: grid;
  grid-gap: ${size('spacing.large')};
  grid-template-columns: repeat(auto-fit, calc(${size('layout.col1')} + (${size('layout.gutter')}) * 2));
  margin-bottom: ${size('spacing.xLarge')};

  > * {
    height: ${size('element.large')};
    font-size: ${size('text.caption')};
  }
`;

const ContactByTextField = StyledField.extend`
  grid-template-columns: repeat(auto-fit, ${size('layout.col3')});
`;

const CommunityBookATourContactForm = ({
  error, user, userDetails, heading, subheading, onAdvisorHelpClick, onContactByTextMsgChange, handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <HeadingSection level="subtitle" size="subtitle">{heading}</HeadingSection>
      <SubheadingWrapper>
        <SubHeading size="body">{subheading} <Link palette="primary" onClick={onAdvisorHelpClick}>How can a partner agent help?</Link></SubHeading>
        <AgentImage src={assetPath('images/agent-xLarge.png')} alt="Agent" />
      </SubheadingWrapper>
      {!(userDetails && userDetails.fullName) && <Field
        name="name"
        label="Full name"
        type="text"
        placeholder="Full name"
        component={ReduxField}
      />}
      {!(userDetails && userDetails.phone) && <Field
        name="phone"
        label="Phone"
        type="text"
        placeholder="925-555-5555"
        component={ReduxField}
      />}
      <Field
        name="notes"
        label="Add a note"
        type="textarea"
        rows="5"
        placeholder="Anything you'd like your partner agent to know about this tour or any questions"
        component={ReduxField}
      />
      {!(userDetails && userDetails.contactByTextMsg) &&
        <Fragment>
          <StyledBlock size="caption">Please contact me by text message</StyledBlock>
          <ContactByTextField
            options={CONTACT_BY_TEXT_MSG_OPTIONS}
            name="contactByTextMsg"
            type="boxChoice"
            component={ReduxField}
            onChange={onContactByTextMsgChange}
          />
        </Fragment>
      }
      {error && <Block palette="danger">{error}</Block>}
      {!user && <Block size="tiny">By continuing, you agree to our <Link href="/tos" target="_blank">Terms of Service</Link> and <Link href="/privacy" target="_blank">Privacy Policy</Link></Block>}
    </form>
  );
};

CommunityBookATourContactForm.propTypes = {
  user: object,
  userDetails: object,
  error: string,
  onAdvisorHelpClick: func.isRequired,
  onContactByTextMsgChange: func,
  handleSubmit: func,
  heading: string.isRequired,
  subheading: string.isRequired,
};

export default CommunityBookATourContactForm;