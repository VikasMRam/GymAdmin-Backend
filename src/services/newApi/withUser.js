import React, { Component } from 'react';
import { connect } from 'react-redux';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { object, func } from 'prop-types';

import prefetch from './prefetch';
import withApi from './withApi';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName
    || WrappedComponent.name
    || 'Component';
}

const mapStateToProps = (state, { status }) => ({
  isUserLoggedIn: status.user.status !== 401,
});

export default function withUser() {
  return (InnerComponent) => {
    @withApi

    @prefetch('user', 'getUser', req => req({ id: 'me' }))

    @connect(mapStateToProps, dispatch => ({ dispatch }))

    class Wrapper extends Component {
      static displayName = `withUser(${getDisplayName(InnerComponent)})`;

      static propTypes = {
        api: object.isRequired,
        dispatch: func.isRequired,
        status: object.isRequired,
      };

      static WrappedComponent = InnerComponent;

      registerUser = (options = {}) => {
        const { dispatch, api, status } = this.props;
        const { ignoreExisting, ...data } = options;
        // FIXME: API does not give enough info on how to figure ignoreExisting
        // FIXME: @knlshah, please fix this both here and api
        return dispatch(api.registerUser(data)).catch((e) => {
          const alreadyExists = e.body
            && e.body.errors
            && Object.values(e.body.errors)
              .some(e => e.includes('user already exists'));
          if (ignoreExisting && alreadyExists) {
            return Promise.resolve();
          }
          return Promise.reject(e);
        }).then(() => status.user.refetch());
      };

      loginUser = (data) => {
        const { dispatch, api, status } = this.props;
        return dispatch(api.loginUser(data)).then(() => status.user.refetch());
      };

      recoverPassword = (data) => {
        const { dispatch, api } = this.props;
        return dispatch(api.recoverPassword(data));
      };

      thirdpartyLogin = (data) => {
        const { dispatch, api, status } = this.props;
        return dispatch(api.thirdpartyLogin(data)).then(() => status.user.refetch());
      };

      render() {
        return (
          <InnerComponent
            {...this.props}
            loginUser={this.loginUser}
            registerUser={this.registerUser}
            recoverPassword={this.recoverPassword}
            thirdpartyLogin={this.thirdpartyLogin}
          />
        );
      }
    }

    hoistNonReactStatic(Wrapper, InnerComponent);

    return Wrapper;
  };
}
