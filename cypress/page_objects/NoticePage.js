export function createContractNotice() {
    fillPage1()

    fillPage2()

    fillPage3()

    fillPage4()

    fillPage5()

    fillPage6()

    fillPage7()

    //cy.get('[name="validate"]')
}

function fillPage1() {
    // Page 1

    cy.get('#Go1').click()

    cy.get('#managementInformation\\.isDocsOnlineYes2').check()

    cy.get('#managementInformation\\.managementInformationStrategy\\.submittedToFTSYes').click()

    cy.get('#managementInformation\\.isDocsOnlineYes2').click()

    cy.get('#-1\\.OFFICIALNAME').clear().type('BIP Solutions')

    cy.get('#address\\.firstLine').type('123 Name Street')

    cy.get('#address\\.postcode').type('G41 3LY')

    cy.get('#address\\.town').clear().type('Glasgow')

    cy.get("#address\\.responseDataAccessor\\.refVals\\[\\'ADDRESS\\'\\]\\.addressResponse\\.country").select('UK')

    cy.get('#-1\\.TELEPHONE').clear().type('+44 123456789')

    cy.get('#-1\\.EMAIL').clear().type('liam.meagher@bipsolutions.com')

    cy.get('#-1\\.CONTRACTAUTHURL').clear().type('https://www.bipsolutions.com')

    cy.get('#specAdditionalDoc\\.documentsAvailableYes').check()

    cy.get('#specAdditionalDoc\\.urlRestricted').type('https://www.bipsolutions.com')

    cy.get('#notice\\.contractingAuthorityType\\.ministry').check()

    cy.get('#noticeActivity\\.mainActivities\\.publicService').check()

    cy.get('[name="save"]').eq(3).click()

    // NUTS Code
    var newurl = ""

    cy.window().then((win) => {
        // Replace window.open(url, target)-function with our own arrow function
        cy.stub(win, 'open', url => 
        {
            newurl = 'https://test.delta-esourcing.com' + url;
        }).as("popup") // alias it with popup, so we can wait refer it with @popup
    })

    cy.get('#divaddress input[type="button"]').click()

    cy.get("@popup").should("be.called").then(() => {
        cy.visit(newurl)
    })

    cy.get('[name="field"]').eq(0).check()
    cy.get('[name="search"]').type('uk')
    cy.get('[value="Search"]').click()
    cy.get('[type="checkbox"]').eq(0).check()
    cy.get('#regionpaste').click()

    cy.wait(2000)

    cy.go('back')

    cy.go('back')

    cy.go('back')

    cy.go('back')

    cy.go('back')

    cy.wait(2000)
}

function fillPage2() {
        // Page 2

        cy.get('#Go2').click()

        cy.get('#contract\\.contractTitle').type('Test Notice')

        cy.get('#Works').click()
    
        cy.get('#contract\\.shortDescOfContract').type('A short description')
    
        cy.get('#currency3').select('GBP')
    
        cy.get('#contract\\.scopeOfContract\\.estimatValExcludVAT').type('1000000')

        cy.get('[name="save"]').eq(3).click()

        // CPV Code

        var newurl = ""

        cy.window().then((win) => {
            // Replace window.open(url, target)-function with our own arrow function
            cy.stub(win, 'open', url => 
            {
                newurl = Cypress.config().baseUrl + url;
            }).as("popup") // alias it with popup, so we can wait refer it with @popup
        })

        cy.get('#bookmarkCpv1 input[type="button"]').click()

        cy.get("@popup").should("be.called").then(() => {
            cy.visit(newurl)
        })

        cy.get('[name="field"]').eq(0).check()
        cy.get('[name="search"]').type('03000000')
        cy.get('[value="Search"]').click()
        cy.get('[type="checkbox"]').eq(0).check()
        cy.get('[name="cpvpaste"]').click()

        cy.wait(2000)

        cy.go('back')

        cy.go('back')

        cy.go('back')

        cy.go('back')

        cy.go('back')

        cy.wait(2000)
    
        //cy.get('#backToIndex').click()
}

function fillPage3() {
    // Page 3

    cy.get('#Go2-0').click()

    cy.get('#lots\\[0\\]\\.shortDescOfContract').type('Description of the procurement')

    cy.get('#lots\\[0\\]\\.mostEconomicallyAdvTenderAdvTende').click()

    cy.get('#lots\\[0\\]\\.isCostCriteriaNo').click()

    cy.get('#criteria a.btn').eq(0).click()

    cy.get('#currency3').select('GBP')

    cy.get('#lots\\[0\\]\\.scopeOfContract\\.estimatValExcludVAT').type('1000000')

    cy.get('#lots\\[0\\]\\.timeLimitForCompletion\\.scheduledDateTypeMonths').click()

    cy.get('#lots\\[0\\]\\.timeLimitForCompletion\\.durationInMonths').type('6')

    cy.get('#lots\\[0\\]\\.options\\.isSubjectToRenewalNo').click()

    cy.get('#lots\\[0\\]\\.areVariantsAcceptedYes').click()

    cy.get('#lots\\[0\\]\\.options\\.ifOptionsYes').click()

    cy.get('#lots\\[0\\]\\.options\\.optionsDesc').type('There are multiple options')

    cy.get('#lots\\[0\\]\\.contractRelatedCommFundsNo').click()

    cy.get('[name="save"]').eq(3).click()

    // NUTS Code
    var newurl = ""

    cy.window().then((win) => {
        // Replace window.open(url, target)-function with our own arrow function
        cy.stub(win, 'open', url => 
        {
            newurl = 'https://test.delta-esourcing.com' + url;
        }).as("popup") // alias it with popup, so we can wait refer it with @popup
    })

    cy.get('#regionCodes').click()

    cy.get("@popup").should("be.called").then(() => {
        cy.visit(newurl)
    })

    cy.get('[name="field"]').eq(0).check()
    cy.get('[name="search"]').type('uk')
    cy.get('[value="Search"]').click()
    cy.get('[type="checkbox"]').eq(0).check()
    cy.get('#regionpaste').click()

    cy.wait(2000)

    cy.go('back')

    cy.go('back')

    cy.go('back')

    cy.go('back')

    cy.go('back')

    cy.wait(2000)

    //cy.get('#backToIndex').click()
}

function fillPage4() {
    cy.get('#Go3').click()

    cy.get('#legalEcoFinTechInfo\\.selectionCriteria\\.suitabilityPursueActivityInfo').type('Suitability')

    cy.get('#legalEcoFinTechInfo\\.selectionCriteria\\.economicStanding').check()

    cy.get('#legalEcoFinTechInfo\\.selectionCriteria\\.technicalAbility').check()

    cy.get('#legalEcoFinTechInfo\\.particularConditions').type('Performance conditions')

    cy.get('#legalEcoFinTechInfo\\.legalPersonsValidity').check()

    cy.get('#backToIndex').click()
}

function fillPage5() {
    cy.get('#Go4').click()

    cy.get('#procedure\\.procedureTypeOpen').click()

    cy.get('#procedure\\.isCoveredByGPAYes').click()

    const date = Cypress.moment().add(40, 'd').format('DD/MM/YYYY')

    cy.get('#procedure\\.administrativeInformation\\.dateLimitReceiptOfTenders').type(date, {force:true})

    cy.get('#procedure\\.administrativeInformation\\.timeLimitReceiptOfTenders').type('00:00', {force: true})

    cy.get('#languages4').check()


    const opendate = Cypress.moment().add(45, 'd').format('DD/MM/YYYY')
    cy.get('#procedure\\.administrativeInformation\\.dateCondOpeningTender').type(opendate, {force:true})
    cy.get('#procedure\\.administrativeInformation\\.timeCondOpeningTender').type('00:00', {force:true})


    cy.get('#backToIndex').click()
}

function fillPage6() {
    cy.get('#Go5').click()

    cy.get('#complementaryInformation\\.isRecurrentProcurementNo').click()

    cy.get('#complementaryInformation\\.eOrdering').check()
    cy.get('#complementaryInformation\\.eInvoicing').check()
    cy.get('#complementaryInformation\\.ePayment').check()

    cy.get('#-1\\.OFFICIALNAME').clear().type('BIP Solutions')

    cy.get('#complementaryInformation\\.bodyAppealProcedures\\.town').clear().type('Glasgow')

    cy.get("#complementaryInformation\\.bodyAppealProcedures\\.responseDataAccessor\\.refVals\\[\\'ADDRESS\\'\\]\\.addressResponse\\.country").select('UK')

    cy.get('[name="complementaryInformation\\.bodyAppealProcedures\\.responseDataAccessor\\.refVals\\[TELEPHONE\\]\\.responseText"]').clear().type('+44 123456789')
    cy.get('[name="complementaryInformation\\.bodyMediationProcedures\\.responseDataAccessor\\.refVals\\[TELEPHONE\\]\\.responseText"]').clear().type('+44 123456789')
    cy.get('[name="complementaryInformation\\.serviceLodgingAppeals\\.responseDataAccessor\\.refVals\\[TELEPHONE\\]\\.responseText"]').clear().type('+44 123456789')

    cy.get('#-1\\.EMAIL').clear().type('liam.meagher@bipsolutions.com')

    //cy.get('#-1\\.CONTRACTAUTHURL').clear().type('https://www.bipsolutions.com')

    cy.get('#complementaryInformation\\.preciseInfoLodgAppeals').type('Deadline for review procedure')

    cy.get('[name="contractsFinder.isVCO"]').eq(0).click()

    const openDate = Cypress.moment().add(50, 'd').format('DD/MM/YYYY') // Broke

    cy.get('#contractsFinder\\.periodWorkDateStarting').type(openDate, {force:true})

    const closeDate = Cypress.moment().add(100, 'd').format('DD/MM/YYYY') // Broke

    cy.get('#contractsFinder\\.periodWorkDateEnding').type(closeDate, {force: true})

    cy.get('#backToIndex').click()
}

function fillPage7() {
    cy.get('#Go6').click()

    cy.get('#finish').click()
}


export function createCompetitiveNotice() {
    cy.contains('Competitive Contract Notice').click()

    fillTitle()
    fillContractsType()
}

function fillContractsFinder() {
    // Not need/already done
}

function fillTitle () {
    cy.get('#country').select('US').should('have.value', 'US')
    cy.get('#country').select('GB').should('have.value', 'GB')

    cy.get('#town').type('Glasgow').should('have.value', 'Glasgow')

    cy.get('#noticeTitle').type('Notice Title')
}

function fillAwardingAuthority () {
    // Already done, might need to add an email
}

function fillContractsType () {
    cy.get('#worksDiv').should('not.be.visible')
    cy.get('#Works').check()
    cy.get('#worksDiv').should('be.visible')
    cy.get('#contractsFinder\\.worksContractSubtypeExecution').check()
}

function fillDescription () {
    
}

function fillCPVCodes () {
    
}

function fillNUTSCode () {
    
}

function fillEstimatedValue () {
    
}

function fillDeadline () {
    
}

function fillAddress () {
    // Not required, do later
}