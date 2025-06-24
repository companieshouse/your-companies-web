import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { getRemoveAuthorisationDoNotRestoreUrl } from "../../lib/utils/urlUtils";
import { setExtraData } from "../../lib/utils/sessionUtils";

/**
 * Middleware to handle navigation logic for removing a user's authorisation from a company.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the stack.
 */
export const removeAuthorisationDoNotRestoreNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer = req.get("Referrer");
    const companyNumber = req.params[constants.COMPANY_NUMBER];
    const removeAuthorisationDoNotRestoreUrl = getRemoveAuthorisationDoNotRestoreUrl(companyNumber);

    setExtraData(req.session, constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL_EXTRA, removeAuthorisationDoNotRestoreUrl);

    if (redirectPage(referrer, constants.LANDING_URL, removeAuthorisationDoNotRestoreUrl, false)) {
        res.redirect(constants.LANDING_URL);
        return;
    }
    next();
};
