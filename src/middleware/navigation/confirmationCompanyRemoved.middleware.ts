import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { getExtraData } from "../../lib/utils/sessionUtils";

/**
 * Middleware to handle navigation after a company has been removed.
 * Redirects to the landing page if the referrer and session data match specific conditions.
 * Otherwise, it proceeds to the next middleware.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the chain.
 */
export const confirmationCompanyRemovedNavigation = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const referrer = req.get("Referrer");
    const sessionHref = getExtraData(req.session, constants.REMOVE_COMPANY_URL_EXTRA);

    const shouldRedirect = redirectPage(
        referrer,
        sessionHref,
        constants.REMOVE_COMPANY_CONFIRMED_URL,
        false
    );

    if (shouldRedirect) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
