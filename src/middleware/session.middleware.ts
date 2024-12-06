import { SessionMiddleware, SessionStore, EnsureSessionCookiePresentMiddleware, CookieConfig } from "@companieshouse/node-session-handler";
import Redis from "ioredis";
import * as constants from "../constants";
import { isWhitelistedUrl } from "../lib/utils/urlUtils";
import { NextFunction, Request, RequestHandler, Response } from "express";

const environmentsWithInsecureCookies = [
    "local"
];

export const sessionStore = new SessionStore(new Redis(`redis://${constants.CACHE_SERVER}`));

const cookieConfig: CookieConfig = {
    cookieName: constants.COOKIE_NAME,
    cookieSecret: constants.COOKIE_SECRET,
    cookieDomain: constants.COOKIE_DOMAIN,
    cookieTimeToLiveInSeconds: parseInt(constants.DEFAULT_SESSION_EXPIRATION),
    cookieSecureFlag: constants.ENV_NAME !== undefined && !environmentsWithInsecureCookies.includes(constants.ENV_NAME)
};

export const sessionMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    if (isWhitelistedUrl(req.originalUrl)) {
        return next();
    }

    return SessionMiddleware(cookieConfig, sessionStore, true)(req, res, next);
};

export const ensureSessionCookiePresentMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    if (isWhitelistedUrl(req.originalUrl)) {
        return next();
    }
    console.log(req.cookies, "COOKIES REQUEST");

    return EnsureSessionCookiePresentMiddleware({
        ...cookieConfig
    })(req, res, next);
};
