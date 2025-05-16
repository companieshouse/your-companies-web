import { Request, Response, NextFunction } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { getExtraData } from "../../lib/utils/sessionUtils";
import logger, { createLogMessage } from "../../lib/Logger";
import { getFullUrl } from "../../lib/utils/urlUtils";

/**
 * Middleware to handle navigation after a company has been added.
 * Redirects the user to the landing page if certain conditions are met,
 * otherwise passes control to the next middleware.
 *
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The next middleware function
 */
export const companyAddedNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer = req.get("Referrer");
    const companyDetailsIndicator = getExtraData(req.session, constants.CONFIRM_COMPANY_DETAILS_INDICATOR);

    logger.debug(createLogMessage(req.session, companyAddedNavigation.name, `request to ${req.originalUrl}, calling redirectPage fn`));

    const shouldRedirect = redirectPage(
        referrer,
        getFullUrl(constants.CONFIRM_COMPANY_DETAILS_URL),
        constants.COMPANY_ADDED_SUCCESS_URL,
        companyDetailsIndicator
    );

    if (shouldRedirect) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
