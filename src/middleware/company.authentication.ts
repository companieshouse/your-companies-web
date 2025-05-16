import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import * as constants from "../constants";
import logger, { createLogMessage } from "../lib/Logger";

/**
 * Middleware to authenticate a user for a specific company based on the company number
 * provided in the request parameters.
 *
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The next middleware function in the stack
 * @returns A call to the authentication middleware
 */
export const companyAuthenticationMiddleware = (req: Request, res: Response, next: NextFunction): unknown => {
    const companyNumber: string | undefined = req.params[constants.COMPANY_NUMBER];

    logger.debug(createLogMessage(req.session, companyAuthenticationMiddleware.name,
        `starting web security node check: 
    returnUrl: ${req.originalUrl},
    chsWebUrl: ${constants.CHS_URL},
    companyNumber: ${companyNumber}
    `));

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: constants.CHS_URL,
        returnUrl: req.originalUrl,
        companyNumber: companyNumber
    };

    return authMiddleware(authMiddlewareConfig)(req, res, next);
};
