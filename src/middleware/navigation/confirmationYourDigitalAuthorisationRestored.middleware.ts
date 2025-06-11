import { Request, Response, NextFunction } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger, { createLogMessage } from "../../lib/Logger";
import { CompanyNameAndNumber } from "../../types/utilTypes";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { getConfirmCompanyDetailsForRestoringYourDigitalAuthorisationFullUrl } from "../../lib/utils/urlUtils";

/**
 * Middleware to handle navigation after a digital authorisation has been restored.
 * Redirects the user to the landing page if certain conditions are met,
 * otherwise passes control to the next middleware.
 *
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The next middleware function
 */
export const confirmationYourDigitalAuthorisationRestoredNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer = req.get("Referrer");
    const confirmedCompanyForAssociation: CompanyNameAndNumber = getExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);

    logger.debug(
        createLogMessage(
            req.session,
            confirmationYourDigitalAuthorisationRestoredNavigation.name,
            `request to ${req.originalUrl}, calling redirectPage fn`
        ));

    const shouldRedirect = redirectPage(
        referrer,
        getConfirmCompanyDetailsForRestoringYourDigitalAuthorisationFullUrl(confirmedCompanyForAssociation.companyNumber),
        constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL,
        false
    );

    if (shouldRedirect) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
