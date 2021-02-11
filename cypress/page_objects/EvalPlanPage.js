export function createEvalPlan() {
    cy.get('select[name^="evalSection_"][name$="_action"]').eq(0).select('Question')
    //cy.get('select[name^="evalSection_"][name$="_action"]').eq(1).select('Question')

    cy.wait(1000)

    var qurl = ""

    cy.window().then((win) => {
        // Replace window.open(url, target)-function with our own arrow function
        cy.stub(win, 'open', url => 
        {
          qurl = 'https://test.delta-esourcing.com' + url;
        }).as("popup") // alias it with popup, so we can wait refer it with @popup
    })

    // Assign scores to questions
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

    cy.get('#page_nav-page_2').click()

    cy.wait(1000)

    cy.get('select[name^="evalSection_"][name$="_action"]').eq(0).select('Question')

    cy.wait(1000)

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

    // Choose evaluators
    cy.get('[name="chooseEvaluators"][type="submit"]').click()

    cy.get('[id^="gurId_"]').eq(0).check()

    cy.get('[name="saveEvaluators"]').click()

    cy.get('[name="returnEdit"]').click()


    cy.get('#button-return_to_overview').click()
}

export function createPriceEvalPlan() {
    cy.get('#table-price_weight').clear().type('50')

    cy.get('#button-save_evaluation_settings').click()

    cy.get('#table-tech_weight').should('have.value', '50.00')

    cy.get('[name^="evalSection_"][name$="weight"]').eq(2).clear().type('100')

    cy.get('#positionIndicator').click()

    cy.get('#button-return_to_overview').click()
}

export function deleteEvalPlan() {
    cy.contains('Remove Evaluation Plan').click()
}