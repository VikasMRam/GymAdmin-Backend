import React, { Component } from 'react';
import { connect } from 'react-redux';
import { string, func, bool, object } from 'prop-types';
import styled from 'styled-components';

import { size } from 'sly/components/themes';
import { getDetail } from 'sly/store/selectors';

import {
  createValidator,
  required,
  email,
  usPhone,
} from 'sly/services/validation';

import Thankyou from 'sly/components/molecules/Thankyou';
import ConversionFormContainer from 'sly/containers/ConversionFormContainer';
import RCBModalContainer from 'sly/containers/RCBModalContainer';

import {
  resourceDetailReadRequest,
  resourceCreateRequest,
} from 'sly/store/resource/actions';


class ConciergeContainer extends Component {
  static propTypes = {
    // TODO: shape
    property: object,
    userRequestedCB: bool,
  };

  static defaultProps = {
    userRequestedCB: false,
  };

  submit = data => {
    const { submit } = this.props;
    submit(data);
  }

  render() {
    const { userRequestedCB, property, className } = this.props;
    return [ 
      <div key="column" className={className}>
        { userRequestedCB
            ? <ConversionFormContainer onSubmit={this.submit} />
            : <Thankyou community={property} onClose={() => {}} />
        }
      </div>,
      <RCBModalContainer key="modal" onClose={()=>{}} />
    ];
  }
}

const mapStateToProps = (state, { propertySlug, userActions, property }) => {
  const userRequestedCB = userActions && (userActions.profilesContacted || [])
    .some(property => property.slug === propertySlug);
  return { userRequestedCB, property };
};

const mapDispatchToProps = (dispatch, { propertySlug }) => ({
  submit: data => {
    data.slug = propertySlug;
    return dispatch(resourceCreateRequest('userAction', data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ConciergeContainer);
