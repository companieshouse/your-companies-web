import { NextFunction, Request, Response } from "express";
import logger from "../lib/Logger";
import { performance } from "node:perf_hooks";

/**
 * Middleware to log incoming HTTP requests and their corresponding responses.
 *
 * This middleware logs the request details when it starts and logs the response details
 * (including duration and status code) when the response is finished.
 *
 * NOTE: This middleware must appear below the `requestIdGenerator` middleware in the
 * middleware chain to function correctly, as it relies on req.requestId.
 *
 * @param req - The incoming HTTP request object.
 * @param res - The outgoing HTTP response object.
 * @param next - The next middleware function in the chain.
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    if (req.url.endsWith("/healthcheck")) return next();

    const requestId = req.requestId ?? "UNKNOWN";
    if (requestId === "UNKNOWN") {
        logger.error(`${requestLogger.name} - Missing requestId. Ensure 'requestIdGenerator' middleware runs first.`);
    }

    const start = performance.now();

    logger.debugRequest(req, `${requestLogger.name} - OPEN [${requestId}]: ${req.method} ${req.originalUrl}`);

    res.once("finish", () => {
        const duration = (performance.now() - start).toFixed(2);
        logger.debug(`${requestLogger.name} - CLOSED [${requestId}] after ${duration}ms with status ${res.statusCode}`);
    });

    res.once("close", () => {
        if (!res.writableEnded) {
            logger.error(`${requestLogger.name} - ABORTED [${requestId}] before completion`);
        }
    });

    next();
};
