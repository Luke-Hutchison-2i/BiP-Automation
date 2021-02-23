import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/tender_manager/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/tender_manager/TenderExercisePage";
import * as NoticePage from "../page_objects/NoticePage";
import * as QuestionnairePage from "../page_objects/QuestionnairePage";
import * as EvalPlanPage from "../page_objects/EvalPlanPage";
import * as AddSuppliersPage from "../page_objects/AddSuppliersPage";
import * as MessageCentrePage from "../page_objects/MessageCentrePage";
import * as EvalResponsesPage from "../page_objects/EvalResponsesPage";
import * as ShortlistedSuppliersPage from "../page_objects/ShortlistedSuppliersPage";
import * as TenderBoxPage from "../page_objects/tender_manager/TenderBoxPage";
import * as Functions from "../support/functions"


// Register

// OJEU Notice
// Competitive Contract Notice

// Tenderbox - Create, Questionnaire, Invite, Supplier, Evalutate, Award

// Message Centre - Open messages, download attachments

// Questionnaire - Create custom, add and remove questions

// Tenderbox with no eval plan

const tenderName = "smokeTender"
const boxName = "smokeBox"

Functions.GetServer()

describe ('Smoke Test', function () {
    beforeEach(function () {
        cy.visit('')

        cy.contains('Login / Register').click()

        cy.login('buyer')
    })

    if (Cypress.env('live') === false) {
        it ('Publish OJEU Notice', function () {
            DashboardPage.gotoTenderManager()

            TenderManagerPage.gotoCreateTenderExercise()
    
            TenderManagerPage.createTenderExercise(tenderName)

            TenderExercisePage.gotoExistingNotice()

            NoticePage.createContractNotice()
        })
    }

    if (Cypress.env('live') === false) {
        it ('Publish Competitive Contract Notice', function () {
            DashboardPage.gotoTenderManager()

            TenderManagerPage.gotoCreateTenderExercise()
    
            TenderManagerPage.createTenderExercise(tenderName)

            TenderExercisePage.gotoCreateNotice()

            NoticePage.createCompetitiveNotice()
        })
    }

    it ('Complete and award Tenderbox', function () {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        TenderManagerPage.createTenderExercise(tenderName)

        TenderExercisePage.gotoCreateTenderBox()

        TenderBoxPage.initialBoxSetUp(boxName)

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.importExistingQuestionnaire()

        cy.get('[id^="page-name-link-"').should('have.length', 2)

        // Add document to price document upload
        //QuestionnairePage.viewSection(2)
        cy.get('[id^="page-name-link-"').eq(1).click()
        cy.wait(1000)

        cy.get('#body-edit_question').click()
        cy.wait(500)

        QuestionnairePage.setPriceDocumentUpload()

        QuestionnairePage.returnToOverview()

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addByEmail()

        cy.logout()

        // Supplier part
        const min = parseInt(Cypress.moment().format('m'));
        const hour = parseInt(Cypress.moment().format('H'));

        var curTime = (hour * 60) + min;

        const sqOpenMin = TenderBoxPage.openMin;
        const sqOpenHour = TenderBoxPage.openHour;

        var openTime = (sqOpenHour * 60) + sqOpenMin;

        const waitTime = (openTime - curTime) * 60 * 1000

        cy.log(openTime)
        cy.log(curTime)
        cy.log(waitTime)

        if (waitTime > 0) {
            cy.wait(waitTime)
        }

        cy.visit('')

        cy.contains('Login / Register').click()

        cy.login('supplier')

        cy.get('#modules-responses_and_invites').click()

        cy.contains(boxName).parent().find('[name="oneClickRespond"]').click()

        cy.get('#respondButton').click() // Accept invitation

        cy.contains('Continue to Stage Two').click()

        cy.get('#yes0').check()

        cy.get('#buttons-next_page').click()

        cy.get('#dragandrophandler input').attachFile('QuickCallTestFile.docx')

        cy.get('[name="upload"]').click()
        cy.wait(500)

        cy.contains('Save and Proceed to Stage 3 ').click()

        cy.contains('Submit Response').click()

        cy.contains('Response Successfully Submitted').should('exist')

        // Message buyer

        const min2 = parseInt(Cypress.moment().format('m'));
        const hour2 = parseInt(Cypress.moment().format('H'));

        var curTime = (hour2 * 60) + min2;

        const sqCloseMin2 = TenderBoxPage.closeMin;
        const sqCloseHour2 = TenderBoxPage.closeHour;

        var closeTime = (sqCloseHour2 * 60) + sqCloseMin2;

        const waitTime2 = (closeTime - curTime) * 60 * 1000

        cy.log(closeTime)
        cy.log(curTime)
        cy.log(waitTime2)

        if (waitTime2 > 0) {
            cy.wait(waitTime2)
        }

        cy.logout()

        // Back to buyer
        cy.visit('')

        cy.contains('Login / Register').click()

        cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.gotoEvaluateResponses()

        EvalResponsesPage.gotoOverviewPage()

        EvalResponsesPage.startSideBySideEval()
        EvalResponsesPage.smokeSideBySide()
        EvalResponsesPage.finishSideBySideEval()

        cy.contains('Not started').should('exist')

        EvalResponsesPage.startConsensusEval()
        EvalResponsesPage.smokeConsensus()
        EvalResponsesPage.finishConsensusEval()

        cy.contains('Completed').should('exist')
        // Check overview page looks correct as well

        // Check download scorecard etc

        EvalResponsesPage.awardContract()
    })

    afterEach(function () {
        //cy.logout()
    })
})