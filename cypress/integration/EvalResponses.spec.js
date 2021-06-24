import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/tender_manager/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/tender_manager/TenderExercisePage";
import * as TenderBoxPage from "../page_objects/tender_manager/TenderBoxPage";
import * as QuestionnairePage from "../page_objects/QuestionnairePage";
import * as EvalPlanPage from "../page_objects/EvalPlanPage";
import * as AddSuppliersPage from "../page_objects/AddSuppliersPage";
import * as EvalResponsesPage from "../page_objects/EvalResponsesPage";
import * as ResponseManagerPage from "../page_objects/supplier/ResponseManagerPage"
import * as ResponsePage from "../page_objects/supplier/ResponsePage"
import * as Functions from "../support/functions"


const tenderName = "evalResponsesTest"
const boxName = "evalResponsesTest"

Functions.GetServer()

describe ('Evaluate Responses', function () {
    before(function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        TenderManagerPage.createTenderExercise(tenderName)

        TenderExercisePage.getExistingTenderBox(0).click()

        TenderBoxPage.initialBoxSetUp(boxName)

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()

        QuestionnairePage.createSmokeQuestionnaire()

        TenderBoxPage.gotoCreateEvalPlan()

        EvalPlanPage.createSmokeEvalPlan()

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addByEmail()

        TenderBoxPage.gotoAddSuppliers()

        //AddSuppliersPage.addByEmail('auto-testing-supplier-1@bipsolutions.com')
        AddSuppliersPage.addByEmail('test.supplier.t001@bipsolutions.com')

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

        cy.logout()
        cy.clearCookies()


        // 2nd supplier
        cy.visit('')

        cy.contains('Log in').click()

        //cy.loginExtra('auto-testing-supplier-1@bipsolutions.com', 'Password123')
        cy.loginExtra('test.supplier.t001@bipsolutions.com', 'Password123')

        DashboardPage.gotoResponsesAndInvites()

        ResponseManagerPage.viewInvite(boxName)

        ResponsePage.acceptInvite()

        ResponsePage.continueStage2()

        ResponsePage.completeSmokeResponse()

        ResponsePage.submitResponse()

        cy.logout()
        cy.clearCookies()

        //#endregion
        
        cy.then(() => {   
            let waitTime = Functions.GetWaitTime(TenderBoxPage.closeMin, TenderBoxPage.closeHour)
            
            if (waitTime > 0) {
                cy.wait(waitTime)
            }
        })

        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce('JSESSIONID')
        
        cy.visit('/delta/buyers/tenders/listTenders.html')

        TenderManagerPage.gotoExistingTender(tenderName)

        TenderExercisePage.getExistingTenderBox(0).click()

        TenderBoxPage.gotoEvaluateResponses()
    })

    it ('Complete evaluator evaluation', () => {
        EvalResponsesPage.startBuyerResponse(1)

        EvalResponsesPage.getQuestion(0).select('4')
        EvalResponsesPage.getQuestion(1).select('4')

        EvalResponsesPage.responseNextPage()

        cy.get('select[name^="score"]').should('not.exist')
        //EvalResponsesPage.getQuestion(0).should('not.exist') // For some reason Cypress doesn't like this, it fails trying to find it

        EvalResponsesPage.finishBuyerResponse()

        cy.get('#pqqResp tbody').find('[id^=responses-evaluate_]').eq(1).should('contain.text', 'Completed')
    })

    it ('Complete side by side evaluation', () => {
        EvalResponsesPage.gotoOverviewTab()

        EvalResponsesPage.checkboxSupplier(0)

        EvalResponsesPage.startSideBySideEval()

        EvalResponsesPage.sxsStartEvalQuestion(0)
    
        EvalResponsesPage.sxsGetQuestionScore().select('10')
    
        EvalResponsesPage.sxsSaveQuestionScore()

        EvalResponsesPage.sxsStartEvalQuestion(1)
    
        EvalResponsesPage.sxsGetQuestionScore().select('5')
    
        EvalResponsesPage.sxsSaveQuestionScore()
    
        EvalResponsesPage.sxsGetCompleteBox().should('be.enabled')
    
        EvalResponsesPage.finishSideBySideEval()

        cy.get('#pqqResp tbody').find('[id^=responses-evaluate_]').eq(0).should('contain.text', 'Completed')
    })

    it ('Complete consensus evaluation', () => {
        cy.get('#pqqResp tbody').find('[id^=responses-consensus_]').eq(0).should('contain.text', 'Not Started')

        EvalResponsesPage.startConsensusEval(0)

        cy.get('#completedEvaluation').should('be.disabled')

        EvalResponsesPage.consensusGetQuestion(0).select('10')
        EvalResponsesPage.consensusGetQuestion(1).select('10')

        EvalResponsesPage.responseSave()
        
        cy.get('#completedEvaluation').should('be.disabled')

        EvalResponsesPage.responseNextPage()

        cy.get('#completedEvaluation').should('be.disabled')

        // Eval Price Upload
        EvalResponsesPage.consensusStartPrice()

        EvalResponsesPage.consensusGetPriceScore().clear().type('50')

        EvalResponsesPage.consensusGetPriceComment().click()

        EvalResponsesPage.consensusGetWeightedPriceScore().should('have.value', '25.00')

        EvalResponsesPage.savePriceScore()

        EvalResponsesPage.consensusGetCompleteBox().should('be.enabled')

        EvalResponsesPage.finishConsensusEval()

        cy.get('#pqqResp tbody').find('[id^=responses-consensus_]').eq(0).should('contain.text', 'Completed')
    })

    // Need to rethink, previous tests change the scoring which makes inconsistant
    // Could put first but would rather it be more robust
    it.skip ('Overview table scores are correct', () => {
        // Do consensus eval for 2nd supplier here then check table
        EvalResponsesPage.smokeConsensus(1)

        EvalResponsesPage.gotoOverviewTab()

        cy.get('#bidderDetails tbody tr').eq(1).find('td').eq(1).should('contain.text', '50')
        cy.get('#bidderDetails tbody tr').eq(1).find('td').eq(2).should('contain.text', '25.00%')
        cy.get('#bidderDetails tbody tr').eq(1).find('td').eq(3).should('contain.text', '100')
        cy.get('#bidderDetails tbody tr').eq(1).find('td').eq(4).should('contain.text', '160')
        cy.get('#bidderDetails tbody tr').eq(1).find('td').eq(5).should('contain.text', '40.00')
        cy.get('#bidderDetails tbody tr').eq(1).find('td').eq(6).should('contain.text', '105.00')
        cy.get('#bidderDetails tbody tr').eq(1).find('td').eq(7).should('contain.text', '65.00')
        cy.get('#bidderDetails tbody tr').eq(1).find('td').eq(8).should('contain.text', '2')
    })

    it ('Download files', () => {
        EvalResponsesPage.gotoOverviewTab()

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
    })


    it.skip ('Award tender', () => {
        EvalResponsesPage.gotoOverviewTab()

        EvalResponsesPage.checkboxSupplier(0)

        EvalResponsesPage.startAwardContract()

        cy.get('#winnerMessageBox').should('have.text', 'I am pleased to confirm that your tender submission has been successful. Please find attached a copy of the Letter of Acceptance for your information. We will post the original Letter of Acceptance to you and if you are  happy to proceed, please review and sign the Letter of Acceptance and  return this signed copy to us, as soon as possible. Should you wish to ask any questions with regards to this list, please do so using the Email Buyer option available within the Tenderbox list.')

        EvalResponsesPage.awardContract()
    })

    after(function () {
        cy.logout()
    })

})