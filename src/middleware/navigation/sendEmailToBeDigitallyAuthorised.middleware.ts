import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import {
    getManageAuthorisedPeopleFullUrl,
    getSendEmailToBeDigitallyAuthorisedFullUrl
} from "../../lib/utils/urlUtils";
import { getExtraData } from "../../lib/utils/sessionUtils";

/**
 * Middleware to handle navigation logic for sending email to be digitally authorised.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the stack.
 */
export const sendEmailToBeDigitallyAuthorisedNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer = req.get("Referrer");
    const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
    const associationId = req.params.associationId;
    const sendEmailToBeDigitallyAuthorisedFullUrl = getSendEmailToBeDigitallyAuthorisedFullUrl(associationId);
    const managePeopleUrl = getManageAuthorisedPeopleFullUrl(
        constants.MANAGE_AUTHORISED_PEOPLE_URL,
        companyNumber
    );

    if (redirectPage(referrer, managePeopleUrl, sendEmailToBeDigitallyAuthorisedFullUrl, false)) {
        return res.redirect(constants.LANDING_URL);
    }

    next();
};
