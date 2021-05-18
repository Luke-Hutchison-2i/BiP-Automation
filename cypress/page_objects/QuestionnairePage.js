// Complete Questionnaires

export function createBasicQuestionnaire() {
    createQuestion(0, 'Can you do this?', 'Yes you can', 'yesNo', true)

    createSubsection()

    createQuestion(1, 'Explain why', 'Why can you do it', 'textArea', true)

    // Click onto next section
    createSection('Section 2')

    viewSection(1)

    createMultiSelectQuestion(0, 'Multi-choice', 'Pick 1', true)

    returnToOverview()
}

export function createSmokeQuestionnaire () {
    createMultiDropQuestion(0, 'Multi')

    createQuestion(0, 'Yes/No', 'Yes you can', 'yesNo', false)

    createSection('Price')

    viewSection(1)

    createPriceUploadQuestion(0)

    returnToOverview()
}

export function importExistingQuestionnaire (name) {
    cy.get('#importQuestionnaire').check()

    //cy.get('#importDropDown').select(/.\*smoke.\*/gm)
    cy.get('#importDropDown').contains(name).then(el => {
        cy.get('#importDropDown').select(el.val())
    })

    cy.get('[name="selectPQQ"]').click()

    cy.get('#selectAll2').check()

    cy.get('#buttons-create_questionnaire').click()
}


// Full Questions

export function createQuestion(sub, text, help, type, mand) {
    startNewQuestion(sub)

    chooseAnswerType(type)

    getQuestionText().type(text)

    cy.get('#helpText').type(help)

    if (mand === true) {
        cy.get('#isMandatory').check()
    }

    saveQuestion()
}

export function createMultiDropQuestion(sub, text) {
    startNewQuestion(sub)

    getQuestionText().type(text)

    chooseAnswerType('multiChoiceDropdown')

    cy.get('#newOptionValue').type('Option1')
    cy.get('#form-add_new_option').click()

    cy.get('#newOptionValue').type('Option2')
    cy.get('#form-add_new_option').click()

    cy.get('#newOptionValue').type('Option3')
    cy.get('#form-add_new_option').click()

    saveQuestion()
}

export function createMultiSelectQuestion(sub, text, help, mand) {
    startNewQuestion(sub)

    getQuestionText().type(text)

    cy.get('#helpText').type(help)

    chooseAnswerType('multiSelect')

    if (mand === true) {
        cy.get('#isMandatory').check()
    }

    cy.get('#newOptionValue').type('Option1')
    cy.get('#form-add_new_option').click()

    cy.get('#newOptionValue').type('Option2')
    cy.get('#form-add_new_option').click()

    cy.get('#newOptionValue').type('Option3')
    cy.get('#form-add_new_option').click()

    saveQuestion()
}

export function createPriceQuestion(sub, text, help) {
    startNewQuestion(sub)

    chooseAnswerType('lot')

    getQuestionText().should('have.value', 'Total Bid Amount')

    cy.get('#helpText').type(help)

    saveQuestion()
}

export function createPriceUploadQuestion(sub) {
    startNewQuestion(sub)

    chooseAnswerType('priceDocUpload')

    getQuestionText().should('have.value', 'Please upload your completed pricing document')

    setPriceDocumentUpload()
}


// Question Parts

export function startNewQuestion(sub) {
    cy.get('#form-section_' + sub + '-add').click()
    cy.wait(500)
}

export function getQuestionText() {
    return cy.get('#questionText')
}

export function chooseAnswerType(type) {
    cy.get('#answerType').select(type)
}

export function setPriceDocumentUpload() {
    cy.get('#fileupload').attachFile('DocUploadFile.docx')
    cy.wait(1000)

    cy.get('#form-upload_files').click()
    //cy.wait(2000)

    cy.get('#uploaded-files tbody tr', {timeout: 10000}).should('have.length', 2)

    saveQuestion()
}

export function saveQuestion() {
    cy.get('#modal-save_question', { timeout: 10000 }).click()

    cy.get('#modal-save_question').should('not.be.visible')
}

export function deleteQuestion(index) {
    cy.get('#table_anchor_1').find('input#sidebar-remove_section').eq(index).click().should('not.exist')
}

export function editQuestion(index) {
    cy.get('#table_anchor_1 [title="Edit Form"]').eq(index).click()
    
    cy.get('#modal-save_question').should('be.visible')
}


// Sections

export function viewSection(index) {
    cy.get('[id^="page-name-link-"').eq(index).click()

    cy.url().should('contain', 'pageId=' + index, {timeout: 10000})
}

export function createSection(name) {
    startNewSection()

    cy.get('#pageName').type(name)

    cy.get('#pageSectionName').type('Sub Section 1')

    saveSection()
    
    cy.wait(500)

    cy.reload()
}
export function createSubsection() {
    cy.contains('Add Subsection').click()

    cy.get('#modal-section_name').type('Subsection')

    saveSubsection()

    cy.wait(500)

    cy.reload()
}

export function deleteSection(index) {
    cy.get('#page_table tbody tr').eq(index).find('#sidebar-remove_section').click().should('not.exist')
}
export function deleteSubSection(index) {
    cy.get('#section_table > tbody > tr').eq(index).find('input#body-remove_subsection').click().should('not.exist')
}

export function moveSectionUp(index) {
    cy.get('#page_table tbody tr').eq(index).find('[name="moveUp"]').click()
}
export function moveSectionDown(index) {
    cy.get('#page_table tbody tr').eq(index).find('[name="moveDown"]').click()
}

export function startNewSection() {
    cy.contains('Add Section').click()
}
export function saveSection() {
    cy.get('#modal-save_section').click()
    cy.get('#modal-save_section').should('not.be.visible')
}

export function startNewSubsection() {
    cy.contains('Add Subsection').click()
}
export function saveSubsection() {
    cy.get('#modal-save_subsection').click()
    cy.get('#modal-save_subsection').should('not.be.visible')
}


// Utility features

export function chooseCustonQuestionnaire() {
    cy.get('#customQuestionnaire').check()

    cy.get('[name="selectPQQ"]').click()

    cy.url().should('include', 'editQuestionnaireForm.html')
}


export function deleteQuestionnaire () {
    //cy.get('[id="actions_i"]').click()

    cy.get('#delete-questionnaire').click({force:true})

    cy.wait(1000)
}


export function returnToOverview() {
    cy.get('#form-return_to_overview').click()
}




// Multi-lot on Dev server has some different tags
export function createLotCustomQuestionnaire() {
    createQuestion(0, 'Can you do this?', 'Yes you can', 'yesNo', true)

    createLot('Lot1', 'Sec1', 'Sub1')

    viewSection(1) // View Lot

    createMultiSelectQuestion(0, 'Multi-choice', 'Pick 1', true)
}

export function createLot2CustomQuestionnaire() {
    createQuestion(0, 'Can you do this?', 'Yes you can', 'yesNo', true)

    createLot('Lot1', 'Sec1', 'Sub1')

    viewSection(1) // View Lot

    createMultiSelectQuestion(0, 'Multi-choice', 'Pick 1', true)

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

export function createLotSubSection() {
    cy.contains('Add Lot Subsection').click()

    cy.get('#sectionName').type('LotSub')

    cy.get('#modal-save_subsection').click()

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