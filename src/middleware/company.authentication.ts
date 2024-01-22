import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import * as constants from "../constants";
import { Session } from "@companieshouse/node-session-handler";

// We are checking if the current user is authorised for a company / company number
// based on the value stored in the session
// This can be changed to a number passed in the url (req.params)

export const companyAuthenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const session: Session = req.session as Session;
    const companyNumber: string | undefined = session?.getExtraData(constants.COMPANY_NUMBER);

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: constants.CHS_URL,
        returnUrl: req.originalUrl,
        companyNumber: companyNumber
    };

    return authMiddleware(authMiddlewareConfig)(req, res, next);
};
