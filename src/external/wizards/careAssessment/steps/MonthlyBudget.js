import React, { Fragment } from 'react';
import styled from 'styled-components';
import { object } from 'prop-types';

import { Field } from 'redux-form';
import NumberFormat from 'react-number-format';

import { size, palette } from 'sly/components/themes';
import { Heading } from 'sly/components/atoms';
import ReduxField from 'sly/components/organisms/ReduxField';

import { stepInputFieldNames } from '../helpers';

export const StyledHeading = styled(Heading)`
  font-weight: normal;
  margin-bottom: ${size('spacing.regular')};
`;
export const Description = styled.p`
  color: ${palette('slate', 'filler')};
  margin-bottom: ${size('spacing.xLarge')};
`;
const MoneyValue = styled(Heading)`
  font-weight: normal;
  color: ${palette('secondary', 'base')};
  margin-bottom: ${size('spacing.large')};
`;

const StyledReduxField = styled(ReduxField)`
  display: flex;
  align-items: baseline;
`;

const moneyValue = val =>
  <MoneyValue>Up to <NumberFormat value={val} displayType="text" thousandSeparator prefix="$" /></MoneyValue>;

const MonthlyBudget = ({ data }) => (
  <Fragment>
    {/* TODO: replace with <> </> after upgrading to babel 7 & when eslint adds support for jsx fragments */}
    <StyledHeading>What is your monthly budget for rent and care?</StyledHeading>
    <Description> Monthly budget is an important criteria for narrowing down your search. Slide bar below.</Description>
    <Description>Note: The average monthly budget in US is roughly $3,750</Description>
    <Field
      name={stepInputFieldNames.MonthlyBudget[0]}
      type="slider"
      component={ReduxField}
      responsive
      min={2000}
      max={10000}
      step={1}
      value={data[stepInputFieldNames.MonthlyBudget[0]]}
      valuePosition="top"
      valueWidth="regular"
      valueParse={moneyValue}
    />
    <Field
      name={stepInputFieldNames.MonthlyBudget[1]}
      label="I'm only using Medicaid to pay."
      type="checkbox"
      responsive
      component={StyledReduxField}
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
