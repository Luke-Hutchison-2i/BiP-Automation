/// <reference types="cypress" />

import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/tender_manager/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/tender_manager/TenderExercisePage";
import * as NoticePage from "../page_objects/NoticePage";
import * as QuestionnairePage from "../page_objects/QuestionnairePage";
import * as AddSuppliersPage from "../page_objects/AddSuppliersPage";
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

const tenderName = "smokeTender2"
const boxName = "smokeBox2"

Functions.GetServer()

describe ('Smoke Tests 2', function () {
    beforeEach (function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')
    })

    it ('Tenderbox with no eval plan', function () {
        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        TenderManagerPage.createTenderExercise(tenderName)

        TenderExercisePage.gotoExistingTenderBox()

        TenderBoxPage.initialBoxSetUp(boxName)

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.importExistingQuestionnaire('Smoke')

        cy.get('[id^="page-name-link-"').should('have.length', 2)

        // Add document to price document upload
        //QuestionnairePage.viewSection(2)
        cy.get('[id^="page-name-link-"').eq(1).click()
        cy.wait(1000)

        cy.get('#body-edit_question').click()
        cy.wait(500)

        QuestionnairePage.setPriceDocumentUpload()

        QuestionnairePage.returnToOverview()

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

        // Upload doc here

        ResponsePage.continueStage2()

        ResponsePage.completeSmokeResponse()

        ResponsePage.submitResponse()

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

        cy.contains('View Responses').should('exist')
        cy.get('#documents-edit_evaluation_plan span').should('have.class', 'cross')

        TenderBoxPage.gotoEvaluateResponses()

        cy.get('#tabs-overview').should('not.exist')

        cy.get('[id^="responses-view_"]').eq(0).click()

        EvalResponsesPage.responseNextPage()

        cy.get('[id^="documents-download_"]').eq(2).invoke('attr', 'href').then((href) => {
            //cy.downloadFile(Cypress.config().baseUrl + href, 'cypress/downloads', 'DocUploadFile.docx')
            cy.request({
                method: 'GET',
                url: Cypress.config().baseUrl + href,
                encoding: 'binary'
            }).then((res) => {
                //expect(res.headers).to.have.property('content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=UTF-8')
                cy.writeFile('cypress/downloads/SupplierResponse.docx', res.body, 'binary')
            })
        })

        EvalResponsesPage.responseDownloadDocs()
    })

    //if (Cypress.env('live') === false) {
        it ('Publish Competitive Contract Notice', function () {
            DashboardPage.gotoTenderManager()

            TenderManagerPage.gotoCreateTenderExercise()
    
            TenderManagerPage.createTenderExercise(tenderName)

            TenderExercisePage.gotoCreateNotice()

            NoticePage.createCompetitiveNotice()
        })
    //}

    //if (Cypress.env('live') === false) {
        it ('Publish OJEU Notice', function () {
            DashboardPage.gotoTenderManager()

            TenderManagerPage.gotoCreateTenderExercise()
    
            TenderManagerPage.createTenderExercise(tenderName)

            TenderExercisePage.gotoExistingNotice()

            NoticePage.createContractNotice()
        })
    //}

    afterEach (function () {
        cy.logout()

        cy.clearCookies()
    })
})