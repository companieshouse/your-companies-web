import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { CHS_URL, LANDING_URL, HEALTHCHECK } from "../constants";

const WHITELISTED_URLS: string[] = [
    LANDING_URL + HEALTHCHECK
];

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction): unknown => {

    if (isWhitelistedUrl(req.originalUrl)) {
        return next();
    }

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: CHS_URL,
        returnUrl: req.originalUrl
    };
    return authMiddleware(authMiddlewareConfig)(req, res, next);
};

const isWhitelistedUrl = (url: string): boolean => WHITELISTED_URLS.includes(url);
