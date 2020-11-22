export function pickSupplier(i) {
    cy.get('#pqqResp [type="checkbox"]').eq(i).check()
}

export function sendDirectMessage() {
    //pickSupplier(0)

    cy.get('#form-new_direct').click()

    cy.url().should('include', 'emailSuppliers')

    cy.get('#subject').type('Test Subject')

    cy.get('#invitationText').type('Test Body')

    cy.get('[name="send"]').click()

    //cy.contains('Emails have been successfully sent to all selected suppliers').should('exist')
}

export function sendNewTopic() {
    cy.get('#form-new_topic').click()

    cy.wait(500)

    //cy.contains('Please make sure that there will be no suppliers details on this message. All suppliers will be able to see this message.').should('exist')

    cy.get('#subject').type('Topic Subject')

    cy.get('#invitationText').type('Topic Body')

    cy.get('[name="send"]').click()

    //cy.contains('Message have been successfully sent to All Suppliers').should('exist')
}

export function disableMessages() {
    //pickSupplier(0)

    cy.get('#form-disable_messages').click()

    //cy.contains('Enable Messages').should('exist')
}