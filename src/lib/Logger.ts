import { createLogger } from "@companieshouse/structured-logging-node";
import ApplicationLogger from "@companieshouse/structured-logging-node/lib/ApplicationLogger";

const logger: ApplicationLogger = createLogger(process.env.APP_NAME ?? "");

/**
 * Creates an error object with the given description and logs the error stack trace.
 * @param description - A string describing the error.
 * @returns The created Error object.
 */
export const createAndLogError = (description: string): Error => {
    const error = new Error(description);
    logger.error(`${error.stack}`);
    return error;
};

// tslint:disable-next-line:no-console
console.log(`env.LOG_LEVEL set to ${process.env.LOG_LEVEL}`);

export default logger;
