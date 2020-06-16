import React from 'react';
import { func, number, bool } from 'prop-types';
import { Field } from 'redux-form';
import styled from 'styled-components';

import { size } from 'sly/web/components/themes';
import pad from 'sly/web/components/helpers/pad';
import { Wrapper, Footer } from 'sly/web/components/wizards/assessment/Template';
import { Heading, Box } from 'sly/web/components/atoms';
import TipBox from 'sly/web/components/molecules/TipBox';
import ReduxField from 'sly/web/components/organisms/ReduxField';

const PaddedHeading = pad(Heading);
PaddedHeading.displayName = 'PaddedHeading';

const StyledTipBox = styled(TipBox)`
  height: fit-content;
`;

const FieldsWrapper = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: ${size('spacing.regular')}
`;

const PaddedField = pad(Field);
PaddedField.displayName = 'PaddedField';

const ResidentName = ({
  handleSubmit, onSkipClick, numberOfPeople, invalid, submitting, hasTip,
}) => (
  <Wrapper hasSecondColumn={hasTip}>
    <Box>
      <PaddedHeading level="subtitle" weight="medium">
        Last question, what is the resident&apos;s name{numberOfPeople > 1 ? 's' : ''}?
      </PaddedHeading>
      <form onSubmit={handleSubmit}>
        {Array(numberOfPeople).fill().map((_, i) => (
          <FieldsWrapper key={i}>
            <PaddedField
              name={`firstName${numberOfPeople > 1 ? i + 1 : ''}`}
              type="text"
              label="First Name"
              component={ReduxField}
            />
            <PaddedField
              name={`lastName${numberOfPeople > 1 ? i + 1 : ''}`}
              type="text"
              label="Last Name"
              component={ReduxField}
            />
          </FieldsWrapper>
        ))}
        <Footer submitButtonText="Finish" onSkipClick={onSkipClick} invalid={invalid} submitting={submitting} />
      </form>
    </Box>
    {hasTip &&
      <StyledTipBox heading="WHY THIS IS IMPORTANT:">
        We help every family as if they are our own.
      </StyledTipBox>
    }
  </Wrapper>
);

ResidentName.propTypes = {
  handleSubmit: func.isRequired,
  onSkipClick: func,
  numberOfPeople: number.isRequired,
  invalid: bool,
  submitting: bool,
  hasTip: bool,
};

ResidentName.defaultProps = {
  numberOfPeople: 1,
  hasTip: true,
};

export default ResidentName;
