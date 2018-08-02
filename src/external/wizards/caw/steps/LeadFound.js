import React, { Fragment } from 'react';
import styled from 'styled-components';
import { object, number } from 'prop-types';
import { Field } from 'redux-form';
import { palette } from 'styled-theme';

import { size } from 'sly/components/themes';
import { Heading } from 'sly/components/atoms';
import ReduxField from 'sly/components/organisms/ReduxField';
import TosAndPrivacy from 'sly/components/molecules/TosAndPrivacy';

import { stepInputFieldNames } from '../helpers';

const StyledHeading = styled(Heading)`
  font-weight: normal;
  margin-bottom: ${size('spacing.regular')};
`;
const Description = styled.p`
  color: ${palette('grayscale', 0)};
  margin-bottom: ${size('spacing.xLarge')};
`;

const LeadFound = ({ searchResultCount }) => (
  <Fragment>
    {/* TODO: replace with <> </> after upgrading to babel 7 & when eslint adds support for jsx fragments */}
    <StyledHeading>We found {searchResultCount} options near you. Sign up to view your options.</StyledHeading>
    <Description>Sign up to view your options and pricing - FREE Service.</Description>
    <Field
      name={stepInputFieldNames.LeadFound[0]}
      placeholder="Name"
      type="text"
      component={ReduxField}
    />
    <Field
      name={stepInputFieldNames.LeadFound[1]}
      placeholder="Email"
      type="email"
      component={ReduxField}
    />
    <Field
      name={stepInputFieldNames.LeadFound[2]}
      placeholder="Phone"
      type="text"
      component={ReduxField}
    />
    <TosAndPrivacy openLinkInNewTab />
  </Fragment>
);

LeadFound.propTypes = {
  data: object,
  searchResultCount: number,
};

LeadFound.defaultProps = {
  data: {},
  searchResultCount: 0,
};

export default LeadFound;