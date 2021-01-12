// / <reference types="cypress" />

import * as DashboardPage from "../page_objects/DashboardPage";
import * as DPSManagerPage from "../page_objects/dps_manager/DPSManagerPage";
import * as DPSExercisePage from "../page_objects/dps_manager/DPSExercisePage";
import * as DPSQuestionnairePage from "../page_objects/dps_manager/DPSQuestionnairePage";
import * as QuestionnairePage from "../page_objects/QuestionnairePage";
import * as EvalPlanPage from "../page_objects/EvalPlanPage";
import * as AddSuppliersPage from "../page_objects/AddSuppliersPage";
import * as EvalResponsesPage from "../page_objects/EvalResponsesPage";
import * as DPSSelectListPage from "../page_objects/DPSSelectListPage";
import * as DPSMiniCompPage from "../page_objects/dps_manager/DPSMiniCompPage";

const dpsName = "testDPSName"
const questionnaireName = "testQuestionnaireName"
const mcName = "testCompName"

describe ('DPS Manager - Stage 1', function() {
    beforeEach(function () {
        cy.visit('https://test.delta-esourcing.com/')

        cy.contains('Login / Register').click()

        cy.login('buyer')
    })

    it ('Create DPS Exercise', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoCreateDPSExercise()

        DPSManagerPage.createDPSExercise(dpsName)

        // Should be on the Tender Exercise Page

        cy.url().should('include', 'delta/buyers/tenders/viewTenderStatus')

        cy.contains('DPS Exercise ' + dpsName + ' has been created').should('exist')
    })

    it ('Create DPS Questionnaire', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingQuestionnaire()

        DPSQuestionnairePage.initialQuestionnaireSetUp(questionnaireName)

        cy.url().should('include', 'delta/buyers/select/viewListStatus.html')

        cy.contains("SQ with name '" + questionnaireName + "' has now been updated.").should('exist')
    })

    it ('Set up custom questionnaire for DPS Questionnaire', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingQuestionnaire()

        DPSQuestionnairePage.gotoCreateQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()

        QuestionnairePage.createCustomQuestionnaire()

        cy.url().should('include', 'viewListStatus.html')

        cy.get('#documents-edit_questionnaire span').should('have.class', 'tick')
    })

    it ('Set up evaluation plan for DPS Questionnaire', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingQuestionnaire()

        DPSQuestionnairePage.gotoCreateEvalPlan()

        EvalPlanPage.createEvalPlan()

        cy.url().should('include', 'viewListStatus.html')

        cy.get('#documents-edit_evaluation_plan span').should('have.class', 'tick')
    })

    it ('Add suppliers to DPS Questionnaire', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingQuestionnaire()

        DPSQuestionnairePage.gotoAddSuppliers()

        AddSuppliersPage.addByEmail()

        DPSQuestionnairePage.gotoAddSuppliers()

        AddSuppliersPage.addExisitingSuppliers()
    })

    afterEach(function () {
        cy.logout()
    })
})

describe ('Supplier for DPS Questionnaire', function () {
    before(function () {
        const min = parseInt(Cypress.moment().format('m'));
        const hour = parseInt(Cypress.moment().format('H'));

        var curTime = (hour * 60) + min;

        const questionnaireOpenMin = DPSQuestionnairePage.openMin;
        const questionnaireOpenHour = DPSQuestionnairePage.openHour;

        var openTime = (questionnaireOpenHour * 60) + questionnaireOpenMin;

        const waitTime = (openTime - curTime) * 60 * 1000

        cy.log(openTime)
        cy.log(curTime)
        cy.log(waitTime)

        if (waitTime > 0) {
            cy.wait(waitTime)
        }
    })

    it ('Supplier submits response for DPS Questionnaire', () => {
        cy.visit('https://test.delta-esourcing.com/')

        cy.contains('Login / Register').click()

        cy.login('supplier')

        cy.get('#modules-responses_and_invites').click()

        cy.contains(questionnaireName).parent().find('[name="oneClickRespond"]').click()

        cy.get('#respondButton').click() // Accept invitation

        cy.contains('Continue to Stage Two').click()

        cy.get('#yes0').check()

        cy.get('#mytext').type('I can do this because I can.')

        cy.get('#responseForm').find('#confirmSubmit[name="submitResponse"]').click()

        cy.get('#responses\\[2\\]\\.selections\\[0\\]\\.selected').check()

        cy.get('#responseForm').find('#confirmSubmit[name="submitResponse"]').click()

        cy.get('[name="confirmSubmit"').click()

        cy.contains('Response Successfully Submitted').should('exist')
    })

    afterEach(function () {
        cy.logout()
    })

    after(function () {
        const min = parseInt(Cypress.moment().format('m'));
        const hour = parseInt(Cypress.moment().format('H'));

        var curTime = (hour * 60) + min;

        const questionnaireCloseMin = DPSQuestionnairePage.closeMin;
        const questionnaireCloseHour = DPSQuestionnairePage.closeHour;

        var closeTime = (questionnaireCloseHour * 60) + questionnaireCloseMin;

        const waitTime = (closeTime - curTime) * 60 * 1000

        cy.log(closeTime)
        cy.log(curTime)
        cy.log(waitTime)

        if (waitTime > 0) {
            cy.wait(waitTime)
        }
    })
})

describe ('DPS Manager - Stage 2', function () {
    beforeEach(function () {
        cy.visit('https://test.delta-esourcing.com/')

        cy.contains('Login / Register').click()

        cy.login('buyer')
    })

    it ('Evaluate responses for DPS Questionnaire', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingQuestionnaire()

        DPSQuestionnairePage.gotoEvaluateResponses()

        //EvalResponsesPage.dpsEvalSideBySide()

        EvalResponsesPage.dpsEvalConsensus(0)
    })

    it ('Accept supplier for DPS Questionnaire', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingQuestionnaire()

        DPSQuestionnairePage.gotoEvaluateResponses()

        EvalResponsesPage.dpsApproveSupplier(0)

        cy.contains('1 out of 1 Suppliers have been approved and added to testQuestionnaireName. Please note - Only pending users can be Approved, Declined and Removed users cannot be approved and added to a DPS Supplier List.').should('exist')
    })

    it ('Publish Select List', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingQuestionnaire()

        DPSQuestionnairePage.gotoViewSelectList()

        DPSSelectListPage.publishSelectList()

        cy.contains('This Select List has been published and is now viewable throughout your Organisation').should('exist')       
    })

    it ('Create Mini Comp', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoCreateMiniComp()

        DPSMiniCompPage.initialBoxSetUp(mcName)

        cy.contains("Tenderbox with name '" + mcName + "' has now been created.")
    })

    it ('Set up custom questionnaire for Mini Comp', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingMiniComp()

        DPSMiniCompPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()

        QuestionnairePage.createPriceCustomQuestionnaire()

        cy.url().should('include', 'viewListStatus.html')

        cy.get('#documents-edit_questionnaire span').should('have.class', 'tick')
    })

    it ('Set up evaluation plan for Mini Comp', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingMiniComp()

        DPSMiniCompPage.gotoCreateEvalPlan()

        EvalPlanPage.createPriceEvalPlan()

        cy.url().should('include', 'viewListStatus.html')

        cy.get('#documents-edit_evaluation_plan span').should('have.class', 'tick')
    })

    it ('Add suppliers to Mini Comp', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingMiniComp()

        DPSMiniCompPage.gotoAddSuppliers()

        AddSuppliersPage.dpsAddExistingSuppliers()

        DPSMiniCompPage.gotoAddSuppliers()

        cy.contains('demosupplieracccount@bipsolutions.com').should('exist')
    })

    afterEach(function () {
        cy.logout()
    })
})

describe ('Supplier for Mini Comp', function () {
    before(function () {
        const min = parseInt(Cypress.moment().format('m'));
        const hour = parseInt(Cypress.moment().format('H'));

        var curTime = (hour * 60) + min;

        const mcOpenMin = DPSMiniCompPage.openMin;
        const mcOpenHour = DPSMiniCompPage.openHour;

        var openTime = (mcOpenHour * 60) + mcOpenMin;

        const waitTime = (openTime - curTime) * 60 * 1000

        cy.log(openTime)
        cy.log(curTime)
        cy.log(waitTime)

        if (waitTime > 0) {
            cy.wait(waitTime)
        }
    })

    it ('Supplier submits response for Mini Comp', () => {
        cy.visit('https://test.delta-esourcing.com/')

        cy.contains('Login / Register').click()

        cy.login('supplier', 'Tenders2020')

        cy.get('#modules-responses_and_invites').click()

        cy.contains(mcName).parent().find('[name="oneClickRespond"]').click()

        cy.get('#respondButton').click() // Accept invitation

        cy.contains('Continue to Stage Two').click()

        cy.get('#bid_0').type('25000')

        cy.get('[name="responses\\[1\\]\\.currency"]').type('10000')

        cy.get('#responseForm').find('#confirmSubmit[name="submitResponse"]').click()

        cy.get('[name="confirmSubmit"').click()

        cy.contains('Response Successfully Submitted').should('exist')
    })

    afterEach(function () {
        cy.logout()
    })

    after(function () {
        const min = parseInt(Cypress.moment().format('m'));
        const hour = parseInt(Cypress.moment().format('H'));

        var curTime = (hour * 60) + min;

        const mcCloseMin = DPSMiniCompPage.closeMin;
        const mcCloseHour = DPSMiniCompPage.closeHour;

        var closeTime = (mcCloseHour * 60) + mcCloseMin;

        const waitTime = (closeTime - curTime) * 60 * 1000

        cy.log(closeTime)
        cy.log(curTime)
        cy.log(waitTime)

        if (waitTime > 0) {
            cy.wait(waitTime)
        }
    })
})

describe ('DPS Manager - Stage 3', function () {
    beforeEach(function () {
        cy.visit('https://test.delta-esourcing.com/')

        cy.contains('Login / Register').click()

        cy.login('buyer')
    })

    it ('Evaluate responses for Mini Comp', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingMiniComp()

        DPSMiniCompPage.gotoEvaluateResponses()

        EvalResponsesPage.evalDPSPriceConsensus(0)
    })

    it ('Award contract to supplier', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingMiniComp()

        DPSMiniCompPage.gotoEvaluateResponses()

        EvalResponsesPage.awardContract()

        cy.contains('TenderBox: ' + mcName + ' has been awarded to: BiP Solutions').should('exist')
    })

    afterEach(function () {
        cy.logout()
    })
})