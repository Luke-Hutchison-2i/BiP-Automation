export function gotoCreateQuickCall() {
    cy.get('#button-create_quickcall').click()
}

export function gotoExistingQuickCall() {
    cy.get('[id^="form-quick_quote_"]').eq(0).click()
}