export function gotoCreateNotice() {
    cy.get('[name="addNotice"]').click()
}

export function gotoCreateSQ() {
    cy.get('#tender-create_sq').click()
}

export function gotoCreateTenderBox() {
    cy.get('#tender-create_tenderbox').click()
}

export function gotoExistingNotice() {
    cy.get('.notice-info').eq(0).find('a').eq(0).click()
}

export function gotoExistingSQ() {
    cy.get('[id^="tender-view_tender_"]').eq(0).click()
}

export function gotoExistingTenderBox() {
    cy.get('#tender-create_tenderbox').parent().parent().find('[id^="tender-view_tender_"]').eq(0).click()

    //cy.get('[id^="tender-view_tender_"]').eq(0).click()
}
