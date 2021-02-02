import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/tender_manager/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/tender_manager/TenderExercisePage";
import * as SQPage from "../page_objects/tender_manager/SQPage";
import * as QuestionnairePage from "../page_objects/QuestionnairePage";

const tenderName = "testTenderName"
const boxName = "testBoxName"

describe('Quick Call - Stages 1-4', function() {
    before(function () {
        cy.visit('https://delta-2020-dev.bipsolutions.co.uk/delta')

        cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        TenderManagerPage.createTenderExercise(tenderName)

        TenderExercisePage.gotoExistingSQ()

        SQPage.initialSQSetUp(boxName)

        cy.logout()
    })
    beforeEach(function () {
        // cy.visit('')
        cy.visit('https://delta-2020-dev.bipsolutions.co.uk/delta')
        //cy.contains('Login / Register').click()

        cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingSQ()

        SQPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()
    })

    it ('Create questionnaire with a lot', () => {
        QuestionnairePage.createCustomQuestionnaire()
    })

    afterEach(function () {
        SQPage.gotoCreateNewQuestionnaire()

        //QuestionnairePage.deleteQuestionnaire()

        cy.logout()
    })

})