export function acceptInvite() {
    cy.get('#respondButton').click() // Accept invitation
}

export function continueStage2() {
    cy.contains('Continue to Stage Two').click()
}

export function saveAndContinue() {
    // Progresses to next questionnaire section in Stage 2, then continues to Stage 3
    cy.get('#responseForm').find('#confirmSubmit[name="submitResponse"]').click()
}

export function submitResponse() {
    cy.get('[name="confirmSubmit"]').click()
    cy.contains('Response Successfully Submitted').should('exist')
}

export function gotoMessageCentre() {
    cy.get('#buttons-message_centre').click()
}



// Fill In Responses
// Match with questionnaire and eval plan

export function completeBasicResponse () {
    cy.get('#yes0').check()

    cy.get('#mytext').type('I can do this because I can.')

    saveAndContinue()

    cy.get('#responses\\[2\\]\\.selections\\[0\\]\\.selected').check()

    saveAndContinue()
}

export function completePriceResponse () {
    cy.get('#bid_0').type('25000')

    cy.get('[name="responses\\[1\\]\\.currency"]').type('10000')

    saveAndContinue()
}

export function completeSmokeResponse() {
    cy.get('#0_dropdown').select('Option3')

    cy.get('#yes1').check()

    cy.get('#buttons-next_page').click()

    cy.get('#dragandrophandler input').attachFile('DocUploadFile.docx')

    cy.get('[name="upload"]').click()
    cy.wait(500)

    saveAndContinue()
}

export function completeQuickCallResponse() {
    cy.get('[name="responses\\[0\\]\\.currency"]').type('10000')

    cy.get('[name="submitResponse"]').eq(1).click() 
}