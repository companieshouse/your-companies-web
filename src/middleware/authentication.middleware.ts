import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { CHS_URL } from "../constants";
import logger, { createLogMessage } from "../lib/Logger";
import { isWhitelistedUrl } from "../lib/utils/urlUtils";

/**
 * Middleware to handle authentication for incoming requests.
 *
 * If the requested URL is whitelisted, authentication is skipped.
 * Otherwise, the authentication middleware is applied with the provided configuration.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the stack.
 * @returns The result of the next middleware or the authentication middleware.
 */
export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction): unknown => {
    if (isWhitelistedUrl(req.originalUrl)) {
        logger.debug(createLogMessage(req.session, authenticationMiddleware.name, "whitelist endpoint called, skipping authentication."));
        return next();
    }

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: CHS_URL,
        returnUrl: req.originalUrl
    };

    return authMiddleware(authMiddlewareConfig)(req, res, next);
};
