import { select } from './tests';

export const doCustomPricingFlow = (cy, data) => {
  const {
    communitySlug, name, phoneNumber, typeOfRoom, typeOfCare, medicaid,
  } = data;

  cy.contains('Get your Pricing and Availability');

  cy.get('div[class*=BoxChoiceTile__StyledBox]').contains(typeOfRoom).click();

  cy.get('div[class*=BoxChoiceTile__StyledBox]').contains(typeOfCare).click();

  cy.get('div[class*=BoxChoiceTile__StyledBox]').contains(medicaid).click();

  cy.get('button').contains('Continue').click();

  cy.get('input[name="name"]').type(name);
  cy.get('input[name="phone"]').type(phoneNumber);

  cy.get('button').contains('Continue').click();

  cy.get('button').contains('Explore more affordable options').click();

  cy.get('button').contains('$2000 - $3000').click();

  cy.get('button').contains('Let\'s Begin').click();

  select('.Modal__Body h2').contains('Thank you! Our team will be calling you from (855) 855-2629.');

  select('.Modal__Head button').click();

  cy.url().should('have.string', `/assisted-living/california/san-francisco/${communitySlug}`);

  select('.CommunityDetailPage').should('exist');
};
