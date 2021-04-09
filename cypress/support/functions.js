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
    let hour = parseInt(Cypress.dayjs().format('H'));
    let min = parseInt(Cypress.dayjs().format('m'));
    let sec = parseInt(Cypress.dayjs().format('s'));

    let curTime = ((hour * 60 * 60) + (min * 60) + sec) * 1000
    let targetTime = ((timeHour * 60 * 60) + (timeMin * 60)) * 1000;

    let waitTime = targetTime - curTime

    cy.log(targetTime)
    cy.log(hour + " " + min + " " + sec)

    return waitTime
}