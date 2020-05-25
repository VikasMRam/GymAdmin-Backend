import React from 'react';
import { func, string } from 'prop-types';
import { Field } from 'redux-form';
import styled from 'styled-components';

import { size } from 'sly/web/components/themes';
import { ADL_OPTIONS } from 'sly/web/constants/wizards/assesment';
import pad from 'sly/web/components/helpers/pad';
import { getLabelForWhoPersonOption } from 'sly/web/components/wizards/assesment/helpers';
import { Wrapper, Footer } from 'sly/web/components/wizards/assesment/Template';
import { Heading, Box } from 'sly/web/components/atoms';
import ProgressBar from 'sly/web/components/molecules/ProgressBar';
import TipBox from 'sly/web/components/molecules/TipBox';
import ReduxField from 'sly/web/components/organisms/ReduxField';

const PaddedProgressBar = pad(ProgressBar);

const PaddedHeading = pad(Heading);
PaddedHeading.displayName = 'PaddedHeading';

const StyledField = styled(Field)`
  > * {
    margin-bottom: ${size('spacing.regular')};
  }
`;

const StyledTipBox = styled(TipBox)`
  height: fit-content;
`;

const generateHeading = (whoNeedsHelp) => {
  switch (whoNeedsHelp) {
    case 'parents':
      return 'Which activities do your parents need help with?';
    case 'myself-and-spouse':
      return 'Which activities do you and your spouse need help with?';
    case 'myself':
      return 'Which activities do you need help with?';
    default:
      return `Which activities below does your ${getLabelForWhoPersonOption(whoNeedsHelp)} need help with?`;
  }
};

const ADL = ({
  handleSubmit, onBackClick, onSkipClick, whoNeedsHelp,
}) => (
  <div>
    <Wrapper>
      <PaddedProgressBar label totalSteps={8} currentStep={3} />
    </Wrapper>
    <Wrapper>
      <Box>
        <PaddedHeading level="subtitle" weight="medium">{generateHeading(whoNeedsHelp)}</PaddedHeading>
        <form onSubmit={handleSubmit}>
          <StyledField
            multiChoice
            options={ADL_OPTIONS}
            name="adl"
            type="boxChoice"
            align="left"
            component={ReduxField}
          />
          <Footer onBackClick={onBackClick} onSkipClick={onSkipClick} />
        </form>
      </Box>
      <StyledTipBox heading="WHY THIS IS IMPORTANT:">
        This helps us narrow down our recommendations to only those communities that can support your care needs.
      </StyledTipBox>
    </Wrapper>
  </div>
);

ADL.propTypes = {
  handleSubmit: func.isRequired,
  whoNeedsHelp: string.isRequired,
  onSkipClick: func,
  onBackClick: func,
};

export default ADL;
