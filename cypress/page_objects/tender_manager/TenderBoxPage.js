// Complete Set Up

export function initialBoxSetUp(name, openDelay = 0, closeDelay = 0) {
    getTypeField().select('ITT')

    initialSQSetUp(name, openDelay, closeDelay)
}
export function MLinitialBoxSetUp(name) {
    cy.get('select[name="qType"]').select('ITT')

    cy.get('#list-setup').find('[name="name"]').clear().type(name)

    const date = Cypress.dayjs().format('DD/MM/YYYY')

    cy.get('#startDateDayWeb').type(date)

    cy.wait(500)

    cy.get('#endDateDayWeb').type(date,{force:true})

    SetOpenAndCloseTime(60, 0)

    cy.get('#save_dates').click()
}

export function initialSQSetUp(name, openDelay = 0, closeDelay = 0) {
    getNameField().clear().type(name)

    setOpenAndCloseDate()

    SetOpenAndCloseTime(openDelay, closeDelay)

    saveBox()
}

export function setOpenAndCloseDate(openDelay = 0, closeDelay = 0) {
    let date = Cypress.dayjs()
    
    let openDate = date.add(openDelay, 'day')
    openDate = openDate.format('DD/MM/YYYY')

    let closeDate = date.add(closeDelay, 'day')
    closeDate = closeDate.format('DD/MM/YYYY')

    getOpenDateField().type(openDate)

    cy.wait(500)

    getCloseDateField().type(closeDate,{force:true})

    exports.openDate = openDate;
    exports.closeDate = closeDate;
}
export function SetOpenAndCloseTime(openDelay = 0, closeDelay = 0) {
    let hour = parseInt(Cypress.dayjs().utc().format('H')) + 1 // Temporary: The Cypress servers were stuck on UTC time, so had to add an hour to match BST
    let min = parseInt(Cypress.dayjs().format('m'))

    let openMin = (Math.ceil((min+2)/5)*5) + openDelay
    let openHour = hour

    while (openMin >= 60) {
        openMin -= 60
        openHour += 1
    }

    // Not actually needed, if openHour resets after 24, would need to add an extra day which we aren't doing
    if (openHour > 24) {
        openHour -= 24
    }
    
    cy.get('#metadata\\.openingHour').select(openHour.toString())
    cy.get('#metadata\\.openingMin').select(openMin.toString())

    let closeMin = openMin + 5 + closeDelay
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

    exports.openMin = openMin;
    exports.openHour = openHour;

    exports.closeMin = closeMin;
    exports.closeHour = closeHour;
}

// Set up

export function getNameField() {
    return cy.get('#input-list_name')
}

export function getTypeField() {
    return cy.get('#dropdown-select_tenderbox_type')
}

export function getOpenDateField() {
    return cy.get('#startDateDayWeb')
}

export function getCloseDateField() {
    return cy.get('#endDateDayWeb')
}

export function saveBox() {
    cy.get('#save_dates').click()
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


// Access Code
export function getAccessCode() {
    cy.contains('Access Code').find('strong').then(el => {
        const text = el.text()

        exports.accessCode = text;
    })
}

// For DPS Questionnaire
export function gotoViewSelectList() {
    cy.get('#responses-view_supplier_list').click()
}