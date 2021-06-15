import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/tender_manager/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/tender_manager/TenderExercisePage";
import * as TenderBoxPage from "../page_objects/tender_manager/TenderBoxPage";
import * as QuestionnairePage from "../page_objects/QuestionnairePage";
import * as EvalPlanPage from "../page_objects/EvalPlanPage";
import * as AddSuppliersPage from "../page_objects/AddSuppliersPage";
import * as ResponseManagerPage from "../page_objects/supplier/ResponseManagerPage"
import * as ResponsePage from "../page_objects/supplier/ResponsePage"
import * as Functions from "../support/functions"

const tenderNameRM = "suppTenderRM"
const boxNameRM = "suppBoxRM"

const tenderNameResp = "suppTenderResp"
const boxNameResp = "suppBoxResp"

describe ('Response Manager', function () {
    before (function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        TenderManagerPage.createTenderExercise(tenderNameRM)

        TenderExercisePage.getExistingTenderBox(0).click()

        TenderBoxPage.initialBoxSetUp(boxNameRM, 0, 10)

        // Get Access Code for later test
        TenderBoxPage.getAccessCode()

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addByEmail()

        TenderBoxPage.gotoCreateNewQuestionnaire()
        
        QuestionnairePage.chooseCustonQuestionnaire()

        QuestionnairePage.createBasicQuestionnaire()

        TenderBoxPage.gotoCreateEvalPlan()

        EvalPlanPage.createBasicEvalPlan()

        cy.logout()

        cy.clearCookies()

        cy.then(() => {
            let waitTime = Functions.GetWaitTime(TenderBoxPage.openMin, TenderBoxPage.openHour) + 150000 // Start supplier response with 2.5 mins until closing
            
            if (waitTime > 0) {
                cy.wait(waitTime)
            }
        })

        cy.visit('')

        cy.contains('Log in').click()
        cy.login('supplier')
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce('JSESSIONID')

        cy.visit('/delta/suppliers/select/addToList.html')
    })

    it ('Can see invite and start response', () => {
        cy.get('#list').contains(boxNameRM).should('exist')

        ResponseManagerPage.viewInvite(boxNameRM)
        
        cy.url().should('include', '/supplierResponseList.html')

        cy.get('#information').contains('Open').should('exist')
    })

    it ('Can use Access Code to start response', () => {
        ResponseManagerPage.getAccessCode().type(TenderBoxPage.accessCode)

        ResponseManagerPage.submitAccessCode()

        cy.url().should('include', '/supplierResponseList.html')

        cy.get('#information').contains('Open').should('exist')
    })

    it ('Can view past responses', () => {
        cy.get('#responses').should('exist')
        cy.get('#responses thead').contains('Opportunity').should('exist')
        cy.get('#responses thead').contains('Opportunity Type').should('exist')
        cy.get('#responses thead').contains('Submitted').should('exist')
        cy.get('#responses thead').contains('Submitted').should('exist')
        cy.get('#responses thead').contains('Submitted').should('exist')
        cy.get('#responses thead').contains('Submitted').should('exist')
        cy.get('#responses thead').contains('Submitted').should('exist')

        ResponseManagerPage.viewInvite(boxNameRM)

        ResponsePage.acceptInvite()

        cy.visit('/delta/suppliers/select/addToList.html')

        ResponseManagerPage.getPastInvite(boxNameRM).should('exist').click()

        cy.url().should('include', '/suppRespStatus.html')
    })

    after (function () {
        cy.logout()
    })
})

describe ('Response', function () {
    before (function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        TenderManagerPage.createTenderExercise(tenderNameResp)

        TenderExercisePage.getExistingTenderBox(0).click()

        TenderBoxPage.initialBoxSetUp(boxNameResp, 0, 10)

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addByEmail()

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addByEmail('auto-testing-supplier-1@bipsolutions.com')

        TenderBoxPage.gotoCreateNewQuestionnaire()
        
        QuestionnairePage.chooseCustonQuestionnaire()

        QuestionnairePage.createBasicQuestionnaire()

        TenderBoxPage.gotoCreateEvalPlan()

        EvalPlanPage.createBasicEvalPlan()

        cy.logout()

        cy.clearCookies()

        cy.then(() => {
            let waitTime = Functions.GetWaitTime(TenderBoxPage.openMin, TenderBoxPage.openHour) + 150000 // Start supplier response with 2.5 mins until closing
            
            if (waitTime > 0) {
                cy.wait(waitTime)
            }
        })
    })

    it ('Can accept and submit a response', () => {
        cy.visit('')
        cy.contains('Log in').click()
        cy.login('supplier')

        DashboardPage.gotoResponsesAndInvites()

        ResponseManagerPage.viewInvite(boxNameResp)

        cy.get('[name="respondButton"]').should('exist')
        cy.get('[name="reject"]').should('exist')
        cy.get('[name="cancel"]').should('exist')

        ResponsePage.acceptInvite()

        cy.get('#buttons-message_centre').should('exist')

        ResponsePage.continueStage2()

        cy.get('#buttons-message_centre').should('exist')

        ResponsePage.getProceedStage3().should('be.disabled')

        // Fill in response
        cy.get('#yes0').check()

        cy.get('#mytext').type('I can do this because I can.')

        ResponsePage.saveAndContinue()

        ResponsePage.getProceedStage3().should('be.disabled')

        cy.get('#responses\\[2\\]\\.selections\\[0\\]\\.selected').check()

        ResponsePage.saveAnswers()

        ResponsePage.getProceedStage3().should('be.enabled').click()

        cy.get('#buttons-message_centre').should('exist')

        ResponsePage.submitResponse()

        cy.visit('/delta/suppliers/select/addToList.html')

        cy.get('#responses').contains(boxNameResp).should('exist').parent().parent().contains('Yes').should('exist')
    })

    it ('Can withdraw a response', () => {
        cy.visit('')
        cy.contains('Log in').click()
        cy.loginExtra('auto-testing-supplier-1@bipsolutions.com', 'Password123')

        DashboardPage.gotoResponsesAndInvites()

        ResponseManagerPage.viewInvite(boxNameResp)

        cy.get('[name="respondButton"]').should('exist')
        cy.get('[name="reject"]').should('exist')
        cy.get('[name="cancel"]').should('exist')

        ResponsePage.acceptInvite()

        ResponsePage.continueStage2()

        // Do response
        // Fill in response
        cy.get('#yes0').check()

        cy.get('#mytext').type('I can do this because I can.')

        ResponsePage.saveAndContinue()

        //cy.get('#responses\\[2\\]\\.selections\\[0\\]\\.selected').check()

        ResponsePage.saveAndContinue()

        cy.contains('You must complete the sections marked with a red cross before submitting your response.').should('exist')

        cy.get('#tabs-stage_2').click()

        ResponsePage.saveAndContinue()

        cy.get('#responses\\[2\\]\\.selections\\[0\\]\\.selected').check()

        ResponsePage.saveAndContinue()

        ResponsePage.submitResponse()

        ResponsePage.withdrawResponse()
    })

    afterEach (function () {
        cy.logout()
        cy.clearCookies()
    })
})