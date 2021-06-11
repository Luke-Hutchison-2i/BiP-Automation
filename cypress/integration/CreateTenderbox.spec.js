import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/tender_manager/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/tender_manager/TenderExercisePage";
import * as TenderBoxPage from "../page_objects/tender_manager/TenderBoxPage";
import * as Functions from "../support/functions"

const boxName = "createBoxTest"

describe ('Create Tenderbox', function () {
    before (function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        TenderManagerPage.createTenderExercise(boxName)
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce('JSESSIONID')

        cy.visit('/delta/buyers/tenders/listTenders.html')

        TenderManagerPage.gotoExistingTender(boxName)

        TenderExercisePage.gotoCreateTenderBox()
    })

    it ('Can create Tenderbox', () => {
        TenderBoxPage.initialBoxSetUp(boxName, 0)

        cy.get('#nav-view_list_status').should('contain.text', boxName)

        cy.contains('Invitation to Tender').should('exist')

        cy.get('#nav-opening_date_edit_tenderbox').should('contain.text', TenderBoxPage.openDate)
        cy.get('#nav-closing_date_edit_tenderbox').should('contain.text', TenderBoxPage.closeDate)
    })

    it ('Required fields are required', () => {
        TenderBoxPage.saveBox()

        cy.contains('There are errors on this page.').should('exist')
        cy.contains('Tenderbox Name is a required field').should('exist')
        cy.contains('Select a Questionnaire Type for this Tenderbox').should('exist')
        cy.contains('You must specify when the Tenderbox will open and close').should('exist')
    })

    it ('Validates open and closing times', () => {
        TenderBoxPage.setOpenAndCloseDate(-1, 0)

        TenderBoxPage.saveBox()

        cy.contains('The Opening Date must not be in the past').should('exist')

        TenderBoxPage.setOpenAndCloseDate(0, -1)

        TenderBoxPage.saveBox()

        cy.contains('The Closing Date must occur after the Opening Date').should('exist')
    })
    
    after (function () {
        cy.logout()
    })
})