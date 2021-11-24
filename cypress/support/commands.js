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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('login_user1', () => {
    cy.get('.MuiTypography-root > .MuiButtonBase-root').click()
    cy.get('#Email').type('smitpat2000@gmail.com')
    cy.get('#next').click()
    cy.get('#password').type('Smitp@t0013')
    cy.get('#submit').click()
})

Cypress.Commands.add('login_user2', () => {
    cy.get('.MuiTypography-root > .MuiButtonBase-root').click()
    cy.get('#Email').type('u18co024@coed.svnit.ac.in')
    cy.get('#next').click()
    cy.get('#password').type('Smitp@t0013')
    cy.get('#submit').click()
})

Cypress.Commands.add('logout', () => {
    cy.get('.MuiToolbar-root > :nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()
    cy.get('.MuiLink-root > .MuiButtonBase-root').click()
})