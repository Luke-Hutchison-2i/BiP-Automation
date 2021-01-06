export function addExisitingSuppliers() {
    cy.get('#buttons-import_supplier').click()

    cy.get('select[name="filterByExercise"]').select('Org')

    cy.get('#filterByTitle').type('FORTEST')

    cy.get('[name="submit"]').click()

    cy.get('#table-confirm').eq(0).click()

    cy.get('[type="checkbox"]').check()

    cy.get('[name="inviteSelectedSuppliers"]').click()

    cy.get('[name="invite"]').click()
}

export function addByEmail() {
    cy.get('#buttons-add_emails').click()

    cy.get('[name="emailAddress"]').type('demosupplieracccount@bipsolutions.com,mckechniesupplies@bipsolutions.com')

    cy.get('[name="next"]').click() // Invite button

    cy.get('[name="invite"]').click()
}

export function emailSuppliers() {
    // Goes to Message Centre

    cy.get('[name="email"]').click()
}

export function removeTopSupplier() {
    let length

    cy.get('#suppliersListing').find('input[type="checkbox"]').its('length').then((len) => {
        length = len
    })

    cy.get('#suppliersListing').find('input[type="checkbox"]').eq(0).check()

    cy.get('[name="action"]').click().then(() => {
        cy.get('#suppliersListing').find('input[type="checkbox"]').should('have.length', length - 1)
    })
}