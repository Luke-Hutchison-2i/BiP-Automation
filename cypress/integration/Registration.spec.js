// import * as DashboardPage from "../page_objects/DashboardPage";

describe ('Registration', () => {
    beforeEach(function() {
        cy.visit('')

        cy.contains('Register').click()
    })

    it ('Register as Supplier', function () {
        const stamp = Cypress.dayjs().valueOf()
        let username = 'supplier.smoketest.' + stamp +'@bipsolutions.com'
        let password = 'Password123'

        cy.contains('Register as a Supplier').click()

        cy.get('#title').select('Dr')
        cy.get('#firstName').type('New')
        cy.get('#lastName').type('Supplier')
        cy.get('#position').type('Tester')
        cy.get('#email').type(username)
        cy.get('#confirmEmail').type(username)
        cy.get('#password').type(password)
        cy.get('#confirmPassword').type(password)

        cy.get('#bisname').eq(0).type('Best Testers EU')
        cy.get('#org\\.address1').type('123 Fake Street')
        cy.get('#org\\.town').type('Glasgow')
        cy.get('#org\\.postcode').type('DD4 5PW')
        cy.get('[name="orgProfile\\.spResponse\\.responses\\[2\\]\\.responseText"]').type('besttesterseu.co.uk') // Website
        cy.get('[name="orgProfile\\.spResponse\\.responses\\[3\\]\\.responseText"]').type('0141 123 4567') // Phone Number
        cy.get('#sector').select('Aerospace and airports')
        cy.get('[name="orgProfile\\.spResponse\\.responses\\[7\\]\\.responseText"]').type('Testing things to test they work')

        cy.get('#organisationType').select('Limited Company')
        cy.get('#employees').select('50 - 99')
        cy.get('#turnover').select('£400m +')
        cy.get('[name="organisationProfileMetaData\\.howDidYouHear"]').select('Social Media')

        cy.get('iframe').then((iframe) => {
            const body = iframe.contents()
            cy.wrap(body).find('.recaptcha-checkbox-border').click()
        })

        cy.get('#acceptTsAndCs').check()

        cy.wait(2000)

        cy.get('#form_submit').click()

        cy.url().should('contain', '/signup/signupConfirmation.html?userType=supplier')
        cy.contains('Confirmation').should('exist')

        cy.contains('Log in').click()

        cy.get('#username').type(username)
        cy.get('#password').type(password)
        cy.contains('Login').click()

        cy.url().should('contain', '/delta/mainMenu.html')
    })

    it ('Register as Buyer', function () {
        const stamp = Cypress.dayjs().valueOf()
        let username = 'buyer.smoketest.' + stamp +'@bipsolutions.com'
        let password = 'Password123'

        cy.contains('Register as a Buyer').click()

        cy.get('#title').select('Dr')
        cy.get('#firstName').type('New')
        cy.get('#lastName').type('Buyer')
        cy.get('#position').type('Tester')
        cy.get('#email').type(username)
        cy.get('#confirmEmail').type(username)
        cy.get('#password').type(password)
        cy.get('#confirmPassword').type(password)

        cy.get('#bisname').eq(0).type('Best Testers EU')
        cy.get('#org\\.address1').type('123 Fake Street')
        cy.get('#org\\.town').type('Glasgow')
        cy.get('#org\\.postcode').type('DD4 5PW')
        cy.get('[name="orgProfile\\.spResponse\\.responses\\[3\\]\\.responseText"]').type('besttesterseu.co.uk') // Website
        cy.get('[name="orgProfile\\.spResponse\\.responses\\[2\\]\\.responseText"]').type('0141 123 4567') // Phone Number
        cy.get('#sector').select('Central Government')

        cy.get('#organisationType').select('Limited Company')

        cy.get('iframe').then((iframe) => {
            const body = iframe.contents()
            cy.wrap(body).find('.recaptcha-checkbox-border').click()
        })

        cy.get('#acceptTsAndCs').check()

        cy.wait(2000)

        cy.get('#form_submit').click()

        cy.url().should('contain', '/signup/signupConfirmation.html?userType=buyer')
        cy.contains('Buyer Sign Up Confirmation').should('exist')

        // Login as Admin
        cy.contains('Log in').click()
        cy.get('#username').type('andrew.mackenzie2@admin.bipsolutions.co.uk')

        // Check if on live, passwords are different
        cy.get('#password').type('Password123')
        cy.contains('Login').click()

        cy.contains('Pending Users').click()

        cy.contains(username).click()

        cy.get('#enabled').click()

        cy.contains('Update User').click()

        cy.contains('Logout').click()

        // Login as new buyer account
        cy.contains('Log in').click()
        cy.get('#username').type(username)
        cy.get('#password').type(password)
        cy.contains('Login').click()

        cy.url().should('contain', '/delta/mainMenu.html')
    })

    afterEach(function () {
        cy.clearCookies()
    })
})