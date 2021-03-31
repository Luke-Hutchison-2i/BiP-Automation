import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/tender_manager/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/tender_manager/TenderExercisePage";
import * as QuestionnairePage from "../page_objects/QuestionnairePage";
import * as EvalPlanPage from "../page_objects/EvalPlanPage";
import * as AddSuppliersPage from "../page_objects/AddSuppliersPage";
import * as EvalResponsesPage from "../page_objects/EvalResponsesPage";
import * as TenderBoxPage from "../page_objects/tender_manager/TenderBoxPage";
import * as ResponseManagerPage from "../page_objects/supplier/ResponseManagerPage"
import * as ResponsePage from "../page_objects/supplier/ResponsePage"
import * as Functions from "../support/functions"

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

    cy.checkA11y(null, null, terminalLog, true)
}

Functions.GetServer()

describe('Accessibility - TenderManager 1', function() {
    before (function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce('JSESSIONID')

        cy.visit('/delta')
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

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.gotoCreateSQ()

        accessibilityTest()
    })

    it ('SQ Page', () => {
        testName = "SQ"

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.gotoExistingSQ()

        TenderBoxPage.initialSQSetUp(sqName)

        accessibilityTest()
    })

    it ('Edit Questionnaire Page', () => {
        testName = "Edit_Questionnaire"

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.gotoExistingSQ()

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()

        accessibilityTest()
    })

    it ('Evaluation Plan Page', () => {
        testName = "Eval_Plan"

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.gotoExistingSQ()

        TenderBoxPage.gotoExistingQuestionnaire()

        QuestionnairePage.createBasicQuestionnaire()

        TenderBoxPage.gotoCreateEvalPlan()

        accessibilityTest()
    })

    it ('Add Suppliers Page', () => {
        testName = "Add_Suppliers"

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.gotoExistingSQ()

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addByEmail()

        TenderBoxPage.gotoAddSuppliers()

        accessibilityTest()
    })

    it ('Message Centre Page', () => {
        testName = "Message_Centre"

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.gotoExistingSQ()

        TenderBoxPage.gotoMessageCentre()

        accessibilityTest()
    })

    after (function () {
        cy.logout()

        cy.clearCookies()
    })
})

describe ('Supplier for SQ', function () {
    before(function () {
        let waitTime = Functions.GetWaitTime(TenderBoxPage.closeMin, TenderBoxPage.closeHour) - 150000 // Start supplier response with 2.5 mins until closing
        
        if (waitTime > 0) {
            cy.wait(waitTime)
        }
    })

    it ('Supplier submits response for SQ', () => {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('supplier')

        DashboardPage.gotoResponsesAndInvites()

        ResponseManagerPage.viewInvite(sqName)

        ResponsePage.acceptInvite()

        ResponsePage.continueStage2()

        ResponsePage.completeBasicResponse()

        ResponsePage.submitResponse()
    })

    after(function () {
        cy.logout()

        let waitTime = Functions.GetWaitTime(TenderBoxPage.closeMin, TenderBoxPage.closeHour)

        if (waitTime > 0) {
            cy.wait(waitTime)
        }
    })
})

describe ('Accessibility - Tender Manager 2', function () {
    
    before (function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce('JSESSIONID')

        cy.visit('/delta')
    })

    it ('Evaluate Responses Page', () => {
        testName = "Eval_Response"

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.gotoExistingSQ()

        TenderBoxPage.gotoEvaluateResponses()

        EvalResponsesPage.evalConsensus(0)

        accessibilityTest()
    })

    it ('Shortlist Supplier Page', () => {
        testName = "Shortlist_Page"

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.gotoExistingSQ()

        TenderBoxPage.gotoEvaluateResponses()

        EvalResponsesPage.shortListSupplier(0)

        accessibilityTest()
    })

    it ('Complete buyer steps for Tender Box', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.initialBoxSetUp(boxName)

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()

        QuestionnairePage.createPriceCustomQuestionnaire()

        TenderBoxPage.gotoCreateEvalPlan()

        EvalPlanPage.createPriceEvalPlan()

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addByEmail()
    })

    after (function () {
        cy.logout()

        cy.clearCookies()
    })
})

describe ('Supplier for TenderBox', function () {
    before(function () {
        let waitTime = Functions.GetWaitTime(TenderBoxPage.closeMin, TenderBoxPage.closeHour) - 150000 // Start supplier response with 2.5 mins until closing
        
        if (waitTime > 0) {
            cy.wait(waitTime)
        }
    })

    it ('Supplier submits response for Tender Box', () => {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('supplier')

        DashboardPage.gotoResponsesAndInvites()

        ResponseManagerPage.viewInvite(boxName)

        ResponsePage.acceptInvite()

        ResponsePage.continueStage2()

        ResponsePage.completePriceResponse()

        ResponsePage.submitResponse()
    })

    after(function () {
        cy.logout()

        let waitTime = Functions.GetWaitTime(TenderBoxPage.closeMin, TenderBoxPage.closeHour)

        if (waitTime > 0) {
            cy.wait(waitTime)
        }
    })
})

describe ('Accessability - Tender Manager 3', function () {
    before (function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce('JSESSIONID')

        cy.visit('/delta')
    })

    it ('Award Contract Page', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.gotoEvaluateResponses()

        EvalResponsesPage.evalPriceConsensus(0)

        // Goto the award page
        cy.get('#tabs-overview').click()

        cy.get('#bidderDetails tbody').find('input[type="checkbox"]').eq(0).check()   

        cy.get('#buttons-award_contract').click()

        accessibilityTest()
    })

    after (function () {
        cy.logout()

        cy.clearCookies()
    })
})