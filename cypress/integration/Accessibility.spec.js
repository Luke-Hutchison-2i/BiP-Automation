import * as DashboardPage from "../page_objects/DashboardPage";
import * as TenderManagerPage from "../page_objects/TenderManagerPage";
import * as TenderExercisePage from "../page_objects/TenderExercisePage";
import * as NoticePage from "../page_objects/NoticePage";
import * as SQPage from "../page_objects/SQPage";
import * as QuestionnairePage from "../page_objects/QuestionnairePage";
import * as EvalPlanPage from "../page_objects/EvalPlanPage";


function terminalLog(violations) {
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

    cy.writeFile('./results/a11y.log', violationData)
   
    cy.task('table', violationData)
  }

describe('Login', function() {
    beforeEach(function () {
        cy.visit('https://test.delta-esourcing.com/')

        cy.contains('Login / Register').click()

        cy.get('#username').type('userguideaccount2@bipsolutions.com')
        cy.get('#password').type('Tenders2020')

        cy.contains('Login').click()
    })

    it ('Dashboard Page', () => {
        cy.injectAxe()

        cy.configureAxe({
            reporter: 'v2'
        })

        cy.checkA11y(null, null, terminalLog)
    })
})