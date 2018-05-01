import React, { Component } from 'react';
import { Heading, Link } from 'sly/components/atoms';

import CollapsibleSection from 'sly/components/molecules/CollapsibleSection';
import CareServicesList from 'sly/components/organisms/CareServicesList';
import PropertyReviews from 'sly/components/organisms/PropertyReviews';
import CommunityDetails from 'sly/components/organisms/CommunityDetails';
import PricingAndAvailability from 'sly/components/organisms/PricingAndAvailability';
import SimilarCommunities from 'sly/components/organisms/SimilarCommunities';
import AmenitiesAndFeatures from 'sly/components/organisms/AmenitiesAndFeatures';
import OwnerStory from 'sly/components/organisms/OwnerStory';
import CommunityMap from 'sly/components/organisms/CommunityMap';
import CommunityMediaGallery from 'sly/components/organisms/CommunityMediaGallery';

// TODO: remove this
const nextUri = (() => {
  const uris = ['rhoda-goldman-plaza', 'buena-vista-manor-house'];
  return (slug) => {
    const index = uris.indexOf(slug) + 1;
    return uris[index % 2];
  };
})();

export default class CommunityDetail extends Component {
  render() {
    const { community, ...props } = this.props;
    const {
      id,
      name,
      mainImage,
      startingRate,
      propInfo,
      propRatings,
      reviews,
      address,
      rgsAux,
      floorPlans,
      similarProperties,
      gallery = {},
      videoGallery = {},
    } = community;
    const images = gallery.images || [];
    const videos = videoGallery.videos || [];
    const { careServices, serviceHighlights } = propInfo;
    const {
      communityDescription,
      staffDescription,
      residentDescription,
      ownerExprience,
    } = propInfo;
    const {
      communityHighlights,
      personalSpace,
      personalSpaceOther,
      communitySpace,
      communitySpaceOther,
      nonCareServices,
      nonCareServicesOther,
      languages,
      languagesOther,
    } = propInfo;

    // TODO: move this to a container for PropertyReviews handling posts
    const onLeaveReview = () => {};
    // TODO: move this to a container PricingAndAvailability for handling bookings
    const onInquireOrBookClicked = () => {};
    const { hasSlyReviews, hasWebReviews } = propRatings;
    const ratingsArray = propRatings.ratingsArray || [];
    const reviewsFinal = reviews || [];
    const serviceHighlightsFinal = serviceHighlights || [];
    const roomPrices = floorPlans.map(({ info }) => info);
    // TODO: mock as USA until country becomes available
    address.country = 'USA';
    const mapViewTitle = `Map View of ${name}`;
    return (
      <div {...props}>
        <CommunityMediaGallery
          communityName={name}
          images={images}
          videos={videos}
        />
        <Heading level="hero">{name}</Heading>
        {/* temp shiz */}
        <Link to={`/community/${nextUri(community.id)}`}>
          Link to test navigation cross profile
        </Link>
        <CollapsibleSection title="Pricing & Floor Plans">
          <PricingAndAvailability
            communityName={name}
            address={address}
            estimatedPrice={rgsAux.estimatedPrice}
            roomPrices={roomPrices}
            onInquireOrBookClicked={onInquireOrBookClicked}
          />
        </CollapsibleSection>
        <CollapsibleSection title="Similar Communities">
          <SimilarCommunities similarProperties={similarProperties} />
        </CollapsibleSection>
        <CollapsibleSection title="Community Details">
          <CommunityDetails
            communityName={name}
            communityDescription={communityDescription}
            staffDescription={staffDescription}
            residentDescription={residentDescription}
          />
        </CollapsibleSection>
        <CollapsibleSection title="Care Services">
          <CareServicesList
            communityName={name}
            careServices={careServices}
            serviceHighlights={serviceHighlightsFinal}
          />
        </CollapsibleSection>
        <CollapsibleSection title="Amenities & Features">
          <AmenitiesAndFeatures
            communityName={name}
            communityHighlights={communityHighlights}
            personalSpace={personalSpace}
            personalSpaceOther={personalSpaceOther}
            communitySpace={communitySpace}
            communitySpaceOther={communitySpaceOther}
            nonCareServices={nonCareServices}
            nonCareServicesOther={nonCareServicesOther}
            languages={languages}
            languagesOther={languagesOther}
          />
        </CollapsibleSection>
        <CollapsibleSection title="Owner's Story">
          <OwnerStory ownerExprience={ownerExprience} />
        </CollapsibleSection>
        <CollapsibleSection title="Reviews">
          <PropertyReviews
            hasSlyReviews={hasSlyReviews}
            hasWebReviews={hasWebReviews}
            reviews={reviewsFinal}
            reviewRatings={ratingsArray}
            onLeaveReview={onLeaveReview}
          />
        </CollapsibleSection>
        <CollapsibleSection title={mapViewTitle} size="large">
          <CommunityMap
            id={id}
            name={name}
            startingRate={startingRate}
            mainImage={mainImage}
            address={address}
            similarProperties={similarProperties}
          />
        </CollapsibleSection>
      </div>
    );
  }
}
