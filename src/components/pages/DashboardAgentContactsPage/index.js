import React from 'react';
import { parse } from 'query-string';

import DashboardPageTemplate from 'sly/components/templates/DashboardPageTemplate';
import { Datatable } from 'sly/services/datatable';
import DashboardAgentContactsSectionContainer from 'sly/containers/dashboard/DashboardAgentContactsSectionContainer';

const DashboardAgentContactsPage = ({ location }) => {
  const { 'page-number': pageNumber, ...filters } = parse(location.search);

  const sectionFilters = {
    'page-number': pageNumber,
    include: 'entities',
    'filter[entity_type]': 'eq:Property',
  };
  return (
    <DashboardPageTemplate activeMenuItem="My Contacts">
      <Datatable
        id="contacts"
        sectionFilters={sectionFilters}
        filters={filters}
      >
        {datatable => (
          <DashboardAgentContactsSectionContainer datatable={datatable} />
        )}
      </Datatable>

    </DashboardPageTemplate>);
};

export default DashboardAgentContactsPage;
