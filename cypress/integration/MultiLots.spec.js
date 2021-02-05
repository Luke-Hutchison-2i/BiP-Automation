import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/tender_manager/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/tender_manager/TenderExercisePage";
import * as SQPage from "../page_objects/tender_manager/SQPage";
import * as QuestionnairePage from "../page_objects/QuestionnairePage";

const tenderName = "testTenderName"
const boxName = "testBoxName"

describe('Multi-lots', function() {
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

        //cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingSQ()

        SQPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()
    })

    it ('Create questionnaire with 1 lot', () => {
        QuestionnairePage.createLotCustomQuestionnaire()
    })

    it.only ('Create questionnaire with 2 lot', () => {
        createQuestion(0, 'Can you do this?', 'Yes you can', 'yesNo', true)

        createLot('lot', 'sec', 'sub')

        cy.get('[id^="page-name-link-"').eq(1).click() // View Lot

        cy.wait(1000)

        createMultipleQuestion(0, 'Multi-choice', 'Pick 1', true)

        createLot('lot2', 'sec2', 'sub2')

        // cy.get('[id^="page-name-link-"').eq(2).click() // View Lot

        // cy.wait(1000)

        // createQuestion(0, 'Can you do this?', 'Yes you can', 'yesNo', true)

        cy.get('#form-return_to_overview').click()
    })

    afterEach(function () {
        SQPage.gotoExistingQuestionnaire()

        QuestionnairePage.deleteQuestionnaire()

        cy.logout()
    })

})