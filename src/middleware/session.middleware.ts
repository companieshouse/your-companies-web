import { SessionMiddleware, SessionStore, EnsureSessionCookiePresentMiddleware, CookieConfig } from "@companieshouse/node-session-handler";
import Redis from "ioredis";
import * as constants from "../constants";

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
}

export const sessionMiddleware = SessionMiddleware(
    cookieConfig, sessionStore, true);

export const ensureSessionCookiePresentMiddleware = EnsureSessionCookiePresentMiddleware({
    ...cookieConfig
});