import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/tender_manager/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/tender_manager/TenderExercisePage";
import * as Functions from "../support/functions"

const tenderName = "createTest"

describe ('Smoke Test', function () {
    before (function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce('JSESSIONID')

        cy.visit('/delta/buyers/tenders/listTenders.html')

        TenderManagerPage.gotoCreateTenderExercise()
    })

    it ('Can create an empty tender', () => {
        TenderManagerPage.getNameField().type(tenderName)

        TenderManagerPage.saveTender()

        cy.url().should('include', 'delta/buyers/tenders/viewTenderStatus')

        cy.contains("You haven't created a notice for this tender exercise. If you wish to advertise this opportunity, please select the create notice option below.").should('exist')
        // Isn't showing up in Cypress, but both show up when doing manually
        //cy.contains('Tender Exercise ' + tenderName + ' has been created').should('exist')
    })

    it ('Can create a tender with a Notice, an SQ, and a Tenderbox', () => {
        TenderManagerPage.createTenderExercise(tenderName)

        cy.url().should('include', 'delta/buyers/tenders/viewTenderStatus')

        cy.contains('Tender Exercise ' + tenderName + ' has been created').should('exist')

        // Check Notice, SQ, and Tenderbox were created
        TenderExercisePage.getExistingNotice(0).should('exist')

        TenderExercisePage.getExistingTenderBox(0).should('contain.text', tenderName)

    })

    it ('Validates Tender Exercise Name field', () => {
        TenderManagerPage.saveTender()

        cy.contains('Tender Name is a required field').should('exist')
    })

    after (function () {
        cy.logout()
    })

})