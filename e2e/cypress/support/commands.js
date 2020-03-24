
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { select } from '../helpers/tests';
import { toJson } from '../helpers/request';

import { normalizeResponse } from 'sly/services/api';

Cypress.Commands.add('registerWithEmailFlow', (email, password) => {
  cy.route('POST', '**/auth/register').as('registerUser');

  cy.get('span').contains('Create an account').click();
  select('.JoinSlyButtons').contains('Sign up with Email').click();
  select('.SignupForm input[name="email"]').type(email);
  select('.SignupForm input[name="password"]').type(password);
  select('.SignupForm button[type="submit"]').click();

  cy.wait('@registerUser').then((xhr) => {
    expect(xhr.status).to.equal(200);
    expect(xhr.requestBody).to.deep.equal({
      email, password,
    });
  });
});

Cypress.Commands.add('registerWithEmail', (email, password) => {
  cy.request('POST', '/v0/platform/auth/register', {
    email,
    password,
  }).as('registerUser');

  cy.get('@registerUser').its('status').should('eq', 200);
});

function throwOnUnsuccessful(response) {
  if (!response.ok) {
    throw new Error(`Failed to fetch ${response.url}: ${response.statusText} (${response.status})`);
  }
  return response;
}

Cypress.Commands.add('getUser', () => {
  return Cypress.Promise.all([
    fetch('/v0/platform/uuid-actions', { credentials: 'include' }).then(throwOnUnsuccessful),
    fetch('/v0/platform/users/me', { credentials: 'include' }).then(throwOnUnsuccessful),
  ])
    .then(responses => Cypress.Promise.all(responses.map(toJson)))
    // .then(responses => Cypress.Promise.all(responses.map(toJson)))
    .then((result) => {
      const [
        uuidActions,
        user,
      ] = result.map(body => normalizeResponse(body));

      return {
        uuidActions,
        user,
      };
    });
});

Cypress.Commands.add('getCommunity', (community) => {
  const url = `/v0/marketplace/communities/${community}?include=similar-communities%2Cquestions%2Cagents`;
  return fetch(url)
    .then(toJson)
    .then(normalizeResponse);
});
