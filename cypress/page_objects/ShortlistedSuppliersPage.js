// Utility

export function exportSupplierToTenderBox() {
    cy.get('#pqqResp tbody').find('input[type="checkbox"]').eq(0).check()

    cy.get('#shortList').find('input[value="Export Suppliers"]').click()

    cy.get('#table-confirm').click()

    cy.get('[name="invite"]').click()
}