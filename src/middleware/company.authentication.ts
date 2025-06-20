import { NextFunction, Request, Response } from "express";
import * as constants from "../constants";
import logger, { createLogMessage } from "../lib/Logger";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";

/**
 * Middleware to authenticate a user for a specific company based on the company number
 * provided in the request parameters.
 *
 * @param req - forceAuthCode - boolean indicating whether to force the use of an authentication code
 * @returns Company authentication middleware function
 */
export const createCompanyAuthenticationMiddleware = (forceAuthCode: boolean) => {
    return (req: Request, res: Response, next: NextFunction): unknown => {
        const companyNumber: string | undefined = req.params[constants.COMPANY_NUMBER];

        logger.debug(createLogMessage(req.session, "companyAuthenticationMiddleware",
            `starting web security node check: 
        returnUrl: ${req.originalUrl},
        chsWebUrl: ${constants.CHS_URL},
        companyNumber: ${companyNumber},
        forceAuthCode: ${forceAuthCode} 
        `));

        const authMiddlewareConfig: AuthOptions = {
            chsWebUrl: constants.CHS_URL,
            returnUrl: req.originalUrl,
            companyNumber: companyNumber,
            forceAuthCode
        };

        return authMiddleware(authMiddlewareConfig)(req, res, next);
    };
};

export const forceCompanyAuthenticationMiddleware = createCompanyAuthenticationMiddleware(true);
export const companyAuthenticationMiddleware = createCompanyAuthenticationMiddleware(false);
