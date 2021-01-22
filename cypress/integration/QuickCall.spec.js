import * as DashboardPage from "../page_objects/DashboardPage";
import * as QuickCallManagerPage from "../page_objects/quick_call/QuickCallManagerPage";
import * as QuickCallStagesPage from "../page_objects/quick_call/QuickCallStagesPage";

const callName = "testQuickCallName"

describe('Quick Call - Stages 1-4', function() {
    beforeEach(function () {
        cy.visit('https://test.delta-esourcing.com/')
        //cy.visit()
        cy.contains('Login / Register').click()

        cy.login('buyer')

        DashboardPage.gotoQuickCall()
    })

    it ('Complete Stage 1', () => {
        QuickCallManagerPage.gotoCreateQuickCall()

        QuickCallStagesPage.completeStage1(callName)

        QuickCallStagesPage.saveAndContinue()
    })

    it ('Complete Stage 2', () => {
        QuickCallManagerPage.gotoExistingQuickCall()

        QuickCallStagesPage.gotoStage(2)

        QuickCallStagesPage.completeStage2()

        QuickCallStagesPage.saveAndContinue()
    })

    it.only ('Complete Stage 3', () => {
        QuickCallManagerPage.gotoExistingQuickCall()

        QuickCallStagesPage.gotoStage(3)

        QuickCallStagesPage.completeStage3()

        QuickCallStagesPage.saveAndContinue()
    })

    it ('Complete Stage 4', () => {
        QuickCallManagerPage.gotoExistingQuickCall()

        QuickCallStagesPage.gotoStage(4)

        QuickCallStagesPage.completeStage4()

        QuickCallStagesPage.saveAndContinue()
    })

    afterEach(function () {
        cy.logout()
    })

})

describe('Quick Call - Supplier', function() {
    before(function () {
        cy.visit('https://test.delta-esourcing.com/')
        //cy.visit()
        cy.contains('Login / Register').click()

        cy.login('supplier')
    })

    it ('Supplier response', () => {
        
    })

    afterEach(function () {
        cy.logout()
    })

})

describe('Quick Call - Stages 5-7', function() {
    before(function () {
        cy.visit('https://test.delta-esourcing.com/')
        //cy.visit()
        cy.contains('Login / Register').click()

        cy.login('buyer')
    })

    it ('Complete Stage 5', () => {
        QuickCallManagerPage.gotoExistingQuickCall()

        QuickCallStagesPage.gotoStage(5)

        QuickCallStagesPage.completeStage5()

        QuickCallStagesPage.saveAndContinue()
    })

    it ('Complete Stage 6', () => {
        QuickCallManagerPage.gotoExistingQuickCall()

        QuickCallStagesPage.gotoStage(6)

        QuickCallStagesPage.completeStage6()

        QuickCallStagesPage.saveAndContinue()
    })

    it ('Complete Stage 7', () => {
        QuickCallManagerPage.gotoExistingQuickCall()

        QuickCallStagesPage.gotoStage(7)

        QuickCallStagesPage.completeStage7()

        QuickCallStagesPage.saveAndContinue()
    })

    afterEach(function () {
        cy.logout()
    })

})