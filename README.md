# Introduction 
These are the Cypress tests which cover the functionality and UI of Delta.

# Getting Started
To run locally, install the dependancies by running `npm install` inside the root folder.

Create `cypress.env.json` inside the root folder, and enter in the token variable:

```
{
  "id": {1 or 2},
}
```

# Build and Test=
To open the test runner use `npx cypress open` inside the root folder then select the spec file to run

To run in the terminal use `npx cypress run` to run every spec file
Can add the optional flag `--spec` followed by the relative path to the spec file
    E.g. `npx cypress run --spec "cypress/integration/TenderManager.spec.js"`