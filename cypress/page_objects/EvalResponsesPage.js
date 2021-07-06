// // Complete Evaluations
// Basic

export function basicSideBySide() {
    startSideBySideEval()

    sxsStartEvalQuestion(0)

    sxsGetQuestionScore().select('10')

    sxsSaveQuestionScore()

    sxsStartEvalQuestion(1)

    sxsGetQuestionScore().select('100')

    sxsSaveQuestionScore()

    sxsStartEvalQuestion(2)

    sxsGetQuestionScore().select('-100')

    sxsSaveQuestionScore()

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

    sxsStartEvalQuestion(0)

    sxsGetQuestionScore().select('10')

    sxsSaveQuestionScore()

    sxsStartEvalQuestion(1)

    sxsGetQuestionScore().select('5')

    sxsSaveQuestionScore()

    sxsGetCompleteBox().should('be.enabled')

    finishSideBySideEval()
}

export function smokeConsensus(index) {
    startConsensusEval(index)

    consensusGetQuestion(0).select('7')
    consensusGetQuestion(1).select('9')

    responseNextPage()

    // Eval Price Upload
    consensusStartPrice()

    consensusGetPriceScore().clear().type('50')

    consensusGetPriceComment().click() // Lose focus on price score so page updates

    consensusGetWeightedPriceScore().should('have.value', '25.00')

    savePriceScore()

    finishConsensusEval()
}


// // Evaluation
// Buyer Eval

export function startBuyerResponse(index) {
    cy.get('#pqqResp tbody').find('[id^=responses-evaluate_]').eq(index).click()
}

export function finishBuyerResponse() {
    cy.get('[name="evaluatorEvalStatus\\[0\\]\\.isComplete"').check()

    cy.get('[name="save"]').click()

    cy.contains('Return to Responses').click()
}

export function getQuestion(index) {
    return cy.get('select[name^="score"]').eq(index)
}


// Side by Side Eval

export function startSideBySideEval() {
    cy.get('#buttons-side_by_side').click()
}

export function finishSideBySideEval() {
    sxsGetCompleteBox().eq(0).check()

    cy.contains('Save & Return').click()

    cy.wait(500)
}

export function sxsStartEvalQuestion (index) {
    cy.get('[id^="scoreText_"]').eq(index).parent().find('span').eq(0).click()
    cy.contains('Question/Section Evaluation').should('be.visible')
}
export function sxsGetQuestionScore() {
    return cy.get('#score')
}
export function sxsSaveQuestionScore() {
    cy.get('#button_update').click()
}
export function sxsGetCompleteBox() {
    return cy.get('[id^="completed"]')
}


// Consensus Eval

export function getConsensusText (index) {
    // Gets the 'Not Started' / 'Completed' text that links to consensus eval
    return cy.get('#pqqResp tbody').find('[id^=responses-consensus_]').eq(index)
}

export function startConsensusEval (index) {
    getConsensusText(index).click()
}

export function finishConsensusEval () {
    consensusGetCompleteBox().check()

    cy.get('[name="save"]').click()

    cy.contains('Return to Responses').click()
}

export function consensusGetQuestion(index) {
    return cy.get('select#dropdown-rating').eq(index)
}

export function consensusGetCompleteBox() {
    return cy.get('#completedEvaluation')
}

// Consensus price questions

export function consensusStartPrice() {
    cy.get('[id^="editSubmitPrice"]').click()
}
export function consensusGetPriceScore() {
    return cy.get('[name="priceScore"]')
}
export function consensusGetWeightedPriceScore() {
    return cy.get('[name="priceScoreWeighting"]')
}
export function consensusGetPriceComment() {
    return cy.get('[id^="priceScoreComment"]')
}
export function savePriceScore() {
    cy.get('#save-button').click()
    cy.get('[name="priceScore"]').should('not.be.visible')
}


// Utility

export function returnToOverview() {
    cy.get('#buttons-return').click()
}

export function checkboxSupplier(index) {
    cy.get('#bidderDetails tbody').find('input[type="checkbox"]').eq(index).check()   
}

export function getAwardContractBtn() {
    return cy.get('#buttons-award_contract')
}
export function startAwardContract() {
    cy.get('#buttons-award_contract').click()
}
export function awardContract() {
    cy.get('#buttons-send').click()
}

export function gotoOverviewTab() {
    cy.get('#tabs-overview').click()
    
    cy.get('input[type="checkbox"]').should('be.visible') // Waiting for page to load
}

export function shortListSupplier(index) {
    gotoOverviewTab()

    cy.get('#pqqResp tbody').find('input[type="checkbox"]').eq(index).check()

    cy.get('[name="shortList"]').click()
}
export function dpsApproveSupplier(index) {
    gotoOverviewTab()

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
