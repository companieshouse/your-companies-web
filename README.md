# your-companies-web

This is a web frontend for the Your Companies journey. It was created based on [Typescript Web Starter for Companies House](https://github.com/companieshouse/node-review-web-starter-ts).

The documentation of the project is available on [Confluence](https://companieshouse.atlassian.net/wiki/spaces/IDV/pages/4370104473/Delivery+Documentation+Team+Inugami).

## Frontend technologies and utils

- [NodeJS](https://nodejs.org/)
- [ExpressJS](https://expressjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Nunjucks](https://mozilla.github.io/nunjucks)
- [GOV.UK Design System](https://design-system.service.gov.uk/)
- [Jest](https://jestjs.io)
- [SuperTest](https://www.npmjs.com/package/supertest)
- [Git](https://git-scm.com/downloads)

## Installing and running

### Requirements

1. node v20 (engines block in package.json is used to enforce this)
2. npm v10 (engines block in package.json is used to enforce this)

Having cloned the project into your project root, run the following commands:

``` cd your-companies-web```

```npm install```

### SSL set-up

If you wish to work with ssl-enabled endpoints locally, ensure you turn the `NODE_SSL_ENABLED` property to `ON` in the config and also provide paths to your private key and certificate.

### Running the app with Docker

To allow connection to the app:
1. Connect to the VPN
2. Connect to AWS Servers
3. Ensure Docker Desktop is open

To activate required modules and services:
1. Locate to the ``` docker-chs-development ``` directory in your console.
2. Run the following commands:

``` .bin/chs-dev modules enable platform ```

``` .bin.chs-dev development enable cdn-ch-gov-uk ```

``` .bin.chs-dev development enable your-companies-web ```

``` .bin.chs-dev services enable your-companies-web ```

To check required modules and services have been activated, run:

``` .bin/chs-dev status ```

If required, checkout the ``` accounts-association-api ``` branch, as this hasn't been merged with main yet, and contains the ``` docker-compose.yaml ``` file required for the application to run in Docker.

To start the application, run ``` tilt up ```, and press 'space' to open tilt in your browser.
Wait for all the resources to finish updating successfully, making sure to re-run any with errors once others have finished.

To open open the application, in your browser, enter http://chs.local/your-companies.

To login to the application enter the email: ``` demo@ch.gov.uk ```, and password: ``` password ```

### Running the tests

To run the tests, type the following command in the terminal:

``` npm test ```

To get a test coverage report, run:

```npm run test:coverage```