import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger, { createLogMessage } from "../../lib/Logger";
import { deleteExtraData, getExtraData } from "../../lib/utils/sessionUtils";
import { tryRestoringYourDigitalAuthorisationFullUrl } from "../../lib/utils/urlUtils";
import { CompanyNameAndNumber } from "../../types/utilTypes";

/**
 * Middleware to handle navigation logic for trying to restore
 * your digital authorisation.
 * It clears specific session data, logs the request, and redirects
 * to the landing page if certain conditions are met. Otherwise, it
 * proceeds to the next middleware.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the stack.
 */
export const tryRestoringYourDigitalAuthorisationNavigation = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const referrer = req.get("Referrer");
    const companyNumber = req.params[constants.COMPANY_NUMBER];
    const confirmedCompanyForAssociation: CompanyNameAndNumber = getExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);
    const pageIndicator = companyNumber === confirmedCompanyForAssociation.companyNumber;

    clearSessionData(req);
    logRequest(req);

    if (shouldRedirect(referrer, pageIndicator, companyNumber)) {
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
    logger.debug(
        createLogMessage(
            req.session,
            tryRestoringYourDigitalAuthorisationNavigation.name,
            `request to ${req.originalUrl}, calling redirectPage fn`
        ));
};

/**
 * Determines whether the user should be redirected based on the referrer and page indicator.
 *
 * @param referrer - The referrer URL from the request headers.
 * @param pageIndicator - A boolean indicating the page state.
 * @returns A boolean indicating whether a redirect should occur.
 */
const shouldRedirect = (referrer: string | undefined, pageIndicator: boolean, companyNumber: string): boolean => {
    return redirectPage(
        referrer,
        constants.CONFIRM_COMPANY_DETAILS_FOR_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL,
        tryRestoringYourDigitalAuthorisationFullUrl(companyNumber),
        pageIndicator
    );
};
