import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { deleteExtraData, getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger from "../../lib/Logger";
import {
    getAuthenticationCodeRemoveUrl,
    getCompanyAuthProtectedAuthenticationCodeRemoveUrl,
    isReferrerIncludes
} from "../../lib/utils/urlUtils";

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

    logger.debug(`removeAuthorisedPersonNavigation: request to ${req.originalUrl}, calling redirectPage fn`);

    if (redirectPage(checkedReferrer, hrefA, getAuthenticationCodeRemoveUrl(userEmail), !!newPageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};

/**
 * Determines the checked referrer based on the provided referrer and hrefA.
 *
 * @param referrer - The referrer URL from the request headers.
 * @param hrefA - The stored referrer URL from the session.
 * @returns The appropriate referrer URL to use.
 */
const determineCheckedReferrer = (referrer: string | undefined, hrefA: string | undefined): string | undefined => {
    return referrer && isReferrerIncludes(referrer) ? hrefA : referrer;
};

/**
 * Determines the new page indicator based on the company number, page indicator, user emails, and user email.
 *
 * @param companyNumber - The company number from the request parameters.
 * @param pageIndicator - The current page indicator from the session.
 * @param userEmails - The array of user emails from the session.
 * @param userEmail - The user email from the request parameters.
 * @param req - The Express request object.
 * @returns The updated page indicator value.
 */
const determinePageIndicator = (
    companyNumber: string,
    pageIndicator: string | undefined,
    userEmails: string[],
    userEmail: string,
    req: Request
): boolean | string | undefined => {
    if (companyNumber === pageIndicator && userEmails.includes(userEmail)) {
        return true;
    } else {
        deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
        return pageIndicator;
    }
};
