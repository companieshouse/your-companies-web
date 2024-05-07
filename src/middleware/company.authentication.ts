import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import * as constants from "../constants";
import logger from "../lib/Logger";
// We are checking if the current user is authorised for a company / company number
// based on the value passed in the url (req.params)

export const companyAuthenticationMiddleware = (req: Request, res: Response, next: NextFunction): unknown => {

    const companyNumber: string | undefined = req.params[constants.COMPANY_NUMBER];
    logger.debug(`starting web security node check: 
    returnUrl: ${req.originalUrl},
    chsWebUrl: ${constants.CHS_URL},
    companyNumber: ${companyNumber}
    `);
    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: constants.CHS_URL,
        returnUrl: req.originalUrl,
        companyNumber: companyNumber
    };

    return authMiddleware(authMiddlewareConfig)(req, res, next);
};
