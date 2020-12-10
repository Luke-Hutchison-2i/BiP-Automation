export function gotoCreateQuestionnaire() {
    cy.get('#documents-select_questionnaire_type').click()
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

    cy.get('body').then($body => {
        if ($body.find('#confirm-popup #ok-confirm').length) {
            cy.get('#ok-confirm').click()
        }
    })
}

export function initialBoxSetUp(name) {
    cy.get('#list-setup').find('[name="name"]').clear().type(name)

    const date = Cypress.moment().format('DD/MM/YYYY')

    cy.get('#startDateDayWeb').type(date)

    cy.wait(500)

    cy.get('#endDateDayWeb').type(date,{force:true})

    const hour = parseInt(Cypress.moment().format('H'))
    const min = parseInt(Cypress.moment().format('m'))

    var openMin = (Math.ceil((min+1)/5)*5)
    var openHour = hour

    if (openMin >= 60) {
        openMin -= 60
        openHour += 1
        if (openHour > 24) {
            openHour -= 24
        }
    }

    cy.get('#metadata\\.openingHour').select(openHour.toString())
    cy.get('#metadata\\.openingMin').select(openMin.toString())

    var closingMin = (Math.ceil((min+1)/5)*5) + 5
    var closingHour = hour

    if (closingMin >= 60) {
        closingMin -= 60
        closingHour += 1
        if (closingHour >= 24) {
            closingHour -= 24
        }
    }

    cy.get('#metadata\\.closingHour').select(closingHour.toString())
    cy.get('#metadata\\.closingMin').select(closingMin.toString())

    cy.wait(2000)

    cy.get('#save_dates').click()
}