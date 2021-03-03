import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/tender_manager/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/tender_manager/TenderExercisePage";
import * as TenderBoxPage from "../page_objects/tender_manager/TenderBoxPage";
import * as QuestionnairePage from "../page_objects/QuestionnairePage";
import * as EvalPlanPage from "../page_objects/EvalPlanPage";
import * as Functions from "../support/functions"


const tenderName = "testTenderName"
const boxName = "testBoxName"

Functions.GetServer()

describe('Multi-Lots Questionnaire', function() {
    before(function () {
        cy.visit('https://dev.delta-esourcing.com')

        cy.contains('Log in').click()

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
        cy.visit('https://dev.delta-esourcing.com/delta/mainMenu.html')
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

        cy.get('#page_table').find('#editForm3').eq(1).click()//

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

        cy.wait(1000)

        cy.get('#section_table_wrapper').should('have.length', 2)

        QuestionnairePage.returnToOverview()
    })

    it ('Import Lot into a questionnaire', () => {
        QuestionnairePage.importLotLot()

        cy.get('[id^="page-name-link-"').eq(1).should('exist')

        QuestionnairePage.viewSection(1)

        // Check questions imported correctly
        cy.get('#section_table_wrapper').should('not.have.length', 0)
    })

    it ('Make Lot questionnaire a template', () => {
        QuestionnairePage.createLotCustomQuestionnaire()

        cy.get('#edit-settings').click({force:true})

        cy.wait(500)

        cy.get('#settings-save_as_template').check({force:true})

        cy.get('#settings-confirm_submit').click()

        cy.get('#settings-submit').click()

        cy.visit('https://delta-2020-dev.bipsolutions.co.uk/delta/admin/listTemplates.html?tab=orgTemplates')

        cy.contains(boxName).should('exist')
        // Should it be at top of list
    })

    it ('Use template for Lot questionnaire', () => {
        
    })

    afterEach(function () {
        //TenderBoxPage.gotoExistingQuestionnaire()

        //QuestionnairePage.deleteQuestionnaire()

        //cy.logout()
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

    it ('Lot weightings correctly based on technical/price split', () => {
        // Sets Price/Technical Split for Lots
        cy.get('#lotTechnicalWeighting').type('60')
        
        EvalPlanPage.saveEvalSettings()

        cy.get('#lotPriceWeighting').should('have.value', '40.00')

        // Non Lot section weightings are correct
        EvalPlanPage.editWeighting(0, '100')

        EvalPlanPage.saveEvalWeightings()

        EvalPlanPage.getWeightingInput(0).parent().should('include.text', '% overall:  100.00')

        EvalPlanPage.gotoSection(2)

        EvalPlanPage.editWeighting(1, '50')
        EvalPlanPage.editWeighting(2, '50')
        EvalPlanPage.editWeighting(3, '100')
        
        EvalPlanPage.saveEvalWeightings()

        EvalPlanPage.getWeightingInput(1).parent().should('include.text', '% overall:  30.00')
        EvalPlanPage.getWeightingInput(2).parent().should('include.text', '% overall:  30.00')
        EvalPlanPage.getWeightingInput(3).parent().should('include.text', '% overall:  40.00')

        EvalPlanPage.gotoSection(3)

        EvalPlanPage.changeScoringLevel(0, 'Question')

        EvalPlanPage.editWeighting(1, '100')
        EvalPlanPage.editWeighting(3, '50')
        EvalPlanPage.editWeighting(4, '50')
        
        EvalPlanPage.saveEvalWeightings()

        EvalPlanPage.getWeightingInput(1).parent().should('include.text', '% overall:  60.00')
        EvalPlanPage.getWeightingInput(3).parent().should('include.text', '% overall:  20.00')
        EvalPlanPage.getWeightingInput(4).parent().should('include.text', '% overall:  20.00')

        EvalPlanPage.returnToOverview()

        cy.get('#documents-edit_evaluation_plan span').should('have.class', 'tick')
    })

    it ('Change questionnaire then check eval plan', () => {
        
    })

    afterEach(function () {
        // TenderBoxPage.gotoExistingQuestionnaire()

        // QuestionnairePage.deleteQuestionnaire()

        //cy.logout()
    })
})