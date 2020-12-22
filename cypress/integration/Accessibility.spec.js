import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/tender_manager/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/tender_manager/TenderExercisePage";
import * as NoticePage from "../page_objects/NoticePage";
import * as SQPage from "../page_objects/tender_manager/SQPage";
import * as QuestionnairePage from "../page_objects/QuestionnairePage";
import * as EvalPlanPage from "../page_objects/EvalPlanPage";
import * as AddSuppliersPage from "../page_objects/AddSuppliersPage";
import * as ShortlistedSuppliersPage from "../page_objects/ShortlistedSuppliersPage";
import * as EvalResponsesPage from "../page_objects/EvalResponsesPage";
import * as TenderBoxPage from "../page_objects/tender_manager/TenderBoxPage";

var testName = 'None'

const tenderName = "accessTenderName"
const sqName = "accessSQName"
const boxName = "accessBoxName"

function terminalLog(violations, name) {
    cy.task(
      'log',
      `${violations.length} accessibility violation${
        violations.length === 1 ? '' : 's'
      } ${violations.length === 1 ? 'was' : 'were'} detected`
    )
    // pluck specific keys to keep the table readable
    const violationData = violations.map(
      ({ id, impact, description, help, nodes }) => ({
        id,
        impact,
        description,
        help,
        nodes: nodes
      })
    )

    cy.writeFile('./results/' + testName + '_a11y.log', violationData)
   
    cy.task('table', violationData)
}

function accessibilityTest() {
    cy.injectAxe()

    cy.configureAxe({
        reporter: 'v2'
    })

    cy.checkA11y(null, null, terminalLog)
}

describe('Accessibility - TenderManager 1', function() {
    beforeEach(function () {
        cy.visit('https://test.delta-esourcing.com/')
        //cy.visit()
        cy.contains('Login / Register').click()

        cy.login('buyer')
    })

    it ('Dashboard Page', () => {
        testName = "Dashboard"

        accessibilityTest()
    })

    it ('Tender Manager Page', () => {
        testName = "Tender_Manager"

        DashboardPage.gotoTenderManager()

        accessibilityTest()
    })

    it ('Create Tender Exercise Page', () => {
        testName = "Create_Tender"

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        accessibilityTest()
    })

    it ('Tender Exercise Page', () => {
        testName = "Tender_Exercise"

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        TenderManagerPage.createTenderExercise(tenderName)

        accessibilityTest()
    })

    it ('Create SQ Page', () => {
        testName = "Create_SQ"

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoCreateSQ()

        accessibilityTest()
    })

    it ('SQ Page', () => {
        testName = "SQ"

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingSQ()

        SQPage.initialSQSetUp(sqName)

        accessibilityTest()
    })

    it ('Edit Questionnaire Page', () => {
        testName = "Edit_Questionnaire"

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingSQ()

        SQPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()

        accessibilityTest()
    })

    it ('Evaluation Plan Page', () => {
        testName = "Eval_Plan"

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingSQ()

        SQPage.gotoEditQuestionnaire()

        QuestionnairePage.createCustomQuestionnaire()

        SQPage.gotoCreateEvalPlan()

        accessibilityTest()
    })

    it ('Add Suppliers Page', () => {
        testName = "Add_Suppliers"

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingSQ()

        SQPage.gotoAddSuppliers()

        AddSuppliersPage.addByEmail()

        SQPage.gotoAddSuppliers()

        accessibilityTest()
    })

    it ('Message Centre Page', () => {
        testName = "Message_Centre"

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingSQ()

        SQPage.gotoMessageCentre()

        accessibilityTest()
    })

    afterEach(function () {
        cy.logout()
    })
})

describe ('Accessibility - Tender Manager 2', function () {
    before(function () {
        const min = parseInt(Cypress.moment().format('m'));
        const hour = parseInt(Cypress.moment().format('H'));

        var curTime = (hour * 60) + min;

        const sqOpenMin = SQPage.openMin;
        const sqOpenHour = SQPage.openHour;

        var openTime = (sqOpenHour * 60) + sqOpenMin;

        const waitTime = (openTime - curTime) * 60 * 1000

        cy.log(openTime)
        cy.log(curTime)
        cy.log(waitTime)

        if (waitTime > 0) {
            cy.wait(waitTime)
        }

        cy.visit('https://test.delta-esourcing.com/')

        cy.contains('Login / Register').click()

        cy.login('supplier', 'Tenders2020')

        cy.get('#modules-responses_and_invites').click()

        cy.contains(sqName).parent().find('[name="oneClickRespond"]').click()

        cy.get('#respondButton').click() // Accept invitation

        cy.contains('Continue to Stage Two').click()

        cy.get('#yes0').check()

        cy.get('#mytext').type('I can do this because I can.')

        cy.get('#responseForm').find('#confirmSubmit[name="submitResponse"]').click()

        cy.get('#responses\\[2\\]\\.selections\\[0\\]\\.selected').check()

        cy.get('#responseForm').find('#confirmSubmit[name="submitResponse"]').click()

        cy.get('[name="confirmSubmit"').click()

        cy.contains('Response Successfully Submitted').should('exist')

        cy.logout()

        const min2 = parseInt(Cypress.moment().format('m'));
        const hour2 = parseInt(Cypress.moment().format('H'));

        var curTime = (hour2 * 60) + min2;

        const sqCloseMin = SQPage.closeMin;
        const sqCloseHour = SQPage.closeHour;

        var closeTime = (sqCloseHour * 60) + sqCloseMin;

        const waitTime2 = (closeTime - curTime) * 60 * 1000

        cy.log(closeTime)
        cy.log(curTime)
        cy.log(waitTime2)

        if (waitTime2 > 0) {
            cy.wait(waitTime2)
        }
    })

    beforeEach(function () {
        cy.visit('https://test.delta-esourcing.com/')

        cy.contains('Login / Register').click()

        cy.login('buyer')
    })

    it ('Evaluate Responses Page', () => {
        testName = "Eval_Response"

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingSQ()

        SQPage.gotoEvaluateResponses()

        EvalResponsesPage.evalSideBySide()

        accessibilityTest()
    })

    it ('Shortlist Supplier Page', () => {
        testName = "Shortlist_Page"

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingSQ()

        SQPage.gotoEvaluateResponses()

        EvalResponsesPage.shortListSupplier(0)

        accessibilityTest()
    })

    afterEach(function () {
        cy.logout()
    })
})

describe ('Accessability - Tender Manager 3', function () {
    before(function () {
        cy.visit('https://test.delta-esourcing.com/')

        cy.contains('Login / Register').click()

        cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.initialBoxSetUp(boxName)

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()

        QuestionnairePage.createCustomQuestionnaire()

        TenderBoxPage.gotoCreateEvalPlan()

        EvalPlanPage.createEvalPlan()

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addByEmail()

        cy.logout()

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

        cy.visit('https://test.delta-esourcing.com/')

        cy.contains('Login / Register').click()

        cy.login('supplier', 'Tenders2020')

        cy.get('#modules-responses_and_invites').click()

        cy.contains(boxName).parent().find('[name="oneClickRespond"]').click()

        cy.get('#respondButton').click() // Accept invitation

        cy.contains('Continue to Stage Two').click()

        cy.get('#yes0').check()

        cy.get('#mytext').type('I can do this because I can.')

        cy.get('#responseForm').find('#confirmSubmit[name="submitResponse"]').click()

        cy.get('#responses\\[2\\]\\.selections\\[0\\]\\.selected').check()

        cy.get('#responseForm').find('#confirmSubmit[name="submitResponse"]').click()

        cy.get('[name="confirmSubmit"').click()

        cy.contains('Response Successfully Submitted').should('exist')

        cy.logout()

        const min2 = parseInt(Cypress.moment().format('m'));
        const hour2 = parseInt(Cypress.moment().format('H'));

        var curTime = (hour2 * 60) + min2;

        const sqCloseMin = TenderBoxPage.closeMin;
        const sqCloseHour = TenderBoxPage.closeHour;

        var closeTime = (sqCloseHour * 60) + sqCloseMin;

        const waitTime2 = (closeTime - curTime) * 60 * 1000

        cy.log(closeTime)
        cy.log(curTime)
        cy.log(waitTime2)

        if (waitTime2 > 0) {
            cy.wait(waitTime2)
        }
    })

    beforeEach(function () {
        cy.visit('https://test.delta-esourcing.com/')

        cy.contains('Login / Register').click()

        cy.login('buyer')
    })

    it ('Award Contract Page', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.gotoEvaluateResponses()

        EvalResponsesPage.evalConsensus(0)

        // Goto the award page
        cy.get('#tabs-overview').click()

        cy.get('#pqqResp tbody').find('input[type="checkbox"]').eq(0).check()   

        cy.get('[name="tenderboxAward"]').click()

        accessibilityTest()
    })

    afterEach(function () {
        cy.logout()
    })
})