import React, { Fragment } from 'react';
import styled from 'styled-components';
import { object } from 'prop-types';
import { palette } from 'styled-theme';
import { Field } from 'redux-form';
import NumberFormat from 'react-number-format';

import { size } from 'sly/components/themes';
import { Heading } from 'sly/components/atoms';
import ReduxField from 'sly/components/organisms/ReduxField';

const StyledHeading = styled(Heading)`
  font-weight: normal;
  margin-bottom: ${size('spacing.xLarge')};
`;
const Description = styled.p`
  color: ${palette('grayscale', 0)};
  margin-bottom: ${size('spacing.xxLarge')};
`;
const MoneyValue = styled(Heading)`
  font-weight: normal;
  color: ${palette('secondary', 0)};
  margin-bottom: ${size('spacing.large')};
`;

const moneyValue = val =>
  <MoneyValue>Up to <NumberFormat value={val} displayType="text" thousandSeparator prefix="$" /></MoneyValue>;

const MonthlyBudget = ({ data }) => (
  <Fragment>
    {/* TODO: replace with <> </> after upgrading to babel 7 & when eslint adds support for jsx fragments */}
    <StyledHeading>What is your monthly budget for rent and care?</StyledHeading>
    <Description>Note: The average monthly budget in US is roughly $3,750</Description>
    <Field
      name="monthly_budget"
      type="slider"
      component={ReduxField}
      responsive
      min={2000}
      max={10000}
      step={1}
      value={data.monthly_budget}
      valuePosition="top"
      valueWidth="regular"
      valueParse={moneyValue}
    />
  </Fragment>
);

MonthlyBudget.propTypes = {
  data: object,
};

MonthlyBudget.defaultProps = {
  data: {},
};

export default MonthlyBudget;
