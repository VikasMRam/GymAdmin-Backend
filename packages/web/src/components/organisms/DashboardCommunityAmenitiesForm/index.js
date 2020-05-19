import React, { Component } from 'react';
import { func, bool, object } from 'prop-types';
import styled from 'styled-components';
import { Field as RFField } from 'redux-form';

import { size, columnWidth } from 'sly/web/components/themes';
import pad from 'sly/web/components/helpers/pad';
import textAlign from 'sly/web/components/helpers/textAlign';
import { Block, Button } from 'sly/web/components/atoms';
import ReduxField from 'sly/web/components/organisms/ReduxField';
import communityPropType from 'sly/web/propTypes/community';
import EditField from 'sly/web/components/form/EditField';

const familyOvernightOptions = [
  { value: 'Family Overnight Stay Rooms', label: 'Family overnight stay rooms' },
];

const communitySpaceOptions = [
  { value: 'Small Library', label: 'Library' },
  { value: 'Garden', label: 'Garden' },
  { value: 'Pet Friendly', label: 'Pet Friendly' },
];

const StyledButton = pad(Button, 'regular');
StyledButton.displayName = 'StyledButton';

const Form = styled.form``;
Form.displayName = 'Form';

const FormScrollSection = styled.div`
  // max-height: calc(100vh - 240px);
`;

const IntroInfo = textAlign(styled(Block)`
  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    margin-right: ${size('tabletLayout.gutter')};
    flex: 0 0 ${columnWidth(3, size('layout.gutter'))};
  }
`, 'left');
IntroInfo.displayName = 'IntroInfo';

const FormBottomSection = styled.div`
  margin-top: ${size('spacing.xLarge')};
`;

export default class DashboardCommunityAmenitiesForm extends Component {
  static propTypes = {
    currentValues: object,
    community: communityPropType,
    invalid: bool,
    canEdit: bool,
    submitting: bool,
    handleSubmit: func.isRequired,
  };

  render() {
    const {
      handleSubmit, invalid, submitting, canEdit, community,
    } = this.props;

    const isCommunityLarge = parseInt(community.propInfo.capacity || '0', 10) > 50;

    return (
      <Form onSubmit={handleSubmit}>
        <FormScrollSection>
          {isCommunityLarge && (
            <EditField
              name="propInfo.communitySpace"
              type="checkbox"
              options={familyOvernightOptions}
              readOnly={!canEdit}
            />
          )}

          <EditField
            name="propInfo.communitySpace"
            type="checkbox"
            options={communitySpaceOptions}
            readOnly={!canEdit}
          />

          <EditField
            name="propInfo.communitySpaceOther"
            label="Other"
            type="textarea"
            placeholder="More useful information about the community amenities"
            readOnly={!canEdit}
          />
        </FormScrollSection>

        <FormBottomSection>
          <StyledButton type="submit" disabled={!canEdit || invalid || submitting}>
            Save changes
          </StyledButton>
        </FormBottomSection>
      </Form>
    );
  }
}

