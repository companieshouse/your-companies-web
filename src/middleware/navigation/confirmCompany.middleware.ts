import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { redirectPage } from "../../lib/utils/referrerUtils";

export const confirmCompanyNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    if (redirectPage(referrer, constants.ADD_COMPANY_URL, constants.CONFIRM_COMPANY_DETAILS_URL, pageIndicator, constants.COMPANY_ADDED_SUCCESS_URL)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
