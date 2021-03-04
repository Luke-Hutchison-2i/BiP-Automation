// Set up complete questionnaire
export function createCustomQuestionnaire() {
    createQuestion(0, 'Can you do this?', 'Yes you can', 'yesNo', true)

    createSubSection()

    createQuestion(1, 'Explain why', 'Why can you do it', 'textArea', true)

    // Click onto next section
    createSection()

    viewSection(1)

    createMultipleQuestion(0, 'Multi-choice', 'Pick 1', true)

    returnToOverview()
}

export function createPriceCustomQuestionnaire() {
    createPriceQuestion(0, 'Name', 'Enter full price')

    createQuestion(0, 'What currency?', 'Not much help', 'currency', true)

    returnToOverview()
}


export function chooseCustonQuestionnaire() {
    cy.get('#customQuestionnaire').check()

    cy.get('[name="selectPQQ"]').click()

    cy.url().should('include', 'editQuestionnaireForm.html')
}

export function importExistingQuestionnaire () {
    cy.get('#importQuestionnaire').check()

    //cy.get('#importDropDown').select(/.\*smoke.\*/gm)
    cy.get('#importDropDown').contains('smoke').then(el => {
        cy.get('#importDropDown').select(el.val())
    })

    cy.get('[name="selectPQQ"]').click()

    cy.get('#selectAll2').check()

    cy.get('#buttons-create_questionnaire').click()
}


export function createSection() {
    cy.contains('Add Section').click()

    cy.get('#pageName').type('Section 2')

    cy.get('#pageSectionName').type('Sub Section 1')

    cy.get('[onclick="javascript:submitPage()"]').click()
    
    cy.wait(500)

    cy.reload()
}

export function createSubSection() {
    cy.contains('Add Subsection').click()

    cy.get('#modal-section_name').type('Subsection')

    cy.get('[onclick="javascript:submitSection()"]').click()

    cy.wait(500)

    cy.reload()
}

export function createLotSubSection() {
    cy.contains('Add Lot Subsection').click()

    cy.get('#sectionName').type('LotSub')

    cy.get('#modal-save_subsection').click()

    cy.wait(500)

    cy.reload()
}


export function createQuestion(sub, text, help, type, mand) {
    cy.get('#form-section_' + sub + '-add').click()

    cy.wait(500)

    cy.get('#answerType').select(type)

    cy.get('#questionText').type(text)

    cy.get('#helpText').type(help)

    if (mand === true) {
        cy.get('#isMandatory').check()
    }

    cy.get('[onclick="javascript:submitQuestion()"]').click()

    cy.wait(500)
}

export function createMultipleQuestion(sub, text, help, mand) {
    cy.get('#form-section_' + sub + '-add').click()

    cy.wait(500)

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

export function createPriceQuestion(sub, text, help) {
    cy.get('#form-section_' + sub + '-add').click()

    cy.wait(500)

    cy.get('#answerType').select('lot')

    cy.get('#questionText').should('have.value', 'Total Bid Amount')

    cy.get('#helpText').type(help)

    cy.get('[onclick="javascript:submitQuestion()"]').click()

    cy.wait(500)
}

export function setPriceDocumentUpload() {
    cy.get('#fileupload').attachFile('DocUploadFile.docx')

    cy.get('#form-upload_files').click()
    cy.wait(1000)

    cy.get('#modal-save_question').click()

    cy.wait(500)
}


export function deleteQuestionnaire () {
    //cy.get('[id="actions_i"]').click()

    cy.get('#delete-questionnaire').click({force:true})

    cy.wait(1000)
}

export function viewSection(index) {
    cy.get('[id^="page-name-link-"').eq(index).click()
    cy.wait(500)
}

export function returnToOverview() {
    cy.get('#form-return_to_overview').click()
}


// Multi-lot on Dev server has some different tags
export function createLotCustomQuestionnaire() {
    createQuestion(0, 'Can you do this?', 'Yes you can', 'yesNo', true)

    createLot('Lot1', 'Sec1', 'Sub1')

    viewSection(1) // View Lot

    createMultipleQuestion(0, 'Multi-choice', 'Pick 1', true)
}

export function createLot2CustomQuestionnaire() {
    createQuestion(0, 'Can you do this?', 'Yes you can', 'yesNo', true)

    createLot('Lot1', 'Sec1', 'Sub1')

    viewSection(1) // View Lot

    createMultipleQuestion(0, 'Multi-choice', 'Pick 1', true)

    cy.wait(500)

    createQuestion(0, 'Can you do this?', 'Yes you can', 'yesNo', true)

    createPriceQuestion(0, "Lot Price", "Enter price")

    createLot('Lot2', 'Sec2', 'Sub2')

    viewSection(2) // View Lot

    createQuestion(0, 'Can you do this?', 'Yes you can', 'yesNo', true)

    createLotSubSection()

    createPriceQuestion(1, "Lot Price", "Enter price")

    createPriceQuestion(1, "Lot Price", "Enter price again")
}


export function createLot(lotName, secName, subName) {
    cy.get('#add-lot').click()

    cy.get('#multiLotName').type(lotName)
    cy.get('#lotPageName').type(secName)
    cy.get('#lotPageSectionName').type(subName)

    cy.get('#modal-save_multilot_section').click()

    cy.wait(500)

    cy.reload()
}


export function importQuestion (sub) {
    cy.get('#form-section_' + sub + '-add').click()

    cy.get('#expanderHead').click()

    cy.wait(500)

    cy.get('#deltaQuestionnaire').check().should('be.checked')

    cy.get('#expanderContent').find('[name="select"]').click()

    cy.wait(1000)

    cy.get('[name^="pagecheck_"]').eq(0).parent().find('[name^="sectioncheck_"]').eq(0).parent().find('[name^="questioncheck_"]').eq(0).check({force:true})

    cy.get('#addSelected').click()

    cy.wait(500)
}

export function importSubSectionLot () {
    cy.contains('Add Lot Subsection').click()

    cy.contains('Import Subsection').should('exist')

    cy.get('#expanderHead-section').click()

    cy.wait(500)

    cy.get('#deltaQuestionnaire-section').check().should('be.checked')

    cy.get('#expanderContent-section').find('[name="select"]').click()

    cy.wait(500)

    cy.get('[name^="pagecheck_"]').eq(0).parent().find('[name^="sectioncheck_"]').eq(0).check()
    
    cy.get('#addSelected').click()

    cy.wait(500)
}

export function importSectionLot () {
    cy.contains('Add Lot Section').click()

    cy.contains('Import Section').should('exist')

    cy.get('#expanderHead-page').click()

    cy.wait(500)

    cy.get('#deltaQuestionnaire-page').check().should('be.checked')

    cy.get('#expanderContent-page').find('[name="select"]').click()

    cy.wait(500)

    cy.get('[name^="pagecheck_"]').eq(0).check()
    
    cy.get('#addSelected').click()

    cy.wait(500)
}

export function importLotLot() {
    cy.get('#add-lot').click()

    cy.contains('Import Lot').should('exist')

    cy.get('#expanderHead-lot').click()

    cy.wait(500)

    cy.get('#expanderContent-lot').find('[name="select"]').click()
    cy.get('[name^="lotcheck"]').check()

    cy.get('#addSelected').click()

    cy.wait(500)
}