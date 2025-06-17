import { Request, Response, NextFunction } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger, { createLogMessage } from "../../lib/Logger";
import { CompanyNameAndNumber } from "../../types/utilTypes";
import { getExtraData } from "../../lib/utils/sessionUtils";
import {
    getConfirmCompanyDetailsForRestoringYourDigitalAuthorisationFullUrl,
    getTryRestoringYourDigitalAuthorisationFullUrl
} from "../../lib/utils/urlUtils";

/**
 * Middleware to handle navigation for trying to restore a digital authorisation.
 * Redirects the user to the landing page if certain conditions are met,
 * otherwise passes control to the next middleware.
 *
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The next middleware function
 */
export const tryRestoringYourDigitalAuthorisationNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer = req.get("Referrer");
    const confirmedCompanyForAssociation: CompanyNameAndNumber = getExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);

    logger.debug(
        createLogMessage(
            req.session,
            tryRestoringYourDigitalAuthorisationNavigation.name,
            `request to ${req.originalUrl}, calling redirectPage fn`
        ));

    const previousUrl = referrer?.includes(constants.ACCOUNT_URL)
        ? constants.ACCOUNT_URL
        : getConfirmCompanyDetailsForRestoringYourDigitalAuthorisationFullUrl(confirmedCompanyForAssociation?.companyNumber);

    const shouldRedirect = redirectPage(
        referrer,
        previousUrl,
        getTryRestoringYourDigitalAuthorisationFullUrl(confirmedCompanyForAssociation.companyNumber),
        false
    );

    if (shouldRedirect) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
