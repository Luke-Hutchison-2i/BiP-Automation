// Links

export function gotoCreateDPSExercise() {
    cy.get('#info-create_tender_exercise').click()
}

export function gotoExistingDPS(name) {
    //cy.get('#tenders tr').eq(1).find('td a').eq(0).click()
    cy.contains(name).click()
}


// Set up

export function createDPSExercise(name) {
    cy.get('[name=tenderName]').type(name)
    cy.get('[name=tenderDescription]').type('DPS Description')

    cy.get('#noticeType').select('ContractNotice')

    cy.get('#multilot_radio_false').check()

    cy.get('[name="save"]').click()
}