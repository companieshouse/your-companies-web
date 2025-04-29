import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import {
    getExtraData,
    setExtraData
} from "../../lib/utils/sessionUtils";
import logger, { createLogMessage } from "../../lib/Logger";
import {
    getCancelPersonUrl,
    getCompanyAuthProtectedCancelPersonFullUrl
} from "../../lib/utils/urlUtils";
import { determineCheckedReferrer, determinePageIndicator } from "../../lib/utils/navigationUtils";

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

    logger.debug(createLogMessage(req.session, cancelPersonNavigation.name, `request to ${req.originalUrl}, calling redirectPage fn`));

    if (redirectPage(checkedReferrer, hrefA, getCancelPersonUrl(userEmail), !!newPageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
