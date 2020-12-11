export function initialQuestionnaireSetUp(name) {
    cy.get('#list-setup').find('[name="name"]').clear().type(name)

    const date = Cypress.moment().format('DD/MM/YYYY')

    cy.get('#startDateDayWeb').type(date)

    cy.wait(500)

    cy.get('#endDateDayWeb').type(date,{force:true})

    const hour = parseInt(Cypress.moment().format('H'))
    const min = parseInt(Cypress.moment().format('m'))

    var openMin = Math.ceil((min+1)/5)*5
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