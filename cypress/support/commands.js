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

Cypress.Commands.add("login", function(type) {
    var email
    var password

    cy.fixture('logins.json').then((logins) => {
        if (type === "buyer") {
            email = logins.buyer.email

            if (Cypress.env('live') == true) {
                password = logins.buyer.livePassword
            } else {
                password = logins.buyer.password
            }
        } else if (type === "supplier") {
            email = logins.supplier.email

            if (Cypress.env('live') == true) {
                password = logins.supplier.livePassword
            } else {
                password = logins.supplier.password
            }
        }

        cy.get('#username').type(email)
        cy.get('#password').type(password)
    })

    cy.contains('Login').click()
})

Cypress.Commands.add("logout", () => {
    cy.get('#header-logout').click({force: true})

    cy.wait(6000)

    //cy.url().should('eq', 'https://test.delta-esourcing.com/')
})