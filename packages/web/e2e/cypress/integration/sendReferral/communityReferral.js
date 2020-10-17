import { responsive, select, waitForHydration } from '../../helpers/tests';
import randomUser from '../../helpers/randomUser';
import randomCommunity from '../../helpers/randomCommunity';

Cypress.on('uncaught:exception', () => {
  return false;
});

let community;

function logintoadminAccount() {
  cy.get('button').then(($a) => {
    if ($a.text().includes('Log In')) {
      waitForHydration(cy.get('div[class*=Header__HeaderItems]').contains('Log In')).click({ force: true });
      waitForHydration(cy.get('form input[name="email"]')).type('slytest+admin@seniorly.com');
      waitForHydration(cy.get('form input[name="password"]')).type('nopassword');
      waitForHydration(cy.get('button').contains('Log in')).click({ force: true });
    }
  });
}

function addtestCommunity() {
  const { name, phone, address, city, state, zip } = randomCommunity();
  community = {
    name,
    phone,
    address,
    typeofCare: ['Assisted Living', 'Memory Care'],
    city,
    state,
    zip,
  };
  waitForHydration(cy.get('form input[id*=name]')).type(community.name);
  waitForHydration(cy.get('form input[id*=communityPhone]')).type(community.phone);

  community.typeofCare.forEach((care) => {
    waitForHydration(cy.get('form div[class*=react-select__control]')).click();
    cy.get('div[class*=react-select__menu-list').within(() => {
      cy.get('div').contains(care).click();
    });
  });
  waitForHydration(cy.get('form input[id*=line1]')).type(community.address);
  waitForHydration(cy.get('form input[id*=city]')).type(community.city);
  waitForHydration(cy.get('form select[id*=state]')).select(community.state);
  waitForHydration(cy.get('form input[id*=zip]')).type(community.zip);
}

function addfamilyContact() {
  const { name, phone, email } = randomUser();
  waitForHydration(cy.get('form input[label*=\'Contact name\']')).type(name);
  waitForHydration(cy.get('form input[id*=email]').last()).type(email);
  waitForHydration(cy.get('form input[id*=phone]')).type(phone);
  waitForHydration(cy.get('form input[placeholder*="Search by city, state, zip"]')).type('San Francisco{enter}');
  cy.get('div[class*=SearchBox__Suggestion]').contains('San Francisco')
    .click();
  waitForHydration(cy.get('form select[id*=source]')).select('Voicemail');
}

function addcommContact() {
  const { name, phone, email } = randomUser();
  waitForHydration(cy.get('form input[label*=\'Contact name\']')).type(name);
  waitForHydration(cy.get('form input[id*=email]').last()).type(email);
  waitForHydration(cy.get('form input[id*=mobilePhone]')).type(phone);
}

describe('Sending Referral to Community', () => {
  responsive(() => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('Add Test community', () => {
      logintoadminAccount();
      cy.visit('/dashboard/communities');
      waitForHydration(cy.get('div [class*=DashboardWithSummaryTemplate__Section]').contains('Add Community')).click();
      addtestCommunity();
      waitForHydration(cy.get('button').contains('Create Community')).click();
      select('.Notifications').contains('Community added successfully');
    });

    it('Add multiple contacts to Test community', () => {
      logintoadminAccount();
      cy.visit('/dashboard/communities');
      waitForHydration(cy.get('input[class*=SearchTextInput]')).type(community.name).should('have.value', community.name);
      cy.wait(1000);
      waitForHydration(cy.get('table').find('tbody').find('tr a[class*=Root]').contains(community.name)).click();
      waitForHydration(cy.get('a[id=contacts]')).click();

      waitForHydration(cy.get('section[class*=DashboardAgentContacts]').contains('Add contact')).dblclick({ force: true });
      addcommContact();
      waitForHydration(cy.get('button').contains('Add Contact')).click();
      select('.Notifications').contains('Contact created');
    });

    it('Create lead', () => {
      logintoadminAccount();
      cy.visit('/dashboard/agent/my-families/new');
      waitForHydration(cy.get('div [class*=DashboardAgentFamilyOverviewSection__TwoColumn]').contains('Add family')).click('right');
      addfamilyContact();
      waitForHydration(cy.get('button').contains('Create')).click();
      select('div[class*=Notifications]').contains('Family added successfully');
    });

    it('Send referral to community', () => {
      logintoadminAccount();
      cy.visit('/dashboard/agent/my-families/new');

      waitForHydration(cy.get('table').find('tbody').find('tr a[class*=ClientRowCard__StyledNameCell]').first()).click();
      waitForHydration(cy.get('a[id*=communities]').contains('Communities')).click();

      waitForHydration(cy.get('button').contains('Search for communities')).click({ force: true });

      cy.get('form[name="CommunityAgentSearchForm"]').within(() => {
        waitForHydration(cy.get('div input[placeholder=\'Search by city, state, zip\']')).clear();
        waitForHydration(cy.get('div input[placeholder="Search by name"]')).type(community.name);
        waitForHydration(cy.get('[data-cy="search"]').eq(1)).click();
      });

      waitForHydration(cy.get('div[class*="DashboardCommunityReferralSearch__StyledDashboardAdminReferralCommunityTile"]').first()).click('right');
      waitForHydration(cy.get('button').contains('Send Referral')).click();
      select('.Notifications').contains('Sent referrral successfully');
    });
  });
});