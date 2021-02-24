export function GetServer () {
    var live

    const url = Cypress.config().baseUrl;
    if (url.includes('https://www.delta-esourcing.com/')) {
        live = true;
        console.log('On live, dont run certain tests');
    } else {
        live = false;
        console.log('Not on live, run every test');
    }

    Cypress.env('live', live)
}

export function GetWaitTime(timeMin, timeHour) {
    let min = parseInt(Cypress.moment().format('m'));
    let hour = parseInt(Cypress.moment().format('H'));
    let curTime = (hour * 60) + min;

    let targetTime = (timeHour * 60) + timeMin;

    let waitTime = (targetTime - curTime) * 60 * 1000

    cy.log(targetTime)
    cy.log(curTime)
    cy.log(waitTime)

    return waitTime
}