import React, { Component } from 'react';
import { string, func, bool, object } from 'prop-types';
import styled from 'styled-components';
import get from 'lodash/get';
import { withRouter } from 'react-router';

import { resourceCreateRequest } from 'sly/store/resource/actions';
import { getSearchParams } from 'sly/services/helpers/search';

import { getDetail } from 'sly/store/selectors';
import { connectController } from 'sly/controllers';
import SlyEvent from 'sly/services/helpers/events';
import { community as communityPropType } from 'sly/propTypes/community';
import { ASSESSMENT, REQUEST_CALLBACK, REQUEST_CONSULTATION, REQUEST_PRICING, REQUEST_AVAILABILITY  } from 'sly/services/api/actions';

import {
  createValidator,
  createBooleanValidator,
  required,
  notProvided,
  email,
  usPhone,
} from 'sly/services/validation';

import { CONCIERGE } from 'sly/constants/modalType';

export const CONVERSION_FORM = 'conversionForm';
export const EXPRESS_CONVERSION_FORM = 'expressConversionForm';
export const ADVANCED_INFO = 'advancedInfo';
export const SIMILAR_COMMUNITIES = 'similarCommunities';
export const WHAT_NEXT = 'whatNext';
export const HOW_IT_WORKS = 'howItWorks';

const isAssessment = ({
  typeOfCare,
  timeToMove,
  budget
}) => !!(typeOfCare && timeToMove && budget);

const hasAllUserData = createBooleanValidator({
  fullName: [required],
  email: [required, email],
  phone: [required, usPhone],
});

const hasUserData = createValidator({
  fullName: [required],
  email: [required, email],
  phone: [required, usPhone],
});

const hasOnlyEmail = createBooleanValidator({
  fullName: [notProvided],
  email: [required, email],
  phone: [notProvided],
});

export class ConciergeController extends Component {
  static propTypes = {
    community: communityPropType.isRequired,
    concierge: object.isRequired,
    children: func.isRequired,
    set: func.isRequired,
    queryParams: object,
    setQueryParams: func.isRequired,
  };

  getPricing = () => {
    const {
      concierge,
      community,
      userDetails,
    } = this.props;

    const {
      pricingRequested,
    } = concierge;

    SlyEvent.getInstance().sendEvent({
      action: 'click',
      category: 'getPricing',
      label: community.id
    });

    if (!pricingRequested && hasAllUserData(userDetails)) {
      this.doSubmitConversion(userDetails,REQUEST_PRICING, true);
    } else {
      this.next(false);
    }
  };

  gotoAdvancedInfo = () => {
    const {
      userDetails,
      setQueryParams,
    } = this.props;

    SlyEvent.getInstance().sendEvent({
      action: 'click',
      category: 'adRequestConsultation',
      label: 'profilePage'
    });

    if (!isAssessment(userDetails)) {
      setQueryParams({ modal: CONCIERGE, currentStep: ADVANCED_INFO });
    } else {
      this.next();
    }
  };

  gotoWhatNext = () => {
    const { setQueryParams } = this.props;
    setQueryParams({ modal: CONCIERGE, currentStep: HOW_IT_WORKS });
  }

  submitExpressConversion = (data) => {
    const {
      community,
      concierge

    } = this.props;
    if (data.phone && data.phone.match(/\d+/)) {
      let eventCategory = concierge.modalIsOpen ? 'requestAvailabilityConsultation' : 'requestConsultation';
      SlyEvent.getInstance().sendEvent({
        action: 'contactCommunity',
        category: eventCategory,
        label: community.id
      });
      this.doSubmitConversion(data,REQUEST_CONSULTATION, true);
    } else {
      SlyEvent.getInstance().sendEvent({
        action: 'contactCommunity',
        category: 'requestAvailability',
        label: community.id
      });
      this.doSubmitConversion(data,REQUEST_AVAILABILITY, true);
    }


  };

  submitRegularConversion = (data) => {
    const {
      community,
      concierge
    } = this.props;
    let eventCategory = 'requestConsultation';
    if (!concierge.pricingRequested && !concierge.availabilityRequested) {
      eventCategory = 'requestConsultation';
      //Regular advanced info
    } else if(concierge.modalIsOpen && concierge.pricingRequested) {
      //Pricing advanced info
      eventCategory = 'requestConsultationPricing';
    } else if (concierge.modalIsOpen && concierge.availabilityRequested) {
      //Availability Advanced Info
      eventCategory = 'requestConsultationAvailability';
    }

    SlyEvent.getInstance().sendEvent({
      action: 'contactCommunity',
      category: eventCategory,
      label: community.id
    });
    this.doSubmitConversion(data,REQUEST_CONSULTATION, false);
  };

  doSubmitConversion = (data={}, action, isExpress=false) => {
    const {
      submit,
      community,
      concierge,
    } = this.props;

    submit({
      action,
      value: {
        user: { ...data },
        propertyIds: [community.id],
      }
    }).then(() => {

      this.next(isExpress);
    });
  };

  submitAdvancedInfo = (data) => {
    const { submit, community, concierge } = this.props;
    const { message, ...rest } = data;
    let eventCategory = 'advancedInfo';
    //Not a 100% correct.
    if (!concierge.pricingRequested && !concierge.availabilityRequested) {
      eventCategory = 'advancedInfo';
      //Regular advanced info
    } else if(concierge.pricingRequested) {
      //Pricing advanced info
      eventCategory = 'advancedInfoPricing';
    } else if (concierge.availabilityRequested) {
      //Availability Advanced Info
      eventCategory = 'advancedInfoAvailability';
    }

    SlyEvent.getInstance().sendEvent({
      action: 'submit',
      category: eventCategory,
      label: community.id
    });

    submit({
      action: ASSESSMENT,
      value: {
        user: { ...rest },
        message,
        propertyIds: [community.id],
      }
    }).then(() => this.next(false));
  };

  next = (isExpress) => {
    const {
      concierge,
      getDetailedPricing,
      setQueryParams,
      userDetails,
    } = this.props;


    const {
      contactRequested,
      consultationRequested,
    } = concierge;

    const Done = (
      ( contactRequested || consultationRequested )
      && isAssessment(userDetails)
      && hasAllUserData(userDetails)
    );

    if (Done) {
      setQueryParams({ modal: CONCIERGE, currentStep: WHAT_NEXT });
    }

    if (!hasAllUserData(userDetails)) {
      setQueryParams({ modal: CONCIERGE, currentStep: CONVERSION_FORM });
    }

    if (!isAssessment(userDetails)) {
      setQueryParams({ modal: CONCIERGE, currentStep: ADVANCED_INFO });
    }
  };

  close = () => {
    const { setQueryParams } = this.props;
    setQueryParams({ modal: null, currentStep: null });
  };

  render() {
    const {
      children,
      concierge,
      userDetails,
    } = this.props;

    const {
      getPricing,
      gotoAdvancedInfo,
      gotoWhatNext,
      submitRegularConversion,
      submitExpressConversion,
      submitAdvancedInfo,
      close,
    } = this;

    return children({
      concierge,
      userDetails,
      getPricing,
      gotoWhatNext,
      gotoAdvancedInfo,
      submitRegularConversion,
      submitExpressConversion,
      submitAdvancedInfo,
      close,
    });
  }
}

const isCallbackorPricingAvailReq = slug => contact =>
  contact.slug === slug
  && (contact.contactType === REQUEST_CALLBACK || contact.contactType === REQUEST_PRICING || contact.contactType == REQUEST_AVAILABILITY) ;

const isPricingReq = slug => contact =>
  contact.slug === slug
  && (contact.contactType === REQUEST_PRICING) ;

const isAvailReq = slug => contact =>
  contact.slug === slug
  && (contact.contactType === REQUEST_AVAILABILITY) ;

const mapStateToProps = (state, props) => {
  const { community, queryParams } = props;
  const {
    profilesContacted,
    consultationRequested,
    userDetails = {},
  } = getDetail(state, 'userAction') || {};
  const { modal, currentStep } = queryParams;
  return {
    community,
    userDetails,
    concierge: {
      currentStep: currentStep || CONVERSION_FORM,
      modalIsOpen: modal === CONCIERGE || false,
      consultationRequested,
      pricingRequested: (profilesContacted || []).some(isPricingReq(community.id)),
      availabilityRequested: (profilesContacted || []).some(isAvailReq(community.id)),
      contactRequested: (profilesContacted || []).some(isCallbackorPricingAvailReq(community.id)),
    },
  };
};

const submit = data => resourceCreateRequest('userAction', data);

export default connectController(
  mapStateToProps,
  { submit },
)(ConciergeController);
