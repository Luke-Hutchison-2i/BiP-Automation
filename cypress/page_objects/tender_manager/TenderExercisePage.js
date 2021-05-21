// Links

export function gotoCreateNotice() {
    cy.get('[name="addNotice"]').click()
}

export function gotoCreateSQ() {
    cy.get('#tender-create_sq').click()
}

export function gotoCreateTenderBox() {
    cy.get('#tender-create_tenderbox').click()
}


export function getExistingNotice(index) {
    return cy.get('[id^="notices-edit_notice_"]').eq(index)
}

export function getExistingSQ(index) {
    return cy.get('[id^="list"]').eq(0).find('[id^="tender-view_tender_"]').eq(index)
}

export function getExistingTenderBox(index) {
    return cy.get('[id^="list"]').eq(1).find('[id^="tender-view_tender_"]').eq(index)
}
