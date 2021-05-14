// // Complete Evaluations
// Basic

export function basicSideBySide() {
    startSideBySideEval()

    cy.get('[id^="scoreText_"]').eq(0).parent().find('span').eq(0).click()

    cy.get('#score').select('10')

    cy.get('#button_update').click()

    cy.get('[id^="scoreText_"]').eq(1).parent().find('span').eq(0).click()

    cy.get('#score').select('100')

    cy.get('#button_update').click()

    cy.get('[id^="scoreText_"]').eq(2).parent().find('span').eq(0).click()

    cy.get('#score').select('-100')

    cy.get('#button_update').click()

    cy.wait(1000)

    finishSideBySideEval()
}

export function basicBuyerResponse(index) {
    startBuyerResponse(index)

    cy.get('[name="scores\\[2\\]\\.evaluatorScores\\[0\\]\\.score"]').select('10')

    cy.get('[name="scores\\[1\\]\\.evaluatorScores\\[0\\]\\.score"]').select('100')

    cy.get('#navigation-page_2').click()

    cy.get('[name="scores\\[0\\]\\.evaluatorScores\\[0\\]\\.score"]').select('100')

    finishBuyerResponse()
}

export function basicConsensus(index) {
    startConsensusEval(index)

    cy.get('[name^="scores"][name$="score"]').eq(0).select('10')
    cy.get('[name^="scores"][name$="comment"]').eq(0).type('Very good answer')

    cy.get('[name^="scores"][name$="score"]').eq(1).select('100')
    cy.get('[name^="scores"][name$="comment"]').eq(1).type('Great answer')

    cy.get('#navigation-page_2').click()
    cy.wait(500)

    cy.get('[name^="scores"][name$="score"]').eq(0).select('-100')
    cy.get('[name^="scores"][name$="comment"]').eq(0).type('Bad answer')

    finishConsensusEval()
}


// Smoke

export function smokeSideBySide() {
    startSideBySideEval()

    cy.get('a#evaluateQuestion').eq(0).click()
    cy.wait(500)

    cy.get('#score').select('10')

    cy.get('#button_update').click()

    cy.get('a#evaluateQuestion').eq(1).click()
    cy.wait(500)

    cy.get('#score').select('5')

    cy.get('#button_update').click()

    cy.get('[id^="completed"]').should('be.enabled')

    finishSideBySideEval()
}

export function smokeConsensus(index) {
    startConsensusEval(index)

    cy.get('select#dropdown-rating').eq(0).select('7')
    cy.get('select#dropdown-rating').eq(1).select('9')

    cy.get('#buttons-next_page').click()

    // Eval Price Upload
    cy.get('#editSubmitPrice').click()

    cy.get('#priceScore').type('50')

    cy.wait(500)

    cy.get('#priceScoreWeighting').should('have.value', '25')

    cy.get('#save-button').click()
    cy.wait(500)

    finishConsensusEval()
}


// Evaluation

export function startBuyerResponse(index) {
    cy.get('#pqqResp tbody').find('[id^=responses-evaluate_]').eq(index).click()
}

export function finishBuyerResponse() {
    cy.get('[name="evaluatorEvalStatus\\[0\\]\\.isComplete"').check()

    cy.get('[name="save"]').click()

    cy.contains('Return to Responses').click()
}

export function startSideBySideEval() {
    cy.get('#buttons-side_by_side').click()
}

export function finishSideBySideEval() {
    cy.get('[id^="completed_"]').eq(0).check()

    cy.contains('Save & Return').click()

    cy.wait(500)
}

export function startConsensusEval (index) {
    cy.get('#pqqResp tbody').find('[id^=responses-consensus_]').eq(index).click()
}

export function finishConsensusEval () {
    cy.get('#completedEvaluation').check()

    cy.get('[name="save"]').click()

    cy.contains('Return to Responses').click()
}


// Utility

export function checkboxSupplier(index) {
    cy.get('#bidderDetails tbody').find('input[type="checkbox"]').eq(index).check()   
}

export function awardContract() {
    gotoOverviewTab()

    checkboxSupplier(0) 

    cy.get('#buttons-award_contract').click()

    cy.get('#buttons-send').click()
}

export function gotoOverviewTab() {
    cy.get('#tabs-overview').click()
    //cy.url().should('include', '/buyers/lists/viewSupplierResponsesOverview')
    //cy.get('#bidderDetails tbody').should('be.visible')
    cy.get('input[type="checkbox"]').should('be.visible')
}

export function shortListSupplier(index) {
    gotoOverviewTab()

    cy.get('#pqqResp tbody').find('input[type="checkbox"]').eq(index).check()

    cy.get('[name="shortList"]').click()
}
export function dpsApproveSupplier(index) {
    cy.get('#tabs-overview').click()

    cy.get('#pqqResp tbody').find('input[type="checkbox"]').eq(index).check()

    cy.get('[name="approved"]').click()
}

export function responseNextPage() {
    cy.get('#buttons-next_page').click()
}

export function responseSave() {
    cy.get('#buttons-save').click()
    cy.wait(500)
}

export function responseDownloadDocs() {
    cy.contains('Download all response docs').invoke('attr', 'href').then((href) => {
        //cy.downloadFile(Cypress.config().baseUrl + href, 'cypress/downloads', 'Docs.zip')
        cy.request({
            method: 'GET',
            url: Cypress.config().baseUrl + href,
            encoding: 'binary'
        }).then((res) => {
            expect(res.headers).to.have.property('content-type', 'application/zip;charset=UTF-8')
            cy.writeFile('cypress/downloads/SupplierResponses.zip', res.body, 'binary')
        })
    })
}



// DPS

export function dpsEvalConsensus(index) {
    cy.get('#pqqResp tbody').find('[id^=responses-consensus_]').eq(index).click()

    cy.get('[name^="scores"][name$="score"]').eq(0).select('10')
    cy.get('[name^="scores"][name$="comment"]').eq(0).type('Very good answer')

    cy.get('#navigation-page_2').click()
    cy.wait(500)

    cy.get('[name^="scores"][name$="score"]').eq(0).select('-100')
    cy.get('[name^="scores"][name$="comment"]').eq(0).type('Bad answer')

    cy.get('#completedEvaluation').check()

    cy.get('[name="save"]').click()

    cy.contains('Return to Responses').click()
}
