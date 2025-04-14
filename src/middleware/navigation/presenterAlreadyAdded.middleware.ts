import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { deleteExtraData, getExtraData } from "../../lib/utils/sessionUtils";
import logger from "../../lib/Logger";
import { getCheckPresenterUrl, getPresenterAlreadyAddedUrl } from "../../lib/utils/urlUtils";

/**
 * Middleware to handle navigation when a presenter has already been added.
 * Redirects to the landing page if the referrer and page indicator match specific conditions.
 * Otherwise, it proceeds to the next middleware.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the stack.
 */
export const presenterAlreadyAddedNavigation = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const referrer = req.get("Referrer");
    const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    logger.debug(`presenterAlreadyAddedNavigation: request to ${req.originalUrl}, calling redirectPage fn`);

    const shouldRedirect = redirectPage(
        referrer,
        getCheckPresenterUrl(companyNumber),
        getPresenterAlreadyAddedUrl(companyNumber),
        pageIndicator
    );

    if (shouldRedirect) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
