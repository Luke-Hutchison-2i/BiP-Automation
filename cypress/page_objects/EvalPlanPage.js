// Set up complete evaluation plan
export function createEvalPlan() { // Works with QuestionnairePage CreateCustomQuestionnaire
    //cy.get('select[name^="evalSection_"][name$="_action"]').eq(0).select('Question')
    changeScoringLevel(0, 'Question')

    //cy.wait(1000)

    var qurl = ""

    //#region Question Score

    cy.window().then((win) => {
        // Replace window.open(url, target)-function with our own arrow function
        cy.stub(win, 'open', url => 
        {
          qurl = 'https://test.delta-esourcing.com' + url;
        }).as("popup") // alias it with popup, so we can wait refer it with @popup
    })

    cy.get('#editBut').eq(0).click()

    cy.get("@popup").should("be.called").then(() => {
        cy.visit(qurl)
    })

    cy.get('[name="answer\\.multiChoiceAnswer\\.options[0]\\.score"]').select("100")
    cy.get('[name="answer\\.multiChoiceAnswer\\.options[1]\\.score"]').select("-100")

    cy.get('[name="save"]').click()

    cy.wait(1000)

    cy.go('back')
    cy.go('back')

    //#endregion

    //cy.get('#page_nav-page_2').click()
    gotoSection(2)

    // cy.wait(1000)

    // cy.get('select[name^="evalSection_"][name$="_action"]').eq(0).select('Question')

    // cy.wait(1000)

    changeScoringLevel(0, 'Question')

    //#region Question Scores
    cy.window().then((win) => {
        // Replace window.open(url, target)-function with our own arrow function
        cy.stub(win, 'open', url => 
        {
          qurl = 'https://test.delta-esourcing.com' + url;
        }).as("popup") // alias it with popup, so we can wait refer it with @popup
    })

    cy.get('#editBut').eq(0).click()

    cy.get("@popup").should("be.called").then(() => {
        cy.visit(qurl)
    })

    cy.get('[name="answer\\.multiChoiceAnswer\\.options[0]\\.score"]').select("100")
    cy.get('[name="answer\\.multiChoiceAnswer\\.options[1]\\.score"]').select("-100")
    cy.get('[name="answer\\.multiChoiceAnswer\\.options[2]\\.score"]').select("-100")

    cy.get('[name="save"]').click()

    cy.wait(1000)

    cy.go('back')
    cy.go('back')

    //#endregion

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
    cy.get('#table-price_weight').clear().type('50')

    cy.get('#button-save_evaluation_settings').click()

    cy.get('#table-tech_weight').should('have.value', '50.00')
    
    editWeighting(2, '100')

    cy.get('#positionIndicator').click()

    cy.get('#button-return_to_overview').click()
}


export function saveEvalSettings() {
    cy.contains('Save Evaluation Settings').click()
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
    cy.get('[name^="evalSection_"][name$="weight"]').eq(index).clear().type(value)
}

export function getWeightingInput(index) {
    return cy.get('[name^="evalSection_"][name$="weight"]').eq(index)
}

export function changeScoringLevel(index, type) {
    cy.get('#dropdown-scoring_level').eq(index).select(type)
    cy.wait(500)
}


export function returnToOverview() {
    cy.get('#return_to_overview').click()
}

export function deleteEvalPlan() { // Not for Multi-lot
    cy.contains('Remove Evaluation Plan').click()
}