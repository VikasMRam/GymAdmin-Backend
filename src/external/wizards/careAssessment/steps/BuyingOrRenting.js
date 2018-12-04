import React, { Fragment } from 'react';
import styled from 'styled-components';
import { object } from 'prop-types';

import { size } from 'sly/components/themes';
import { Heading } from 'sly/components/atoms';
import BoxRadioButton from 'sly/components/molecules/BoxRadioButton';

import { stepInputFieldNames } from '../helpers';

export const options = [
  'Renting',
  'Buying',
];

export const StyledHeading = styled(Heading)`
  font-weight: normal;
  margin-bottom: ${size('spacing.xLarge')};
`;
export const BoxRadioButtonWrapper = styled.div`
  margin-bottom: ${size('spacing.regular')};
`;

const BuyingOrRenting = ({ data }) => (
  <Fragment>
    {/* TODO: replace with <> </> after upgrading to babel 7 & when eslint adds support for jsx fragments */}
    <StyledHeading>Are you interested in renting or buying into a retirement community?</StyledHeading>
    {
      options.map((option, i) => (
        <BoxRadioButtonWrapper key={i}>
          <BoxRadioButton
            name={stepInputFieldNames.BuyingOrRenting[0]}
            value={option}
            label={option}
            checked={data[stepInputFieldNames.BuyingOrRenting[0]] === option}
          />
        </BoxRadioButtonWrapper>
      ))
    }
  </Fragment>
);

BuyingOrRenting.propTypes = {
  data: object,
};

BuyingOrRenting.defaultProps = {
  data: {},
};

export default BuyingOrRenting;