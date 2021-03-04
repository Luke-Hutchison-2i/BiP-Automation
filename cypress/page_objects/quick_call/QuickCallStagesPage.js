export function completeStage1 (name) {
    // Title
    // Description
    // Currency
    // Doc Upload
    cy.get('[name="dataContext\\.name"]').type(name)
    cy.get('[name="dataContext\\.description"]').type('This is a description').should('have.value', 'This is a description')

    cy.get('[name="dataContext\\.currencyType"]').select('gbp').should('have.value', 'gbp')
    
    cy.get('#docUpload').attachFile('DocUploadFile.docx')

    cy.get('[name="upload"]').click()

}

export function completeStage2 () {
    // Add suppliers
    cy.get('#form-list-select_all_0').click()

    // Check all ticked
    cy.get('#list0').find('[type="checkbox"]').should('be.checked')
}

export function completeStage3 () {
    // Invite additional suppliers
    cy.get('[name="dataContext\\.emails"]').type('demosupplieracccount@bipsolutions.com').should('have.value', 'demosupplieracccount@bipsolutions.com')

    // Think about how to test adding the supplier to the contract list
    // cy.get('[name="dataContext\\.addSuppliersToList"])
}

export function completeStage4 () {
     // Opening and closing date/time
    // Select Send Now
    cy.get('#sendNow').check()
    cy.get('#startDateDayWeb').eq(0).should('be.disabled')

    const date = Cypress.moment().format('DD/MM/YYYY')

    cy.get('[name="dataContext\\.closingDate"]').type(date,{force:true})

    const hour = parseInt(Cypress.moment().format('H'))
    const min = parseInt(Cypress.moment().format('m'))

    var closeMin = (Math.ceil((min+2)/5)*5) + 5
    var closeHour = hour

    if (closeMin >= 60) {
        closeMin -= 60
        closeHour += 1
        if (closeHour >= 24) {
            closeHour -= 24
        }
    }

    cy.get('#dataContext\\.closingHour').select(closeHour.toString(), {force: true})
    cy.get('#dataContext\\.closingMin').select(closeMin.toString(), {force: true})

    exports.closeMin = closeMin;
    exports.closeHour = closeHour;
}

export function completeStage5 () {
    cy.get('#pqqResp').find('[name^="ischecked_"]').eq(0).check()

    cy.get('[name="quickQuoteAward"]').click()
}

export function completeStage6 () {
    cy.get('[name="awardAmountActual"]').clear().type('10001').should('have.value', '10001')

    cy.get('[name="comment"]').type('You have won the contract.').should('have.value', 'You have won the contract.')

    cy.get('[name="confirm"]').click()
}

export function completeStage7 () {
    cy.get('[name="confirm"]').click()
}

export function saveAndContinue () {
    cy.get('[name="saveContinue"]').click()
}

export function gotoStage (stageNum) {
    for (let i = 1; i < stageNum; i++) {
        // click next page button
        cy.get('[name="saveContinue"]').click()
    }
}