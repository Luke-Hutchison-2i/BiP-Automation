/// <reference types="cypress" />

import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/tender_manager/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/tender_manager/TenderExercisePage";
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

    afterEach (function () {
        cy.logout()

        cy.clearCookies()
    })

})

describe.skip ('Registration Tests', function () {
    beforeEach(function () {
        cy.visit('')

        cy.contains('Register').click()
    })

    it ('Register as Supplier', function () {
        const stamp = Cypress.dayjs().valueOf()
        let username = 'supplier.smoketest.' + stamp +'@bipsolutions.com'
        let password = 'Password123'

        cy.contains('Register as a Supplier').click()

        cy.get('#title').select('Dr')
        cy.get('#firstName').type('New')
        cy.get('#lastName').type('Supplier')
        cy.get('#position').type('Tester')
        cy.get('#email').type(username)
        cy.get('#confirmEmail').type(username)
        cy.get('#password').type(password)
        cy.get('#confirmPassword').type(password)

        cy.get('#bisname').eq(0).type('Best Testers EU')
        cy.get('#org\\.address1').type('123 Fake Street')
        cy.get('#org\\.town').type('Glasgow')
        cy.get('#org\\.postcode').type('DD4 5PW')
        cy.get('[name="orgProfile\\.spResponse\\.responses\\[2\\]\\.responseText"]').type('besttesterseu.co.uk') // Website
        cy.get('[name="orgProfile\\.spResponse\\.responses\\[3\\]\\.responseText"]').type('0141 123 4567') // Phone Number
        cy.get('#sector').select('Aerospace and airports')
        cy.get('[name="orgProfile\\.spResponse\\.responses\\[7\\]\\.responseText"]').type('Testing things to test they work')

        cy.get('#organisationType').select('Limited Company')
        cy.get('#employees').select('50 - 99')
        cy.get('#turnover').select('£400m +')
        cy.get('[name="organisationProfileMetaData\\.howDidYouHear"]').select('Social Media')

        cy.get('iframe').then((iframe) => {
            const body = iframe.contents()
            cy.wrap(body).find('.recaptcha-checkbox-border').click()
        })

        cy.get('#acceptTsAndCs').check()

        cy.wait(2000)

        cy.get('#form_submit').click()

        cy.url().should('contain', '/signup/signupConfirmation.html?userType=supplier')
        cy.contains('Confirmation').should('exist')

        cy.contains('Log in').click()

        cy.get('#username').type(username)
        cy.get('#password').type(password)
        cy.contains('Login').click()

        cy.url().should('contain', '/delta/mainMenu.html')
    })

    it ('Register as Buyer', function () {
        const stamp = Cypress.dayjs().valueOf()
        let username = 'buyer.smoketest.' + stamp +'@bipsolutions.com'
        let password = 'Password123'

        cy.contains('Register as a Buyer').click()

        cy.get('#title').select('Dr')
        cy.get('#firstName').type('New')
        cy.get('#lastName').type('Buyer')
        cy.get('#position').type('Tester')
        cy.get('#email').type(username)
        cy.get('#confirmEmail').type(username)
        cy.get('#password').type(password)
        cy.get('#confirmPassword').type(password)

        cy.get('#bisname').eq(0).type('Best Testers EU')
        cy.get('#org\\.address1').type('123 Fake Street')
        cy.get('#org\\.town').type('Glasgow')
        cy.get('#org\\.postcode').type('DD4 5PW')
        cy.get('[name="orgProfile\\.spResponse\\.responses\\[3\\]\\.responseText"]').type('besttesterseu.co.uk') // Website
        cy.get('[name="orgProfile\\.spResponse\\.responses\\[2\\]\\.responseText"]').type('0141 123 4567') // Phone Number
        cy.get('#sector').select('Central Government')

        cy.get('#organisationType').select('Limited Company')

        cy.get('iframe').then((iframe) => {
            const body = iframe.contents()
            cy.wrap(body).find('.recaptcha-checkbox-border').click()
        })

        cy.get('#acceptTsAndCs').check()

        cy.wait(2000)

        cy.get('#form_submit').click()

        cy.url().should('contain', '/signup/signupConfirmation.html?userType=buyer')
        cy.contains('Buyer Sign Up Confirmation').should('exist')

        // Login as Admin
        cy.contains('Log in').click()
        cy.get('#username').type('andrew.mackenzie2@admin.bipsolutions.co.uk')

        // Check if on live, passwords are different
        cy.get('#password').type('Password123')
        cy.contains('Login').click()

        cy.contains('Pending Users').click()

        cy.contains(username).click()

        cy.get('#enabled').click()

        cy.contains('Update User').click()

        cy.contains('Logout').click()

        // Login as new buyer account
        cy.contains('Log in').click()
        cy.get('#username').type(username)
        cy.get('#password').type(password)
        cy.contains('Login').click()

        cy.url().should('contain', '/delta/mainMenu.html')
    })

    afterEach(function () {
        cy.clearCookies()
    })
})