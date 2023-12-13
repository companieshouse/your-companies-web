
# your-companies-web

This a web frontend for the Your Companies journey. It was created based on [Typescript Web Starter for Companies House](https://github.com/companieshouse/node-review-web-starter-ts).

The documentation of the project is available on [Confluence](https://companieshouse.atlassian.net/wiki/spaces/IDV/pages/4370104473/Delivery+Documentation+Team+Inugami).

## Installing and running

Having cloned the project into your project root, run the following commands:

``` cd your-companies-web```

```npm install```

### SSL Set-up

If you wish to work with ssl-enabled endpoints locally, ensure you turn the `NODE_SSL_ENABLED` property to `ON` in the config and also provide paths to your private key and certificate.

### Running the App locally

To start the application, run:

``` npm start ```

or, to watch for changes with auto restart in your dev environment, run:

``` npm run start:watch ```

...and navigate to http://localhost:3000/ (or whatever hostname/port number combination you've changed the config values to)

For SSL connections, navigate to https://localhost:3443

### Running the Tests

To run the tests, type the following command:

``` npm test ```

To get a summarised test coverage report, run:

```npm run coverage```

For a detailed test coverage report, run one of the following commands:

```npm run coverage:report```

or

```npm run test:coverage```
