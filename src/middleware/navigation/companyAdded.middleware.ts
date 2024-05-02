import { Request, Response, NextFunction } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { getExtraData } from "../../lib/utils/sessionUtils";

export const companyAddedNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const referrer: string | undefined = req.get("Referrer");
    const companyDetailsIndicator = getExtraData(req.session, constants.CONFIRM_COMPANY_DETAILS_INDICATOR);

    if (redirectPage(referrer, constants.YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL, constants.COMPANY_ADDED_SUCCESS_URL, companyDetailsIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
