import React from 'react';
import PropTypes from 'prop-types';
import smoothscroll from 'smoothscroll-polyfill';

import { Link } from 'sly/components/atoms';
import List from 'sly/components/molecules/List';

const sectionIdMaps = {
  pricingAndFloorPlans: 'pricing-and-floor-plans',
  amenitiesAndFeatures: 'amenities-and-features',
  reviews: 'property-reviews',
};

export default class communitySummary extends React.Component {
  static propTypes = {
    phoneNumber: PropTypes.string,
    user: PropTypes.shape({
      phoneNumber: PropTypes.string,
    }),
    twilioNumber: PropTypes.shape({
      numbers: PropTypes.arrayOf(PropTypes.number),
    }),
    amenityScore: PropTypes.string,
    communityHighlights: PropTypes.arrayOf(PropTypes.string),
    startingRate: PropTypes.number,
    reviews: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.number,
    })),
  };

  static scrollToSection(e, section) {
    // Link triggers router navigation so need to preventDefault.
    // TODO: find better way to do it with any other component without much styling code
    e.preventDefault();
    const sectionRef = document.getElementById(sectionIdMaps[section]);
    if (sectionRef) {
      sectionRef.scrollIntoView({ behavior: 'smooth' });
    }
  }

  componentDidMount() {
    // this is not required when running in test env created by jsdom
    if (document.documentElement.clientHeight) {
      smoothscroll.polyfill();
    }
  }

  render() {
    const {
      twilioNumber, phoneNumber, user, amenityScore, communityHighlights, startingRate, reviews,
    } = this.props;
    const highlights = [];

    if (twilioNumber && twilioNumber.numbers.length) {
      highlights.push((
        <span>
          Pricing & Availability&nbsp;
          <Link href={`tel:${twilioNumber.numbers[0]}`}>
            {twilioNumber.numbers[0]}
          </Link>
        </span>
      ));
    }
    if (phoneNumber || (user && user.phoneNumber)) {
      highlights.push((
        <span>
          Reception&nbsp;
          <Link href={`tel:${phoneNumber || user.phoneNumber}`}>
            {phoneNumber || user.phoneNumber}
          </Link>
        </span>
      ));
    }
    if (amenityScore) {
      const parsedAmenityScore = parseFloat(amenityScore);
      if (parsedAmenityScore) {
        highlights.push((
          <Link
            href={`#${sectionIdMaps.amenitiesAndFeatures}`}
            onClick={e => this.constructor.scrollToSection(e, 'amenitiesAndFeatures')}
          >
            {`Amenity Score ${parsedAmenityScore}`}
          </Link>
        ));
      }
    }
    const matchingHighlights = communityHighlights &&
      communityHighlights.filter((h) => {
        const lh = h.toLowerCase();
        return lh.includes('alzheimer') || lh.includes('dementia');
      });
    if (matchingHighlights && matchingHighlights.length) {
      highlights.push((
        <Link
          href={`#${sectionIdMaps.amenitiesAndFeatures}`}
          onClick={e => this.constructor.scrollToSection(e, 'amenitiesAndFeatures')}
        >
          Alzheimer's & Dementia support
        </Link>
      ));
    }
    highlights.push((
      <Link
        href={`#${sectionIdMaps.pricingAndFloorPlans}`}
        onClick={e => this.constructor.scrollToSection(e, 'pricingAndFloorPlans')}
      >
        Rooms Available
      </Link>
    ));
    if (startingRate) {
      highlights.push((
        <span>
          Pricing starts from&nbsp;
          <Link
            href={`#${sectionIdMaps.pricingAndFloorPlans}`}
            onClick={e => this.constructor.scrollToSection(e, 'pricingAndFloorPlans')}
          >
            ${startingRate}
          </Link>
        </span>
      ));
    }
    let totalRating = 0;
    reviews.forEach((review) => {
      totalRating += review.value;
    });
    const avgReviews = reviews.length > 0 ? totalRating / reviews.length : 0;
    if (avgReviews > 0) {
      highlights.push((
        <Link
          href={`#${sectionIdMaps.reviews}`}
          onClick={e => this.constructor.scrollToSection(e, 'reviews')}
        >
          Rating {avgReviews.toFixed(1).replace(/\.0+$/, '')}-Star Average
        </Link>
      ));
    }

    return (
      <section id="community-summary">
        <List items={highlights} />
      </section>
    );
  }
}
