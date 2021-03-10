import * as DashboardPage from "../page_objects/DashboardPage";
import * as QuickCallManagerPage from "../page_objects/quick_call/QuickCallManagerPage";
import * as QuickCallStagesPage from "../page_objects/quick_call/QuickCallStagesPage";
import * as Functions from "../support/functions"


const callName = "testQuickCallName"

Functions.GetServer()

describe('Quick Call - Stages 1-4', function() {
    beforeEach(function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')

        DashboardPage.gotoQuickCall()
    })

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

    afterEach(function () {
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
        cy.get('#modules-responses_and_invites').click()

        cy.contains(callName).parent().find('[name="oneClickRespond"]').click()

        cy.get('#respondButton').click() // Accept invitation

        // Step 1
        cy.contains('Continue to Stage Two').click()

        // Step 2
        cy.get('[name="responses\\[0\\]\\.currency"]').type('10000')

        cy.get('[name="submitResponse"]').eq(1).click()   
        //cy.get('#confirmSubmit').eq(1).click()
        //cy.contains('Save and Proceed to Stage 3').click()

        // Step 3
        cy.get('[name="confirmSubmit"]').click()

        cy.contains('Response Successfully Submitted').should('exist')
    })

    afterEach(function () {
        cy.logout()

        cy.clearCookies()
    })

    after(function() {
        const min = parseInt(Cypress.moment().format('m'));
        const hour = parseInt(Cypress.moment().format('H'));

        var curTime = (hour * 60) + min;

        const callCloseMin = QuickCallStagesPage.closeMin;
        const callCloseHour = QuickCallStagesPage.closeHour;

        var closeTime = (callCloseHour * 60) + callCloseMin;

        const waitTime = (closeTime - curTime) * 60 * 1000

        cy.log(closeTime)
        cy.log(curTime)
        cy.log(waitTime)

        if (waitTime > 0) {
            cy.wait(waitTime)
        }
    })

})

describe('Quick Call - Stages 5-7', function() {
    // before(function () {
    //     cy.visit('')
    //     //cy.visit()
    //     cy.contains('Login / Register').click()

    //     cy.login('buyer')

    //     DashboardPage.gotoQuickCall()
    // })

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

    afterEach(function () {
        cy.logout()
    })

})