/// <reference types="cypress" />

import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/TenderExercisePage";
import * as NoticePage from "../page_objects/NoticePage";
import * as SQPage from "../page_objects/SQPage";
import * as QuestionnairePage from "../page_objects/QuestionnairePage";
import * as EvalPlanPage from "../page_objects/EvalPlanPage";

describe('Login', function() {
    beforeEach(function () {
        cy.visit('https://test.delta-esourcing.com/')

        cy.contains('Login / Register').click()

        cy.get('#username').type('userguideaccount2@bipsolutions.com')
        cy.get('#password').type('Tenders2020')

        cy.contains('Login').click()
    })


    it ('Create Tender Exercise', () => {
        DashboardPage.gotoTenderManager()

        cy.wait(1000)

        TenderManagerPage.gotoCreateTenderExercise()

        // Create Tender Exercise

        cy.get('[name=tenderName]').type('Tender Name')
        cy.get('[name=tenderDescription]').type('Tender Description')

        cy.get('#noticeType').select('ContractNotice')

        cy.get('#pqq_radio_true').check()

        cy.get('[name="tenderBoxType"]').select('ITT')

        cy.get('[name="save"]').click()

        cy.wait(2000)

        // Should be on the Tender Exercise Page

        cy.url().should('include', 'delta/buyers/tenders/viewTenderStatus')
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

        SQPage.initialSQSetUp()

        cy.url().should('include', 'delta/buyers/select/viewListStatus.html')
    })

    it ('Set up custom questionnaire', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingSQ()

        SQPage.gotoCreateQuestionnaire()

        QuestionnairePage.createCustomQuestionnaire()

        cy.url().should('include', 'viewListStatus.html')

        cy.get('#documents-edit_questionnaire span').should('have.class', 'tick')
    })

    it.only ('Set up evaluation plan', () => {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender()

        TenderExercisePage.gotoExistingSQ()

        SQPage.gotoCreateEvalPlan()

        cy.wait(2000)

        EvalPlanPage.createEvalPlan()

        cy.url().should('include', 'viewListStatus.html')

        cy.get('#documents-edit_evaluation_plan span').should('have.class', 'tick')
    })

    afterEach(function () {
        cy.get('#nav_logout').click()

        cy.wait(2000)

        cy.url().should('eq', 'https://test.delta-esourcing.com/')
    })
})