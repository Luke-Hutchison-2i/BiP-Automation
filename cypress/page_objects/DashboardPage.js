export function gotoTenderManager() {
    cy.get('#modules-tender_manager').click()
}

export function gotoDPSManager() {
    cy.get('#modules-dps_manager').click()
}

export function gotoQuickCall() {
    cy.get('#modules-quick_calls').click()
}

export function gotoResponsesAndInvites() {
    cy.get('#modules-responses_and_invites').click()
}