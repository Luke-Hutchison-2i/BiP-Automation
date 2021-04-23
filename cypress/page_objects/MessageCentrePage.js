// // Buyer
// Messages

export function sendDirectMessage() {
    startDirectMessage()

    cy.url().should('include', 'emailSuppliers')

    enterSubject('Test Subject')

    enterBody('Test Body')

    clickSend()

    //cy.contains('Emails have been successfully sent to all selected suppliers').should('exist')
}

export function sendNewTopic() {
    startTopic()

    enterSubject('Topic Subject')

    enterBody('Topic Body')

    clickSend()

    //cy.contains('Message have been successfully sent to All Suppliers').should('exist')
}


// Other Features

export function disableMessages() {
    cy.get('#form-disable_messages').click()

    cy.wait(500)
}


// Utility 

export function pickSupplier(i) {
    cy.get('#pqqResp [type="checkbox"]').eq(i).check()
}

export function startDirectMessage() {
    cy.get('#form-new_direct').click()
}

export function startTopic() {
    cy.get('#form-new_topic').click()

    cy.wait(500)

    //cy.contains('Please make sure that there will be no suppliers details on this message. All suppliers will be able to see this message.').should('exist')

}

export function enterSubject(text) {
    cy.get('#input-message_subject').type(text)
}

export function enterBody(text) {
    cy.get('#invitationText').type(text)
}

export function clickSend() {
    cy.get('#buttons-send_message').click()
}


// // Supplier
// Utility

export function supplierEnterSubject(text) {
    cy.get('#subject').type(text)//.should('have.text', text)
}

export function uploadDoc () {
    cy.get('#doc-upload').attachFile('DocUploadFile.docx')
    cy.wait(500)
}

export function supplierSendMessage () {
    cy.get('#form-buttons-submit').click()
}