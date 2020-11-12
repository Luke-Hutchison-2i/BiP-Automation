export function gotoCreateTenderExercise() {
    cy.get('#info-create_tender_exercise').click()
}

export function gotoExistingTender() {
    cy.get('#tenders tr').eq(1).find('td a').eq(0).click()
}