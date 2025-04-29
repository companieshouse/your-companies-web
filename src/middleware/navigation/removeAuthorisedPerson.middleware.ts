import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger, { createLogMessage } from "../../lib/Logger";
import {
    getAuthenticationCodeRemoveUrl,
    getCompanyAuthProtectedAuthenticationCodeRemoveUrl
} from "../../lib/utils/urlUtils";
import { determineCheckedReferrer, determinePageIndicator } from "../../lib/utils/navigationUtils";

/**
 * Middleware to handle navigation logic for removing an authorised person.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
export const removeAuthorisedPersonNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer = req.get("Referrer");
    const hrefA = getExtraData(req.session, constants.REFERER_URL);
    const userEmail = req.params[constants.USER_EMAIL];
    const companyNumber = req.params[constants.COMPANY_NUMBER];
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    const removePageUrl = getCompanyAuthProtectedAuthenticationCodeRemoveUrl(companyNumber, userEmail);
    const userEmails = getExtraData(req.session, constants.USER_EMAILS_ARRAY);

    const checkedReferrer = determineCheckedReferrer(referrer, hrefA);
    const newPageIndicator = determinePageIndicator(companyNumber, pageIndicator, userEmails, userEmail, req);

    setExtraData(req.session, constants.REMOVE_URL_EXTRA, removePageUrl);

    logger.debug(createLogMessage(req.session, removeAuthorisedPersonNavigation.name, `request to ${req.originalUrl}, calling redirectPage fn`));

    if (redirectPage(checkedReferrer, hrefA, getAuthenticationCodeRemoveUrl(userEmail), !!newPageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
