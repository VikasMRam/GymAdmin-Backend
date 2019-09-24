import React, { Component } from 'react';
import { object } from 'prop-types';

import { getAutocompleteValues } from 'sly/services/datatable/helpers';
import { Select } from 'sly/components/atoms';
import { normalizeResponse } from 'sly/services/newApi';

export default class Autocomplete extends Component {
  static propTypes = {
    column: object.isRequired,
  };

  loadOptions = (inputValue) => {
    const { column } = this.props;
    return fetch(`${column.typeInfo.api}${inputValue}`)
      .then(r => r.json())
      .then(normalizeResponse)
      .then(getAutocompleteValues(column))
      .catch(e => console.log(e));
  };

  render() {
    const { column, ...props } = this.props;
    return (
      <Select
        async
        loadOptions={this.loadOptions}
        {...props}
      />
    );
  }
}
