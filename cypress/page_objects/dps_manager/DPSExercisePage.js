// Links

export function gotoCreateQuestionnaire() {
    cy.get('#tender-create_questionnaire').click()  
}

export function gotoCreateMiniComp() {
    cy.get('#tender-create_tenderbox').click()
}


export function gotoExistingQuestionnaire() {
    cy.get('[id^="list"]').eq(0).find('[id^="tender-view_tender_"]').eq(0).click()
}

export function gotoExistingMiniComp() {
    cy.get('[id^="list"]').eq(1).find('[id^="tender-view_tender_"]').eq(0).click()
}