import { SessionMiddleware, SessionStore, EnsureSessionCookiePresentMiddleware, CookieConfig } from "@companieshouse/node-session-handler";
import Redis from "ioredis";
import * as constants from "../constants";
import { isWhitelistedUrl } from "../lib/utils/urlUtils";
import { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * List of environments where cookies are not required to be secure.
 */
const environmentsWithInsecureCookies = ["local"];

/**
 * Initializes the session store using Redis.
 */
export const sessionStore = new SessionStore(new Redis(`redis://${constants.CACHE_SERVER}`));

/**
 * Configuration for session cookies.
 */
const cookieConfig: CookieConfig = {
    cookieName: constants.COOKIE_NAME,
    cookieSecret: constants.COOKIE_SECRET,
    cookieDomain: constants.COOKIE_DOMAIN,
    cookieTimeToLiveInSeconds: parseInt(constants.DEFAULT_SESSION_EXPIRATION),
    cookieSecureFlag: constants.ENV_NAME !== undefined && !environmentsWithInsecureCookies.includes(constants.ENV_NAME)
};

/**
 * Middleware to handle session management. Skips session handling for whitelisted URLs.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the stack.
 */
export const sessionMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    if (isWhitelistedUrl(req.originalUrl)) {
        return next();
    }
    return SessionMiddleware(cookieConfig, sessionStore, true)(req, res, next);
};

/**
 * Middleware to ensure the session cookie is present. Skips validation for whitelisted URLs.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the stack.
 */
export const ensureSessionCookiePresentMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    if (isWhitelistedUrl(req.originalUrl)) {
        return next();
    }
    return EnsureSessionCookiePresentMiddleware({ ...cookieConfig })(req, res, next);
};
