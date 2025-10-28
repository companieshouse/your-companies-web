import { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";

/**
 * Express middleware that generates a unique request ID for each incoming request.
 *
 * The generated UUID is set on the request object as req.requestId.
 * It is used as "x-request-id" for outgoing requests.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export const requestIdGenerator = (req: Request, res: Response, next: NextFunction): void => {
    req.requestId = randomUUID().replace(/-/g, "");
    res.setHeader("X-Request-Id", req.requestId);
    next();
};
