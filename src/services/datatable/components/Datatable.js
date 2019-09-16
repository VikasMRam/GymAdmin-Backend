import { Component } from 'react';
import { func, object, string, shape, bool } from 'prop-types';
import { withRouter } from 'react-router';

import { prefetch } from 'sly/services/newApi';
import datatableColumnsProptype from 'sly/propTypes/datatableColumns';
import { makeQuerystringFilters, parseQuerystringFilters, simpleQStringify } from 'sly/services/datatable/helpers';

@prefetch('datatable', 'getDatatable', (req, { id }) => req({ id }))

@withRouter

export default class Datatable extends Component {
  static propTypes = {
    children: func,
    datatable: shape({ columns: datatableColumnsProptype }),
    sectionFilters: object,
    status: object,
    location: shape({ search: string }),
    history: object,
  };

  state = parseQuerystringFilters(this.props.location.search);

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (prevProps.location.search !== location.search) {
      this.setState(parseQuerystringFilters(location.search));
    }
  }

  doSearch = (column, operator, value) => {
    const filter = this.getFilter(column, operator);
    if (filter) {
      if (value === '') {
        this.onFilterRemove(filter);
      } else {
        this.onFilterChange(filter, {
          ...filter,
          value,
        });
      }
    } else {
      this.addFilter({
        column,
        operator,
        value,
      });
    }
  };

  getFilter = (column, operator) => {
    const { filters } = this.state;
    return filters.find(({ column: columnName, operator: operatorName }) => column === columnName && operator === operatorName);
  };

  addFilter = (newFilter = {}) => {
    const { filters, logicalOperator } = this.state;
    const state = { filters: [...filters, newFilter], logicalOperator };
    if (newFilter.value) {
      this.setFilters(state);
    } else {
      this.setState(state);
    }
  };

  onFilterChange = (filter, newFilter) => {
    const { filters, logicalOperator } = this.state;
    const index = filters.indexOf(filter);

    const state = {
      filters: [
        ...filters.slice(0, index),
        newFilter,
        ...filters.slice(index + 1),
      ],
      logicalOperator,
      'page-number': 0,
    };

    this.setFilters(state);
  };

  onFilterRemove = (filter) => {
    const { filters, logicalOperator } = this.state;
    const index = filters.indexOf(filter);
    const next = [...filters.slice(0, index), ...filters.slice(index + 1)];
    this.setFilters({ filters: next, logicalOperator, 'page-number': 0 });
  };

  onLogicalOperatorChange = (logicalOperator) => {
    const { filters } = this.state;
    this.setFilters({ filters, logicalOperator, 'page-number': 0 });
  };

  setFilters = (state) => {
    const { location, history } = this.props;
    const qs = state.filters.length
      ? simpleQStringify(makeQuerystringFilters(state))
      : '';
    history.push(`${location.pathname}${qs}`);
    this.setState(state);
  };

  render() {
    const {
      datatable,
      status,
      sectionFilters,
      location,
    } = this.props;

    const {
      addFilter,
      doSearch,
      onFilterChange,
      onFilterRemove,
      onLogicalOperatorChange,
      getFilter,
    } = this;

    const columns = datatable
      ? datatable.columns
      : [];

    const query = makeQuerystringFilters(this.state, sectionFilters);
    const basePath = `${location.pathname}${simpleQStringify(makeQuerystringFilters(this.state))}`;

    return this.props.children({
      addFilter,
      doSearch,
      onFilterChange,
      onFilterRemove,
      onLogicalOperatorChange,
      getFilter,

      columns,
      hasFinished: status.datatable.hasFinished,
      filterState: this.state,
      basePath,
      query,
    });
  }
}
