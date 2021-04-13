// Utility

export function publishSelectList() {
    cy.get('input[type="checkbox"]').eq(0).check()

    cy.get('[name="publish"]').click()
}