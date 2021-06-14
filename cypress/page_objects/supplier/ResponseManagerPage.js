// Links

export function viewInvite (boxName) {
    cy.get('#list').contains(boxName).parent().find('[name="oneClickRespond"]').click()
}
export function getPastInvite(boxName) {
    return cy.get('#responses').contains(boxName)
}

export function getAccessCode () {
    return cy.get('#inputs-access_code')
}
export function submitAccessCode () {
    cy.get('#buttons-submit').click()
}