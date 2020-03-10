import React, { Component } from 'react';
import { object, func } from 'prop-types';
import * as immutable from 'object-path-immutable';
import { parse } from 'query-string';

import { community as communityPropType } from 'sly/propTypes/community';
import SlyEvent from 'sly/services/helpers/events';
import PricingWizardPage from 'sly/components/pages/PricingWizardPage';
import { medicareToBool } from 'sly/services/helpers/userDetails';
import { prefetch, query, withAuth } from 'sly/services/newApi';
import withWS from 'sly/services/ws/withWS';
import { PRICING_REQUEST, PROFILE_CONTACTED } from 'sly/services/newApi/constants';
import { withRedirectTo } from 'sly/services/redirectTo';

const eventCategory = 'PricingWizard';

@prefetch('community', 'getCommunity', (req, { match }) => req({
  id: match.params.communitySlug,
  include: 'similar-communities,agents',
}))

@withWS
@withAuth
@query('updateUuidAux', 'updateUuidAux')
@query('createAction', 'createUuidAction')
@withRedirectTo

export default class PricingWizardPageContainer extends Component {
  static propTypes = {
    community: communityPropType,
    user: object,
    userHas: func.isRequired,
    uuidAux: object,
    status: object,
    createAction: func.isRequired,
    updateUuidAux: func.isRequired,
    createOrUpdateUser: func.isRequired,
    redirectTo: func.isRequired,
    match: object.isRequired,
    location: object.isRequired,
    ensureAuthenticated: func.isRequired,
    ws: object,
  };

  constructor(props) {
    super(props);

    const { location } = this.props;
    const { type } = parse(location.search);
    this.type = type || 'pricing';
  }

  componentWillUnmount() {
    const { ws } = this.props;

    ws.doDestroyWSConnection();
  }

  sendEvent = (action, label, value) => SlyEvent.getInstance().sendEvent({
    category: `${eventCategory}-${this.type}`,
    action,
    label,
    value,
  });

  updateUuidAux = (data) => {
    const {
      status,
      updateUuidAux,
    } = this.props;

    const rawUuidAux = status.uuidAux.result;
    const uuidAux = immutable.wrap(rawUuidAux);

    if (data.roomType) {
      uuidAux.set('attributes.uuidInfo.housingInfo.roomPreference', data.roomType);
    }

    if (data.moveTimeline) {
      uuidAux.set('attributes.uuidInfo.housingInfo.moveTimeline', data.moveTimeline);
    }

    if (data.careType) {
      uuidAux.set('attributes.uuidInfo.careInfo.adls', data.careType);
    }

    if (data.interest) {
      uuidAux.set('attributes.uuidInfo.residentInfo.interest', data.interest);
    }

    if (data.medicaidCoverage) {
      uuidAux.set('attributes.uuidInfo.financialInfo.medicaid', medicareToBool(data.medicaidCoverage));
    }
    if (data.budget) {
      uuidAux.set('attributes.uuidInfo.financialInfo.maxMonthlyBudget', data.budget);
    }

    return updateUuidAux({ id: rawUuidAux.id }, uuidAux.value());
  };

  submitActionAndCreateUser = (data, currentStep) => {
    const {
      community,
      user,
      createOrUpdateUser,
      match,
      createAction,
      ensureAuthenticated,
      ws,
    } = this.props;

    const {
      name = (user && user.name) || undefined,
      phone = (user && user.phoneNumber) || undefined,
      email = (user && user.email) || undefined,
    } = data;
    const regPhone = phone.replace(/\D/g, '');
    return createAction({
      type: 'UUIDAction',
      attributes: {
        actionInfo: {
          phone,
          name,
          email,
          contactType: PRICING_REQUEST,
          slug: community.id,
        },
        actionPage: match.url,
        actionType: PROFILE_CONTACTED,
      },
    }).then(() => createOrUpdateUser({
      name,
      phone: regPhone,
      email,
    }, {
      ignoreAlreadyRegistered: true,
    }).then(({ alreadyExists }) => {
      if (alreadyExists) {
        ensureAuthenticated({ emailOrPhone: email || regPhone });
        ws.setup(true);
      }
      this.sendEvent('pricing-contact-submitted', community.id, currentStep);
    }));
  };

  getHasFinished = () => {
    const { status } = this.props;
    const { hasFinished: communityHasFinished } = status.community;

    return communityHasFinished;
  };

  render() {
    const {
      community, user, userHas, uuidAux, redirectTo, match,
    } = this.props;

    if (!this.getHasFinished()) {
      return null;
    }

    return (
      <PricingWizardPage
        community={community}
        user={user}
        uuidAux={uuidAux}
        userHas={userHas}
        updateUuidAux={this.updateUuidAux}
        submitActionAndCreateUser={this.submitActionAndCreateUser}
        redirectTo={redirectTo}
        match={match}
        type={this.type}
        sendEvent={this.sendEvent}
      />
    );
  }
}
