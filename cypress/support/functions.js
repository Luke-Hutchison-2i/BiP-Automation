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