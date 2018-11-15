import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import { size } from 'sly/components/themes';
import HeaderController from 'sly/controllers/HeaderController';
import CommunityInfo from 'sly/components/molecules/CommunityInfo';
import BookingFormFooter from 'sly/components/molecules/BookingFormFooter';

import { required, email, usPhone } from 'sly/services/validation';
import { WizardController, WizardStep, WizardSteps } from 'sly/services/wizard';
import CommunitySATContactForm from 'sly/components/organisms/CommunitySATContactForm';
import CommunitySATDateForm from 'sly/components/organisms/CommunitySATDateForm';

import {
  FullScreenWizard,
  makeBody,
  makeColumn,
  makeControls,
  makeHeader,
} from 'sly/components/templates/FullScreenWizard';

import community from 'sly/../private/storybook/sample-data/property-rhoda-goldman-plaza.json';

const Header = makeHeader(HeaderController);

const columnBackground = ({ backgroundImage }) => `url(${backgroundImage})`;
const Column = makeColumn(styled.div`
  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    background-image: ${columnBackground};
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: flex-end;
    height: 100%;
  }
`);

const StyledCommunityInfo = styled(CommunityInfo)`
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
  padding: ${size('spacing.large')};
  padding-top: ${size('spacing.xxxLarge')};
  width: 100%;
`;

const Body = makeBody(styled.div``);
const Controls = makeControls(styled.div``);

export default class BookATourPage extends Component {
  onComplete = (data) => {
    alert(`completed: ${JSON.stringify(data)}`);
  }

  render() {
    return (
      <FullScreenWizard>
        <Header>
          <HeaderController />
        </Header>
        <Column backgroundImage={community.mainImage}>
          <StyledCommunityInfo palette="white" community={community} />
        </Column>
        <Body>
          <WizardController onComplete={this.onComplete}>
            {({
              data, onSubmit, isFinalStep, submitEnabled, ...props
            }) => (
              <Fragment>
                <Body>
                  <WizardSteps {...props}>
                    <WizardStep
                      component={CommunitySATDateForm}
                      name="Date"
                      validations={{ date: [required], time: [required] }}
                    />
                    <WizardStep
                      component={CommunitySATContactForm}
                      name="Contact"
                      validations={{ name: [required], email: [required, email], phone: [required, usPhone] }}
                    />
                  </WizardSteps>
                </Body>
                <Controls>
                  <BookingFormFooter
                    date={data.date}
                    time={data.time}
                    onProgressClick={onSubmit}
                    isFinalStep={isFinalStep}
                    isButtonDisabled={!submitEnabled}
                  />
                </Controls>
              </Fragment>
            )}
          </WizardController>
        </Body>
      </FullScreenWizard>
    );
  }
}
