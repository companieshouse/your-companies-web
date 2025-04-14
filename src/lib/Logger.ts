// Importing the `createLogger` function and `ApplicationLogger` type from the structured logging library.
import { createLogger } from "@companieshouse/structured-logging-node";
import ApplicationLogger from "@companieshouse/structured-logging-node/lib/ApplicationLogger";

// Creating a logger instance using the application name from the environment variable `APP_NAME`.
// If `APP_NAME` is not set, an empty string is used as the default.
const logger: ApplicationLogger = createLogger(process.env.APP_NAME ?? "");

/**
 * Creates an error object with the given description and logs the error stack trace.
 * @param description - A string describing the error.
 * @returns The created Error object.
 */
export const createAndLogError = (description: string): Error => {
    const error = new Error(description); // Create a new Error object with the provided description.
    logger.error(`${error.stack}`); // Log the error stack trace using the logger.
    return error; // Return the created Error object.
};

// Log the current log level to the console for debugging purposes.
// tslint:disable-next-line:no-console
console.log(`env.LOG_LEVEL set to ${process.env.LOG_LEVEL}`);

// Export the logger instance as the default export of this module.
export default logger;
