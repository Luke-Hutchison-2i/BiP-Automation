// Complete Eval Plans

export function createBasicEvalPlan() {
    changeScoringLevel(0, 'Question')

    editWeighting(0,100)

    saveEvalWeightings()

    setMultiQuestionScore(0, 2)

    gotoSection(2)

    changeScoringLevel(0, 'Question')

    editWeighting(0,100)

    saveEvalWeightings()

    setMultiQuestionScore (0, 3)

    returnToOverview()
}

export function chooseEvaluators() {
    cy.get('[name="chooseEvaluators"][type="submit"]').click()

    cy.get('[id^="gurId_"]').eq(0).check()

    cy.get('[name="saveEvaluators"]').click()

    cy.get('[name="returnEdit"]').click()

    returnToOverview()
}

export function createSmokeEvalPlan () {
    changeScoringLevel(0, 'Question')

    editWeighting(0, 100)
    editWeighting(1, 100)

    saveEvalWeightings()

    // Check weighting is split evenly

    setMultiQuestionScore(0, 3)

    setYesNoScore(1)

    setPriceWeighting(50)

    saveEvalSettings()

    cy.get('[name="technicalWeighting"]').should('have.value', '50.00')
    
    returnToOverview()
}


// Question Scores

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


// Evaluation Settings

export function setPriceWeighting(value) {
    cy.get('[name="priceWeighting"]').clear().type(value);
}
export function getPriceWeighting() {
    return cy.get('[name="priceWeighting"]')
}

export function saveEvalSettings() {
    //cy.get('#button-save_evaluation_settings').click()
    cy.contains('Save Evaluation Settings').click()
    cy.wait(500)
}


// Evaluation Weightings (Questions)

export function changeScoringLevel(index, type) {
    cy.get('#dropdown-scoring_level').eq(index).select(type)
    cy.wait(500)
}

export function getWeightingInput(index) {
    return cy.get('input#input-weighting').eq(index)
}
export function editWeighting(index, value) {
    cy.get('input#input-weighting').eq(index).clear().type(value)
}

export function saveEvalWeightings() {
    cy.contains('Save Evaluation Weightings').click()
    cy.wait(500)
}


// Utility

export function gotoSection(index) {
    cy.get('#page_nav-page_' + index).click()
    
    cy.url().should('contain', 'pageId=' + (index - 1), {timeout: 10000})
}


export function deleteEvalPlan() { // Not for Multi-lot
    cy.contains('Remove Evaluation Plan').click()
}


export function returnToOverview() {
    cy.get('#button-return_to_overview').click()
}