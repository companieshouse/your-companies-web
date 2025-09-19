# your-companies-web

This is a web frontend for the Your Companies journey. It was created based on [Typescript Web Starter for Companies House](https://github.com/companieshouse/node-review-web-starter-ts).

The documentation of the project is available on [Confluence](https://companieshouse.atlassian.net/wiki/spaces/IDV/pages/4370104473/Delivery+Documentation+Team+Inugami).

Environment variables used to configure this service in docker are located in the file `services/modules/your-companies/your-companies-web.docker-compose.yaml`

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

```npm run build```

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

``` chs-dev services enable your-companies-web ```

``` chs-dev development enable your-companies-web ```

To check required modules and services have been activated, run:

``` chs-dev status ```

To start the application, run ``` chs-dev up ``` in your terminal.

Wait until all the resources have started up successfully, when you will see the message ``` Service: your-companies-web ready! ```. 
You may need to run ``` chs-dev up ``` again if certain services are 'unhealthy'.

To open open the application, in your browser, enter http://chs.local/your-companies.

To login to the application enter the email: ``` demo@ch.gov.uk ```, and password: ``` password ```

Alternatively, you can enter the email of a user from the test data in the database.

### Running the tests

To run the tests, type the following command:

``` npm test ```

To get a test coverage report, run:

```npm run test:coverage```

#### Seeding Test data for ad hoc testing

Use the [Mongo Test Data Generator Script](./tools/seed-mongodb/README.md)