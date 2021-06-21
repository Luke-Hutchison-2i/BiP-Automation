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
    return cy.get('.stages').eq(1).find('[id^="tender-view_tender_"]').eq(index)
}

export function getExistingTenderBox(index) {
    return cy.get('.stages').eq(2).find('[id^="tender-view_tender_"]').eq(index)
}

export function deleteSQ(index) {
    return cy.get('.stages').eq(1).find('[id^="buttons-delete_list"]').eq(index).click()
}

export function deleteTenderbox(index) {
    return cy.get('.stages').eq(2).find('[id^="buttons-delete_list"]').eq(index).click()
}

export function viewNoticeActivityLog(index) {
    return cy.get('[id^="notices-activity_"]').eq(index).click()
}