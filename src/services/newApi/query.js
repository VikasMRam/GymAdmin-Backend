import React from 'react';
import { connect } from 'react-redux';
import { func } from 'prop-types';

import { destroy, get } from 'sly/services/newApi/httpMethods';
import api from 'sly/services/newApi/apiInstance';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName
    || WrappedComponent.name
    || 'Component';
}

export default function query(propName, apiCall) {
  if (typeof apiCall === 'undefined') apiCall = propName;
  return (InnerComponent) => {
    @connect(null, dispatch => ({ dispatch }))
    class Wrapper extends React.Component {
      static displayName = `query(${getDisplayName(InnerComponent)}, ${propName})`;
      static WrappedComponent = InnerComponent.WrappedComponent || InnerComponent;
      static propTypes = {
        dispatch: func.isRequired,
      };

      // props fetch not bound to dispatch
      // FIXME: dispatch posts and patches, dispatch invalidate for delete
      fetch = (...args) => {
        const call = api[apiCall];

        if (get === call.method) {
          return call(...args);
        }

        if (destroy === call.method) {
          return this.props.dispatch(call.asAction(...args));
        }

        const placeholders = args.length >= 2 ? args[0] : {};
        const data = args.length >= 2 ? args[1] : args[0];
        const options = args.length === 3 ? args[2] : {};

        return this.props.dispatch(call.asAction(placeholders, { data }, options));
      };

      render() {
        const { ...props } = this.props;

        const innerProps = {
          ...props,
          [propName]: this.fetch,
        };

        return <InnerComponent {...innerProps} />;
      }
    }

    // FIXME: hack because hoist... loses contextTypes
    Wrapper.typeHydrationId = InnerComponent.typeHydrationId;
    // hoistNonReactStatic(Wrapper, InnerComponent);

    return Wrapper;
  };
}
