import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { CHS_URL, LANDING_URL, HEALTHCHECK } from "../constants";
import logger from "../lib/Logger";
import { isWhitelistedUrl } from "../lib/utils/urlUtils";

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction): unknown => {

    if (isWhitelistedUrl(req.originalUrl)) {
        logger.debug("whitelist endpoint called, skipping authentication.");
        return next();
    }

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: CHS_URL,
        returnUrl: req.originalUrl
    };
    return authMiddleware(authMiddlewareConfig)(req, res, next);
};
