
import logger from "../Logger";
import { Request } from "express";
import { SessionKey } from "@companieshouse/node-session-handler/lib/session/keys/SessionKey";
import { getLoggedInUserId } from "../../lib/utils/sessionUtils";

export const safeDebugCsrf = (req: Request):void => {
    try {
        const DEFAULT_CSRF_TOKEN_HEADER = "x-csrf-token";
        const DEFAULT_CSRF_TOKEN_PARAMETER_NAME = "_csrf";
        const sessionCsrfToken = req?.session?.get<string>(SessionKey.CsrfToken);
        const csrfTokenInRequest = req.body[DEFAULT_CSRF_TOKEN_PARAMETER_NAME] || req.headers[DEFAULT_CSRF_TOKEN_HEADER];
        const DEFAULT_CHS_SESSION_COOKIE_NAME = "_SID";

        const sessionTokenPresent = typeof sessionCsrfToken !== "undefined" && sessionCsrfToken !== null;
        const requestTokenPresent = typeof csrfTokenInRequest !== "undefined" && csrfTokenInRequest !== null;

        // Helper to create a small fingerprint of a token: length + first/last few chars
        const fingerprint = (t?: string | null): string => {
            if (!t) return "none";
            const trimmed = t.trim();
            if (trimmed.length <= 8) return `${trimmed}..`;
            const prefix = trimmed.slice(0, 5);
            const suffix = trimmed.slice(-3);
            return `${prefix}..${suffix}`;
        };

        const cookieValue = req.cookies ? req.cookies[DEFAULT_CHS_SESSION_COOKIE_NAME] : undefined;
        const hasSessionCookie = typeof cookieValue !== "undefined";
        logger.info(`CSRF debug: requestId=${req.requestId} method=${req.method} path=${req.originalUrl} ` +
            `sessionId=${fingerprint(req?.session?.data[SessionKey.Id])} ` +
            `userId=${getLoggedInUserId(req?.session)} ` +
            `hasSessionCookie=${hasSessionCookie} sessionCsrfTokenPresent=${sessionTokenPresent} ` +
            `sessionCsrfTokenFp=${fingerprint(sessionCsrfToken)} requestTokenPresent=${requestTokenPresent} ` +
            `requestCsrfTokenFp=${fingerprint(csrfTokenInRequest)}`);
    } catch (e) {
        logger.errorRequest(req, `CSRF debug logging failed: ${e}`);
    }
};
