import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/tender_manager/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/tender_manager/TenderExercisePage";
import * as TenderBoxPage from "../page_objects/tender_manager/TenderBoxPage";
import * as Functions from "../support/functions"

const tenderName = "TenderExercise Test"

describe ('Tender Exercise', function () {
    before (function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        TenderManagerPage.createTenderExercise(tenderName)
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce('JSESSIONID')

        cy.visit('/delta/buyers/tenders/listTenders.html')

        TenderManagerPage.gotoExistingTender('TenderExercise Test')
    })

    it ('Notice, SQ, Tenderbox have correct name', () => {
        TenderExercisePage.getExistingNotice(0).should('exist')
        TenderExercisePage.getExistingSQ(0).should('include.text', tenderName)
        TenderExercisePage.getExistingTenderBox(0).should('include.text', tenderName)
    })

    it.only ('Can delete SQ and Tenderbox', () => {
        TenderExercisePage.gotoCreateSQ()
        TenderBoxPage.initialSQSetUp('Delete SQ')

        TenderBoxPage.getTenderLink().click()
        cy.url().should('include', 'viewTenderStatus.html')

        TenderExercisePage.gotoCreateTenderBox()
        TenderBoxPage.initialBoxSetUp('Delete SQ')

        TenderBoxPage.getTenderLink().click()
        cy.url().should('include', 'viewTenderStatus.html')

        TenderExercisePage.deleteSQ(1)
        TenderExercisePage.deleteTenderbox(1)

        TenderExercisePage.getExistingSQ(1).should('not.exist')
        TenderExercisePage.getExistingTenderBox(1).should('not.exist')
    })

    it ('Can view Notice activity log', () => {
        TenderExercisePage.viewNoticeActivityLog(0)

        cy.url().should('include', 'noticeActivity.html')
    })

    after (function () {
        cy.logout()
    })
})