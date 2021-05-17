// Links

export function gotoCreateTenderExercise() {
    cy.get('#info-create_tender_exercise').click()
}

export function gotoExistingTender(name) {
    cy.contains(name).click()
}


// Set up Tender Exercise

export function createTenderExercise(name) {
    getNameField().type(name)

    getDescField().type('Tender Description')

    getNoticeField().select('ContractNotice')

    getSQTrueField().check()

    getTenderTypeField().select('ITT')

    saveTender()
}

export function getNameField() {
    return cy.get('#createTender-input_tender_name')
}

export function getDescField() {
    return cy.get('[name=tenderDescription]')
}

export function getNoticeField() {
    return cy.get('#noticeType')
}

export function getSQTrueField() {
    return cy.get('#pqq_radio_true')
}

export function getTenderTypeField() {
    return cy.get('[name="tenderBoxType"]')
}

export function saveTender() {
    return cy.get('#createTender-save').click()
}