import React, { Fragment } from 'react';
import styled from 'styled-components';
import { object } from 'prop-types';


import { size, palette } from 'sly/components/themes';
import { Heading } from 'sly/components/atoms';
import BoxRadioButton from 'sly/components/molecules/BoxRadioButton';

import { stepInputFieldNames } from '../helpers';

export const options = [
  { label: '24-hour supervision', helpText: 'Provide 24 hour supervision' },
  { label: 'Memory care', helpText: "Needs include Alzheimer's or other Dementias" },
  { label: 'Bathing assistance', helpText: 'Provide 24 hour supervision' },
  { label: 'Eating assistance', helpText: 'More' },
  { label: 'Transfer assistance', helpText: 'Provide 24 hour supervision' },
  // { label: 'Medication anagement', helpText: 'Provide 24 hour supervision' },
  // { label: 'Insulin Injections', helpText: 'Provide 24 hour supervision' },
  { label: 'Short-Term care', helpText: 'Provide 24 hour supervision' },
  { label: 'Other', helpText: 'Provide 24 hour supervision' },
];

export const StyledHeading = styled(Heading)`
  font-weight: normal;
  margin-bottom: ${size('spacing.regular')};
`;
export const BoxRadioButtonWrapper = styled.div`
  margin-bottom: ${size('spacing.regular')};
`;
export const Description = styled.p`
  color: ${palette('slate', 'filler')};
  margin-bottom: ${size('spacing.xLarge')};
`;

const CareNeeds = ({ data }) => (
  <Fragment>
    {/* TODO: replace with <> </> after upgrading to babel 7 & when eslint adds support for jsx fragments */}
    <StyledHeading>Do you have any care needs?</StyledHeading>
    <Description>Select all that apply</Description>
    {
      options.map((option, i) => (
        <BoxRadioButtonWrapper key={i}>
          <BoxRadioButton
            multiSelect
            name={`${stepInputFieldNames.CareNeeds[0]}[${option.label}]`}
            value={option.label}
            label={option.label}
            checked={Boolean(data[stepInputFieldNames.CareNeeds[0]]) &&
              Boolean(data[stepInputFieldNames.CareNeeds[0]][option.label])}
          />
        </BoxRadioButtonWrapper>
      ))
    }
  </Fragment>
);

CareNeeds.propTypes = {
  data: object,
};

CareNeeds.defaultProps = {
  data: {},
};

export default CareNeeds;
