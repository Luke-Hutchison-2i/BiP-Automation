import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/tender_manager/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/tender_manager/TenderExercisePage";
import * as TenderBoxPage from "../page_objects/tender_manager/TenderBoxPage";
import * as QuestionnairePage from "../page_objects/QuestionnairePage";
import * as EvalPlanPage from "../page_objects/EvalPlanPage";
import * as Functions from "../support/functions"


const tenderName = "evalPlanTest"
const boxName = "evalPlanBox"

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

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()

        QuestionnairePage.createSmokeQuestionnaire()
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce('JSESSIONID')
        
        cy.visit('/delta/buyers/tenders/listTenders.html')

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.getExistingTenderBox(0).click()

        TenderBoxPage.gotoCreateEvalPlan()
    })

    it ('Create evaluation plan', () => {
        EvalPlanPage.createSmokeEvalPlan()

        cy.get('#documents-edit_evaluation_plan span').should('have.class', 'tick')
    })
    

    it ('Change Tech/Price weighting', () => {
        EvalPlanPage.setPriceWeighting(50)

        EvalPlanPage.saveEvalSettings()

        EvalPlanPage.getTechWeighting().should('have.value', '50.00')

        EvalPlanPage.setPriceWeighting(34)

        EvalPlanPage.saveEvalSettings()

        EvalPlanPage.getTechWeighting().should('have.value', '66.00')
    })

    it ('Invalid Tech/Price weighting', () => {
        // Should set Price weight to 0
        EvalPlanPage.setPriceWeighting(-1)
        EvalPlanPage.saveEvalSettings()

        EvalPlanPage.getPriceWeighting().should('have.value', '0.00')

        // Should set Price weight to 100
        EvalPlanPage.setPriceWeighting(101)
        EvalPlanPage.saveEvalSettings()

        EvalPlanPage.getPriceWeighting().should('have.value', '100.00')

        EvalPlanPage.setPriceWeighting(50)
        EvalPlanPage.saveEvalSettings()
    
        // Should not change Price weight
        EvalPlanPage.setPriceWeighting('a')
        EvalPlanPage.saveEvalSettings()

        EvalPlanPage.getPriceWeighting().should('have.value', '50.00')
    })


    it ('Tech question weighting', () => {
        EvalPlanPage.changeScoringLevel(0, 'Question')

        EvalPlanPage.editWeighting(0, 100)
        EvalPlanPage.editWeighting(1, 100)

        EvalPlanPage.saveEvalWeightings()

        // Tech: 50  Overal: 50
        cy.get('input#input-weighting').eq(0).parent().should('contain.text', 'tech: 50.00')
        cy.get('input#input-weighting').eq(0).parent().should('contain.text', 'overall:  50.00')

        // Change Price weighting

        EvalPlanPage.setPriceWeighting(50)

        EvalPlanPage.saveEvalSettings()

        // Tech: 50  Overal: 25
        cy.get('input#input-weighting').eq(0).parent().should('contain.text', 'tech: 50.00')
        cy.get('input#input-weighting').eq(0).parent().should('contain.text', 'overall:  25.00')

        EvalPlanPage.editWeighting(0, 50)

        EvalPlanPage.saveEvalWeightings()

        // Tech: 33.33  Overal: 16.66
        cy.get('input#input-weighting').eq(0).parent().should('contain.text', 'tech: 33.33')
        cy.get('input#input-weighting').eq(0).parent().should('contain.text', 'overall:  16.66')
    })

    it ('Invalid question weighting', () => {
        // Currently bugged, need to wait for fix before I know how page should react
        EvalPlanPage.changeScoringLevel(0, 'Question')
        
        EvalPlanPage.editWeighting(0, -100)

        EvalPlanPage.saveEvalWeightings()

        // Tech: 50  Overal: 50
        //cy.get('input#input-weighting').eq(0).parent().contains('tech: 50.00').should('exist')
        //cy.get('input#input-weighting').eq(0).parent().contains('overall: 50.00').should('exist')

        EvalPlanPage.editWeighting(1, 110)

        EvalPlanPage.saveEvalWeightings()

        // Weighting should be set to 0
        EvalPlanPage.editWeighting(1, 'a')

        EvalPlanPage.saveEvalWeightings()

        EvalPlanPage.getWeightingInput(1).should('have.value', '0.00')

        // Tech: 50  Overal: 50
        //cy.get('input#input-weighting').eq(0).parent().contains('tech: 50.00').should('exist')
        //cy.get('input#input-weighting').eq(0).parent().contains('overall: 50.00').should('exist')
    })

    it ('Can view sections', () => {
        EvalPlanPage.gotoSection(2)
        EvalPlanPage.gotoSection(1)
        EvalPlanPage.gotoSection(2)
    })

    it ('Can re-order questionnaire sections', () => {
        cy.get('.sections-active').should('contain.text', 'Questions')
        cy.get('#page_nav-page_2').should('contain.text', 'Price')

        EvalPlanPage.returnToOverview()

        TenderBoxPage.gotoExistingQuestionnaire()

        QuestionnairePage.createSection('Section3')

        QuestionnairePage.moveSectionUp(2)
        cy.wait(500)
        QuestionnairePage.moveSectionDown(0)
        cy.wait(500)

        QuestionnairePage.returnToOverview()

        TenderBoxPage.gotoCreateEvalPlan()

        cy.get('.sections-active').should('contain.text', 'Section3')
        cy.get('#page_nav-page_2').should('contain.text', 'Questions')
        cy.get('#page_nav-page_3').should('contain.text', 'Price')
    })

    it ('Can change evaluators', ()  => {
        EvalPlanPage.gotoChooseEvaluators()

        EvalPlanPage.chooseEvaluators()
    })

    afterEach(function () {
        // Cypress seems bugged and if the tests fail then clicks in AfterEach don't work
        cy.visit('/delta/buyers/tenders/listTenders.html')

        cy.contains(tenderName).click({force: true})

        cy.wait(500)

        cy.get('[id^="list"]', {timeout: 10000}).eq(1).find('[id^="tender-view_tender_"]').eq(0).click({force: true})

        cy.wait(500)

        cy.get('#documents-edit_evaluation_plan', {timeout: 10000}).should('exist').click({force: true})

        cy.wait(500)

        cy.contains('Remove Evaluation Plan').click({force: true})
    })

    after(function () {
        cy.logout()
    })

})