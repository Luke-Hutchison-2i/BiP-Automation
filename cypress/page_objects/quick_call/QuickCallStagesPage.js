export function completeStage1 (name) {
    // Title
    // Description
    // Currency
    // Doc Upload
    cy.get('[name="dataContext\\.name"]').type(name)
    cy.get('[name="dataContext\\.description"]').type('This is a description').should('have.value', 'This is a description')

    cy.get('[name="dataContext\\.currencyType"]').select('gbp').should('have.value', 'gbp')

}

export function completeStage2 () {
    // Add suppliers
    cy.get('#form-list-select_all_0').click()

    // Check all ticked
    cy.get('#list0').find('[type="checkbox"]').should('be.checked')
}

export function completeStage3 () {
    // Invite additional suppliers

}

export function completeStage4 () {
    cy.contains('Invite emails will be sent to the following suppliers/users; demosupplieracccount@bipsolutions.com').should('exist')
    // Opening and closing date/time

}

export function completeStage5 () {

}

export function completeStage6 () {

}

export function completeStage7 () {

}

export function saveAndContinue () {
    cy.get('[name="saveContinue"]').click()
}

export function gotoStage (stageNum) {
    for (let i = 1; i < stageNum; i++) {
        // click next page button
        cy.get('[name="next"]').click()
    }
}