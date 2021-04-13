// Links

export function viewInvite (boxName) {
    cy.contains(boxName).parent().find('[name="oneClickRespond"]').click()
}