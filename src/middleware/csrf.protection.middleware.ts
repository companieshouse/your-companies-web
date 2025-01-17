import { CsrfProtectionMiddleware } from "@companieshouse/web-security-node";
import * as constants from "../constants";
import { sessionStore } from "./session.middleware";
import { isWhitelistedUrl } from "../lib/utils/urlUtils";
import { NextFunction, Request, Response } from "express";

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
