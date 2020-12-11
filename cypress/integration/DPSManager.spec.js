/// <reference types="cypress" />

import * as DashboardPage from "../page_objects/DashboardPage";
import * as DPSManagerPage from "../page_objects/dps_manager/DPSManagerPage";
import * as DPSExercisePage from "../page_objects/dps_manager/DPSExercisePage";
import * as DPSQuestionnairePage from "../page_objects/dps_manager/DPSQuestionnairePage";

const dpsName = "testDPSName"
const questionnaireName = "testQuestionnaireName"

describe ('Tender Manager - Stage 1', function() {
    beforeEach(function () {
        cy.visit('https://test.delta-esourcing.com/')

        cy.contains('Login / Register').click()

        cy.login('userguideaccount3@bipsolutions.com', 'Tenders2020')
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

        DPSExercisePage.gotoCreateQuestionnaire()

        DPSQuestionnairePage.initialQuestionnaireSetUp(questionnaireName)

        cy.url().should('include', 'delta/buyers/select/viewListStatus.html')
    })

    afterEach(function () {
        cy.logout()
    })
})