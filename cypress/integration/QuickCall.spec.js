import * as DashboardPage from "../page_objects/DashboardPage";
import * as QuickCallManagerPage from "../page_objects/quick_call/QuickCallManagerPage";
import * as QuickCallStagesPage from "../page_objects/quick_call/QuickCallStagesPage";
import * as ResponseManagerPage from "../page_objects/supplier/ResponseManagerPage"
import * as ResponsePage from "../page_objects/supplier/ResponsePage"
import * as Functions from "../support/functions"


const callName = "testQuickCallName"

Functions.GetServer()

describe('Quick Call - Stages 1-4', function() {
    before (function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce('JSESSIONID')

        cy.visit('/delta')

        DashboardPage.gotoQuickCall()
    })

    // beforeEach(function () {
    //     cy.visit('')

    //     cy.contains('Log in').click()

    //     cy.login('buyer')

    //     DashboardPage.gotoQuickCall()
    // })

    it ('Complete Stage 1', () => {
        QuickCallManagerPage.gotoCreateQuickCall()

        QuickCallStagesPage.completeStage1(callName)

        cy.contains('Upload was successful').should('exist')
        cy.contains('DocUploadFile.docx').should('exist')

        QuickCallStagesPage.saveAndContinue()
    })

    it ('Complete Stage 2', () => {
        QuickCallManagerPage.gotoExistingQuickCall()

        QuickCallStagesPage.gotoStage(2)

        QuickCallStagesPage.completeStage2()

        QuickCallStagesPage.saveAndContinue()
    })

    it ('Complete Stage 3', () => {
        QuickCallManagerPage.gotoExistingQuickCall()

        QuickCallStagesPage.gotoStage(3)

        QuickCallStagesPage.completeStage3()

        QuickCallStagesPage.saveAndContinue()

        cy.contains('Invite emails will be sent to the following suppliers/users; demosupplieracccount@bipsolutions.com').should('exist')
   
    })

    it ('Complete Stage 4', () => {
        QuickCallManagerPage.gotoExistingQuickCall()

        QuickCallStagesPage.gotoStage(4)

        QuickCallStagesPage.completeStage4()

        QuickCallStagesPage.saveAndContinue()

        cy.contains('You have now created your Quick Call, which has been sent to your suppliers. You can send an email to all suppliers; however, you are not required to do anything further at this time.').should('exist')
    })

    // afterEach(function () {
    //     cy.logout()

    //     cy.clearCookies()
    // })

    after (function () {
        cy.logout()

        cy.clearCookies()
    })

})

describe('Quick Call - Supplier', function() {
    before(function () {
        cy.visit('')
    
        cy.contains('Log in').click()

        cy.login('supplier')
    })

    it ('Supplier response', () => {
        DashboardPage.gotoResponsesAndInvites()

        ResponseManagerPage.viewInvite(callName)

        ResponsePage.acceptInvite()

        // Step 1
        ResponsePage.continueStage2()

        // Step 2
        ResponsePage.completeQuickCallResponse()

        // Step 3
        ResponsePage.submitResponse()

        cy.logout()

        cy.clearCookies()
    })

    after(function() {
        let waitTime = Functions.GetWaitTime(QuickCallStagesPage.closeMin, QuickCallStagesPage.closeHour)

        if (waitTime > 0) {
            cy.wait(waitTime)
        }
    })

})

describe('Quick Call - Stages 5-7', function() {

    beforeEach(function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')

        DashboardPage.gotoQuickCall()
    })

    it ('Complete Stages 5, 6, and 7', () => {
        QuickCallManagerPage.gotoExistingQuickCall()

        cy.url().should('include', 'Page=page5ViewResponses')

        QuickCallStagesPage.completeStage5()

        QuickCallStagesPage.completeStage6()

        QuickCallStagesPage.completeStage7()

        cy.contains('Quick Call: testQuickCallName has been awarded to BiP Solutions').should('exist')
    })

    // it.skip ('Complete Stage 6', () => {
    //     QuickCallManagerPage.gotoExistingQuickCall()

    //     QuickCallStagesPage.gotoStage(6)

    //     QuickCallStagesPage.completeStage6()

    //     QuickCallStagesPage.saveAndContinue()
    // })

    // it.skip ('Complete Stage 7', () => {
    //     QuickCallManagerPage.gotoExistingQuickCall()

    //     QuickCallStagesPage.gotoStage(7)

    //     QuickCallStagesPage.completeStage7()

    //     QuickCallStagesPage.saveAndContinue()
    // })

    // afterEach(function () {
    //     cy.logout()
    // })

    after (function () {
        cy.logout()

        cy.clearCookies()
    })

})