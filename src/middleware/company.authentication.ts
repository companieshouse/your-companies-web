import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import * as constants from "../constants";

// We are checking if the current user is authorised for a company / company number
// based on the value passed in the url (req.params)

export const companyAuthenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const companyNumber: string | undefined = req.params[constants.COMPANY_NUMBER];

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: constants.CHS_URL,
        returnUrl: req.originalUrl,
        companyNumber: companyNumber
    };

    return authMiddleware(authMiddlewareConfig)(req, res, next);
};
