describe('Marketplace Home Page', () => {
  it('AutoComplete City Search', () => {
    cy.visit('/');

    cy.contains('Find a Home to Love');

    cy.get('input[class*=SearchBox__SearchTextBox]')
      .type('San Francisco, CA, USA');

    cy.get('div[class*=SearchBox__SearchSuggestion]')
      .should('have.length', 2)
      .first()
      .click();

    cy.url().should('have.string', '/assisted-living/california/san-francisco');
  });
});
