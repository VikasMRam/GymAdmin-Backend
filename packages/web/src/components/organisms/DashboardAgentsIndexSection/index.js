import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { arrayOf, object, bool } from 'prop-types';

import { size, palette } from 'sly/common/components/themes';
import mobileOnly from 'sly/web/components/helpers/mobileOnly';
import pad from 'sly/web/components/helpers/pad';
import SlyEvent from 'sly/web/services/helpers/events';
import agentPropType from 'sly/common/propTypes/agent';
import { Box, Table, THead, TBody, Tr, Td, Block } from 'sly/web/components/atoms';
import TableHeaderButtons from 'sly/web/components/molecules/TableHeaderButtons';
import Pagination from 'sly/web/components/molecules/Pagination';
import Th from 'sly/web/components/molecules/Th';
import AgentRowCard from 'sly/web/components/organisms/AgentRowCard';
import { textAlign } from 'sly/web/components/helpers/text';

const TABLE_HEADINGS = [
  { text: 'Name' },
  { text: 'Display Name' },
  { text: 'Address' },
  { text: 'Status' },
];

const Section = styled.section`
  background-color: ${palette('grey.background')};
  padding: ${size('spacing.large')};

  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    padding: 0;
    background-color: ${palette('white.base')};
    border: ${size('border.regular')} solid ${palette('slate.stroke')};
    border-top: 0;
    border-bottom: 0;
  }
`;

const StyledTable = styled(Table)`
  border-right: 0;
  border-left: 0;
`;

const CenteredPagination = styled(Pagination)`
  padding: ${size('spacing.large')};
  justify-content: center;
`;

const StyledPagination = styled(mobileOnly(CenteredPagination, css`
  position: sticky;
`))`
  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    border-bottom: ${size('border.regular')} solid ${palette('slate.stroke')};
  }
`;

const FamiliesCountStatusBlock = pad(styled(Box)`
  border-radius: 0;
  padding-left: ${size('spacing.regular')};
  padding-left: ${size('spacing.large')};
  background-color: ${palette('white.base')};
`, 'large');

const StyledFamiliesCountStatusBlock = styled(FamiliesCountStatusBlock)`
  margin-bottom: 0;
  border-left: none;
  border-right: none;
  border-bottom: none;
`;

const NoResultMessage = styled(textAlign(Block))`
  padding-top: ${size('spacing.xxxLarge')};
  padding-bottom: ${size('spacing.xxxLarge')};
`;

const StyledTableHeaderButtons = styled(TableHeaderButtons)`
  border: none;
`;

const StyledSection = styled(Section)`
  border: none;
`;

export default class DashboardAgentsIndexSection extends Component {
  static propTypes = {
    datatable: object,
    agents: arrayOf(agentPropType),
    pagination: object,
    isPageLoading: bool,
    meta: object,
    noBorder: bool,
  };

  handleAgentClick = (agent) => {
    const event = {
      category: 'AdminDashboardAgents',
      action: 'click',
      label: 'viewAgent',
      value: agent.id,
    };
    SlyEvent.getInstance().sendEvent(event);
  };

  render() {
    const {
      agents, pagination, isPageLoading, noBorder, meta, datatable,
    } = this.props;
    const noResultMessage = 'Nice! You are on top of all your agents here.';
    const TableHeaderButtonComponent = noBorder ? StyledTableHeaderButtons : TableHeaderButtons;
    const SectionComponent = noBorder ? StyledSection : Section;
    const StatusBlock = noBorder ? StyledFamiliesCountStatusBlock : FamiliesCountStatusBlock;
    const modelConfig = { name: 'Agent', defaultSearchField: 'name' };

    return (
      <>
        <TableHeaderButtonComponent
          datatable={datatable}
          modelConfig={modelConfig}
          meta={meta}
        />

        <SectionComponent>
          {!isPageLoading && (
            <>
              <StyledTable sticky>
                <THead>
                  <Tr>
                    {TABLE_HEADINGS.map(({ text }) => <Th key={text}>{text}</Th>)}
                  </Tr>
                </THead>
                <TBody>
                  {agents.map(agent => (
                    <AgentRowCard key={agent.id} agent={agent} onAgentClick={() => this.handleAgentClick(agent)} />
                  ))}
                  {agents.length === 0 &&
                    <Tr>
                      <Td colSpan={TABLE_HEADINGS.length} borderless={noBorder}>
                        <NoResultMessage>{noResultMessage}</NoResultMessage>
                      </Td>
                    </Tr>
                  }
                </TBody>
              </StyledTable>
              {pagination.show && (
                <StyledPagination
                  current={pagination.current}
                  total={pagination.total}
                  range={1}
                  basePath={datatable.basePath}
                  pageParam="page-number"
                />
              )}
            </>
          )}
          {isPageLoading && 'Loading...'}
        </SectionComponent>

        {!isPageLoading && agents.length > 0 &&
          <StatusBlock padding="regular" size="caption" snap="top">
            {pagination.text}
          </StatusBlock>
        }
      </>
    );
  }
}
