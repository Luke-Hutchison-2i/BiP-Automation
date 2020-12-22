export function initialQuestionnaireSetUp(name) {
    cy.get('#list-setup').find('[name="name"]').clear().type(name)

    const date = Cypress.moment().format('DD/MM/YYYY')

    cy.get('#startDateDayWeb').type(date)

    cy.wait(500)

    cy.get('#endDateDayWeb').type(date,{force:true})

    const hour = parseInt(Cypress.moment().format('H'))
    const min = parseInt(Cypress.moment().format('m'))

    var openMin = Math.ceil((min+2)/5)*5
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

    var closeMin = (Math.ceil((min+2)/5)*5) + 5
    var closeHour = hour

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

    cy.get('#save_dates').click()
}

export function gotoCreateQuestionnaire() {
    cy.get('#documents-select_questionnaire_type').click()
}

export function gotoCreateEvalPlan() {
    cy.get('#documents-edit_evaluation_plan').click()
}

export function gotoAddSuppliers() {
    cy.get('#suppliers-add_suppliers').click()
}