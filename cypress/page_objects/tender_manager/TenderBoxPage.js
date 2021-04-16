// Complete Set Up

export function initialBoxSetUp(name) {
    cy.get('#dropdown-select_tenderbox_type').select('ITT')

    initialSQSetUp(name)
}
export function MLinitialBoxSetUp(name) {
    cy.get('select[name="qType"]').select('ITT')

    cy.get('#list-setup').find('[name="name"]').clear().type(name)

    const date = Cypress.dayjs().format('DD/MM/YYYY')

    cy.get('#startDateDayWeb').type(date)

    cy.wait(500)

    cy.get('#endDateDayWeb').type(date,{force:true})

    SetOpenAndCloseTime(60)

    cy.get('#save_dates').click()
}

export function initialSQSetUp(name) {
    cy.get('#list-setup').find('[name="name"]').clear().type(name)

    const date = Cypress.dayjs().format('DD/MM/YYYY')

    cy.get('#startDateDayWeb').type(date)

    cy.wait(500)

    cy.get('#endDateDayWeb').type(date,{force:true})

    SetOpenAndCloseTime(0)

    cy.get('#save_dates').click()
}


export function SetOpenAndCloseTime(delay) {
    let hour = parseInt(Cypress.dayjs().utc().format('H')) + 1 // Temporary: The Cypress servers were stuck on UTC time, so had to add an hour to match BST
    let min = parseInt(Cypress.dayjs().format('m'))

    let openMin = (Math.ceil((min+2)/5)*5) + delay
    let openHour = hour

    while (openMin >= 60) {
        openMin -= 60
        openHour += 1
    }

    if (openHour > 24) {
        openHour -= 24
    }
    

    cy.get('#metadata\\.openingHour').select(openHour.toString())
    cy.get('#metadata\\.openingMin').select(openMin.toString())

    let closeMin = openMin + 5
    let closeHour = openHour

    if (closeMin >= 60) {
        closeMin -= 60
        closeHour += 1
        if (closeHour >= 24) {
            closeHour -= 24
        }
    }

    cy.get('#metadata\\.closingHour').select(closeHour.toString())
    cy.get('#metadata\\.closingMin').select(closeMin.toString())

    cy.wait(2000)

    exports.closeMin = closeMin;
    exports.closeHour = closeHour;
}


// Links

export function gotoCreateNewQuestionnaire() {
    cy.get('#documents-select_questionnaire_type').click()
}

export function gotoExistingQuestionnaire() {
    cy.get('#documents-edit_questionnaire').should('exist').click()
}

export function gotoCreateEvalPlan() {
    cy.get('#documents-edit_evaluation_plan').click()
}

export function gotoUploadDocs() {
    cy.get('#documents-upload_documents').click()
}

export function gotoAddSuppliers() {
    cy.get('#suppliers-add_suppliers').click()
}

export function gotoMessageCentre() {
    cy.get('#suppliers-message_centre').click()
}

export function gotoEvaluateResponses() {
    cy.get('#responses-view_responses').click()

    cy.wait(1000)

    cy.get('body').then($body => {
        if ($body.find('#confirm-popup #ok-confirm').length) {
            cy.get('#ok-confirm').click()
        }
    })
}

// For DPS Questionnaire
export function gotoViewSelectList() {
    cy.get('#responses-view_supplier_list').click()
}