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
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import 'cypress-file-upload';

Cypress.Commands.add("login", (type) => {
    var email

    if (type === "buyer") {
        email = "userguideaccount2@bipsolutions.com"
    } else if (type === "supplier") {
        email = "demosupplieracccount@bipsolutions.com"
    }

    cy.get('#username').type(email)
    cy.get('#password').type("Tenders2020")

    cy.contains('Login').click()
})

Cypress.Commands.add("logout", () => {
    cy.get('#header-logout').click({force: true})

    cy.wait(7000)

    //cy.url().should('eq', 'https://test.delta-esourcing.com/')
})