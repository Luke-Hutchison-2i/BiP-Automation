export function gotoCreateTenderExercise() {
    cy.get('#info-create_tender_exercise').click()
}

export function gotoExistingTender() {
    cy.get('#tenders tr').eq(1).find('td a').eq(0).click()
}

export function createTenderExercise(name) {
    cy.get('[name=tenderName]').type(name)
    cy.get('[name=tenderDescription]').type('Tender Description')

    cy.get('#noticeType').select('ContractNotice')

    cy.get('#pqq_radio_true').check()

    cy.get('[name="tenderBoxType"]').select('ITT')

    cy.get('[name="save"]').click()
}