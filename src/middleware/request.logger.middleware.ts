import { NextFunction, Request, Response } from "express";
import logger from "../lib/Logger";

/**
 * Middleware to log incoming HTTP requests and their corresponding responses.
 *
 * This middleware logs the request details when it starts and logs the response details
 * (including duration and status code) when the response is finished.
 *
 * NOTE: This middleware must appear below the `requestIdGenerator` middleware in the
 * middleware chain to function correctly, as it relies on the `x-request-id` header.
 *
 * @param req - The incoming HTTP request object.
 * @param res - The outgoing HTTP response object.
 * @param next - The next middleware function in the chain.
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    // Ignore the healthcheck route
    if (req.url.endsWith("/healthcheck")) {
        return next();
    }

    // Extract the request ID from the headers; log error & use UNKNOWN if not present
    let requestId = req.requestId;

    if (!requestId) {
        logger.error(`${requestLogger.name} - Request ID is missing. Ensure that the 'requestIdGenerator' middleware is called before this middleware.`);
        requestId = "UNKNOWN";
    }

    // Track request start time
    const startTime = process.hrtime();

    // Pre-process log
    logger.debugRequest(req, `${requestLogger.name} - OPEN request with requestId="${requestId}": ${req.method} ${req.originalUrl}`);

    // Post-process log
    res.once("finish", () => {
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const durationInMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
        logger.debug(`${requestLogger.name} - CLOSED request with requestId="${requestId}" after ${durationInMs}ms with status ${res.statusCode}`);
    });

    return next();
};
