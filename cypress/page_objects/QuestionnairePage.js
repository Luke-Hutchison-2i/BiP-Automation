export function chooseCustonQuestionnaire() {
    cy.get('#customQuestionnaire').check()

    cy.get('[name="selectPQQ"]').click()

    cy.url().should('include', 'editQuestionnaireForm.html')
}

export function createCustomQuestionnaire() {
    createQuestion(0, 'Can you do this?', 'Yes you can', 'yesNo', true)

    createSubSection()

    createQuestion(1, 'Explain why', 'Why can you do it', 'textArea', true)

    // Click onto next section
    createSection()

    cy.get('[id^="page-name-link-"').eq(1).click()

    cy.wait(1000)

    createMultipleQuestion(0, 'Multi-choice', 'Pick 1', true)

    cy.get('#form-return_to_overview').click()
}

export function createPriceCustomQuestionnaire() {
    createPriceQuestion(0, 'Name', 'Enter full price')

    cy.wait(500)

    createQuestion(0, 'What currency?', 'Not much help', 'currency', true)

    cy.get('#form-return_to_overview').click()
}

function createSection() {
    cy.contains('Add Section').click()

    cy.get('#pageName').type('Section 2')

    cy.get('#pageSectionName').type('Sub Section 1')

    cy.get('[onclick="javascript:submitPage()"]').click()
    
    cy.wait(500)

    cy.reload()
}

function createSubSection() {
    cy.contains('Add Subsection').click()

    cy.get('#modal-section_name').type('Subsection')

    cy.get('[onclick="javascript:submitSection()"]').click()

    cy.wait(500)

    cy.reload()
}

function createQuestion(sub, text, help, type, mand) {
    cy.get('#form-section_' + sub + '-add').click()

    cy.get('#answerType').select(type)

    cy.get('#questionText').type(text)

    cy.get('#helpText').type(help)

    if (mand === true) {
        cy.get('#isMandatory').check()
    }

    cy.get('[onclick="javascript:submitQuestion()"]').click()

    cy.wait(500)
}

function createMultipleQuestion(sub, text, help, mand) {
    cy.get('#form-section_' + sub + '-add').click()

    cy.get('#questionText').type(text)

    cy.get('#helpText').type(help)

    cy.get('#answerType').select('multiSelect')

    if (mand === true) {
        cy.get('#isMandatory').check()
    }

    cy.get('#newOptionValue').type('Option 1')
    cy.get('#form-add_new_option').click()

    cy.get('#newOptionValue').type('Option 2')
    cy.get('#form-add_new_option').click()

    cy.get('#newOptionValue').type('Option 3')
    cy.get('#form-add_new_option').click()

    cy.get('[onclick="javascript:submitQuestion()"]').click()

    cy.wait(500)
}

function createPriceQuestion(sub, text, help) {
    cy.get('#form-section_' + sub + '-add').click()

    cy.get('#answerType').select('lot')

    cy.get('#questionText').should('have.value', 'Total Bid Amount')

    cy.get('#helpText').type(help)

    cy.get('[onclick="javascript:submitQuestion()"]').click()

    cy.wait(500)
}


// Multi-lot on Dev server has some different tags
export function createLotCustomQuestionnaire() {
    createQuestion(0, 'Can you do this?', 'Yes you can', 'yesNo', true)

    createLot('lot', 'sec', 'sub')

    cy.get('[id^="page-name-link-"').eq(1).click() // View Lot

    cy.wait(1000)

    createMultipleQuestion(0, 'Multi-choice', 'Pick 1', true)

    cy.get('#form-return_to_overview').click()
}

function createLot(lotName, secName, subName) {
    cy.get('#add-lot').click()

    cy.get('#multiLotName').type(lotName)
    cy.get('#lotPageName').type(secName)
    cy.get('#lotPageSectionName').type(subName)

    cy.get('#modal-save_multilot_section').click()

    cy.wait(500)

    //cy.reload()
}