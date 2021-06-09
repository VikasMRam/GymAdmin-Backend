import React, { Component } from 'react';
import { func } from 'prop-types';

import End from 'sly/web/assessment/steps/End';


// const EndFormContainer = props => <End {...props} />;

export default class EndContainer extends Component {
  static propTypes = {
    onComplete: func,
  }
  submit= () => {
    const { onComplete } = this.props;
    setTimeout(onComplete, 4000);
  }
  render() {
    this.submit();
    return <End />;
  }
}