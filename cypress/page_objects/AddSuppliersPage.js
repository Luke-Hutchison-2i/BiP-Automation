// Add Suppliers

export function addExisitingSuppliers() {
    startExisting()

    cy.get('select[name="filterByExercise"]').select('Org')

    cy.get('#filterByTitle').type('FORTEST')

    cy.get('[name="submit"]').click()

    cy.get('#table-confirm').eq(0).click()

    cy.get('[type="checkbox"]').check()

    cy.get('[name="inviteSelectedSuppliers"]').click()

    cy.get('[name="invite"]').click()
}

export function addByEmail() {
    startByEmail()

    if (arguments.length == 0) {
        cy.fixture('logins.json').then((logins) => {
            cy.get('[name="emailAddress"]').type(logins[Cypress.env('id')].supplier.email)
        })
    } else if (arguments.length == 1) {
        cy.get('[name="emailAddress"]').type(arguments[0])
    }

    cy.get('[name="next"]').click() // Invite button

    cy.get('[name="invite"]').click()
}

export function dpsAddExistingSuppliers() {
    startExisting()

    cy.get('#table-confirm').eq(0).click()

    cy.get('input[type="checkbox"]').check()

    cy.get('[name="inviteSelectedSuppliers"]').click()

    cy.get('[name="invite"]').click()
}


// Utility

export function startExisting() {
    cy.get('#buttons-import_supplier').click()
}

export function startByEmail () {
    cy.get('#buttons-add_emails').click()
}


// Links

export function emailSuppliers() {
    // Goes to Message Centre
    cy.get('#buttons-email').click()
}





// ???
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