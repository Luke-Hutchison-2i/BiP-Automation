export function createContractNotice() {
    cy.get('#Go1').click()

    cy.get('#managementInformation\\.isDocsOnlineYes2').check()

    cy.get('#-1\\.OFFICIALNAME').clear().type('BIP Solutions')

    cy.get('#address\\.town').clear().type('Glasgow')

    cy.get("#address\\.responseDataAccessor\\.refVals\\[\\'ADDRESS\\'\\]\\.addressResponse\\.country").select('UK')

    cy.get('#divaddress input[type="text"]').type('[UK]', {force: true})

    cy.get('#-1\\.TELEPHONE').clear().type('01413328247')

    cy.get('#-1\\.EMAIL').clear().type('liam.meagher@bipsolutions.com')

    cy.get('#-1\\.CONTRACTAUTHURL').clear().type('https://www.bipsolutions.com')

    cy.get('#specAdditionalDoc\\.documentsAvailableNo').check()

    cy.get('#notice\\.contractingAuthorityType\\.ministry').check()

    cy.get('#noticeActivity\\.mainActivities\\.publicService').check()

    cy.get('#next').click()
}