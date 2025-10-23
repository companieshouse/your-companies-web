import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import logger, { createLogMessage } from "../../lib/Logger";
import { isRemovingThemselvesById } from "../../lib/utils/removeThemselves";
import { companyAuthenticationMiddlewareCheckboxDisabled } from "../company.authentication";
import { Session } from "@companieshouse/node-session-handler";

/**
 * Middleware to handle the removal of an authorized person from a company.
 *
 * If the user is attempting to remove themselves, the middleware bypasses
 * the company authentication step. Otherwise, it redirects to the company
 * authentication middleware.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the chain.
 * @returns Calls the next middleware or redirects to company authentication.
 */
export const removeAuthorisedPersonCompanyAuth = (req: Request, res: Response, next: NextFunction): unknown => {
    const idParam = req.params[constants.ASSOCIATIONS_ID];

    if (isRemovingThemselvesById(req.session as Session, idParam)) {
        logger.debug(createLogMessage(req, removeAuthorisedPersonCompanyAuth.name, `User is removing themselves from company, company authentication not required.`));
        return next();
    }

    logger.debug(createLogMessage(req, removeAuthorisedPersonCompanyAuth.name, `Redirecting to company authentication, removing a user with id ${idParam}.`));
    return companyAuthenticationMiddlewareCheckboxDisabled(req, res, next);
};
