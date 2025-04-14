import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { setExtraData } from "../../lib/utils/sessionUtils";
import { getRemoveCompanyUrl } from "../../lib/utils/urlUtils";

/**
 * Middleware to handle navigation logic for removing a company.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the stack.
 */
export const removeCompanyNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer = req.get("Referrer");
    const companyNumber = req.params[constants.COMPANY_NUMBER];
    const removeCompanyUrl = getRemoveCompanyUrl(companyNumber);

    setExtraData(req.session, constants.REMOVE_COMPANY_URL_EXTRA, removeCompanyUrl);

    if (redirectPage(referrer, constants.LANDING_URL, removeCompanyUrl, false)) {
        res.redirect(constants.LANDING_URL);
        return;
    }

    next();
};
