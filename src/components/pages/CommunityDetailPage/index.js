import React, { Fragment, Component } from 'react';
import styled from 'styled-components';
import { object, func, number, bool } from 'prop-types';
import Sticky from 'react-stickynode';

import { getBreadCrumbsForCommunity, getCitySearchUrl } from 'sly/services/helpers/url';

import CommunityDetailPageTemplate from 'sly/components/templates/CommunityDetailPageTemplate';

import { getHelmetForCommunityPage } from 'sly/services/helpers/html_headers';
import { size } from 'sly/components/themes';

import ConciergeContainer from 'sly/containers/ConciergeContainer';
import ConciergeController from 'sly/controllers/ConciergeController';
import StickyFooter from 'sly/components/molecules/StickyFooter';
import CommunityStickyHeader from 'sly/components/organisms/CommunityStickyHeader';
import { Link, Heading, Hr } from 'sly/components/atoms';
import CollapsibleSection from 'sly/components/molecules/CollapsibleSection';
import Section from 'sly/components/molecules/Section';
import CareServicesList from 'sly/components/organisms/CareServicesList';
import PropertyReviews from 'sly/components/organisms/PropertyReviews';
import CommunityDetails from 'sly/components/organisms/CommunityDetails';
import PricingAndAvailability from 'sly/components/organisms/PricingAndAvailability';
import SimilarCommunities from 'sly/components/organisms/SimilarCommunities';
import AmenitiesAndFeatures from 'sly/components/organisms/AmenitiesAndFeatures';
import CommunityMap from 'sly/components/organisms/CommunityMap';
import CommunityMediaGallery from 'sly/components/organisms/CommunityMediaGallery';
import MorePictures from 'sly/components/organisms/MorePictures';
import HowSlyWorks from 'sly/components/organisms/HowSlyWorks';
import CommunitySummary from 'sly/components/organisms/CommunitySummary';
import CommunityQuestionAnswersContainer from 'sly/containers/CommunityQuestionAnswersContainer';
import BreadCrumb from 'sly/components/molecules/BreadCrumb';
import Button from 'sly/components/atoms/Button';

const BackToSearch = styled.div`
  text-align: center
`;

const NameHeading = styled(Heading)`
  margin-bottom: ${size('spacing.small')};
  line-height: ${size('lineHeight.minimal')};

  a { display: none; }
  &:hover { a { display: unset; } }
`;

const AddressHeading = styled(Heading)`
  margin-bottom: ${size('spacing.xLarge')};
`;

export default class CommunityDetailPage extends Component {
  static propTypes = {
    user: object,
    community: object.isRequired,
    onLocationSearch: func,
    mediaGallerySlideIndex: number,
    isMediaGalleryFullscreenActive: bool,
    onMediaGallerySlideChange: func,
    onMediaGalleryToggleFullscreen: func,
    isStickyHeaderVisible: bool,
    onToggleStickyHeader: func,
    onBackToSearchClicked: func,
    onReviewLinkClicked: func,
    onConciergeNumberClicked: func,
    onReceptionNumberClicked: func,
  };

  componentDidMount() {
    // if page is reloaded at scroll position where sticky header should be visible, don't wait for scroll to happen
    this.handleScroll();
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  // TODO: use ref forwarding once we upgrade to react 16.3+: https://reactjs.org/docs/forwarding-refs.html
  communityReviewsRef = React.createRef();
  breadCrumbRef = React.createRef();
  pricingAndFloorPlansRef = React.createRef();
  communitySummaryRef = React.createRef();
  amenitiesAndFeaturesRef = React.createRef();

  handleScroll = () => {
    if (this.breadCrumbRef.current) {
      const { onToggleStickyHeader, isStickyHeaderVisible } = this.props;
      const rect = this.breadCrumbRef.current.getBoundingClientRect();
      const elemTop = rect.top;
      const isVisible = elemTop < 0;

      // Important: don't trigger rerender if sticky header visiblity hasn't changed
      if (isStickyHeaderVisible !== isVisible) {
        onToggleStickyHeader();
      }
    }
  };

  handleMorePicturesClick = (image) => {
    const {
      community, onMediaGallerySlideChange, onMediaGalleryToggleFullscreen,
    } = this.props;
    const { gallery = {}, videoGallery = {} } = community;
    const images = gallery.images || [];
    const videos = videoGallery.videos || [];
    let matchingIndex = images.findIndex(i => image.id === i.id);
    if (matchingIndex > -1) {
      matchingIndex = videos.length + matchingIndex;
      onMediaGallerySlideChange(matchingIndex, true);
      onMediaGalleryToggleFullscreen(true);
    }
  };

  render() {
    const {
      mediaGallerySlideIndex,
      isMediaGalleryFullscreenActive,
      community,
      onLocationSearch,
      onMediaGallerySlideChange,
      onMediaGalleryToggleFullscreen,
      onBackToSearchClicked,
      isStickyHeaderVisible,
      user,
      onReviewLinkClicked,
      onConciergeNumberClicked,
      onReceptionNumberClicked,
    } = this.props;

    const {
      id,
      name,
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
      twilioNumber,
      user: communityUser,
      questions,
      mainImage,
      url,
    } = community;

    const {
      careServices, licenseUrl, serviceHighlights, communityPhone,
    } = propInfo;

    let images = gallery.images || [];
    // If there is a mainImage put it in front
    const communityMainImage = images.find((element) => {
      return element.sd === mainImage;
    });
    if (communityMainImage) {
      images = images.filter(img => img.sd !== communityMainImage.sd);
      images.unshift(communityMainImage);
      gallery.images = images;
    }
    const videos = videoGallery.videos || [];

    const {
      communityDescription,
      staffDescription,
      residentDescription,
      ownerExperience,
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
    const { hasSlyReviews, hasWebReviews, reviewsValue } = propRatings;
    const ratingsArray = propRatings.ratingsArray || [];
    const reviewsFinal = reviews || [];
    const serviceHighlightsFinal = serviceHighlights || [];
    const roomPrices = floorPlans.map(({ info }) => info);
    // TODO: mock as USA until country becomes available
    address.country = 'USA';
    const formattedAddress = `${address.line1}, ${address.line2}, ${
      address.city
    }, ${address.state}
      ${address.zip}`
      .replace(/\s/g, ' ')
      .replace(/, ,/g, ', ');
    const stickyHeaderItems = [
      { label: 'Summary', ref: this.communitySummaryRef },
      { label: 'Pricing & Floor Plans', ref: this.pricingAndFloorPlansRef },
      { label: 'Reviews', ref: this.communityReviewsRef },
    ];
    // 24px or 84px (when sticky header is visible) from top TODO: figure out how to get this from styled theme sizes
    const columnContent = (
      <Sticky
        top={isStickyHeaderVisible ? 84 : 24}
        bottomBoundary="#sticky-sidebar-boundary"
      >
        <ConciergeContainer community={community} />
      </Sticky>
    );
    const bottomContent = (
      <Fragment>
        { getHelmetForCommunityPage(community) }
        {/* TODO: replace with <> </> after upgrading to babel 7 & when eslint adds support for jsx fragments */}
        <Section title={`Map View of ${name}`}>
          <CommunityMap
            community={community}
            similarProperties={similarProperties}
          />
        </Section>
        {(images.length > 1) &&
          <Section title="More Pictures">
            <MorePictures gallery={gallery} communityName={name} onPictureClick={this.handleMorePicturesClick} />
          </Section>
        }

        <Section title="How Seniorly Works">
          <HowSlyWorks />
        </Section>
      </Fragment>
    );
    return (
      <Fragment>
        {/* TODO: replace with <> </> after upgrading to babel 7 & when eslint adds support for jsx fragments */}
        <CommunityStickyHeader
          items={stickyHeaderItems}
          visible={isStickyHeaderVisible}
        />
        <CommunityDetailPageTemplate
          column={columnContent}
          bottom={bottomContent}
          onLocationSearch={onLocationSearch}
        >
          {(images.length > 0 || videos.length > 0) &&
            <CommunityMediaGallery
              communityName={name}
              currentSlide={mediaGallerySlideIndex}
              images={images}
              videos={videos}
              onSlideChange={onMediaGallerySlideChange}
              isFullscreenMode={isMediaGalleryFullscreenActive}
              onToggleFullscreenMode={onMediaGalleryToggleFullscreen}
            />
          }
          <BreadCrumb items={getBreadCrumbsForCommunity({ name, propInfo, address })} innerRef={this.breadCrumbRef} />

          <NameHeading level="hero" size="hero">
            {name}{' '}
            {(user && user.admin) &&
              <Link
                to={`/mydashboard#/mydashboard/communities/${community.id}/about`}
              >
               (Edit)
              </Link>
            }
          </NameHeading>

          <AddressHeading level="subtitle" size="subtitle">{formattedAddress}</AddressHeading>
          <CommunitySummary
            innerRef={this.communitySummaryRef}
            pricingAndFloorPlansRef={this.pricingAndFloorPlansRef}
            amenitiesAndFeaturesRef={this.amenitiesAndFeaturesRef}
            communityReviewsRef={this.communityReviewsRef}
            twilioNumber={twilioNumber}
            reviewsValue={reviewsValue}
            phoneNumber={communityPhone}
            licenseUrl={licenseUrl}
            user={communityUser}
            amenityScore={rgsAux.amenityScore}
            startingRate={startingRate}
            providedAverage={rgsAux.providedAverage}
            communityHighlights={communityHighlights}
            reviews={reviews}
            onConciergeNumberClicked={onConciergeNumberClicked}
            onReceptionNumberClicked={onReceptionNumberClicked}
          />

          <CollapsibleSection
            title="Pricing & Floor Plans"
            innerRef={this.pricingAndFloorPlansRef}
          >
            <ConciergeController community={community}>
              {({ concierge, getPricing }) => (
                <PricingAndAvailability
                  community={community}
                  address={address}
                  estimatedPrice={rgsAux.estimatedPrice}
                  roomPrices={roomPrices}
                  onInquireOrBookClicked={getPricing}
                />
              )}
            </ConciergeController>
          </CollapsibleSection>
          <CollapsibleSection title="Similar Communities">
            <SimilarCommunities similarProperties={similarProperties} />
            <BackToSearch>
              <Button
                ghost
                onClick={onBackToSearchClicked}
                href={getCitySearchUrl({ propInfo, address })}
              >
                Communities In {address.city}
              </Button>
            </BackToSearch>
          </CollapsibleSection>
          {(communityDescription || rgsAux.slyCommunityDescription) &&
            <CollapsibleSection title="Community Details">
              <CommunityDetails
                communityName={name}
                communityDescription={communityDescription || rgsAux.slyCommunityDescription}
                staffDescription={staffDescription}
                residentDescription={residentDescription}
                ownerExperience={ownerExperience}
              />
            </CollapsibleSection>
          }
          <CollapsibleSection paddedContent={true} title="Care Services">
            <CareServicesList
              communityName={name}
              careServices={careServices}
              serviceHighlights={serviceHighlightsFinal}
            />
          </CollapsibleSection>
          <CollapsibleSection
            paddedContent={true}
            title="Amenities & Features"
            innerRef={this.amenitiesAndFeaturesRef}
          >
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
          <CollapsibleSection title="Reviews" innerRef={this.communityReviewsRef}>
            <PropertyReviews
              hasSlyReviews={hasSlyReviews}
              hasWebReviews={hasWebReviews}
              reviews={reviewsFinal}
              reviewRatings={ratingsArray}
              onLeaveReview={onLeaveReview}
              onReviewLinkClicked={onReviewLinkClicked}
            />
          </CollapsibleSection>
          <CollapsibleSection title="Questions">
            <CommunityQuestionAnswersContainer
              communityName={name}
              communitySlug={id}
              questions={questions}
            />
          </CollapsibleSection>
          <Hr id="sticky-sidebar-boundary" />
        </CommunityDetailPageTemplate>
        <ConciergeController community={community}>
          {({ concierge, getPricing }) => (
            <StickyFooter
              footerInfo={{
                title: 'Contact Property',
                name: community.name,
                ctaTitle: 'Contact',
              }}
              onFooterClick={getPricing}

            />

          )}
        </ConciergeController>
      </Fragment>
    );
  }
}
