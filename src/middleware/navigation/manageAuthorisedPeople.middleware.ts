import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { deleteExtraData, getExtraData } from "../../lib/utils/sessionUtils";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger, { createLogMessage } from "../../lib/Logger";
import {
    getAuthorisedPersonAddedFullUrl,
    getCheckPresenterFullUrl,
    getManageAuthorisedPeopleConfirmationEmailResentUrl,
    getManageAuthorisedPeopleUrl
} from "../../lib/utils/urlUtils";

/**
 * Middleware to handle navigation for managing authorised people.
 * Redirects the user to appropriate pages based on the current URL, referrer, and session data.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const manageAuthorisedPeopleNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer = req.get("Referrer");
    const companyNumber = req.params[constants.COMPANY_NUMBER];
    const removePageUrl = getExtraData(req.session, constants.REMOVE_URL_EXTRA);
    const manageAuthUrl = getManageAuthorisedPeopleUrl(companyNumber);

    const allowedEmailResentUrls = [
        getAuthorisedPersonAddedFullUrl(companyNumber),
        constants.CONFIRMATION_PERSON_REMOVED_URL
    ];

    deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    logger.debug(createLogMessage(req.session, manageAuthorisedPeopleNavigation.name, `request to ${req.originalUrl}, calling redirectPage fn`));

    if (shouldRedirectToLanding(req.originalUrl, constants.CONFIRMATION_PERSON_ADDED_URL, referrer, getCheckPresenterFullUrl(companyNumber), getAuthorisedPersonAddedFullUrl(companyNumber), pageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else if (shouldRedirectToLanding(req.originalUrl, constants.CONFIRMATION_PERSON_REMOVED_URL, referrer, removePageUrl, constants.CONFIRMATION_PERSON_REMOVED_URL, pageIndicator)) {
        deleteExtraData(req.session, constants.REMOVE_URL_EXTRA);
        res.redirect(constants.LANDING_URL);
    } else if (shouldRedirectToLanding(req.originalUrl, constants.AUTHORISATION_EMAIL_RESENT_URL, referrer, manageAuthUrl, getManageAuthorisedPeopleConfirmationEmailResentUrl(companyNumber), pageIndicator, allowedEmailResentUrls)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};

/**
 * Determines if the user should be redirected to the landing page.
 *
 * @param currentUrl - The current URL of the request
 * @param targetUrl - The target URL to match
 * @param referrer - The referrer URL from the request
 * @param expectedReferrer - The expected referrer URL
 * @param expectedTarget - The expected target URL
 * @param pageIndicator - The page indicator from session data
 * @param allowedUrls - Optional list of allowed URLs for additional validation
 * @returns A boolean indicating whether the user should be redirected
 */
const shouldRedirectToLanding = (
    currentUrl: string,
    targetUrl: string,
    referrer: string | undefined,
    expectedReferrer: string,
    expectedTarget: string,
    pageIndicator: string | undefined,
    allowedUrls?: string[]
): boolean => {
    return currentUrl.includes(targetUrl) &&
        redirectPage(referrer, expectedReferrer, expectedTarget, !!pageIndicator, allowedUrls);
};
