import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

/**
 * Express middleware that generates or propagates a unique request ID.
 *
 * Sets the request ID on a custom property `req.requestId`,
 * and adds it to the response header as "x-request-id".
 */
export const requestIdGenerator = (req: Request, res: Response, next: NextFunction): void => {

    const requestIdHeader = req.headers["x-request-id"];
    let requestId: string;

    if (Array.isArray(requestIdHeader)) {
        requestId = requestIdHeader[0];
    } else if (typeof requestIdHeader === "string") {
        requestId = requestIdHeader;
    } else {
        requestId = uuidv4();
    }

    req.headers["x-request-id"] = requestId;
    res.setHeader("x-request-id", requestId);
    req.requestId = requestId;

    next();
};
