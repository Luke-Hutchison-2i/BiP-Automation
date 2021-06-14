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
    let email
    let password

    let id = Cypress.env('id')

    cy.fixture('logins.json').then((logins) => {
        if (type === "buyer") {
            email = logins[id].buyer.email

            if (Cypress.env('live') == true) {
                password = logins[id].buyer.livePassword
            } else {
                password = logins[id].buyer.password
            }
        } else if (type === "supplier") {
            email = logins[id].supplier.email

            if (Cypress.env('live') == true) {
                password = logins[id].supplier.livePassword
            } else {
                password = logins[id].supplier.password
            }
        }

        cy.get('#username').type(email)
        cy.get('#password').type(password)
    })

    cy.contains('Login').click()
})
Cypress.Commands.add("loginExtra", function(email, password) {
    cy.get('#username').type(email)
    cy.get('#password').type(password)

    cy.contains('Login').click()
})

Cypress.Commands.add("logout", () => {
    cy.get('#header-logout').click({force: true})

    cy.wait(6000)
})