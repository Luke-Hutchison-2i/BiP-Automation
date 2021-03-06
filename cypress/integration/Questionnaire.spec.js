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

        TenderExercisePage.getExistingTenderBox(0).click()

        TenderBoxPage.initialBoxSetUp(boxName, 60)
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce('JSESSIONID')
        
        cy.visit('/delta/buyers/tenders/listTenders.html')

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.getExistingTenderBox(0).click()

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()
    })

    it ('Create a questionnaire', () => {
        QuestionnairePage.createSmokeQuestionnaire()

        cy.get('#documents-edit_questionnaire').should('exist')

        cy.get('#documents-edit_questionnaire span').should('have.class', 'tick')
    })


    it ('Can add and remove a question', () => {
        QuestionnairePage.createQuestion(0, 'Can you do this?', 'Yes you can', 'yesNo', true)
        // Check length is 1
        cy.get('#table_anchor_1').find('[id^="questionText"]').should('have.length', 1)

        QuestionnairePage.deleteQuestion(0)

        // Check length is 0
        cy.get('#table_anchor_1').find('[id^="questionText"]').should('have.length', 0)
    })

    it ('Can add and remove a subsection', () => {
        QuestionnairePage.createSubsection()
        // Check length
        cy.get('#section_table tbody').eq(0).children().should('have.length', 2)

        QuestionnairePage.deleteSubSection(1)

        cy.get('#section_table tbody').eq(0).children().should('have.length', 1)
    })

    it ('Can add, view and remove a section', () => {
        QuestionnairePage.createSection('Section 2')
        // Check length
        cy.get('[id^="page-name-link"]').should('have.length', 2)

        QuestionnairePage.viewSection(1)

        QuestionnairePage.deleteSection(1)

        cy.get('[id^="page-name-link"]').should('have.length', 1)
    })

    it ('Can edit a question', () => {
        //Cypress is being weird, works when done manually

        QuestionnairePage.createQuestion(0, 'Can you do this?', 'Yes you can', 'yesNo', true)

        cy.reload()

        QuestionnairePage.editQuestion(0)

        QuestionnairePage.getQuestionText().should('have.value', 'Can you do this?').clear().type('Editted question')

        QuestionnairePage.saveQuestion()

        cy.contains('Editted question').should('exist')
    })

    it ('Can reorder sections', () => {
        QuestionnairePage.createSection('Section 2')
        QuestionnairePage.createSection('Section 3')

        // Check each section has correct move buttons enabled
        // Move buttom up, check again
        // Move top down, check again

        cy.get('#page_table tbody tr').eq(0).find('#sidebar-move_up').should('not.exist')
        cy.get('#page_table tbody tr').eq(0).find('#sidebar-move_down').should('exist')
        cy.get('#page_table tbody tr').eq(1).find('#sidebar-move_up').should('exist')
        cy.get('#page_table tbody tr').eq(1).find('#sidebar-move_down').should('exist')
        cy.get('#page_table tbody tr').eq(2).find('#sidebar-move_up').should('exist')
        cy.get('#page_table tbody tr').eq(2).find('#sidebar-move_down').should('not.exist')

        QuestionnairePage.moveSectionUp(2)
        cy.wait(500)
        QuestionnairePage.moveSectionDown(0)
        cy.wait(500)

        cy.get('#page_table tbody tr').eq(0).find('[name="moveUp"]').should('not.exist')
        cy.get('#page_table tbody tr').eq(0).find('[name="moveDown"]').should('exist')
        cy.get('#page_table tbody tr').eq(1).find('[name="moveUp"]').should('exist')
        cy.get('#page_table tbody tr').eq(1).find('[name="moveDown"]').should('exist')
        cy.get('#page_table tbody tr').eq(2).find('[name="moveUp"]').should('exist')
        cy.get('#page_table tbody tr').eq(2).find('[name="moveDown"]').should('not.exist')

        // Check section names are in correct order
        cy.get('#page_table tbody tr').eq(0).contains('Section 3')
        cy.get('#page_table tbody tr').eq(1).contains('Questions')
        cy.get('#page_table tbody tr').eq(2).contains('Section 2')
    })

    it ('Displays warnings for invalid section and subsections', () => {
        // Error for no question in subsection
        cy.contains('Error: Subsections 1.1 must contain at least one Question').should('exist')

        // Error for no subsection in section
        cy.get('#section_table > tbody > tr').eq(0).find('#body-remove_subsection').click()
        cy.reload()

        cy.contains('Invalid Section').should('exist')
    })

    it ('Question invalid input warnings', () => {
        QuestionnairePage.startNewQuestion(0)

        cy.get('#modal-save_question', { timeout: 10000 }).click() // Can't use Questionnaire.saveQuestion() because that checks if Modal disappears

        cy.contains('Question Text is a required field').should('exist')
        cy.contains('Answer Type is a required field').should('exist')

        QuestionnairePage.chooseAnswerType('multiSelect')

        cy.get('#modal-save_question', { timeout: 10000 }).click()

        cy.contains('You must enter at least two options for a valid multiple choice question').should('exist')

        QuestionnairePage.chooseAnswerType('priceDocUpload')

        cy.get('#modal-save_question', { timeout: 10000 }).click()

        cy.contains('At least one document must be uploaded for the Price Document Upload question type').should('exist')
    })

    it ('Subsection invalid input warning', () => {
        QuestionnairePage.startNewSubsection()

        cy.get('#modal-save_subsection').click()

        cy.contains('Subsection Name is a required field').should('exist')
    })

    it ('Section invalid input warning', () => {
        QuestionnairePage.startNewSection()

        cy.get('#modal-save_section').click()

        cy.contains('Section Name is a required field').should('exist')
    })


    it ('Can only have 1 price question', () => {
        QuestionnairePage.createPriceQuestion(0, '', 'help text')

        cy.reload()

        QuestionnairePage.startNewQuestion(0)

        cy.get('#answerType').find('#option-price').should('not.exist')
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