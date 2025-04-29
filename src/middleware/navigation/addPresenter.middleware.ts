import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { deleteExtraData, getExtraData } from "../../lib/utils/sessionUtils";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger, { createLogMessage } from "../../lib/Logger";
import {
    getAddPresenterUrl,
    getCheckPresenterUrl,
    isReferrerIncludes
} from "../../lib/utils/urlUtils";

/**
 * Middleware to handle navigation for adding a presenter.
 * It checks the referrer, manages session data, and redirects the user
 * to the appropriate page based on the navigation logic.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
export const addPresenterNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const referrer: string | undefined = req.get("Referrer");
        const hrefA = getExtraData(req.session, constants.REFERER_URL);
        const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
        const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

        deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
        deleteExtraData(req.session, constants.USER_EMAILS_ARRAY);

        const checkedReferrer = referrer && isReferrerIncludes(referrer) ? hrefA : referrer;

        logger.debug(createLogMessage(req.session, addPresenterNavigation.name, `addPresenterNavigation: request to ${req.originalUrl}, calling redirectPage fn`));

        const shouldRedirect = redirectPage(
            checkedReferrer,
            hrefA,
            getAddPresenterUrl(companyNumber),
            pageIndicator,
            [getCheckPresenterUrl(companyNumber)]
        );

        if (shouldRedirect) {
            res.redirect(constants.LANDING_URL);
        } else {
            next();
        }
    } catch (error) {
        if (error instanceof Error) {
            logger.error(createLogMessage(req.session, addPresenterNavigation.name, `Error in addPresenterNavigation middleware: ${error.message}`));
        } else {
            logger.error(createLogMessage(req.session, addPresenterNavigation.name, "Error in addPresenterNavigation middleware: An unknown error occurred"));
        }
        next(error);
    }
};
