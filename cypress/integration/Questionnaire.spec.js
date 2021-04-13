import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/tender_manager/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/tender_manager/TenderExercisePage";
import * as TenderBoxPage from "../page_objects/tender_manager/TenderBoxPage";
import * as QuestionnairePage from "../page_objects/QuestionnairePage";
import * as Functions from "../support/functions"


const tenderName = "questionnaireTest"
const boxName = "questionnaireBox"

Functions.GetServer()

describe ('Questions', function () {
    before(function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        TenderManagerPage.createTenderExercise(tenderName)

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.initialBoxSetUp(boxName)
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce('JSESSIONID')
        
        cy.visit('/delta/buyers/tenders/listTenders.html')

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()
    })

    it ('Can add all elements', () => {
        QuestionnairePage.createQuestion(0, 'Can you do this?', 'Yes you can', 'yesNo', true)
        QuestionnairePage.createSubSection()
        QuestionnairePage.createSection('Section 2')
    })

    it ('Can delete all elements', () => {
        QuestionnairePage.createQuestion(0, 'Can you do this?', 'Yes you can', 'yesNo', true)
        QuestionnairePage.createSubSection()
        QuestionnairePage.createSection('Section 2')

        cy.get('#page_table tbody tr').eq(1).find('#sidebar-remove_section').click()
        cy.reload()

        cy.get('#section_table > tbody > tr').eq(1).find('#body-remove_subsection').click()
        cy.reload()
        
        cy.get('#table_anchor_1').find('#body-remove_question').click()
        cy.reload()
    })

    afterEach(function () {
        cy.visit('/delta/buyers/tenders/listTenders.html')

        cy.contains(tenderName).click({force: true})

        cy.wait(500)

        cy.get('[id^="list"]', {timeout: 10000}).eq(1).find('[id^="tender-view_tender_"]').eq(0).click({force: true})

        cy.wait(500)

        cy.get('#documents-edit_questionnaire', {timeout: 10000}).should('exist').click({force: true})

        cy.wait(500)
        cy.get('#button-delete_questionnaire', {timeout: 10000}).click({force: true})
    })

    after(function () {
        cy.logout()
    })
})