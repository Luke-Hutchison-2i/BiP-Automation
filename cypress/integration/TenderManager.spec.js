/// <reference types="cypress" />

import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/tender_manager/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/tender_manager/TenderExercisePage";
import * as NoticePage from "../page_objects/NoticePage";
import * as SQPage from "../page_objects/tender_manager/SQPage";
import * as QuestionnairePage from "../page_objects/QuestionnairePage";
import * as EvalPlanPage from "../page_objects/EvalPlanPage";
import * as AddSuppliersPage from "../page_objects/AddSuppliersPage";
import * as MessageCentrePage from "../page_objects/MessageCentrePage";
import * as EvalResponsesPage from "../page_objects/EvalResponsesPage";
import * as ShortlistedSuppliersPage from "../page_objects/ShortlistedSuppliersPage";
import * as TenderBoxPage from "../page_objects/tender_manager/TenderBoxPage";

const tenderName = "testTenderName"
const sqName = "testSQName"
const boxName = "testBoxName"

describe ('Tender Manager - Stage 1', function() {
    beforeEach(function () {
        cy.visit('https://test.delta-esourcing.com/')

        cy.contains('Login / Register').click()

        cy.login('buyer')
    })

    it ('Create Tender Exercise', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        TenderManagerPage.createTenderExercise(tenderName)

        // Should be on the Tender Exercise Page

        cy.url().should('include', 'delta/buyers/tenders/viewTenderStatus')

        cy.contains('Tender Exercise ' + tenderName + ' has been created')
    })

    // In Progress
    it ('Edit an existing notice', () => {
        DashboardPage.gotoTenderManager()

        cy.wait(1000)

        TenderManagerPage.gotoExistingTender()

        cy.wait(2000)

        TenderExercisePage.gotoExistingNotice()

        NoticePage.createContractNotice()
    })

    it ('Set up SQ', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingSQ()

        SQPage.initialSQSetUp(sqName)

        cy.url().should('include', 'delta/buyers/select/viewListStatus.html')
    })

    it ('Set up custom questionnaire', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingSQ()

        SQPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()

        QuestionnairePage.createCustomQuestionnaire()

        cy.url().should('include', 'viewListStatus.html')

        cy.get('#documents-edit_questionnaire').should('exist')

        cy.get('#documents-edit_questionnaire span').should('have.class', 'tick')
        
    })

    it ('Set up evaluation plan', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingSQ()

        SQPage.gotoCreateEvalPlan()

        EvalPlanPage.createEvalPlan()

        cy.url().should('include', 'viewListStatus.html')

        cy.get('#documents-edit_evaluation_plan span').should('have.class', 'tick')
    })

    it ('Add suppliers to SQ', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingSQ()

        SQPage.gotoAddSuppliers()

        AddSuppliersPage.addByEmail()

        SQPage.gotoAddSuppliers()

        AddSuppliersPage.addExisitingSuppliers()
    })

    it ('Message suppliers from Message Centre', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingSQ()

        SQPage.gotoMessageCentre()

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

    afterEach(function () {
        cy.logout()
    })
})

describe ('Supplier for SQ', function () {
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
    })

    it ('Supplier submits response', () => {
        cy.visit('https://test.delta-esourcing.com/')

        cy.contains('Login / Register').click()

        cy.login('supplier')

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
    })

    afterEach(function () {
        cy.logout()
    })

    after(function () {
        const min = parseInt(Cypress.moment().format('m'));
        const hour = parseInt(Cypress.moment().format('H'));

        var curTime = (hour * 60) + min;

        const sqCloseMin = SQPage.closeMin;
        const sqCloseHour = SQPage.closeHour;

        var closeTime = (sqCloseHour * 60) + sqCloseMin;

        const waitTime = (closeTime - curTime) * 60 * 1000

        cy.log(closeTime)
        cy.log(curTime)
        cy.log(waitTime)

        if (waitTime > 0) {
            cy.wait(waitTime)
        }
    })
})

describe ('Tender Manager - Stage 2', function () {
    beforeEach(function () {
        cy.visit('https://test.delta-esourcing.com/')

        cy.contains('Login / Register').click()

        cy.login('buyer')
    })

    it ('Evaluate SQ responses', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingSQ()

        SQPage.gotoEvaluateResponses()

        EvalResponsesPage.evalSideBySide()
    })

    it ('Shortlist supplier', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingSQ()

        SQPage.gotoEvaluateResponses()

        EvalResponsesPage.shortListSupplier(0)

        ShortlistedSuppliersPage.exportSupplierToTenderBox()
    })

    it ('Set up Tender Box', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.initialBoxSetUp(boxName)
    })

    it ('Set up custom questionnaire', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()

        QuestionnairePage.createCustomQuestionnaire()

        cy.url().should('include', 'viewListStatus.html')

        cy.get('#documents-edit_questionnaire span').should('have.class', 'tick')
    })

    it ('Set up evaluation plan', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.gotoCreateEvalPlan()

        cy.wait(2000)

        EvalPlanPage.createEvalPlan()

        cy.url().should('include', 'viewListStatus.html')

        cy.get('#documents-edit_evaluation_plan span').should('have.class', 'tick')
    })

    it ('Add suppliers to Tender Box', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addByEmail()

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addExisitingSuppliers()
    })

    it ('Message suppliers', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingTenderBox()

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

    afterEach(function () {
        cy.logout()
    })
})

describe ('Supplier for TenderBox', function () {
    before(function () {
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
    })

    it ('Supplier submits response', () => {
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
    })

    afterEach(function () {
        cy.logout()
    })

    after(function () {
        const min = parseInt(Cypress.moment().format('m'));
        const hour = parseInt(Cypress.moment().format('H'));

        var curTime = (hour * 60) + min;

        const sqCloseMin = TenderBoxPage.closeMin;
        const sqCloseHour = TenderBoxPage.closeHour;

        var closeTime = (sqCloseHour * 60) + sqCloseMin;

        const waitTime = (closeTime - curTime) * 60 * 1000

        cy.log(closeTime)
        cy.log(curTime)
        cy.log(waitTime)

        if (waitTime > 0) {
            cy.wait(waitTime)
        }
    })
})

describe ('Tender Manager - Stage 3', function () {
    beforeEach(function () {
        cy.visit('https://test.delta-esourcing.com/')

        cy.contains('Login / Register').click()

        cy.login('buyer')
    })

    it ('Evaluate TenderBox responses', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.gotoEvaluateResponses()

        EvalResponsesPage.evalConsensus(0)
    })

    it ('Award contract to supplier', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.gotoEvaluateResponses()

        EvalResponsesPage.awardContract()

        cy.contains('TenderBox: ' + boxName + ' has been awarded to: BiP Solutions').should('exist')
    })

    afterEach(function () {
        cy.logout()
    })
})

// describe('Message Centre', function () {
//     beforeEach(function () {
//         cy.visit('https://test.delta-esourcing.com/')

//         cy.contains('Login / Register').click()

//         cy.login('userguideaccount2@bipsolutions.com', 'Tenders2020')

//         DashboardPage.gotoTenderManager()

//         TenderManagerPage.gotoExistingTender()

//         TenderExercisePage.gotoExistingSQ()

//         SQPage.gotoMessageCentre()
//     })

//     it ('Disable Message with no supplier selected', () => {
//         MessageCentrePage.disableMessages()

//         cy.contains('Please select at least one item before submitting an action')
//     })


//     afterEach(function () {
//         cy.logout()
//     })
// })