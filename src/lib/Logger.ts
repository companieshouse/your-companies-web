import { createLogger } from "@companieshouse/structured-logging-node";
import ApplicationLogger from "@companieshouse/structured-logging-node/lib/ApplicationLogger";
import { getLoggedInUserId } from "./utils/sessionUtils";
import { Request } from "express";

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

/**
 * Creates a log message for the specified function.
 * @param req -
 * @param functionName - The name of the function being logged.
 * @param message - The log message.
 * @returns The formatted log message.
 */
export const createLogMessage = (req: Request, functionName: string, message: string): string => {
    const loggedInUserId = getLoggedInUserId(req?.session);
    return `Request ID: ${req?.requestId ?? "unknown"} Function: ${functionName}, User ID: ${loggedInUserId ?? "unknown"}, Message: ${message}`;
};

// tslint:disable-next-line:no-console
console.log(`env.LOG_LEVEL set to ${process.env.LOG_LEVEL}`);

export default logger;
