import { NextFunction, Request, Response } from "express";
import * as constants from "../constants";
import logger, { createLogMessage } from "../lib/Logger";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";

interface AuthOptionsExtended extends AuthOptions {
  disableSaveCompanyCheckbox: boolean;
}

export const createCompanyAuthenticationMiddleware = (disableSaveCompanyCheckbox: boolean) => {
    return (req: Request, res: Response, next: NextFunction): unknown => {
        const companyNumber: string | undefined = req.params[constants.COMPANY_NUMBER];

        logger.debug(createLogMessage(req.session, "companyAuthenticationMiddleware",
            `starting web security node check: 
        returnUrl: ${req.originalUrl},
        chsWebUrl: ${constants.CHS_URL},
        companyNumber: ${companyNumber},
        disableSaveCompanyCheckbox: ${disableSaveCompanyCheckbox} 
        `));

        const authMiddlewareConfig: AuthOptionsExtended = {
            chsWebUrl: constants.CHS_URL,
            returnUrl: req.originalUrl,
            companyNumber: companyNumber,
            disableSaveCompanyCheckbox: disableSaveCompanyCheckbox
        };

        return authMiddleware(authMiddlewareConfig)(req, res, next);
    };
};

export const CompanyAuthenticationMiddlewareCheckboxDisabled = createCompanyAuthenticationMiddleware(true);
export const companyAuthenticationMiddleware = createCompanyAuthenticationMiddleware(false);
