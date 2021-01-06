export function evalResponse(index) {
    cy.get('#pqqResp tbody').find('[id^=responses-evaluate_]').eq(index).click()

    cy.get('[name="scores\\[2\\]\\.evaluatorScores\\[0\\]\\.score"]').select('100')

    cy.get('[name="scores\\[1\\]\\.evaluatorScores\\[0\\]\\.score"]').select('100')

    cy.get('#navigation-page_2').click()

    cy.get('[name="scores\\[0\\]\\.evaluatorScores\\[0\\]\\.score"]').select('100')

    cy.get('[name="evaluatorEvalStatus\\[0\\]\\.isComplete"').check()

    cy.get('[name="save"]').click()

    cy.contains('Return to Responses').click()

    cy.get('#pqqResp tbody').find('[id^=responses-evaluate_]').eq(index).should('have.text', 'Completed')
}

export function evalConsensus(index) {
    cy.get('#pqqResp tbody').find('[id^=responses-consensus_]').eq(index).click()

    cy.get('[name^="scores"][name$="score"]').eq(0).select('100')
    cy.get('[name^="scores"][name$="comment"]').eq(0).type('Very good answer')

    cy.get('[name^="scores"][name$="score"]').eq(1).select('100')
    cy.get('[name^="scores"][name$="comment"]').eq(1).type('Great answer')

    cy.get('#navigation-page_2').click()
    cy.wait(500)

    cy.get('[name^="scores"][name$="score"]').eq(0).select('-100')
    cy.get('[name^="scores"][name$="comment"]').eq(0).type('Bad answer')

    cy.get('#completedEvaluation').check()

    cy.get('[name="save"]').click()

    cy.contains('Return to Responses').click()
}

export function evalSideBySide() {
    cy.get('#tabs-overview').click()

    //cy.get('#buttons-sxs_eval').click()
    cy.get('#sideBySideEvaluation').click()

    cy.get('[id^="scoreText_"]').eq(0).parent().find('span').eq(0).click()

    cy.get('#score').select('100')

    cy.get('#button_update').click()

    cy.get('[id^="scoreText_"]').eq(1).parent().find('span').eq(0).click()

    cy.get('#score').select('100')

    cy.get('#button_update').click()

    cy.get('[id^="scoreText_"]').eq(2).parent().find('span').eq(0).click()

    cy.get('#score').select('-100')

    cy.get('#button_update').click()

    cy.get('[id^="completed_"]').check()

    cy.contains('Save & Return').click()
}

export function dpsEvalSideBySide() {
    cy.get('#tabs-overview').click()

    cy.get('#sideBySideEvaluation').click()

    cy.get('[id^="scoreText_"]').eq(0).parent().find('span').eq(0).click()

    cy.get('#score').select('100')

    cy.get('#button_update').click()

    cy.get('[id^="scoreText_"]').eq(1).parent().find('span').eq(0).click()

    cy.get('#score').select('-100')

    cy.get('#button_update').click()

    //cy.wait(1000)

    cy.get('[id^="completed_"]').eq(0).check()

    cy.contains('Save & Return').click()
}

export function dpsEvalConsensus(index) {
    cy.get('#pqqResp tbody').find('[id^=responses-consensus_]').eq(index).click()

    cy.get('[name^="scores"][name$="score"]').eq(0).select('100')
    cy.get('[name^="scores"][name$="comment"]').eq(0).type('Very good answer')

    cy.get('#navigation-page_2').click()
    cy.wait(500)

    cy.get('[name^="scores"][name$="score"]').eq(0).select('-100')
    cy.get('[name^="scores"][name$="comment"]').eq(0).type('Bad answer')

    cy.get('#completedEvaluation').check()

    cy.get('[name="save"]').click()

    cy.contains('Return to Responses').click()
}

export function shortListSupplier(index) {
    cy.get('#tabs-overview').click()

    cy.get('#pqqResp tbody').find('input[type="checkbox"]').eq(index).check()

    cy.get('[name="shortList"]').click()
}

export function dpsApproveSupplier(index) {
    cy.get('#tabs-overview').click()

    cy.get('#pqqResp tbody').find('input[type="checkbox"]').eq(index).check()

    cy.get('[name="approved"]').click()
}

export function awardContract() {
    cy.get('#tabs-overview').click()

    cy.get('#pqqResp tbody').find('input[type="checkbox"]').eq(0).check()   

    cy.get('[name="tenderboxAward"]').click()

    cy.get('[name="confirm"]').click()
}