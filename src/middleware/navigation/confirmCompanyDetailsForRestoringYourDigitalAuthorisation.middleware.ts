import { Request, Response, NextFunction } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger, { createLogMessage } from "../../lib/Logger";
import {
    getConfirmCompanyDetailsForRestoringYourDigitalAuthorisationFullUrl
} from "../../lib/utils/urlUtils";

/**
 * Middleware to handle navigation logic for confirming a company
 * details for restoring your digital authorisation.
 * Redirects the user to the landing page if certain conditions are met,
 * otherwise passes control to the next middleware.
 *
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The next middleware function
 */
export const confirmCompanyDetailsForRestoringYourDigitalAuthorisationNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer = req.get("Referrer");
    const companyNumber: string = req.params[constants.COMPANY_NUMBER];

    logger.debug(
        createLogMessage(
            req.session,
            confirmCompanyDetailsForRestoringYourDigitalAuthorisationNavigation.name,
            `request to ${req.originalUrl}, calling redirectPage fn`
        ));

    const shouldRedirect = redirectPage(
        referrer,
        constants.LANDING_URL,
        getConfirmCompanyDetailsForRestoringYourDigitalAuthorisationFullUrl(companyNumber),
        false
    );

    if (shouldRedirect) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
