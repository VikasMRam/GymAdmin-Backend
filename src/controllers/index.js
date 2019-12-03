import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import hoistNonReactStatic from 'hoist-non-react-statics';

import { randomHexNumber } from 'sly/services/helpers/utils';
import { set, unset, reset } from 'sly/store/controller/actions';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName
    || WrappedComponent.name
    || 'Component';
}

// TODO: tests
export function connectController(parentMapStateToProps, parentDispatchToProps) {
  if (typeof parentDispatchToProps === 'function' && parentDispatchToProps.length > 1) {
    throw new Error('dispatchToProps should not use ownProps');
  }

  return function controllerCreator(WrappedComponent) {
    const generatedControllerKey = `${WrappedComponent.name}_${randomHexNumber()}`;

    const mapDispatchToProps = { ...parentDispatchToProps, set, unset, reset };

    const mapStateToProps = (state, ownProps) => {
      const controllerKey = ownProps.controllerKey || generatedControllerKey;
      const controller = get(state, ['controller', controllerKey]) || {};
      const props = {
        ...ownProps,
        controllerKey,
        controller,
      };
      return {
        ...props,
        ...parentMapStateToProps(state, {
          ...props,
        }),
      };
    };

    @connect(mapStateToProps, mapDispatchToProps)
    class ConnectedController extends React.Component {
      static displayName = `controller(${getDisplayName(WrappedComponent)})`;
      static WrappedComponent = WrappedComponent.WrappedComponent || WrappedComponent;

      set = (data) => {
        const { set, controllerKey } = this.props;
        return set({
          data,
          controller: controllerKey,
        });
      };

      unset = (data) => {
        const { unset, controllerKey } = this.props;
        return unset({
          data,
          controller: controllerKey,
        });
      };

      resetController = () => {
        const { reset, controllerKey } = this.props;
        return reset({
          controller: controllerKey,
        });
      };

      render() {
        return (
          <WrappedComponent
            {...this.props}
            set={this.set}
            unset={this.unset}
            resetController={this.resetController}
          />
        );
      }
    }

    hoistNonReactStatic(ConnectedController, WrappedComponent);

    return ConnectedController;
  };
}
