import { CsrfProtectionMiddleware } from "@companieshouse/web-security-node";
import * as constants from "../constants";
import { sessionStore } from "./session.middleware";
import { isWhitelistedUrl } from "../lib/utils/urlUtils";
import { NextFunction, Request, Response } from "express";

/**
 * Middleware to handle CSRF protection for incoming requests.
 * If the request URL is whitelisted, the middleware bypasses CSRF protection.
 * Otherwise, it applies CSRF protection using the configured session store and cookie name.
 *
 * @param req - The incoming HTTP request object.
 * @param res - The outgoing HTTP response object.
 * @param next - The next middleware function in the chain.
 * @returns The result of the next middleware or the CSRF protection middleware.
 */
export const csrfProtectionMiddleware = (req: Request, res: Response, next: NextFunction): unknown => {
    if (isWhitelistedUrl(req.originalUrl)) {
        return next();
    }

    return CsrfProtectionMiddleware({
        sessionStore,
        enabled: true,
        sessionCookieName: constants.COOKIE_NAME
    })(req, res, next);
};
