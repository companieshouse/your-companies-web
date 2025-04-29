import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { deleteExtraData, getExtraData } from "../../lib/utils/sessionUtils";
import logger, { createLogMessage } from "../../lib/Logger";
import {
    getAddPresenterUrl,
    getAuthorisedPersonAddedFullUrl,
    getCheckPresenterUrl,
    getPresenterAlreadyAddedUrl
} from "../../lib/utils/urlUtils";

/**
 * Middleware to handle navigation logic for presenter-related pages.
 * Redirects the user to the landing page if certain conditions are met,
 * otherwise proceeds to the next middleware.
 *
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The next middleware function
 */
export const checkPresenterNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer = req.get("Referrer");
    const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    const redirectUrls = [
        getAuthorisedPersonAddedFullUrl(companyNumber),
        getPresenterAlreadyAddedUrl(companyNumber)
    ];

    deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    logger.debug(createLogMessage(req.session, checkPresenterNavigation.name, `checkPresenterNavigation: request to ${req.originalUrl}, calling redirectPage fn`));

    const shouldRedirect = redirectPage(
        referrer,
        getAddPresenterUrl(companyNumber),
        getCheckPresenterUrl(companyNumber),
        pageIndicator,
        redirectUrls
    );

    if (shouldRedirect) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
