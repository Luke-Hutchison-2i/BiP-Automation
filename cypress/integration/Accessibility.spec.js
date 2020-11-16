import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/TenderExercisePage";
import * as NoticePage from "../page_objects/NoticePage";
import * as SQPage from "../page_objects/SQPage";
import * as QuestionnairePage from "../page_objects/QuestionnairePage";
import * as EvalPlanPage from "../page_objects/EvalPlanPage";

var testName = 'None'

function terminalLog(violations, name) {
    cy.task(
      'log',
      `${violations.length} accessibility violation${
        violations.length === 1 ? '' : 's'
      } ${violations.length === 1 ? 'was' : 'were'} detected`
    )
    // pluck specific keys to keep the table readable
    const violationData = violations.map(
      ({ id, impact, description, help, nodes }) => ({
        id,
        impact,
        description,
        help,
        nodes: nodes
      })
    )

    cy.writeFile('./results/' + testName + '_a11y.log', violationData)
   
    cy.task('table', violationData)
}

function accessibilityTest() {
    cy.injectAxe()

    cy.configureAxe({
        reporter: 'v2'
    })

    cy.checkA11y(null, null, terminalLog)
}

describe('Accessibility', function() {
    beforeEach(function () {
        cy.visit('https://test.delta-esourcing.com/')

        cy.contains('Login / Register').click()

        cy.login('userguideaccount2@bipsolutions.com', 'Tenders2020')
    })

    it ('Dashboard Page', () => {
        testName = "Dashboard"

        accessibilityTest()
    })

    it ('Tender Manager Page', () => {
        testName = "Tender_Manager"

        DashboardPage.gotoTenderManager()

        accessibilityTest()
    })

    afterEach(function () {
        cy.logout()
    })
})