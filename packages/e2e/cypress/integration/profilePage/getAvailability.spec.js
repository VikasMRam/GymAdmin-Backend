import {
  doCustomPricingTalkToAdvisorFlow,
  doCustomPricingExploreAffordableOptionsFlow,
} from '../../helpers/customPricing';
import { assertUserActionsForGetAvailability } from '../../helpers/userActions';
import { responsive, waitForHydration } from '../../helpers/tests';
import { TEST_COMMUNITY } from '../../constants/community';
import randomUser from '../../helpers/randomUser';

describe('Marketplace Profile Page', () => {
  responsive(() => {
    it('tests Get Availability Flow for Assisited Living Community - Talk to Advisor Flow', () => {
      const communitySlug = TEST_COMMUNITY;
      const { name, phone, email } = randomUser();
      // const typeOfRoom = 'Suite';
      const moveTimeline = 'Immediately';
      const typeOfCare = 'Medication management';
      const medicaid = 'Yes';

      cy.visit(`/assisted-living/california/san-francisco/${communitySlug}`);
      cy.get('section[id*=availability]').within(() => {
        cy.get('input[id=email]').type(email);
      });
      waitForHydration(cy.get('button').contains('Get Availability')).click();

      const data = {
        communitySlug, name, phone, moveTimeline, typeOfCare, medicaid, email,
      };
      doCustomPricingTalkToAdvisorFlow(cy, data);

      cy.getUser().then((userData) => {
        assertUserActionsForGetAvailability(userData, data);
      });
    });

    it.skip('tests Get Availability Flow for Assisited Living Community - Affordable Options Flow', () => {
      const communitySlug = TEST_COMMUNITY;
      const { name, phone, email } = randomUser();
      const moveTimeline = 'Immediately';
      const typeOfCare = 'Medication management';
      const medicaid = 'Yes';

      cy.visit(`/assisted-living/california/san-francisco/${communitySlug}`);

      waitForHydration(cy.get('button').contains('Get Detailed Pricing')).click();

      const data = {
        communitySlug, name, phone, moveTimeline, typeOfCare, medicaid, email,
      };

      doCustomPricingExploreAffordableOptionsFlow(cy, data);

      cy.getUser().then((userData) => {
        assertUserActionsForGetAvailability(userData, data);
      });
    });
  });
});
