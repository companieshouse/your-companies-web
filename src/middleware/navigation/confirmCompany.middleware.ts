import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger, { createLogMessage } from "../../lib/Logger";
import { deleteExtraData } from "../../lib/utils/sessionUtils";

/**
 * Middleware to handle navigation logic for confirming a company.
 * It clears specific session data, logs the request, and redirects
 * to the landing page if certain conditions are met. Otherwise, it
 * proceeds to the next middleware.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the stack.
 */
export const confirmCompanyNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer = req.get("Referrer");
    const pageIndicator = false;

    clearSessionData(req);
    logRequest(req);

    if (shouldRedirect(referrer, pageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};

/**
 * Clears specific session data related to company navigation.
 *
 * @param req - The HTTP request object.
 */
const clearSessionData = (req: Request): void => {
    deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    deleteExtraData(req.session, constants.CURRENT_COMPANY_NUM);
};

/**
 * Logs the navigation request for debugging purposes.
 *
 * @param req - The HTTP request object.
 */
const logRequest = (req: Request): void => {
    logger.debug(createLogMessage(req.session, confirmCompanyNavigation.name, `request to ${req.originalUrl}, calling redirectPage fn`));
};

/**
 * Determines whether the user should be redirected based on the referrer and page indicator.
 *
 * @param referrer - The referrer URL from the request headers.
 * @param pageIndicator - A boolean indicating the page state.
 * @returns A boolean indicating whether a redirect should occur.
 */
const shouldRedirect = (referrer: string | undefined, pageIndicator: boolean): boolean => {
    return redirectPage(
        referrer,
        constants.ADD_COMPANY_URL,
        constants.CONFIRM_COMPANY_DETAILS_URL,
        pageIndicator,
        [constants.COMPANY_ADDED_SUCCESS_URL]
    );
};
