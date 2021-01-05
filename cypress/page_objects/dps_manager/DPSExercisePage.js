export function gotoCreateQuestionnaire() {
    cy.get('#tender-create_questionnaire').click()  
}

export function gotoExistingQuestionnaire() {
    cy.get('[id^="tender-view_tender_"]').eq(0).click()
}

export function gotoCreateMiniComp() {
    cy.get('#tender-create_tenderbox').click()
}

export function gotoExistingMiniComp() {
    cy.get('#tender-create_tenderbox').parent().parent().find('[id^="tender-view_tender_"]').eq(0).click()
}