import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import {
    deleteExtraData,
    getExtraData,
    setExtraData
} from "../../lib/utils/sessionUtils";
import logger from "../../lib/Logger";
import {
    getCancelPersonUrl,
    getCompanyAuthProtectedCancelPersonFullUrl,
    isReferrerIncludes
} from "../../lib/utils/urlUtils";

/**
 * Middleware to handle navigation logic for canceling a person.
 * It determines the appropriate redirection or continuation of the request based on session data and referrer.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const cancelPersonNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer = req.get("Referrer");
    const hrefA = getExtraData(req.session, constants.REFERER_URL);
    const userEmail = req.params[constants.USER_EMAIL];
    const companyNumber = req.params[constants.COMPANY_NUMBER];
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    const cancelPageUrl = getCompanyAuthProtectedCancelPersonFullUrl(companyNumber, userEmail);
    const userEmails = getExtraData(req.session, constants.USER_EMAILS_ARRAY);

    setExtraData(req.session, constants.CANCEL_URL_EXTRA, cancelPageUrl);

    const checkedReferrer = determineCheckedReferrer(referrer, hrefA);
    const newPageIndicator = determinePageIndicator(
        companyNumber || "",
        pageIndicator || "",
        Array.isArray(userEmails) ? userEmails : [],
        userEmail || "",
        req
    );

    logger.debug(`cancelPersonNavigation: request to ${req.originalUrl}, calling redirectPage fn`);

    if (redirectPage(checkedReferrer, hrefA, getCancelPersonUrl(userEmail), !!newPageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};

/**
 * Determines the appropriate referrer to use based on the provided referrer and session data.
 *
 * @param referrer - The referrer from the request headers
 * @param hrefA - The referrer URL stored in the session
 * @returns The determined referrer URL
 */
const determineCheckedReferrer = (referrer: string | undefined, hrefA: string | undefined): string | undefined => {
    return referrer && isReferrerIncludes(referrer) ? hrefA : referrer;
};

/**
 * Determines the new page indicator value based on the company number, session data, and user email.
 *
 * @param companyNumber - The company number from the request parameters
 * @param pageIndicator - The current page indicator stored in the session
 * @param userEmails - The array of user emails stored in the session
 * @param userEmail - The user email from the request parameters
 * @param req - Express request object
 * @returns The new page indicator value
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
