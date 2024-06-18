import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import logger from "../../lib/Logger";
import { isRemovingThemselves } from "../../lib/utils/removeThemselves";
import { companyAuthenticationMiddleware } from "../company.authentication";
import { Session } from "@companieshouse/node-session-handler";

export const removeAuthorisedPersonCompanyAuth = (req: Request, res: Response, next: NextFunction): unknown => {
    const userEmail = req.params[constants.USER_EMAIL];
    const companyNumber = req.params[constants.COMPANY_NUMBER];

    if (isRemovingThemselves(req.session as Session, userEmail)) {
        logger.debug(`user is removing themselves from ${companyNumber}, company auth not required`);
        return next();
    }
    logger.debug(`redirecting to company auth, removing a user from ${companyNumber}`);
    return companyAuthenticationMiddleware(req, res, next);
};
