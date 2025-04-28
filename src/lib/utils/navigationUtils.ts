import { Request } from "express";
import { deleteExtraData } from "./sessionUtils";
import { isReferrerIncludes } from "./urlUtils";
import * as constants from "../../constants";

/**
 * Determines the appropriate referrer to use based on the provided referrer and session data.
 *
 * @param referrer - The referrer from the request headers
 * @param hrefA - The referrer URL stored in the session
 * @returns The determined referrer URL
 */
export const determineCheckedReferrer = (referrer: string | undefined, hrefA: string | undefined): string | undefined => {
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
export const determinePageIndicator = (
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
