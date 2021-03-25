/// <reference types="cypress" />

import * as DashboardPage from "../page_objects/DashboardPage";
import * as DPSManagerPage from "../page_objects/dps_manager/DPSManagerPage";
import * as DPSExercisePage from "../page_objects/dps_manager/DPSExercisePage";
import * as DPSQuestionnairePage from "../page_objects/dps_manager/DPSQuestionnairePage";
import * as QuestionnairePage from "../page_objects/QuestionnairePage";
import * as EvalPlanPage from "../page_objects/EvalPlanPage";
import * as AddSuppliersPage from "../page_objects/AddSuppliersPage";
import * as EvalResponsesPage from "../page_objects/EvalResponsesPage";
import * as DPSSelectListPage from "../page_objects/DPSSelectListPage";
import * as TenderBoxPage from "../page_objects/tender_manager/TenderBoxPage";
import * as ResponseManagerPage from "../page_objects/supplier/ResponseManagerPage"
import * as ResponsePage from "../page_objects/supplier/ResponsePage"
import * as Functions from "../support/functions"


const dpsName = "testDPSName"
const questionnaireName = "testQuestionnaireName"
const mcName = "testCompName"

Functions.GetServer()

describe ('DPS Manager - Stage 1', function() {
    before (function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce('JSESSIONID')

        cy.visit('/delta')
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

        //TenderBoxPage.initialQuestionnaireSetUp(questionnaireName)
        TenderBoxPage.initialSQSetUp(questionnaireName)

        cy.url().should('include', 'delta/buyers/select/viewListStatus.html')

        cy.contains("SQ with name '" + questionnaireName + "' has now been updated.").should('exist')
    })

    it ('Set up custom questionnaire for DPS Questionnaire', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingQuestionnaire()

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()

        QuestionnairePage.createBasicQuestionnaire()

        cy.url().should('include', 'viewListStatus.html')

        cy.get('#documents-edit_questionnaire span').should('have.class', 'tick')
    })

    it ('Set up evaluation plan for DPS Questionnaire', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingQuestionnaire()

        TenderBoxPage.gotoCreateEvalPlan()

        EvalPlanPage.createEvalPlan()

        cy.url().should('include', 'viewListStatus.html')

        cy.get('#documents-edit_evaluation_plan span').should('have.class', 'tick')
    })

    it ('Add suppliers to DPS Questionnaire', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingQuestionnaire()

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addByEmail()

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addExisitingSuppliers()
    })

    after (function () {
        cy.logout()

        cy.clearCookies()
    })
})

describe ('Supplier for DPS Questionnaire', function () {
    before(function () {
        let waitTime = Functions.GetWaitTime(TenderBoxPage.closeMin, TenderBoxPage.closeHour) - 150000 // Start supplier response with 2.5 mins until closing
        
        if (waitTime > 0) {
            cy.wait(waitTime)
        }
    })

    it ('Supplier submits response for DPS Questionnaire', () => {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('supplier')

        DashboardPage.gotoResponsesAndInvites()

        ResponseManagerPage.viewInvite(questionnaireName)

        ResponsePage.acceptInvite()

        ResponsePage.continueStage2()

        ResponsePage.completeBasicResponse()

        ResponsePage.saveAndContinue()

        ResponsePage.submitResponse()
    })

    afterEach(function () {
        cy.logout()

        cy.clearCookies()
    })

    after (function () {
        let waitTime = Functions.GetWaitTime(TenderBoxPage.closeMin, TenderBoxPage.closeHour)

        if (waitTime > 0) {
            cy.wait(waitTime)
        }
    })
})

describe ('DPS Manager - Stage 2', function () {
    before (function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce('JSESSIONID')

        cy.visit('/delta')
    })

    it ('Evaluate responses for DPS Questionnaire', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingQuestionnaire()

        TenderBoxPage.gotoEvaluateResponses()

        // EvalResponsesPage.dpsEvalResponse(0)
        // EvalResponsesPage.dpsEvalSideBySide()

        // EvalResponsesPage.dpsEvalResponse(0)
        EvalResponsesPage.dpsEvalConsensus(0)
    })

    it ('Accept supplier for DPS Questionnaire', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingQuestionnaire()

        TenderBoxPage.gotoEvaluateResponses()

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

        // TenderBoxPage.initialBoxSetUp(mcName)
        TenderBoxPage.initialBoxSetUp(mcName)

        cy.contains("Tenderbox with name '" + mcName + "' has now been created.")
    })

    it ('Set up custom questionnaire for Mini Comp', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingMiniComp()

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()

        QuestionnairePage.createPriceCustomQuestionnaire()

        cy.url().should('include', 'viewListStatus.html')

        cy.get('#documents-edit_questionnaire span').should('have.class', 'tick')
    })

    it ('Set up evaluation plan for Mini Comp', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingMiniComp()

        TenderBoxPage.gotoCreateEvalPlan()

        EvalPlanPage.createPriceEvalPlan()
        //EvalPlanPage.createEvalPlan()

        cy.url().should('include', 'viewListStatus.html')

        cy.get('#documents-edit_evaluation_plan span').should('have.class', 'tick')
    })

    it ('Add suppliers to Mini Comp', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingMiniComp()

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.dpsAddExistingSuppliers()

        TenderBoxPage.gotoAddSuppliers()

        //cy.contains('demosupplieracccount@bipsolutions.com').should('exist')
        cy.fixture('logins.json').then((logins) => {
            cy.contains(logins[Cypress.env('id')].supplier.email).should('exist')
        })
    })

    after (function () {
        cy.logout()

        cy.clearCookies()
    })
})

describe ('Supplier for Mini Comp', function () {
    before(function () {
        let waitTime = Functions.GetWaitTime(TenderBoxPage.closeMin, TenderBoxPage.closeHour) - 150000 // Start supplier response with 2.5 mins until closing
        
        if (waitTime > 0) {
            cy.wait(waitTime)
        }
    })

    it ('Supplier submits response for Mini Comp', () => {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('supplier')

        DashboardPage.gotoResponsesAndInvites()

        ResponseManagerPage.viewInvite(mcName)

        ResponsePage.acceptInvite()

        ResponsePage.continueStage2()

        ResponsePage.completePriceResponse()

        ResponsePage.submitResponse()
    })

    afterEach(function () {
        cy.logout()
    })

    after (function () {
        let waitTime = Functions.GetWaitTime(TenderBoxPage.closeMin, TenderBoxPage.closeHour)

        if (waitTime > 0) {
            cy.wait(waitTime)
        }
    })
})

describe ('DPS Manager - Stage 3', function () {
    before (function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce('JSESSIONID')

        cy.visit('/delta')
    })

    it ('Evaluate responses for Mini Comp', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingMiniComp()

        TenderBoxPage.gotoEvaluateResponses()

        EvalResponsesPage.evalDPSPriceConsensus(0)
        //EvalResponsesPage.evalSideBySide(0)
    })

    it ('Award contract to supplier', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingMiniComp()

        TenderBoxPage.gotoEvaluateResponses()

        EvalResponsesPage.awardContract()

        cy.contains('TenderBox: ' + mcName + ' has been awarded to: BiP Solutions').should('exist')
    })

    after (function () {
        cy.logout()

        cy.clearCookies()
    })
})