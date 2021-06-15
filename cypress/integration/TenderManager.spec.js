/// <reference types="cypress" />

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
import * as ResponseManagerPage from "../page_objects/supplier/ResponseManagerPage"
import * as ResponsePage from "../page_objects/supplier/ResponsePage"
import * as Functions from "../support/functions"


const tenderName = "testTenderName"
const sqName = "testSQName"
const boxName = "testBoxName"

Functions.GetServer()

describe ('Tender Manager - Stage 1', function() {
    before (function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce('JSESSIONID')

        cy.visit('/delta')
    })

    it ('Create Tender Exercise', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        TenderManagerPage.createTenderExercise(tenderName)

        // Should be on the Tender Exercise Page

        cy.url().should('include', 'delta/buyers/tenders/viewTenderStatus')

        cy.contains('Tender Exercise ' + tenderName + ' has been created').should('exist')
    })

    if (Cypress.env('live') === false) {
        it ('Set up an existing notice', () => {
            DashboardPage.gotoTenderManager()

            TenderManagerPage.gotoExistingTender(tenderName)

            TenderExercisePage.getExistingNotice(0).click()

            NoticePage.createContractNotice()
        })
    }

    it ('Create SQ', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.getExistingSQ(0).click()

        TenderBoxPage.initialSQSetUp(sqName)

        cy.url().should('include', 'delta/buyers/select/viewListStatus.html')
    })

    it ('Set up custom questionnaire for SQ', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.getExistingSQ(0).click()

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()

        QuestionnairePage.createBasicQuestionnaire()

        cy.url().should('include', 'viewListStatus.html')

        cy.get('#documents-edit_questionnaire').should('exist')

        cy.get('#documents-edit_questionnaire span').should('have.class', 'tick')
        
    })

    it ('Set up evaluation plan for SQ', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.getExistingSQ(0).click()

        TenderBoxPage.gotoCreateEvalPlan()

        EvalPlanPage.createBasicEvalPlan()

        TenderBoxPage.gotoCreateEvalPlan()

        EvalPlanPage.chooseEvaluators()

        cy.url().should('include', 'viewListStatus.html')

        cy.get('#documents-edit_evaluation_plan span').should('have.class', 'tick')
    })

    it ('Add suppliers to SQ', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.getExistingSQ(0).click()

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addByEmail()

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addExisitingSuppliers()
    })

    it ('Message suppliers from Message Centre', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.getExistingSQ(0).click()

        TenderBoxPage.gotoMessageCentre()

        cy.url().should('include', 'supplierListMessageCentre')
        cy.url().should('include', 'listType=TenderBox')

        MessageCentrePage.pickSupplier(0)

        MessageCentrePage.sendDirectMessage()

        cy.contains('Emails have been successfully sent to all selected suppliers').should('exist')

        MessageCentrePage.sendNewTopic()

        cy.contains('Message have been successfully sent to All Suppliers').should('exist')

        MessageCentrePage.pickSupplier(0)

        MessageCentrePage.disableMessages()

        cy.contains('Enable Messages').should('exist')

        cy.get('[name^="ischecked_"]').eq(0).should('be.disabled')
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

describe ('Tender Manager - Stage 2', function () {
    before (function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce('JSESSIONID')

        cy.visit('/delta')
    })

    it ('Evaluate responses for SQ', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.getExistingSQ(0).click()

        TenderBoxPage.gotoEvaluateResponses()

        EvalResponsesPage.gotoOverviewTab()

        EvalResponsesPage.basicSideBySide()
        
        EvalResponsesPage.basicConsensus(0)
    })

    it ('Shortlist supplier for SQ', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.getExistingSQ(0).click()

        TenderBoxPage.gotoEvaluateResponses()

        EvalResponsesPage.shortListSupplier(0)

        ShortlistedSuppliersPage.exportSupplierToTenderBox()
    })

    it ('Create Tender Box', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.getExistingTenderBox(0).click()

        TenderBoxPage.initialBoxSetUp(boxName)
    })

    it ('Set up custom questionnaire for Tender Box', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.getExistingTenderBox(0).click()

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()

        QuestionnairePage.createSmokeQuestionnaire()

        cy.url().should('include', 'viewListStatus.html')

        cy.get('#documents-edit_questionnaire span').should('have.class', 'tick')
    })

    it ('Set up evaluation plan for Tender Box', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.getExistingTenderBox(0).click()

        TenderBoxPage.gotoCreateEvalPlan()

        EvalPlanPage.createSmokeEvalPlan()

        cy.url().should('include', 'viewListStatus.html')

        cy.get('#documents-edit_evaluation_plan span').should('have.class', 'tick')
    })

    it ('Add suppliers to Tender Box', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.getExistingTenderBox(0).click()

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addExisitingSuppliers()
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

        ResponsePage.completeSmokeResponse()

        ResponsePage.submitResponse()
    })

    afterEach(function () {
        cy.logout()
    })

    after(function () {
        let waitTime = Functions.GetWaitTime(TenderBoxPage.closeMin, TenderBoxPage.closeHour)
        
        if (waitTime > 0) {
            cy.wait(waitTime)
        }
    })
})

describe ('Tender Manager - Stage 3', function () {
    before (function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce('JSESSIONID')

        cy.visit('/delta')
    })

    it ('Evaluate responses for Tender Box', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.getExistingTenderBox(0).click()

        TenderBoxPage.gotoEvaluateResponses()

        EvalResponsesPage.smokeConsensus(0)

        cy.get('#pqqResp tbody').find('[id^=responses-consensus_]').eq(0).should('contain.text', 'Completed')
    })

    it ('Award contract to supplier', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.getExistingTenderBox(0).click()

        TenderBoxPage.gotoEvaluateResponses()

        EvalResponsesPage.gotoOverviewTab()

        EvalResponsesPage.checkboxSupplier(0) 

        EvalResponsesPage.startAwardContract()

        EvalResponsesPage.awardContract()

        cy.contains('TenderBox: ' + boxName + ' has been awarded to: BiP Solutions').should('exist')
    })

    after (function () {
        cy.logout()

        cy.clearCookies()
    })
})