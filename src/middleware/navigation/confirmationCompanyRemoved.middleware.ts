import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { getExtraData } from "../../lib/utils/sessionUtils";

export const confirmationCompanyRemovedNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const hrefA = getExtraData(req.session, constants.REMOVE_COMPANY_URL_EXTRA);

    if (redirectPage(referrer, hrefA, constants.REMOVE_COMPANY_CONFIRMED_URL, false)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
