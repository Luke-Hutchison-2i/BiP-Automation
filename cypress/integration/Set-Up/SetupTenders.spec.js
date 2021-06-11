/// <reference types="cypress" />

import * as DashboardPage from "../../page_objects/DashboardPage";
import * as TenderManagerPage from "../../page_objects/tender_manager/TenderManagerPage";
import * as TenderExercisePage from "../../page_objects/tender_manager/TenderExercisePage";
import * as TenderBoxPage from "../../page_objects/tender_manager/TenderBoxPage";
import * as QuestionnairePage from "../../page_objects/QuestionnairePage";
import * as EvalPlanPage from "../../page_objects/EvalPlanPage";
import * as AddSuppliersPage from "../../page_objects/AddSuppliersPage";
import * as Functions from "../../support/functions"

const tenderName = "Test Setup " + Cypress.dayjs().format('DD/MM')

Functions.GetServer()

describe ('Smoke Test', function () {
    before (function () {
        cy.visit('')

        cy.contains('Log in').click()

        cy.login('buyer')

        DashboardPage.gotoTenderManager()

        TenderManagerPage.gotoCreateTenderExercise()

        TenderManagerPage.createTenderExercise(tenderName)
    })

    beforeEach(function () {
        Cypress.Cookies.preserveOnce('JSESSIONID')

        cy.visit('/delta/buyers/tenders/listTenders.html')

        TenderManagerPage.gotoExistingTender(tenderName)
    })

    it ('No Price Tender', () => {
        TenderExercisePage.gotoCreateTenderBox()

        TenderBoxPage.initialBoxSetUp("No Price", 0, 5)

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()

        // Questionnaire with 2 tech questions
        QuestionnairePage.createQuestion(0, "Yes", "Help", "yesNo", true)
        QuestionnairePage.createQuestion(0, "No", "Help", "yesNo", true)

        QuestionnairePage.returnToOverview()

        TenderBoxPage.gotoCreateEvalPlan()

        EvalPlanPage.changeScoringLevel(0, 'Question')

        EvalPlanPage.editWeighting(0, '50')
        EvalPlanPage.editWeighting(1, '50')

        EvalPlanPage.saveEvalWeightings()

        EvalPlanPage.returnToOverview()

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addByEmail()
    })

    it ('Price Tender', () => {
        TenderExercisePage.gotoCreateTenderBox()

        TenderBoxPage.initialBoxSetUp("Price", 0, 5)

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()

        // Questionnaire with 2 Tech and a Price question
        QuestionnairePage.createQuestion(0, "Yes", "Help", "yesNo", true)
        QuestionnairePage.createQuestion(0, "No", "Help", "yesNo", true)

        QuestionnairePage.createPriceUploadQuestion(0)

        if (Cypress.env('dev') === true) {
            QuestionnairePage.createPriceQuestion(0, "Price", "Help")
        }

        QuestionnairePage.returnToOverview()

        TenderBoxPage.gotoCreateEvalPlan()

        EvalPlanPage.setPriceWeighting(50)
        EvalPlanPage.saveEvalSettings()

        EvalPlanPage.editWeighting(0, '50')
        EvalPlanPage.editWeighting(1, '50')
        if (Cypress.env('dev') === true) {
            EvalPlanPage.editWeighting(2, '100')
            EvalPlanPage.editWeighting(3, '100')
        }


        EvalPlanPage.saveEvalWeightings()

        EvalPlanPage.returnToOverview()

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addByEmail()
    })

    // For Dev and multi-lots
    it ('2 Lots', () => {
        TenderExercisePage.gotoCreateTenderBox()

        TenderBoxPage.initialBoxSetUp("Lots", 0, 5)

        TenderBoxPage.gotoCreateNewQuestionnaire()

        QuestionnairePage.chooseCustonQuestionnaire()

        // Questionnaire with 2 Lots
        QuestionnairePage.createQuestion(0, "Yes", "Help", "yesNo", true)
        QuestionnairePage.createQuestion(0, "No", "Help", "yesNo", true)
        QuestionnairePage.createPriceQuestion(0, "Price", "Help")

        QuestionnairePage.createLot('Lot1', 'LotSec1', 'LotSub1')
        QuestionnairePage.viewSection(1)

        QuestionnairePage.createQuestion(0, "No", "Help", "yesNo", true)
        QuestionnairePage.createPriceQuestion(0, "Price", "Help")

        QuestionnairePage.createLot('Lot2', 'LotSec1', 'LotSub1')
        QuestionnairePage.viewSection(2)

        QuestionnairePage.createQuestion(0, "Yes", "Help", "yesNo", true)
        QuestionnairePage.createPriceQuestion(0, "Price", "Help")

        QuestionnairePage.returnToOverview()


        TenderBoxPage.gotoCreateEvalPlan()

        EvalPlanPage.setPriceWeighting(50)
        cy.get('#lotTechnicalWeighting').type('50')
        EvalPlanPage.saveEvalSettings()

        //EvalPlanPage.changeScoringLevel(0, 'Question')

        EvalPlanPage.editWeighting(0, '50')
        EvalPlanPage.editWeighting(1, '50')
        EvalPlanPage.editWeighting(2, '100')

        EvalPlanPage.saveEvalWeightings()

        EvalPlanPage.gotoSection(2)

        //EvalPlanPage.changeScoringLevel(0, 'Question')

        EvalPlanPage.editWeighting(0, '50')
        EvalPlanPage.editWeighting(1, '50')

        EvalPlanPage.saveEvalWeightings()

        EvalPlanPage.gotoSection(3)

        //EvalPlanPage.changeScoringLevel(0, 'Question')

        EvalPlanPage.editWeighting(0, '50')
        EvalPlanPage.editWeighting(1, '50')

        EvalPlanPage.saveEvalWeightings()

        EvalPlanPage.returnToOverview()

        TenderBoxPage.gotoAddSuppliers()

        AddSuppliersPage.addByEmail()
    })

    after (function () {
        cy.logout()
    })
})