import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { getExtraData } from "../../lib/utils/sessionUtils";

/**
 * Middleware to handle navigation logic for the confirmation authorisation removed page.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the stack.
 */
export const confirmationAuthorisationRemovedNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer = req.get("Referrer");
    const removeAuthorisationDoNotRestoreUrl = getExtraData(req.session, constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL_EXTRA);

    if (redirectPage(referrer, removeAuthorisationDoNotRestoreUrl, constants.CONFIRMATION_AUTHORISATION_REMOVED_URL, false)) {
        res.redirect(constants.LANDING_URL);
        return;
    }
    next();
};
