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

const tenderName = "suppTender"
const boxName = "suppBox"

describe ('Response Manager', function () {
    before (function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        TenderManagerPage.createTenderExercise(tenderName)

        TenderExercisePage.getExistingTenderBox(0).click()

        TenderBoxPage.initialBoxSetUp(boxName, 0, 30)

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

        cy.contains('Log in').click()
        cy.login('supplier')
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce('JSESSIONID')

        cy.visit('/delta/suppliers/select/addToList.html')
    })

    it ('Can see invite and start response', () => {
        cy.get('#list').contains(boxName).should('exist')

        ResponseManagerPage.viewInvite(boxName)
        
        cy.url().should('contain.text', '/suppRespStatus.html')

        cy.get('#information').contains('Open').should('exist')
    })

    it ('Can use Access Code to start response', () => {
        
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

        cy.get('#links-supplier_response').should('exist').click()

        cy.url().should('include', '/suppRespStatus.html')

        cy.get('#information').contains('Closed').should('exist')
    })

    after (function () {
        cy.logout()
    })
})