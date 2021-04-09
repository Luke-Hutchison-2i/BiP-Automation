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
import * as TenderBoxPage from "../page_objects/tender_manager/TenderBoxPage";
import * as ResponseManagerPage from "../page_objects/supplier/ResponseManagerPage"
import * as ResponsePage from "../page_objects/supplier/ResponsePage"
import * as Functions from "../support/functions"


// Register

// OJEU Notice
// Competitive Contract Notice

// Tenderbox - Create, Questionnaire, Invite, Supplier, Evalutate, Award

// Message Centre - Open messages, download attachments

// Questionnaire - Create custom, add and remove questions

// Tenderbox with no eval plan

const tenderName = "smokeTender"
const boxName = "smokeBox"

const messageSubject = "Smoke Test"
const messageBody = "This is the body"

Functions.GetServer()

describe ('Smoke Test', function () {
    beforeEach (function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')
    })

    if (Cypress.env('live') === false) {
        it ('Publish Competitive Contract Notice', function () {
            DashboardPage.gotoTenderManager()

            TenderManagerPage.gotoCreateTenderExercise()
    
            TenderManagerPage.createTenderExercise(tenderName)

            TenderExercisePage.gotoCreateNotice()

            NoticePage.createCompetitiveNotice()
        })
    }

    if (Cypress.env('live') === false) {
        it.skip ('Publish OJEU Notice', function () {
            DashboardPage.gotoTenderManager()

            TenderManagerPage.gotoCreateTenderExercise()
    
            TenderManagerPage.createTenderExercise(tenderName)

            TenderExercisePage.gotoExistingNotice()

            NoticePage.createContractNotice()
        })
    }

    it ('Complete and award Tenderbox', function () {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        TenderManagerPage.createTenderExercise(tenderName)

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.initialBoxSetUp(boxName)

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.importExistingQuestionnaire('Smoke')

        cy.get('[id^="page-name-link-"').should('have.length', 2) // Should have 2 sections

        // Add document to price document upload
        QuestionnairePage.viewSection(1)

        cy.get('#body-edit_question').click()
        cy.wait(500)

        QuestionnairePage.setPriceDocumentUpload()

        QuestionnairePage.returnToOverview()

        TenderBoxPage.gotoCreateEvalPlan()

        EvalPlanPage.createSmokeEvalPlan()

        EvalPlanPage.returnToOverview()

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addByEmail()

        cy.logout()
        cy.clearCookies()

        //#region Supplier
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

        ResponsePage.continueStage2()

        ResponsePage.completeSmokeResponse()

        ResponsePage.submitResponse()

        // Message buyer
        ResponsePage.gotoMessageCentre()

        MessageCentrePage.supplierEnterSubject(messageSubject)

        MessageCentrePage.supplierEnterMessage(messageBody)

        MessageCentrePage.supplierUploadDoc()

        MessageCentrePage.supplierSendMessage()

        cy.contains('Email has been successfully sent to buyer').should('exist')

        cy.logout()
        cy.clearCookies()

        cy.then(() => {   
            let waitTime = Functions.GetWaitTime(TenderBoxPage.closeMin, TenderBoxPage.closeHour)
            
            if (waitTime > 0) {
                cy.wait(waitTime)
            }
        })

        //#endregion

        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.gotoEvaluateResponses()

        EvalResponsesPage.gotoOverviewPage()

        EvalResponsesPage.startSideBySideEval()
        EvalResponsesPage.smokeSideBySide()
        EvalResponsesPage.finishSideBySideEval()

        //cy.contains('Not started').should('exist')

        EvalResponsesPage.startConsensusEval()
        EvalResponsesPage.smokeConsensus()
        EvalResponsesPage.finishConsensusEval()

        //cy.contains('Completed').should('exist')
        // Check overview page looks correct as well

        // Download files
        EvalResponsesPage.gotoOverviewPage()

        let url;

        cy.url().then(oldurl => {
            url = oldurl
        })
        
        cy.intercept({
            pathname: '/delta/buyers/select/viewSupplierResponsesTeamEval.html',
        }, (req) => {
            req.redirect(url)
        }).as('records')

        cy.intercept({
            pathname: '/delta/buyers/tenderbox/response/question/documents/zipAllDocumentsInList.html',
        }, (req) => {
            req.redirect(url)
        }).as('docs')



        cy.get('#buttons-download_responses').click()
        cy.wait('@records').its('request').then((req) => {
            cy.request({method: 'POST', url: req.url, body: req.body, headers: req.headers, encoding: 'binary'})
            .then(({ body, headers }) => {
                expect(headers).to.have.property('content-type', 'application/vnd.ms-excel;charset=UTF-8')
                cy.writeFile('cypress/downloads/Scorecard Report.xls', body, 'binary')
            })
        })

        cy.get('input[name="downloadResponsesReport"]').click()
        cy.wait('@records').its('request').then((req) => {
            cy.request({method: 'POST', url: req.url, body: req.body, headers: req.headers, encoding: 'binary'})
            .then(({ body, headers }) => {
                expect(headers).to.have.property('content-type', 'application/vnd.ms-excel;charset=UTF-8')
                cy.writeFile('cypress/downloads/Response Report.xls', body, 'binary')
            })
        })

        cy.get('input[name="downloadAllDocuments"]').click()
        cy.wait('@docs').its('request').then((req) => {
            cy.request({method: 'POST', url: req.url, body: req.body, headers: req.headers, encoding: 'binary'})
            .then(({ body, headers }) => {
                expect(headers).to.have.property('content-type', 'application/zip;charset=UTF-8')
                cy.writeFile('cypress/downloads/docs.zip', body, 'binary')
            })
        })

        EvalResponsesPage.awardContract()

        cy.contains('TenderBox: ' + boxName + ' has been awarded to: ').should('exist')
    })

    it ('Buyer Message Centre', function () {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.gotoMessageCentre()

        cy.get('[id^="buttons-enter_message_"]').should('have.length', 1)

        cy.get('[id^="buttons-enter_message_"]').click()

        cy.contains(messageSubject).should('exist') // Subject
        cy.contains(messageSubject).should('exist') // Body

        cy.get('[id^="messages-download_document_"]').invoke('attr', 'href').then((href) => {
            cy.request({
                method: 'GET',
                url: Cypress.config().baseUrl + '/delta/' + href,
                encoding: 'binary'
            }).then((res) => {
                expect(res.headers).to.have.property('content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=UTF-8')
                cy.writeFile('cypress/downloads/MessageCentre.docx', res.body, 'binary')
            })
        })
    })

    it ('Questionnaire Builder', function () {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        TenderManagerPage.createTenderExercise(tenderName)

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.initialBoxSetUp(boxName)

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()

        // Test add and remove different questionnaire parts
        QuestionnairePage.createQuestion(0, 'Can you do this?', 'Yes you can', 'yesNo', true)
        QuestionnairePage.createSubSection()
        QuestionnairePage.createSection()

        cy.get('#page_table tbody tr').eq(1).find('#sidebar-remove_section').click()
        cy.reload()

        cy.get('#section_table > tbody > tr').eq(1).find('#body-remove_subsection').click()
        cy.reload()
        
        cy.get('#table_anchor_1').find('#body-remove_question').click()
        cy.reload()
    })

    afterEach (function () {
        cy.logout()

        cy.clearCookies()
    })
})
