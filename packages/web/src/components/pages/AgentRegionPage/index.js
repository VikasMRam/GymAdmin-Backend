import React, { Component } from 'react';
import styled from 'styled-components';
import { string, arrayOf, func, object, bool } from 'prop-types';
import Helmet from 'react-helmet';

import { getHelmetForAgentsRegionPage } from 'sly/web/services/helpers/html_headers';
import agentPropType from 'sly/web/propTypes/agent';
import { size, palette } from 'sly/web/components/themes';
import HeaderContainer from 'sly/web/containers/HeaderContainer';
import { CONSULTATION_REQUESTED } from 'sly/web/services/api/constants';
import { TemplateContent, TemplateHeader } from 'sly/web/components/templates/BasePageTemplate';
import AgentTile from 'sly/web/components/molecules/AgentTile';
import Section from 'sly/web/components/molecules/Section';
import Footer from 'sly/web/components/organisms/Footer';
import { Heading, Block, Link, Hr } from 'sly/web/components/atoms';
import AskQuestionToAgentFormContainer from 'sly/web/containers/AskQuestionToAgentFormContainer';
import FindLocalAgent from 'sly/web/components/molecules/FindLocalAgent';
import MostSearchedRegions from 'sly/web/components/molecules/MostSearchedRegions';
import { mostSearchedRegions } from 'sly/web/constants/agents';

const PageHeadingSection = styled.div`
  text-align: center;
  margin: 0 auto;
  margin-top: ${size('spacing.huge')};
  width: ${size('mobileLayout.col4')};
  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    width: ${size('tabletLayout.col6')};
  }
`;

const FindLocalAgentLink = styled(Link)`
  text-decoration: underline;
`;

const StyledHr = styled(Hr)`
  margin-top: ${size('spacing.huge')};
  margin-bottom: ${size('spacing.huge')};
`;

const AgentTiles = styled.div`
  width: 100%;
  justify-content: center;
  display: grid;
  grid-gap: ${size('spacing.large')};
  grid-template-columns: ${size('layout.col4')};

  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    grid-template-columns: ${size('layout.col4')} ${size('layout.col4')};
  }

  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    grid-template-columns: ${size('layout.col4')} ${size('layout.col4')} ${size('layout.col4')};
  }
`;

const FormSection = styled.div`
  width: 100%;
  margin: 0 auto;
  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    width: ${size('layout.col6')};
  }
`;

const FindLocalAgentWrapper = styled.div`
  border: ${size('spacing.nano')} solid ${palette('slate', 'stroke')};
  padding: ${size('spacing.xxxLarge')} ${size('spacing.xLarge')};
  margin-bottom: ${size('spacing.huge')};
`;

const StyledSection = styled(Section)`
  margin-bottom: ${size('spacing.huge')};
`;

const NoResultBlock = styled(Block)`
  text-align: center;
`;

const TitleHeading = styled(Heading)`
  font-weight: ${size('weight.regular')};
`;

export default class AgentRegionPage extends Component {
  static propTypes = {
    title: string.isRequired,
    locationName: string.isRequired,
    agentsList: arrayOf(agentPropType),
    onLocationSearch: func.isRequired,
    isRegionPage: bool,
    location: object.isRequired,
    onConsultationRequested: func.isRequired,
  };

  constructor(props) {
    super(props);
    this.findLocalAgentRef = React.createRef();
    this.title = null;
  }

  render() {
    const {
      title, locationName, agentsList, onLocationSearch,
      isRegionPage, location, onConsultationRequested,
    } = this.props;

    if (!agentsList) {
      return null;
    }

    return (
      <>
        {getHelmetForAgentsRegionPage({ locationName, location })}
        {!isRegionPage &&
          <Helmet>
            <meta name="robots" content="noindex" />
          </Helmet>
        }
        <TemplateHeader><HeaderContainer /></TemplateHeader>
        <TemplateContent>
          <PageHeadingSection>
            <TitleHeading level="hero" size="hero" _ref={(el) => { this.title = el; }}>{title}</TitleHeading>
            <FindLocalAgentLink
              palette="slate"
              onClick={() => {
                if (this.findLocalAgentRef.current.scrollIntoView) {
                  this.findLocalAgentRef.current.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Looking for agents in other areas?
            </FindLocalAgentLink>
          </PageHeadingSection>
          <StyledHr fullWidth />
          {agentsList.length > 0 &&
            <AgentTiles>
              {agentsList.map(agent => <Link key={agent.id} to={agent.url}><AgentTile agent={agent} /></Link>)}
            </AgentTiles>
          }
          {agentsList.length === 0 &&
            <NoResultBlock>{`It looks like we do not have any agents listed in ${locationName}. We are currently adding new partners everyday who might not be listed yet. Fill out the form below and we will help you find your local partner agent.`}</NoResultBlock>
          }
          <StyledHr fullWidth />
          <FormSection>
            <AskQuestionToAgentFormContainer
              hasLocation
              actionType={CONSULTATION_REQUESTED}
              postSubmit={() => {
                onConsultationRequested();

                if (this.title.scrollIntoView) {
                  this.title.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </FormSection>
          <StyledHr fullWidth />
          <FindLocalAgentWrapper innerRef={this.findLocalAgentRef}>
            <FindLocalAgent onLocationSearch={onLocationSearch} />
          </FindLocalAgentWrapper>
          <StyledSection centerTitle title="Search senior living agents by region">
            <MostSearchedRegions mostSearchedRegions={mostSearchedRegions} />
          </StyledSection>
        </TemplateContent>
        <Footer />
      </>
    );
  }
}