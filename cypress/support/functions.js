export function GetServer () {
    var live = false;
    var dev = false;

    const url = Cypress.config().baseUrl;
    if (url.includes('https://www.delta-esourcing.com')) {
        live = true;
        console.log('On live, dont run certain tests');
    } else if (url.includes('dev')) {
        dev = true;
        console.log('On dev');
    } else {
        live = false;
        dev = false
        console.log('Not on live, run every test');
    }

    Cypress.env('live', live)
    Cypress.env('dev', dev)
}

export function GetWaitTime(timeMin, timeHour) {
    let hour = parseInt(Cypress.dayjs().utc().format('H')) + 1; // Temporary: The Cypress servers were stuck on UTC time, so had to add an hour to match BST
    let min = parseInt(Cypress.dayjs().format('m'));
    let sec = parseInt(Cypress.dayjs().format('s'));

    let curTime = ((hour * 60 * 60) + (min * 60) + sec) * 1000
    let targetTime = ((timeHour * 60 * 60) + (timeMin * 60)) * 1000;

    let waitTime = targetTime - curTime

    cy.log(targetTime)
    cy.log(hour + " " + min + " " + sec)

    return waitTime
}

export function GetSupplier() {
    cy.fixture('logins.json').then((logins) => {
        return logins[Cypress.env('id')].supplier
    })
}