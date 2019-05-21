import React, { Fragment } from 'react';
import styled from 'styled-components';
import { arrayOf, object, string, bool } from 'prop-types';

import { size, palette } from 'sly/components/themes';
import DashboardPageTemplate from 'sly/components/templates/DashboardPageTemplate';
import TableHeaderButtons from 'sly/components/molecules/TableHeaderButtons';
import Block from 'sly/components/atoms/Block';
import TableRowCard from 'sly/components/molecules/TableRowCard';
import Pagination from 'sly/components/molecules/Pagination';
import Tabs from 'sly/components/molecules/Tabs';
import Table from 'sly/components/organisms/Table';
import { FAMILY_DASHBOARD_FAMILIES_PATH } from 'sly/constants/dashboardAppPaths';

const SmallScreenSection = styled.div`
  display: block;
  background-color: ${palette('white.base')};

  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    display: none;
  }
`;

const BigScreenSection = styled.div`
  display: none;

  @media screen and (min-width: ${size('breakpoint.tablet')}) {
    display: block;
    background-color: ${palette('white.base')};
  }
`;

const TableRowCardsWrapper = styled.div`
  padding: ${size('spacing.large')};
  background-color: ${palette('grey.background')};
  border-top: ${size('border.regular')} 0 solid ${palette('grey', 'filler')};
  border-bottom: ${size('border.regular')} solid ${palette('grey', 'filler')};
`;

const FamiliesCountStatusBlock = styled(Block)`
  margin-bottom: ${size('spacing.large')};
  margin-left: ${size('spacing.large')};
`;

const TableRowCardWrapper = styled.div`
  margin-bottom: ${size('spacing.large')};
  background-color: ${palette('white.base')};
`;

const TableSectionWrapper = styled.div`
  overflow: auto;
`;

const TableWrapper = styled.div`
  margin-bottom: ${size('spacing.large')};
`;

const BigScreenPaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const tableHeaderButtons = <TableHeaderButtons />;

const EmptyTextWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: ${size('spacing.xxxLarge')} ${size('spacing.xxLarge')};
  height: 100vh;
  text-align: center;
`;

const StyledTabs = styled(Tabs)`
  > *:nth-child(1) {
    border-top: 0;
  }

  @media screen and (min-width: ${size('breakpoint.laptop')}) {
    > *:nth-child(1) {
      border: ${size('border.regular')} solid ${palette('slate', 'stroke')};
    }
  }
`;

const tabIDLabelMap = {
  Prospects: 'PROSPECTS',
  Connected: 'CONNECTED',
  Closed: 'CLOSED',
};

const tabIDs = Object.keys(tabIDLabelMap);

const DashboardAgentFamilyOverviewPage = ({
  mobileContents, tableContents, pagination, paginationString, activeTab, showPagination,
}) => {
  const { current, total, filteredCount } = pagination;
  const paginationParams = {
    current,
    total,
    range: 1,
    basePath: FAMILY_DASHBOARD_FAMILIES_PATH,
    pageParam: 'page-number',
  };
  const { tableEmptyText } = tableContents;
  const paginationComponent = (showPagination && <Pagination {...paginationParams} />);
  const bigScreenView = (
    <Fragment>
      {tableHeaderButtons}
      <TableSectionWrapper>
        <TableWrapper>
          <Table {...tableContents} />
        </TableWrapper>
      </TableSectionWrapper>
      <BigScreenPaginationWrapper>
        {paginationComponent}
      </BigScreenPaginationWrapper>
      <FamiliesCountStatusBlock size="caption">{paginationString}</FamiliesCountStatusBlock>
    </Fragment>
  );
  const emptyTextComponent = <EmptyTextWrapper><Block palette="grey">{tableEmptyText}</Block></EmptyTextWrapper>;
  const smallScreenView = (
    <Fragment>
      {tableHeaderButtons}
      <TableRowCardsWrapper>
        {mobileContents.length > 0 && (
          <Fragment>
            <FamiliesCountStatusBlock size="caption">{paginationString}</FamiliesCountStatusBlock>
            {mobileContents.map(content => <TableRowCardWrapper key={content.id}><TableRowCard {...content} /></TableRowCardWrapper>)}
            {paginationComponent}
          </Fragment>
        )}
        {mobileContents.length === 0 && emptyTextComponent}
      </TableRowCardsWrapper>
    </Fragment>
  );
  let prospectsTabLabel = tabIDLabelMap[tabIDs[0]];
  let connectedTabLabel = tabIDLabelMap[tabIDs[1]];
  let closedTabLabel = tabIDLabelMap[tabIDs[2]];
  if (activeTab === tabIDs[0]) {
    prospectsTabLabel += ` (${filteredCount})`;
  } else if (activeTab === tabIDs[1]) {
    connectedTabLabel += ` (${filteredCount})`;
  } else if (activeTab === tabIDs[2]) {
    closedTabLabel += ` (${filteredCount})`;
  }
  const tabsViewTemplate = view => (
    <StyledTabs activeTab={activeTab}>
      <div id={tabIDs[0]} label={prospectsTabLabel} to={FAMILY_DASHBOARD_FAMILIES_PATH}>
        {view}
      </div>
      <div id={tabIDs[1]} label={connectedTabLabel} to={`${FAMILY_DASHBOARD_FAMILIES_PATH}?type=Connected`}>
        {view}
      </div>
      <div id={tabIDs[2]} label={closedTabLabel} to={`${FAMILY_DASHBOARD_FAMILIES_PATH}?type=Closed`}>
        {view}
      </div>
    </StyledTabs>
  );
  return (
    <DashboardPageTemplate activeMenuItem="My Families">
      <SmallScreenSection>
        {tabsViewTemplate(smallScreenView)}
      </SmallScreenSection>
      <BigScreenSection>
        {tabsViewTemplate(bigScreenView)}
      </BigScreenSection>
    </DashboardPageTemplate>
  );
};

DashboardAgentFamilyOverviewPage.propTypes = {
  mobileContents: arrayOf(object),
  tableContents: object,
  pagination: object,
  paginationString: string,
  activeTab: string,
  showPagination: bool,
};

DashboardAgentFamilyOverviewPage.defaultProps = {
  mobileContents: [],
};

export default DashboardAgentFamilyOverviewPage;