// Set up complete evaluation plan
export function createEvalPlan() { // Works with QuestionnairePage CreateCustomQuestionnaire
    changeScoringLevel(0, 'Question')

    editWeighting(0,100)

    saveEvalWeightings()

    setMultiQuestionScore(0, 2)

    gotoSection(2)

    changeScoringLevel(0, 'Question')

    editWeighting(0,100)

    setMultiQuestionScore (0, 3)

    // Choose evaluators
    cy.get('[name="chooseEvaluators"][type="submit"]').click()

    cy.get('[id^="gurId_"]').eq(0).check()

    cy.get('[name="saveEvaluators"]').click()

    cy.get('[name="returnEdit"]').click()


    //returnToOverview()
    cy.get('#positionIndicator').click()

    cy.get('#button-return_to_overview').click()
}

export function createPriceEvalPlan() { // Works with QuestionnairePage CreateCustomPriceQuestionnaire
    setPriceWeighting(50)

    saveEvalSettings()

    cy.get('#table-tech_weight').should('have.value', '50.00')
    
    editWeighting(1, '100')

    cy.get('#positionIndicator').click()

    cy.get('#button-return_to_overview').click()
}

export function setPriceWeighting(value) {
    cy.get('#table-price_weight').clear().type(value);
}

export function createSmokeEvalPlan () {
    changeScoringLevel(0, 'Question')

    editWeighting(0, 100) // Move after changeScoringLevel
    editWeighting(1, 100) // Move after changeScoringLevel

    saveEvalWeightings()

    // Check weighting is split evenly

    setMultiQuestionScore(0, 3)

    //saveEvalWeightings()

    setYesNoScore(1)

    setPriceWeighting(50)

    saveEvalSettings()

    cy.get('#table-tech_weight').should('have.value', '50.00')
}


export function saveEvalSettings() {
    cy.get('#button-save_evaluation_settings').click()
    cy.wait(500)
}

export function saveEvalWeightings() {
    cy.contains('Save Evaluation Weightings').click()
    cy.wait(500)
}


export function gotoSection(int) {
    cy.get('#page_nav-page_' + int).click()
    cy.wait(1000)
}


export function editWeighting(index, value) {
    cy.get('input#input-weighting').eq(index).clear().type(value)
}

export function getWeightingInput(index) {
    return cy.get('#input-weighting').eq(index)
}

export function changeScoringLevel(index, type) {
    cy.get('#dropdown-scoring_level').eq(index).select(type)
    cy.wait(500)
}


export function setMultiQuestionScore (index, answers) {
    let qurl = ""

    cy.window().then((win) => {
        // Replace window.open(url, target)-function with our own arrow function
        cy.stub(win, 'open', url => 
        {
          qurl = Cypress.config().baseUrl + url;
        }).as("popup") // alias it with popup, so we can wait refer it with @popup
    })

    cy.get('input#editBut').eq(index).click()

    cy.get("@popup").should("be.called").then(() => {
        cy.visit(qurl)
    })

    let score = 10

    for (let index = 0; index < answers; index++) {
        cy.get('[name="answer\\.multiChoiceAnswer\\.options[' + index + ']\\.score"]').select(score.toString())
        score = index
    }

    cy.get('[name="save"]').click()

    cy.wait(1000)

    cy.go('back')
    cy.go('back')

    cy.wait(500)
}

export function setYesNoScore (index) {
    let qurl = ""

    cy.window().then((win) => {
        // Replace window.open(url, target)-function with our own arrow function
        cy.stub(win, 'open', url => 
        {
          qurl = Cypress.config().baseUrl + url;
        }).as("popup") // alias it with popup, so we can wait refer it with @popup
    })

    cy.get('input#editBut').eq(index).click()

    cy.get("@popup").should("be.called").then(() => {
        cy.visit(qurl)
    })

    cy.get('[name="answer\\.multiChoiceAnswer\\.options[0]\\.score"]').select('10')
    cy.get('[name="answer\\.multiChoiceAnswer\\.options[1]\\.score"]').select('-100')

    cy.get('[name="save"]').click()

    cy.wait(1000)

    cy.go('back')
    cy.go('back')

    cy.wait(500)
}


export function returnToOverview() {
    cy.get('#button-return_to_overview').click()
}

export function deleteEvalPlan() { // Not for Multi-lot
    cy.contains('Remove Evaluation Plan').click()
}