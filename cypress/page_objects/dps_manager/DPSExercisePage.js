export function gotoCreateQuestionnaire() {
    cy.get('#tender-create_questionnaire').click()  
}

export function gotoExistingQuestionnaire() {
    cy.get('[id^="tender-view_tender_"]').eq(0).click()
}