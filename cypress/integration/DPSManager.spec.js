/// <reference types="cypress" />

import * as DashboardPage from "../page_objects/DashboardPage";
import * as DPSManagerPage from "../page_objects/dps_manager/DPSManagerPage";
import * as DPSExercisePage from "../page_objects/dps_manager/DPSExercisePage";
import * as DPSQuestionnairePage from "../page_objects/dps_manager/DPSQuestionnairePage";
import * as QuestionnairePage from "../page_objects/QuestionnairePage";
import * as EvalPlanPage from "../page_objects/EvalPlanPage";
import * as AddSuppliersPage from "../page_objects/AddSuppliersPage";

const dpsName = "testDPSName"
const questionnaireName = "testQuestionnaireName"

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

    it ('Set up DPS Questionnaire', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingQuestionnaire()

        DPSQuestionnairePage.initialQuestionnaireSetUp(questionnaireName)

        cy.url().should('include', 'delta/buyers/select/viewListStatus.html')
    })

    it ('Create custom questionnaire', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingQuestionnaire()

        DPSQuestionnairePage.gotoCreateQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()

        QuestionnairePage.createCustomQuestionnaire()

        cy.url().should('include', 'viewListStatus.html')

        cy.get('#documents-edit_questionnaire span').should('have.class', 'tick')
    })

    it ('Set up evaluation plan', () => {
        DashboardPage.gotoDPSManager()

        DPSManagerPage.gotoExistingDPS()

        DPSExercisePage.gotoExistingQuestionnaire()

        DPSQuestionnairePage.gotoCreateEvalPlan()

        EvalPlanPage.createEvalPlan()

        cy.url().should('include', 'viewListStatus.html')

        cy.get('#documents-edit_evaluation_plan span').should('have.class', 'tick')
    })

    it ('Add suppliers to SQ', () => {
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