import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/tender_manager/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/tender_manager/TenderExercisePage";
import * as TenderBoxPage from "../page_objects/tender_manager/TenderBoxPage";
import * as QuestionnairePage from "../page_objects/QuestionnairePage";
import * as EvalPlanPage from "../page_objects/EvalPlanPage";

const tenderName = "testTenderName"
const boxName = "testBoxName"

describe('Multi-Lots Questionnaire', function() {
    before(function () {
        cy.visit('https://delta-2020-dev.bipsolutions.co.uk/delta')

        cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        TenderManagerPage.createTenderExercise(tenderName)

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.initialBoxSetUp(boxName)

        //cy.logout()
    })
    beforeEach(function () {
        // cy.visit('')
        cy.visit('https://delta-2020-dev.bipsolutions.co.uk/delta')
        //cy.contains('Login / Register').click()

        //cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()
    })

    it ('Create questionnaire with 1 lot', () => {
        QuestionnairePage.createLotCustomQuestionnaire()

        cy.contains('Lot 1: Lot1').should('exist')

        QuestionnairePage.returnToOverview()

        cy.get('#documents-edit_questionnaire span').should('have.class', 'tick') // Questionnaire should be valid
    })

    it ('Create questionnaire with 2 lots and price questions', () => {
        QuestionnairePage.createLotCustomQuestionnaire()

        QuestionnairePage.createPriceQuestion(0, "Price", "Enter lot price")

        QuestionnairePage.createLot('Lot2', 'Sec2', 'Sub2')

        QuestionnairePage.viewSection(2)

        QuestionnairePage.createPriceQuestion(0, "Price", "Enter lot price")

        QuestionnairePage.returnToOverview()

        cy.get('#documents-edit_questionnaire span').should('have.class', 'tick') // Questionnaire should be valid
    })

    it ('Can delete a lot', () => {
        QuestionnairePage.createLotCustomQuestionnaire()

        cy.contains('Lot 1: Lot1').should('exist')

        cy.get('#page_table').find('#editForm3').eq(1).click()

        cy.contains('Lot 1: Lot1').should('not.exist')

        QuestionnairePage.returnToOverview()

        cy.get('#documents-edit_questionnaire span').should('have.class', 'tick') // Questionnaire should be valid
    })

    it ('Import question into a Lot', () => {
        QuestionnairePage.createLot('Lot1', 'Sec1', 'Sub1')
        QuestionnairePage.viewSection(1)

        QuestionnairePage.importQuestion(0)
        QuestionnairePage.viewSection(1)

        cy.get('#table_anchor_1').find('tbody tr').should('have.length', 1)

        QuestionnairePage.returnToOverview()
    })

    it ('Import sub-section into a Lot', () => {
        QuestionnairePage.createLot('Lot1', 'Sec1', 'Sub1')
        QuestionnairePage.viewSection(1)

        cy.get('#section_table tbody').eq(0).children().should('have.length', 1)

        QuestionnairePage.importSubSectionLot()
        QuestionnairePage.viewSection(1)

        cy.get('#section_table tbody').eq(0).children().should('have.length', 2)

        QuestionnairePage.returnToOverview()
    })

    it ('Import section into a Lot', () => {
        QuestionnairePage.createLot('Lot1', 'Sec1', 'Sub1')
        QuestionnairePage.viewSection(1)

        cy.get('#section_table_wrapper').should('have.length', 1)

        QuestionnairePage.importSectionLot()
        QuestionnairePage.viewSection(1)

        cy.get('#section_table_wrapper').should('have.length', 2)

        QuestionnairePage.returnToOverview()
    })

    it ('Import Lot into a questionnaire', () => {
        
    })

    it ('Make Lot questionnaire a template', () => {
        
    })

    it ('Use template for Lot questionnaire', () => {
        
    })

    afterEach(function () {
        // TenderBoxPage.gotoExistingQuestionnaire()

        // QuestionnairePage.deleteQuestionnaire()

        cy.logout()
    })

    // after(function () {
    //     cy.logout()
    // })

})

describe ('Multi-Lots Eval Plan', function() {
    before(function () {
        cy.visit('https://delta-2020-dev.bipsolutions.co.uk/delta')

        cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        TenderManagerPage.createTenderExercise(tenderName)

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.initialBoxSetUp(boxName)

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()

        QuestionnairePage.createLot2CustomQuestionnaire()

        //cy.logout()
    })
    beforeEach(function () {
        // cy.visit('')
        cy.visit('https://delta-2020-dev.bipsolutions.co.uk/delta')
        //cy.contains('Login / Register').click()

        //cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.gotoCreateEvalPlan()
    })

    it.only ('Lot weightings correctly based on technical/price split', () => {
        cy.get('#lotTechnicalWeighting').type('75')
        
        cy.contains('Save Evaluation Settings').click()

        cy.get('#lotPriceWeighting').should('have.value', 25)
    })

    afterEach(function () {
        // TenderBoxPage.gotoExistingQuestionnaire()

        // QuestionnairePage.deleteQuestionnaire()

        cy.logout()
    })
})