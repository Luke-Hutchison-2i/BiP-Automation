import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/tender_manager/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/tender_manager/TenderExercisePage";
import * as TenderBoxPage from "../page_objects/tender_manager/TenderBoxPage";
import * as AddSuppliersPage from "../page_objects/AddSuppliersPage";
import * as QuestionnairePage from "../page_objects/QuestionnairePage";
import * as EvalPlanPage from "../page_objects/EvalPlanPage";
import * as MessageCentrePage from "../page_objects/MessageCentrePage";
import * as ResponseManagerPage from "../page_objects/supplier/ResponseManagerPage"
import * as ResponsePage from "../page_objects/supplier/ResponsePage"

import * as Functions from "../support/functions";


const tenderName = "messageCentreTest"
const boxName = "messageCentreBox"

Functions.GetServer()

describe('Message Centre Buyer', function () {
    before(function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        TenderManagerPage.createTenderExercise(tenderName)

        TenderExercisePage.getExistingTenderBox(0).click()

        TenderBoxPage.initialBoxSetUp(boxName)

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addByEmail()

        TenderBoxPage.gotoCreateNewQuestionnaire()
        
        QuestionnairePage.chooseCustonQuestionnaire()

        QuestionnairePage.createBasicQuestionnaire()

        TenderBoxPage.gotoCreateEvalPlan()

        EvalPlanPage.returnToOverview()
    })

    beforeEach(function() {
        Cypress.Cookies.preserveOnce('JSESSIONID')
        
        cy.visit('/delta/buyers/tenders/listTenders.html')

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.getExistingTenderBox(0).click()

        TenderBoxPage.gotoMessageCentre()
    })

    it ('Send direct message', () => {
        MessageCentrePage.pickSupplier(0)

        MessageCentrePage.sendDirectMessage()

        cy.contains('Emails have been successfully sent to all selected suppliers').should('exist')
    })

    it ('Send direct message with documents', () => {
        MessageCentrePage.pickSupplier(0)

        MessageCentrePage.startDirectMessage()

        MessageCentrePage.enterSubject("Test Subject")

        MessageCentrePage.enterBody("Test Body")

        MessageCentrePage.uploadDoc()

        MessageCentrePage.clickSend()

        cy.contains('Emails have been successfully sent to all selected suppliers').should('exist')
    })

    it ('Send topic', () => {
        MessageCentrePage.startTopic()

        cy.reload()

        cy.contains('Please make sure that there will be no suppliers details on this message. All suppliers will be able to see this message.', {timeout: 10000}).should('exist')

        MessageCentrePage.enterSubject("Test Subject")

        MessageCentrePage.enterBody("Test Body")

        MessageCentrePage.clickSend()

        cy.contains('Message have been successfully sent to All Suppliers').should('exist')
    })

    it ('Invalid input is caught for a direct message', () => {
        MessageCentrePage.pickSupplier(0)

        MessageCentrePage.startDirectMessage()

        MessageCentrePage.clickSend()

        cy.contains('Please enter an email text').should('exist')

        MessageCentrePage.enterBody('Body')

        MessageCentrePage.clickSend()
    })

    it ('Invalid input is caught for a topic', () => {
        MessageCentrePage.pickSupplier(0)

        MessageCentrePage.startTopic()

        MessageCentrePage.clickSend()

        cy.contains('Please enter an email text').should('exist')

        MessageCentrePage.enterBody('Body')

        MessageCentrePage.clickSend()
    })

    it.skip ('Cant send direct without selecting supplier', () => {
        // For some reason the message isn't displaying in Cypress but works manually
        MessageCentrePage.startDirectMessage()
        cy.wait(1000)

        cy.reload()

        cy.contains('Please select at least one item before submitting an action', {timeout: 10000}).should('exist')
    })


    it ('Disable and Enable Message with supplier selected', () => {
        MessageCentrePage.pickSupplier(0)
        
        MessageCentrePage.disableMessages()

        cy.get('#pqqResp').contains('Enable Messages', {timeout: 10000}).should('exist')

        cy.get('[id^="responses-enable_messages_"]').click()

        cy.get('#pqqResp').contains('Enable Messages', {timeout: 10000}).should('not.exist')
    })

    it ('Disable Message with no supplier selected', () => {
        MessageCentrePage.disableMessages()

        cy.reload()

        cy.contains('Please select at least one item before submitting an action', {timeout: 10000}).should('exist')
    })
    

    after(function () {
        cy.logout()
    })
})

describe ('Message Centre Supplier', () => {
    before(function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        TenderManagerPage.createTenderExercise(tenderName)

        TenderExercisePage.getExistingTenderBox(0).click()

        TenderBoxPage.initialBoxSetUp(boxName)

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addByEmail()

        TenderBoxPage.gotoCreateNewQuestionnaire()
        
        QuestionnairePage.chooseCustonQuestionnaire()

        QuestionnairePage.createBasicQuestionnaire()

        TenderBoxPage.gotoCreateEvalPlan()

        EvalPlanPage.createBasicEvalPlan()

        TenderBoxPage.gotoMessageCentre()

        MessageCentrePage.pickSupplier(0)

        MessageCentrePage.startDirectMessage()

        MessageCentrePage.enterSubject("Test Subject")

        MessageCentrePage.enterBody("Test Body")

        MessageCentrePage.uploadDoc()

        MessageCentrePage.clickSend()

        cy.logout()

        cy.then(() => {   
            let waitTime = Functions.GetWaitTime(TenderBoxPage.closeMin, TenderBoxPage.closeHour) - 150000 // Start supplier response with 2.5 mins until closing
            
            if (waitTime > 0) {
                cy.wait(waitTime)
            }
        })

        cy.visit('')

        cy.contains('Log in').click()

        cy.login('supplier')

        DashboardPage.gotoResponsesAndInvites()

        ResponseManagerPage.viewInvite(boxName)

        ResponsePage.acceptInvite()

        // ResponsePage.continueStage2()

        // ResponsePage.completeBasicResponse()

        // ResponsePage.submitResponse()
    })

    beforeEach(function() {
        Cypress.Cookies.preserveOnce('JSESSIONID')
        
        cy.visit('/delta')

        DashboardPage.gotoResponsesAndInvites()

        cy.contains(boxName).click()
        //cy.contains(boxName).parent().find('[name="oneClickRespond"]').click()

        ResponsePage.gotoMessageCentre()
    })

    it ('Can receive message', () => {
        cy.contains('Test Subject').should('exist')

        cy.contains('Test Subject').parent().parent().find('[id^="buttons-enter_message"]').click()

        cy.contains('Test Subject').should('exist')
        cy.contains('Test Body').should('exist')

        // Download file

    })

    it ('Can send message', () => {
        MessageCentrePage.supplierEnterSubject("Supplier Subject")

        MessageCentrePage.enterBody("Supplier Body")

        MessageCentrePage.uploadDoc()

        MessageCentrePage.supplierSendMessage()

        cy.contains('Email has been successfully sent to buyer').should('exist')

        // Check if buyer has received message
        cy.logout()
        cy.visit('')
        cy.contains('Log in').click()
        cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.getExistingTenderBox(0).click()

        TenderBoxPage.gotoMessageCentre()

        cy.contains('Supplier Subject').should('exist')
        
        cy.contains('Supplier Subject').parent().find('[id^="buttons-enter_message"]').click()

        cy.contains('Supplier Subject').should('exist')
        cy.contains('Supplier Body').should('exist')
    })


    after(function () {
        cy.logout()
    })
})